import { LoadPrefabCommand } from "./LoadPrefabCommand";
import { LoadAudioCommand } from "./LoadAudioCommand";
import { LoadJsonCommand } from "./LoadJsonCommand";

export class InitialCommand extends puremvc.MacroCommand {
  initializeMacroCommand() {
    this.addSubCommand(LoadPrefabCommand);
    this.addSubCommand(LoadAudioCommand);
    this.addSubCommand(LoadJsonCommand);
  }
}
