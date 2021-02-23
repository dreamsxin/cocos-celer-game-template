import { kill } from "process";
import { emitKeypressEvents } from "readline";
import { CelerSDK } from "../../Utils/Celer/CelerSDK";
import { disOrderArray } from "../../Utils/Cocos";
import { HashMap } from "../../Utils/HashMap";
import { Random } from "../../Utils/Random";
import { SingleTon } from "../../Utils/ToSingleton";
import { StepUpdateSignal } from "../Test/TestView";
import {
  Poker,
  PokerModel,
  PokerRemovedSignal,
  PokerType,
} from "./Poker/PokerModel";
import {
  DeskParents,
  PokerParent,
  RecycleParents,
} from "./Poker/PokerParentModel";
import { PokerState } from "./Poker/PokerStateModel";
import { getColorByType, GetPokerString } from "./Poker/PokerUtil";

export interface PokerInfo {
  point: Poker;
  type: PokerType;
  parent: PokerParent;
  state: PokerState;
  index: number;
  ID?: string;
}

export interface StepInfo {
  draw: PokerInfo[];
  ready: PokerInfo[];
  desk: HashMap<number, PokerInfo[]>;
  recycle: HashMap<number, PokerInfo[]>;
}

/**
 * difficultyLevel == 1： 普通版
 * difficultyLevel == 2： 三分钟有解版
 * difficultyLevel == 3： 无尽残局版
 */
export class SolutionChecker extends SingleTon<SolutionChecker>() {
  private recycle: HashMap<number, PokerInfo[]> = new HashMap();

  private draw: PokerInfo[] = [];

  private ready: PokerInfo[] = [];

  private desk: HashMap<number, PokerInfo[]> = new HashMap();

  private totalStepCount: number = 0;
  private _currentStep: number = 0;

  private solutionPokers: string[] = [];

  private selectedDeskIndex: number[] = [];

  private stepCache: HashMap<number, StepInfo> = new HashMap();

  get SolutionPokers() {
    return this.solutionPokers.concat([]);
  }

  get currentStep() {
    return this._currentStep;
  }

  set currentStep(val: number) {
    this._currentStep = val;
    StepUpdateSignal.inst.dispatchOne(this._currentStep);
  }

  checkCanBeNext(pokerA: PokerInfo, pokerNext: PokerInfo) {
    if (pokerA == null) {
      return pokerNext.point == Poker.$_K;
    } else {
      let colorA = getColorByType(pokerA.type);
      let colorNext = getColorByType(pokerNext.type);
      return colorA != colorNext && pokerA.point - pokerNext.point == 1;
    }
  }

  checkCanBeRecycle(pokerA: PokerInfo, pokerNext: PokerInfo) {
    if (pokerA == null) {
      return pokerNext.point == Poker.$_A;
    } else {
      return (
        pokerA.type == pokerNext.type && pokerA.point - pokerNext.point == -1
      );
    }
  }

  bindPokerID(model: PokerModel) {
    this.stepCache.forEach((step: number, stepInfo: StepInfo) => {
      stepInfo.desk.forEach((index: number, pokers: PokerInfo[]) => {
        for (let poker of pokers) {
          if (poker.type == model.Type && poker.point == model.Point) {
            poker.ID = model.ID;
          }
        }
      });

      stepInfo.recycle.forEach((index: number, pokers: PokerInfo[]) => {
        for (let poker of pokers) {
          if (poker.type == model.Type && poker.point == model.Point) {
            poker.ID = model.ID;
          }
        }
      });

      for (let poker of stepInfo.ready) {
        if (poker.type == model.Type && poker.point == model.Point) {
          poker.ID = model.ID;
        }
      }

      for (let poker of stepInfo.draw) {
        if (poker.type == model.Type && poker.point == model.Point) {
          poker.ID = model.ID;
        }
      }
    });
  }

  clear() {
    this.recycle.clear();
    this.draw.length = 0;
    this.ready.length = 0;
    this.desk.clear();
    this.totalStepCount = 0;
    this.currentStep = 0;
    this.stepCache.clear();
  }

