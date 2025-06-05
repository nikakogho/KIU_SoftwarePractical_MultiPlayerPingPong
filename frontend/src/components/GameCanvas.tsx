import { useEffect, useRef } from 'react'
import type { GameState } from '../types'

interface Props {
  state: GameState | null
  width?: number
  height?: number
  onMouseMove?: (e: React.MouseEvent<HTMLCanvasElement>) => void
}

export function GameCanvas({ state, width = 100, height = 100, onMouseMove }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, width, height)
    if (!state) return
    ctx.fillStyle = 'white'
    const paddleWidth = 20
    const paddleHeight = 4
    ctx.fillRect(state.paddles.top.x - paddleWidth / 2, 0, paddleWidth, paddleHeight)
    ctx.fillRect(
      state.paddles.bottom.x - paddleWidth / 2,
      height - paddleHeight,
      paddleWidth,
      paddleHeight
    )
    const radius = 3
    ctx.beginPath()
    ctx.arc(state.ball.x, state.ball.y, radius, 0, Math.PI * 2)
    ctx.fill()
  }, [state, width, height])

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      onMouseMove={onMouseMove}
      style={{ border: '1px solid white', touchAction: 'none' }}
    />
  )
}
