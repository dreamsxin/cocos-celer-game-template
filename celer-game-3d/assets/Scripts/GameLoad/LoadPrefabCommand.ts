import { SimpleCommand } from "../Command/SimpleCommand";
import { InitialFacade } from "./InitialFacade";

export class LoadPrefabCommand extends SimpleCommand {
  public static STEP = "Prefab";
  excute<InitialFacade>(body: InitialFacade) {}
}
