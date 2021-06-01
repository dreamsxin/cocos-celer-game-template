import { BaseSignal } from "../Utils/Signal";

export class ShowPauseLayerSignal extends BaseSignal {}

export class HidePauseLayerSignal extends BaseSignal {}

/** 初始化随机主题 */
export class GameThemeInit extends BaseSignal {}

/** 显示帮助界面 */
export class ShowHelpLayerSignal extends BaseSignal {}
export class HideHelpLayerSignal extends BaseSignal {}

/** 打开结算界面 */
export class OpenResultLayerSignal extends BaseSignal {}

/** 显示提交按钮 */
export class ShowSubmitSignal extends BaseSignal {}

/** 结算分数跳动 */
export class ScoreCountingSignal extends BaseSignal {}

/** 按钮点击 */
export class ButtonClickSignal extends BaseSignal {}

/** 播放时间特效 */
export class TimeAnimationStateChanged extends BaseSignal {}
export class UpdateTimeNumber extends BaseSignal {}

/** 游戏初始化完毕 */
export class GameReadySignal extends BaseSignal {}

/** 游戏正式开始 */
export class GameStartSignal extends BaseSignal {}

/** 游戏结束 */
export class GameOverSignal extends BaseSignal {}

/** 游戏暂停 */
export class GamePauseSignal extends BaseSignal {}

/** 玩家分数变化 */
export class PlayerScoreChanged extends BaseSignal {}
/** 人机分数变化 */
export class NoviceScoreChanged extends BaseSignal {}

/** 倒计时 */
export class CountDownSignal extends BaseSignal {}
