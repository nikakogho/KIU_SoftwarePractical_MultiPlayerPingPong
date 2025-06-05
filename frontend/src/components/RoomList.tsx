import { useEffect, useState } from 'react'
import { pairPlayers } from '../api'

export function RoomList() {
  const [rooms, setRooms] = useState<any[]>([])

  const pair = async () => {
    const data = await pairPlayers()
    setRooms(data.rooms)
  }

  return (
    <div>
      <button onClick={pair}>Refresh Rooms</button>
      <pre>{JSON.stringify(rooms)}</pre>
    </div>
  )
}
