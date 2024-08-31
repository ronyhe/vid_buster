import React from 'react'
import { correct, ok, test } from './asserts'
import { render, cleanup } from './render'
import DestinationDialog from '../src/client/DestinationDialog'

test('DestinationDialog', async (t) => {
    t.afterEach(cleanup)
    await t.test('Does not render when not open', async () => {
        const { screen } = render(
            <DestinationDialog open={false} onClose={() => {}} />,
        )
        const dialog = screen.queryByRole('dialog')
        correct(dialog === null)
    })

    await t.test('Renders', () => {
        const { screen } = render(
            <DestinationDialog open={true} onClose={() => {}} />,
        )
        const dialog = screen.queryByRole('dialog')
        ok(dialog)
    })

    await t.test('Calls onClose', async () => {
        const onClose = t.mock.fn()
        const { screen, user } = render(
            <DestinationDialog open={true} onClose={onClose} />,
        )
        await user.click(screen.getByRole('button', { name: 'Cancel' }))
        correct(onClose.mock.callCount() === 1)
    })
})
