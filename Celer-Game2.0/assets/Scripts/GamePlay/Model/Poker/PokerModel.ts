import { HashMap } from "../../../Utils/HashMap";
import { BaseSignal } from "../../../Utils/Signal";
import { LockStateChangedSignal } from "../../View/Poker/PokerLockView";
import { ParentType, PokerParent, PokerParentModel } from "./PokerParentModel";
import { PokerPositionModel } from "./PokerPositionModel";
import { PokerState, PokerStateModel } from "./PokerStateModel";

export enum PokerType {
  Spade,
  Club,
  Diamond,
  Heart,
}

/** 牌 */
export enum Poker {
  $_A = 1,
  $_2,
  $_3,
  $_4,
  $_5,
  $_6,
  $_7,
  $_8,
  $_9,
  $_10,
  $_J,
  $_Q,
  $_K,
}

export enum PokerColor {
  Black,
  Red,
}

export class PokerRemovedSignal extends BaseSignal {}
export class PokerCreatedSignal extends BaseSignal {}
export class PokerSelectedSignal extends BaseSignal {}

export class PokerModel {
  private static count: number = 0;
  private static pokerMap: HashMap<string, PokerModel> = new HashMap();
  private position: PokerPositionModel = null;
  private parent: PokerParentModel = null;
  private state: PokerStateModel = null;
  private id: string = "";
  private point: Poker = null;
  private type: PokerType = null;
  private index: number = 0;
  private offset: number = 0;
  private offsetFront: number = 0;
  private isLock: boolean = false;

  constructor(point: Poker, type: PokerType, parent: PokerParent) {
    this.id = PokerModel.count++ + "-" + Poker[point] + "-" + PokerType[type];
    this.point = point;
    this.type = type;
    this.parent = new PokerParentModel(this, parent);
    this.position = new PokerPositionModel(this);
    this.state = new PokerStateModel(this, PokerState.Back);
    PokerModel.pokerMap.add(this.id, this);
    PokerCreatedSignal.inst.dispatchOne(this);
  }

  get ID() {
    return this.id;
  }

  get State() {
    return this.state;
  }

  get Parent() {
    return this.parent;
  }

  get Position() {
    return this.position;
  }

  get Type() {
    return this.type;
  }

  get Point() {
    return this.point;
  }

  get Index() {
    return this.index;
  }

  set Index(index: number) {
    this.index = index;
  }

  get Offset() {
    return this.offset;
  }

  set Offset(offset: number) {
    this.offset = offset;
  }

  get OffsetFront() {
    return this.offsetFront;
  }

  set OffsetFront(offset: number) {
    this.offsetFront = offset;
  }

  get Color() {
    return this.type == PokerType.Spade || this.type == PokerType.Club
      ? PokerColor.Black
      : PokerColor.Red;
  }

  get Lock() {
    return this.isLock;
  }

  set Lock(lock: boolean) {
    if (this.isLock == lock) return;
    this.isLock = lock;
    LockStateChangedSignal.inst.dispatchTwo(this.ID, this.isLock);
  }

  setParent(parent: PokerParent) {
    this.parent.Parent = parent;
    this.position.updatePosition();
  }

  isOnDraw() {
    return this.parent.Parent == PokerParent.Draw;
  }

  isOnRecycle() {
    return this.parent.ParentType == ParentType.Recycle;
  }

  turnFront(isDelay: boolean = false) {
    this.state.turnFront(isDelay);
  }

  turnBack() {
    this.state.turnBack();
  }

  removeSelf() {
    PokerRemovedSignal.inst.dispatchOne(this.ID);
    PokerModel.pokerMap.remove(this.ID);
  }
}
