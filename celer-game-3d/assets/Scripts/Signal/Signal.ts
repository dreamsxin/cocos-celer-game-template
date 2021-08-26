import { BaseSignal } from "../Common/Signal";

/** 隐藏广告按钮 */
export class HideWildAdButtonSignal extends BaseSignal {}
/** 隐藏小马广告 */
export class RemoveFlyCnicornSignal extends BaseSignal {}
/** 显示小马广告 */
export class ShowFlyCnicornSignal extends BaseSignal {}
/** 小马广告观看失败 */
export class CnicornWatchFailSignal extends BaseSignal {}
/** 小马广告消失 */
export class FlyCnicornAdDispearSignal extends BaseSignal {}
/** 小马广告点击 */
export class FlyCnicornClickSignal extends BaseSignal {}

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

/** 游戏主题初始化 */
export class GameThemeInit extends BaseSignal {}

/** 更新加载进度 */
export class UpdateInitLoadingSignal extends BaseSignal {}

/** 游戏准备完毕 */
export class GameReadySignal extends BaseSignal {}

/** 游戏开始 */
export class GameStartSignal extends BaseSignal {}

/** 广告按钮准备 */
export class WildButtonReadySignal extends BaseSignal {}

/** 玩家手动结算 */
export class EndNowSignal extends BaseSignal {}

/** 音乐按钮 */
export class SoundStateChangedSignal extends BaseSignal {}

/** 分数初始化 */
export class PLayerScoreInitSignal extends BaseSignal {}

/** 菜单按钮点击 */
export class MenuButtonClickSignal extends BaseSignal {}

/** 广告按钮动画 */
export class WildAdAnimationIsPlaySignal extends BaseSignal {}

/** 固定位广告按钮点击 */
export class WildAdButtonClick extends BaseSignal {}

/** 看广告结束 */
export class AdFinishSignal extends BaseSignal {}
