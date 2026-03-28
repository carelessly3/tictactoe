export const Mark = {
    EMPTY: 0,
    X: 1,
    O: 2
} as const;
export type Mark = typeof Mark[keyof typeof Mark];

export interface Player {
    userId: string;
    sessionId: string;
    username: string;
    mark: Mark;
}

export interface GameState {
    board: Mark[];
    players: Player[];
    activePlayerMark: Mark;
    winner: Mark | null;
    deadline: number;
}

export const OpCode = {
    MOVE: 1,
    UPDATE: 2,
    REJECT_MOVE: 3,
    GAME_OVER: 4
} as const;
export type OpCode = typeof OpCode[keyof typeof OpCode];

export interface MoveMessage {
    position: number;
}
