/** @vitest-environment jsdom */
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ScoreBoard } from './ScoreBoard'

describe('ScoreBoard', () => {
  it('renders current score', () => {
    render(<ScoreBoard score={{ top: 1, bottom: 2 }} />)
    expect(screen.getByTestId('scoreboard').textContent).toBe('1 - 2')
  })
})
