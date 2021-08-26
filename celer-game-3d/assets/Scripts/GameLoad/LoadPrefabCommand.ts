import { SimpleCommand } from "../Command/SimpleCommand";
import { PrefabFactory } from "../Factory/PrefabFactory";
import { InitialFacade } from "./InitialFacade";

export class LoadPrefabCommand extends SimpleCommand {
  public static STEP = "Prefab";
  excute() {
    InitialFacade.inst.startStep(LoadPrefabCommand.STEP);
    PrefabFactory.inst.init(() => {
      InitialFacade.inst.step(LoadPrefabCommand.STEP);
    });
  }
}
