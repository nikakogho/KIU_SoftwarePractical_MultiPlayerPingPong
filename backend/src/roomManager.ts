export interface Room {
  id: string;
  players: string[];
}

export class RoomManager {
  private lobby: string[] = [];
  private rooms: Room[] = [];
  private sessions: Record<string, number> = {};
  private counter = 1;
  private readonly timeoutMs = 10000;

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

  private updateSession(playerId: string) {
    this.sessions[playerId] = Date.now();
  }

  removeFromLobby(playerId: string) {
    this.lobby = this.lobby.filter((id) => id !== playerId);
  }

  leaveRoom(playerId: string) {
    this.removeFromLobby(playerId);
    this.rooms = this.rooms.filter((room) => {
      if (room.players.includes(playerId)) {
        room.players.forEach((p) => {
          if (p !== playerId) {
            this.joinLobby(p);
          }
        });
        return false;
      }
      return true;
    });
    delete this.sessions[playerId];
  }

  clear() {
    this.lobby = [];
    this.rooms = [];
    this.counter = 1;
    this.sessions = {};
  }
}
