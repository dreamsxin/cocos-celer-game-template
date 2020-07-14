import { SingleTon } from "../ToSingleton";
import { LogHandler } from "../LogHandler";





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

  init(callback: Function) {
    this.alreadySubmit = false;

    celerSDK && celerSDK.onStart(this.onCelerStart.bind(this));

    celerSDK && celerSDK.provideScore(() => {
      return 0;
    });

    this.celerStartCallback = callback;

    if (celerSDK) {
      LogHandler.inst.initLog(celerSDK.log);
    }

  }

  celerXReady() {
    console.log(" invoke celerx.ready() ");

    if (!celerSDK) {
      this.onCelerStart();
    } else {
      celerSDK.ready();
    }
  }

  isNew() {
    return this.isNewPlayer;
  }

  isOnCelerPlatform() {
    return celerSDK;
  }

  onCelerStart() {
    console.log(" celerx onStart call");
    this.match = celerSDK ? celerSDK.getMatch() : {
      matchId: "error : can not get id",
      shouldLaunchTutorial: false,
      sharedRandomSeed: 1,
      difficultyLevel: 0
    };

    console.log(
      "match id:",
      this.match.matchId,
      ", seed:",
      this.match.sharedRandomSeed
    );

    if ((this.match && this.match.shouldLaunchTutorial) || CC_DEBUG) {
      this.isNewPlayer = true;
    } else {
      this.isNewPlayer = false;
    }

    if (this.celerStartCallback) {
      this.celerStartCallback();
      this.celerStartCallback = null;
    }
  }

  submitScore(score: number) {
    if (this.alreadySubmit) return;
    this.alreadySubmit = true;
    console.log(" submit score:", score, ", match id:", this.match.matchId);
    celerSDK && celerSDK.submitScore(score);
  }
}
