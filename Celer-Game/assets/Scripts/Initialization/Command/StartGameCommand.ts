import { GameReadySignal } from "../../Command/CommonSignal";



const OpenTest = true;

export class StartGameCommand extends puremvc.SimpleCommand {
  execute(notification: puremvc.INotification) {
    console.log("--------- excute StartGameCommand ---------");


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

  }


  private normalInit() {

  }


}
