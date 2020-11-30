// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { ButtonClickSignal } from "../../../Command/CommonSignal";
import { GameStateController } from "../../../Controller/GameStateController";
import { BaseSignal } from "../../../Utils/Signal";
import SingleTouchView from "../../../View/SingleTouchView";

const { ccclass, property } = cc._decorator;

export class MenuButtonClickSignal extends BaseSignal {}
@ccclass
export default class MenuButtonView extends SingleTouchView {
  onLoad() {
    super.onLoad();
  }

  onTouchEnd() {
    if (GameStateController.inst.isGameOver()) return;

    MenuButtonClickSignal.inst.dispatch();
    ButtonClickSignal.inst.dispatch();
  }
  start() {}
}
