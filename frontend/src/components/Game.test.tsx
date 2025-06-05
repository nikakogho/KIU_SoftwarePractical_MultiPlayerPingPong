/** @vitest-environment jsdom */
import { describe, it, expect, vi } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { Game } from './Game'
import type { GameState } from '../types'

const mockHandlers: Record<string, any> = {}

vi.mock('../api', () => {
  return {
    connectToRoom: vi.fn(() => ({
      on: (event: string, cb: any) => { mockHandlers[event] = cb },
      emit: vi.fn(),
      disconnect: vi.fn()
    })),
    sendMove: vi.fn(),
    pingSession: vi.fn().mockResolvedValue(undefined)
  }
})

const { pingSession } = await import('../api')

describe('Game component', () => {
  it('pings session and shows scoreboard', () => {
    // mock canvas
    Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
      value: vi.fn(() => ({
        fillRect: vi.fn(),
        fillStyle: '',
        beginPath: vi.fn(),
        arc: vi.fn(),
        fill: vi.fn(),
      })),
    })
    vi.useFakeTimers()
    render(<Game roomId="r1" playerId="p1" />)
    act(() => {
      vi.advanceTimersByTime(5000)
    })
    expect(pingSession).toHaveBeenCalled()

    const state: GameState = {
      ball: { x: 0, y: 0, vx: 0, vy: 0 },
      paddles: { top: { x: 0 }, bottom: { x: 0 } },
      score: { top: 1, bottom: 3 }
    }
    act(() => {
      mockHandlers['state'](state)
    })
    expect(screen.getByTestId('scoreboard').textContent).toBe('1 - 3')
    vi.useRealTimers()
  })
})
