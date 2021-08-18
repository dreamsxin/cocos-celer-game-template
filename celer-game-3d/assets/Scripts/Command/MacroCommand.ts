import { SimpleCommand } from "./SimpleCommand";

export class MacroCommand {
  private commands: SimpleCommand[] = [];
  protected initializeMacroCommand() {}

  excute() {
    for (let subCommand of this.commands) {
      subCommand.excute();
    }

    this.commands.length = 0;
  }
}
