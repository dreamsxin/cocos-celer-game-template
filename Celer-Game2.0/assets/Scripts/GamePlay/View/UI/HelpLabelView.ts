// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { ShowHelpLayerSignal } from "../../../Command/CommonSignal";
import {
  GetFaultCount,
  GetTotalLevel,
  GetTypeCount,
} from "../../../Global/GameRule";
import { En_ID, En_View } from "../../../table";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HelpLabelView extends cc.Component {
  get Label() {
    return this.getComponent(cc.RichText);
  }

  onLoad() {
    ShowHelpLayerSignal.inst.addListener(this.renderText, this);
  }

  renderText() {
    let index = parseInt(this.node.name);
    let params = [];
    switch (index) {
      case 0:
        params = [GetTypeCount(), GetTypeCount()];
        break;
      case 1:
        params = [GetFaultCount(), GetFaultCount(), GetTotalLevel()];
        break;

      default:
        break;
    }

    this.Label.string = lan.t(
      En_View.BangZhuJieMian,
      En_ID.BangZhuYeMian1 + index,
      params
    );
  }
}
