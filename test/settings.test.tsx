import React from 'react'
import { test, expect } from './asserts'
import { cleanup, render } from './render'
import { Settings } from '../src/components/Settings'

test('<Settings />', async t => {
    t.afterEach(cleanup)

    await t.test('Displays settings after loading', async () => {
        const settings = { downloadDirectory: '/path/to/download' }
        const { screen } = render(
            <Settings
                getSettings={() => Promise.resolve(settings)}
                updateSettings={() => Promise.resolve()}
            />,
        )
        await screen.findByDisplayValue(settings.downloadDirectory)
    })

    await t.test('Displays error message on error', async () => {
        const { screen } = render(
            <Settings
                getSettings={() =>
                    Promise.reject(new Error('Error loading settings'))
                }
                updateSettings={() => Promise.resolve()}
            />,
        )
        await screen.findByText('Error loading settings')
    })

    await t.test(
        'Calls updateSettings when save button is clicked',
        async t => {
            const updateSettings = t.mock.fn(() => Promise.resolve())
            const settings = { downloadDirectory: '/path/to/download' }
            const { screen, user } = render(
                <Settings
                    getSettings={() => Promise.resolve(settings)}
                    updateSettings={updateSettings}
                />,
            )
            await screen.findByDisplayValue(settings.downloadDirectory)
            const saveButton = screen.getByText('Save')
            await user.click(saveButton)
            expect(updateSettings).toHaveBeenCalledTimes(1)
        },
    )

    await t.test('Displays an error if updateSettings fails', async () => {
        const { screen, user } = render(
            <Settings
                getSettings={() =>
                    Promise.resolve({ downloadDirectory: '/tmp' })
                }
                updateSettings={() =>
                    Promise.reject(new Error('Error saving settings'))
                }
            />,
        )
        const saveButton = await screen.findByText('Save')
        await user.click(saveButton)
        await screen.findByText('Error saving settings')
    })

    await t.test('Triggers the update on Enter key', async t => {
        const updateSettings = t.mock.fn(() => Promise.resolve())
        const settings = { downloadDirectory: '/path/to/download' }
        const { screen, user } = render(
            <Settings
                getSettings={() => Promise.resolve(settings)}
                updateSettings={updateSettings}
            />,
        )
        await screen.findByDisplayValue(settings.downloadDirectory)
        await user.keyboard('{Enter}')
        expect(updateSettings).toHaveBeenCalledTimes(1)
    })
})
