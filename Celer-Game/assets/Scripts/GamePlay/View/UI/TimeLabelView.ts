import { CountDownSignal, UpdateTimeNumber } from "../../../Command/CommonSignal";
import { ResourceController } from "../../../Controller/ResourceController";
import { Time } from "../../../Utils/Time";
import BaseView from "../../../View/BaseView";
// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


const { ccclass, property } = cc._decorator;

@ccclass
export default class TimeLabelView extends BaseView {


    get Label() {
        return this.getComponent(cc.Label);
    }

    private sec = 0;
    onLoad() {

        UpdateTimeNumber.inst.addListenerOne(this.onTimeChanged, this);
    }

    onTimeChanged(time: number) {


        this.Label.string = Time.timeFormat(time);

        if (time > 30) {
            this.Label.font = ResourceController.inst.getTimeWhiteFont();
        } else {
            this.Label.font = ResourceController.inst.getTimeRedFont();
        }

        let secNew = Math.floor(time)
        if (secNew != this.sec) {
            this.sec = secNew;
            if (this.sec <= 5) {
                CountDownSignal.inst.dispatch();
            }
        }

    }

    start() {

    }

    // update (dt) {}
}
