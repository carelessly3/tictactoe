export enum Mark {
    EMPTY = 0,
    X = 1,
    O = 2
}

export interface Player {
    userId: string;
    sessionId: string;
    username: string;
    mark: Mark;
}

export interface GameState {
    board: Mark[];
    players: Player[];
    activePlayerMark: Mark; // Which player's turn it is
    winner: Mark | null;    // null = in progress, Mark.EMPTY = draw, Mark.X or O = win
    deadline: number;       // To track turn timeouts or match timeouts
}

// Helper to check the win condition on a 1D array of length 9
export function checkWin(board: Mark[]): Mark | null {
    const winningLines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // horizontal
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // vertical
        [0, 4, 8], [2, 4, 6]             // diagonal
    ];

    for (const [a, b, c] of winningLines) {
        if (board[a] !== Mark.EMPTY && board[a] === board[b] && board[a] === board[c]) {
            return board[a]; // Returns the winning mark
        }
    }

    // Check draw
    if (board.every(cell => cell !== Mark.EMPTY)) {
        return Mark.EMPTY; // 0 indicates a draw
    }

    return null; // Game continues
}
