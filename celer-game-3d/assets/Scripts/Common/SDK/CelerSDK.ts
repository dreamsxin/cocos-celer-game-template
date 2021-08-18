import { Game, game, sys } from "cc";
import { GetTotalTime } from "../../GamePlay/GameRule";
import { GameStateController } from "../../Manager/GameStateController";

import { PlayModel } from "../../Model/PlayModel";
import {
  HideWildAdButtonSignal,
  RemoveFlyCnicornSignal,
  ShowPauseLayerSignal,
} from "../../Signal/Signal";
import { En } from "../../table";
import { TableManager } from "../../TableManager";
import { Random } from "../Random";
import { SingleTon } from "../ToSingleTon";
import { LogHandler } from "./LogHandler";

export class CelerSDK extends SingleTon<CelerSDK>() {
  private alreadySubmit: boolean = false;

  private isNewPlayer: boolean = true;

  private celerStartCallback: Function = null;

  private match: MatchInfo;

  /** 匹配ID */
  get MatchID() {
    return this.match.matchId;
  }

  /** 随机种子 */
  get MatchRandomSeed() {
    return this.match.sharedRandomSeed;
  }

  /** 难度等级 */
  get DifficultyLevel() {
    return this.match.difficultyLevel;
  }

  init(callback: Function) {
    this.alreadySubmit = false;

    CELER_X && celerSDK.onStart(this.onCelerStart.bind(this));

    CELER_X &&
      celerSDK.provideScore(() => {
        return PlayModel.inst.getTotalScore();
      });

    this.celerStartCallback = callback;

    LogHandler.inst.ready();
    if (CELER_X) {
      LogHandler.inst.initLog(celerSDK.log);
    } else {
      // console.error = (...args) => {
      //   let str = "";
      //   for (let msg of args) {
      //     str += JSON.stringify(msg);
      //   }
      //   throw new Error(str);
      // };
    }
  }

  celerXReady() {
    console.log(" invoke celerx.ready() ");

    if (!CELER_X) {
      this.onCelerStart();
    } else {
      celerSDK.ready();
    }
  }

  isNew() {
    return this.isNewPlayer;
  }

  isOnCelerPlatform() {
    return CELER_X;
  }

  onCelerStart() {
    console.log(" celerx onStart call");
    this.match = CELER_X
      ? celerSDK.getMatch()
      : {
          matchId: "error : can not get id",
          shouldLaunchTutorial: false,
          sharedRandomSeed: Math.random(), //*/0.24907066062871674,//Math.random(),0.9483376662548313, //
          difficultyLevel: 1,
          locale: "en_US",
        };

    console.log(
      "match id:",
      this.match.matchId,
      ", seed:",
      this.match.sharedRandomSeed
    );

    if (this.match.difficultyLevel == 0) {
      this.match.difficultyLevel = 1;
    }

    Random.setRandomSeed(this.match.sharedRandomSeed);

    PlayModel.inst.setTotalTime(GetTotalTime());

    if (this.match && this.match.shouldLaunchTutorial) {
      this.isNewPlayer = true;
    } else {
      this.isNewPlayer = false;
    }

    // 暂不支持广告
    HideWildAdButtonSignal.inst.dispatch();
    RemoveFlyCnicornSignal.inst.dispatch();

    if (this.celerStartCallback) {
      this.celerStartCallback();
      this.celerStartCallback = null;
    }
  }

  public defineLan() {
    this.match.locale = this.match.locale || "en_US";

    if (CC_DEBUG) {
      this.match.locale = "ef_US";
    }

    lan.set(this.match.locale);
    let textMap: {
      [key: number]: {
        [key: number]: string;
      };
    } = {};

    let styleMap: {
      [key: number]: {
        [key: number]: RichTextStyle;
      };
    } = {};

    let textData: { [key: number]: En } = null;

    textData = TableManager.inst.getAll_En_Data();
    let locale =
      this.match.locale.split("_")[0].charAt(0).toUpperCase() +
      this.match.locale.split("_")[0].substring(1);

    if (
      TableManager.inst["getAll_" + locale + "_Data"] &&
      TableManager.inst["getAll_" + locale + "_Data"]()
    ) {
      textData = TableManager.inst["getAll_" + locale + "_Data"]();
    }

    if (textData) {
      for (let key in textData) {
        let data = textData[key];
        if (!textMap[data.View]) {
          textMap[data.View] = {};
        }
        textMap[data.View][data.ID] = data.Text;

        if (!styleMap[data.View]) {
          styleMap[data.View] = {};
        }
        styleMap[data.View][data.ID] = {
          FontSize: data.FontSize,
          MaxWidth: data.MaxWidth,
          HorizontalAlign: data.Horizontal,
          VerticalAlign: data.Vertical,
          LineHeight: data.LineHeight,
          x: data.X,
          y: data.Y,
        };
      }
      lan.define(this.match.locale, textMap);
      /** define style */
      lan.defineStyle(this.match.locale, styleMap);
    }

    if (CELER_X) {
      if (celerSDK.hasMethod("showAd") != true || this.isNewPlayer) {
        HideWildAdButtonSignal.inst.dispatch();
        RemoveFlyCnicornSignal.inst.dispatch();
      }

      celerSDK.onPause(() => {
        console.log(" on pause ");
        if (
          GameStateController.inst.isGameOver() ||
          GameStateController.inst.isPause()
        )
          return;
        ShowPauseLayerSignal.inst.dispatch();
      });

      celerSDK.onResume(() => {
        console.log(" on resume ");
        // HidePauseLayerSignal.inst.dispatch();
      });
    } else {
      game.on(Game.EVENT_HIDE, () => {
        console.log(" on pause ");
        if (
          GameStateController.inst.isGameOver() ||
          GameStateController.inst.isPause()
        )
          return;
        ShowPauseLayerSignal.inst.dispatch();
      });

      game.on(Game.EVENT_SHOW, () => {
        console.log(" on resume ");
        // HidePauseLayerSignal.inst.dispatch();
      });
    }
  }

  submitScore(score: number) {
    if (this.alreadySubmit) return;
    this.alreadySubmit = true;
    console.log(" submit score:", score, ", match id:", this.match);
    if (CELER_X) {
      celerSDK.submitScore(score);
    } else {
      window.location.reload();
    }
  }

  public get isAndroidWeb() {
    return sys.isMobile && sys.isBrowser && sys.os == sys.OS_ANDROID;
  }

  public get isIOSWeb() {
    return sys.isMobile && sys.isBrowser && sys.os == sys.OS_IOS;
  }
}

CC_DEBUG && (window["SDK"] = CelerSDK.inst);
