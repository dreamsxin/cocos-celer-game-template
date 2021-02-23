import App from "../../App/App";
import { GameOverSignal } from "../../Command/CommonSignal";
import {
  GameStateController,
  RoundEndType,
} from "../../Controller/GameStateController";
import {
  GetDrawCost,
  GetPokerFlipScore,
  GetPokerRecycleScore,
  RecycleLastTime,
} from "../../Global/GameRule";
import {
  PlayDispatchPokerSignal,
  PlayPokerFlySignal,
  PlayPokerPlaceSignal,
  PlayRecycleDrawSignal,
  PlayToDeskSignal,
} from "../../Manager/AudioManager";
import { PlayModelProxy } from "../../Model/PlayModelProxy";
import { Distance } from "../../Utils/Cocos";
import { HashMap } from "../../Utils/HashMap";
import { BaseSignal } from "../../Utils/Signal";
import { LastStepSignal, NextStepSignal } from "../Test/TestView";
import { ShowDrawAniamtionSignal } from "../View/Animation/DrawAnimation";
import { DispatchPokerToDeskSignal } from "../View/Game/DrawButton";
import ToturialLayer, {
  TutorialNextStepSignal,
  TutorialPrepareDoneSignal,
} from "../View/new/ToturialLayer";
import {
  FlyPokerSignal,
  ShakePokerSignal,
} from "../View/Poker/PokerPosMediator";
import { PokerFlyDelay } from "../View/Poker/PokerRotationView";
import {
  CheckAutoRecycleSignal,
  DrawCardSignal,
} from "../View/PokerInter/PokerToucherMediator";
import Draw, { RedrawCardSignal } from "../View/PokerRoot/Draw";
import { RevertSignal } from "../View/UI/RevertButtonView";
import {
  AfterGenLevelSignal,
  GamePlayModel,
  RevertButtonStateChangedSignal,
  ScoreType,
} from "./GamePlayModel";
import {
  Poker,
  PokerModel,
  PokerRemovedSignal,
  PokerType,
} from "./Poker/PokerModel";
import {
  DeskParents,
  ParentType,
  PokerParent,
  RecycleParents,
} from "./Poker/PokerParentModel";
import { PokerState } from "./Poker/PokerStateModel";
import { GetParentType, PokerSize } from "./Poker/PokerUtil";
import { PokerInfo, SolutionChecker, StepInfo } from "./SolutionChecker";

export interface Step {
  pokerIDs: string[];
  parents: PokerParent[];
  states: PokerState[];
  score: number;
  drawCount: number;
}

const PlaceDistance = PokerSize.width * 0.9;

export class NextRoundSignal extends BaseSignal {}

export class ReadyToFlyPokerSignal extends BaseSignal {}

export class FreeRedrawCountUpdateSignal extends BaseSignal {}

export class LevelChangedSignal extends BaseSignal {}

export class ClearStackCountSignal extends BaseSignal {}

export class GameLogic {
  private gamePlay: GamePlayModel;

  private recycle: HashMap<number, PokerModel[]> = new HashMap();

  private draw: PokerModel[] = [];

  private ready: PokerModel[] = [];

  private desk: HashMap<number, PokerModel[]> = new HashMap();

  private step: Step[] = [];
  private canDraw: boolean = true;

  private handleRevertLock: {} = {};

  private clearStackCount: number = 0;

  private freeRedrawCount = 3;
  private playHandleIndex: number = 0;

  private totalFlipCount: number = 0;
  private currentFlipCount: number = 0;
  private totalHasFlipCount: number = 0;
  private level: number = 0;

  private scoreSkip: HashMap<string, boolean> = new HashMap();

  constructor(gamePlay: GamePlayModel) {
    this.gamePlay = gamePlay;
    DrawCardSignal.inst.addListener(this.onDrawCard, this);
    RedrawCardSignal.inst.addListener(this.onCardRedraw, this);
    CheckAutoRecycleSignal.inst.addListenerOne((pokerModel: PokerModel) => {
      if (this.checkAutoRecycle(pokerModel)) {
      } else {
        if (pokerModel.State.isFront()) {
          ShakePokerSignal.inst.dispatchOne([pokerModel.ID]);
        }
      }
    }, this);
    RevertSignal.inst.addListener(this.revert, this);

    NextStepSignal.inst.addListener(this.onNextStepRequset, this);
    LastStepSignal.inst.addListener(this.onForwardStepRequset, this);

    GameOverSignal.inst.addListener(this.clearRevertRecord, this);

    DispatchPokerToDeskSignal.inst.addListener(this.dispatchPoker, this);
  }

  get Level() {
    return this.level;
  }

  set Level(val: number) {
    this.level = val;
    LevelChangedSignal.inst.dispatchOne(this.level);
  }

  get ClearStackCount() {
    return this.clearStackCount;
  }

  set ClearStackCount(val: number) {
    this.clearStackCount = val;
    ClearStackCountSignal.inst.dispatchOne(this.clearStackCount);
    if (this.clearStackCount >= 6) {
      GameStateController.inst.roundEnd(RoundEndType.Complete);
    }
  }

  recordFlipCount() {
    console.info(
      " record flip:",
      this.FlipCount,
      this.totalHasFlipCount,
      " , level:",
      this.level
    );
    this.totalHasFlipCount += this.FlipCount;
  }

  clear() {
    this.ready.length = 0;
    this.desk.clear();
    this.recycle.clear();
    this.scoreSkip.clear();
    this.draw.length = 0;
    this.step.length = 0;
    this.handleRevertLock = {};
    RevertButtonStateChangedSignal.inst.dispatchOne(this.hasStep());
  }

  clearRevertRecord() {
    this.canDraw = false;
    this.step.length = 0;
    RevertButtonStateChangedSignal.inst.dispatchOne(this.hasStep());
  }

  startByCheckerInfo(callback: () => void) {
    console.log(" total solution step:", SolutionChecker.inst.TotalStep);
    let pokers = SolutionChecker.inst.getRandomCache();
    if (!pokers) {
      return;
    }

    let pokerCount = 0;
    let addPokerCount = function () {
      pokerCount++;
      if (pokerCount >= 52) {
        setTimeout(() => {
          console.log(" ready .");
          callback();
        }, 500);
      }
      return pokerCount * 10;
    };
    // draw
    for (let i = 0; i < pokers.draw.length; i++) {
      let poker = pokers.draw[i];
      let model = new PokerModel(poker.point, poker.type, poker.parent);
      SolutionChecker.inst.bindPokerID(model);
      this.gamePlay.addToPokers(model.ID, model);
      setTimeout(
        (model) => {
          this.addToDraw(model);
          model.Position.updatePosition();
        },
        addPokerCount(),
        model
      );
    }

    // ready
    for (let i = 0; i < pokers.ready.length; i++) {
      let poker = pokers.ready[i];
      let model = new PokerModel(poker.point, poker.type, poker.parent);
      SolutionChecker.inst.bindPokerID(model);
      this.gamePlay.addToPokers(model.ID, model);
      setTimeout(
        (model) => {
          if (model.Index % 2) PlayDispatchPokerSignal.inst.dispatch();
          this.addToReady(model);
        },
        addPokerCount(),
        model
      );
    }

    // desk
    pokers.desk.forEach((deskIndex: number, pokerArr: PokerInfo[]) => {
      this.desk.add(deskIndex, []);
      let maxTime = 0;
      for (let poker of pokerArr) {
        let model = new PokerModel(poker.point, poker.type, poker.parent);
        SolutionChecker.inst.bindPokerID(model);
        this.gamePlay.addToPokers(model.ID, model);
        this.desk.get(deskIndex).push(model);
        model.Index = this.desk.get(deskIndex).length - 1;
        let delay = addPokerCount();
        setTimeout(
          (poker, model) => {
            if (
              poker.state == PokerState.Back &&
              poker.index < pokerArr.length - 1
            ) {
              console.log(" poker index:", poker.index, ", desk:", deskIndex);
              model.turnBack();
            } else {
              model.turnFront();
            }
          },
          delay,
          poker,
          model
        );
        maxTime = Math.max(maxTime, delay);
      }

      setTimeout(
        (deskIndex) => {
          PlayDispatchPokerSignal.inst.dispatch();
          this.updateDeskOffset(deskIndex);
          let deskPokers = this.desk.get(deskIndex);
          for (let model of deskPokers) {
            model.Position.updatePosition();
          }
        },
        maxTime,
        deskIndex
      );
    });

    //recycle
    pokers.recycle.forEach((recycleIndex: number, pokerArr: PokerInfo[]) => {
      this.recycle.add(recycleIndex, []);
      for (let poker of pokerArr) {
        let model = new PokerModel(poker.point, poker.type, poker.parent);
        SolutionChecker.inst.bindPokerID(model);
        this.scoreSkip.add(model.ID, true);
        this.gamePlay.addToPokers(model.ID, model);
        this.recycle.get(recycleIndex).push(model);
        model.Index = this.recycle.get(recycleIndex).length - 1;
        setTimeout(
          (model) => {
            if (model.Index % 2) PlayDispatchPokerSignal.inst.dispatch();
            model.turnFront();
            model.Position.updatePosition();
          },
          addPokerCount(),
          model
        );
      }
    });
  }

