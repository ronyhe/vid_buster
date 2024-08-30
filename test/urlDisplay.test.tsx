import React from 'react'
import { test, ok, correct, equal } from './asserts'
import { render } from './render'
import UrlDisplay from '../src/client/UrlDisplay'
import { UrlInfo } from '../src/messages'
import { findByText, waitFor } from '@testing-library/dom'

test('UrlDisplay shows the url', async (t) => {
    await t.test('Shows Loader while loading', async () => {
        const { screen } = render(
            <UrlDisplay
                load={() => new Promise(() => {})}
                onChoose={() => {}}
                onErr={() => {}}
            />,
        )
        ok(screen.getByRole('progressbar'))
    })

    await t.test('Displays URL after loading', { skip: true }, async () => {
        const info: UrlInfo = {
            kind: 'url',
            title: 'Example',
            formats: [],
        }
        const { screen } = render(
            <UrlDisplay
                load={async () => info}
                onChoose={() => {}}
                onErr={() => {}}
            />,
        )
        await screen.findByText(info.title!)
    })

    await t.test('Calls onErr on load error', async (t) => {
        const e = new Error('Load error')
        const onErr = t.mock.fn()
        const { screen } = render(
            <UrlDisplay
                load={async () => {
                    throw e
                }}
                onChoose={() => {}}
                onErr={onErr}
            />,
        )
        await waitFor(() => screen.queryByRole('progressbar') === null)
        correct(onErr.mock.calls.at(0)!.arguments[0].message === 'Load error')
    })

    await t.test(
        'Calls onChoose when URL is clicked',
        { only: true },
        async (t) => {
            const url = 'http://example.com'
            const onChoose = t.mock.fn()
            const info: UrlInfo = {
                kind: 'url',
                title: 'Example',
                formats: [
                    {
                        id: '1',
                        url,
                        extension: 'mp4',
                        note: 'Note',
                        quality: 'Quality',
                        size: 'Size',
                        resolution: 'Resolution',
                    },
                ],
            }
            const { screen, user } = render(
                <UrlDisplay
                    load={async () => info}
                    onChoose={onChoose}
                    onErr={() => {}}
                />,
            )
            await screen.findByText(info.title!)
            const item = screen.getByRole('button')
            await user.click(item)
            equal(
                onChoose.mock.calls.at(0)!.arguments[0]!.id,
                info.formats[0].id,
            )
        },
    )
})
