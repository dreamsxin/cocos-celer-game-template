import { GameReadySignal } from "../../Command/CommonSignal";
import { PlayModelProxy } from "../../Model/PlayModelProxy";

const OpenTest = !CELER_X;

export class StartGameCommand extends puremvc.SimpleCommand {
  execute(notification: puremvc.INotification) {
    console.log("--------- excute StartGameCommand ---------");
    PlayModelProxy.inst.init();
    PlayModelProxy.inst.initGametheme();
    // // 初始化完成
    GameReadySignal.inst.dispatch();
  }
}
