import { describe, it, expect, beforeEach, afterEach, beforeAll, afterAll } from 'vitest'
import { joinLobby, pairPlayers, getLobbyCount, leaveRoom, connectToRoom } from './api'
import { spawn } from 'child_process'
import path from 'path'

let proc: any

const root = path.resolve(__dirname, '../..')

const waitForServer = async () => {
  for (let i = 0; i < 20; i++) {
    try {
      const res = await fetch('http://localhost:4000/lobby/count')
      if (res.ok) return
    } catch (err) {
      // ignore until server is ready
    }
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

describe('api layer', () => {
  it('can join lobby and get count', async () => {
    await joinLobby('p1')
    const count = await getLobbyCount()
    expect(count).toBe(1)
  })

  it('can pair players', async () => {
    await joinLobby('a')
    await joinLobby('b')
    const { rooms } = await pairPlayers()
    expect(rooms.length).toBe(1)
  })

  it('can leave room', async () => {
    await joinLobby('x')
    await joinLobby('y')
    await pairPlayers()
    await leaveRoom('x')
    const count = await getLobbyCount()
    expect(count).toBe(1)
  })
})
