import { AdFinishSignal, AdType } from "../../Ad/AdLayer";
import { HashMap } from "../../Utils/HashMap";
import { BaseSignal } from "../../Utils/Signal";
import { SingleTon } from "../../utils/ToSingleton";
import { TestReStartSignal } from "../../View/Test";

import { GamePlayModel } from "./GamePlayModel";

// enum Side {
//   Left,
//   Right,
//   Both,
// }

export class RestartCountSignal extends BaseSignal {}

export class ComboUpdateSignal extends BaseSignal {}

export class GameLogic extends SingleTon<GameLogic>() {
  private gamePlay: GamePlayModel = null;

  private restartCount: number = 0;

  private totalGoldCount: HashMap<number, number> = new HashMap();
  private combo: number = 0;

  get Combo() {
    return this.combo;
  }

  set Combo(val: number) {
    this.combo = val;
    this.combo = Math.min(this.combo, 7);
    ComboUpdateSignal.inst.dispatchOne(this.combo);
  }

  bindGamePlay(gamePlay: GamePlayModel) {
    this.gamePlay = gamePlay;
    if (!CELER_X) {
      TestReStartSignal.inst.addListener(this.restart, this);
    }

    AdFinishSignal.inst.addListenerOne(this.onAdFinish, this);
  }

  onAdFinish(adUnitId: string) {
    console.log(" ad finish:", adUnitId);

    if (adUnitId == AdType[AdType.Sun]) {
    } else {
    }
  }

  restart(isRestMap: boolean = false) {
    console.log("restart:", isRestMap);

    this.restartCount++;
    RestartCountSignal.inst.dispatchOne(this.restartCount);
  }
}

CC_DEBUG && (window["Logic"] = GameLogic.inst);
