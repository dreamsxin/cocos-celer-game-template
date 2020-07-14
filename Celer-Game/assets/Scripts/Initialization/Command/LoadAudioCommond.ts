import { InitialFacade } from "../Facade/InitialFacade";

export class LoadAudioCommond extends puremvc.SimpleCommand {
  public static STEP: string = "LoadAudio";
  execute(notification: puremvc.INotification) {
    if (notification) {
      let body = notification.getBody<InitialFacade>();
      if (body && body.step) {
        body.step(LoadAudioCommond.STEP);
      }
    }
  }
}
