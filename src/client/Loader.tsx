import React, { ReactNode, useState } from 'react'
import { Spinner } from './Spinner'

export interface LoaderProps<T> {
    getData(): Promise<T>
    loader?: ReactNode
    createContent(data: T): ReactNode
    createError(err: Error): ReactNode
}

export function Loader<T>({
    getData,
    loader,
    createContent,
    createError,
}: LoaderProps<T>) {
    const [state, setState] = useState<'loading' | 'error' | 'success'>(
        'loading',
    )
    const [data, setData] = useState<T | null>(null)
    const [error, setError] = useState<Error | null>(null)

    React.useEffect(() => {
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

    if (state === 'loading') {
        return loader ?? <Spinner />
    }
    if (state === 'error') {
        return createError(error!)
    }
    return createContent(data!)
}
