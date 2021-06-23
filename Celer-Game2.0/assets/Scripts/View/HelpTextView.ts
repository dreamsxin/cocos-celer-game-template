// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { ShowHelpLayerSignal } from "../Command/CommonSignal";
import { En_US_ID, En_US_View } from "../table";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HelpTextView extends cc.Component {
  get richText() {
    return this.getComponent(cc.RichText);
  }

  get text() {
    return this.getComponent(cc.Label);
  }

  onLoad() {
    ShowHelpLayerSignal.inst.addListener(this.renderText, this);
  }

  renderText() {
    if (this.text) {
      this.text.string = lan.t(
        En_US_View.BangZhuJieMian,
        En_US_ID.BangZhuJieMian1 + parseInt(this.node.name)
      );
    } else if (this.richText) {
      this.richText.string = lan.t(
        En_US_View.BangZhuJieMian,
        En_US_ID.BangZhuJieMian1 + parseInt(this.node.name)
      );
    }
  }
}
