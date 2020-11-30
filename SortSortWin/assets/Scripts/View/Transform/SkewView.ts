// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import EaseBaseView from "./EaseBaseView";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SkewView extends EaseBaseView {


    // LIFE-CYCLE CALLBACKS:

    private startSkew: cc.Vec2 = cc.Vec2.ZERO;
    onLoad() {

        if (CC_DEBUG && this.node.name == "TestNode") {
            window["testSkew"] = this.onSkewChanged.bind(this);
        }

    }


    start() {

    }

    canUpdate() {
        return true;
    }

    onSkewChanged(targetSkew: cc.Vec2, lastTime: number, callback: Function, delay: number = 0) {

        this.startSkew = cc.v2(this.node.skewX, this.node.skewY);
        this.startUpdate(new cc.Vec3(targetSkew.x, targetSkew.y, 0), lastTime, callback, delay);

    }

    onStep() {

        this.node.skewX = this.ease(this.startSkew.x, this.Target.x);
        this.node.skewY = this.ease(this.startSkew.y, this.Target.y);

    }

    onComplete() {

        this.node.skewX = this.Target.x;
        this.node.skewY = this.Target.y;

    }

}



