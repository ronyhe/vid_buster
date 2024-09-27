import * as http from 'node:http'
import { downloadVideo, getInfo } from './videos'
import * as messages from '../messages'
import { Tracker } from './tracking'

const hostname = '127.0.0.1'
const port = 3000
const tracker = new Tracker()

const server = http.createServer((req, res) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
        'Access-Control-Max-Age': 2592000,
        'Access-Control-Allow-Headers': 'content-type'
    }
    const method = req.method
    if (method === 'OPTIONS') {
        res.writeHead(204, headers)
        res.end()
        return
    }
    if (method === 'POST') {
        handleReq(req)
            .then(result => {
                res.writeHead(200, headers)
                res.end(JSON.stringify(result ?? {}))
            })
            .catch(e => {
                res.writeHead(500, headers)
                res.end(JSON.stringify({ error: e.message }))
            })
        return
    }
    res.writeHead(405, headers)
    res.end(`${method} is not allowed for the request.`)
})

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`)
})

async function handleReq(
    req: http.IncomingMessage
): Promise<messages.Message | null> {
    const text = await requestBody(req)
    const message = JSON.parse(text)
    if (messages.isRequestUrlInfoMessage(message)) {
        const { title, formats } = await getInfo(message.url)
        return messages.createResponseUrlInfoMessage(title, formats)
    }
    if (messages.isRequestDownloadMessage(message)) {
        const readline = downloadVideo(
            message.url,
            message.format_id,
            message.destination,
            message.filename
        )
        tracker.track(message.filename, readline)
        return null
    }
    if (messages.isRequestReportsMessage(message)) {
        return messages.createResponseReportsMessage(tracker.getStatus())
    }
    if (messages.isRequestDeleteMessage(message)) {
        tracker.delete(message.id)
        return null
    }
    throw new Error(`Unexpected message kind: ${message.kind}`)
}

async function requestBody(req: http.IncomingMessage): Promise<string> {
    return new Promise((resolve, reject) => {
        const bodyParts: Uint8Array[] = []
        req.on('error', err => {
            reject(err)
        })
        req.on('data', chunk => {
            bodyParts.push(chunk)
        })
        req.on('end', () => {
            resolve(Buffer.concat(bodyParts).toString())
        })
    })
}
