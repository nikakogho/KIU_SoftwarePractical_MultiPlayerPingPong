import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { joinLobby, pairPlayers, getLobbyCount, leaveRoom, connectToRoom } from './api'
import { spawn } from 'child_process'
import path from 'path'

let proc: any

const startServer = async () => {
  const root = path.resolve(__dirname, '../..')
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
    expect(count).toBe(2)
  })
})
