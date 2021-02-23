// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { ResourceController } from "../../../Controller/ResourceController";
import { gFactory } from "../../../Factory/GameFactory";
import { HashMap } from "../../../Utils/HashMap";
import { BaseSignal } from "../../../Utils/Signal";
import { FreeRedrawCountUpdateSignal } from "../../Model/GameLogic";
import {
  PokerCreatedSignal,
  PokerModel,
  PokerRemovedSignal,
} from "../../Model/Poker/PokerModel";
import {
  PokerParent,
  PokerParentChangedSignal,
} from "../../Model/Poker/PokerParentModel";
import { ShowDrawAniamtionSignal } from "../Animation/DrawAnimation";

const { ccclass, property } = cc._decorator;

export class RedrawCardSignal extends BaseSignal {}

@ccclass
export default class Draw extends cc.Component {
  public static PokerNodes: HashMap<string, cc.Node> = new HashMap();

  onLoad() {
    PokerCreatedSignal.inst.addListenerOne(this.onPokerCreated, this);
    PokerRemovedSignal.inst.addListenerOne(this.onPokerRemoved, this);

    ShowDrawAniamtionSignal.inst.addListener(() => {}, this);
  }

  onPokerRemoved(ID: string) {
    let pokerNode = Draw.PokerNodes.get(ID);
    if (pokerNode) {
      gFactory.putObj("Poker", pokerNode);
    }
    Draw.PokerNodes.remove(ID);
  }

  onPokerCreated(model: PokerModel) {
    // console.log(" poker create:", model.ID);
    let poker = gFactory.getObj("Poker", model);
    this.node.addChild(poker);
    Draw.PokerNodes.add(model.ID, poker);
  }
}
