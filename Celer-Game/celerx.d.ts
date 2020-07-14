

/**   celerx SDK */

/** Running with celerx SDK*/
declare let CELER_X: boolean;
declare interface MatchInfo {
    matchId: string;
    sharedRandomSeed: number;
    difficultyLevel: number;
    shouldLaunchTutorial: boolean;
}


declare class celerSDK {


    // private method

    private static onStateReceived(callback: () => void);
    private static onCourtModeStarted(callback: () => void);
    private static showCourtModeDialog(): void;
    private static start(): void;
    private static sendState(arr: []): void;
    private static draw(arr: []): void;
    private static win(arr: []): void;
    private static lose(arr: []): void;
    private static surrender(arr: []): void;
    private static applyAction(arr: [], callback: () => void);
    private static getOnChainState(callback: () => void);
    private static getOnChainActionDeadline(callback: () => void);
    private static getCurrentBlockNumber(): number;
    private static finalizeOnChainGame(callback: () => void);

    // public

    static getMatch(): MatchInfo;
    static submitScore(score: number);
    static ready(): void;
    static onStart(callback: () => void);
    static provideScore(callback: () => number);
    static log(msg: string): void;
    static onResume(callback: () => void);
    static onPause(callback: () => void);
}

