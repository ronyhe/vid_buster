import _assert from 'node:assert/strict'
import _test from 'node:test'

export {
    deepEqual,
    deepStrictEqual,
    doesNotMatch,
    doesNotReject,
    doesNotThrow,
    equal,
    fail,
    ifError,
    match,
    notDeepEqual,
    notDeepStrictEqual,
    notEqual,
    notStrictEqual,
    ok,
    rejects,
    strictEqual,
    throws,
} from 'node:assert/strict'

export function notNull<T>(value: T | null): asserts value is T {
    _assert(value !== null, `Expected value to be not null, got ${value}`)
}

type Assert = typeof _assert

type AssertFn = (...args: Parameters<Assert>) => ReturnType<Assert>

// No eta reduction here, because we don't want to accidentally export the entire `assert` module
// We avoid names like `assert` and `true` to prevent shadowing and avoid confusion
export const correct: AssertFn = (...args) => _assert(...args)

export const test = _test
