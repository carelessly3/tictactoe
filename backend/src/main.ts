/// <reference types="nakama-runtime" />
import { matchHandler } from './match_handler';

let InitModule: nkruntime.InitModule = function (
    ctx: nkruntime.Context,
    logger: nkruntime.Logger,
    nk: nkruntime.Nakama,
    initializer: nkruntime.Initializer
) {
    logger.info("Lila Tic-Tac-Toe Module Loaded!");

    // Register our authoritative match handler
    initializer.registerMatch("tic-tac-toe", {
        matchInit: matchHandler.matchInit,
        matchJoinAttempt: matchHandler.matchJoinAttempt,
        matchJoin: matchHandler.matchJoin,
        matchLeave: matchHandler.matchLeave,
        matchLoop: matchHandler.matchLoop,
        matchTerminate: matchHandler.matchTerminate,
        matchSignal: matchHandler.matchSignal,
    });

    // When the matchmaker has matched players, automatically spawn a match for them
    initializer.registerMatchmakerMatched((context: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, matches: nkruntime.MatchmakerResult[]): string => {
        logger.info("Matchmaker matched -> creating tic-tac-toe match");
        const matchId = nk.matchCreate("tic-tac-toe", {});
        return matchId;
    });
}

// This is required for Nakama to "see" your init function
// since you are bundling with Rollup.
export { InitModule };