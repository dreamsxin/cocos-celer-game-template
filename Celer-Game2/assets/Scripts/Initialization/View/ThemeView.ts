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
import { Theme } from "../../Global/Theme";
import { GameThemeInit } from "../../Command/CommonSignal";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ThemeView extends BaseView {


    // LIFE-CYCLE CALLBACKS:

    onLoad() {

        GameThemeInit.inst.addListenerOne(this.onThemeInit, this);
    }

    start() {

    }

    onThemeInit(theme: Theme) {

        this.node.active = this.node.name == Theme[theme];

    }

    // update (dt) {}
}
