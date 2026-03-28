# Phase 1: Setup & Infrastructure

## Goal
Establish the core foundational project structure, encompassing both the `frontend` application and the `backend` game server to ensure a unified development environment.

## Tasks
1. **Directory Structure**
   - Create `frontend` directory for the React application.
   - Create `backend` directory for Nakama custom module logic.

2. **Backend Server Setup**
   - Provide a `docker-compose.yml` to spin up Nakama Server and CockroachDB locally.
   - Include the necessary volumes and port mappings (7349, 7350, 7351).
   - Initialize a `package.json` and `tsconfig.json` within the `backend` folder configured for compiling TypeScript for Nakama's JS runtime.

3. **Frontend Application Setup**
   - Initialize a Vite project with React and TypeScript (`npm create vite@latest frontend -- --template react-ts`).
   - Clean up boilerplate code and configure a basic `index.css` prioritizing Vanilla CSS.
   - Install required dependencies (e.g., `@heroiclabs/nakama-js` and `react-router-dom`).

## Deliverables
- Functioning `docker-compose` environment for Nakama.
- Working Vite development server in the `frontend` folder.
- Working TypeScript build pipeline in the `backend` folder.
