import { MacroCommand } from "../Command/MacroCommand";
import { LoadAudioCommand } from "./LoadAudioCommand";
import { LoadJsonCommand } from "./LoadJsonCommand";
import { LoadPrefabCommand } from "./LoadPrefabCommand";

export class InitialCommand extends MacroCommand {
  initializeMacroCommand() {
    this.addSubCommond(LoadJsonCommand);
    this.addSubCommond(LoadAudioCommand);
    this.addSubCommond(LoadPrefabCommand);
  }
}
