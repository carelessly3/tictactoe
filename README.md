# 🕹️ Lila Tic-Tac-Toe: Arcade Edition

A high-performance, **server-authoritative** multiplayer Tic-Tac-Toe game built with **Nakama** and **React**. This project prioritizes security and fair play by running all game logic on the server, styled with a 1980s neon-grid "retro arcade" aesthetic.

---

## 🚀 Quick Start (Local)

To experience the game locally with minimal setup:

1. **Clone & Launch**:
   ```bash
   git clone https://github.com/your-username/tictactoe.git
   cd tictactoe
   docker compose up --build
   ```
2. **Access**:
   - **Frontend**: [http://localhost:80](http://localhost:80)
   - **Nakama Console**: [http://localhost:7351](http://localhost:7351) (User: `admin`, Pass: `password`)

---

## 🌐 Self-Hosting Guide (HP Omen + Cloudflare)

This project is optimized for deployment on a local machine exposed via **Cloudflare Tunnel**.

### 1. Unified Container Stack
The root `docker-compose.yml` orchestrates the frontend, backend, and database in a single stack. It uses **Build Arguments** to inject your public domain into the static frontend bundle.

### 2. Configuration (`.env`)
Create a `.env` file in the project root based on `.env.example`:
```bash
PUBLIC_IP_OR_DOMAIN=tictactoe-api.yourdomain.com
NAKAMA_PORT=443
NAKAMA_SSL=true
NAKAMA_SERVER_KEY=your-secure-key
```

### 3. Cloudflare Tunneling
Since you are running `cloudflared` on your host OS:
1. **Create the Tunnel**:
   ```bash
   cloudflared tunnel login
   cloudflared tunnel create tictactoe-tunnel
   ```
2. **Configure Ingress**:
   Map your domain in the Cloudflare Dashboard:
   - **`tictactoe.yourdomain.com`** ➔ `http://localhost:80` (Frontend)
   - **`tictactoe-api.yourdomain.com`** ➔ `http://localhost:7350` (Nakama API)
3. **Run the Tunnel**:
   ```bash
   cloudflared tunnel run --protocol http2 tictactoe-tunnel
   ```

---

## 🏗️ Architecture & Design Decisions

### **Why Nakama?**
Instead of building a custom WebSocket server, we utilized **Nakama**. This provides:
- **Scalable Matchmaking**: We use the Nakama Matchmaker to pair players automatically into new matches.
- **Atomic Persistence**: Player accounts and game history are stored in a distributed **CockroachDB**.
- **Auth Rationale**: We use **Anonymous Device Authentication** to allow players to jump into the arcade instantly without passwords.

### **Server-Authoritative Logic**
All game rules (turns, win conditions, and board state) are calculated by the **Nakama JS Runtime**. This makes it impossible for a client to "cheat" by modifying their local browser state.

---

## ⚙️ API & Server Configuration

| Port | Service | Description |
| :--- | :--- | :--- |
| **80** | Frontend (Nginx) | Serves the production React bundle. |
| **7349** | Nakama gRPC | High-speed binary protocol for server communication. |
| **7350** | Nakama HTTP/WS | Primary API and WebSocket endpoint (Main Game Socket). |
| **7351** | Nakama Dashboard | Web UI for management and logs. |
| **26257** | CockroachDB | SQL database port. |

---

## 🧪 Testing Multiplayer Functionality

To verify the end-to-end matchmaking and gameplay flow:

1. **Launch**: `docker compose up --build`.
2. **Player 1**: Open `http://localhost` (or your domain). Click **"Find Match"**.
3. **Player 2**: Open `http://localhost` in a **Private/Incognito window**. Click **"Find Match"**.
4. **Matchmaking**: 
   - The server will pair both players instantly.
   - The UI will transition from the lobby to the game grid.
5. **Gameplay**:
   - Verify that Player A cannot move during Player B's turn.
   - Complete a match to verify win/draw detection and board resets.

---

## 🎨 Retro UI Highlights
- **CRT Scanline Effects**: Implemented via CSS overlays for that authentic arcade experience.
- **Dynamic Glow**: Neon gradients that react to player moves.
- **Typography**: Uses the classic *Press Start 2P* pixel font.

---

## 🧩 Development Mode
If you are moving back to development:
- **Frontend**: `cd frontend && npm run dev`
- **Backend Build**: `cd backend && npm run build` (Must be run after every logic change).
- **Backend Logs**: `docker compose logs -f nakama`.

---

*Built for the high-stakes world of digital arcade combat.*
