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
export default class ScaleView extends EaseBaseView {


    // LIFE-CYCLE CALLBACKS:

    onLoad() {

        if (CC_DEBUG && this.node.name == "TestNode") {
            window["testScale"] = this.onScaleChanged.bind(this);
        }


    }

    start() {

    }

    onScaleChanged(targetScale: cc.Vec2, lastTime: number, callback: Function, delay: number = 0) {

        this.startUpdate(new cc.Vec3(targetScale.x, targetScale.y, 0), lastTime, callback, delay);

    }

    onStep() {

        this.node.scaleX = this.ease(this.node.scaleX, this.Target.x);
        this.node.scaleY = this.ease(this.node.scaleY, this.Target.y);

    }

    onComplete() {

        this.node.scaleX = this.Target.x;
        this.node.scaleY = this.Target.y;


    }

}
