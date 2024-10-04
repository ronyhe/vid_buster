import React, { ReactNode, useEffect, useState } from 'react'
import { Spinner } from './Spinner'

export interface LoaderProps<T> {
    getData(): Promise<T>
    loader?: ReactNode
    createContent(data: T): ReactNode
    createError(err: Error): ReactNode
    interval?: number
}

export function Loader<T>({
    getData,
    loader,
    createContent,
    createError,
    interval
}: LoaderProps<T>) {
    const [state, setState] = useState<'loading' | 'error' | 'success'>(
        'loading'
    )
    const [data, setData] = useState<T | null>(null)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        ;(async () => {
            try {
                const d = await getData()
                setData(d)
                setState('success')
            } catch (e) {
                setError(e as Error)
                setState('error')
            }
        })()
    }, [])

    if (interval !== undefined) {
        useEffect(() => {
            if (interval !== undefined) {
                const handle = setInterval(async () => {
                    try {
                        const d = await getData()
                        setData(d)
                        setState('success')
                    } catch (e) {
                        setError(e as Error)
                        setState('error')
                    }
                }, interval)
                return () => clearInterval(handle)
            }
        }, [])
    }

    if (state === 'loading') {
        return loader ?? <Spinner />
    }
    if (state === 'error') {
        return createError(error!)
    }
    return createContent(data!)
}
