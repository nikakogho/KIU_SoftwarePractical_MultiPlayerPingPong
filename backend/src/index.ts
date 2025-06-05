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

httpServer.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
