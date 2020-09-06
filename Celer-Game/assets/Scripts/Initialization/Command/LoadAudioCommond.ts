import { InitialFacade } from "../Facade/InitialFacade";
import { gAudio } from "../../Manager/AudioManager";

export class LoadAudioCommond extends puremvc.SimpleCommand {
  public static STEP: string = "LoadAudio";
  execute(notification: puremvc.INotification) {
    if (notification) {
      let body = notification.getBody<InitialFacade>();
      if (body && body.step) {
        gAudio.init(() => {
          body.step(LoadAudioCommond.STEP);
        })
      }
    }
  }
}
