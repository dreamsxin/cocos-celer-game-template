import { BaseSignal } from "../../../Utils/Signal";
import { PokerModel } from "./PokerModel";

export class PokerPositionChangedSignal extends BaseSignal {}
export class PokerPositionModel {
  private model: PokerModel = null;

  private position: cc.Vec2 = null;

  constructor(model: PokerModel) {
    this.model = model;
  }

  get Position() {
    return this.position;
  }

  private setPosition(x: number, y: number) {
    let isDirty: boolean = false;
    if (this.position == null) {
      this.position = cc.v2(x, y);
      isDirty = true;
    } else {
      if (this.position.x != x || this.position.y != y) {
        this.position = cc.v2(x, y);
        isDirty = true;
      } else {
      }
    }

    if (isDirty) {
      PokerPositionChangedSignal.inst.dispatchTwo(this.model.ID, this.Position);
    }
  }

  updatePosition() {}
}
