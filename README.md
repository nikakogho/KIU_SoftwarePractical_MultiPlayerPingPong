# 🏓 Multiplayer Pong (React + Node.js + TypeScript)

Real‑time, two‑player Ping‑Pong built from scratch to practise full‑stack TypeScript, WebSockets (Socket.IO), and authoritative‑server game design.

> **Assignment weight:** 100 pts (10 % of course grade)

---

## 📚 Project Brief
Two browsers connect to a Node.js server, each controlling a paddle.  
The server owns the game state (paddles, ball, score) and broadcasts updates every frame via Socket.IO.  
Clients render the state with React and send only their paddle‑movement intents back to the server.

---

## 🎯 Learning Objectives & Rubric

| Area | Points | What you’ll demonstrate |
|------|--------|--------------------------|
| Real‑Time Communication | **30** | Bi‑directional WebSocket events with Socket.IO |
| Node.js Game Logic | **30** | Type‑safe room management, physics & scoring on the server |
| React Frontend | **25** | Responsive canvas, input handling, live updates |
| TypeScript Integration | **15** | End‑to‑end type safety and clean project structure |

Total: **100 pts**

---

## 🗂 Repo Layout

```
multiplayer-pong/
├── README.md
├── frontend/ # Vite + React + TS client
└── backend/ # Express + Socket.IO + TS server
```

---

## 🛠 Stack

| Layer     | Tech                         |
|-----------|-----------------------------|
| Frontend  | React 18, Vite, TypeScript, socket.io‑client |
| Backend   | Node 18+, Express, Socket.IO, TypeScript, ts‑node‑dev |
| Dev tools | ESLint, Prettier, Vitest / Jest (optional) |

---

## 🚀 Prerequisites

* **Node.js 18 LTS** or newer (`node -v`)
* **npm 9+** or **pnpm/yarn** – examples use plain `npm`
* Git (for cloning)

---

## ⚡ Quick Start

### 1. Clone & enter the repo

```bash
git clone https://github.com/<your‑org>/multiplayer-pong.git
cd multiplayer-pong
```

### 2. Spin up the backend

```bash
cd backend
npm install
npm run dev  # http://localhost:4000
```

### 3. Spin up the frontend

```bash
cd ../frontend
npm install
npm install socket.io-client
npm run dev                                 # opens http://localhost:5173
```

### 4. Play!

Open two browser tabs at http://localhost:5173, move paddles with W/S (left) and ↑/↓ (right).
Watch the console for connection logs.

## 📝 Key NPM Scripts

| Location          | Script        | Purpose                           |
| ----------------- | ------------- | --------------------------------- |
| `/backend`        | `npm run dev` | Auto‑reload TypeScript server     |
| `/backend`        | `npm test`    | Run backend unit tests            |
| `/frontend`       | `npm run dev` | Hot‑module‑reloading React client |
| root *(optional)* | `npm run dev` | Run both via `concurrently`       |

> To wire the root script, install dev deps at the repo root:
`npm install -D concurrently && \ echo '{ "scripts": { "dev": "concurrently \"npm:start-backend\" \"npm:start-frontend\"" } }' > package.json`

## Backend HTTP API

### REST endpoints

| Method | Path            | Body                     | Response                              |
| ------ | --------------- | ------------------------ | ------------------------------------- |
| POST   | `/lobby/join`   | `{ playerId: string }`   | `{ lobby: string[] }`                 |
| POST   | `/pair`         | –                        | `{ rooms: Room[], lobby: string[] }`  |
| POST   | `/room/leave`   | `{ playerId: string }`   | `{ rooms: Room[], lobby: string[] }`  |
| POST   | `/session/ping` | `{ playerId: string }`   | `{ ok: true }`                        |
| GET    | `/lobby/count`  | –                        | `{ count: number }`                   |

## 📡 Socket.IO Event Contract (TL;DR)

| Direction      | Event      | Payload                                                                          |
| -------------- | ---------- | -------------------------------------------------------------------------------- |
| client→server  | `joinRoom` | `{ roomId: string, playerId: string }`                                           |
| client→server  | `move`     | `number` (paddle X position)                                                     |
| server→clients | `state`    | `{ ball: {x, y, vx, vy}, paddles: {top:{x}, bottom:{x}}, score: {top, bottom} }` |
| server→clients | `gameOver` | `{ winner: 'top' | 'bottom' }`                                                  |


## 🌺 Current Implementation

### Backend
- Express server exposes endpoints for joining the lobby, pairing players, leaving rooms and keeping sessions alive.
- `RoomManager` manages lobby membership, active rooms and session timeouts. Expired sessions are cleaned every second.
- When two players enter a room a `Game` instance starts a physics loop (50 ms tick) and broadcasts state via Socket.IO.
- The game handles paddle movement, ball collisions and scoring. The first player to reach seven points triggers a `gameOver` message.

### Frontend
- `Lobby` shows how many players are waiting, allows joining the lobby and pairing into a room.
- Once paired, `Game` connects through Socket.IO, draws the match on a `<canvas>` and sends paddle positions based on the mouse.
- `ScoreBoard` displays the live score and a winner banner appears when the match ends.
- The client periodically pings the backend while playing to keep the session active.

## 🚧 Remaining Work
- Persist player IDs across refreshes so players can reconnect to games.
- Share TypeScript interfaces between client and server for stronger typing.
- Improve styling and add user feedback on errors or disconnects.
- Expand unit tests and consider adding a Cypress integration suite.
