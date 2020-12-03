import { GameStateController } from "../../../Controller/GameStateController";
// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import SingleTouchView from "../../../View/SingleTouchView";
import { SubmitButtonClickSignal } from "../../Command/GamePlaySignal";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SubmitButtonView extends SingleTouchView {


    onTouchEnd() {
        if (GameStateController.inst.isGameOver() || GameStateController.inst.isRoundStart() == false) return;
        SubmitButtonClickSignal.inst.dispatchOne(this.node.name == "Submit");
    }
}
