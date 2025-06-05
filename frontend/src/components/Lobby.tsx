import { useEffect, useState } from 'react'
import { getLobbyCount, joinLobby, pairPlayers } from '../api'
import { Game } from './Game'

export function Lobby() {
  const [count, setCount] = useState(0)
  const [playerId, setPlayerId] = useState<string | null>(null)
  const [roomId, setRoomId] = useState<string | null>(null)

  useEffect(() => {
    const fetchCount = async () => {
      setCount(await getLobbyCount())
    }
    fetchCount()
  }, [])

  const handleJoin = async () => {
    const id = 'player-' + Math.random().toString(36).slice(2, 8)
    await joinLobby(id)
    setPlayerId(id)
    setCount(await getLobbyCount())
  }

  const handlePair = async () => {
    const { rooms } = await pairPlayers()
    if (playerId) {
      const room = rooms.find((r) => r.players.includes(playerId))
      if (room) {
        setRoomId(room.id)
      }
    }
  }

  if (roomId && playerId) {
    return <Game roomId={roomId} playerId={playerId} />
  }

  return (
    <div>
      <p>Players waiting: {count}</p>
      <button onClick={handleJoin}>Join Lobby</button>
      <button onClick={handlePair}>Pair Players</button>
      {playerId && <p>Joined as {playerId}</p>}
    </div>
  )
}
