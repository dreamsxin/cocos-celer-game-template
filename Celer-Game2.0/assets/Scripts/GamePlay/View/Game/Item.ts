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
import { BaseSignal } from "../../../Utils/Signal";
import { ItemModel, RemoveItemSignal } from "../../Model/ItemModel";
import PrefabBaseView from "./PrefabBaseView";

const { ccclass, property } = cc._decorator;

export class OnClickSignal extends BaseSignal {}

export class OnWrongClickSignal extends BaseSignal {}

const RemovePos = [
  cc.v2(198, -22.377),
  cc.v2(527.752, -22.377),
  cc.v2(874.648, -22.377),
];
@ccclass
export default class Item extends PrefabBaseView<ItemModel> {
  get Sprite() {
    return this.getComponent(cc.Sprite);
  }

  onLoad() {
    RemoveItemSignal.inst.addListenerThree(this.onRemove, this);
    OnClickSignal.inst.addListenerOne(this.onClick, this);
    OnWrongClickSignal.inst.addListenerOne(this.onWrongClick, this);
  }

  onReuse() {
    this.Sprite.spriteFrame = ResourceController.inst.getItemSprite(
      this.model.Type,
      this.model.SpName
    );
  }

  onWrongClick(model: ItemModel) {
    if (this.model && model.ID == this.model.ID) {
      this.node.color = cc.color(247, 91, 75);
      setTimeout(() => {
        this.node.color = cc.Color.WHITE;
      }, 100);
    }
  }

  onUnuse() {
    this.model = null;
    this.node.scale = 1;
    this.node.opacity = 255;
    this.node.scale = 1;
  }

  onRemove(model: ItemModel, animated: boolean = false, index: number = 0) {
    if (this.model && model.ID == this.model.ID) {
      if (animated) {
        this.node.zIndex = 100;
        this.node.runAction(
          cc.spawn(
            cc.fadeOut(0.4),
            cc.moveTo(0.4, RemovePos[index]),
            cc.rotateTo(0.4, 180)
          )
        );
        setTimeout(() => {
          gFactory.putObj("Item", this.node);
        }, 400);
      } else {
        gFactory.putObj("Item", this.node);
      }
    }
  }

  onClick(IDs: string[]) {
    if (this.model && IDs.indexOf(this.model.ID) >= 0) {
      this.node.zIndex = 100;

      setTimeout(() => {
        if (this.model) {
          this.node.zIndex = this.model.ZIndex;
        }
        this.node.scale = 1;
      }, 150);
      this.node.runAction(
        cc.sequence(
          cc.scaleTo(0.1, 1.2),
          cc.scaleTo(0.05, 1),
          cc.callFunc(() => {})
        )
      );
    }
  }
}
