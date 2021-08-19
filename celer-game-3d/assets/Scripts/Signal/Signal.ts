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
