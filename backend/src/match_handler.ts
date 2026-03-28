import { GameState, Mark, checkWin, Player } from './state';
import { OpCode, MoveMessage } from './messages';

const matchInit: nkruntime.MatchInitFunction = function (ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, params: {[key: string]: string}) {
    logger.debug('Tic-Tac-Toe match started');
    const state: GameState = {
        board: new Array(9).fill(Mark.EMPTY),
        players: [],
        activePlayerMark: Mark.X, // X always goes first
        winner: null,
        deadline: 0,
    };
    return {
        state: state,
        tickRate: 2, // 2 ticks per second is more than enough for a turn-based game
        label: "tic-tac-toe"
    };
};

const matchJoinAttempt: nkruntime.MatchJoinAttemptFunction = function (ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, dispatcher: nkruntime.MatchDispatcher, tick: number, state: nkruntime.MatchState, presence: nkruntime.Presence, metadata: {[key: string]: any}) {
    const gameState = state as GameState;
    if (gameState.players.length >= 2) {
        return { state, accept: false, rejectReason: "Match is full" };
    }
    return { state, accept: true };
};

const matchJoin: nkruntime.MatchJoinFunction = function (ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, dispatcher: nkruntime.MatchDispatcher, tick: number, state: nkruntime.MatchState, presences: nkruntime.Presence[]) {
    const gameState = state as GameState;
    
    for (const presence of presences) {
        if (gameState.players.length < 2) {
            const mark = gameState.players.length === 0 ? Mark.X : Mark.O;
            gameState.players.push({
                userId: presence.userId,
                sessionId: presence.sessionId,
                username: presence.username,
                mark: mark
            });
        }
    }
    
    // Once we have two players, tell them the initial state so they know their marks and who goes first
    if (gameState.players.length === 2) {
        dispatcher.broadcastMessage(OpCode.UPDATE, JSON.stringify(gameState));
    }
    return { state: gameState };
};

const matchLeave: nkruntime.MatchLeaveFunction = function (ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, dispatcher: nkruntime.MatchDispatcher, tick: number, state: nkruntime.MatchState, presences: nkruntime.Presence[]) {
    const gameState = state as GameState;
    
    // If the game is already over, we don't need to do anything.
    if (gameState.winner !== null) {
        return { state: gameState };
    }

    // According to plan, if someone disconnects mid-game, we end the match and the remaining player wins.
    let disconnectedMark = Mark.EMPTY;
    for (const p of presences) {
        const player = gameState.players.find(pl => pl.sessionId === p.sessionId);
        if (player) {
            disconnectedMark = player.mark;
        }
    }

    if (disconnectedMark !== Mark.EMPTY && gameState.players.length > 0) {
        // Find remaining player and give them the win
        gameState.winner = (disconnectedMark === Mark.X) ? Mark.O : Mark.X;
        dispatcher.broadcastMessage(OpCode.GAME_OVER, JSON.stringify(gameState));
    }

    return { state: gameState };
};

const matchLoop: nkruntime.MatchLoopFunction = function (ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, dispatcher: nkruntime.MatchDispatcher, tick: number, state: nkruntime.MatchState, messages: nkruntime.MatchMessage[]) {
    const gameState = state as GameState;
    
    if (gameState.winner !== null) {
        // Game has already ended. Give players a tick to receive the GAME_OVER broadcast, then stop the match.
        return null;
    }

    for (const message of messages) {
        if (message.opCode === OpCode.MOVE) {
            const player = gameState.players.find(p => p.sessionId === message.sender.sessionId);
            if (!player) continue;

            if (player.mark !== gameState.activePlayerMark) {
                dispatcher.broadcastMessage(OpCode.REJECT_MOVE, JSON.stringify({error: "Not your turn"}), [message.sender]);
                continue;
            }

            const payload: MoveMessage = JSON.parse(nk.binaryToString(message.data));
            if (payload.position < 0 || payload.position >= 9 || gameState.board[payload.position] !== Mark.EMPTY) {
                dispatcher.broadcastMessage(OpCode.REJECT_MOVE, JSON.stringify({error: "Invalid position"}), [message.sender]);
                continue;
            }

            // Apply move
            gameState.board[payload.position] = player.mark;

            // Check win
            const winCondition = checkWin(gameState.board);
            if (winCondition !== null) {
                gameState.winner = winCondition; // Mark.EMPTY for draw, X or O for win
                dispatcher.broadcastMessage(OpCode.GAME_OVER, JSON.stringify(gameState));
                return null; // Terminate match properly right after Game Over
            } else {
                // Next turn
                gameState.activePlayerMark = gameState.activePlayerMark === Mark.X ? Mark.O : Mark.X;
                dispatcher.broadcastMessage(OpCode.UPDATE, JSON.stringify(gameState));
            }
        }
    }

    return { state: gameState };
};

const matchTerminate: nkruntime.MatchTerminateFunction = function (ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, dispatcher: nkruntime.MatchDispatcher, tick: number, state: nkruntime.MatchState, graceSeconds: number) {
    return null;
};

const matchSignal: nkruntime.MatchSignalFunction = function (ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, dispatcher: nkruntime.MatchDispatcher, tick: number, state: nkruntime.MatchState, data: string) {
    return { state };
};

export const matchHandler = {
    matchInit,
    matchJoinAttempt,
    matchJoin,
    matchLeave,
    matchLoop,
    matchSignal,
    matchTerminate
};
