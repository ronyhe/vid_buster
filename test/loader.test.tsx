import React from 'react'
import { test, expect } from './asserts'
import { render, cleanup } from './render'
import { Loader } from '../src/components/Loader'

test('<Loader />', async t => {
    t.afterEach(cleanup)

    await t.test('Shows loader while loading', async () => {
        const { screen } = render(
            <Loader
                getData={() => new Promise(() => {})}
                createContent={() => <div />}
                createError={() => <div />}
                loader={<div>Loader</div>}
            />
        )
        expect(screen.getByText('Loader')).toBeInTheDocument()
    })

    await t.test('Hides loader after loading', async () => {
        const { screen } = render(
            <Loader
                getData={() => Promise.resolve('data')}
                createContent={data => <div>{data}</div>}
                createError={() => <div />}
                loader={<div>Loader</div>}
            />
        )
        await screen.findByText('data')
        expect(screen.queryByText('Loader')).toBeNull()
    })

    await t.test('Shows error message on error', async () => {
        const { screen } = render(
            <Loader
                getData={() => Promise.reject(new Error('error'))}
                createContent={() => <div />}
                createError={error => <div>{error.message}</div>}
                loader={<div>Loader</div>}
            />
        )
        await screen.findByText('error')
    })

    await t.test('Content is displayed after loading', async t => {
        const getData = t.mock.fn(() => Promise.resolve('data'))
        const { screen } = render(
            <Loader
                getData={getData}
                createContent={data => <div>{data}</div>}
                createError={() => <div />}
                loader={<div>Loader</div>}
            />
        )
        await screen.findByText('data')
        expect(screen.queryByText('Loader')).toBeNull()
        expect(getData).toHaveBeenCalledTimes(1)
    })

    await t.test('Calls getData at regular intervals', async t => {
        t.mock.timers.enable(['setInterval'])
        const getData = t.mock.fn(async () => {})
        render(
            <Loader
                getData={getData}
                createContent={() => <div />}
                createError={() => <div />}
                loader={<div>Loader</div>}
                interval={100}
            />
        )
        expect(getData).toHaveBeenCalledTimes(1)
        t.mock.timers.tick(100)
        expect(getData).toHaveBeenCalledTimes(2)
    })

    await t.test('Goes to the error state on polling error', async t => {
        t.mock.timers.enable(['setInterval'])
        const getData = t.mock.fn(async () => {
            if (getData.mock.calls.length >= 0) {
                throw new Error('error')
            }
        })
        const { screen } = render(
            <Loader
                getData={getData}
                createContent={() => <div />}
                createError={error => <div>{error.message}</div>}
                loader={<div>Loader</div>}
                interval={100}
            />
        )
        expect(getData).toHaveBeenCalledTimes(1)
        t.mock.timers.tick(100)
        expect(getData).toHaveBeenCalledTimes(2)
        await screen.findByText('error')
        const calls = getData.mock.calls.length
        t.mock.timers.tick(100)
        t.mock.timers.tick(100)
        expect(getData).toHaveBeenCalledTimes(calls)
    })
})
