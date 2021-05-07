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
import { NextLevelSignal } from "../../../Model/PlayModelProxy";
import FrameAniBase from "../../../Utils/FrameAniBase";
import { BaseSignal } from "../../../Utils/Signal";

const { ccclass, property } = cc._decorator;

export enum AniType {
  None,
}

export class OnNodeMovedSignal extends BaseSignal {}
@ccclass
export default class EffectBase extends FrameAniBase {
  private id: string = "";
  protected get ID() {
    return this.id;
  }

  private type: AniType = AniType.None;
  protected get Type() {
    return this.type;
  }

  private fromIndex: number = 0;
  protected get FromIndex() {
    return this.fromIndex;
  }

  private toIndex: number = 0;
  protected get ToIndex() {
    return this.toIndex;
  }

  unuse() {
    this.id = "";
    this.type = AniType.None;
    this.node.scale = 1;
    this.node.rotation = 0;
    this.node.width = 0;
    this.node.height = 0;
    this.fromIndex = 0;
    this.toIndex = 0;
    this.node.setAnchorPoint(0.5, 0.5);
    this.stop();
    this.node.getComponent(cc.Sprite).spriteFrame = null;
    this.node.getComponent(cc.Sprite).type = cc.Sprite.Type.SIMPLE;
    this.node.getComponent(cc.Sprite).sizeMode = cc.Sprite.SizeMode.RAW;
  }

  reuse(ID: string, type: AniType, fromIndex: number = 0, toIndex: number = 0) {
    this.id = ID;
    this.type = type;
    this.node.getComponent(cc.Sprite).spriteFrame = null;
    this.fromIndex = fromIndex;
    this.toIndex = toIndex;
  }

  onComplete() {
    this.node.runAction(
      cc.sequence(
        cc.fadeOut(0.2),
        cc.callFunc(() => {
          this.node.getComponent(cc.Sprite).spriteFrame = null;
          gFactory.putObj("Effect", this.node);
        })
      )
    );
  }

  onStartPlay() {
    this.node.opacity = 255;
  }

  onLoad() {
    super.onLoad();
    OnNodeMovedSignal.inst.addListenerTwo(this.onNodeMoved, this);

    NextLevelSignal.inst.addListener(() => {
      if (this.node.parent) {
        this.node.getComponent(cc.Sprite).spriteFrame = null;
        gFactory.putObj("Effect", this.node);
      }
    }, this);
  }

  onNodeMoved(ID: string, position: cc.Vec2) {
    if (this.ID && this.ID == ID) {
      this.node.setPosition(position);
    }
  }
}
