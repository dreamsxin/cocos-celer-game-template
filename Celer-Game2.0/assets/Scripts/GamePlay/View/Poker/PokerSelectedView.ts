// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import BaseView from "../../../View/BaseView";
import { PokerModel, PokerSelectedSignal } from "../../Model/Poker/PokerModel";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PokerSelectedView extends BaseView {


    // LIFE-CYCLE CALLBACKS:
    private model: PokerModel = null;
    get Model() {
        return this.model;
    }

    get Selected() {
        return this.node.getChildByName("Selected")
    }

    onLoad() {

        PokerSelectedSignal.inst.addListenerTwo(this.onSelectedChanged, this);
    }

    start() {

    }

    onSelectedChanged(ID: string, selected: boolean) {


        if (!this.model || this.model.ID != ID) return;


        this.Selected.active = selected;

    }

    reuse(model: PokerModel) {

        this.model = model;
        this.Selected.active = false;

    }

    unuse() {

        this.model = null;

    }

    // update (dt) {}
}