  initialRecycle() {
    let pokerTypePool = [];

    while (pokerTypePool.length < 100) {
      pokerTypePool.push(PokerType.Club);
      pokerTypePool.push(PokerType.Diamond);
      pokerTypePool.push(PokerType.Heart);
      pokerTypePool.push(PokerType.Spade);
    }
    disOrderArray(pokerTypePool);

    /** initial recycle  */
    for (let recycleIndex = 0; recycleIndex <= 3; recycleIndex++) {
      let typeIndex = Random.randomFloorToInt(0, pokerTypePool.length);
      let pokerType = pokerTypePool.splice(typeIndex, 1)[0];
      for (let i = 0; i < pokerTypePool.length; i++) {
        if (pokerTypePool[i] == pokerType) {
          pokerTypePool.splice(i, 1);
          i--;
        }
      }

      this.recycle.add(recycleIndex, []);
      for (let point = Poker.$_A; point <= Poker.$_K; point++) {
        this.recycle.get(recycleIndex).push({
          point: point,
          state: PokerState.Front,
          parent: RecycleParents[recycleIndex],
          type: pokerType,
          index: point - 1,
        });
      }
    }

    this.addToCache();
  }

  /** initial desk */
  initialDesk() {
    /** add to desk */

    let deskIndexPool = [];
    while (deskIndexPool.length < 600) {
      deskIndexPool.push(0);
      deskIndexPool.push(1);
      deskIndexPool.push(2);
      deskIndexPool.push(3);
      deskIndexPool.push(4);
      deskIndexPool.push(5);
      deskIndexPool.push(6);
    }
    disOrderArray(deskIndexPool);

    this.selectedDeskIndex.length = 0;
    while (this.selectedDeskIndex.length < 4) {
      let deskIndex = deskIndexPool.splice(
        Random.randomFloorToInt(0, deskIndexPool.length),
        1
      )[0];
      this.selectedDeskIndex.push(deskIndex);
      for (let i = 0; i < deskIndexPool.length; i++) {
        if (deskIndexPool[i] == deskIndex) {
          deskIndexPool.splice(i, 1);
          i--;
        }
      }
    }

    let deskIndex1 = this.selectedDeskIndex[0];
    let deskIndex2 = this.selectedDeskIndex[1];
    let deskIndex3 = this.selectedDeskIndex[2];
    let deskIndex4 = this.selectedDeskIndex[3];

    console.log("selectedDeskIndex:", this.selectedDeskIndex);
    for (let i = 0; i <= 6; i++) {
      this.desk.add(i, []);
    }

    let isConitnue = [
      this.desk.get(deskIndex1)[this.desk.get(deskIndex1).length - 1] == null ||
        this.desk.get(deskIndex1)[this.desk.get(deskIndex1).length - 1].point !=
          Poker.$_A,
      this.desk.get(deskIndex2)[this.desk.get(deskIndex2).length - 1] == null ||
        this.desk.get(deskIndex2)[this.desk.get(deskIndex2).length - 1].point !=
          Poker.$_A,
      this.desk.get(deskIndex3)[this.desk.get(deskIndex3).length - 1] == null ||
        this.desk.get(deskIndex3)[this.desk.get(deskIndex3).length - 1].point !=
          Poker.$_A,
      this.desk.get(deskIndex4)[this.desk.get(deskIndex4).length - 1] == null ||
        this.desk.get(deskIndex4)[this.desk.get(deskIndex4).length - 1].point !=
          Poker.$_A,
    ];

    let selectedDesk = this.selectedDeskIndex.concat();
    while (isConitnue[0] || isConitnue[1] || isConitnue[2] || isConitnue[3]) {
      this.recycle.forEach((recycleIndex: number, pokers: PokerInfo[]) => {
        if (pokers.length > 0) {
          let poker = pokers[pokers.length - 1];

          for (let deskIndex of selectedDesk) {
            let pokerDesk = this.desk.get(deskIndex)[
              this.desk.get(deskIndex).length - 1
            ];

            if (this.checkCanBeNext(pokerDesk, poker)) {
              this.addToDesk(poker, deskIndex);
              pokers.pop();
              break;
            }
          }
        }
      });

      isConitnue = [
        this.desk.get(deskIndex1)[this.desk.get(deskIndex1).length - 1] ==
          null ||
          this.desk.get(deskIndex1)[this.desk.get(deskIndex1).length - 1]
            .point != Poker.$_A,
        this.desk.get(deskIndex2)[this.desk.get(deskIndex2).length - 1] ==
          null ||
          this.desk.get(deskIndex2)[this.desk.get(deskIndex2).length - 1]
            .point != Poker.$_A,
        this.desk.get(deskIndex3)[this.desk.get(deskIndex3).length - 1] ==
          null ||
          this.desk.get(deskIndex3)[this.desk.get(deskIndex3).length - 1]
            .point != Poker.$_A,
        this.desk.get(deskIndex4)[this.desk.get(deskIndex4).length - 1] ==
          null ||
          this.desk.get(deskIndex4)[this.desk.get(deskIndex4).length - 1]
            .point != Poker.$_A,
      ];
    }
    /** end  add to desk */
    this.addToCache();
  }

