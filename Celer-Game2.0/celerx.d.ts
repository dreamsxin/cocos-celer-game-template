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
  static hasMethod(name: string): boolean;
  /** onStart触发后获取随机种子等信息 */
  static getMatch(): MatchInfo;

  /**
   * 结算提交分数，调用该接口后则游戏结束，webview关闭
   * @param score
   */
  static submitScore(score: number);

  /** 游戏加载完成后，通知app显示ready按钮 */
  static ready(): void;

  /**
   *  进入webview游戏显示时触发（玩家点击ready后）
   * @param callback 游戏正式开始的逻辑
   */
  static onStart(callback: () => void);

  /**
   * 玩家中途退出时app获取游戏分数的接口
   * @param callback 获取当前总得分的方法
   */
  static provideScore(callback: () => number);

  /**
   * 发送log给app端
   * @param msg string
   */
  static log(msg: string): void;

  /**
   * app切回前台触发
   * @param callback
   */
  static onResume(callback: () => void);

  /**
   * app切后台触发
   * @param callback
   */
  static onPause(callback: () => void);

  /**
   * 请求看广告
   * @param sequenceId 广告对应的ID, 每个广告的结束回调会回传这个ID
   */
  static showAd(sequenceId: string);

  /**
   * 注册看广告完成的回调
   * @param callback
   */
  static onAdPlayFinished(callback: (sequenceId: string) => void);
  /**
   * 注册看广告失败的回调
   * @param callback
   */
  static onAdPlayFailed(callback: (sequenceId: string) => void);

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
