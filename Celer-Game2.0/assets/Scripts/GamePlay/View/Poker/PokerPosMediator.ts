import { GameOverSignal, GamePauseSignal } from "../../../Command/CommonSignal";
import {
  GameStateController,
  RoundEndType,
} from "../../../Controller/GameStateController";
import { gFactory } from "../../../Factory/GameFactory";
import {
  GetPokerRecycleScore,
  RecycleLastTime,
  Speed,
} from "../../../Global/GameRule";
import { PlayPokerPlaceSignal } from "../../../Manager/AudioManager";
import { PlayModelProxy } from "../../../Model/PlayModelProxy";
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
import { ScoreType } from "../../Model/GamePlayModel";
import { ParentType } from "../../Model/Poker/PokerParentModel";
import {
  MoveType,
  PokerPositionChangedSignal,
} from "../../Model/Poker/PokerPositionModel";
import { GetParentType } from "../../Model/Poker/PokerUtil";
import PokerPosView from "./PokerPosView";
import PokerRotationView, { PokerPosFlySignal } from "./PokerRotationView";

const { ccclass, property } = cc._decorator;
export class ShakePokerSignal extends BaseSignal {}

export class FlyPokerSignal extends BaseSignal {}

export class PokerFlyDoneSignal extends BaseSignal {}
@ccclass
export default class PokerPosMediator extends BaseMediator<PokerPosView> {
  public static maxZIndex: number = 0;
  private isShaking = false;

  onRegister() {
    PokerPosFlySignal.inst.addListenerOne((id: string) => {
      if (this.View.Model == null || this.View.Model.ID != id) return;

      this.node.zIndex = cc.macro.MAX_ZINDEX - this.View.Model.Point;
      let direction = this.View.Model.Point % 2 ? 1 : -1;
      let posTop = cc.v2(
        this.node.x + Random.getRandom(0, 500) * direction,
        this.node.y + 500
      );
      this.isShaking = false;
      this.View.onPositionChanged(
        posTop,
        Random.getRandom(0.2, 0.4),
        () => {
          this.View.onPositionChanged(
            posTop.add(cc.v2(Random.getRandom(100, 200) * direction, -2400)),
            Random.getRandom(0.3, 0.7),
            () => {
              this.isShaking = false;
              PokerFlyDoneSignal.inst.dispatch();
            }
          );
        },
        this.getComponent(PokerRotationView).randomFlyDelay
      );
    }, this);

    PokerPositionChangedSignal.inst.addListenerThree(
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

  onPositionChanged(id: string, pos: cc.Vec2, type: MoveType) {
    if (!this.View.Model || this.View.Model.ID != id) {
      return;
    }

    if (this.View.Model.Parent.ParentType == ParentType.Recycle) return;

    let lastTime = GameStateController.inst.isReady ? 0.1 : 0.2;
    let delay = 0;
    let callback = () => {
      this.isShaking = false;
    };

    if (
      this.View.Model.isOnRecycle() &&
      type == MoveType.Drag &&
      PlayModelProxy.inst.isOnTutorial
    ) {
      return;
    }

    switch (type) {
      case MoveType.Drag:
        lastTime = 0;
        break;
      case MoveType.Normal:
        if (false) {
          delay = (this.View.Model.Point * 10) / 1000;
          lastTime = Distance(pos, this.node.position) / Speed;
          this.View.Model.Parent.sync();
        } else if (
          this.View.Model.Parent.ParentType == ParentType.Desk &&
          GetParentType(this.View.Model.Parent.OldParent) == ParentType.Ready
        ) {
          lastTime = 0.3;
          this.View.Model.Parent.sync();
        }
        callback = () => {
          this.isShaking = false;
          if (GameStateController.inst.isRoundStart()) {
          }

          if (
            this.View.Model.Parent.ParentType == ParentType.Recycle &&
            GetParentType(this.View.Model.Parent.OldParent) !=
              ParentType.Recycle
          ) {
          }
          this.node.zIndex = this.View.Model.Index;
          PokerPosMediator.maxZIndex = Math.max(
            this.node.zIndex,
            PokerPosMediator.maxZIndex
          );
        };
        break;
    }

    if (delay > 0) {
      setTimeout(() => {
        this.node.zIndex =
          (PokerPosMediator.maxZIndex + 1) % cc.macro.MAX_ZINDEX;

        if (type == MoveType.Normal) {
          PokerPosMediator.maxZIndex = this.node.zIndex;
        }
      }, delay * 1000);
    } else {
      this.node.zIndex = (PokerPosMediator.maxZIndex + 1) % cc.macro.MAX_ZINDEX;

      if (type == MoveType.Normal) {
        PokerPosMediator.maxZIndex = this.node.zIndex;
      }
    }
    this.isShaking = true;
    this.View.onPositionChanged(pos, lastTime, callback, delay);
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
