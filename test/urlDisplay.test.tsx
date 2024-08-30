import React from 'react'
import { test, ok, equal } from './asserts'
import { render } from './render'
import UrlDisplay from '../src/client/UrlDisplay'
import { UrlInfo } from '../src/messages'
import { waitFor } from '@testing-library/dom'

test('UrlDisplay', async (t) => {
    await t.test('Shows Loader while loading', async () => {
        const { screen } = render(
            <UrlDisplay
                load={() => new Promise(() => {})}
                onChoose={() => {}}
            />,
        )
        ok(screen.getByRole('progressbar'))
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
        await waitFor(() => screen.queryByRole('progressbar') === null)
        const element = await screen.findByText(e.message)
        ok(element)
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
                    quality: 'Quality',
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
        equal(onChoose.mock.calls.at(0)!.arguments[0]!.id, info.formats[0].id)
    })
})