  onNextStepRequset() {
    let pokers = SolutionChecker.inst.getCurrentCache();
    if (pokers == null) {
      console.error("no step cache.");
      return;
    }

    console.log(
      "current step: ",
      SolutionChecker.inst.TotalStep - SolutionChecker.inst.CurrentStep
    );
    this.evalByPokers(pokers);
  }

  onForwardStepRequset() {
    let pokers = SolutionChecker.inst.getLastCache();
    if (pokers == null) {
      console.error("no step cache.");
      return;
    }

    console.log(
      "current step: ",
      SolutionChecker.inst.TotalStep - SolutionChecker.inst.CurrentStep
    );
    this.evalByPokers(pokers);

    let changeIndex = [];
    pokers.desk.forEach((deskIndex: number, pokers: PokerInfo[]) => {
      for (let poker of pokers) {
        let model = this.gamePlay.getPoker(poker.ID);
        if (model) {
          if (
            poker.state == PokerState.Back &&
            poker.index < pokers.length - 1
          ) {
            model.State.State = poker.state;
            changeIndex.push(deskIndex);
          }
        }
      }
      this.updateDeskOffset(deskIndex);
    });

    setTimeout(() => {
      this.desk.forEach((deskIndex: number, pokers: PokerModel[]) => {
        if (changeIndex.indexOf(deskIndex) >= 0) {
          for (let poker of pokers) {
            poker.Position.updatePosition();
          }
        }
      });
    }, 50);
  }

  evalByPokers(pokers: StepInfo) {
    // ready
    if (
      pokers.ready.length + pokers.draw.length ==
      this.ready.length + this.draw.length
    ) {
      // 洗牌区总数不变
      if (pokers.ready.length > this.ready.length) {
        // ready变多
        this.onDrawCard();
      } else if (pokers.ready.length < this.ready.length) {
        // ready 变少
        if (pokers.draw.length == this.ready.length) {
          this.onCardRedraw();
        } else {
          while (this.ready.length > pokers.ready.length) {
            let poker = this.ready.pop();
            this.readyToDraw(poker);
          }
          this.updateReadyOffset();
          for (let ready of this.ready) {
            ready.Position.updatePosition();
          }
        }
      } else {
        // nothing changed.
      }
    } else {
      // 洗牌区总数改变
      if (pokers.ready.length > this.ready.length) {
        // ready 变多
        for (let poker of pokers.ready) {
          if (poker.ID) {
            let model = this.gamePlay.getPoker(poker.ID);
            if (model) {
              if (model.Parent.Parent != poker.parent) {
                switch (model.Parent.ParentType) {
                  case ParentType.Desk:
                    this.revertFromDesk(model, poker.parent);
                    break;
                  case ParentType.Draw:
                    this.revertFromDraw(model, poker.parent);
                    break;
                  case ParentType.Ready:
                    !CELER_X && alert("ready 错误，截图反馈谢谢");
                    break;
                  case ParentType.Recycle:
                    this.revertFromRecycle(model, poker.parent);
                    break;
                }
              }
            } else {
              !CELER_X && alert("ready poker model不存在，截图反馈谢谢");
            }
          } else {
            !CELER_X && alert("ready poker ID不存在，截图反馈谢谢");
          }
        }
      } else if (pokers.ready.length < this.ready.length) {
        // ready 变少
        if (pokers.ready.length - this.ready.length < -1) {
          !CELER_X && alert("步骤大于1，截图反馈谢谢");
        } else {
          let poker = this.ready[this.ready.length - 1];
          let pokerInfo = SolutionChecker.inst.getPokerByID(poker.ID);

          this.revertFromReady(poker, pokerInfo.parent);
        }
      } else {
        !CELER_X && alert("翻牌出错");
      }
    }

    //desk
    pokers.desk.forEach((deskIndex: number, pokers: PokerInfo[]) => {
      for (let poker of pokers) {
        if (poker.ID) {
          let model = this.gamePlay.getPoker(poker.ID);
          if (model) {
            if (model.Parent.Parent != poker.parent) {
              switch (model.Parent.ParentType) {
                case ParentType.Desk:
                  this.revertFromDesk(model, poker.parent);
                  break;
                case ParentType.Draw:
                  this.revertFromDraw(model, poker.parent);
                  break;
                case ParentType.Ready:
                  this.revertFromReady(model, poker.parent);
                  break;
                case ParentType.Recycle:
                  this.revertFromRecycle(model, poker.parent);
                  break;
              }
            }
          } else {
            !CELER_X && alert("desk poker model不存在，截图反馈谢谢");
          }
        } else {
          !CELER_X && alert("desk poker ID不存在，截图反馈谢谢");
        }
      }
    });

    // recycle
    pokers.recycle.forEach((recycleIndex: number, pokers: PokerInfo[]) => {
      for (let poker of pokers) {
        if (poker.ID) {
          let model = this.gamePlay.getPoker(poker.ID);
          if (model) {
            if (model.Parent.Parent != poker.parent) {
              switch (model.Parent.ParentType) {
                case ParentType.Desk:
                  this.revertFromDesk(model, poker.parent);
                  break;
                case ParentType.Draw:
                  console.error(PokerParent[model.Parent.Parent], poker);
                  break;
                case ParentType.Ready:
                  this.revertFromReady(model, poker.parent);
                  break;
                case ParentType.Recycle:
                  this.revertFromRecycle(model, poker.parent);
                  break;
              }
            }
          } else {
            !CELER_X && alert("recycle poker model不存在，截图反馈谢谢");
          }
        } else {
          !CELER_X && alert("recycle poker ID不存在，截图反馈谢谢");
        }
      }
    });
  }

