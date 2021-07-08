// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { gFactory } from "../../../Factory/GameFactory";
import { ConvertToNodeSpaceAR } from "../../../Utils/Cocos";
import { ItemModel, RemoveItemSignal } from "../../Model/ItemModel";
import ItemRoot from "../Game/ItemRoot";
import ItemAnimation from "./ItemAnimation";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ItemAnimationRoot extends cc.Component {
  onLoad() {
    RemoveItemSignal.inst.addListenerThree(this.onRemove, this);
  }

  onRemove(model: ItemModel, animated: boolean = false, index: number = 0) {
    if (model && animated) {
      let node = ItemRoot.ITEM_ROOT.getChildByName(model.ID);
      if (node) {
        let ani = gFactory.getObj("ItemAni");
        this.node.addChild(ani);
        ani.setPosition(ConvertToNodeSpaceAR(node, this.node));
        ani.opacity = 255;
        ani.active = true;
        ani.getComponent(ItemAnimation).onComplete = () => {
          ani.runAction(cc.fadeOut(0.1));
          setTimeout(() => {
            gFactory.putObj("ItemAni", ani);
          }, 100);
        };
        ani.getComponent(ItemAnimation).play();
      }
    }
  }
}
