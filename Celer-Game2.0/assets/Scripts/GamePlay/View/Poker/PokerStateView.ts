// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


import PokerStateMediator from "./PokerStateMediator";
import { PokerModel } from "../../Model/Poker/PokerModel";
import BaseView from "../../../View/BaseView";
import PokerScale from "./PokerScale";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PokerStateView extends BaseView {


    // LIFE-CYCLE CALLBACKS:


    get Front() {
        return this.node.getChildByName("Front").getComponent(PokerScale);
    }

    get Back() {
        return this.node.getChildByName("Back").getComponent(PokerScale);
    }

    private model: PokerModel = null;
    get Model() {
        return this.model;
    }

    onLoad() {

        this.BindMedaitor(PokerStateMediator);

    }

    start() {

    }

    reuse(model: PokerModel) {

        this.model = model;

    }

    unuse() {

        this.model = null;

    }


    turnFront(lastTime: number = 0.2, callback: Function = () => { }, delay: number = 0) {

        this.Back.onScaleChanged(cc.v2(0, 1), lastTime, () => {

            this.Front.onScaleChanged(cc.v2(1, 1), lastTime, callback, delay);

        }, delay);

    }

    turnBack(lastTime: number = 0.2, callback: Function = () => { }, delay: number = 0) {

        this.Front.onScaleChanged(cc.v2(0, 1), lastTime, () => {

            this.Back.onScaleChanged(cc.v2(1, 1), lastTime, callback, delay);

        }, delay);

    }




    update(dt: number) {



    }
}
