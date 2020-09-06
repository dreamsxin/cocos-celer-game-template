// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { InitialFacade } from "../Initialization/Facade/InitialFacade";
import { PlayModelProxy } from "../Model/PlayModelProxy";

const { ccclass, property } = cc._decorator;

@ccclass
export default class App extends cc.Component {


    onLoad() {
        console.log(" app onload ");
    }

    start() {
        InitialFacade.inst.start();
    }


    update(dt: number) {
        PlayModelProxy.inst.addGameTime(-dt);
    }

}