# Phase 5: Optional Features

## Goal
Tackle "Bonus Functionality" detailed within the initial assignment outline sequentially after the foundational functionality (Phases 1-4) is thoroughly validated.

## Available Features (Deferred)
**Given current scopes, these features will only be considered after Phase 4 is officially completed:**

1. **Concurrent Game Support**
   - Handled primarily by Nakama natively via matchmaking pools, however, explicit code updates could dictate handling multiple simultaneous active match IDs dynamically from within the React application without breaking state.

2. **Global Leaderboards**
   - **Objective:** Track wins, losses, and win streaks. 
   - **Implementation:** Utilize the Native Nakama Storage Engine and Leaderboard API. Following match completion in the `matchLoop` server-side, grant +1 Score mathematically updating the leaderboard records for that specific user ID.
   - Add a frontend `<Leaderboard />` view displaying the Top 50 global players.

3. **Timer-based Game Mode**
   - Add turn time limits (e.g., 30 Seconds). 
   - Inside the Nakama `matchLoop` tick interval, track standard time differences. If delta time clears 30 seconds, automatically force-assign a forfeit and conclude the match resolving to the other active opponent.
   - Create a pre-game mode selection switch (Classic or Timed) triggering different matchmaking pool queries logically to only pair users with identical mode preferences. 

## Deliverables
*(To be determined upon later phase implementation decisions)*
