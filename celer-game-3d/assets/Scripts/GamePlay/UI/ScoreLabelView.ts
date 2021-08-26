import { _decorator, Component, Node, v3, Label, Vec3, tween } from "cc";
import { ConvertToNodeSpaceAR, Distance } from "../../Common/Cocos";
import NumberChangedView from "../../Common/View/UI/NumberChangedView";
import { PrefabFactory } from "../../Factory/PrefabFactory";
import { ResourceController } from "../../Manager/ResourceController";
import { PlayModel } from "../../Model/PlayModel";
import { PlayerScoreChanged, PLayerScoreInitSignal } from "../../Signal/Signal";
const { ccclass, property } = _decorator;

@ccclass("ScoreLabelView")
export class ScoreLabelView extends NumberChangedView {
  @property(Node)
  ScoreFloatRoot: Node = null;

  onLoad() {
    PlayerScoreChanged.inst.addListener(this.onScoreChanged, this);
    PLayerScoreInitSignal.inst.addListener((score: number) => {
      this.setNumber(score);
    }, this);
  }

  onScoreChanged(score: number, changed: number, times: number, node: Node) {
    if (this.ScoreFloatRoot == null || changed < 0) {
      this.onNumberChanged(PlayModel.inst.PlayerScore);
      return;
    }
    let scoreLableNode: Node = PrefabFactory.inst.getObj("AddScore");
    let label = scoreLableNode.getComponent(Label);

    if (changed >= 0) {
      label.font = ResourceController.inst.getAddScoreFont();
    } else {
      label.font = ResourceController.inst.getSubScoreFont();
    }

    label.string = "/" + Math.abs(changed);

    this.ScoreFloatRoot.addChild(scoreLableNode);

    let startPos = v3(0, 0, 0);
    if (node) {
      startPos = ConvertToNodeSpaceAR(node, this.ScoreFloatRoot);
    }

    let targetPos: Vec3 = ConvertToNodeSpaceAR(this.node, this.ScoreFloatRoot);

    scoreLableNode.setPosition(startPos);
    let floatTime = Distance(startPos, targetPos) / 2500;
    scoreLableNode.scale = v3(0, 0, 0);
    tween(scoreLableNode)
      .sequence(
        tween(scoreLableNode).to(0.1, { scale: v3(1.2, 1.2, 1.2) }),
        tween(scoreLableNode).to(0.1, { scale: v3(1, 1, 1) }),
        tween(scoreLableNode).to(floatTime, { position: targetPos }),
        tween(scoreLableNode).call(() => {
          PrefabFactory.inst.putObj("AddScore", scoreLableNode);
        })
      )
      .start();

    setTimeout(() => {
      this.onNumberChanged(PlayModel.inst.PlayerScore);
    }, 200 + floatTime * 1000);
  }
}
