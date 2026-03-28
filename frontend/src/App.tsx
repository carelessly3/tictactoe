import { useEffect, useState } from 'react';
import { Landing } from './components/Landing';
import { Matchmaking } from './components/Matchmaking';
import { GameLobby } from './components/GameLobby';
import { nakama } from './lib/nakama';
import { OpCode, type GameState } from './types';

function App() {
  const [appState, setAppState] = useState<'landing' | 'matchmaking' | 'game'>('landing');
  const [username, setUsername] = useState<string>('');
  const [gameState, setGameState] = useState<GameState | null>(null);

  useEffect(() => {
    // Authenticate automatically on load
    nakama.authenticate().then(session => {
      setUsername(session.username || 'Player');
      nakama.connectSocket().catch(err => console.error("Socket error", err));
    }).catch(err => {
      console.error("Auth error", err);
    });

    // Wire up listeners
    nakama.onMatchmakerMatched = async (matched) => {
      try {
        await nakama.joinMatch(matched.match_id);
        setAppState('game');
      } catch (err) {
        console.error("Error joining match", err);
        setAppState('landing');
      }
    };

    nakama.onMatchData = (message) => {
      // OpCodes 2 (UPDATE) and 4 (GAME_OVER) carry the full game state payload
      if (message.op_code === OpCode.UPDATE || message.op_code === OpCode.GAME_OVER) {
        try {
          const payloadStr = new TextDecoder().decode(message.data);
          const state: GameState = JSON.parse(payloadStr);
          setGameState(state);
        } catch (e) {
          console.error("Failed to parse match data", e);
        }
      }
      if (message.op_code === OpCode.REJECT_MOVE) {
        console.warn("Move rejected by server");
      }
    };

  }, []);

  const handleFindMatch = async () => {
    setAppState('matchmaking');
    try {
      await nakama.findMatch(2, 2);
    } catch (e) {
       console.error("Matchmaking error", e);
       setAppState('landing');
    }
  };

  const handleMove = (position: number) => {
    nakama.sendMove(position);
  };

  const handleLeave = () => {
    setGameState(null);
    nakama.matchId = null;
    setAppState('landing');
  };

  return (
    <div className="app-container">
      {appState === 'landing' && <Landing username={username} onFindMatch={handleFindMatch} />}
      {appState === 'matchmaking' && <Matchmaking />}
      {appState === 'game' && gameState && (
        <GameLobby 
          gameState={gameState} 
          myUserId={nakama.session?.user_id || ''} 
          onMove={handleMove}
          onLeave={handleLeave}
        />
      )}
    </div>
  );
}

export default App;