  checkIsShowFront(pokerModel: PokerModel): boolean {
    if (GameStateController.inst.isGameOver()) return true;
    switch (pokerModel.Parent.ParentType) {
      case ParentType.Desk:
      case ParentType.Draw:
        return true;
    }

    if (pokerModel.Parent.ParentType == ParentType.Ready) {
      if (this.ready.length <= 4) {
        return true;
      } else {
        return pokerModel.Index >= this.ready.length - 4;
      }
    } else {
      let recycleIndex = RecycleParents.indexOf(pokerModel.Parent.Parent);
      let recyclePokers = this.recycle.get(recycleIndex);
      if (recyclePokers == null || recyclePokers.length <= 2) {
        return true;
      } else {
        return pokerModel.Index >= recyclePokers.length - 2;
      }
    }
  }

  hasStep() {
    let hasStepCount = 0;
    for (let step of this.step) {
      if (step && step.pokerIDs.length > 0) hasStepCount++;
    }

    return hasStepCount > 0;
  }

  get TotalHasFlipCount() {
    if (this.totalHasFlipCount == 0) {
      this.totalHasFlipCount += this.FlipCount;
    }
    return this.totalHasFlipCount;
  }

  get FlipCount() {
    if (this.currentFlipCount == 0) {
      let restNotFlipCount = 0;

      this.desk.forEach((deskIndex: number, deskPokers: PokerModel[]) => {
        for (let poker of deskPokers) {
          if (poker.State.isFront() == false) {
            restNotFlipCount++;
          }
        }
      });

      this.currentFlipCount = Math.max(
        0,
        this.totalFlipCount - restNotFlipCount
      );
    }
    return this.currentFlipCount;
  }

  get FlipRate() {
    return this.FlipCount / this.totalFlipCount;
  }

  initTotalFlipCount() {
    let deskCount = 0;
    this.currentFlipCount = 0;
    this.desk.forEach((deskIndex: number, deskPokers: PokerModel[]) => {
      for (let poker of deskPokers) {
        if (poker.State.isFront() == false) {
          deskCount++;
        }
      }
    });
    this.totalFlipCount = deskCount;
    console.log("total need flip:", this.totalFlipCount);
  }

  revert() {
    if (this.step.length <= 0) return;
    if (this.handleRevertLock[this.playHandleIndex - 1]) return;
    if (GameStateController.inst.isGameOver()) return;

    let lastIndex = this.PlayHandleIndex - 1;
    let step = this.step[lastIndex];

    if (step == null) return;
    for (let i = 0; i < step.pokerIDs.length; i++) {
      let pokerID = step.pokerIDs[i];
      let oldState = step.states[i];
      let oldParent = step.parents[i];
      let poker = this.gamePlay.getPoker(pokerID);
      if (poker == null) {
        console.error(" cant find poker:", pokerID);
        continue;
      }
      if (oldState != poker.State.State) {
        if (oldState == PokerState.Back) {
          poker.State.turnBack();
          if (GetParentType(oldParent) == ParentType.Desk) {
            this.gamePlay.addPlayerScore(
              -GetPokerFlipScore(),
              ScoreType.Normal,
              1,
              Draw.PokerNodes.get(poker.ID)
            );
          }
        } else {
          poker.State.turnFront();
          if (GetParentType(oldParent) == ParentType.Desk) {
            this.gamePlay.addPlayerScore(
              GetPokerFlipScore(),
              ScoreType.Normal,
              1,
              Draw.PokerNodes.get(poker.ID)
            );
          }
        }
      }
    }

    for (let i = 0; i < step.pokerIDs.length; i++) {
      let pokerID = step.pokerIDs[i];
      let oldParent = step.parents[i];
      let poker = this.gamePlay.getPoker(pokerID);
      if (poker == null) {
        console.error(" cant find poker:", pokerID);
        continue;
      }

      switch (poker.Parent.ParentType) {
        case ParentType.Desk:
          this.revertFromDesk(poker, oldParent);
          break;
        case ParentType.Draw:
          this.revertFromDraw(poker, oldParent);
          break;
        case ParentType.Ready:
          this.revertFromReady(poker, oldParent);
          break;
        case ParentType.Recycle:
          this.revertFromRecycle(poker, oldParent);
          break;
      }
    }

    this.gamePlay.addPlayerScore(
      step.score,
      ScoreType.Normal,
      1,
      App.AppInstance.Revert
    );

    this.FreeDrawCount += step.drawCount;
    console.log(" revert :", this.PlayHandleIndex);
    this.step[lastIndex] = null;
    this.PlayHandleIndex--;
    this.gamePlay.addPlayerScore(
      -20,
      ScoreType.DrawCost,
      1,
      App.AppInstance.Revert
    );
  }

  revertFromDesk(pokerModel: PokerModel, oldParent: PokerParent) {
    switch (GetParentType(oldParent)) {
      case ParentType.Desk:
        this.deskToDesk(pokerModel, DeskParents.indexOf(oldParent), true);
        break;
      case ParentType.Draw:
        console.error(" cant revert from desk to draw");
        break;
      case ParentType.Ready:
        this.deskToReady(pokerModel);
        break;
      case ParentType.Recycle:
        this.deskToRecycle(pokerModel, RecycleParents.indexOf(oldParent), true);
        break;
    }
  }

  revertFromDraw(pokerModel: PokerModel, oldParent: PokerParent) {
    switch (GetParentType(oldParent)) {
      case ParentType.Desk:
        console.error(" cant not revert from draw .");
        break;
      case ParentType.Draw:
        console.error(" cant not revert from draw.");
        break;
      case ParentType.Ready:
        console.error(" cant not revert from draw ");
        break;
      case ParentType.Recycle:
        console.error(" cant not revert from draw .");
        break;
    }
  }

  revertFromRecycle(pokerModel: PokerModel, oldParent: PokerParent) {
    switch (GetParentType(oldParent)) {
      case ParentType.Desk:
        this.recycleToDesk(pokerModel, DeskParents.indexOf(oldParent), true);
        break;
      case ParentType.Draw:
        console.error(" cant not revert from recycle to draw.");
        break;
      case ParentType.Ready:
        this.recycleToReady(pokerModel);
        break;
      case ParentType.Recycle:
        this.recycleToRecycle(
          pokerModel,
          RecycleParents.indexOf(oldParent),
          true
        );
        break;
    }
  }

  revertFromReady(pokerModel: PokerModel, oldParent: PokerParent) {
    switch (GetParentType(oldParent)) {
      case ParentType.Desk:
        PlayDispatchPokerSignal.inst.dispatch();

        this.delFromReady(pokerModel);
        this.readyToDesk(
          pokerModel,
          DeskParents.indexOf(oldParent),
          true,
          false
        );
        this.updateReadyOffset();
        for (let readyPoker of this.ready) {
          readyPoker.Position.updatePosition();
        }
        break;
      case ParentType.Draw:
        PlayDispatchPokerSignal.inst.dispatch();
        this.delFromReady(pokerModel);
        this.readyToDraw(pokerModel);
        this.updateReadyOffset();
        for (let readyPoker of this.ready) {
          readyPoker.Position.updatePosition();
        }
        break;
      case ParentType.Ready:
        break;
      case ParentType.Recycle:
        PlayDispatchPokerSignal.inst.dispatch();
        this.delFromReady(pokerModel);
        this.updateReadyOffset();
        for (let readyPoker of this.ready) {
          readyPoker.Position.updatePosition();
        }
        this.readyToRecycle(
          pokerModel,
          RecycleParents.indexOf(oldParent),
          true,
          false
        );

        break;
    }
  }

