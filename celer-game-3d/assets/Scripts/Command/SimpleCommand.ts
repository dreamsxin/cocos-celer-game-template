export class BaseCommand {
  excute<T>(body?: T): void {}
}
export class SimpleCommand extends BaseCommand {}
