import { SingleTon } from "../ToSingleton";
import { LogHandler } from "../LogHandler";
import { Random } from "../Random";
import { ShowPauseLayerSignal } from "../../Command/CommonSignal";
import { PlayModelProxy } from "../../Model/PlayModelProxy";
import { GameStateController } from "../../Controller/GameStateController";
import { HideWildAdButtonSignal } from "../../Ad/WildAdButton";
import { RemoveFlyCnicornSignal } from "../../Ad/FlyCnicornAd";
import { GetTotalTime } from "../../Global/GameRule";
import { TableManager } from "../../TableManager";
import { En_US } from "../../table";

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
        return PlayModelProxy.inst.getTotalScore();
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

    this.match.locale = this.match.locale || "en_US";

    if (this.match.difficultyLevel == 0) {
      this.match.difficultyLevel = 1;
    }

    /** 多语言 */
    this.defineLan();

    Random.setRandomSeed(this.match.sharedRandomSeed);

    PlayModelProxy.inst.setTotalTime(GetTotalTime());

    if (this.match && this.match.shouldLaunchTutorial) {
      this.isNewPlayer = true;
    } else {
      this.isNewPlayer = false;
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
      cc.game.on(cc.game.EVENT_HIDE, () => {
        console.log(" on pause ");
        if (
          GameStateController.inst.isGameOver() ||
          GameStateController.inst.isPause()
        )
          return;
        ShowPauseLayerSignal.inst.dispatch();
      });

      cc.game.on(cc.game.EVENT_SHOW, () => {
        console.log(" on resume ");
        // HidePauseLayerSignal.inst.dispatch();
      });
    }

    if (this.celerStartCallback) {
      this.celerStartCallback();
      this.celerStartCallback = null;
    }
  }

  private defineLan() {
    lan.set(this.match.locale);
    let textMap: { [key: number]: { [key: number]: string } } = {};
    let textData: { [key: number]: En_US } = null;
    switch (this.match.locale) {
      case "en_US":
        textData = TableManager.inst.getAll_En_US_Data();
        break;

      default:
        break;
    }

    if (textData) {
      for (let key in textData) {
        let data = textData[key];
        if (!textMap[data.View]) {
          textMap[data.View] = {};
        }
        textMap[data.View][data.ID] = data.Text;
      }
      lan.define(this.match.locale, textMap);
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
    return (
      cc.sys.isMobile && cc.sys.isBrowser && cc.sys.os == cc.sys.OS_ANDROID
    );
  }

  public get isIOSWeb() {
    return cc.sys.isMobile && cc.sys.isBrowser && cc.sys.os == cc.sys.OS_IOS;
  }
}

CC_DEBUG && (window["SDK"] = CelerSDK.inst);
