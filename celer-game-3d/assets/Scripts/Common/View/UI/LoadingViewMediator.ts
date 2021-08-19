import { _decorator, Component, Node } from "cc";
import { PlayModel } from "../../../Model/PlayModel";
import { GameReadySignal, ShowTutorialSignal } from "../../../Signal/Signal";
import { CelerSDK } from "../../SDK/CelerSDK";
import { BaseMediator } from "../BaseMediator";
import { LoadingView } from "./LoadingView";
const { ccclass, property } = _decorator;

@ccclass("LoadingViewMediator")
export class LoadingViewMediator extends BaseMediator<LoadingView> {
  private time = 1500;
  private startTime = 0;
  onRegister() {
    this.startTime = Date.now();

    GameReadySignal.inst.addOnce(this.onGameReady, this);
  }

  onGameReady() {
    let waitingTime = Date.now() - this.startTime;
    console.log(" -- game init done, hide loading page: ", waitingTime);
    if (waitingTime <= this.time) {
      setTimeout(() => {
        this.View.Hide(() => {
          this.startGame();
        });
      }, this.time - waitingTime);
    } else {
      this.View.Hide(() => {
        this.startGame();
      });
    }
  }

  startGame() {
    if (CelerSDK.inst.isNew()) {
      ShowTutorialSignal.inst.dispatch(() => {
        PlayModel.inst.gameReadyShow();
      });
    } else {
      PlayModel.inst.gameReadyShow();
    }
  }

  onDestroy() {}
}
