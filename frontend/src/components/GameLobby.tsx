import React from 'react';
import { type GameState, Mark } from '../types';

interface Props {
  gameState: GameState;
  onMove: (position: number) => void;
  myUserId: string;
  onLeave: () => void;
}

export const GameLobby: React.FC<Props> = ({ gameState, onMove, myUserId, onLeave }) => {
  // If players array not synced yet
  if (!gameState || !gameState.players) return null;

  const me = gameState.players.find(p => p.userId === myUserId);
  const opponent = gameState.players.find(p => p.userId !== myUserId);

  const getMarkLabel = (mark: Mark) => {
    if (mark === Mark.X) return 'X';
    if (mark === Mark.O) return 'O';
    return '';
  };

  const isMyTurn = gameState.activePlayerMark === me?.mark && gameState.winner === null;
  
  let resultText = "";
  if (gameState.winner !== null) {
    if (gameState.winner === Mark.EMPTY) {
      resultText = "DRAW!";
    } else if (gameState.winner === me?.mark) {
      resultText = "YOU WIN!";
    } else {
      resultText = "GAME OVER!";
    }
  }

  return (
    <div className="game-lobby">
       <div className="player-info">
         <div className={isMyTurn ? "active-turn" : ""}>
           {me?.username} [{getMarkLabel(me?.mark || Mark.EMPTY)}]
           {isMyTurn && <><br/><span style={{fontSize: '0.6rem'}}>YOUR TURN</span></>}
         </div>
         <div className={!isMyTurn && gameState.winner === null ? "active-turn" : ""} style={{textAlign: 'right'}}>
           {opponent?.username || "???"} [{getMarkLabel(opponent?.mark || Mark.EMPTY)}]
           {!isMyTurn && gameState.winner === null && <><br/><span style={{fontSize: '0.6rem'}}>THINKING...</span></>}
         </div>
       </div>

       <div className="board">
         {gameState.board.map((cellMark, i) => (
           <div 
             key={i} 
             className={`cell ${cellMark === Mark.X ? 'x' : cellMark === Mark.O ? 'o' : ''}`}
             onClick={() => cellMark === Mark.EMPTY && isMyTurn && gameState.winner === null && onMove(i)}
           >
             {getMarkLabel(cellMark)}
           </div>
         ))}
       </div>

       {gameState.winner !== null && (
         <div className="overlay">
           <h2>{resultText}</h2>
           <button onClick={onLeave} className="danger-btn">Leave Match</button>
         </div>
       )}
    </div>
  );
};
