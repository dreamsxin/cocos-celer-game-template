import {
  _decorator,
  Component,
  Node,
  SpriteAtlas,
  Sprite,
  Label,
  v3,
} from "cc";
import { AdController } from "../Manager/AdController";
import { GameStateController } from "../Manager/GameStateController";
import {
  AdFinishSignal,
  CnicornWatchFailSignal,
  FlyCnicornClickSignal,
  HideWildAdButtonSignal,
  RemoveFlyCnicornSignal,
  WildAdButtonClick,
} from "../Signal/Signal";
import { FlyCnicornAd } from "./FlyCnicornAd";
const { ccclass, property } = _decorator;
export enum AdType {
  Cnicorn,
  Sun,
}
@ccclass("AdLayer")
export class AdLayer extends Component {
  @property(SpriteAtlas)
  AdAtlas: SpriteAtlas = null;

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
    return this.Panel.getChildByName("font_freeprop1").getComponent(Sprite);
  }

  get SubContent() {
    return this.Panel.getChildByName("font_freeprop2").getComponent(Sprite);
  }

  get MoveBonus() {
    return this.Panel.getChildByName("Moves");
  }

  get Title() {
    return this.Panel.getChildByName("bg_title_freeprop").getComponent(Sprite);
  }

  get FailTip() {
    return this.node.getChildByName("FailTip");
  }

  onLoad() {
    this.node.active = false;
    this.node.scale = v3(1, 1, 1);

    WildAdButtonClick.inst.addListener(() => {
      this.Show(AdType.Sun);
    }, this);

    FlyCnicornClickSignal.inst.addListener(() => {
      this.Show(AdType.Cnicorn);
    }, this);

    this.BackToGame.on(
      Node.EventType.TOUCH_END,
      () => {
        setTimeout(() => {
          this.node.active = false;
          GameStateController.inst.resume();
          FlyCnicornAd.ShowTimeRest = 10;
        }, 0);
      },
      this
    );
  }

  onAdFinish(adUnitId: string) {
    AdFinishSignal.inst.dispatch(adUnitId);

    if (adUnitId == AdType[AdType.Sun]) {
      CELER_X && HideWildAdButtonSignal.inst.dispatch();
    } else {
      CELER_X && RemoveFlyCnicornSignal.inst.dispatch();
    }

    setTimeout(() => {
      this.node.active = false;
      GameStateController.inst.resume();
    }, 0);
  }

  onAdFailed(adUnitId: string) {
    this.FailTip.active = true;
    this.Panel.active = false;
    if (adUnitId == AdType[AdType.Cnicorn]) {
      CnicornWatchFailSignal.inst.dispatch();
    }
    setTimeout(() => {
      this.node.active = false;
      GameStateController.inst.resume();
    }, 2000);
  }

  Show(type: AdType) {
    if (this.node.active == true) return;

    GameStateController.inst.pause(true);
    this.node.active = true;
    this.FailTip.active = false;
    this.Panel.active = true;
    this.WatchAd.active = true;

    if (type == AdType.Sun) {
      this.Title.spriteFrame = this.AdAtlas.getSpriteFrame("font_free");
      this.Content.spriteFrame = this.AdAtlas.getSpriteFrame("font_get prop1");
      this.SubContent.spriteFrame =
        this.AdAtlas.getSpriteFrame("font_get prop2");
      this.WatchAd.getComponent(Sprite).spriteFrame =
        this.AdAtlas.getSpriteFrame("btn_getprop");
      this.MoveBonus.active = false;
    } else {
      this.Title.spriteFrame = this.AdAtlas.getSpriteFrame("font_add");
      this.Content.spriteFrame = this.AdAtlas.getSpriteFrame("font_addmoves1");
      this.SubContent.spriteFrame =
        this.AdAtlas.getSpriteFrame("font_addmoves2");
      this.MoveBonus.active = true;
      this.MoveBonus.getComponent(Label).string = "3";
      this.WatchAd.getComponent(Sprite).spriteFrame =
        this.AdAtlas.getSpriteFrame("btn_addmoves");
    }

    this.WatchAd.targetOff(this);
    this.WatchAd.once(
      Node.EventType.TOUCH_END,
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
