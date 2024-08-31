import * as http from 'node:http'
import { downloadVideo, getInfo } from './videos'
import {
    isDownloadMessage,
    isGetStatusMessage,
    isGetUrlInfoMessage,
    Message,
    statusMessage,
    urlInfoMessage,
} from '../messages'
import * as process from 'process'
import { Tracker } from './status'

const hostname = '127.0.0.1'
const port = 3000
const downloadDestination = process.argv[2] ?? null

const tracker = new Tracker()

const server = http.createServer((req, res) => {
    const headers = {
        // Taken from https://stackoverflow.com/a/54309023/3129333
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
        'Access-Control-Max-Age': 2592000,
        'Access-Control-Allow-Headers': 'content-type',
    }
    const method = req.method
    if (method === 'OPTIONS') {
        res.writeHead(204, headers)
        res.end()
        return
    }
    if (method === 'POST') {
        handleReq(req)
            .then((result) => {
                res.writeHead(200, headers)
                res.end(JSON.stringify(result ?? {}))
            })
            .catch((e) => {
                res.writeHead(500, headers)
                res.end(JSON.stringify({ error: e.message }))
            })
        return
    }
    res.writeHead(405, headers)
    res.end(`${method} is not allowed for the request.`)
})

server.listen(port, hostname, () => {
    console.log(
        `Server running at http://${hostname}:${port}/ Download destination: ${downloadDestination}`,
    )
})

async function handleReq(req: http.IncomingMessage): Promise<Message | null> {
    const text = await requestBody(req)
    const message = JSON.parse(text)
    if (isGetUrlInfoMessage(message)) {
        const { title, formats } = await getInfo(message.url)
        return urlInfoMessage(title, formats)
    }
    if (isDownloadMessage(message)) {
        console.log(`Download requested for ${message.url}`)
        const readline = downloadVideo(
            message.url,
            message.format_id,
            downloadDestination,
            message.filename,
        )
        tracker.track(message.url, readline)
        return null
    }
    if (isGetStatusMessage(message)) {
        return statusMessage(tracker.getReports())
    }
    throw new Error(`Unexpected message kind: ${message.kind}`)
}

async function requestBody(req: http.IncomingMessage): Promise<string> {
    return new Promise((resolve, reject) => {
        const bodyParts: Uint8Array[] = []
        req.on('error', (err) => {
            reject(err)
        })
        req.on('data', (chunk) => {
            bodyParts.push(chunk)
        })
        req.on('end', () => {
            resolve(Buffer.concat(bodyParts).toString())
        })
    })
}
