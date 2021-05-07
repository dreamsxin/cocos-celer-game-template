import { GameReadySignal } from "../../Command/CommonSignal";
import { PlayModelProxy } from "../../Model/PlayModelProxy";

const OpenTest = !CELER_X;

export class StartGameCommand extends puremvc.SimpleCommand {
  execute(notification: puremvc.INotification) {
    console.log("--------- excute StartGameCommand ---------");

    PlayModelProxy.inst.initGametheme();

    if (CC_DEBUG && OpenTest) {
      this.testInit();
    } else {
      this.normalInit();
    }

    // // 初始化完成
    GameReadySignal.inst.dispatch();
  }

  /** debug */
  private testInit() {
    console.log("test init .");
    PlayModelProxy.inst.init();
  }

  private normalInit() {
    console.log("normal init .");
    PlayModelProxy.inst.init();
  }
}
