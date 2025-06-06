import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { RoomManager } from './roomManager';

const app = express();
app.use(express.json());
const httpServer = createServer(app);
const io = new Server(httpServer);

const PORT = 4000;

const roomManager = new RoomManager();

setInterval(() => roomManager.cleanExpiredSessions(), 1000);

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on('joinRoom', ({ roomId, playerId }) => {
    if (typeof roomId !== 'string' || typeof playerId !== 'string') return;
    const room = roomManager.getRoomById(roomId);
    if (!room || !room.players.includes(playerId)) return;
    socket.data.playerId = playerId;
    socket.data.roomId = roomId;
    socket.join(roomId);
    roomManager.connectSocket(roomId, playerId, socket, io);
  });

  socket.on('move', (x: number) => {
    const { playerId, roomId } = socket.data as { playerId?: string; roomId?: string };
    if (typeof playerId === 'string' && typeof roomId === 'string') {
      roomManager.movePaddle(roomId, playerId, x);
    }
  });

  socket.on('disconnect', () => {
    const { playerId } = socket.data as { playerId?: string };
    if (typeof playerId === 'string') {
      roomManager.leaveRoom(playerId);
    }
  });
});

app.post('/lobby/join', (req, res) => {
  const { playerId } = req.body;
  if (typeof playerId !== 'string') {
    return res.status(400).json({ error: 'playerId required' });
  }
  roomManager.joinLobby(playerId);
  res.json({ lobby: roomManager.getLobby() });
});

app.post('/pair', (_req, res) => {
  roomManager.pairPlayers();
  res.json({ rooms: roomManager.getRooms(), lobby: roomManager.getLobby() });
});

app.post('/room/leave', (req, res) => {
  const { playerId } = req.body;
  if (typeof playerId !== 'string') {
    return res.status(400).json({ error: 'playerId required' });
  }
  roomManager.leaveRoom(playerId);
  res.json({ rooms: roomManager.getRooms(), lobby: roomManager.getLobby() });
});

app.post('/session/ping', (req, res) => {
  const { playerId } = req.body;
  if (typeof playerId !== 'string') {
    return res.status(400).json({ error: 'playerId required' });
  }
  roomManager.ping(playerId);
  res.json({ ok: true });
});

app.get('/lobby/count', (_req, res) => {
  res.json({ count: roomManager.getLobbyCount() });
});

if (process.env.NODE_ENV === 'test') {
  app.post('/test/reset', (_req, res) => {
    roomManager.clear();
    res.json({ ok: true });
  });
}

httpServer.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
