import { BaseSignal } from "../../../Utils/Signal";
import { PokerModel } from "./PokerModel";

export enum PokerParent {}

export class PokerParentChangedSignal extends BaseSignal {}
export class PokerParentModel {
  private model: PokerModel = null;
  private parent: PokerParent = null;
  constructor(model: PokerModel) {
    this.model = model;
  }

  get Parent() {
    return this.parent;
  }

  set Parent(newParent: PokerParent) {
    if (this.parent == newParent) return;
    this.parent = newParent;
    PokerParentChangedSignal.inst.dispatchTwo(this.model.ID, this.parent);
  }
}
