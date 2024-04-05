import React, { useEffect } from 'react'
import { UrlInfo } from './messages'
import { getUrlInfo } from './client'

export default function Formats() {
    const [info, setInfo] = React.useState<UrlInfo | null>(null)
    useEffect(() => {
        getUrlInfo().then((info) => {
            setInfo(info)
        })
    }, [])
    if (info === null) {
        return <div>Loading...</div>
    }
    return (
        <div>
            <h1>{info.title}</h1>
            <ul>
                {info.formats.map((f) => (
                    <li key={f.id}>
                        {f.resolution} {f.size} {f.extension}
                    </li>
                ))}
            </ul>
        </div>
    )
}
