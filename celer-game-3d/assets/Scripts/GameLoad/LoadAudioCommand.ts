import { SimpleCommand } from "../Command/SimpleCommand";

export class LoadAudioCommand extends SimpleCommand {
  public static STEP = "Audio";
  excute<InitialFacade>(body: InitialFacade) {}
}
