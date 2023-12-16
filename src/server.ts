import * as http from 'node:http'
import { downloadVideo, getInfo } from './videos'
import { Message, MessageKinds, urlInfoMessage } from './messages'
import * as process from 'process'

const hostname = '127.0.0.1'
const port = 3000
const downloadDestination = process.argv[2] ?? null

const server = http.createServer((req, res) => {
    const headers = {
        // Taken from https://stackoverflow.com/a/54309023/3129333
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
        'Access-Control-Max-Age': 2592000,
        'Access-Control-Allow-Headers': 'content-type',
    }
    if (req.method === 'OPTIONS') {
        res.writeHead(204, headers)
        res.end()
        return
    }
    if (req.method === 'POST') {
        handleReq(req)
            .catch((e) => {
                res.writeHead(500, headers)
                res.end(JSON.stringify({ error: e.message }))
            })
            .then((result) => {
                res.writeHead(200, headers)
                res.end(JSON.stringify(result))
            })
        return
    }
    res.writeHead(405, headers)
    res.end(`${req.method} is not allowed for the request.`)
})

server.listen(port, hostname, () => {
    console.log(
        `Server running at http://${hostname}:${port}/ Download destination: ${downloadDestination}`,
    )
})

async function handleReq(req: http.IncomingMessage): Promise<Message | null> {
    const text = await requestBody(req)
    const message = JSON.parse(text)
    if (message.kind === MessageKinds.GetUrlInfo) {
        const { title, formats } = await getInfo(message.url)
        return urlInfoMessage(title, formats)
    }
    if (message.kind === MessageKinds.Download) {
        console.log(`Download requested for ${message.id}`)
        downloadVideo(
            message.url,
            message.id,
            downloadDestination,
            message.title,
            message.extension,
        )
            .catch((e) => {
                console.error(`Failed to download ${message.id}: ${e}`)
            })
            .then(() => {
                console.log(`Downloaded ${message.title}`)
            })
        return null
    }
    throw new Error(`Unexpected message kind: ${message.kind}`)
}

async function requestBody(req: http.IncomingMessage): Promise<string> {
    return new Promise((resolve, reject) => {
        let bodyParts: Uint8Array[] = []
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
