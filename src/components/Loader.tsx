import React, { ReactNode, useCallback, useEffect, useState } from 'react'
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

    const fetchData = useCallback(async () => {
        if (state === 'error') {
            return
        }
        try {
            const d = await getData()
            setData(d)
            setState('success')
        } catch (e) {
            setError(e as Error)
            setState('error')
        }
    }, [getData, state, setState, setError])

    useEffect(() => {
        fetchData()
    }, [])

    if (interval !== undefined) {
        useEffect(() => {
            const id = setInterval(fetchData, interval)
            return () => clearInterval(id)
        }, [fetchData, interval])
    }

    if (state === 'loading') {
        return loader ?? <Spinner />
    }
    if (state === 'error') {
        return createError(error!)
    }
    return createContent(data!)
}
