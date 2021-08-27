import { SingleTon } from "../Common/ToSingleTon";
import { PlayModel } from "../Model/PlayModel";
import { GameOverSignal, GamePauseSignal } from "../Signal/Signal";

export enum RoundEndType {
  Complete,
  Over,
  TimeUp,
  OutOfMove,
}

export class GameStateController extends SingleTon<GameStateController>() {
  private pauseCount: number = 0;

  private roundstart: boolean = false;

  public isReady: boolean = false;

  private isOver: boolean = false;

  private currentRound: number = 0;

  private onResumeCallbacks: Function[] = [];

  start() {
    this.pauseCount = 0;
  }

  canStart() {
    return this.isReady;
  }

  roundStart() {
    if (this.isOver) return;

    console.log(" round start:", ++this.currentRound);
    this.roundstart = true;
  }

  roundEnd(type: RoundEndType) {
    console.log("round end :", RoundEndType[type]);
    this.roundstart = false;
    this.isOver = true;

    GameOverSignal.inst.dispatch(type);
  }

  isRoundStart() {
    return this.roundstart;
  }

  pause(isFree: boolean = false) {
    if (this.isPause() == false) {
      this.onResumeCallbacks.length = 0;

      GamePauseSignal.inst.dispatch();

      if (!isFree) {
        this.onResumeCallbacks.push(() => {
          PlayModel.inst.addPauseCount();
        });
      }
    }

    this.pauseCount++;
  }

  testEndComplete() {
    this.roundEnd(RoundEndType.Complete);
  }

  testEndTimeUp() {
    PlayModel.inst.addGameTime(-1000000000000);
  }

  clearResumeCallback() {
    this.onResumeCallbacks.length = 0;
  }

  resume() {
    this.pauseCount--;
    console.assert(this.pauseCount >= 0, " pause count smaller than 0!!!");
    this.pauseCount = Math.max(this.pauseCount, 0);
    if (this.pauseCount <= 0) {
      for (let callback of this.onResumeCallbacks) {
        callback();
      }
      this.onResumeCallbacks.length = 0;
    }
  }

  isPause() {
    return this.pauseCount > 0;
  }

  addResumeCallback(callback: Function) {
    if (!this.onResumeCallbacks) this.onResumeCallbacks = [];
    this.onResumeCallbacks.push(callback);
  }

  isGameOver() {
    return this.isOver;
  }

  /** 是否可以交互 */
  canInteractive() {
    return !(
      GameStateController.inst.isPause() ||
      GameStateController.inst.isGameOver() ||
      !GameStateController.inst.isRoundStart()
    );
  }
}

!CELER_X && (window["GameState"] = GameStateController.inst);
