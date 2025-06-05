import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { spawn } from 'child_process'
import path from 'path'
import { io } from 'socket.io-client'
import { joinLobby, pairPlayers } from './api'

let proc: any
const root = path.resolve(__dirname, '..', '..')

const startServer = async () => {
  const tsNode = path.join(root, 'backend/node_modules/ts-node/dist/bin.js')
  proc = spawn('node', [tsNode, '--transpile-only', 'src/index.ts'], {
    cwd: path.join(root, 'backend'),
    stdio: 'ignore',
  })
  await new Promise((r) => setTimeout(r, 1000))
}

const stopServer = () => proc && proc.kill()

beforeEach(startServer)
afterEach(stopServer)

describe('gameplay', () => {
  it('clients receive game state', async () => {
    await joinLobby('a')
    await joinLobby('b')
    const { rooms } = await pairPlayers()
    const roomId = rooms[0].id

    const s1 = io('http://localhost:4000')
    const states: any[] = []
    s1.emit('joinRoom', { roomId, playerId: 'a' })
    s1.on('state', (s) => states.push(s))
    const s2 = io('http://localhost:4000')
    s2.emit('joinRoom', { roomId, playerId: 'b' })

    await new Promise((r) => setTimeout(r, 500))
    s1.disconnect()
    s2.disconnect()

    expect(states.length).toBeGreaterThan(0)
  })
})
