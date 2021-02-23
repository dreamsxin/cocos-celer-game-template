import { Theme } from "../../Global/Theme";
import {
  FreePauseLimit,
  PauseScoreCost,
  GetGameTime,
} from "../../Global/GameRule";
import {
  GameThemeInit,
  PlayerScoreChanged,
  NoviceScoreChanged,
  GameOverSignal,
} from "../../Command/CommonSignal";
import { Random } from "../../Utils/Random";
import { BaseSignal } from "../../Utils/Signal";
import { RevertSignal } from "../View/UI/RevertButtonView";
import { MoveCountChangedSignal } from "../View/UI/MoveCountLabelView";
import {
  GameStateController,
  RoundEndType,
} from "../../Controller/GameStateController";
import { EndNowSignal } from "../View/UI/SubmitLayerView";
import { GameLogic, NextRoundSignal } from "./GameLogic";
import {
  checkIsNotZeroScore,
  getType,
  GuidePokers,
  Pokers,
} from "./Poker/PokerUtil";
import { HashMap } from "../../Utils/HashMap";
import { Poker, PokerModel, PokerRemovedSignal } from "./Poker/PokerModel";
import { PokerParent } from "./Poker/PokerParentModel";
import { CelerSDK } from "../../Utils/Celer/CelerSDK";
import { TimeInitSignal } from "../View/UI/TimeLabelView";
import { PlayModelProxy } from "../../Model/PlayModelProxy";
import { SolutionChecker } from "./SolutionChecker";
export enum ScoreType {
  DrawCost,
  TimeBonus,
  Normal,
}

export enum GameType {
  Tune_11,
  Tune_10,
  Tune_12,
}

export class GameTypeInitSignal extends BaseSignal {}

export const TuneIndexPool = {
  [GameType.Tune_10]: [2, 3, 5, 6, 7, 8, 9, 10, 11, 12],
  [GameType.Tune_11]: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  [GameType.Tune_12]: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
};

export class RevertButtonStateChangedSignal extends BaseSignal {}

export class PLayerScoreInitSignal extends BaseSignal {}

export class BeforeGenLevelSignal extends BaseSignal {}

export class AfterGenLevelSignal extends BaseSignal {}

const MatchArea = 12882 * 0.4;

export class GamePlayModel {
  constructor() {
    this.init();
  }

  private theme: Theme;
  private level: number = 0;
  private playerScore: number = 0;
  private noviceScore: number = 0;
  private gameTime: number = 0;
  private totalGameTime: number = 0;
  private pauseCount: number = 0;
  private pauseScore: number = 0;
  private streak: number = 0;
  private totalStreak: number = 0;
  private maxSteak: number = 0;
  private moveCount: number = 0;
  public scoreMap = {};
  private playerScoreMap = {};
  private gameLogic: GameLogic = new GameLogic(this);
  private pokers: HashMap<string, PokerModel> = new HashMap();
  private init() {
    RevertSignal.inst.addListener(this.revertAction, this);
    EndNowSignal.inst.addListener(this.onEndNow, this);
    GameOverSignal.inst.addListener(() => {
      this.Logic.recordFlipCount();
    }, this);
    NextRoundSignal.inst.addListener(() => {
      this.nextRound();
    }, this);
  }

  get Logic() {
    return this.gameLogic;
  }

  resetPlayerData() {
    this.level = 0;
    this.playerScore = 0;
    PLayerScoreInitSignal.inst.dispatchOne(this.playerScore);
    this.noviceScore = 0;
    this.gameTime = GetGameTime(CelerSDK.inst.DifficultyLevel);
    TimeInitSignal.inst.dispatchOne(this.gameTime);
    this.totalGameTime = this.gameTime;
    this.pauseCount = 0;
    this.pauseScore = 0;
    this.streak = 0;
    this.totalStreak = 0;
    this.maxSteak = 0;
    this.moveCount = 0;
    this.scoreMap = {};
    this.playerScoreMap = {};
    this.clearPoker();
  }

  clearPoker() {
    this.gameLogic.FreeDrawCount = 3;
    this.gameLogic.clear();
    this.removeAllPoker();
  }

  getPoker(ID: string) {
    return this.pokers.get(ID);
  }

  removeAllPoker() {
    this.pokers.forEach((ID: string, model: PokerModel) => {
      model.removeSelf();
    });
    this.pokers.clear();
  }

  get Time() {
    return this.gameTime;
  }

  set Time(val: number) {
    this.gameTime = val;
    this.gameTime = Math.max(0, this.gameTime);
  }

  get Theme() {
    return this.theme;
  }

