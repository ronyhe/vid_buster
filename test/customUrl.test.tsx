import React from 'react'
import { test, expect } from './asserts'
import { cleanup, render } from './render'
import { CustomUrl } from '../src/components/CustomUrl'
import { urlInfoMessage } from '../src/messages'

test('<CustomUrl />', async t => {
    t.afterEach(cleanup)

    await t.test('Calls onChoose', async () => {
        const onChoose = t.mock.fn()
        const getUrlInfo = createGetInfo()
        const { screen, user } = render(
            <CustomUrl getUrlInfo={getUrlInfo} onChoose={onChoose} />,
        )
        const url = 'https://example.com'
        const textbox = screen.getByRole('textbox')
        await user.type(textbox, url)
        await user.click(screen.getByRole('button', { name: 'GO' }))
        expect(getUrlInfo).toHaveBeenCalledWith(url)
    })

    await t.test('Respect the Enter key', async () => {
        const onChoose = t.mock.fn()
        const getUrlInfo = createGetInfo()
        const { screen, user } = render(
            <CustomUrl getUrlInfo={getUrlInfo} onChoose={onChoose} />,
        )
        const url = 'https://example.com'
        const textbox = screen.getByRole('textbox')
        await user.type(textbox, `${url}{Enter}`)
        expect(getUrlInfo).toHaveBeenCalledWith(url)
    })

    function createGetInfo() {
        return t.mock.fn(() =>
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
    }
})
