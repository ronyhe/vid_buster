import { Format, SingleStatusReport } from './messages'

function clear() {
    document.body.innerHTML = ''
}

export function showInitialPopup(switchToPageHandler: () => void) {
    clear()
    const a = document.createElement('a')
    a.href = '#'
    a.textContent = 'See formats for the video on this page instead'
    a.addEventListener('click', () => {
        switchToPageHandler()
    })

    const status = document.createElement('p')
    status.textContent = 'Fetching reports...'

    document.body.appendChild(a)
    document.body.appendChild(document.createElement('hr'))
    document.body.appendChild(status)
}

export function showReports(
    reports: SingleStatusReport[],
    switchToPageHandler: () => void,
) {
    clear()
    const a = document.createElement('a')
    a.href = '#'
    a.textContent = 'See formats for the video on this page instead'
    a.addEventListener('click', () => {
        switchToPageHandler()
    })
    document.body.appendChild(a)
    document.body.appendChild(document.createElement('hr'))
    if (reports.length === 0) {
        const p = document.createElement('p')
        p.textContent = 'No on-going downloads'
        document.body.appendChild(p)
        return
    }
    for (const { title, status } of reports) {
        const p = document.createElement('p')
        p.textContent = `${title}: ${status}`
        document.body.appendChild(p)
    }
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

export function showFormats(
    title: string | null,
    formats: Format[],
    chooseFormatHandler: (f: Format) => void,
) {
    clear()
    let lastRes = null
    const titleElem = document.createElement('p')
    titleElem.textContent = title ?? 'No title'
    document.body.appendChild(titleElem)
    document.body.appendChild(document.createElement('hr'))
    for (const f of formats) {
        if (lastRes !== null && f.resolution !== lastRes) {
            document.body.appendChild(document.createElement('hr'))
        }
        lastRes = f.resolution
        const a = document.createElement('a')
        a.href = '#'
        a.textContent = formatLinkText(f)
        a.title = f.url
        document.body.appendChild(a)
        a.addEventListener('click', () => {
            chooseFormatHandler(f)
        })
        document.body.appendChild(document.createElement('br'))
    }
}

export function formatLinkText(f: Format): string {
    return [f.size, f.extension, f.resolution, f.note]
        .filter((x) => x !== null)
        .join(' ')
}