  startGeneratePokers() {
    let loopCount = 0;
    let startTime = Date.now();
    while (loopCount++ < 100 && this.doGenerate() == false) {}
    console.log(
      " generate time:",
      loopCount,
      ",cost time:",
      Date.now() - startTime,
      " ms"
    );

    /** 非残局版 */
    if (CelerSDK.inst.DifficultyLevel != 3) {
      let lengthLimit = 6;
      for (let i = lengthLimit; i >= 0; i--) {
        for (let j = 6; j >= i; j--) {
          let pokers = this.desk.get(j);
          if (pokers.length > 0) {
            let poker = pokers.pop();
            this.draw.unshift(poker);
            poker.index = this.draw.length - 1;
            poker.state = PokerState.Back;
            poker.parent = PokerParent.Draw;
          }
        }
      }

      for (let poker of this.draw) {
        this.solutionPokers.unshift(GetPokerString(poker.type, poker.point));
      }
      console.log(this.solutionPokers);
    }
  }

  private doGenerate() {
    this.clear();
    /**  initial recycle */
    this.initialRecycle();
    /**  initial desk */
    this.initialDesk();
    /** return to Recycle */
    this.returnToRecycle();
    /** return all */

    let isSuccess = this.returnAll();

    let totalPokerCount = 0;
    totalPokerCount += this.ready.length;
    totalPokerCount += this.draw.length;
    let drawCount = totalPokerCount;
    let recycleCount = [];
    let deskCount = [];
    this.recycle.forEach((index: number, pokers: PokerInfo[]) => {
      totalPokerCount += pokers.length;
      recycleCount[index] = pokers.length;
    });
    this.desk.forEach((index: number, pokers: PokerInfo[]) => {
      totalPokerCount += pokers.length;
      deskCount[index] = pokers.length;
    });
    console.log(
      " total:",
      totalPokerCount,
      ",draw:",
      drawCount,
      ",desk:",
      deskCount,
      ",recycle:",
      recycleCount,
      ",loopCount: ",
      this.returnLoopCount
    );

    if (totalPokerCount < 52) {
      console.error(" poker missing.");
    }

    return isSuccess;
  }

  getPokerByID(ID: string): PokerInfo {
    let pokerReturn: PokerInfo = null;
    let pokers = this.getCache(this.currentStep);

    pokers.desk.forEach((index: number, pokers: PokerInfo[]) => {
      for (let poker of pokers) {
        if (poker.ID == ID) {
          if (pokerReturn != null) {
            console.log("desk dumplicate:", ID);
          }
          pokerReturn = poker;
        }
      }
    });

    pokers.recycle.forEach((index: number, pokers: PokerInfo[]) => {
      for (let poker of pokers) {
        if (poker.ID == ID) {
          if (pokerReturn != null) {
            console.log("recycle dumplicate:", ID);
          }
          pokerReturn = poker;
        }
      }
    });

    for (let poker of pokers.ready) {
      if (poker.ID == ID) {
        if (pokerReturn != null) {
          console.log("ready dumplicate:", ID);
        }
        pokerReturn = poker;
      }
    }

    for (let poker of pokers.draw) {
      if (poker.ID == ID) {
        if (pokerReturn != null) {
          console.log("draw dumplicate:", ID);
        }
        pokerReturn = poker;
      }
    }

    return pokerReturn;
  }

