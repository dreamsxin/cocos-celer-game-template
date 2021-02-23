// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { ShowTutorialSignal } from "../../../Command/CommonSignal";
import { PlayModelProxy } from "../../../Model/PlayModelProxy";
import {
  ConvertToNodeSpaceAR,
  Distance,
  GetBoxToWorld,
} from "../../../Utils/Cocos";
import { BaseSignal } from "../../../Utils/Signal";
import BaseView from "../../../View/BaseView";
import HandAnimation from "../Animation/HandAnimation";
import { HideSubmitLayerSignal } from "../UI/SubmitLayerView";

export interface TutorialStep {
  touches: {
    node: cc.Node;
    blockEvent?: boolean;
    exceptNode: cc.Node;
    isButton: boolean;
    callback: Function;
    start: Function;
    end: Function;
    touchStarted?: boolean;
    isAction?: boolean;
  }[];
}

const { ccclass, property } = cc._decorator;

export class TutorialPrepareDoneSignal extends BaseSignal {}

export class TutorialNextStepSignal extends BaseSignal {}

@ccclass
export default class ToturialLayer extends BaseView {
  public static TutorialStep: TutorialStep[] = [];
  private closeCallback: Function = null;

  @property(cc.SpriteAtlas)
  tutorialAtlas: cc.SpriteAtlas = null;

  @property(cc.SpriteFrame)
  tutorialStart: cc.SpriteFrame = null;
  @property(cc.SpriteFrame)
  tutorialEnd: cc.SpriteFrame = null;

  private currentStep: number = 0;

  get GuideHand() {
    return this.node.getChildByName("GuideHand").getComponent(HandAnimation);
  }

  get Background() {
    return this.node.getChildByName("Background");
  }

  get Panel() {
    return this.node.getChildByName("GuidePanel").getComponent(cc.Sprite);
  }

  get Skip() {
    return this.node.getChildByName("btn_skip");
  }

  get OK() {
    return this.node.getChildByName("btn_ok");
  }

  onLoad() {
    super.onLoad();
    ShowTutorialSignal.inst.addListenerOne(this.showToturial, this);
    setTimeout(() => {
      this.node.active = false;
    }, 0);

    this.Background.on(
      cc.Node.EventType.TOUCH_CANCEL,
      this.onBlockTouchCancel,
      this
    );

    TutorialNextStepSignal.inst.addListener(() => {
      if (PlayModelProxy.inst.isOnTutorial) {
        this.nextStep();
      }
    }, this);

    this.Background.on(cc.Node.EventType.TOUCH_END, this.onBlockTouchEnd, this);

    this.Background.on(
      cc.Node.EventType.TOUCH_START,
      this.onBlockTouchStart,
      this
    );

    this.Background.on(
      cc.Node.EventType.TOUCH_MOVE,
      this.onBlockTouchMoved,
      this
    );

    this.OK.once(
      cc.Node.EventType.TOUCH_END,
      () => {
        this.OK.active = false;
        this.nextStep();
      },
      this
    );

    this.Skip.on(
      cc.Node.EventType.TOUCH_END,
      () => {
        this.endTutorial();
      },
      this
    );

    this.OK.active = false;
    this.Skip.active = false;
    this.GuideHand.node.active = false;
    TutorialPrepareDoneSignal.inst.addListener(() => {
      this.OK.active = true;
      this.Skip.active = true;
    }, this);
  }

