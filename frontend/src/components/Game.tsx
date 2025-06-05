import { useEffect, useState } from 'react'
import { connectToRoom, sendMove } from '../api'

export function Game({ roomId, playerId }: { roomId: string; playerId: string }) {
  const [state, setState] = useState<any>(null)

  useEffect(() => {
    const socket = connectToRoom(roomId, playerId)
    socket.on('state', (s) => setState(s))
    return () => {
      socket.disconnect()
    }
  }, [roomId, playerId])

  const move = (x: number) => {
    const socket = connectToRoom(roomId, playerId)
    sendMove(socket, x)
  }

  return (
    <div>
      <pre>{JSON.stringify(state)}</pre>
      <button onClick={() => move(Math.random() * 100)}>Move</button>
    </div>
  )
}
