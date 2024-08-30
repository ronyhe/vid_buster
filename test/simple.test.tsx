import test from 'node:test'
import { equal } from 'node:assert/strict'
import { add } from './helper'

test('simple test', () => {
    equal(add(1, 3), 4)
})