  evalStepAction() {
    let curStep = ToturialLayer.TutorialStep[this.currentStep];
    if (curStep == null) return;
    let actions: cc.FiniteTimeAction[] = [];
    let speed = 550;

    let touchActions = [];
    for (let touch of curStep.touches) {
      if (touch.isAction) touchActions.unshift(touch.node);
    }

    if (touchActions.length > 0) {
      let pos;
      if (curStep.touches.length > 1) {
        pos = ConvertToNodeSpaceAR(touchActions[1], this.GuideHand.node.parent);
      } else {
        pos = ConvertToNodeSpaceAR(touchActions[0], this.GuideHand.node.parent);
      }
      this.GuideHand.node.position = pos;
    }

    let hasAction = false;

    for (let touch of curStep.touches) {
      touch.node.group = "move";
      touch.start();
      if (touch.isAction) {
        hasAction = true;
        let pos = ConvertToNodeSpaceAR(touch.node, this.GuideHand.node.parent);
        let time = Distance(pos, this.GuideHand.node.position);
        let action = cc.moveTo(time / speed, pos);

        actions.push(action);
        if (actions.length == 1) {
          actions.push(cc.fadeIn(0.2));
        }
        if (actions.length == 3) {
          actions.push(cc.fadeOut(0.2));
          actions.push(cc.delayTime(0.3));
        }
      }
    }

    this.GuideHand.node.active = actions.length > 0;
    this.GuideHand.node.stopAllActions();
    this.GuideHand.node.opacity = 255;
    if (actions.length > 3) {
      this.GuideHand.stop();
      this.GuideHand.getComponent(
        cc.Sprite
      ).spriteFrame = this.tutorialAtlas.getSpriteFrame("am_guidehand1");

      this.GuideHand.node.runAction(cc.repeatForever(cc.sequence(actions)));
    } else if (hasAction) {
      this.GuideHand.playOnLoop();
    }
  }

  public static AddToturialStep(
    stepIndex: number,
    node: cc.Node,
    exceptNode: cc.Node,
    isButton: boolean,
    callback: Function,
    start: Function,
    end: Function,
    isAction?: boolean,
    targetIndex: number = -1,
    blockEvent?: boolean
  ) {
    if (this.TutorialStep[stepIndex] == null) {
      this.TutorialStep[stepIndex] = {
        touches: [
          {
            node: node,
            exceptNode: exceptNode,
            isButton: isButton,
            callback: callback,
            start: start,
            end: end,
            isAction: isAction,
            blockEvent: blockEvent,
          },
        ],
      };
    } else {
      if (
        targetIndex >= 0 &&
        this.TutorialStep[stepIndex].touches[targetIndex]
      ) {
        if (!this.TutorialStep[stepIndex].touches[targetIndex].callback) {
          this.TutorialStep[stepIndex].touches[targetIndex].callback = callback;
        }

        if (!this.TutorialStep[stepIndex].touches[targetIndex].start) {
          this.TutorialStep[stepIndex].touches[targetIndex].start = start;
        }

        if (!this.TutorialStep[stepIndex].touches[targetIndex].node) {
          this.TutorialStep[stepIndex].touches[targetIndex].node = node;
        }

        if (!this.TutorialStep[stepIndex].touches[targetIndex].exceptNode) {
          this.TutorialStep[stepIndex].touches[
            targetIndex
          ].exceptNode = exceptNode;
        }

        if (!this.TutorialStep[stepIndex].touches[targetIndex].isButton) {
          this.TutorialStep[stepIndex].touches[targetIndex].isButton = isButton;
        }

        if (!this.TutorialStep[stepIndex].touches[targetIndex].end) {
          this.TutorialStep[stepIndex].touches[targetIndex].end = end;
        }

        if (!this.TutorialStep[stepIndex].touches[targetIndex].isAction) {
          this.TutorialStep[stepIndex].touches[targetIndex].isAction = isAction;
        }

        if (!this.TutorialStep[stepIndex].touches[targetIndex].blockEvent) {
          this.TutorialStep[stepIndex].touches[
            targetIndex
          ].blockEvent = blockEvent;
        }
      } else {
        this.TutorialStep[stepIndex].touches.push({
          node: node,
          exceptNode: exceptNode,
          isButton: isButton,
          callback: callback,
          start: start,
          end: end,
          isAction: isAction,
          blockEvent: blockEvent,
        });
      }
    }
  }

