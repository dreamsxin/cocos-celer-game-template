import { Notification } from "../Command/Notification";
import { CelerSDK } from "../Common/SDK/CelerSDK";
import { SingleTon } from "../Common/ToSingleTon";
import { StepManager } from "../Manager/StepManager";
import { InitialCommand } from "./InitialCommand";
import { LoadAudioCommand } from "./LoadAudioCommand";
import { LoadJsonCommand } from "./LoadJsonCommand";
import { LoadPrefabCommand } from "./LoadPrefabCommand";
import { StartupCommand } from "./StartupCommand";

export class InitialFacade extends SingleTon<InitialFacade>() {
  private stepManager: StepManager = new StepManager();
  private notification: Notification = new Notification();

  private static INIT: string = "Initialization";
  private static START: string = "StartUp";
  /**
   * == true: 先ready后收到onstart后再加载资源, 可以避免预加载时加载游戏资源浪费时间，因为第二次正真进游戏还得加载一次
   */
  private static CelerFirst: boolean = true;
  public static TOTAL_STEPS: string[] = [
    LoadAudioCommand.STEP,
    LoadPrefabCommand.STEP,
    LoadJsonCommand.STEP,
  ];

  startStep(step: string) {
    this.stepManager.start(step);
  }

  private register() {
    this.notification.register(InitialFacade.INIT, InitialCommand);
    this.notification.register(InitialFacade.START, StartupCommand);

    if (InitialFacade.CelerFirst) {
      /** 先celer ready 后再加载游戏内资源 */
      CelerSDK.inst.init(() => {
        this.notification.sendNotification(InitialFacade.INIT, this);
      });

      this.stepManager.register(() => {
        this.notification.sendNotification(InitialFacade.START, this);
      }, InitialFacade.TOTAL_STEPS);
    } else {
      /** 先加载所有资源后再调用celer ready */
      CelerSDK.inst.init(() => {
        this.notification.sendNotification(InitialFacade.START, this);
      });

      this.stepManager.register(() => {
        CelerSDK.inst.celerXReady();
      }, InitialFacade.TOTAL_STEPS);
    }
  }

  start() {
    this.register();
    if (InitialFacade.CelerFirst) {
      CelerSDK.inst.celerXReady();
    } else {
      this.notification.sendNotification(InitialFacade.INIT, this);
    }
  }

  step(commandName: string) {
    console.log(" initialization step:", commandName);

    this.stepManager.nextStep(commandName);
  }
}
