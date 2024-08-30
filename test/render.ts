import 'global-jsdom/register'
import { ReactNode } from 'react'
import { render as baseRender, screen } from '@testing-library/react'
import userEvent, { UserEvent } from '@testing-library/user-event'

export type Screen = typeof screen

interface TestSetup {
    screen: Screen
    user: UserEvent
}

export function render(ui: ReactNode): TestSetup {
    baseRender(ui)
    return {
        screen,
        user: userEvent.setup(),
    }
}
