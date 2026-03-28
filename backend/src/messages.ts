export enum OpCode {
    // Client to Server
    MOVE = 1,

    // Server to Client
    UPDATE = 2,         // Broadcasted when a valid move is made
    REJECT_MOVE = 3,    // Sent to a client if their move is invalid
    GAME_OVER = 4       // Broadcasted when game ends (win/draw/disconnect)
}

export interface MoveMessage {
    position: number; // 0 to 8
}
