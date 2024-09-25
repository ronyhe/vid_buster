import { Tracker } from '../src/server/tracking'
import { test, expect } from './asserts'
import EventEmitter from 'node:events'

test('Tracker', t => {
    t.test('tracks the latest status', () => {
        const tracker = new Tracker()
        const stdout = new EventEmitter()
        const stderr = new EventEmitter()
        const streams = {
            stdout,
            stderr
        }
        const id = tracker.track('title', streams)
        const details = {
            title: 'title',
            id
        }
        const line1 = 'stdout line 1'
        stdout.emit('line', line1)
        expect(tracker.getStatus()).toEqual([
            expect.objectContaining({
                lastStatus: line1,
                ...details
            })
        ])
        const line2 = 'stdout line 2'
        stdout.emit('line', line2)
        expect(tracker.getStatus()).toEqual([
            expect.objectContaining({
                lastStatus: line2,
                ...details
            })
        ])
    })
})
