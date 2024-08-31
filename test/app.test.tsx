import * as React from 'react'
import test from 'node:test'
import { equal } from './asserts'
import { cleanup, render } from './render'
import App from '../src/client/App'

test('App', async (t) => {
    t.afterEach(cleanup)
    await t.test('Has three tabs', () => {
        const { screen } = render(
            <App url="https://www.youtube.com/watch?v=Dwxv9ydfhBY&ab_channel=HeatCheck" />,
        )
        const tabs = screen.getAllByRole('tab')
        equal(tabs.length, 3)
        equal(tabs[0].textContent, 'Here')
        equal(tabs[1].textContent, 'Downloads')
        equal(tabs[2].textContent, 'Url')
    })
})
