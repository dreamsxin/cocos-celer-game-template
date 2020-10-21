import { resourceUsage } from "process";
import { emitKeypressEvents } from "readline";
import { GameOverSignal, PlayerScoreChanged } from "../../../Command/CommonSignal";
import { ResourceController } from "../../../Controller/ResourceController";
import { gFactory } from "../../../Factory/GameFactory";
import { ConvertToNodeSpaceAR, Distance } from "../../../Utils/Cocos";
// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import NumberChangedView from "../../../View/NumberChangedView";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ScoreLabelView extends NumberChangedView {


    @property(cc.Node)
    ScoreFloatRoot: cc.Node = null;

    onLoad() {
        PlayerScoreChanged.inst.addListenerFour(this.onScoreChanged, this);


    }

    onScoreChanged(score: number, changed: number, times: number, node: cc.Node) {


        let scoreLableNode = gFactory.getObj("AddScore");
        let label = scoreLableNode.getComponent(cc.Label);

        if (changed >= 0) {
            label.font = ResourceController.inst.getAddScoreFont();
        } else {
            label.font = ResourceController.inst.getSubScoreFont();
        }

        label.string = "/" + Math.abs(changed);

        this.ScoreFloatRoot.addChild(scoreLableNode);

        let startPos = cc.v2(0, 0);
        if (node) {
            startPos = ConvertToNodeSpaceAR(node, this.ScoreFloatRoot);
        }

        let targetPos = ConvertToNodeSpaceAR(this.node, this.ScoreFloatRoot);

        scoreLableNode.setPosition(startPos);
        let floatTime = Distance(startPos, targetPos) / 2000;
        scoreLableNode.runAction(cc.sequence(
            cc.scaleTo(0, 0),
            cc.scaleTo(0.2, 1.2),
            cc.scaleTo(0.1, 1),
            cc.moveTo(floatTime, targetPos),
            cc.callFunc(() => {
                gFactory.putObj("AddScore", scoreLableNode)
            })
        ));
        setTimeout(() => {
            this.onNumberChanged(score);
        }, 300 + floatTime * 1000);
    }
}
