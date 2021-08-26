import { SimpleCommand } from "../Command/SimpleCommand";
import { PlayModel } from "../Model/PlayModel";

export class StartupCommand extends SimpleCommand {
  excute() {
    console.log("start up.");
    PlayModel.inst.init();
  }
}
