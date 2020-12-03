// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { BaseSignal } from "../../../Utils/Signal";
import NumberChangedView from "../../../View/NumberChangedView";

const { ccclass, property } = cc._decorator;

export class MoveCountChangedSignal extends BaseSignal {}
@ccclass
export default class MoveCountLabelView extends NumberChangedView {
  onLoad() {
    super.onLoad();

    MoveCountChangedSignal.inst.addListenerOne(this.onNumberChanged, this);
  }
}
