// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { GameOverSignal } from "../../../Command/CommonSignal";
import { RoundEndType } from "../../../Controller/GameStateController";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BlackView extends cc.Component {

    onLoad() {
         
        GameOverSignal.inst.addListenerOne((type: RoundEndType) => {
        
            if (type == RoundEndType.Complete) return;

            this.node.active = true;
        }, this);

        this.node.active = false;
     }

    start () {

    }

    // update (dt) {}
}
