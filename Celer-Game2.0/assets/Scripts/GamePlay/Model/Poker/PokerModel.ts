import { PokerParentModel } from "./PokerParentModel";
import { PokerPositionModel } from "./PokerPositionModel";
import { PokerStateModel } from "./PokerStateModel";

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

export class PokerModel {
  private position: PokerPositionModel = null;
  private parent: PokerParentModel = null;
  private state: PokerStateModel = null;
  private id: string = "";
  private point: Poker = null;
  private type: PokerType = null;
  constructor() {}

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
}