  updateLock(deskIndex: number) {
    let pokers = this.desk.get(deskIndex);
    if (pokers && pokers.length > 0) {
      let hasLock = false;
      if (pokers.length > 0) {
        pokers[pokers.length - 1].Lock = false;
      }
      for (let i = pokers.length - 2; i >= 0; i--) {
        let topPokerModel = pokers[i];
        if (topPokerModel && topPokerModel.State.isFront() == false) break;
        if (hasLock && topPokerModel) {
          topPokerModel.Lock = true;
          continue;
        }

        let botPoker = pokers[i + 1];
        if (botPoker) {
          if (topPokerModel) {
            topPokerModel.Lock = !this.canBeNext(topPokerModel, botPoker);
            hasLock = topPokerModel.Lock;
          }
        } else {
          if (topPokerModel) {
            topPokerModel.Lock = false;
            hasLock = topPokerModel.Lock;
          }
        }
      }

      setTimeout(() => {
        this.checkIsComplete(deskIndex);
      }, 100);
    }
  }

  checkIsComplete(deskIndex: number) {
    let pokers = this.desk.get(deskIndex);
    if (pokers.length < 13) return;

    let botPoker = pokers[pokers.length - 1];
    if (botPoker.Point != Poker.$_A) return;
    let recyclePokers: PokerModel[] = [];
    recyclePokers.push(botPoker);
    let topPoker: PokerModel;
    for (let i = pokers.length - 2; i >= 0; i--) {
      topPoker = pokers[i];
      if (this.canBeNext(topPoker, botPoker)) {
        botPoker = topPoker;
        recyclePokers.push(topPoker);
        if (topPoker.Point == Poker.$_K) {
          break;
        }
      } else {
        break;
      }
    }

    if (topPoker && topPoker.Point == Poker.$_K) {
      console.log(
        " complete stack :",
        deskIndex,
        ", count:",
        recyclePokers.length
      );
      for (let poker of recyclePokers) {
        this.deskToRecycle(poker, 0, false);
        FlyPokerSignal.inst.dispatchOne(poker.ID);
      }

      this.PlayHandleIndex++;
      this.updateLock(deskIndex);
      this.clearStepCache();
      this.ClearStackCount++;
    }
  }

  addToStep(step: Step, isRevert: boolean = false) {
    if (this.step[this.playHandleIndex] == null) {
      this.step[this.playHandleIndex] = step;
    } else {
      if (isRevert) {
        this.step[this.playHandleIndex].drawCount += step.drawCount;
        this.step[this.playHandleIndex].parents = step.parents.concat(
          this.step[this.playHandleIndex].parents
        );
        this.step[this.playHandleIndex].pokerIDs = step.pokerIDs.concat(
          this.step[this.playHandleIndex].pokerIDs
        );

        this.step[this.playHandleIndex].states = step.states.concat(
          this.step[this.playHandleIndex].states
        );

        this.step[this.playHandleIndex].score += step.score;
      } else {
        this.step[this.playHandleIndex].drawCount += step.drawCount;
        this.step[this.playHandleIndex].parents = this.step[
          this.playHandleIndex
        ].parents.concat(step.parents);
        this.step[this.playHandleIndex].pokerIDs = this.step[
          this.playHandleIndex
        ].pokerIDs.concat(step.pokerIDs);

        this.step[this.playHandleIndex].states = this.step[
          this.playHandleIndex
        ].states.concat(step.states);

        this.step[this.playHandleIndex].score += step.score;
      }
    }
  }

  set PlayHandleIndex(val: number) {
    if (this.playHandleIndex < val) {
      // add new
      RevertButtonStateChangedSignal.inst.dispatchOne(
        !this.handleRevertLock[val - 1]
      );
      CELER_X && (this.step[this.playHandleIndex - 1] = null);
    } else {
      RevertButtonStateChangedSignal.inst.dispatchOne(
        !this.handleRevertLock[val - 1] && this.hasStep()
      );
    }

    this.playHandleIndex = val;
  }

  get PlayHandleIndex() {
    return this.playHandleIndex;
  }

  clearStepCache() {
    this.step.length = 0;
    RevertButtonStateChangedSignal.inst.dispatchOne(false);
  }

  addToDraw(pokerModel: PokerModel) {
    pokerModel.Index = this.draw.length;
    this.draw.unshift(pokerModel);
    pokerModel.Position.updatePosition();
  }

  devPokerToReady() {
    let count = 0;
    while (this.draw.length > 0) {
      let poker = this.draw.pop();
      setTimeout(
        (pokerModel: PokerModel, leftCount: number) => {
          this.addToReady(pokerModel);
          PlayDispatchPokerSignal.inst.dispatch();
          if (leftCount == 0) {
            this.gameReady();
          }
        },
        count * 30,
        poker,
        this.draw.length
      );
      count++;
    }
  }

  drawToDesk(deskIndex: number, isFront: boolean = false) {
    let poker = this.draw.pop();

    if (this.desk.has(deskIndex)) {
      this.desk.get(deskIndex).push(poker);
    } else {
      this.desk.add(deskIndex, [poker]);
    }

    poker.Index = this.desk.get(deskIndex).length - 1;

    if (isFront) {
      poker.turnFront();
    } else if (PlayModelProxy.inst.isOnTutorial) {
      if (deskIndex == 4 || deskIndex == 6) {
        if (poker.Index == deskIndex - 1) {
          poker.turnFront();
        }
      }
    }

    this.updateDeskOffset(deskIndex);
    PlayDispatchPokerSignal.inst.dispatch();
    poker.setParent(DeskParents[deskIndex]);
    if (PlayModelProxy.inst.isOnTutorial) {
      if (
        poker.Parent.Parent == PokerParent.Desk4 ||
        poker.Parent.Parent == PokerParent.Desk6
      ) {
        ToturialLayer.AddToturialStep(
          3,
          Draw.PokerNodes.get(poker.ID),
          null,
          poker.Point !== Poker.$_6,
          () => {},
          () => {},
          () => {},
          (poker.Point == Poker.$_6 && poker.Type == PokerType.Spade) ||
            (poker.Point == Poker.$_7 && poker.Type == PokerType.Diamond),
          -1,
          poker.Parent.Parent == PokerParent.Desk6
        );
      }
    }
  }

  gameReady() {
    this.canDraw = true;
    GameStateController.inst.isReady = true;
    if (this.Level > 1) {
      GameStateController.inst.roundStart();
    }
    console.log("发牌结束:", this.Level);
    AfterGenLevelSignal.inst.dispatch();

    this.initTotalFlipCount();
  }

  updateDeskOffset(deskIndex: number) {
    let desk = this.desk.get(deskIndex);

    if (desk) {
      let offset = desk.length > 19 ? 24 * 0.8 : 24;
      let offsetFront = desk.length > 19 ? 36 * 0.8 : 36;

      for (let i = 0; i < desk.length; i++) {
        let model = desk[i];
        let lastModel = desk[i - 1];
        model.Offset = offset;
        if (lastModel && lastModel.State.isFront()) {
          model.OffsetFront = offsetFront + lastModel.OffsetFront;
        } else {
          model.OffsetFront = 0;
        }
      }
    }
  }

  updateReadyOffset() {
    return;
    let offset = 60;
    if (this.ready.length == 1) {
      this.ready[0].Offset = 0;
    } else if (this.ready.length == 2) {
      this.ready[0].Offset = 0;
      this.ready[1].Offset = offset;
    } else if (this.ready.length == 3) {
      this.ready[0].Offset = 0;
      this.ready[1].Offset = offset;
      this.ready[2].Offset = offset * 2;
    } else {
      for (let poker of this.ready) {
        if (poker.Index <= this.ready.length - 3) {
          poker.Offset = 0;
        } else {
          poker.Offset = offset * (poker.Index - this.ready.length + 3);
        }
      }
    }
  }

