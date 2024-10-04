import React from 'react'
import { test, expect } from './asserts'
import { cleanup, render } from './render'
import { Reports } from '../src/components/Reports'

test('<Reports />', async t => {
    t.afterEach(cleanup)

    await t.test('Calls getReports', async () => {
        const getReports = t.mock.fn(async () => [])
        render(
            <Reports getReports={getReports} interval={0} onDelete={() => {}} />
        )
        expect(getReports).toHaveBeenCalledTimes(1)
    })
})
