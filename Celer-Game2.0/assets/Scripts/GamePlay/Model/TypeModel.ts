import { Random_ID, Random_Pool } from "../../table";

export class TypeModel {
  /** 大类 */
  private type: Random_ID = null;
  /** 子类 */
  private subType: Random_Pool = null;

  constructor(type: number, subType: number) {
    this.subType = subType;
    this.type = type;
  }

  /** 获取大类 */
  get Type() {
    return this.type;
  }

  /** 获取子类 */
  get SubType() {
    return this.subType;
  }
}
