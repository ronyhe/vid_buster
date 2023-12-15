import { Format } from './videos'

function clear() {
    document.body.innerHTML = ''
}

export function error(message: string) {
    clear()
    const err = document.createElement('p')
    err.textContent = message
    err.style.color = 'red'
    document.body.appendChild(err)
}

export function status(message: string) {
    clear()
    const err = document.createElement('p')
    err.textContent = message
    document.body.appendChild(err)
}

export function showFormats(formats: Format[]) {
    clear()
    formats.forEach((f) => {
        const a = document.createElement('a')
        a.href = '#'
        a.textContent = formatLinkText(f)
        a.title = f.url
        document.body.appendChild(a)
        document.body.appendChild(document.createElement('br'))
    })
}

function formatLinkText(f: Format): string {
    return [f.size, f.extension, f.resolution, f.note]
        .filter((x) => x !== null)
        .join(' ')
}
