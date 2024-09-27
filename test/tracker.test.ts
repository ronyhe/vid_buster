import { Tracker } from '../src/server/tracking'
import { test, expect } from './asserts'
import EventEmitter from 'node:events'
import { TrackingReport } from '../src/messages'

function setupTracker() {
    const tracker = new Tracker()
    const stdout = new EventEmitter()
    const stderr = new EventEmitter()
    const proc = { stdout, stderr, kill: () => {} }
    const id = tracker.track('title', proc)
    const details = { title: 'title', id }
    const expectStatus = (status: Partial<TrackingReport>) => {
        expect(tracker.getStatus()).toEqual([
            expect.objectContaining({ ...status, ...details })
        ])
    }
    const checkRemoval = () => {
        tracker.delete(id)
        expect(tracker.getStatus()).toEqual([])
    }
    return { stdout, expectStatus, stderr, testRemoval: checkRemoval }
}

test('Tracker', async t => {
    await t.test('tracks the latest status', () => {
        const { stdout, expectStatus } = setupTracker()
        const line1 = 'stdout line 1'
        const line2 = 'stdout line 2'

        stdout.emit('line', line1)
        expectStatus({ lastStatus: line1 })

        stdout.emit('line', line2)
        expectStatus({ lastStatus: line2 })
    })

    await t.test('tracks closing', () => {
        const { stdout, expectStatus } = setupTracker()
        stdout.emit('close')
        expectStatus({ closed: true })
    })

    await t.test('tracks closing', () => {
        const { stdout, expectStatus } = setupTracker()
        stdout.emit('close')
        expectStatus({ closed: true })
    })

    await t.test('tracks errors and considers them a `close` event', () => {
        const { stderr, expectStatus } = setupTracker()
        const error = 'stderr error'
        stderr.emit('line', error)
        expectStatus({ error, closed: true })
    })

    await t.test('deletes a tracking report', () => {
        const { stdout, expectStatus } = setupTracker()
        stdout.emit('close')
        expectStatus({ closed: true })
    })

    await t.test('deletes a tracking report', () => {
        const { testRemoval } = setupTracker()
        testRemoval()
    })
})
