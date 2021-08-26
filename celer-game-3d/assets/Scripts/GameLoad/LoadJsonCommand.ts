import { SimpleCommand } from "../Command/SimpleCommand";
import { TableManager } from "../TableManager";
import { InitialFacade } from "./InitialFacade";

export class LoadJsonCommand extends SimpleCommand {
  public static STEP = "Json";
  excute() {
    InitialFacade.inst.startStep(LoadJsonCommand.STEP);
    TableManager.inst.startLoad("/json", () => {
      InitialFacade.inst.step(LoadJsonCommand.STEP);
    });
  }
}
