export function mapValues<A, B>(
    obj: { [key: string]: A },
    fn: (value: A, key: string, coll: { [key: string]: A }) => B
): { [key: string]: B } {
    const result: { [key: string]: B } = {}
    for (const key in obj) {
        result[key] = fn(obj[key], key, obj)
    }
    return result
}

export function ignoreErrors(fn: () => void): void {
    try {
        fn()
    } catch (_e) {
        // ignore
    }
}
