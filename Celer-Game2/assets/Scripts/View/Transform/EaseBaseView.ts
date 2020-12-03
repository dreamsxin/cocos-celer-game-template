// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import BaseView from "../BaseView";

const { ccclass, property } = cc._decorator;


@ccclass
export default class EaseBaseView extends BaseView {



    private targetVal: cc.Vec3 = new cc.Vec3(0, 0, 0);
    private startTime: number = 0;
    private lastTime: number = 0;
    private completeCallback: Function = null;



    protected get StartTime() {
        return this.startTime;
    }

    protected get LastTime() {
        return this.lastTime;
    }

    protected get Target() {
        return this.targetVal;
    }



    onLoad() {

    }

    start() {

    }

    /**
     * 
     * @param targetVal 目标值
     * @param lastTime 持续时间（秒）
     * @param callback 完成回调
     * @param delayTime 延迟（秒）
     */
    protected startUpdate(targetVal: cc.Vec3, lastTime: number, callback: Function, delayTime: number = 0) {

        this.targetVal = targetVal;

        this.startTime = Date.now() + delayTime * 1000;
        this.lastTime = lastTime * 1000;

        this.completeCallback = callback;


    }

    private complete() {

        this.startTime = this.lastTime = 0;

        if (this.completeCallback) {
            let callback = this.completeCallback;
            this.completeCallback = null;
            callback();
        }

    }

    update(dt: number) {

        if (this.startTime == 0) return;
        if (this.canUpdate() == false) return;

        if (this.isComplete()) {

            this.onComplete();

            this.complete();


        } else {

            if (this.canStart()) {

                this.onStep();

            } else {

                // do nothing

            }
        }

    }

    private canStart() {

        return Date.now() >= this.startTime && this.startTime != 0;

    }

    private isComplete() {

        return Date.now() >= this.startTime + this.lastTime;

    }

    protected canUpdate() {

        console.error("you should override this method.");

        return true;

    }

    protected onStep() {

    }

    protected onComplete() {

    }


    protected ease(startVal: number, endVal: number) {

        if (this.lastTime <= 0) {
            return endVal;
        }

        let spendTime = Date.now() - this.startTime;
        return (endVal - startVal) * spendTime / this.lastTime + startVal;

    }
}
