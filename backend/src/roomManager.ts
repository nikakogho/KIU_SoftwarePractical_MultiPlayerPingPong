export interface Room {
  id: string;
  players: string[];
}

export class RoomManager {
  private lobby: string[] = [];
  private rooms: Room[] = [];
  private counter = 1;

  joinLobby(playerId: string) {
    if (!this.lobby.includes(playerId)) {
      this.lobby.push(playerId);
    }
  }

  pairPlayers() {
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

  removeFromLobby(playerId: string) {
    this.lobby = this.lobby.filter((id) => id !== playerId);
  }

  clear() {
    this.lobby = [];
    this.rooms = [];
    this.counter = 1;
  }
}
