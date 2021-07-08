import {
  InitialFacade,
  UpdateInitLoadingSignal,
} from "../Facade/InitialFacade";
import { gAudio } from "../../Manager/AudioManager";

export class LoadAudioCommand extends puremvc.SimpleCommand {
  public static STEP: string = "LoadAudio";
  private percent: number = 0;
  execute(notification: puremvc.INotification) {
    if (notification) {
      let body = notification.getBody<InitialFacade>();
      if (body && body.step) {
        gAudio.init(
          () => {
            body.step(LoadAudioCommand.STEP);
          },
          (percent: number) => {
            CC_DEBUG && console.log("Audio:", percent);
            UpdateInitLoadingSignal.inst.dispatchOne(
              (1 / InitialFacade.TOTAL_STEPS.length) * (percent - this.percent)
            );
            this.percent = percent;
          }
        );
      }
    }
  }
}