  private returnLoopCount = 0;
  returnAll() {
    let loopCount = 0;
    let totalLoopCount = 100;

    if (this.returnLoopCount >= 30) return;
    while (this.isReturnComplete() == false && loopCount++ < totalLoopCount) {
      /**
       *  1.先铺个desk底牌
       */

      let returnRecycleIndexes = [];
      this.recycle.forEach((recycleIndex: number, pokers: PokerInfo[]) => {
        if (pokers.length > 0) {
          returnRecycleIndexes.push(recycleIndex);
        }
      });

      disOrderArray(returnRecycleIndexes);

      let returnDeskIndexes = [];
      this.desk.forEach((deskIndex: number, pokers: PokerInfo[]) => {
        if (
          this.isDeskComplete(deskIndex) == false &&
          pokers.length > 1 &&
          pokers[pokers.length - 1].state == PokerState.Front &&
          pokers[pokers.length - 2].state == PokerState.Front &&
          this.checkCanBeNext(
            pokers[pokers.length - 2],
            pokers[pokers.length - 1]
          )
        ) {
          returnDeskIndexes.push(deskIndex);
        }
      });
      disOrderArray(returnDeskIndexes);

      let nonePokerDeskIndex = [];
      this.desk.forEach((deskIndex: number, pokers: PokerInfo[]) => {
        if (pokers.length <= 0) {
          nonePokerDeskIndex.push(deskIndex);
        }
      });
      disOrderArray(nonePokerDeskIndex);
      while (nonePokerDeskIndex.length > 0) {
        // !CELER_X && console.log("nonePokerDeskIndex:", nonePokerDeskIndex);
        returnDeskIndexes = [];
        this.desk.forEach((deskIndex: number, pokers: PokerInfo[]) => {
          if (
            this.isDeskComplete(deskIndex) == false &&
            pokers.length > 1 &&
            pokers[pokers.length - 1].state == PokerState.Front &&
            pokers[pokers.length - 2].state == PokerState.Front &&
            this.checkCanBeNext(
              pokers[pokers.length - 2],
              pokers[pokers.length - 1]
            )
          ) {
            returnDeskIndexes.push(deskIndex);
          }
        });
        disOrderArray(returnDeskIndexes);

        for (let noneIndex of nonePokerDeskIndex) {
          if (Random.getRandom() > 0.5) {
            if (returnDeskIndexes.length > 0) {
              let fromDeskIndex =
                returnDeskIndexes[
                  Random.randomFloorToInt(0, returnDeskIndexes.length)
                ];
              let poker = this.desk.get(fromDeskIndex).pop();
              this.addToDesk(poker, noneIndex, true);
              this.addToCache();
            } else if (returnRecycleIndexes.length > 0) {
              let fromRecycleIndex =
                returnRecycleIndexes[
                  Random.randomFloorToInt(0, returnRecycleIndexes.length)
                ];
              let poker = this.recycle.get(fromRecycleIndex).pop();
              this.addToDesk(poker, noneIndex, true);
              this.addToCache();
            } else {
              console.error("1.1.nothing to return .");
              loopCount = totalLoopCount;
            }
          } else {
            if (returnRecycleIndexes.length > 0) {
              let fromRecycleIndex =
                returnRecycleIndexes[
                  Random.randomFloorToInt(0, returnRecycleIndexes.length)
                ];
              let poker = this.recycle.get(fromRecycleIndex).pop();
              this.addToDesk(poker, noneIndex, true);
              this.addToCache();
            } else if (returnDeskIndexes.length > 0) {
              let fromDeskIndex =
                returnDeskIndexes[
                  Random.randomFloorToInt(0, returnDeskIndexes.length)
                ];
              let poker = this.desk.get(fromDeskIndex).pop();
              this.addToDesk(poker, noneIndex, true);
              this.addToCache();
            } else {
              console.error("1.2.nothing to return .");
              loopCount = totalLoopCount;
            }
          }
        }

        nonePokerDeskIndex = [];
        this.desk.forEach((deskIndex: number, pokers: PokerInfo[]) => {
          if (pokers.length <= 0) {
            nonePokerDeskIndex.push(deskIndex);
          }
        });
        disOrderArray(nonePokerDeskIndex);
      }

      /**
       *  end of 1
       */

      /** 2.给端头是背面的desk挪牌 */

      let coveredDeskIndex = [];
      this.desk.forEach((deskIndex: number, pokers: PokerInfo[]) => {
        if (pokers[pokers.length - 1].state == PokerState.Back) {
          coveredDeskIndex.push(deskIndex);
        }
      });
      disOrderArray(coveredDeskIndex);
      // !CELER_X && console.log("coveredDeskIndex:", coveredDeskIndex);
      let hasMoveK = false;
      while (coveredDeskIndex.length > 0 && loopCount < totalLoopCount) {
        if (hasMoveK) {
          for (let coverdIndex of coveredDeskIndex) {
            returnRecycleIndexes = [];
            this.recycle.forEach(
              (recycleIndex: number, pokers: PokerInfo[]) => {
                if (pokers.length > 0) {
                  returnRecycleIndexes.push(recycleIndex);
                }
              }
            );

            disOrderArray(returnRecycleIndexes);

            returnDeskIndexes = [];
            this.desk.forEach((deskIndex: number, pokers: PokerInfo[]) => {
              if (
                this.isDeskComplete(deskIndex) == false &&
                pokers.length > 1 &&
                pokers[pokers.length - 1].state == PokerState.Front &&
                pokers[pokers.length - 2].state == PokerState.Front &&
                this.checkCanBeNext(
                  pokers[pokers.length - 2],
                  pokers[pokers.length - 1]
                )
              ) {
                returnDeskIndexes.push(deskIndex);
              }
            });
            disOrderArray(returnDeskIndexes);

            if (Random.getRandom() > 0.5) {
              // from recycle
              if (returnRecycleIndexes.length > 0) {
                let fromRecycleIndex =
                  returnRecycleIndexes[
                    Random.randomFloorToInt(0, returnRecycleIndexes.length)
                  ];
                let poker = this.recycle.get(fromRecycleIndex).pop();
                this.addToDesk(poker, coverdIndex, true);
                this.addToCache();
              } else if (returnDeskIndexes.length > 0) {
                let fromDeskIndex =
                  returnDeskIndexes[
                    Random.randomFloorToInt(0, returnDeskIndexes.length)
                  ];

                let fromDesks = this.desk.get(fromDeskIndex);
                let indexRange = [];
                for (let i = -1; i < fromDesks.length - 1; i++) {
                  let poker = fromDesks[i + 1];
                  if (poker.state == PokerState.Front) {
                    if (this.checkCanBeNext(fromDesks[i], poker)) {
                      indexRange.push(poker.index);
                    }
                  }
                }
                disOrderArray(indexRange);
                let selectedIndex = indexRange.pop();

                for (let i = 0; i < fromDesks.length; i++) {
                  let poker = fromDesks[i];
                  if (
                    poker.state == PokerState.Front &&
                    poker.index >= selectedIndex
                  ) {
                    this.addToDesk(poker, coverdIndex, false);
                    fromDesks.splice(i, 1);
                    i--;
                  }
                }
                this.addToCache();
              } else {
                console.error(" 2.1.nothing to return.");
                loopCount = totalLoopCount;
                break;
              }
            } else {
              // from other desk
              if (returnDeskIndexes.length > 0) {
                let fromDeskIndex =
                  returnDeskIndexes[
                    Random.randomFloorToInt(0, returnDeskIndexes.length)
                  ];

                let fromDesks = this.desk.get(fromDeskIndex);
                let indexRange = [];
                for (let i = -1; i < fromDesks.length - 1; i++) {
                  let poker = fromDesks[i + 1];
                  if (poker.state == PokerState.Front) {
                    if (this.checkCanBeNext(fromDesks[i], poker)) {
                      indexRange.push(poker.index);
                    }
                  }
                }
                disOrderArray(indexRange);
                let selectedIndex = indexRange.pop();

                for (let i = 0; i < fromDesks.length; i++) {
                  let poker = fromDesks[i];
                  if (
                    poker.state == PokerState.Front &&
                    poker.index >= selectedIndex
                  ) {
                    this.addToDesk(poker, coverdIndex, false);
                    fromDesks.splice(i, 1);
                    i--;
                  }
                }
                this.addToCache();
              } else if (returnRecycleIndexes.length > 0) {
                let fromRecycleIndex =
                  returnRecycleIndexes[
                    Random.randomFloorToInt(0, returnRecycleIndexes.length)
                  ];
                let poker = this.recycle.get(fromRecycleIndex).pop();
                this.addToDesk(poker, coverdIndex, true);
                this.addToCache();
              } else {
                console.error(" 2.2.nothing to return.");
                loopCount = totalLoopCount;
              }
            }
          }
        } else {
          hasMoveK = true;
          let coverdIndex = coveredDeskIndex[0];

          let fromDeskIndex = -1;
          for (let deskIndex of returnDeskIndexes) {
            let fromDesks = this.desk.get(deskIndex);
            if (
              fromDesks[0].point == Poker.$_K &&
              fromDesks[0].state == PokerState.Front
            ) {
              fromDeskIndex = deskIndex;
            }
          }

          if (fromDeskIndex >= 0) {
            let fromDesks = this.desk.get(fromDeskIndex);
            for (let i = 0; i < fromDesks.length; i++) {
              let poker = fromDesks[i];
              this.addToDesk(poker, coverdIndex, false);
              fromDesks.splice(i, 1);
              i--;
            }
            this.addToCache();
          }
        }

        coveredDeskIndex = [];
        this.desk.forEach((deskIndex: number, pokers: PokerInfo[]) => {
          if (
            pokers.length > 0 &&
            pokers[pokers.length - 1].state == PokerState.Back
          ) {
            coveredDeskIndex.push(deskIndex);
          }
        });
        disOrderArray(coveredDeskIndex);
      }
      // !CELER_X &&
      //   console.log(
      //     "coveredDeskIndex:",
      //     coveredDeskIndex,
      //     returnDeskIndexes,
      //     returnRecycleIndexes
      //   );
      /** end of 2 */

      /** 3.随机一些牌回到ready */
      /** 洗牌区域的牌数最多24张 */
      let readyCount = this.ready.length + this.draw.length;
      if (this.ready.length + this.draw.length < 24) {
        let returnReadyCount = Random.randomFloorToInt(1, 5);
        returnReadyCount = Math.min(24 - readyCount, returnReadyCount);
        // !CELER_X && console.log("returnReadyCount:", returnReadyCount);
        let hasReturnDesk = false;
        while (
          returnReadyCount-- > 0 &&
          this.ready.length + this.draw.length < 24
        ) {
          returnRecycleIndexes = [];
          this.recycle.forEach((recycleIndex: number, pokers: PokerInfo[]) => {
            if (pokers.length > 0) {
              returnRecycleIndexes.push(recycleIndex);
            }
          });

          disOrderArray(returnRecycleIndexes);

          returnDeskIndexes = [];
          this.desk.forEach((deskIndex: number, pokers: PokerInfo[]) => {
            if (
              this.isDeskComplete(deskIndex) == false &&
              pokers.length > 1 &&
              pokers[pokers.length - 1].state == PokerState.Front &&
              pokers[pokers.length - 2].state == PokerState.Front &&
              this.checkCanBeNext(
                pokers[pokers.length - 2],
                pokers[pokers.length - 1]
              )
            ) {
              returnDeskIndexes.push(deskIndex);
            }
          });
          disOrderArray(returnDeskIndexes);

          let isOnlyK = false;
          let kIndex = [];
          this.desk.forEach((deskIndex: number, pokers: PokerInfo[]) => {
            if (pokers.length > 0) {
              if (pokers.length <= 3 && pokers[0].state == PokerState.Front) {
                if (pokers.length <= 1) {
                  if (pokers[0].point == Poker.$_K) {
                    isOnlyK = true;
                    kIndex.push(deskIndex);
                  }
                } else {
                  let isSorted = true;
                  for (let i = 1; i < pokers.length; i++) {
                    let poker = pokers[i - 1];
                    let pokerNext = pokers[i];
                    if (this.checkCanBeNext(poker, pokerNext) == false) {
                      isSorted = false;
                    }
                  }
                  if (isSorted) {
                    isOnlyK = true;
                    kIndex.push(deskIndex);
                  }
                }
              } else if (this.isDeskComplete(deskIndex) == false) {
                let frontCount = 0;
                for (let poker of pokers) {
                  if (poker.state == PokerState.Front) frontCount++;
                }

                if (
                  frontCount == 2 &&
                  this.checkCanBeNext(
                    pokers[pokers.length - 2],
                    pokers[pokers.length - 1]
                  )
                ) {
                  isOnlyK = true;
                  kIndex.push(deskIndex);
                }
              }
            }
          });

          if (isOnlyK && kIndex.length > 0) {
            returnDeskIndexes = kIndex;
            disOrderArray(returnDeskIndexes);
          }

          if (
            Random.getRandom() > 0.5 &&
            isOnlyK == false &&
            hasReturnDesk == true
          ) {
            // from recycle
            if (returnRecycleIndexes.length > 0) {
              let fromRecycleIndex =
                returnRecycleIndexes[
                  Random.randomFloorToInt(0, returnRecycleIndexes.length)
                ];
              let poker = this.recycle.get(fromRecycleIndex).pop();
              this.addToReady(poker);
            } else if (returnDeskIndexes.length > 0) {
              let fromDeskIndex =
                returnDeskIndexes[
                  Random.randomFloorToInt(0, returnDeskIndexes.length)
                ];
              let poker = this.desk.get(fromDeskIndex).pop();
              this.addToReady(poker);
            } else {
              console.error(" 3.1.nothing to return.");
              loopCount = totalLoopCount;
            }
          } else {
            hasReturnDesk = true;
            if (returnDeskIndexes.length > 0) {
              if (isOnlyK) {
                while (returnDeskIndexes.length > 0) {
                  let fromDesks = this.desk.get(returnDeskIndexes.pop());
                  if (fromDesks.length <= 1) {
                    let poker = fromDesks.pop();
                    this.addToReady(poker);
                  } else if (fromDesks.length <= 2) {
                  } else {
                    while (
                      fromDesks.length > 0 &&
                      this.ready.length + this.draw.length < 24
                    ) {
                      let poker = fromDesks.pop();
                      this.addToReady(poker);
                      if (
                        this.checkCanBeNext(
                          fromDesks[fromDesks.length - 1],
                          poker
                        ) == false ||
                        (fromDesks[fromDesks.length - 2] &&
                          fromDesks[fromDesks.length - 2].state ==
                            PokerState.Back)
                      ) {
                        break;
                      }
                    }
                  }
                }
              } else {
                let fromDeskIndex =
                  returnDeskIndexes[
                    Random.randomFloorToInt(0, returnDeskIndexes.length)
                  ];
                let poker = this.desk.get(fromDeskIndex).pop();
                this.addToReady(poker);
              }
            } else if (returnRecycleIndexes.length > 0) {
              let fromRecycleIndex =
                returnRecycleIndexes[
                  Random.randomFloorToInt(0, returnRecycleIndexes.length)
                ];
              let poker = this.recycle.get(fromRecycleIndex).pop();
              this.addToReady(poker);
            } else {
              console.error(" 3.2.nothing to return.");
              loopCount = totalLoopCount;
            }
          }
        }
      } else {
        console.log(" draw area is done.");
      }
      /**  end of 3*/

      /** 4.如果有未完成的端头只有一张正面，则翻面 */
      this.desk.forEach((deskIndex: number, pokers: PokerInfo[]) => {
        if (this.isDeskComplete(deskIndex) == false) {
          let frontCount = 0;
          let backCount = 0;
          for (let poker of pokers) {
            if (poker.state == PokerState.Front) {
              frontCount++;
            } else {
              backCount++;
            }
          }
          if (
            frontCount == 1 &&
            backCount > 0 &&
            pokers[pokers.length - 1].state == PokerState.Front
          ) {
            pokers[pokers.length - 1].state = PokerState.Back;
          }
        }
      });

      /** end of 4 */
    }

    if (loopCount >= totalLoopCount) {
      console.error(" loop over ", totalLoopCount);
      return false;
    }
    return true;
  }

