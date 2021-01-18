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
import { PokerModel } from "../../Model/Poker/PokerModel";
import PokerToucherMediator from "./PokerToucherMediator";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PokerToucher extends BaseView {



    onLoad() {

        this.BindMedaitor(PokerToucherMediator)
    }

    // LIFE-CYCLE CALLBACKS:
    private model: PokerModel = null;
    get Model() {
        return this.model;
    }

    reuse(model: PokerModel) {

        this.model = model;
    }

    unuse() {

        this.model = null;

    }


}
