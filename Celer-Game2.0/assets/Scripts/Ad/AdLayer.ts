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
import { GameStateController } from "../Controller/GameStateController";
import { BaseSignal } from "../Utils/Signal";
import {
  CnicornWatchFailSignal,
  FlyCnicornClickSignal,
  RemoveFlyCnicornSignal,
} from "./FlyCnicornAd";
import { HideWildAdButtonSignal, WildAdButtonClick } from "./WildAdButton";

const { ccclass, property } = cc._decorator;
export class AdFinishSignal extends BaseSignal {}
enum AdType {
  Cnicorn,
  Sun,
}
@ccclass
export default class AdLayer extends cc.Component {
  @property(cc.SpriteAtlas)
  AdAtlas: cc.SpriteAtlas = null;

  get Panel() {
    return this.node.getChildByName("NormalPanel");
  }

  get WatchAd() {
    return this.Panel.getChildByName("btn_get");
  }

  get BackToGame() {
    return this.Panel.getChildByName("btn_back");
  }

  get Content() {
    return this.Panel.getChildByName("font_freeprop1").getComponent(cc.Sprite);
  }

  get SubContent() {
    return this.Panel.getChildByName("font_freeprop2").getComponent(cc.Sprite);
  }

  get Title() {
    return this.Panel.getChildByName("bg_title_freeprop").getComponent(
      cc.Sprite
    );
  }

  get FailTip() {
    return this.node.getChildByName("FailTip");
  }

  onLoad() {
    this.node.active = false;
    this.node.scale = 1;

    WildAdButtonClick.inst.addListener(() => {
      this.Show(AdType.Sun);
    }, this);

    FlyCnicornClickSignal.inst.addListener(() => {
      this.Show(AdType.Cnicorn);
    }, this);

    this.BackToGame.on(
      cc.Node.EventType.TOUCH_END,
      () => {
        setTimeout(() => {
          this.node.active = false;
        }, 0);
      },
      this
    );
  }

  onAdFinish(adUnitId: string) {
    AdFinishSignal.inst.dispatchOne(adUnitId);
    if (GameStateController.inst.isPause()) {
      // TODO 隐藏暂停界面
    }
    if (adUnitId == AdType[AdType.Sun]) {
      CELER_X && HideWildAdButtonSignal.inst.dispatch();
    } else {
      CELER_X && RemoveFlyCnicornSignal.inst.dispatch();
    }

    setTimeout(() => {
      this.node.active = false;
    }, 0);
  }

  onAdFailed(adUnitId: string) {
    if (GameStateController.inst.isPause()) {
      // TODO 隐藏暂停界面
    }
    this.FailTip.active = true;
    this.Panel.active = false;
    if (adUnitId == AdType[AdType.Cnicorn]) {
      CnicornWatchFailSignal.inst.dispatch();
    }
    setTimeout(() => {
      this.node.active = false;
    }, 2000);
  }

  Show(type: AdType) {
    if (this.node.active == true) return;
    this.node.active = true;
    this.FailTip.active = false;
    this.Panel.active = true;
    this.WatchAd.active = true;

    if (type == AdType.Sun) {
      this.Title.spriteFrame = this.AdAtlas.getSpriteFrame("bg_title_freeprop");
      this.Content.spriteFrame = this.AdAtlas.getSpriteFrame("font_freeprop1");
      this.SubContent.spriteFrame = this.AdAtlas.getSpriteFrame(
        "font_freeprop2"
      );
      this.WatchAd.getComponent(
        cc.Sprite
      ).spriteFrame = this.AdAtlas.getSpriteFrame("btn_get");
    } else {
      this.Title.spriteFrame = this.AdAtlas.getSpriteFrame("font_title_clear");
      this.Content.spriteFrame = this.AdAtlas.getSpriteFrame("font_clear1");
      this.SubContent.spriteFrame = this.AdAtlas.getSpriteFrame("font_clear2");
      this.WatchAd.getComponent(
        cc.Sprite
      ).spriteFrame = this.AdAtlas.getSpriteFrame("btn_to clear");
    }

    this.WatchAd.targetOff(this);
    this.WatchAd.once(
      cc.Node.EventType.TOUCH_END,
      () => {
        setTimeout(() => {
          this.WatchAd.active = false;
        }, 0);
        AdController.inst.showAd(
          AdType[type],
          (adUnitId: string) => {
            console.log(" watch ad success:", adUnitId);
            this.onAdFinish(adUnitId);
          },
          (adUnitId: string) => {
            console.log(" watch ad fail:", adUnitId);
            this.onAdFailed(adUnitId);
          }
        );
      },
      this
    );
  }
}
