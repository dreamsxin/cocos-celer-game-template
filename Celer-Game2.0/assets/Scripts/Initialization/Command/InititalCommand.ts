import { LoadPrefabCommand } from "./LoadPrefabCommand";
import { LoadAudioCommand } from "./LoadAudioCommand";

export class InitialCommand extends puremvc.MacroCommand {

    initializeMacroCommand() {
        this.addSubCommand(LoadPrefabCommand);
        this.addSubCommand(LoadAudioCommand);
    }
}
