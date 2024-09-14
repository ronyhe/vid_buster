import React from 'react'
import { test, expect, expectConnected } from './asserts'
import { render, cleanup } from './render'
import { DestinationDialog } from '../src/components/DestinationDialog'

test('<DestinationDialog />', async (t) => {
    t.afterEach(cleanup)
    await t.test('Does not render when not open', async () => {
        const { screen } = render(
            <DestinationDialog open={false} onClose={() => {}} />,
        )
        const dialog = screen.queryByRole('dialog')
        expect(dialog).toBeNull()
    })

    await t.test('Renders', () => {
        const { screen } = render(
            <DestinationDialog open={true} onClose={() => {}} />,
        )
        const dialog = screen.queryByRole('dialog')
        expectConnected(dialog)
    })

    await t.test('Calls onClose', async () => {
        const onClose = t.mock.fn()
        const { screen, user } = render(
            <DestinationDialog open={true} onClose={onClose} />,
        )
        await user.click(screen.getByRole('button', { name: 'Cancel' }))
    })

    await t.test('Calls onClose with null', async () => {
        const onClose = t.mock.fn()
        const { screen, user } = render(
            <DestinationDialog open={true} onClose={onClose} />,
        )
        await user.click(screen.getByRole('button', { name: 'Cancel' }))
        expect(onClose).toHaveBeenCalledWith(null)
    })

    await t.test('Calls onClose with value', async () => {
        const onClose = t.mock.fn()
        const { screen, user } = render(
            <DestinationDialog open={true} onClose={onClose} />,
        )
        await user.click(screen.getByRole('button', { name: 'Ok' }))
        expect(onClose).toHaveBeenCalledWith('no-title')
    })

    await t.test('Calls onClose with user-provided file name', async () => {
        const onClose = t.mock.fn()
        const userFileName = 'user-file-name.mp4'
        const { screen, user } = render(
            <DestinationDialog open={true} onClose={onClose} />,
        )
        await user.keyboard(userFileName)
        await user.click(screen.getByRole('button', { name: 'Ok' }))
        expect(onClose).toHaveBeenCalledWith(userFileName)
    })

    await t.test('Respects the Escape key', async () => {
        const onClose = t.mock.fn()
        const { user } = render(
            <DestinationDialog open={true} onClose={onClose} />,
        )
        await user.keyboard('{Escape}')
        expect(onClose).toHaveBeenCalledWith(null)
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
        expect(onClose).toHaveBeenCalledWith('a.mp4')
    })
})
