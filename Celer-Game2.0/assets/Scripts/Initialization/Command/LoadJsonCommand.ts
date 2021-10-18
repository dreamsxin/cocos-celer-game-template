import { StartBindAtlasSignal } from "../../App/App";
import { GameLogic } from "../../GamePlay/Model/GameLogic";
import {
  CountPerLevelFloor,
  GetCollectCount,
  GetTotalLevel,
  GetTypeCount,
} from "../../Global/GameRule";
import { PolygonDataModel } from "../../Model/PolygonDataModel";
import { Animals, Class_ID, Random_ID, Random_Pool } from "../../table";
import { TableManager } from "../../TableManager";
import { CelerSDK } from "../../Utils/Celer/CelerSDK";
import { disOrderArray } from "../../Utils/Cocos";
import {
  InitialFacade,
  UpdateInitLoadingSignal,
} from "../Facade/InitialFacade";

export class LoadJsonCommand extends puremvc.SimpleCommand {
  public static STEP: string = "LoadJson";
  private percent: number = 0;
  execute(notification: puremvc.INotification) {
    this.count = 0;
    this.notification = notification;
    TableManager.inst.startLoad(
      "/json",
      () => {
        CelerSDK.inst.defineLan();
        this.addCount();
      },
      (progress: number) => {
        // CC_DEBUG && console.log("GameData:", progress);
        UpdateInitLoadingSignal.inst.dispatchOne(
          (1 / this.Total / InitialFacade.TOTAL_STEPS.length) *
            (progress - this.percent)
        );
        this.percent = progress;
      }
    );
  }

  private count = 0;
  private Total = 1;
  private notification: puremvc.INotification;
  private addCount() {
    let body = this.notification.getBody<InitialFacade>();

    this.count++;
    if (this.notification && this.count >= this.Total) {
      GameLogic.inst.initData();

      if (body && body.step) {
        body.step(LoadJsonCommand.STEP);
      }
    }
  }
}
