import { useEffect, useRef, useState } from 'react'
import { connectToRoom, sendMove } from '../api'
import type { GameState } from '../types'
import { GameCanvas } from './GameCanvas'
import type { Socket } from 'socket.io-client'

export function Game({ roomId, playerId }: { roomId: string; playerId: string }) {
  const [state, setState] = useState<GameState | null>(null)
  const socketRef = useRef<Socket | null>(null)
  const mouseX = useRef(0)
  const [winner, setWinner] = useState<string | null>(null)

  useEffect(() => {
    const socket = connectToRoom(roomId, playerId)
    socketRef.current = socket
    socket.on('state', (s: GameState) => setState(s))
    socket.on('gameOver', ({ winner }) => setWinner(winner))
    return () => {
      socket.disconnect()
      socketRef.current = null
    }
  }, [roomId, playerId])

  useEffect(() => {
    const id = setInterval(() => {
      if (socketRef.current) {
        sendMove(socketRef.current, mouseX.current)
      }
    }, 40)
    return () => clearInterval(id)
  }, [])

  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = (e.target as HTMLCanvasElement).getBoundingClientRect()
    mouseX.current = e.clientX - rect.left
  }

  if (winner) {
    return <div>Winner: {winner}</div>
  }

  return <GameCanvas state={state} onMouseMove={onMouseMove} />
}