  onDrawCard() {
    if (this.canDraw == false || this.draw.length <= 0) return;
    ShowDrawAniamtionSignal.inst.dispatchOne(false);
    RevertButtonStateChangedSignal.inst.dispatchOne(false);
    this.canDraw = false;
    let count = 2;
    let oldLength = this.draw.length;

    while (count >= 0) {
      if (this.draw[count]) {
        this.addToStep({
          pokerIDs: [this.draw[count].ID],
          parents: [PokerParent.Draw],
          states: [PokerState.Back],
          score: 0,
          drawCount: 0,
        });
      }
      count--;
    }

    count = 0;

    let currentHandleIndex = this.playHandleIndex;
    this.handleRevertLock[currentHandleIndex] = true;
    while (count++ < 3) {
      setTimeout(() => {
        if (this.draw.length <= 0) {
          this.canDraw = true;
          console.log(" draw card done:", this.draw.length);
          return;
        }

        let poker = this.draw.shift();
        if (this.draw.length <= 0) {
          ShowDrawAniamtionSignal.inst.dispatchOne(true);
        }
        this.addToReady(poker);
        PlayDispatchPokerSignal.inst.dispatch();
        if (oldLength - this.draw.length >= 3 || this.draw.length <= 0) {
          this.canDraw = true;
          this.handleRevertLock[currentHandleIndex] = false;

          setTimeout(() => {
            RevertButtonStateChangedSignal.inst.dispatchOne(
              this.hasStep() && !this.handleRevertLock[this.PlayHandleIndex - 1]
            );
          }, 110);

          console.log(" draw card done:", this.draw.length);

          if (PlayModelProxy.inst.isOnTutorial) {
            setTimeout(() => {
              TutorialNextStepSignal.inst.dispatch();
            }, 100);
          }
        }
      }, ((count - 1) / 20) * 1000);
    }

    this.addToStep({
      pokerIDs: [],
      parents: [],
      states: [],
      score: 0,
      drawCount: 0,
    });

    this.PlayHandleIndex++;
  }

  set FreeDrawCount(val: number) {
    this.freeRedrawCount = val;
    FreeRedrawCountUpdateSignal.inst.dispatchOne(this.freeRedrawCount);
  }

  get FreeDrawCount() {
    return this.freeRedrawCount;
  }

  onCardRedraw() {
    if (this.canDraw == false || this.draw.length > 0) return;

    let isPlayRecycleDraw = this.ready.length >= 4;
    if (isPlayRecycleDraw) {
      PlayRecycleDrawSignal.inst.dispatch();
    } else {
      PlayDispatchPokerSignal.inst.dispatch();
    }

    ShowDrawAniamtionSignal.inst.dispatchOne(false);
    if (this.FreeDrawCount > 0) {
      this.FreeDrawCount--;
      this.addToStep({
        parents: [],
        pokerIDs: [],
        score: 0,
        drawCount: 1,
        states: [],
      });
    } else {
      let scoreChanged = this.gamePlay.addPlayerScore(
        GetDrawCost(),
        ScoreType.DrawCost,
        1,
        App.AppInstance.Draw
      );

      this.addToStep({
        parents: [],
        pokerIDs: [],
        score: -scoreChanged,
        drawCount: 0,
        states: [],
      });
    }

    let changedModels: PokerModel[] = [];
    while (this.ready.length > 0) {
      let poker = this.ready.pop();
      this.readyToDraw(poker);
      changedModels.unshift(poker);
    }

    while (changedModels.length > 0) {
      let poker = changedModels.shift();
      this.addToStep({
        parents: [PokerParent.Ready],
        pokerIDs: [poker.ID],
        score: 0,
        drawCount: 0,
        states: [PokerState.Front],
      });
    }

    this.PlayHandleIndex++;
    console.log(
      " redraw card:",
      this.draw.length,
      ", ready:",
      this.ready.length
    );
  }

  onCancel(ID: string) {
    let pokerModel = this.gamePlay.getPoker(ID);
    if (pokerModel) {
      if (pokerModel.Parent.ParentType == ParentType.Desk) {
        this.onDeskPokerMovedEnd(pokerModel);
      } else {
        pokerModel.Position.onMovedEnd();
      }
    }
  }

  isTopOfReady(model: PokerModel) {
    if (this.canDraw == false) return false;

    let isOnReady = false;
    for (let readyPoker of this.ready) {
      if (readyPoker.ID == model.ID) {
        isOnReady = true;
        break;
      }
    }

    if (this.ready.length <= 0 || isOnReady == false) return false;

    return model.Index >= this.ready.length - 1;
  }

  isTopOfRecycle(model: PokerModel) {
    let isOnRecycle = false;
    let index = 0;
    this.recycle.forEach((recycleIndex: number, pokers: PokerModel[]) => {
      for (let recyclePoker of pokers) {
        if (recyclePoker.ID == model.ID) {
          index = recycleIndex;
          isOnRecycle = true;
          break;
        }
      }
    });

    if (isOnRecycle) {
      return model.Index >= this.recycle.get(index).length - 1;
    } else {
      return false;
    }
  }

  onDeskPokerMoved(pokerModel: PokerModel, detal: cc.Vec2) {
    let deskIndex = DeskParents.indexOf(pokerModel.Parent.Parent);
    if (deskIndex >= 0) {
      let deskPokers = this.desk.get(deskIndex);
      for (let deskPoker of deskPokers) {
        if (deskPoker.Index >= pokerModel.Index) {
          deskPoker.Position.onMoved(detal);
        }
      }
    }
  }

  onDeskPokerMovedEnd(pokerModel: PokerModel) {
    let deskIndex = DeskParents.indexOf(pokerModel.Parent.Parent);
    if (deskIndex >= 0) {
      let deskPokers = this.desk.get(deskIndex);
      for (let deskPoker of deskPokers) {
        if (deskPoker.Index >= pokerModel.Index) {
          deskPoker.Position.onMovedEnd();
        }
      }
    }
  }

  onMoved(ID: string, detal: cc.Vec2) {
    if (GameStateController.inst.isGameOver()) return;
    let pokerModel = this.gamePlay.getPoker(ID);
    if (pokerModel) {
      if (pokerModel.State.isFront()) {
        if (pokerModel.Parent.ParentType == ParentType.Ready) {
          // 判断一下是不是最顶端的牌
          if (this.isTopOfReady(pokerModel)) {
            pokerModel.Position.onMoved(detal);
          }
        } else if (pokerModel.Parent.ParentType == ParentType.Desk) {
          this.onDeskPokerMoved(pokerModel, detal);
        } else if (pokerModel.Parent.ParentType == ParentType.Recycle) {
          if (this.isTopOfRecycle(pokerModel)) {
            pokerModel.Position.onMoved(detal);
          }
        }
      } else {
        // poker is not front
      }
    } else {
      console.error("cant find poker:", ID);
    }
  }

  onMovedEnd(ID: string) {
    if (GameStateController.inst.isGameOver()) return;
    let pokerModel = this.gamePlay.getPoker(ID);
    if (pokerModel) {
      if (this.checkCanDragToDesk(pokerModel)) {
        console.log(" drag to desk. ");
      } else if (this.checkCanDragToRecycle(pokerModel)) {
        console.log(" drag to recycle. ");
      } else {
        if (pokerModel.Parent.ParentType == ParentType.Desk) {
          this.onDeskPokerMovedEnd(pokerModel);
        } else {
          pokerModel.Position.onMovedEnd();
        }
      }
    }
  }