  isDeskComplete(deskIndex: number) {
    let checkDesk = this.desk.get(deskIndex);
    if (deskIndex == 0 && checkDesk.length == 1) {
      return true;
    }

    if (checkDesk.length > deskIndex + 1) return false;

    let coverdCount = 0;
    for (let poker of checkDesk) {
      if (poker.state == PokerState.Back) {
        coverdCount++;
      }
    }

    return coverdCount == deskIndex;
  }

  isReturnComplete() {
    let isComplete = true;
    this.recycle.forEach((recycleIndex: number, pokers: PokerInfo[]) => {
      if (pokers.length > 0) {
        isComplete = false;
      }
    });

    this.desk.forEach((deskIndex: number, pokers: PokerInfo[]) => {
      if (deskIndex == 0) {
        if (pokers.length > 1) isComplete = false;
      } else {
        if (pokers.length < deskIndex + 1) {
          isComplete = false;
        } else {
          let backCount = 0;
          for (let poker of pokers) {
            if (poker.state == PokerState.Back) {
              backCount++;
            }
          }
          if (backCount < deskIndex) isComplete = false;
        }
      }
    });

    if (this.ready.length + this.draw.length < 24) {
      isComplete = false;
    }
    return isComplete;
  }

  returnToRecycle() {
    while (
      this.recycle.get(0)[this.recycle.get(0).length - 1] == null ||
      this.recycle.get(0)[this.recycle.get(0).length - 1].point < Poker.$_7
    ) {
      this.desk.forEach((deskIndex: number, pokers: PokerInfo[]) => {
        if (pokers.length > 0) {
          if (this.checkRecycle(pokers[pokers.length - 1])) {
            pokers.pop();
          } else {
          }
        }
      });
    }
    this.addToCache();
  }

