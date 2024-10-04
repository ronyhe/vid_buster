import React from 'react'
import { test, expect } from './asserts'
import { cleanup, render } from './render'
import { Reports } from '../src/components/Reports'

test('<Reports />', async t => {
    t.afterEach(cleanup)
    await t.test('Calls onDelete', async t => {
        const getReports = t.mock.fn(async () => [
            {
                id: 1,
                closed: false,
                error: null,
                lastStatus: 'active',
                title: 'Report Title'
            }
        ])
        const onDelete = t.mock.fn()
        const { screen, user } = render(
            <Reports getReports={getReports} interval={0} onDelete={onDelete} />
        )
        const button = await screen.findByRole('button')
        await user.click(button)
        expect(onDelete).toHaveBeenCalledWith(1)
        expect(onDelete).toHaveBeenCalledTimes(1)
    })
})