  checkCanDragToDesk(pokerModel: PokerModel): boolean {
    let success = false;

    let toIndex = -1;
    let distance = 100000;
    for (let deskIndex = 0; deskIndex <= 7; deskIndex++) {
      let deskPokers = this.desk.get(deskIndex);

      if (deskPokers && deskPokers.length > 0) {
        let topPoker = deskPokers[deskPokers.length - 1];
        let currentDistance = Distance(
          topPoker.Position.Position,
          pokerModel.Position.MovingPosition
        );

        if (
          currentDistance <= PlaceDistance &&
          this.canBeNext(topPoker, pokerModel)
        ) {
          if (distance > currentDistance) {
            distance = currentDistance;
            toIndex = deskIndex;
          }
        } else {
        }
      } else {
        if (false) {
        } else {
          // 检测一下是否在范围
          let deskRoot = pokerModel.Position.getDeskRootPos(deskIndex);
          let currentDistance = Distance(
            deskRoot,
            pokerModel.Position.MovingPosition
          );
          if (currentDistance <= PlaceDistance) {
            if (distance > currentDistance) {
              distance = currentDistance;
              toIndex = deskIndex;
            }
          } else {
          }
        }
      }
    }

    success = toIndex != -1;
    if (success) {
      if (pokerModel.Parent.ParentType == ParentType.Desk) {
        this.deskToDesk(pokerModel, toIndex);
      } else if (pokerModel.Parent.ParentType == ParentType.Ready) {
        this.readyToDesk(pokerModel, toIndex);
      } else {
        this.recycleToDesk(pokerModel, toIndex);
      }
    }

    return success;
  }

  checkAutoRecycle(pokerModel: PokerModel, isCheck: boolean = false) {
    let hasRecycle = false;
    return hasRecycle;
    for (let recycleIndex = 0; recycleIndex <= 3; recycleIndex++) {
      let recyclePokers = this.recycle.get(recycleIndex);
      if (recyclePokers && recyclePokers.length > 0) {
        if (recyclePokers.length >= 13) {
          // Full
        } else {
          let oldPoker = recyclePokers[recyclePokers.length - 1];
          if (this.canBeRecycle(oldPoker, pokerModel)) {
            if (pokerModel.Parent.ParentType == ParentType.Desk) {
              if (isCheck == false) {
                this.deskToRecycle(pokerModel, recycleIndex);
              }
              hasRecycle = true;
            } else if (
              pokerModel.Parent.ParentType == ParentType.Ready &&
              this.isTopOfReady(pokerModel)
            ) {
              if (isCheck == false) {
                this.readyToRecycle(pokerModel, recycleIndex);
              }
              hasRecycle = true;
            } else {
            }
          }
        }
      } else {
        if (pokerModel.Point != Poker.$_A) {
        } else {
          if (pokerModel.Parent.ParentType == ParentType.Desk) {
            if (isCheck == false) {
              this.deskToRecycle(pokerModel, recycleIndex);
            }
            hasRecycle = true;
          } else if (
            pokerModel.Parent.ParentType == ParentType.Ready &&
            this.isTopOfReady(pokerModel)
          ) {
            if (isCheck == false) {
              this.readyToRecycle(pokerModel, recycleIndex);
            }
            hasRecycle = true;
          } else {
          }
        }
      }
    }

    return hasRecycle;
  }

  checkCanDragToRecycle(pokerModel: PokerModel) {
    return false;
    let success = false;
    let toIndex = -1;
    let distance = 100000;
    for (let recycleIndex = 0; recycleIndex <= 3; recycleIndex++) {
      let recyclePokers = this.recycle.get(recycleIndex);
      if (recyclePokers && recyclePokers.length > 0) {
        let oldPoker = recyclePokers[recyclePokers.length - 1];
        let currentDistance = Distance(
          oldPoker.Position.Position,
          pokerModel.Position.MovingPosition
        );

        if (
          currentDistance <= PlaceDistance &&
          this.canBeRecycle(oldPoker, pokerModel)
        ) {
          if (distance > currentDistance) {
            distance = currentDistance;
            toIndex = recycleIndex;
          }
        } else {
        }
      } else {
        if (pokerModel.Point != Poker.$_A) {
        } else {
          // 检测一下是否在范围
          let deskRoot = pokerModel.Position.getRecycleRootPos(recycleIndex);
          let currentDistance = Distance(
            deskRoot,
            pokerModel.Position.MovingPosition
          );
          if (currentDistance <= PlaceDistance) {
            if (distance > currentDistance) {
              distance = currentDistance;
              toIndex = recycleIndex;
            }
          } else {
          }
        }
      }
    }

    success = toIndex != -1;

    if (success) {
      if (pokerModel.Parent.ParentType == ParentType.Desk) {
        this.deskToRecycle(pokerModel, toIndex);
      } else if (pokerModel.Parent.ParentType == ParentType.Ready) {
        this.readyToRecycle(pokerModel, toIndex);
      } else {
        this.recycleToRecycle(pokerModel, toIndex);
      }
    }

    return success;
  }

  delFromReady(pokerModel: PokerModel) {
    for (let i = 0; i < this.ready.length; i++) {
      let model = this.ready[i];
      if (model.ID == pokerModel.ID) {
        this.ready.splice(i, 1);
        i--;
      } else {
        model.Index = i;
      }
    }
  }

  delFromDraw(pokerModel: PokerModel) {
    for (let i = 0; i < this.draw.length; i++) {
      let model = this.draw[i];
      if (model.ID == pokerModel.ID) {
        this.draw.splice(i, 1);
        i--;
      } else {
        model.Index = i;
      }
    }
  }

  canBeNext(pokerTop: PokerModel, pokerBot: PokerModel) {
    return (
      pokerTop.Point - pokerBot.Point == 1 && pokerTop.Color == pokerBot.Color
    );
  }

  canBeRecycle(pokerOld: PokerModel, pokerNew: PokerModel) {
    // return true;
    return (
      pokerNew.Point - pokerOld.Point == 1 && pokerNew.Type == pokerOld.Type
    );
  }

  deskToDesk(
    pokerModel: PokerModel,
    toIndex: number,
    isRevert: boolean = false
  ) {
    let deskIndex = DeskParents.indexOf(pokerModel.Parent.Parent);
    if (deskIndex < 0) {
      console.error("[deskToDesk] poker :", pokerModel.ID, " is not on desk");
      return;
    }

    if (deskIndex == toIndex) {
      PlayPokerPlaceSignal.inst.dispatch();
      this.onDeskPokerMovedEnd(pokerModel);
      return;
    }

    let deskPokers = this.desk.get(deskIndex);

    if (!deskPokers) return;
    let changedModels: PokerModel[] = [];
    for (let i = 0; i < deskPokers.length; i++) {
      let model = deskPokers[i];
      if (model.Index >= pokerModel.Index) {
        changedModels.push(model);
        if (isRevert == false) {
          this.addToStep({
            pokerIDs: [model.ID],
            parents: [model.Parent.Parent],
            states: [model.State.State],
            score: 0,
            drawCount: 0,
          });
        }
      }
    }

    if (this.desk.has(toIndex) == false) {
      this.desk.add(toIndex, []);
    }

    let toDeskPokers = this.desk.get(toIndex);
    for (let model of changedModels) {
      this.delFromDesk(model, isRevert);
      toDeskPokers.push(model);
      model.Index = toDeskPokers.length - 1;
    }

    this.updateDeskOffset(deskIndex);
    this.updateDeskOffset(toIndex);

    for (let model of changedModels) {
      model.setParent(DeskParents[toIndex]);
    }

    for (let model of deskPokers) {
      model.Position.updatePosition();
    }
    for (let model of toDeskPokers) {
      model.Position.updatePosition();
    }
    this.checkIsAutoComplete();

    if (isRevert == false) {
      this.PlayHandleIndex++;
    }
    PlayPokerPlaceSignal.inst.dispatch();

    this.updateLock(toIndex);
    this.updateLock(deskIndex);
  }