  set Theme(val: Theme) {
    console.log("set game theme:", Theme[val]);
    this.theme = val;
    GameThemeInit.inst.dispatchOne(this.theme);
  }

  get Level() {
    return this.level;
  }

  set Level(val: number) {
    console.log("set difficult Level:", val);
    this.level = val;
  }

  get TotalScore() {
    return Math.max(
      this.Timebonus + this.ScoreSpread + this.playerScore - this.moveCount,
      0
    );
  }

  checkIsShowFront(pokerModel: PokerModel): boolean {
    return this.Logic.checkIsShowFront(pokerModel);
  }

  get Timebonus() {
    if (
      this.gameTime >= this.totalGameTime ||
      this.gameTime <= 0 ||
      this.Logic.TotalHasFlipCount <= 0
    )
      return 0;

    console.log(
      "total Level:",
      this.Logic.Level,
      "Last Level:",
      this.Logic.FlipCount,
      ", Total :",
      this.Logic.TotalHasFlipCount,
      ", time:",
      this.gameTime
    );
    return Math.floor(
      ((this.Logic.TotalHasFlipCount / 45) * (1.2 / 0.5) + 0.3) * this.gameTime
    );
  }

  get ScoreSpread() {
    return 0;
  }

  get PlayerScore() {
    return this.playerScore;
  }

  get MoveCount() {
    return this.moveCount;
  }

  set MoveCount(val: number) {
    this.moveCount = val;
    MoveCountChangedSignal.inst.dispatchOne(this.moveCount);
  }

  get PauseScore() {
    return this.pauseScore;
  }

  get NoviceScore() {
    return this.noviceScore;
  }

  get TotalCombo() {
    return this.totalStreak;
  }

  get PauseCount() {
    return this.pauseCount;
  }

  onEndNow() {
    this.checkCompleteScore();
    GameStateController.inst.roundEnd(RoundEndType.Over);
  }

  revertAction() {}

  checkCompleteScore() {}

  /**  初始化游戏主题 */
  initGametheme() {}

  nextRound() {
    BeforeGenLevelSignal.inst.dispatch();
    this.gameLogic.Level++;
    this.clearPoker();
    GameStateController.inst.isReady = false;
    GameStateController.inst.setRoundStart(false);
    SolutionChecker.inst.startGeneratePokers();

    this.gameLogic.startByCheckerInfo(() => {
      setTimeout(() => {
        this.gameLogic.gameReady();
        AfterGenLevelSignal.inst.dispatch();
      }, 100);
    });
  }

  lastStep() {
    BeforeGenLevelSignal.inst.dispatch();
    this.clearPoker();
    GameStateController.inst.isReady = false;
    GameStateController.inst.setRoundStart(false);

    this.gameLogic.startByCheckerInfo(() => {
      setTimeout(() => {
        this.gameLogic.gameReady();
        AfterGenLevelSignal.inst.dispatch();
      }, 100);
    });
  }

  initGameData() {
    console.log("init game data.");
    this.resetPlayerData();

    if (CelerSDK.inst.DifficultyLevel == 3) {
      // 残局版
      this.nextRound();
    } else {
      let pokers = [];

      if (CelerSDK.inst.DifficultyLevel == 1) {
        pokers = Pokers.concat([]).reverse();
        let pokersTemp = pokers.concat([]);

        let pokersCheck: string[] = [];

        let randomIndexes: number[] = [];

        while (pokersTemp.length > 0) {
          let totalWeight = pokersTemp.length;
          let random = Random.getRandom(0, 1);
          let randomIndex = Math.floor(random * totalWeight);
          randomIndexes.push(randomIndex);
          pokersCheck.push(pokersTemp.splice(randomIndex, 1)[0]);
        }

        let checkCount = 0;
        while (
          checkCount++ <= 499 &&
          checkIsNotZeroScore(pokersCheck) == false
        ) {
          //break;
          pokersCheck.length = 0;
          pokersTemp.length = 0;
          pokersTemp = Pokers.concat([]);
          randomIndexes.length = 0;
          while (pokersTemp.length > 0) {
            let totalWeight = pokersTemp.length;
            let random = Random.getRandom(0, 1);
            let randomIndex = Math.floor(random * totalWeight);
            randomIndexes.push(randomIndex);
            let pokerInfo = pokersTemp.splice(randomIndex, 1)[0];
            pokersCheck.push(pokerInfo);
          }
        }
        console.log(
          " 是否是非0分局：",
          checkIsNotZeroScore(pokersCheck),
          ",checkCount:",
          checkCount,
          pokersCheck
        );

        while (pokers.length > 0) {
          let i = pokers.splice(randomIndexes.shift(), 1)[0];
          let point = parseInt(i.split(",")[1]);
          let type = getType(i.split(",")[0]);
          let model = new PokerModel(point, type, PokerParent.Draw);
          this.pokers.add(model.ID, model);
          this.gameLogic.addToDraw(model);
        }
      } else {
        SolutionChecker.inst.startGeneratePokers();
        pokers = SolutionChecker.inst.SolutionPokers;

        while (pokers.length > 0) {
          let i = pokers.pop();
          let point = parseInt(i.split(",")[1]);
          let type = getType(i.split(",")[0]);
          let model = new PokerModel(point, type, PokerParent.Draw);
          SolutionChecker.inst.bindPokerID(model);
          this.pokers.add(model.ID, model);
          this.gameLogic.addToDraw(model);
        }
      }

      GameStateController.inst.isReady = false;
      this.startDevPoker();
    }
  }

