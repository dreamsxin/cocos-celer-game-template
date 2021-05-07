import { TableManager } from "../../TableManager";
import { InitialFacade } from "../Facade/InitialFacade";

export class LoadJsonCommand extends puremvc.SimpleCommand {
  public static STEP: string = "LoadJson";
  execute(notification: puremvc.INotification) {
    TableManager.inst.startLoad("/json", () => {
      if (notification) {
        let body = notification.getBody<InitialFacade>();
        if (body && body.step) {
          body.step(LoadJsonCommand.STEP);
        }
      }
    });
  }
}
