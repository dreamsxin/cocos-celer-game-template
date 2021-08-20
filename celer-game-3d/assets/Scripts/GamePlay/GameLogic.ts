import { SingleTon } from "../Common/ToSingleTon";

export class GameLogic extends SingleTon<GameLogic>() {
  init() {}
}
CC_DEBUG && (window["Logic"] = GameLogic.inst);
