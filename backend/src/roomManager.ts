import { Game } from './game';
import type { Server, Socket } from 'socket.io';

export interface Room {
  id: string;
  players: string[];
}

export interface GameInfo {
  game: Game;
  sockets: Record<string, Socket>;
  interval?: NodeJS.Timer;
}

export class RoomManager {
  private lobby: string[] = [];
  private rooms: Room[] = [];
  private sessions: Record<string, number> = {};
  private counter = 1;
  private readonly timeoutMs = 10000;
  private gameData: Record<string, GameInfo> = {};

  joinLobby(playerId: string) {
    this.updateSession(playerId);
    if (!this.lobby.includes(playerId)) {
      this.lobby.push(playerId);
    }
  }

  pairPlayers() {
    this.cleanExpiredSessions();
    while (this.lobby.length >= 2) {
      const players = this.lobby.splice(0, 2);
      const room: Room = { id: `room-${this.counter++}`, players };
      this.rooms.push(room);
      this.gameData[room.id] = {
        game: new Game(),
        sockets: {},
      };
    }
  }

  getRooms(): Room[] {
    return this.rooms;
  }

  getLobby(): string[] {
    return this.lobby;
  }

  getLobbyCount(): number {
    return this.lobby.length;
  }

  ping(playerId: string) {
    if (this.sessions[playerId]) {
      this.sessions[playerId] = Date.now();
    }
  }

  cleanExpiredSessions(now = Date.now()) {
    for (const [id, last] of Object.entries(this.sessions)) {
      if (now - last > this.timeoutMs) {
        this.leaveRoom(id);
      }
    }
  }

  getRoomById(id: string): Room | undefined {
    return this.rooms.find((r) => r.id === id);
  }

  connectSocket(roomId: string, playerId: string, socket: Socket, io: Server) {
    const info = this.gameData[roomId];
    if (!info) return;
    info.sockets[playerId] = socket;
    if (!info.interval && Object.keys(info.sockets).length === 2) {
      info.interval = setInterval(() => {
        info.game.step();
        io.to(roomId).emit('state', info.game.getState());
        if (info.game.isOver()) {
          this.endGame(roomId, io);
        }
      }, 50);
    }
  }

  movePaddle(roomId: string, playerId: string, x: number) {
    const room = this.getRoomById(roomId);
    if (!room) return;
    const index = room.players.indexOf(playerId);
    if (index === -1) return;
    const info = this.gameData[roomId];
    if (!info) return;
    const side = index === 0 ? 'top' : 'bottom';
    info.game.movePaddle(side as 'top' | 'bottom', x);
  }

  disconnectSocket(roomId: string, playerId: string) {
    const info = this.gameData[roomId];
    if (!info) return;
    const sock = info.sockets[playerId];
    if (sock) {
      sock.disconnect(true);
      delete info.sockets[playerId];
    }
    if (info.interval && Object.keys(info.sockets).length < 2) {
      clearInterval(info.interval);
      info.interval = undefined;
    }
  }

  private endGame(roomId: string, io: Server) {
    const room = this.getRoomById(roomId);
    const info = this.gameData[roomId];
    if (!room || !info) return;
    const winner = info.game.getWinner();
    io.to(roomId).emit('gameOver', { winner });
    Object.keys(info.sockets).forEach((p) => this.disconnectSocket(roomId, p));
    this.rooms = this.rooms.filter((r) => r.id !== roomId);
    delete this.gameData[roomId];
    room.players.forEach((p) => this.joinLobby(p));
  }

  private updateSession(playerId: string) {
    this.sessions[playerId] = Date.now();
  }

  removeFromLobby(playerId: string) {
    this.lobby = this.lobby.filter((id) => id !== playerId);
  }

  leaveRoom(playerId: string) {
    this.removeFromLobby(playerId);
    let removed: Room | null = null;
    this.rooms = this.rooms.filter((room) => {
      if (room.players.includes(playerId)) {
        removed = room;
        room.players.forEach((p) => {
          if (p !== playerId) {
            this.joinLobby(p);
          }
        });
        return false;
      }
      return true;
    });
    if (removed) {
      const info = this.gameData[removed.id];
      if (info) {
        Object.keys(info.sockets).forEach((p) => this.disconnectSocket(removed!.id, p));
        clearInterval(info.interval);
        delete this.gameData[removed.id];
      }
    }
    delete this.sessions[playerId];
  }

  clear() {
    this.lobby = [];
    this.rooms = [];
    this.counter = 1;
    this.sessions = {};
    this.gameData = {};
  }
}
