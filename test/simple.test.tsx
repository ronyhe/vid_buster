import * as React from 'react'
import test from 'node:test'
import { equal } from './asserts'
import { render } from './render'

test('simple test', async (t) => {
    const fn = t.mock.fn()
    const { screen, user } = render(<div onClick={fn}>text</div>)
    await user.click(screen.getByText('text'))
    equal(fn.mock.callCount(), 1)
})
