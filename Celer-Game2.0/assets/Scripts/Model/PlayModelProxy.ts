import { SingleTon } from "../Utils/ToSingleton";
import {
  GameStateController,
  RoundEndType,
} from "../Controller/GameStateController";
import { GamePlayModel, ScoreType } from "../GamePlay/Model/GamePlayModel";
import {
  UpdateTimeNumber,
  TimeAnimationStateChanged,
  GameStartSignal,
} from "../Command/CommonSignal";
import { FreePauseLimit, GetTotalLevel } from "../Global/GameRule";
import { BaseSignal } from "../Utils/Signal";
import { CelerSDK } from "../Utils/Celer/CelerSDK";
import FlyCnicornAd, { ShowFlyCnicornSignal } from "../Ad/FlyCnicornAd";
import { WildButtonReadySignal } from "../Ad/WildAdButton";

export class NextLevelSignal extends BaseSignal {}
export class StartInitMapSignal extends BaseSignal {}
export class StartCountSignal extends BaseSignal {}
export class PlayModelProxy extends SingleTon<PlayModelProxy>() {
  private constructor() {
    super();
    this.bindSignal();
  }

  private isGameOver: boolean = false;
  private playerModel: GamePlayModel = null;

  public get Model() {
    return this.playerModel
      ? this.playerModel
      : (this.playerModel = new GamePlayModel());
  }

  get TimeLeft() {
    return this.Model.Time;
  }

  get PlayerScore() {
    return this.Model.PlayerScore;
  }

  get NoviceScore() {
    return this.Model.NoviceScore;
  }

  get PointSpread() {
    return this.Model.ScoreSpread;
  }

  get TimeBonus() {
    return this.Model.Timebonus;
  }

  get Theme() {
    return this.Model.Theme;
  }

  get Level() {
    return this.Model.Level;
  }

  set Level(val: number) {
    this.Model.Level = val;
  }

  get PauseScore() {
    return this.Model.PauseScore;
  }

  get FreePauseCount() {
    return Math.max(0, FreePauseLimit - this.Model.PauseCount);
  }

  private bindSignal() {}

  /** 初始化随机主题 */
  initGametheme() {
    StartInitMapSignal.inst.dispatch();
    this.Model.initGametheme();
  }

  getTotalScore() {
    return this.Model.TotalScore;
  }

  addPauseCount() {
    this.Model.addPauseCount();
  }

  setTotalTime(time: number) {
    this.Model.Time = time;
    UpdateTimeNumber.inst.dispatchTwo(this.Model.Time, 0);
  }

  private hasStartCount: boolean = false;
  /**
   *
   * @param dt 负数
   * @returns
   */
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
    this.Model.Time += dt;
    this.Model.addScaleCountDown(dt);

    if (FlyCnicornAd.ShowTimeRest > 0) {
      FlyCnicornAd.ShowTimeRest += dt;
      if (FlyCnicornAd.ShowTimeRest <= 0) {
        ShowFlyCnicornSignal.inst.dispatch();
      }
    }

    UpdateTimeNumber.inst.dispatchTwo(this.Model.Time, Math.abs(dt));
    TimeAnimationStateChanged.inst.dispatchOne(this.Model.Time <= 30);

    if (this.Model.Time <= 0) {
      this.Model.checkCompleteScore();
      GameStateController.inst.roundEnd(RoundEndType.TimeUp);
    }
  }

  getScoreByType(type: ScoreType) {
    return this.Model.getScoreByType(type);
  }

  dump() {
    this.Model.dump();
  }

  init() {
    this.Model.initGameData();
  }

  gameReadyToStart() {
    GameStartSignal.inst.dispatch();
    //GameStateController.inst.isReady = true;
    console.log("gameReadyToStart");
    WildButtonReadySignal.inst.dispatch();
  }

  gameReadyShow() {
    this.gameReadyToStart();
  }

  /*************************  Test ******************************* */

  testNextLevel() {
    if (this.Level >= GetTotalLevel()) {
      this.Level = 0;
    } else {
      // this.Model.addGoldCount(0);
      this.Level++;
      // if (this.Level >= GetTotalLevel()) {
      //   this.Level = 0;
      // }
    }
  }

  testScale(scale: number) {}

  testGameComplete() {
    //this.Model.MoveCount = 11;
    setTimeout(() => {
      GameStateController.inst.roundEnd(RoundEndType.Complete);
    }, 200);
  }

  testGameOver() {
    GameStateController.inst.roundEnd(RoundEndType.Over);
  }

  testTimeUp() {
    GameStateController.inst.roundEnd(RoundEndType.TimeUp);
  }

  testOutOfMove() {
    GameStateController.inst.roundEnd(RoundEndType.OutOfMove);
  }
}

!CELER_X && (window["Game"] = PlayModelProxy.inst);
