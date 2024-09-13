import React from 'react'
import { test, expect, expectConnected } from './asserts'
import { cleanup, render } from './render'
import { UrlDisplay } from '../src/components/UrlDisplay'
import { UrlInfo } from '../src/messages'

test('UrlDisplay', async (t) => {
    t.afterEach(cleanup)
    await t.test('Shows Loader while loading', async () => {
        const { screen } = render(
            <UrlDisplay
                load={() => new Promise(() => {})}
                onChoose={() => {}}
            />,
        )
        expectConnected(screen.getByRole('progressbar'))
    })

    await t.test('Displays URL after loading', async () => {
        const info: UrlInfo = {
            kind: 'url',
            title: 'Example',
            formats: [],
        }
        const { screen } = render(
            <UrlDisplay load={async () => info} onChoose={() => {}} />,
        )
        await screen.findByText(info.title!)
    })

    await t.test('Displays errors', async () => {
        const e = new Error('Load error')
        const { screen } = render(
            <UrlDisplay
                load={async () => {
                    throw e
                }}
                onChoose={() => {}}
            />,
        )
        // Should we await for something here?
        // await waitFor(() => screen.queryByRole('progressbar') === null)
        const element = await screen.findByText(e.message)
        expectConnected(element)
    })

    await t.test('Calls onChoose when URL is clicked', async (t) => {
        const onChoose = t.mock.fn()
        const info: UrlInfo = {
            kind: 'url',
            title: 'Example',
            formats: [
                {
                    id: '1',
                    url: 'https://example.com',
                    extension: 'mp4',
                    note: 'Note',
                    quality: 8,
                    size: 'Size',
                    resolution: 'Resolution',
                },
            ],
        }
        const { screen, user } = render(
            <UrlDisplay load={async () => info} onChoose={onChoose} />,
        )
        await screen.findByText(info.title!)
        const item = screen.getByRole('button')
        await user.click(item)
        await user.click(screen.getByRole('button', { name: 'Ok' }))

        const format = info.formats[0]
        expect(onChoose).toHaveBeenCalledTimes(1)
        expect(onChoose).toHaveBeenCalledWith(
            format,
            `${info.title}.${format.extension}`,
        )
    })
})
