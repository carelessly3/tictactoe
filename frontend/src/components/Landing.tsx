import React from 'react';

interface Props {
  onFindMatch: () => void;
  username: string;
}

export const Landing: React.FC<Props> = ({ onFindMatch, username }) => {
  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Tic-Tac-Toe</h1>
      <h3 style={{ color: 'var(--x-color)' }}>Arcade Edition</h3>
      <p style={{ marginTop: '2rem', marginBottom: '2rem' }}>Player: {username}</p>
      <button onClick={onFindMatch}>Insert Coin (Find Match)</button>
    </div>
  );
};
