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
export default class PositionView extends EaseBaseView {


    // LIFE-CYCLE CALLBACKS:




    onLoad() {

        if (CC_DEBUG && this.node.name == "TestNode") {
            window["testPosition"] = this.onPositionChanged.bind(this);
        }

    }

    start() {

    }

    onPositionChanged(targetPos: cc.Vec2, lastTime: number, callback: Function, delay: number = 0) {

        this.startUpdate(new cc.Vec3(targetPos.x, targetPos.y, 0), lastTime, callback, delay);

    }

    onStep() {

        this.node.x = this.ease(this.node.x, this.Target.x);
        this.node.y = this.ease(this.node.y, this.Target.y);

    }

    onComplete() {

        this.node.setPosition(cc.v2(this.Target.x, this.Target.y));

    }



}
