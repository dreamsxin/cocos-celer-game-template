// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import BaseView from "../../View/BaseView";
import LoadingPageMediator from "./LoadingPageMediator";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LoadingView extends BaseView {


    // LIFE-CYCLE CALLBACKS:



    onLoad() {

        this.node.scale = 1;
        this.node.opacity = 255;
        this.BindMedaitor(LoadingPageMediator);

    }

    start() {

    }

    Hide(callback: () => void) {
        this.node.runAction(cc.sequence(cc.fadeOut(0.5), cc.callFunc(() => {
            this.node.active = false;
            callback();
        })));
    }

    // update (dt) {}
}