  checkRecycle(poker: PokerInfo): boolean {
    if (
      poker.state == PokerState.Back ||
      RecycleParents.indexOf(poker.parent) >= 0
    ) {
      return false;
    }

    let hasRecycle = false;
    this.recycle.forEach((recycleIndex: number, pokers: PokerInfo[]) => {
      if (hasRecycle == false) {
        if (this.checkCanBeRecycle(pokers[pokers.length - 1], poker)) {
          pokers.push(poker);
          hasRecycle = true;
          poker.index = pokers.length - 1;
          poker.parent = RecycleParents[recycleIndex];
          poker.state = PokerState.Front;
        }
      }
    });

    return hasRecycle;
  }

  addToReady(pokerModel: PokerInfo) {
    this.ready.push(pokerModel);
    pokerModel.index = this.ready.length - 1;
    pokerModel.state = PokerState.Front;
    pokerModel.parent = PokerParent.Ready;
    this.addToCache();

    if (this.draw.length + this.ready.length >= 24) {
      while (this.ready.length > 0) {
        this.returnToDraw();
        this.addToCache();
      }
    } else {
      if (this.ready.length % 3 == 0 && Random.getRandom() > 0.5) {
        let times = Random.randomFloorToInt(1, 4);
        while (times-- > 0 && this.ready.length > 0) {
          this.returnToDraw();
          this.addToCache();
        }
      }
    }
  }

