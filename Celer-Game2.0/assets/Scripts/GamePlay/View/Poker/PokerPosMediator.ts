import { GameOverSignal, GamePauseSignal } from "../../../Command/CommonSignal";
import { Distance } from "../../../Utils/Cocos";
import { Random } from "../../../Utils/Random";
import { BaseSignal } from "../../../Utils/Signal";
// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import BaseMediator from "../../../View/BaseMediator";
import RotationView from "../../../View/Transform/RotationView";
import { PokerPositionChangedSignal } from "../../Model/Poker/PokerPositionModel";
import PokerPosView from "./PokerPosView";

const { ccclass, property } = cc._decorator;
export class ShakePokerSignal extends BaseSignal {}

@ccclass
export default class PokerPosMediator extends BaseMediator<PokerPosView> {
  private isShaking = false;

  onRegister() {
    PokerPositionChangedSignal.inst.addListenerTwo(
      this.onPositionChanged,
      this
    );

    ShakePokerSignal.inst.addListenerOne(this.shake, this);

    GamePauseSignal.inst.addListener(() => {
      this.node.group = "default";
    }, this);

    GameOverSignal.inst.addListener(() => {
      this.node.group = "default";
    }, this);
  }

  onPositionChanged(id: string, pos: cc.Vec2) {
    if (this.View.Model.ID != id) {
      return;
    }

    let lastTime = 0.1;
    let callback = () => {};
  }

  shake(ids: string[]) {
    if (ids.indexOf(this.View.Model.ID) < 0) return;

    if (this.isShaking) return;

    this.isShaking = true;

    let oldTarget = this.View.TargetPos.clone();

    let left = oldTarget.add(cc.v2(-10, 0));
    let right = oldTarget.add(cc.v2(10, 0));

    // 1
    this.View.onPositionChanged(
      left,
      0.025,
      () => {
        this.View.onPositionChanged(
          right,
          0,
          () => {
            // 2
            this.View.onPositionChanged(
              left,
              0.05,
              () => {
                this.View.onPositionChanged(
                  right,
                  0.05,
                  () => {
                    // 3
                    this.View.onPositionChanged(
                      left,
                      0.05,
                      () => {
                        this.View.onPositionChanged(
                          right,
                          0.05,
                          () => {
                            this.View.onPositionChanged(
                              oldTarget,
                              0.025,
                              () => {
                                this.isShaking = false;
                              },
                              0
                            );
                          },
                          0
                        );
                      },
                      0
                    );
                  },
                  0
                );
              },
              0
            );
          },
          0
        );
      },
      0
    );
  }
}
