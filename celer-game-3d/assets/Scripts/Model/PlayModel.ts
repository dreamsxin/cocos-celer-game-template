import { SingleTon } from "../Common/ToSingleTon";
import { ScoreType, Theme } from "../GamePlay/GameRule";
import { GameStateController } from "../Manager/GameStateController";
import { ShowFlyCnicornSignal, StartCountSignal } from "../Signal/Signal";

export class PlayModel extends SingleTon<PlayModel>() {
  private constructor() {
    super();
    this.bindSignal();
  }

  private theme: Theme = null;
  get Theme() {
    return this.theme;
  }

  private playerScore: number = 0;
  private noviceScore: number = 0;
  private gameTime: number = 0;
  private level: number = 0;
  private pauseCount: number = 0;
  private playerScoreMap: { [key: number]: number } = {};
  private streak: number = 0;
  private totalStreak: number = 0;
  private maxStreak: number = 0;
  private isGameOver: boolean = false;
  private hasStartCount: boolean = false;

  get Time() {
    return this.gameTime;
  }

  private set Time(val: number) {
    this.gameTime = val;
    this.gameTime = Math.max(0, this.gameTime);
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
    if (FlyCnicornAd.ShowTimeRest > 0) {
      FlyCnicornAd.ShowTimeRest += dt;
      if (FlyCnicornAd.ShowTimeRest <= 0) {
        ShowFlyCnicornSignal.inst.dispatch();
      }
    }
  }

  private bindSignal() {}

  getTotalScore() {
    return 0;
  }

  setTotalTime(time: number) {}

  addPauseCount() {}

  gameReadyShow() {}
}
