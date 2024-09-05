export function mapValues<A, B>(
    obj: { [key: string]: A },
    fn: (value: A, key: string, coll: { [key: string]: A }) => B,
): { [key: string]: B } {
    return Object.fromEntries(
        Object.entries(obj).map(([key, value]) => [key, fn(value, key, obj)]),
    )
}
