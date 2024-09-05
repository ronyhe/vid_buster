import _assert from 'node:assert/strict'
import _test, { Mock } from 'node:test'
import _expect from 'expect'
// This work around, and the corresponding `postinstall` script in `package.json will not be necessary once
// https://github.com/jestjs/jest/pull/15288 is merged and released
// @ts-expect-error - an unexported JS file
import spyMatchers from 'expect/build/spyMatchers'
import { mapValues } from '../src/utils'

_expect.extend(
    mapValues(spyMatchers, (matcher) => {
        return function (received, ...args) {
            received.calls = {
                all() {
                    return received.mock.calls.map(
                        (c: Mock<typeof received>) => ({
                            args: c.arguments,
                        }),
                    )
                },
                count() {
                    return received.mock.calls.length
                },
            }

            // @ts-expect-error - unexported JS file
            return matcher.call(this, received, ...args)
        }
    }),
)

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

export const expect = _expect
