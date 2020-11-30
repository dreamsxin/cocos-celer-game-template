// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import BaseView from "./BaseView";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BaseMediator<T extends cc.Component> extends cc.Component {



    public bind(view: T) {

        this.view = view;
    }

    private view: T;
    get View(): T {
        console.assert(this.view != null, " view is null");
        return this.view;
    }


    onRegister() {
        console.error(" should override onRegister ");
    }

    onUnregister() {
        console.error(" should override onUnregister ");
    }


}
