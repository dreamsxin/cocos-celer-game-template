// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import RotationView from "../../../View/Transform/RotationView";
import { PokerModel } from "../../Model/Poker/PokerModel";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PokerRotationView extends RotationView {

    // LIFE-CYCLE CALLBACKS:
    private model: PokerModel = null;
    get Model() {
        return this.model;
    }

    onLoad() {

    }

    reuse(model: PokerModel) {

        this.model = model;
        this.node.rotation = 0;
    }

    unuse() {

        this.model = null;

    }
}
