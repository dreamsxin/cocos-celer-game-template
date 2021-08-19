import { BaseCommand, SimpleCommand } from "./SimpleCommand";

export class MacroCommand extends BaseCommand {
  private commands: SimpleCommand[] = [];
  protected initializeMacroCommand() {}

  protected addSubCommond(command: typeof SimpleCommand) {
    this.commands.push(new command());
  }

  excute<T>(body?: T) {
    for (let subCommand of this.commands) {
      subCommand.excute(body);
    }

    this.commands.length = 0;
  }
}
