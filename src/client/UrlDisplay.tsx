import React, { useEffect } from 'react'
import { Format, UrlInfo } from '../messages'
import { useState } from 'react'
import Loader from './Loader'
import FormatList from './FormatList'

export interface UrlDisplayProps {
    load(): Promise<UrlInfo>
    onChoose(format: Format): void
    onErr(message: unknown): void
}

export default function UrlDisplay({ load, onChoose, onErr }: UrlDisplayProps) {
    const [info, setInfo] = useState<UrlInfo | null>(null)
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        ;(async () => {
            try {
                const info = await load()
                setInfo(info)
                setLoading(false)
            } catch (e) {
                onErr(e)
                setLoading(false)
            }
        })()
    }, [])
    if (loading) {
        return <Loader />
    }
    if (!info) {
        return null
    }
    return <FormatList onChoose={onChoose} info={info} />
}
