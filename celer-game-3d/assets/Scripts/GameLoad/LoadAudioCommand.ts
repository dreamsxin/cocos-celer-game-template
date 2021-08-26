import { SimpleCommand } from "../Command/SimpleCommand";
import { AudioController } from "../Manager/AudioManager";
import { InitialFacade } from "../GameLoad/InitialFacade";

export class LoadAudioCommand extends SimpleCommand {
  public static STEP = "Audio";
  excute() {
    InitialFacade.inst.startStep(LoadAudioCommand.STEP);
    AudioController.inst.init(() => {
      InitialFacade.inst.step(LoadAudioCommand.STEP);
    });
  }
}
