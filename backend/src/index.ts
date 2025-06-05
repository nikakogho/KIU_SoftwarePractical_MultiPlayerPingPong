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

app.get('/lobby/count', (_req, res) => {
  res.json({ count: roomManager.getLobby().length });
});

httpServer.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
