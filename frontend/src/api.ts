export interface Room {
  id: string;
  players: string[];
}

const BASE_URL = 'http://localhost:4000';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(BASE_URL + path, options);
  return res.json();
}

export async function joinLobby(playerId: string): Promise<string[]> {
  const data = await request<{ lobby: string[] }>('/lobby/join', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ playerId }),
  });
  return data.lobby;
}

export async function pairPlayers(): Promise<{ rooms: Room[]; lobby: string[] }> {
  return request('/pair', { method: 'POST' });
}

export async function leaveRoom(playerId: string): Promise<{ rooms: Room[]; lobby: string[] }> {
  return request('/room/leave', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ playerId }),
  });
}

export async function pingSession(playerId: string): Promise<void> {
  await request('/session/ping', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ playerId }),
  });
}

export async function getLobbyCount(): Promise<number> {
  const data = await request<{ count: number }>('/lobby/count');
  return data.count;
}

import { io, Socket } from 'socket.io-client';

export function connectToRoom(roomId: string, playerId: string): Socket {
  const socket = io(BASE_URL);
  socket.emit('joinRoom', { roomId, playerId });
  return socket;
}

export function sendMove(socket: Socket, x: number): void {
  socket.emit('move', x);
}
