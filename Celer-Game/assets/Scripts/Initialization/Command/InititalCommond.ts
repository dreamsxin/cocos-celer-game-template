import { LoadPrefabCommond } from "./LoadPrefabCommond";
import { LoadAudioCommond } from "./LoadAudioCommond";

export class InitialCommond extends puremvc.MacroCommand {

    initializeMacroCommand() {
        this.addSubCommand(LoadPrefabCommond);
        this.addSubCommand(LoadAudioCommond);
    }
}
