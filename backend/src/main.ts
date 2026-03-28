/// <reference types="nakama-runtime" />
import { matchInit, matchJoinAttempt, matchJoin, matchLeave, matchLoop, matchSignal, matchTerminate } from './match_handler';

function InitModule(
    ctx: nkruntime.Context,
    logger: nkruntime.Logger,
    nk: nkruntime.Nakama,
    initializer: nkruntime.Initializer
) {
    logger.info("Lila Tic-Tac-Toe Module Loaded!");

    // Register our authoritative match handler
    initializer.registerMatch("tic-tac-toe", {
        matchInit: matchInit,
        matchJoinAttempt: matchJoinAttempt,
        matchJoin: matchJoin,
        matchLeave: matchLeave,
        matchLoop: matchLoop,
        matchTerminate: matchTerminate,
        matchSignal: matchSignal,
    });

    // When the matchmaker has matched players, automatically spawn a match for them
    initializer.registerMatchmakerMatched(matchmakerMatched);
}

function matchmakerMatched(context: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, matches: nkruntime.MatchmakerResult[]): string {
    logger.info("Matchmaker matched -> creating tic-tac-toe match");
    const matchId = nk.matchCreate("tic-tac-toe", {});
    return matchId;
}

// Prevent rollup from tree-shaking without producing an unwanted `exports` variable
// @ts-ignore
globalThis.InitModule = InitModule;