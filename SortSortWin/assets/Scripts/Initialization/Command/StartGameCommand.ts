import { GameReadySignal } from "../../Command/CommonSignal";
import { PlayModelProxy } from "../../Model/PlayModelProxy";

const OpenTest = true;

export class StartGameCommand extends puremvc.SimpleCommand {
  execute(notification: puremvc.INotification) {
    console.log("--------- excute StartGameCommand ---------");

    PlayModelProxy.inst.initGametheme();

    if (CC_DEBUG && OpenTest) {
      this.testInit();
    } else {
      this.normalInit();
    }

    // 初始化完成
    GameReadySignal.inst.dispatch();
  }

  /** debug */
  private testInit() {
    PlayModelProxy.inst.init();
  }

  private normalInit() {
    PlayModelProxy.inst.init();
  }
}
