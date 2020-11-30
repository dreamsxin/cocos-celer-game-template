import { Theme } from "../../Global/Theme";
import {
  TotalTime,
  FreePauseLimit,
  PauseScoreCost,
} from "../../Global/GameRule";
import {
  GameThemeInit,
  PlayerScoreChanged,
  NoviceScoreChanged,
} from "../../Command/CommonSignal";
import { Level } from "../../Global/Level";
import { Random } from "../../Utils/Random";
import { BaseSignal } from "../../Utils/Signal";
import { RevertSignal } from "../View/UI/RevertButtonView";
import { MoveCountChangedSignal } from "../View/UI/MoveCountLabelView";
import {
  GameStateController,
  RoundEndType,
} from "../../Controller/GameStateController";
import { EndNowSignal } from "../View/UI/SubmitLayerView";
export enum ScoreType {
  Combo,
  CardBonus,
  TimeBonus,
  Normal,
}

export enum GameType {
  Tune_11,
  Tune_10,
  Tune_12,
}

export class GameTypeInitSignal extends BaseSignal {}

export const TuneIndexPool = {
  [GameType.Tune_10]: [2, 3, 5, 6, 7, 8, 9, 10, 11, 12],
  [GameType.Tune_11]: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  [GameType.Tune_12]: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
};

export class RevertButtonStateChangedSignal extends BaseSignal {}

export class BallSortDoneSignal extends BaseSignal {}

const MatchArea = 12882 * 0.4;

interface RevertInterface {}

export class GamePlayModel {
  constructor() {
    this.init();
  }

  private theme: Theme;
  private level: number = 0;
  private playerScore: number = 0;
  private noviceScore: number = 0;
  private gameTime: number = TotalTime;
  private pauseCount: number = 0;
  private pauseScore: number = 0;
  private streak: number = 0;
  private totalStreak: number = 0;
  private maxSteak: number = 0;
  private moveCount: number = 0;
  private scoreMap = {};
  private playerScoreMap = {};
  private reverts: RevertInterface[] = [];

  private init() {
    RevertSignal.inst.addListener(this.revertAction, this);
    EndNowSignal.inst.addListener(this.onEndNow, this);
  }

  get Time() {
    return this.gameTime;
  }

  set Time(val: number) {
    this.gameTime = val;
    this.gameTime = Math.max(0, this.gameTime);
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
  }

  get TotalScore() {
    return Math.max(
      this.Timebonus + this.ScoreSpread + this.playerScore - this.moveCount,
      0
    );
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

  get MoveCount() {
    return this.moveCount;
  }

  set MoveCount(val: number) {
    this.moveCount = val;
    MoveCountChangedSignal.inst.dispatchOne(this.moveCount);
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
      this.addPlayerScore(-PauseScoreCost, ScoreType.Normal);
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
