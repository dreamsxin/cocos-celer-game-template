import { BaseCommand } from "./SimpleCommand";

export class Notification {
  private notification: { [key: string]: BaseCommand } = {};
  register(notificationName: string, command: typeof BaseCommand) {
    if (this.notification[notificationName]) {
      console.error(notificationName, " is already exist.");
    }

    this.notification[notificationName] = new command();
  }

  sendNotification<T>(notificationName: string, body: T) {
    if (this.notification[notificationName]) {
      this.notification[notificationName].excute(body);
      this.notification[notificationName] = null;
    }
  }
}
