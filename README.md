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
# Initialise and install
npm init -y                                 # creates package.json
npm install express socket.io
npm install -D typescript ts-node-dev @types/node @types/express
npx tsc --init                              # generates tsconfig.json

# Add a dev script to package.json:
#  "scripts": { "dev": "ts-node-dev --respawn src/index.ts" }

mkdir src && touch src/index.ts             # scaffold entry file
npm run dev                                 # starts http://localhost:4000
```

### 3. Spin up the frontend

```bash
cd ../frontend
npm create vite@latest . -- --template react-ts
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
| `/frontend`       | `npm run dev` | Hot‑module‑reloading React client |
| root *(optional)* | `npm run dev` | Run both via `concurrently`       |

> To wire the root script, install dev deps at the repo root:
`npm install -D concurrently && \ echo '{ "scripts": { "dev": "concurrently \\"npm:start-backend\\" \\"npm:start-frontend\\"" } }' > package.json`

## 📡 Socket.IO Event Contract (TL;DR)

| Direction      | Event        | Payload                                               |
| -------------- | ------------ | ----------------------------------------------------- |
| client→server  | `paddleMove` | `{ y: number }` (current paddle Y)                    |
| server→clients | `state`      | `{ ball: {x,y}, paddles: {left,right}, score:{l,r} }` |
| server→clients | `gameOver`   | `{ winner: "left" \| "right" }`                       |

## ✨ Next Steps

1. Flesh out src/index.ts of backend with room logic and simple physics loop (~60 fps setInterval).
2. In the React app, render <canvas> and draw the game every animation frame.
3. Harden with TypeScript interfaces shared between client & server (/common folder or npm workspace).
4. Add tests or a Cypress integration suite if required.
