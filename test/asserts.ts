import _assert from 'node:assert/strict'
import _test, { Mock } from 'node:test'
import _expect from 'expect'
// This work around, and the corresponding `postinstall` script in `package.json will not be necessary once
// https://github.com/jestjs/jest/pull/15288 is merged and released
// @ts-expect-error - an unexported JS file
import spyMatchers from 'expect/build/spyMatchers'
import { mapValues } from '../src/utils'

_expect.extend(
    mapValues(spyMatchers, matcher => {
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

export function expectConnected(element: HTMLElement | null) {
    _expect(element).toBeTruthy()
    _expect(element!.isConnected).toBeTruthy()
}

export const test = _test

export const expect = _expect
