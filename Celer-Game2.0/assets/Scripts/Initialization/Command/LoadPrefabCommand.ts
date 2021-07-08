import {
  InitialFacade,
  UpdateInitLoadingSignal,
} from "../Facade/InitialFacade";
import { gFactory } from "../../Factory/GameFactory";

export class LoadPrefabCommand extends puremvc.SimpleCommand {
  public static STEP: string = "LoadPrefab";
  private percent: number = 0;
  execute(notification: puremvc.INotification) {
    gFactory.init(
      () => {
        if (notification) {
          let body = notification.getBody<InitialFacade>();
          if (body && body.step) {
            body.step(LoadPrefabCommand.STEP);
          }
        }
      },
      (percent: number) => {
        CC_DEBUG && console.log("Prefab:", percent);
        UpdateInitLoadingSignal.inst.dispatchOne(
          (1 / InitialFacade.TOTAL_STEPS.length) * (percent - this.percent)
        );
        this.percent = percent;
      }
    );
  }
}
