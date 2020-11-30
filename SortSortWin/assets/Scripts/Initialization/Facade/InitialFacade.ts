import { InitialCommand } from "../Command/InititalCommand";
import { StartGameCommand } from "../Command/StartGameCommand";
import { LoadAudioCommand } from "../Command/LoadAudioCommand";
import { LoadPrefabCommand } from "../Command/LoadPrefabCommand";
import { CelerSDK } from "../../Utils/Celer/CelerSDK";
import { StepManager } from "../../Manager/StepManager";

export class InitialFacade {
  public static MULTITON_KEY: string = "INITIAL_FCADE";

  private static INITIALIZATION: string = "initialization";
  private static START_UP: string = "startup";

  private static instance: InitialFacade;

  private facade: puremvc.Facade;

  private stepMgr: StepManager = new StepManager();

  public static get inst() {
    return this.instance
      ? this.instance
      : (this.instance = new InitialFacade(InitialFacade.MULTITON_KEY));
  }

  constructor(key: string) {
    this.facade = <puremvc.Facade>puremvc.Facade.getInstance(key);
  }

  get Facade() {
    console.assert(this.facade !== null, " facade is null");
    return this.facade;
  }

  private register() {
    this.facade.registerCommand(InitialFacade.INITIALIZATION, InitialCommand);
    this.facade.registerCommand(InitialFacade.START_UP, StartGameCommand);

    CelerSDK.inst.init(() => {
      this.facade.sendNotification(InitialFacade.START_UP, this);
    });


    this.stepMgr.register(() => {
      CelerSDK.inst.celerXReady();
    }, InitialFacade.TOTAL_STEPS);

  }

  private unregister() {
    this.facade.removeCommand(InitialFacade.INITIALIZATION);
    this.facade.removeCommand(InitialFacade.START_UP);
  }

  start() {
    this.register();

    this.facade.sendNotification(InitialFacade.INITIALIZATION, this);
  }



  private static TOTAL_STEPS: string[] = [
    LoadAudioCommand.STEP,
    LoadPrefabCommand.STEP,
  ];


  step(commandName: string) {
    console.log(" initialization step:", commandName);

    this.stepMgr.nextStep(commandName);

  }
}
