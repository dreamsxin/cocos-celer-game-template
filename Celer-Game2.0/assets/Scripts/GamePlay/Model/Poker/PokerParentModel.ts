import { BaseSignal } from "../../../Utils/Signal";
import { PokerModel } from "./PokerModel";

export enum PokerParent {
  Recycle,
  Draw,
  Ready,
  Desk0,
  Desk1,
  Desk2,
  Desk3,
  Desk4,
  Desk5,
  Desk6,
  Desk7,
  Removed,
}

export enum ParentType {
  Desk,
  Recycle,
  Draw,
  Ready,
  Removed,
}

export const DeskParents = [
  PokerParent.Desk0,
  PokerParent.Desk1,
  PokerParent.Desk2,
  PokerParent.Desk3,
  PokerParent.Desk4,
  PokerParent.Desk5,
  PokerParent.Desk6,
  PokerParent.Desk7,
];

export const RecycleParents = [PokerParent.Recycle];

export class PokerParentChangedSignal extends BaseSignal {}
export class PokerParentModel {
  private model: PokerModel = null;
  private parent: PokerParent = null;
  private oldParent: PokerParent = null;
  constructor(model: PokerModel, parent: PokerParent) {
    this.model = model;
    this.parent = parent;
    this.oldParent = parent;
  }

  get Parent() {
    return this.parent;
  }

  get OldParent() {
    return this.oldParent;
  }

  set Parent(newParent: PokerParent) {
    if (this.parent == newParent) return;
    this.oldParent = this.parent;
    this.parent = newParent;
    if (this.ParentType != ParentType.Desk) {
      this.model.Lock = false;
    }
    PokerParentChangedSignal.inst.dispatchTwo(this.model.ID, this.parent);
  }

  sync() {
    this.oldParent = this.parent;
  }

  get ParentType() {
    if (DeskParents.indexOf(this.parent) >= 0) {
      return ParentType.Desk;
    }

    if (RecycleParents.indexOf(this.Parent) >= 0) {
      return ParentType.Recycle;
    }

    if (this.Parent == PokerParent.Draw) return ParentType.Draw;

    if (this.Parent == PokerParent.Ready) return ParentType.Ready;

    if (this.Parent == PokerParent.Removed) return ParentType.Removed;
  }
}
