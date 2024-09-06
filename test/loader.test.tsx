import React from 'react'
import { ok, test, expect } from './asserts'
import { render, cleanup } from './render'
import { Loader } from '../src/client/Loader'

test('Loader', async (t) => {
    t.afterEach(cleanup)

    await t.test('Shows loader while loading', async () => {
        const { screen } = render(
            <Loader
                getData={() => new Promise(() => {})}
                createContent={() => <div />}
                createError={() => <div />}
                loader={<div>Loader</div>}
            />,
        )
        ok(screen.getByText('Loader'))
    })

    await t.test('Hides loader after loading', async () => {
        const { screen } = render(
            <Loader
                getData={() => Promise.resolve('data')}
                createContent={(data) => <div>{data}</div>}
                createError={() => <div />}
                loader={<div>Loader</div>}
            />,
        )
        await screen.findByText('data')
        expect(screen.queryByText('Loader')).toBeNull()
    })

    await t.test('Shows error message on error', async () => {
        const { screen } = render(
            <Loader
                getData={() => Promise.reject(new Error('error'))}
                createContent={() => <div />}
                createError={(error) => <div>{error.message}</div>}
                loader={<div>Loader</div>}
            />,
        )
        await screen.findByText('error')
    })

    await t.test('Content is displayed after loading', async (t) => {
        const getData = t.mock.fn(() => Promise.resolve('data'))
        const { screen } = render(
            <Loader
                getData={getData}
                createContent={(data) => <div>{data}</div>}
                createError={() => <div />}
                loader={<div>Loader</div>}
            />,
        )
        await screen.findByText('data')
        expect(screen.queryByText('Loader')).toBeNull()
        expect(getData).toHaveBeenCalledTimes(1)
    })
})