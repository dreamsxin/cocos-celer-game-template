// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


import FrameAniBase from "../Utils/FrameAniBase";
import { TimeAnimationStateChanged } from "../Command/CommonSignal";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TimeEffectAnimation extends FrameAniBase {


    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        super.onLoad();
        this.node.opacity = 0;
        TimeAnimationStateChanged.inst.addListenerOne(this.onPlayStateChanged, this);
    }

    onPlayStateChanged(isPlay: boolean) {
        if (isPlay) {
            if (this.isPlaying == false) {
                this.play();
            }
        } else {
            this.stop();
        }
    }

    start() {

    }

    play() {
        this.node.opacity = 255;
        super.play();
    }

    stop() {
        this.node.opacity = 0;
        super.stop();
    }

    // update (dt) {}
}
