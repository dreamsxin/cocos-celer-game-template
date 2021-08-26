import { _decorator, Component, Node, Sprite, v3, tween, Vec3 } from "cc";
import { RoundEndType } from "../../Manager/GameStateController";
import {
  AnimationType,
  ResourceController,
  Title,
} from "../../Manager/ResourceController";
import { GameOverSignal, OpenResultLayerSignal } from "../../Signal/Signal";
import { FireWorkAnimation } from "../Animation/FireWorkAnimation";
const { ccclass, property } = _decorator;

@ccclass("CompleteView")
export class CompleteView extends Component {
  get Font() {
    return this.node.getChildByName("Font").getComponent(Sprite);
  }

  get Con() {
    return this.node.getChildByName("Con");
  }

  get FireWork() {
    return this.node.getChildByName("FireWork")
      ? this.node.getChildByName("FireWork").getComponent(FireWorkAnimation)
      : null;
  }

  onLoad() {
    GameOverSignal.inst.addListener(this.onGameOver, this);
    this.Font.node.active = false;
    this.Con && (this.Con.active = false);
  }

  start() {
    this.FireWork && (this.FireWork.node.active = false);
  }

  onGameOver(type: RoundEndType) {
    this.Font.node.active = true;

    let delay = 1500;
    switch (type) {
      case RoundEndType.Complete:
        this.FireWork.node.active = true;
        this.Con && (this.Con.active = true);
        this.Font.spriteFrame = ResourceController.inst.getAnimationAtlas(
          AnimationType.UI,
          Title.CompleteAni
        );
        delay = 3000;
        break;
      case RoundEndType.Over:
        this.Font.spriteFrame = ResourceController.inst.getAnimationAtlas(
          AnimationType.UI,
          Title.Over
        );
        break;
      case RoundEndType.TimeUp:
        this.Font.spriteFrame = ResourceController.inst.getAnimationAtlas(
          AnimationType.UI,
          Title.TimeUp
        );
        break;
      case RoundEndType.OutOfMove:
        this.Font.spriteFrame = ResourceController.inst.getAnimationAtlas(
          AnimationType.UI,
          Title.OutOfMove
        );
        break;
    }

    if (this.FireWork && this.FireWork.node.active) {
      this.FireWork.play();
    }
    if (this.Font.node.active) {
      this.Font.node.scale = v3(
        0,
        this.Font.node.scale.y,
        this.Font.node.scale.z
      );

      tween(this.Font.node)
        .to(0.1, { scale: v3(1.2, 1.2, 1.2) })
        .start();
    } else {
      if (this.Con) {
        this.Con.scale = Vec3.ZERO;

        tween(this.Con)
          .sequence(
            tween(this.Con).to(0.1, { scale: v3(1.2, 1.2, 1.2) }),
            tween(this.Con).to(0.05, { scale: v3(1, 1, 1) }),
            tween(this.Con).delay(0.15),
            tween(this.Con).to(0.1, v3(1, 1, 1))
          )
          .start();
      }
    }

    setTimeout(() => {
      OpenResultLayerSignal.inst.dispatch(type);
    }, delay);
  }
}
