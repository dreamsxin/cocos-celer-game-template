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
export default class RotationView extends EaseBaseView {


    // LIFE-CYCLE CALLBACKS:

    private startRotation: number = 0;
    onLoad() {

        if (CC_DEBUG && this.node.name == "TestNode") {
            window["testRotation"] = this.onRotationChanged.bind(this);
        }

    }

    canUpdate() {
        return true;
    }


    start() {

    }

    onRotationChanged(targetRotation: number, lastTime: number, callback: Function, delay: number = 0) {

        this.startRotation = this.node.rotation;
        this.startUpdate(new cc.Vec3(targetRotation, targetRotation, targetRotation), lastTime, callback, delay);

    }

    onStep() {

        this.node.rotation = this.ease(this.startRotation, this.Target.x);

    }

    onComplete() {

        this.node.setRotation(this.Target.x);

    }
}
