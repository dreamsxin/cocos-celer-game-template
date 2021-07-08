import { Random_ID, Random_Pool } from "../../table";
import { BaseSignal } from "../../Utils/Signal";

export class UpdateMatchTimes extends BaseSignal {}
export class TypeModel {
  /** 大类 */
  private type: Random_ID = null;
  /** 子类 */
  private subType: Random_Pool = null;

  private matchTimes: number = 0;

  private index: number = 0;

  constructor(type: number, subType: number, index: number) {
    this.subType = subType;
    this.type = type;
    this.index = index;
  }

  /** 获取大类 */
  get Type() {
    return this.type;
  }

  /** 获取子类 */
  get SubType() {
    return this.subType;
  }

  get MatchTimes() {
    return this.matchTimes;
  }

  set MatchTimes(times: number) {
    this.matchTimes = times;
    UpdateMatchTimes.inst.dispatchTwo(this.index, this.matchTimes);
  }

  get Index() {
    return this.index;
  }
}
