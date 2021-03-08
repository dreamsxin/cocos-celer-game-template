// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { AdController } from "../Controller/AdController";

const { ccclass, property } = cc._decorator;

@ccclass
export default class AdButtonView extends cc.Component {
  onLoad() {
    this.node.on(
      cc.Node.EventType.TOUCH_END,
      () => {
        AdController.inst.showAd(
          "test",
          (adUnitId: string) => {
            console.log(" ad success：", adUnitId);
          },
          (adUnitId: string) => {
            console.log(" ad failed", adUnitId);
          }
        );
      },
      this
    );
  }
}
