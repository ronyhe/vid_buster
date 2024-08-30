import * as React from 'react'
import test from 'node:test'
import { equal } from './asserts'
import { render } from './render'
import App from '../src/client/App'

test('App has 3 tabs', async () => {
    const { screen } = render(
        <App url="https://www.youtube.com/watch?v=Dwxv9ydfhBY&ab_channel=HeatCheck" />,
    )
    const tabs = screen.getAllByRole('tab')
    equal(tabs.length, 3)
    equal(tabs[0].textContent, 'Here')
    equal(tabs[1].textContent, 'Downloads')
    equal(tabs[2].textContent, 'Url')
})