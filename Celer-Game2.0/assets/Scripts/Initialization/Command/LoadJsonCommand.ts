import { StartBindAtlasSignal } from "../../App/App";
import { PolygonDataModel } from "../../Model/PolygonDataModel";
import { TableManager } from "../../TableManager";
import { InitialFacade } from "../Facade/InitialFacade";

export class LoadJsonCommand extends puremvc.SimpleCommand {
  public static STEP: string = "LoadJson";
  execute(notification: puremvc.INotification) {
    this.count = 0;
    this.notification = notification;
    TableManager.inst.startLoad("/json", () => {
      StartBindAtlasSignal.inst.dispatch();
      this.addCount();
    });

    PolygonDataModel.inst.load("/polygonData/polygon", () => {
      this.addCount();
    });
  }

  private count = 0;
  private notification: puremvc.INotification;
  private addCount() {
    this.count++;
    if (this.notification && this.count >= 2) {
      let body = this.notification.getBody<InitialFacade>();
      if (body && body.step) {
        body.step(LoadJsonCommand.STEP);
      }
    }
  }
}
