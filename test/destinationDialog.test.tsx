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

    await t.test('Calls onClose with null', async () => {
        const onClose = t.mock.fn()
        const { screen, user } = render(
            <DestinationDialog open={true} onClose={onClose} />,
        )
        await user.click(screen.getByRole('button', { name: 'Cancel' }))
        correct(onClose.mock.calls[0].arguments[0] === null)
    })

    await t.test('Calls onClose with value', async () => {
        const onClose = t.mock.fn()
        const { screen, user } = render(
            <DestinationDialog open={true} onClose={onClose} />,
        )
        await user.click(screen.getByRole('button', { name: 'Ok' }))
        correct(onClose.mock.calls[0].arguments[0] === 'no-title')
    })

    await t.test('Calls onClose with user-provided file name', async () => {
        const onClose = t.mock.fn()
        const userFileName = 'user-file-name.mp4'
        const { screen, user } = render(
            <DestinationDialog open={true} onClose={onClose} />,
        )
        await user.keyboard(userFileName)
        await user.click(screen.getByRole('button', { name: 'Ok' }))
        correct(onClose.mock.calls[0].arguments[0] === userFileName)
    })

    await t.test('Respects the Escape key', async () => {
        const onClose = t.mock.fn()
        const { user } = render(
            <DestinationDialog open={true} onClose={onClose} />,
        )
        await user.keyboard('{Escape}')
        correct(onClose.mock.calls[0].arguments[0] === null)
    })

    await t.test('Respects the Enter key', async () => {
        const onClose = t.mock.fn()
        const { user } = render(
            <DestinationDialog
                open={true}
                onClose={onClose}
                extension={'mp4'}
            />,
        )
        await user.keyboard('a{Enter}')
        correct(onClose.mock.calls[0].arguments[0] === 'a.mp4')
    })
})
