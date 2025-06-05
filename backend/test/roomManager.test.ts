import { describe, it, expect, beforeEach } from 'vitest';
import { RoomManager } from '../src/roomManager';

describe('RoomManager pairing', () => {
  let manager: RoomManager;

  beforeEach(() => {
    manager = new RoomManager();
  });

  it('creates a room when 2 players join', () => {
    manager.joinLobby('p1');
    manager.joinLobby('p2');
    manager.pairPlayers();
    expect(manager.getRooms().length).toBe(1);
    expect(manager.getLobby().length).toBe(0);
  });

  it('creates two rooms when 4 players join', () => {
    manager.joinLobby('p1');
    manager.joinLobby('p2');
    manager.joinLobby('p3');
    manager.joinLobby('p4');
    manager.pairPlayers();
    expect(manager.getRooms().length).toBe(2);
    expect(manager.getLobby().length).toBe(0);
  });

  it('leaves one player unmatched when number of players is odd', () => {
    manager.joinLobby('p1');
    manager.joinLobby('p2');
    manager.joinLobby('p3');
    manager.pairPlayers();
    expect(manager.getRooms().length).toBe(1);
    expect(manager.getLobby().length).toBe(1);
  });

  it('removes player from lobby when they leave', () => {
    manager.joinLobby('p1');
    manager.leaveRoom('p1');
    expect(manager.getLobbyCount()).toBe(0);
  });

  it('dissolves room when a player leaves', () => {
    manager.joinLobby('p1');
    manager.joinLobby('p2');
    manager.pairPlayers();
    manager.leaveRoom('p1');
    expect(manager.getRooms().length).toBe(0);
    expect(manager.getLobby()).toContain('p2');
  });

  it('removes expired player from lobby', () => {
    manager.joinLobby('p1');
    // simulate timeout
    (manager as any).sessions['p1'] = Date.now() - 11000;
    manager.cleanExpiredSessions();
    expect(manager.getLobbyCount()).toBe(0);
  });

  it('dissolves room when a player session expires', () => {
    manager.joinLobby('p1');
    manager.joinLobby('p2');
    manager.pairPlayers();
    (manager as any).sessions['p1'] = Date.now() - 11000;
    manager.cleanExpiredSessions();
    expect(manager.getRooms().length).toBe(0);
    expect(manager.getLobby()).toContain('p2');
  });
});