  addToPokers(ID: string, model: PokerModel) {
    this.pokers.add(ID, model);
  }

  startDevPoker() {
    let count = 0;

    let deskIndex = 0;
    let j = 0;
    let i = 0;
    while (count++ < 38) {
      setTimeout(
        (pokerCount: number) => {
          this.gameLogic.drawToDesk(deskIndex, pokerCount >= 31);
          deskIndex++;

          if (i >= 4) {
            if (deskIndex > 5) {
              i++;
              deskIndex = 0;
            }
          } else {
            if (deskIndex > 7) {
              i++;
              deskIndex = 0;
            }
          }

          if (pokerCount >= 38) {
            // 开始发下面的牌
            this.devPokerToReady();
          }
        },
        (count - 1) * 30,
        count
      );
    }
  }

  devPokerToReady() {
    this.gameLogic.devPokerToReady();
  }

  initGameTutorial() {
    console.log("init game tutorial.");
    this.resetPlayerData();
    let pokers = GuidePokers.reverse().concat([]);
    let pokersTemp = pokers.concat([]);

    let pokersCheck: string[] = [];

    let randomIndexes: number[] = [];

    while (pokersTemp.length > 0) {
      let randomIndex = pokersTemp.length - 1;

      randomIndexes.push(randomIndex);
      pokersCheck.push(pokersTemp.splice(randomIndex, 1)[0]);
    }

    while (pokers.length > 0) {
      let i = pokers.splice(randomIndexes.shift(), 1)[0];
      let point = parseInt(i.split(",")[1]);
      let type = getType(i.split(",")[0]);
      let model = new PokerModel(point, type, PokerParent.Draw);
      this.pokers.add(model.ID, model);
      this.gameLogic.addToDraw(model);
    }

    GameStateController.inst.isReady = false;
    this.startDevPokerTutorial();
  }

  startDevPokerTutorial() {
    let count = 0;

    let deskIndex = 0;
    let j = 0;
    while (count++ < 28) {
      setTimeout(() => {
        this.gameLogic.drawToDesk(deskIndex);
        deskIndex++;

        if (deskIndex > 6) {
          j++;
          deskIndex = j;
        }
      }, count * 50);
    }
  }

  addPlayerScore(
    score: number,
    type: ScoreType,
    times: number = 1,
    fromNode: cc.Node = null,
    delay: number = 0
  ): number {
    if (score == 0) return;
    if (this.playerScoreMap[type] == null) this.playerScoreMap[type] = 0;

    this.playerScoreMap[type] += score;
    let oldScore = this.playerScore;

    this.playerScore += score;
    if (score > 0) {
    } else {
      this.resetCombo();
    }

    this.playerScore = Math.max(this.playerScore, 0);

    setTimeout(() => {
      PlayerScoreChanged.inst.dispatchFour(
        this.playerScore,
        score,
        times,
        fromNode
      );
    }, delay);

    return this.playerScore - oldScore;
  }

  addNoviceScore(score: number, times: number = 1) {
    this.noviceScore += score;
    this.noviceScore = Math.max(this.noviceScore, 0);

    NoviceScoreChanged.inst.dispatchThree(this.noviceScore, score, times);
  }

  getScoreByType(type: ScoreType) {
    if (typeof this.playerScoreMap[type] != "number") return 0;
    return this.playerScoreMap[type];
  }

  addPauseCount() {
    if (PlayModelProxy.inst.isOnTutorial) return;

    this.pauseCount++;
    console.log("add pause count:", this.pauseCount);
    if (this.pauseCount > FreePauseLimit) {
      this.addPlayerScore(-PauseScoreCost, ScoreType.Normal);
    }
  }

  resetCombo() {
    this.streak = 0;
  }

  addStreak() {
    this.streak++;
    this.totalStreak++;
    this.maxSteak = Math.max(this.maxSteak, this.streak);
  }

  dump() {}
}