  recycleToRecycle(
    pokerModel: PokerModel,
    toIndex: number,
    isRevert: boolean = false
  ) {
    let recycleIndex = RecycleParents.indexOf(pokerModel.Parent.Parent);
    if (recycleIndex < 0) {
      console.error(
        "[recycleToRecycle] poker :",
        pokerModel.ID,
        " is not on recycle"
      );
      return;
    }

    if (recycleIndex == toIndex || PlayModelProxy.inst.isOnTutorial) {
      pokerModel.Position.onMovedEnd();
      return;
    }

    if (this.recycle.has(toIndex) == false) {
      this.recycle.add(toIndex, []);
    }

    let toRecyclePokers = this.recycle.get(toIndex);

    if (toRecyclePokers.length >= 13) {
      pokerModel.Position.onMovedEnd();
      return;
    }

    this.delFromRecycle(pokerModel);
    toRecyclePokers.push(pokerModel);
    pokerModel.Index = toRecyclePokers.length - 1;

    if (isRevert == false) {
      this.addToStep({
        pokerIDs: [pokerModel.ID],
        parents: [pokerModel.Parent.Parent],
        states: [pokerModel.State.State],
        drawCount: 0,
        score: 0,
      });
      this.PlayHandleIndex++;
    }
    pokerModel.setParent(RecycleParents[toIndex]);

    for (let model of toRecyclePokers) {
      model.Position.updatePosition();
    }
  }

  delFromDesk(
    pokerModel: PokerModel,
    isRevert: boolean = false,
    isRecycle: boolean = false
  ) {
    let deskIndex = DeskParents.indexOf(pokerModel.Parent.Parent);
    if (deskIndex < 0) {
      console.error("[delFromDesk] poker :", pokerModel.ID, " is not on desk");
      return;
    }

    let deskPokers = this.desk.get(deskIndex);

    if (!deskPokers) return;

    for (let i = 0; i < deskPokers.length; i++) {
      let model = deskPokers[i];
      if (model.ID == pokerModel.ID) {
        deskPokers.splice(i, 1);
        i--;
      } else {
        model.Index = i;
      }
    }

    for (let i = 0; i < deskPokers.length; i++) {
      let model = deskPokers[i];
      if (model.Index >= deskPokers.length - 1) {
        if (model.State.isFront() == false) {
          if (isRevert == false) {
            this.addToStep({
              pokerIDs: [model.ID],
              parents: [model.Parent.Parent],
              states: [model.State.State],
              score: 0,
              drawCount: 0,
            });
          }
          model.turnFront(isRecycle);
          PlayToDeskSignal.inst.dispatch();
          this.gamePlay.addPlayerScore(
            GetPokerFlipScore(),
            ScoreType.Normal,
            1,
            Draw.PokerNodes.get(model.ID)
          );
        }
      }
    }
  }

  delFromRecycle(pokerModel: PokerModel) {
    let recycleIndex = RecycleParents.indexOf(pokerModel.Parent.Parent);
    if (recycleIndex < 0) {
      console.error(" poker :", pokerModel.ID, " is not on recycle");
      return;
    }

    let recyclePokers = this.recycle.get(recycleIndex);

    if (!recyclePokers) return;

    for (let i = 0; i < recyclePokers.length; i++) {
      let model = recyclePokers[i];
      if (model.ID == pokerModel.ID) {
        recyclePokers.splice(i, 1);
        i--;
      } else {
        model.Index = i;
      }
    }
  }

  dispatchPoker() {
    if (this.ready.length <= 0) return;
    for (let deskIndex = 0; deskIndex <= 7; deskIndex++) {
      this.readyToDesk(this.ready.pop(), deskIndex, false, false);
    }
    this.PlayHandleIndex++;
  }

  // 加分
  readyToDesk(
    pokerModel: PokerModel,
    toIndex: number,
    isRevert: boolean = false,
    isPop: boolean = true
  ) {
    if (pokerModel == null) return false;

    if (isPop) {
      this.ready.pop();
    }

    this.updateReadyOffset();

    if (this.desk.has(toIndex) == false) {
      this.desk.add(toIndex, []);
    }

    let toDeskPokers = this.desk.get(toIndex);
    toDeskPokers.push(pokerModel);
    pokerModel.Index = toDeskPokers.length - 1;
    this.updateDeskOffset(toIndex);

    if (isRevert == false) {
      this.addToStep(
        {
          pokerIDs: [pokerModel.ID],
          parents: [pokerModel.Parent.Parent],
          states: [pokerModel.State.State],
          score: 0,
          drawCount: 0,
        },
        true
      );
    }
    PlayDispatchPokerSignal.inst.dispatch();
    pokerModel.setParent(DeskParents[toIndex]);
    pokerModel.turnFront();
    for (let model of toDeskPokers) {
      model.Position.updatePosition();
    }

    this.checkIsAutoComplete();
    this.updateLock(toIndex);
    return true;
  }

  // 扣分
  deskToReady(pokerModel: PokerModel) {
    let deskIndex = DeskParents.indexOf(pokerModel.Parent.Parent);
    if (deskIndex < 0) {
      console.error("[delFromDesk] poker :", pokerModel.ID, " is not on desk");
      return;
    }
    let deskPokers = this.desk.get(deskIndex);

    if (!deskPokers) return;
    if (deskPokers[deskPokers.length - 1].ID != pokerModel.ID) {
      console.log(" is not root of desk:", deskIndex);

      return;
    }

    this.delFromDesk(pokerModel);
    this.updateDeskOffset(deskIndex);
    this.addToReady(pokerModel);
    this.updateLock(deskIndex);
    PlayPokerPlaceSignal.inst.dispatch();
  }

  // 加分
  deskToRecycle(
    pokerModel: PokerModel,
    toIndex: number,
    isRevert: boolean = false
  ) {
    let deskIndex = DeskParents.indexOf(pokerModel.Parent.Parent);
    if (deskIndex < 0) {
      console.error("[delFromDesk] poker :", pokerModel.ID, " is not on desk");
      return;
    }
    let deskPokers = this.desk.get(deskIndex);

    if (!deskPokers) return;
    if (
      deskPokers[deskPokers.length - 1].ID != pokerModel.ID &&
      GameStateController.inst.isGameOver() == false
    ) {
      console.log(" is not root of desk:", deskIndex);
      this.onDeskPokerMovedEnd(pokerModel);
      return;
    }

    let changedModels: PokerModel[] = [];
    for (let i = 0; i < deskPokers.length; i++) {
      let model = deskPokers[i];
      if (model.Index >= pokerModel.Index) {
        changedModels.push(model);
      }
    }

    if (GameStateController.inst.isGameOver()) {
      changedModels = [pokerModel];
    }

    if (changedModels.length > 1) {
      console.error(" only desk root poker can to recycle.");
      return;
    }

    if (isRevert == false) {
      this.addToStep({
        pokerIDs: [pokerModel.ID],
        parents: [pokerModel.Parent.Parent],
        states: [pokerModel.State.State],
        score: 0,
        drawCount: 0,
      });
    }

    this.gamePlay.addPlayerScore(
      GetPokerRecycleScore(pokerModel.Point),
      ScoreType.Normal,
      1,
      Draw.PokerNodes.get(pokerModel.ID),
      (pokerModel.Point - 1) * PokerFlyDelay
    );

    if (this.recycle.has(toIndex) == false) {
      this.recycle.add(toIndex, []);
    }

    let toRecyclePokers = this.recycle.get(toIndex);
    for (let model of changedModels) {
      this.delFromDesk(model, isRevert, true);
      toRecyclePokers.push(model);
      model.Index = toRecyclePokers.length - 1;
    }

    this.updateDeskOffset(deskIndex);
    for (let model of deskPokers) {
      model.Position.updatePosition();
    }
    for (let model of changedModels) {
      model.setParent(RecycleParents[toIndex]);
    }
  }

