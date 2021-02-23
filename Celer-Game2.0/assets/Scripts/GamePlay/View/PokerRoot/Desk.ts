// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { ConvertToNodeSpaceAR } from "../../../Utils/Cocos";
import {
  DeskParents,
  PokerParent,
  PokerParentChangedSignal,
} from "../../Model/Poker/PokerParentModel";
import ToturialLayer, { TutorialPrepareDoneSignal } from "../new/ToturialLayer";
import Draw from "./Draw";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Desk extends cc.Component {
  onLoad() {
    TutorialPrepareDoneSignal.inst.addListener(() => {
      if (this.node.name == "0") {
        ToturialLayer.AddToturialStep(
          4,
          this.node,
          null,
          false,
          () => {},
          () => {},
          () => {},
          true
        );
      }
    }, this);
  }

  onPokerParentChanged(ID: string, parent: PokerParent) {
    let index = DeskParents.indexOf(parent);
    if (index.toString() != this.node.name) return;
    let pokerNode = Draw.PokerNodes.get(ID);
    if (pokerNode) {
      pokerNode.setPosition(ConvertToNodeSpaceAR(pokerNode, this.node));
      pokerNode.setParent(this.node);
    }
  }
}
