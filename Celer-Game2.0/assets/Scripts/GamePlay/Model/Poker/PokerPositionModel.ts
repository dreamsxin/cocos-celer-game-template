import { BaseSignal } from "../../../Utils/Signal";
import { PokerModel } from "./PokerModel";
import { DeskParents, ParentType, RecycleParents } from "./PokerParentModel";

export enum MoveType {
  Drag,
  Normal,
}

export class PokerPositionChangedSignal extends BaseSignal {}
export class PokerPositionModel {
  private model: PokerModel = null;

  private position: cc.Vec2 = cc.v2(0, 0);

  private movedDetal: cc.Vec2 = cc.v2(0, 0);

  private rootOffset: cc.Vec2 = cc.v2(0, 0);

  constructor(model: PokerModel) {
    this.model = model;
  }

  get Position() {
    return this.position.add(this.rootOffset);
  }

  get MovingPosition() {
    return this.Position.add(this.movedDetal);
  }

  updatePosition() {
    this.movedDetal = cc.v2(0, 0);
    switch (this.model.Parent.ParentType) {
      case ParentType.Desk:
        this.updateDeskRootOffset(
          DeskParents.indexOf(this.model.Parent.Parent)
        );
        this.setPosition(
          0,
          0 - this.model.Index * this.model.Offset - this.model.OffsetFront
        );
        break;
      case ParentType.Ready:
        this.updateReadyRootOffset();
        this.setPosition(0 + this.model.Offset, 0);
        break;

      case ParentType.Draw:
        //  this.rootOffset = cc.v2(0, -this.model.Index * 40);
        this.rootOffset = cc.v2(0, -this.model.Index * 1);
        this.setPosition(0, 0);
        break;
      case ParentType.Recycle:
        this.updateRecycleRootOffset(
          RecycleParents.indexOf(this.model.Parent.Parent)
        );
        this.setPosition(0, 0);
        break;
    }
  }

  updateReadyRootOffset() {
    let start = cc.v2(375, -624.155);
    let offset = 375 - 356;
    this.rootOffset = cc.v2(start.sub(cc.v2(offset * this.model.Index, 0)));
  }

  updateRecycleRootOffset(recycleIndex: number) {
    this.rootOffset = this.getRecycleRootPos(recycleIndex);
  }

  updateDeskRootOffset(deskIndex: number) {
    this.rootOffset = this.getDeskRootPos(deskIndex);
  }

  getDeskRootPos(deskIndex: number) {
    let start = cc.v2(-455, 693.738);
    let offset = 455 - 324;
    return cc.v2(start.add(cc.v2(offset * deskIndex, 0)));
  }

  getRecycleRootPos(recycleIndex: number) {
    let start = cc.v2(-911.565, 0);
    let offset = -768.321 + 911.565;
    return cc.v2(start.add(cc.v2(offset * recycleIndex, 0)));
  }

  private setPosition(x: number, y: number) {
    this.position = cc.v2(x, y);
    PokerPositionChangedSignal.inst.dispatchThree(
      this.model.ID,
      this.Position,
      MoveType.Normal
    );
  }

  onMoved(deltaOffset: cc.Vec2) {
    this.movedDetal.addSelf(deltaOffset);
    PokerPositionChangedSignal.inst.dispatchThree(
      this.model.ID,
      this.Position.add(this.movedDetal),
      MoveType.Drag
    );
  }

  onMovedEnd() {
    if (this.movedDetal.x == 0 && this.movedDetal.y == 0) return;
    this.movedDetal.x = 0;
    this.movedDetal.y = 0;
    PokerPositionChangedSignal.inst.dispatchThree(
      this.model.ID,
      this.Position,
      MoveType.Normal
    );
  }
}
