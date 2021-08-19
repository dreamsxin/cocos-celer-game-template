import { BaseSignal } from "../Common/Signal";

/** 隐藏广告按钮 */
export class HideWildAdButtonSignal extends BaseSignal {}
/** 隐藏小马广告 */
export class RemoveFlyCnicornSignal extends BaseSignal {}
/** 游戏结束 */
export class GameOverSignal extends BaseSignal {}
/** 游戏暂停 */
export class GamePauseSignal extends BaseSignal {}
/** 显示暂停界面 */
export class ShowPauseLayerSignal extends BaseSignal {}
/** 时间动画 */
export class TimeAnimationStateChanged extends BaseSignal {}
/** 显示帮助界面 */
export class ShowHelpLayerSignal extends BaseSignal {}
/** 隐藏帮助界面 */
export class HideHelpLayerSignal extends BaseSignal {}
/** 按钮点击 */
export class ButtonClickSignal extends BaseSignal {}

/** 显示新手引导 */
export class ShowTutorialSignal extends BaseSignal {}

/** 显示tip */
export class ShowTipSignal extends BaseSignal {}

/** 更新时间 */
export class UpdateTimeNumber extends BaseSignal {}

/** 开始计时 */
export class StartCountSignal extends BaseSignal {}

/** 分数跳动 */
export class ScoreCountingSignal extends BaseSignal {}

/** 显示提交按钮 */
export class ShowSubmitSignal extends BaseSignal {}

/** 打开结算界面 */
export class OpenResultLayerSignal extends BaseSignal {}

/** 玩家分数变化 */
export class PlayerScoreChanged extends BaseSignal {}

/** 下一关 */
export class NextLevelSignal extends BaseSignal {}

/** 倒计时 */
export class CountDownSignal extends BaseSignal {}
