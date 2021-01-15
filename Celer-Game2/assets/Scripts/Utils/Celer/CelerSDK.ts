import { SingleTon } from "../ToSingleton";
import { LogHandler } from "../LogHandler";
import { Random } from "../Random";
import { ShowPauseLayerSignal } from "../../Command/CommonSignal";
import { PlayModelProxy } from "../../Model/PlayModelProxy";
import { GameStateController } from "../../Controller/GameStateController";

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
      console.log("v 1.4");
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
          shouldLaunchTutorial: true,
          sharedRandomSeed: Math.random(), //*/0.24907066062871674,//Math.random(),
          difficultyLevel: 0,
        };

    console.log(
      "match id:",
      this.match.matchId,
      ", seed:",
      this.match.sharedRandomSeed
    );

    Random.setRandomSeed(this.match.sharedRandomSeed);
    PlayModelProxy.inst.Level = this.match.difficultyLevel;

    if (this.match && this.match.shouldLaunchTutorial) {
      this.isNewPlayer = true;
    } else {
      this.isNewPlayer = false;
    }

    if (CELER_X) {
      celerSDK.onPause(() => {
        console.log(" on pause ");
        if (GameStateController.inst.isGameOver()) return;
        ShowPauseLayerSignal.inst.dispatch();
      });

      celerSDK.onResume(() => {
        console.log(" on resume ");
        // HidePauseLayerSignal.inst.dispatch();
      });
    } else {
      cc.game.on(cc.game.EVENT_HIDE, () => {
        console.log(" on pause ");
        if (GameStateController.inst.isGameOver()) return;
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

  submitScore(score: number) {
    if (this.alreadySubmit) return;
    this.alreadySubmit = true;
    console.log(
      " submit score:",
      score,
      ", match id:",
      this.match.matchId,
      ", seed:",
      this.match.sharedRandomSeed
    );
    if (CELER_X) {
      celerSDK.submitScore(score);
    } else {
      window.location.reload();
    }
  }
}