  nextStep() {
    let lastStep = this.currentStep;
    this.GuideHand.node.active = false;
    if (ToturialLayer.TutorialStep[lastStep]) {
      for (let touch of ToturialLayer.TutorialStep[lastStep].touches) {
        if (touch.end) {
          touch.end();
        }

        if (touch.node) {
          touch.node.group = "default";
          touch.node.zIndex = touch.node.zIndex;
        }
      }

      ToturialLayer.TutorialStep[lastStep] = null;
    }

    this.currentStep++;

    if (ToturialLayer.TutorialStep[this.currentStep] != null) {
      this.Panel.spriteFrame = this.tutorialAtlas.getSpriteFrame(
        "guide" + this.currentStep
      );
      this.Panel.node.y = -395;
      this.evalStepAction();
    } else {
      this.Panel.node.y = 135;
      this.Panel.spriteFrame = this.tutorialEnd;
      this.OK.active = true;
      this.OK.once(
        cc.Node.EventType.TOUCH_END,
        () => {
          this.endTutorial();
        },
        this
      );
    }
  }

  onBlockTouchStart(e: cc.Event.EventTouch) {
    if (PlayModelProxy.inst.isOnTutorial == false) return;

    let curStep = ToturialLayer.TutorialStep[this.currentStep];
    if (curStep == null) return;

    for (let touch of curStep.touches) {
      let exceptChild = touch.exceptNode;

      if (
        GetBoxToWorld(touch.node, exceptChild).contains(e.getLocation()) &&
        !touch.blockEvent
      ) {
        touch.node.dispatchEvent(e);
        touch.touchStarted = true;
      }
    }
  }

  onBlockTouchEnd(e: cc.Event.EventTouch) {
    if (PlayModelProxy.inst.isOnTutorial == false) return;
    let curStep = ToturialLayer.TutorialStep[this.currentStep];
    if (curStep == null) return;

    for (let touch of curStep.touches) {
      if (touch.touchStarted) {
        touch.node.dispatchEvent(e);
        touch.touchStarted = false;
      }
    }
  }

  onBlockTouchMoved(e: cc.Event.EventTouch) {
    if (PlayModelProxy.inst.isOnTutorial == false) return;

    let curStep = ToturialLayer.TutorialStep[this.currentStep];
    if (curStep == null) return;

    for (let touch of curStep.touches) {
      if (touch.isButton || !touch.touchStarted) continue;

      e.bubbles = false;
      touch.node.dispatchEvent(e);
    }
  }

  onBlockTouchCancel(e: cc.Event.EventTouch) {
    if (PlayModelProxy.inst.isOnTutorial == false) return;

    let curStep = ToturialLayer.TutorialStep[this.currentStep];
    if (curStep == null) return;
    for (let touch of curStep.touches) {
      let exceptChild = touch.exceptNode;

      if (
        GetBoxToWorld(touch.node, exceptChild).contains(e.getLocation()) &&
        touch.touchStarted
      ) {
        let event = new cc.Event.EventCustom(e.getType(), false);
        event.setUserData(touch.callback);
        event["getID"] = () => {
          return 0;
        };
        touch.node.dispatchEvent(event);
        touch.touchStarted = false;
      }
    }
  }

  showToturial(closeCallback: Function) {
    if (this.node.active) return;
    this.closeCallback = closeCallback;
    this.Show();
    this.Panel.node.y = 135;
    this.Panel.spriteFrame = this.tutorialStart;
    HideSubmitLayerSignal.inst.dispatch();
  }

  endTutorial() {
    for (let step of ToturialLayer.TutorialStep) {
      if (step && step.touches) {
        for (let info of step.touches) {
          if (info.end) {
            info.end();
          }

          if (info.node) info.node.group = "default";
        }
      }
    }

    ToturialLayer.TutorialStep.length = 0;

    if (this.closeCallback) {
      this.closeCallback();
      this.closeCallback = null;
    }
    HideSubmitLayerSignal.inst.dispatch();
    this.Hide();
  }
}
