import * as http from 'node:http'
import { getFormats } from './videos'
import { MessageKinds } from './messages'

const hostname = '127.0.0.1'
const port = 3000

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
    console.log(`Server running at http://${hostname}:${port}/`)
})

async function handleReq(req: http.IncomingMessage): Promise<any> {
    const text = await requestBody(req)
    const message = JSON.parse(text)
    if (message.kind === MessageKinds.GetUrlInfo) {
        return {
            kind: MessageKinds.UrlInfo,
            formats: await getFormats(message.url),
        }
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