  // 扣分
  recycleToDesk(
    pokerModel: PokerModel,
    toIndex: number,
    isRevert: boolean = false
  ) {
    let recycleIndex = RecycleParents.indexOf(pokerModel.Parent.Parent);
    if (recycleIndex < 0) {
      console.error(
        "[recycleToDesk] poker :",
        pokerModel.ID,
        " is not on desk"
      );
      return;
    }

    let recyclePokers = this.recycle.get(recycleIndex);

    if (!recyclePokers) return;

    if (this.desk.has(toIndex) == false) {
      this.desk.add(toIndex, []);
    }

    let toDeskPokers = this.desk.get(toIndex);
    this.delFromRecycle(pokerModel);
    toDeskPokers.push(pokerModel);
    pokerModel.Index = toDeskPokers.length - 1;

    this.updateDeskOffset(toIndex);

    if (isRevert == false) {
      this.addToStep({
        pokerIDs: [pokerModel.ID],
        parents: [pokerModel.Parent.Parent],
        states: [pokerModel.State.State],
        score: 0,
        drawCount: 0,
      });
      this.PlayHandleIndex++;
    }

    if (this.scoreSkip.has(pokerModel.ID) == false) {
      this.gamePlay.addPlayerScore(
        -GetPokerRecycleScore(pokerModel.Point),
        ScoreType.Normal,
        1,
        Draw.PokerNodes.get(pokerModel.ID)
      );
    }

    pokerModel.setParent(DeskParents[toIndex]);

    for (let model of toDeskPokers) {
      model.Position.updatePosition();
    }
    PlayPokerPlaceSignal.inst.dispatch();
    this.updateLock(toIndex);
  }

  // 加分
  readyToRecycle(
    pokerModel: PokerModel,
    toIndex: number,
    isRevert: boolean = false,
    isPop: boolean = true
  ) {
    console.error(" cant move from ready to recycle .");
    if (isPop) {
      let model = this.ready.pop();
      if (model.ID != pokerModel.ID) {
        console.error(
          " ready top is not same with handled model:",
          model.ID,
          pokerModel.ID
        );
      }
    }

    this.updateReadyOffset();
    for (let model of this.ready) {
      model.Position.updatePosition();
    }

    if (this.recycle.has(toIndex) == false) {
      this.recycle.add(toIndex, []);
    }

    let toRecyclePokers = this.recycle.get(toIndex);
    toRecyclePokers.push(pokerModel);
    pokerModel.Index = toRecyclePokers.length - 1;
    if (isRevert == false) {
      this.addToStep({
        pokerIDs: [pokerModel.ID],
        parents: [pokerModel.Parent.Parent],
        states: [pokerModel.State.State],
        score: 0,
        drawCount: 0,
      });
      this.PlayHandleIndex++;
    }

    if (
      this.scoreSkip.has(pokerModel.ID) == false &&
      GameStateController.inst.isGameOver() == false
    ) {
      setTimeout(() => {}, 300);
      this.gamePlay.addPlayerScore(
        GetPokerRecycleScore(pokerModel.Point),
        ScoreType.Normal,
        1,
        Draw.PokerNodes.get(pokerModel.ID),
        RecycleLastTime * 1000
      );

      this.gamePlay.addPlayerScore(
        GetPokerFlipScore(),
        ScoreType.Normal,
        1,
        Draw.PokerNodes.get(pokerModel.ID)
      );
    }

    console.log(" ready to recycle .");

    pokerModel.setParent(RecycleParents[toIndex]);
    PlayPokerPlaceSignal.inst.dispatch();
    this.checkIsAutoComplete();
  }

  checkScoreSkip(ID: string) {
    return this.scoreSkip.has(ID);
  }

  // 扣分
  recycleToReady(pokerModel: PokerModel) {
    this.delFromRecycle(pokerModel);
    this.addToReady(pokerModel);

    if (this.scoreSkip.has(pokerModel.ID) == false) {
      this.gamePlay.addPlayerScore(
        -GetPokerRecycleScore(pokerModel.Point),
        ScoreType.Normal,
        1,
        Draw.PokerNodes.get(pokerModel.ID)
      );
    }

    PlayPokerPlaceSignal.inst.dispatch();
  }

  addToReady(pokerModel: PokerModel, isRevert: boolean = false) {
    if (isRevert) {
      this.ready.unshift(pokerModel);
    } else {
      this.ready.push(pokerModel);
    }
    pokerModel.Index = this.ready.length - 1;
    pokerModel.turnBack();
    this.updateReadyOffset();
    pokerModel.setParent(PokerParent.Ready);
    pokerModel.Position.updatePosition();
  }

  readyToDraw(pokerModel: PokerModel) {
    this.addToDraw(pokerModel);
    pokerModel.turnBack();
    pokerModel.setParent(PokerParent.Draw);
  }

  checkIsAutoComplete() {
    return;
    if (GameStateController.inst.isGameOver()) return;

    if (this.draw.length > 0 || this.ready.length > 0) return;

    let isAllDone = true;
    this.desk.forEach((deskIndex: number, deskPokers: PokerModel[]) => {
      for (let poker of deskPokers) {
        if (poker.State.isFront() == false) {
          isAllDone = false;
          break;
        }
      }
    });

    if (isAllDone) {
      GameStateController.inst.roundEnd(RoundEndType.Complete);
      setTimeout(() => {
        let count = 0;
        this.desk.forEach((deskIndex: number, deskPokers: PokerModel[]) => {
          count += deskPokers.length;
        });

        let delay = 0;
        while (count > 0) {
          this.desk.forEach((deskIndex: number, deskPokers: PokerModel[]) => {
            let index = 0;
            while (index <= deskPokers.length - 1) {
              let poker = deskPokers[index];
              if (this.checkAutoRecycle(poker, true)) {
                this.checkAutoRecycle(poker);
                delay = Math.max(
                  poker.Point * 100 - poker.Index * 10 + 200,
                  delay
                );
                count--;
                index = 0;
              } else {
              }
              index++;
            }
          });
        }
        this.checkIsReadyToFly(delay + 1000);
      }, 120);
    }
  }

  checkIsReadyToFly(delay: number) {
    console.log("fly delay:", delay);
    let completeCount = 0;
    this.recycle.forEach(
      (recycleIndex: number, recyclePokers: PokerModel[]) => {
        if (recyclePokers.length >= 13) {
          completeCount++;
        }
      }
    );

    if (completeCount >= 4) {
      setTimeout(() => {
        FlyPokerSignal.inst.dispatch();
      }, delay);
    }

    return completeCount >= 4;
  }
}
