

/**   celerx SDK */

/** Running with celerx SDK*/
declare let CELER_X: boolean;

/** 匹配信息 */
declare interface MatchInfo {
    /** 匹配ID */
    matchId: string;
    /** 随机种子 */
    sharedRandomSeed: number;
    /** 难度信息(目前根据游戏有的游戏不需要用到) */
    difficultyLevel: number;
    /** 是否需要新手指引 */
    shouldLaunchTutorial: boolean;
}


declare class celerSDK {

    /** onStart触发后获取随机种子等信息 */
    static getMatch(): MatchInfo;

    /** 结算提交分数，调用该接口后则游戏结束，webview关闭 */
    static submitScore(score: number);

    /** 游戏加载完成后，通知app显示ready按钮 */
    static ready(): void;

    /** 进入webview游戏显示时触发（玩家点击ready后） */
    static onStart(callback: () => void);

    /** 玩家中途退出时app获取游戏分数的接口 */
    static provideScore(callback: () => number);

    /** 发送log给app端 */
    static log(msg: string): void;

    /** app切回前台触发 */
    static onResume(callback: () => void);

    /** app切后台触发 */
    static onPause(callback: () => void);

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


}

