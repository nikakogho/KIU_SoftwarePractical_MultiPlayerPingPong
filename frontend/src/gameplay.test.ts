import { describe, it, expect, beforeEach, afterEach, beforeAll, afterAll } from 'vitest'
import { spawn } from 'child_process'
import path from 'path'
import { io } from 'socket.io-client'
import { joinLobby, pairPlayers } from './api'

let proc: any
const root = path.resolve(__dirname, '..', '..')

const waitForServer = async () => {
  for (let i = 0; i < 20; i++) {
    try {
      const res = await fetch('http://localhost:4000/lobby/count')
      if (res.ok) return
    } catch (err) {}
    await new Promise((r) => setTimeout(r, 100))
  }
  throw new Error('server not ready')
}

const startServer = async () => {
  const tsNode = path.join(root, 'backend/node_modules/ts-node/dist/bin.js')
  proc = spawn('node', [tsNode, '--transpile-only', 'src/index.ts'], {
    cwd: path.join(root, 'backend'),
    stdio: 'ignore',
    env: { ...process.env, NODE_ENV: 'test' }
  })
  await waitForServer()
  await fetch('http://localhost:4000/test/reset', { method: 'POST' })
}

const stopServer = () =>
  new Promise<void>((resolve) => {
    if (proc) {
      proc.kill('SIGKILL')
      proc = null
      setTimeout(resolve, 200)
    } else {
      resolve()
    }
  })

beforeAll(startServer)
afterAll(async () => {
  await stopServer()
})

beforeEach(async () => {
  await fetch('http://localhost:4000/test/reset', { method: 'POST' })
})

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

    await new Promise((r) => setTimeout(r, 1000))
    s1.disconnect()
    s2.disconnect()

    expect(states.length).toBeGreaterThan(0)
  })
})
