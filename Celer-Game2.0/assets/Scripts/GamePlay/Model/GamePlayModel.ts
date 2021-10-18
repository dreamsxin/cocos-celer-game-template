import { Theme } from "../../Global/Theme";
import {
  FreePauseLimit,
  GetCollectCount,
  GetScoreByType,
  GetTotalLevel,
  GetTotalTime,
  GetTypeCount,
  ScoreBonusCountdown,
  ScoreModel,
} from "../../Global/GameRule";
import {
  GameThemeInit,
  PlayerScoreChanged,
  NoviceScoreChanged,
  GameOverSignal,
} from "../../Command/CommonSignal";
import { Level } from "../../Global/Level";
import { Random } from "../../Utils/Random";
import { BaseSignal } from "../../Utils/Signal";
import { RevertSignal } from "../View/UI/RevertButtonView";
import {
  GameStateController,
  RoundEndType,
} from "../../Controller/GameStateController";
import { EndNowSignal } from "../View/UI/SubmitLayerView";
import { NextLevelSignal } from "../../Model/PlayModelProxy";
import { GameLogic } from "./GameLogic";
import { Clamp } from "../../Utils/Cocos";
import { HashMap } from "../../Utils/HashMap";
export enum ScoreType {
  Match,
  TimeBonus,
  PauseCost,
}

export class ScoreCountDownUpdateSignal extends BaseSignal {}

export class GameTypeInitSignal extends BaseSignal {}

export class RevertButtonStateChangedSignal extends BaseSignal {}

export class UpdateTypeLabelSignal extends BaseSignal {}

interface RevertInterface {}

export class GamePlayModel {
  constructor() {
    this.init();
  }

  private theme: Theme;
  private level: number = 0;

  private playerScore: number = 0;
  private noviceScore: number = 0;
  private gameTime: number = GetTotalTime();
  private pauseCount: number = 0;
  private pauseScore: number = 0;
  private streak: number = 0;
  private totalStreak: number = 0;
  private maxSteak: number = 0;

  /** 分数加成倒计时 */
  private scaleCountDown: number = ScoreBonusCountdown();

  private playerScoreMap = {};
  private reverts: RevertInterface[] = [];

  private init() {
    GameLogic.inst.bindGamePlay(this);

    RevertSignal.inst.addListener(this.revertAction, this);
    EndNowSignal.inst.addListener(this.onEndNow, this);

    GameOverSignal.inst.addListenerOne((type: RoundEndType) => {}, this);
    this.resetScaleCountDown();
  }

  get Time() {
    return this.gameTime;
  }

  set Time(val: number) {
    this.gameTime = val;
    this.gameTime = Math.max(0, this.gameTime);
  }

  get BonusProgress() {
    return this.scaleCountDown / ScoreBonusCountdown();
  }

  addScaleCountDown(dt: number) {
    if (this.scaleCountDown > 0) {
      this.scaleCountDown += dt;
      this.scaleCountDown = Clamp(
        this.scaleCountDown,
        ScoreBonusCountdown(),
        0
      );
      ScoreCountDownUpdateSignal.inst.dispatchOne(this.BonusProgress);
    }
  }

  resetScaleCountDown() {
    this.scaleCountDown = ScoreBonusCountdown();
    ScoreCountDownUpdateSignal.inst.dispatchOne(
      this.scaleCountDown / ScoreBonusCountdown()
    );
  }

  get Theme() {
    return this.theme;
  }

  set Theme(val: Theme) {
    console.log("set game theme:", Theme[val]);
    this.theme = val;
    GameThemeInit.inst.dispatchOne(this.theme);
  }

  get Level() {
    return this.level;
  }

  set Level(val: number) {
    console.log("set game Level:", val);
    this.level = val;

    let startIndex = this.level * GetTypeCount();
    NextLevelSignal.inst.dispatchOne(this.level);
    ScoreModel.NextLevel();
    UpdateTypeLabelSignal.inst.dispatchOne(startIndex);
  }

  nextLevel() {
    if (this.Level + 1 >= GetTotalLevel()) {
      GameStateController.inst.roundEnd(RoundEndType.Complete);
      return;
    }

    this.Level++;
  }

  get TotalScore() {
    return Math.max(this.Timebonus + this.ScoreSpread + this.playerScore, 0);
  }

  get Timebonus() {
    return 0;
  }

  get ScoreSpread() {
    return 0;
  }

  get PlayerScore() {
    return this.playerScore;
  }

  get PauseScore() {
    return this.pauseScore;
  }

  get NoviceScore() {
    return this.noviceScore;
  }

  get TotalCombo() {
    return this.totalStreak;
  }

  get PauseCount() {
    return this.pauseCount;
  }

  onEndNow() {
    this.checkCompleteScore();
    GameStateController.inst.roundEnd(RoundEndType.Over);
  }

  addRevert(revert: RevertInterface) {
    if (CELER_X) {
      this.reverts.length = 0;
    }
    this.reverts.push(revert);
    RevertButtonStateChangedSignal.inst.dispatchOne(true);
  }

  revertAction() {}

  checkCompleteScore() {}

  /**  初始化游戏主题 */
  initGametheme() {
    let pool = Level.getThemeRandomPool(this.Level);
    this.Theme = pool[Math.floor(Random.getRandom() * pool.length)];
  }

  /** 初始化游戏数据 */
  initGameData() {
    console.log("init game data.");
  }

  addPlayerScore(
    score: number,
    type: ScoreType,
    times: number = 1,
    fromNode: cc.Node = null
  ): number {
    if (score == 0) return;
    if (this.playerScoreMap[type] == null) this.playerScoreMap[type] = 0;

    this.playerScoreMap[type] += score;
    let oldScore = this.playerScore;

    this.playerScore += score;
    if (score > 0) {
    } else {
      this.resetCombo();
    }

    this.playerScore = Math.max(this.playerScore, 0);

    PlayerScoreChanged.inst.dispatchFour(
      this.playerScore,
      score,
      times,
      fromNode
    );

    return this.playerScore - oldScore;
  }

  addNoviceScore(score: number, times: number = 1) {
    this.noviceScore += score;
    this.noviceScore = Math.max(this.noviceScore, 0);

    NoviceScoreChanged.inst.dispatchThree(this.noviceScore, score, times);
  }

  getScoreByType(type: ScoreType) {
    if (typeof this.playerScoreMap[type] != "number") return 0;
    return this.playerScoreMap[type];
  }

  addPauseCount() {
    this.pauseCount++;
    console.log("pause count:", this.pauseCount);
    if (this.pauseCount > FreePauseLimit) {
      this.addPlayerScore(
        -GetScoreByType(ScoreType.PauseCost),
        ScoreType.PauseCost
      );
    }
  }

  resetCombo() {
    this.streak = 0;
  }

  addStreak() {
    this.streak++;
    this.totalStreak++;
    this.maxSteak = Math.max(this.maxSteak, this.streak);
  }

  dump() {}
}
