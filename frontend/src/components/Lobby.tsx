import { useEffect, useState } from 'react'
import { getLobbyCount, joinLobby, pairPlayers } from '../api'

export function Lobby() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const fetchCount = async () => {
      setCount(await getLobbyCount())
    }
    fetchCount()
  }, [])

  const handleJoin = async () => {
    await joinLobby('player-' + Math.random())
    setCount(await getLobbyCount())
  }

  const handlePair = async () => {
    await pairPlayers()
  }

  return (
    <div>
      <p>Players waiting: {count}</p>
      <button onClick={handleJoin}>Join Lobby</button>
      <button onClick={handlePair}>Pair Players</button>
    </div>
  )
}
