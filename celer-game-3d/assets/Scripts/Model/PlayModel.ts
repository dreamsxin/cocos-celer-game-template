import { FlyCnicornAd } from "../Ad/FlyCnicornAd";
import { Random } from "../Common/Random";
import { SingleTon } from "../Common/ToSingleTon";
import { GameLogic } from "../GamePlay/GameLogic";
import {
  GetFreePauseCount,
  GetScoreByType,
  ScoreType,
  Theme,
} from "../GamePlay/GameRule";
import { Level } from "../GamePlay/Model/Level";
import {
  GameStateController,
  RoundEndType,
} from "../Manager/GameStateController";
import {
  EndNowSignal,
  GameStartSignal,
  GameThemeInit,
  PlayerScoreChanged,
  ShowFlyCnicornSignal,
  StartCountSignal,
  TimeAnimationStateChanged,
  UpdateTimeNumber,
  WildButtonReadySignal,
} from "../Signal/Signal";

export class PlayModel extends SingleTon<PlayModel>() {
  private constructor() {
    super();
    this.bindSignal();
  }

  private theme: Theme = null;
  get Theme() {
    return this.theme;
  }
  set Theme(val: Theme) {
    console.log("set game theme:", Theme[val]);
    this.theme = val;
    GameThemeInit.inst.dispatch(this.theme);
  }

  private playerScore: number = 0;
  private noviceScore: number = 0;
  private gameTime: number = 0;
  private level: number = 0;
  private pauseCount: number = 0;
  private pauseScore: number = 0;
  private playerScoreMap: { [key: number]: number } = {};
  private streak: number = 0;
  private totalStreak: number = 0;
  private maxStreak: number = 0;
  private isGameOver: boolean = false;
  private hasStartCount: boolean = false;

  get Level() {
    return this.level;
  }

  set Level(val: number) {
    this.level = val;
  }

  get Time() {
    return this.gameTime;
  }

  private set Time(val: number) {
    this.gameTime = val;
    this.gameTime = Math.max(0, this.gameTime);
  }

  get TimeBonus() {
    return 0;
  }

  get ScoreSpread() {
    return 0;
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

  get PlayerScore() {
    return this.playerScore;
  }

  get TotalScore() {
    return Math.max(this.TimeBonus + this.ScoreSpread + this.playerScore, 0);
  }

  get FreePauseCount() {
    return Math.max(0, GetFreePauseCount() - this.pauseCount);
  }

  addGameTime(dt: number) {
    if (
      GameStateController.inst.isPause() ||
      GameStateController.inst.isRoundStart() == false
    ) {
      return;
    }

    if (this.isGameOver) return;
    if (this.hasStartCount == false) {
      this.hasStartCount = true;
      StartCountSignal.inst.dispatch();
    }

    this.Time += dt;
    UpdateTimeNumber.inst.dispatch(this.Time, Math.abs(dt));
    TimeAnimationStateChanged.inst.dispatch(this.Time <= 30);

    if (FlyCnicornAd.ShowTimeRest > 0) {
      FlyCnicornAd.ShowTimeRest += dt;
      if (FlyCnicornAd.ShowTimeRest <= 0) {
        ShowFlyCnicornSignal.inst.dispatch();
      }
    }

    if (this.Time <= 0) {
      this.checkCompleteScore();
      GameStateController.inst.roundEnd(RoundEndType.TimeUp);
    }
  }

  private bindSignal() {
    EndNowSignal.inst.addListener(this.onEndNow, this);
  }

  getTotalScore() {
    return 0;
  }

  setTotalTime(time: number) {}

  addPauseCount() {
    this.pauseCount++;
    console.log("pause count:", this.pauseCount);
    if (this.pauseCount > GetFreePauseCount()) {
      this.addPlayerScore(
        -GetScoreByType(ScoreType.PauseCost),
        ScoreType.PauseCost
      );
    }
  }

  resetCombo() {
    this.streak = 0;
  }

  addPlayerScore(
    score: number,
    type: ScoreType,
    times: number = 1,
    fromNode: Node = null
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

    PlayerScoreChanged.inst.dispatch(this.playerScore, score, times, fromNode);

    return this.playerScore - oldScore;
  }

  addStreak() {
    this.streak++;
    this.totalStreak++;
    this.maxStreak = Math.max(this.maxStreak, this.streak);
  }

  checkCompleteScore() {}

  getScoreByType(type: ScoreType) {
    if (typeof this.playerScoreMap[type] != "number") return 0;
    return this.playerScoreMap[type];
  }

  gameReadyShow() {
    GameStartSignal.inst.dispatch();
    console.log("gameReadyToStart");
    WildButtonReadySignal.inst.dispatch();
  }

  onEndNow() {
    console.log(" player end now.");
    this.checkCompleteScore();
    GameStateController.inst.roundEnd(RoundEndType.Over);
  }

  /** 初始化游戏数据 */
  private initGameData() {
    console.log("init game data.");

    this.Level = 0;
  }

  /**  初始化游戏主题 */
  private initGametheme() {
    let pool = Level.GetThemeRandomPool(this.Level);
    this.Theme = pool[Math.floor(Random.getRandom() * pool.length)];
  }

  init() {
    this.initGametheme();
    this.initGameData();
    GameLogic.inst.init();
  }
}

CC_DEBUG && (window["PlayModel"] = PlayModel.inst);
