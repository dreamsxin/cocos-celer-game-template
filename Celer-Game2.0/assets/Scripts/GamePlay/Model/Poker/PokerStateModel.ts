import { BaseSignal } from "../../../Utils/Signal";
import { PokerModel } from "./PokerModel";

export enum PokerState {
  Front,
  Back,
}

export class PokerStateChangedSignal extends BaseSignal {}

export class PokerStateModel {
  private model: PokerModel = null;
  private state: PokerState = null;
  constructor(model: PokerModel) {
    this.model = model;
  }

  get State() {
    return this.state;
  }

  set State(newState: PokerState) {
    if (newState == this.state) return;
    this.state = newState;
    PokerStateChangedSignal.inst.dispatchTwo(this.model.ID, this.State);
  }
}
