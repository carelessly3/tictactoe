/// <reference types="nakama-runtime" />

let InitModule: nkruntime.InitModule = function (
    ctx: nkruntime.Context,
    logger: nkruntime.Logger,
    nk: nkruntime.Nakama,
    initializer: nkruntime.Initializer
) {
    logger.info("Lila Tic-Tac-Toe Module Loaded!");
}

// This is required for Nakama to "see" your init function
// since you are bundling with Rollup.
export { InitModule };