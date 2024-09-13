import React from 'react'
import { test, expectConnected } from './asserts'
import { cleanup, render } from './render'
import { CustomUrl } from '../src/components/CustomUrl'
import { urlInfoMessage } from '../src/messages'

test('<CustomUrl />', async (t) => {
    t.afterEach(cleanup)

    await t.test('Basic', async () => {
        const onChoose = t.mock.fn()
        const getUrlInfo = t.mock.fn(() =>
            Promise.resolve(
                urlInfoMessage('title', [
                    {
                        id: '1',
                        url: 'https://example.com',
                        extension: 'mp4',
                        note: 'Note',
                        size: 'Size',
                        resolution: 'Resolution',
                    },
                ]),
            ),
        )
        const { screen } = render(
            <CustomUrl getUrlInfo={getUrlInfo} onChoose={onChoose} />,
        )
        expectConnected(screen.getByRole('textbox'))
    })
})
