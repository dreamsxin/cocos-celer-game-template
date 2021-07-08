// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { MinPotentialPacker } from "../../../AlgorithmUtils/MinimumPotentialLayout/MinPotentialPacker";
import {
  GameStartSignal,
  UpdateTimeNumber,
} from "../../../Command/CommonSignal";
import { gFactory } from "../../../Factory/GameFactory";
import {
  GetTotalLevel,
  GetTotalMapHeight,
  MapSpeedUpScale,
  StartSpeed,
} from "../../../Global/GameRule";
import { GameLogic } from "../../Model/GameLogic";
import {
  CreateItemNodeSignal,
  ItemModel,
  RemoveItemSignal,
} from "../../Model/ItemModel";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ItemRoot extends cc.Component {
  private speed: number = StartSpeed();

  get Items() {
    return this.node.getChildByName("Items");
  }

  get Border() {
    return this.node.getChildByName("Border");
  }

  public static DRAW = false;

  static ITEM_ROOT: cc.Node;

  onLoad() {
    ItemRoot.ITEM_ROOT = this.node;
    GameStartSignal.inst.addListener(() => {
      this.speed = StartSpeed();
      if (MinPotentialPacker.inst.DebugNode) {
        MinPotentialPacker.inst.DebugNode.y = this.node.y + 1920 * 0.5;
      }
    }, this);

    this.Border.y = GetTotalMapHeight() / GetTotalLevel();
    if (!CC_DEBUG) {
      this.Border.removeFromParent(true);
    }

    UpdateTimeNumber.inst.addListenerTwo((time: number, dt: number) => {
      this.updateStep(dt);
    }, this);

    CreateItemNodeSignal.inst.addListenerOne(this.onCreate, this);

    GameStartSignal.inst.addListener(() => {
      CC_DEBUG && console.log("CreateItem:", this.node.childrenCount);
    }, this);
  }

  updateStep(dt: number) {
    this.node.y -= dt * this.speed;
    GameLogic.inst.move(cc.v2(0, -dt * this.speed));
    if (MinPotentialPacker.inst.DebugNode) {
      MinPotentialPacker.inst.DebugNode.y = this.node.y + 1920 * 0.5;
    }

    this.speed += MapSpeedUpScale() * dt;
  }

  onCreate(model: ItemModel) {
    let itemNode = gFactory.getObj("Item", model);
    itemNode.setPosition(model.Position);
    itemNode.rotation = model.Rotation;
    itemNode.name = model.ID;
    this.node.addChild(itemNode);
  }
}
