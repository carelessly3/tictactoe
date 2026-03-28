import React from 'react';

export const Matchmaking: React.FC = () => {
  return (
    <div className="matchmaking-container">
      <h2>Searching...</h2>
      <div className="spinner">_</div>
      <p>Waiting for Player 2...</p>
    </div>
  );
};