  returnToDraw() {
    let count = 3;
    while (count-- > 0 && this.ready.length > 0) {
      let poker = this.ready.pop();
      this.draw.push(poker);
      poker.index = this.draw.length - 1;
      poker.state = PokerState.Back;
      poker.parent = PokerParent.Draw;
    }
  }

  addToDesk(
    poker: PokerInfo,
    toDeskIndex: number,
    isUpdateState: boolean = false
  ) {
    if (this.desk.get(toDeskIndex) == null) {
      this.desk.add(toDeskIndex, []);
    }

    let toDesk = this.desk.get(toDeskIndex);
    poker.index = toDesk.length;
    toDesk.push(poker);
    poker.parent = DeskParents[toDeskIndex];

    if (isUpdateState) {
      for (let poker of toDesk) {
        if (poker.index >= toDeskIndex) {
          poker.state = PokerState.Front;
        } else {
          poker.state = PokerState.Back;
        }
      }
    }
  }

  /** 获取当前desk背面牌数，最多不能超过21个 */
  getDeskBackCount() {
    let count = 0;
    this.desk.forEach((deskIndex: number, pokers: PokerInfo[]) => {
      for (let poker of pokers) {
        if (poker.state == PokerState.Back) {
          count++;
        }
      }
    });

    return count;
  }

