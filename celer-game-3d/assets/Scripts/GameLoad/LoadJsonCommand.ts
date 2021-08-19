import { SimpleCommand } from "../Command/SimpleCommand";

export class LoadJsonCommand extends SimpleCommand {
  public static STEP = "Json";
  excute<InitialFacade>(body: InitialFacade) {}
}
