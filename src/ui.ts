import { Format } from './videos'

export function clear() {
    document.body.innerHTML = ''
}

export function error(message: string) {
    const err = document.createElement('p')
    err.textContent = message
    err.style.color = 'red'
    document.body.appendChild(err)
}

export function status(message: string) {
    const err = document.createElement('p')
    err.textContent = message
    document.body.appendChild(err)
}

export function showFormats(formats: Format[]) {
    const ul = document.createElement('ul')
    formats.forEach((f) => {
        const li = document.createElement('li')
        const a = document.createElement('a')
        a.href = '#'
        a.textContent = `${f.note} ${f.resolution}`
        li.appendChild(a)
        ul.appendChild(li)
    })
    document.body.appendChild(ul)
}