  addToCache() {
    let draw: PokerInfo[] = [];
    for (let poker of this.draw) {
      draw.push({
        parent: poker.parent,
        point: poker.point,
        state: poker.state,
        ID: poker.ID,
        index: poker.index,
        type: poker.type,
      });
    }

    let ready: PokerInfo[] = [];
    for (let poker of this.ready) {
      ready.push({
        parent: poker.parent,
        point: poker.point,
        state: poker.state,
        ID: poker.ID,
        index: poker.index,
        type: poker.type,
      });
    }

    let recycle = new HashMap<number, PokerInfo[]>();
    this.recycle.forEach((index: number, pokers: PokerInfo[]) => {
      recycle.add(index, []);
      for (let poker of pokers) {
        recycle.get(index).push({
          parent: poker.parent,
          point: poker.point,
          state: poker.state,
          ID: poker.ID,
          index: poker.index,
          type: poker.type,
        });
      }
    });

    let desk = new HashMap<number, PokerInfo[]>();
    this.desk.forEach((index: number, pokers: PokerInfo[]) => {
      desk.add(index, []);
      for (let poker of pokers) {
        desk.get(index).push({
          parent: poker.parent,
          point: poker.point,
          state: poker.state,
          ID: poker.ID,
          index: poker.index,
          type: poker.type,
        });
      }
    });

    this.stepCache.add(this.totalStepCount, {
      draw: draw,
      ready: ready,
      recycle: recycle,
      desk: desk,
    });

    this.totalStepCount++;
    this.currentStep++;
  }

  getCache(step: number) {
    if (step > this.totalStepCount) {
      console.error(" step over total size.");
      return null;
    }

    return this.stepCache.get(step);
  }

  get TotalStep() {
    return this.totalStepCount;
  }

  get CurrentStep() {
    return this.currentStep;
  }

  getCurrentCache() {
    if (this.stepCache.has(this.currentStep - 1) == false) return;
    this.currentStep--;
    return this.stepCache.get(this.currentStep);
  }

  getLastCache() {
    if (this.stepCache.has(this.currentStep + 1) == false) return;
    this.currentStep++;
    return this.stepCache.get(this.currentStep);
  }

  getRandomCache() {
    let random = Random.getRandom(0.45, 0.7);
    let step = Math.floor(random * this.TotalStep);
    let count = 0;
    while (count++ < 100 && this.stepCache.has(step) == false) {
      random = Random.getRandom(0.45, 0.7);
      step = Math.floor(random * this.TotalStep);
    }
    if (count >= 100) {
      step = this.currentStep - 1;
    }
    this.currentStep = step;
    return this.stepCache.get(this.currentStep);
  }
}
