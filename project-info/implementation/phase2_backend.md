# Phase 2: Backend Development (Nakama)

## Goal
Implement a server-authoritative multiplayer environment where the single source of truth for the game state resides exclusively on the server, thereby preventing client-side cheating.

## Tasks
1. **Core Match Module**
   - Implement the `MatchProvider` interface expected by Nakama in TypeScript (`matchInit`, `matchJoinAttempt`, `matchJoin`, `matchLoop`, `matchTerminate`).
   - Define structure for the game state (e.g., a 1D array representing the 3x3 board, current turn tracker, player assignments).

2. **Match Loop & Validation**
   - Manage incoming opcodes from clients (e.g., "Player Move", "Resign").
   - Validate requested moves server-side:
     - Is it the player's correct turn?
     - Is the selected cell currently empty?
   - Update the game state cleanly if the input is valid.

3. **Game Conclusion Logic**
   - After each successful turn, check the board for win/draw conditions (8 possible winning lines).
   - Broadcast the conclusion state to both clients gracefully and terminate the match.

4. **Matchmaking Flow**
   - Ensure the server correctly handles standard Nakama matchmaking tickets, spawning game servers dynamically once enough players queue.

## Deliverables
- Compiled `main.js` holding Nakama logic.
- Validation systems preventing invalid cell placements.
- Win/Draw detection systems operating smoothly inside the match loop.
