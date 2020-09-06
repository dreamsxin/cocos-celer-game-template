// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


import HelpLayerView from "./HelpLayerView";
import BaseMediator from "./BaseMediator";
import { ShowHelpLayerSignal, HideHelpLayerSignal } from "../Command/CommonSignal";
import { GameStateController } from "../Controller/GameStateController";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HelpLayerMediator extends BaseMediator<HelpLayerView> {



    private closeCallback: Function = null;

    onRegister() {

        ShowHelpLayerSignal.inst.addListenerOne(this.showGuide, this);
        HideHelpLayerSignal.inst.addListenerOne(this.hideGuide, this);

    }

    showGuide(callback: Function) {

        if (this.View.isShowed()) return;

        GameStateController.inst.pause(true);
        this.closeCallback = callback;
        this.View.Show();
    }

    hideGuide() {
        if (this.View.isShowed() == false) return;

        GameStateController.inst.resume();
        this.View.Hide(this.closeCallback);
        this.closeCallback = null;

    }
}
