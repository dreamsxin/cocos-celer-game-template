import { SingleTon } from "../Utils/ToSingleton";
import {
  GameStateController,
  RoundEndType,
} from "../Controller/GameStateController";
import { GamePlayModel, ScoreType } from "../GamePlay/Model/GamePlayModel";
import {
  UpdateTimeNumber,
  TimeAnimationStateChanged,
} from "../Command/CommonSignal";
import { FreePauseLimit } from "../Global/GameRule";
import { PokerModel } from "../GamePlay/Model/Poker/PokerModel";

export class PlayModelProxy extends SingleTon<PlayModelProxy>() {
  private constructor() {
    super();
    this.bindSignal();
  }

  private playerModel: GamePlayModel = null;

  public isOnTutorial: boolean = false;

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

  get MoveCount() {
    return this.Model.MoveCount;
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
    this.Model.initGametheme();
  }

  getTotalScore() {
    return this.Model.TotalScore;
  }

  addPauseCount() {
    this.Model.addPauseCount();
  }

  addGameTime(dt: number) {
    if (
      GameStateController.inst.isPause() ||
      GameStateController.inst.isRoundStart() == false ||
      this.isOnTutorial
    ) {
      return;
    }

    this.Model.Time += dt;

    UpdateTimeNumber.inst.dispatchOne(this.Model.Time);
    TimeAnimationStateChanged.inst.dispatchOne(this.Model.Time <= 30);

    if (this.Model.Time <= 0) {
      this.Model.checkCompleteScore();
      GameStateController.inst.roundEnd(RoundEndType.TimeUp);
    }
  }

  getScoreByType(type: ScoreType) {
    return this.Model.getScoreByType(type);
  }

  checkIsShowFront(pokerModel: PokerModel): boolean {
    return this.Model.checkIsShowFront(pokerModel);
  }

  addPlayerScore(
    score: number,
    type: ScoreType,
    times: number,
    fromNode: cc.Node
  ) {
    this.Model.addPlayerScore(score, type, times, fromNode);
  }

  dump() {
    this.Model.dump();
  }

  init() {
    GameStateController.inst.setRoundStart(false);
    this.Model.initGameData();
  }

  initTutorial() {
    this.Model.initGameTutorial();
  }

  onCancel(ID: string) {
    this.Model.Logic.onCancel(ID);
  }

  onMoved(ID: string, detal: cc.Vec2) {
    this.Model.Logic.onMoved(ID, detal);
  }

  onMovedEnd(ID: string) {
    this.Model.Logic.onMovedEnd(ID);
  }
}

!CELER_X && (window["Game"] = PlayModelProxy.inst);
