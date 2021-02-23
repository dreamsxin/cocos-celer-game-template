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
  private isDelay: boolean = false;
  constructor(model: PokerModel, state: PokerState) {
    this.model = model;
    this.state = state;
  }

  get State() {
    return this.state;
  }

  isFront() {
    return this.State == PokerState.Front;
  }

  turnBack() {
    this.State = PokerState.Back;
  }

  turnFront(isDelay: boolean = false) {
    this.isDelay = isDelay;
    this.State = PokerState.Front;
    this.isDelay = false;
  }

  set State(newState: PokerState) {
    if (newState == this.state) return;
    this.state = newState;
    PokerStateChangedSignal.inst.dispatchThree(
      this.model.ID,
      this.State,
      this.isDelay ? 1300 : 0
    );
  }
}
