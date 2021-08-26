import { SingleTon } from "../Common/ToSingleTon";
import { GameReadySignal } from "../Signal/Signal";

export class GameLogic extends SingleTon<GameLogic>() {
  init() {
    GameReadySignal.inst.dispatch();
  }
}
CC_DEBUG && (window["Logic"] = GameLogic.inst);
