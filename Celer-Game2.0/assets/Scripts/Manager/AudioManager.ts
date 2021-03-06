import { HashMap } from "../Utils/HashMap";
import {
  ScoreCountingSignal,
  ShowSubmitSignal,
  OpenResultLayerSignal,
  PlayerScoreChanged,
  ButtonClickSignal,
  CountDownSignal,
  UpdateTimeNumber,
  GameOverSignal,
} from "../Command/CommonSignal";
import { RoundEndType } from "../Controller/GameStateController";
import { SingleTon } from "../Utils/ToSingleton";
import { NextLevelSignal, StartCountSignal } from "../Model/PlayModelProxy";
interface AudioItem {
  loop: boolean;
  volume: number;
  clipName: string;
  supTime: number;
  skip: boolean;
  isBgm: boolean;
}

if (window.oncanplay) {
  window.oncanplay = function () {
    AudioController.canPlay = true;
  };
}

const PATH = "sounds/";

const EffectLimitTime = 100;
const EffectCountLimit = 15;

class AudioController extends SingleTon<AudioController>() {
  private static PlayedList: AudioItem[] = [];
  public static canPlay: boolean = false;
  private static hasBindTouch: boolean = false;

  private audioID = {};
  private effectCount: number = 0;

  get EffectCount() {
    return this.effectCount;
  }

  set EffectCount(val: number) {
    this.effectCount = val;
    this.effectCount = Math.max(0, this.effectCount);
  }

  private clips: HashMap<string, cc.AudioClip> = new HashMap();
  init(callback: Function, progress?: Function) {
    console.log(" start load AudioClip ");

    let self = this;
    cc.loader.loadRes(
      PATH + "bgm",
      cc.AudioClip,
      (completed: number, total: number) => {
        if (progress) {
          progress(completed / total);
        }
      },
      function (err, clip) {
        if (err) {
          console.error(err);
        } else {
          if (
            typeof clip["_audio"] == "string" &&
            cc.loader["_cache"] &&
            cc.loader["_cache"][clip["_audio"]] &&
            cc.loader["_cache"][clip["_audio"]]["buffer"]
          ) {
            clip["_audio"] = cc.loader["_cache"][clip["_audio"]]["buffer"];
          }
          self.clips.add(clip.name, clip);
          callback && callback();

          self.playMusic("bgm", true);
        }
      }
    );

    // cc.loader.loadRes(PATH + "bgm_30", function (err, clip) {
    //     if (err) {
    //         console.error(err);
    //     } else {
    //         self.clips.add(clip.name, clip);
    //     }
    // });

    cc.loader.loadResDir(PATH, (err, res, urls) => {
      if (err) {
        console.error(err);
      } else {
        for (let clip of res) {
          if (
            typeof clip["_audio"] == "string" &&
            cc.loader["_cache"] &&
            cc.loader["_cache"][clip["_audio"]] &&
            cc.loader["_cache"][clip["_audio"]]["buffer"]
          ) {
            clip["_audio"] = cc.loader["_cache"][clip["_audio"]]["buffer"];
          }
          if (!this.clips.has(clip.name)) {
            this.clips.add(clip.name, clip);
          }
        }
      }
    });

    this.bindSignal();
  }

  private effectVolumeScale = 1;
  private musicVolumeScale = 0.8;

  setEffectVolume(volume: number) {
    this.effectVolumeScale = 1;
    cc.audioEngine.setEffectsVolume(volume * this.effectVolumeScale);
  }

  setMusicVolume(volume: number) {
    this.musicVolumeScale = 1;
    cc.audioEngine.setMusicVolume(volume * this.musicVolumeScale);
  }

  get EffectVolume() {
    return cc.audioEngine.getEffectsVolume() / this.effectVolumeScale;
  }

  get MusicVolume() {
    return cc.audioEngine.getMusicVolume() / this.musicVolumeScale;
  }

  bindSignal() {
    this.setEffectVolume(1);
    this.setMusicVolume(1);

    // bgm
    UpdateTimeNumber.inst.addListenerOne((time: number) => {
      if (time >= 30) {
        if (
          cc.audioEngine.getState(this.audioID["bgm"]) ==
          cc.audioEngine.AudioState.PLAYING
        ) {
          return;
        }
        this.playMusic("bgm", true);
      } else {
        if (
          cc.audioEngine.getState(this.audioID["bgm_30"]) ==
          cc.audioEngine.AudioState.PLAYING
        ) {
          return;
        }
        this.playMusic("bgm_30", true);
      }
    }, this);

    StartCountSignal.inst.addListener(() => {
      this.playEffect("start_count");
    }, this);

    /** ?????????????????? */
    ScoreCountingSignal.inst.addListener(() => {
      if (this.audioID["scoreCount"]) return;

      this.playEffect("scoreCount", false, () => {
        this.audioID["scoreCount"] = null;
      });
    }, this);

    /** ?????????????????? */
    ShowSubmitSignal.inst.addListener(() => {
      if (this.audioID["scoreCount"])
        cc.audioEngine.stopEffect(this.audioID["scoreCount"]);
      this.playEffect("showSubmit");
    }, this);

    /** ?????????????????? */
    OpenResultLayerSignal.inst.addListenerOne((type: RoundEndType) => {
      if (type == RoundEndType.TimeUp) {
        this.playEffect("show_result");
      } else if (type == RoundEndType.Complete) {
        this.playEffect("show_result");
      } else {
        this.playEffect("show_result");
      }
    }, this);

    /** ???????????? */
    PlayerScoreChanged.inst.addListenerThree(
      (playerScore: number, addScore: number, times: number) => {},
      this
    );

    NextLevelSignal.inst.addListenerOne((level: number) => {
      if (level == 0) return;
      this.playEffect("pass_level");
      // this.playEffect("map_move");
    }, this);

    // /** ???????????? */
    // GamePauseSignal.inst.addListener(() => {
    //   this.playEffect("pause");
    // }, this);

    /** ???????????? */
    ButtonClickSignal.inst.addListener(() => {
      this.playEffect("click");
    }, this);

    /** ????????? */
    CountDownSignal.inst.addListener(() => {
      this.playEffect("countDown");
    }, this);

    GameOverSignal.inst.addListenerOne((type: RoundEndType) => {
      this.effectCount = 0;
      switch (type) {
        case RoundEndType.Complete:
          this.playEffect("complete");
          break;
        case RoundEndType.TimeUp:
          this.playEffect("timeup");
          break;
        case RoundEndType.Over:
          this.playEffect("over");
          break;

        default:
          this.playEffect("over");
          break;
      }
    }, this);
  }

  playEffect(name: string, loop: boolean = false, finishCallback?: Function) {
    if (!AudioController.canPlay) {
      this.bindTouch();
      return;
    }

    if (this.effectCount >= EffectCountLimit) return;

    if (EffectLimitTime > 0) {
      if (this.audioID[name] != null) return;
    }

    if (cc.audioEngine.getEffectsVolume() <= 0.05) return;

    let effect = this.clips.get(name);
    // if (this.audioID[name]) return;

    if (effect) {
      this.audioID[name] = cc.audioEngine.playEffect(effect, loop);
      // cc.audioEngine.setFinishCallback(this.audioID[name], () => {
      //   this.audioID[name] = null;
      // });

      this.EffectCount++;
      cc.audioEngine.setFinishCallback(this.audioID[name], () => {
        this.audioID[name] = null;
        this.EffectCount--;
        finishCallback && finishCallback();
      });
      if (EffectLimitTime > 0) {
        setTimeout(() => {
          this.audioID[name] = null;
        }, EffectLimitTime);
      }
    } else {
      cc.loader.loadRes(PATH + name, cc.AudioClip, (err, res) => {
        if (err) {
          console.error(err);
        } else {
          if (
            typeof res["_audio"] == "string" &&
            cc.loader["_cache"] &&
            cc.loader["_cache"][res["_audio"]] &&
            cc.loader["_cache"][res["_audio"]]["buffer"]
          ) {
            res["_audio"] = cc.loader["_cache"][res["_audio"]]["buffer"];
          }
          this.clips.add(res.name, res);
          // if (this.audioID[name]) return;
          this.audioID[name] = cc.audioEngine.playEffect(res, loop);
          this.EffectCount++;
          cc.audioEngine.setFinishCallback(this.audioID[name], () => {
            finishCallback && finishCallback();
            this.audioID[name] = null;
            this.EffectCount--;
          });
          if (EffectLimitTime > 0) {
            setTimeout(() => {
              this.audioID[name] = null;
            }, EffectLimitTime);
          }
          // cc.audioEngine.setFinishCallback(this.audioID[name], () => {
          //   this.audioID[name] = null;
          // });
        }
      });
    }
  }

  playMusic(name: string, loop: boolean = true) {
    if (!AudioController.canPlay) {
      this.bindTouch();
      AudioController.PlayedList.push({
        loop: true,
        volume: 1,
        clipName: name,
        supTime: Date.now(),
        skip: false,
        isBgm: true,
      });
      return;
    }

    let music = this.clips.get(name);
    if (music) {
      this.audioID[name] = cc.audioEngine.playMusic(music, loop);
    } else {
      cc.loader.loadRes(PATH + name, cc.AudioClip, (err, res) => {
        if (err) {
          console.error(err);
        } else {
          if (
            typeof res["_audio"] == "string" &&
            cc.loader["_cache"] &&
            cc.loader["_cache"][res["_audio"]] &&
            cc.loader["_cache"][res["_audio"]]["buffer"]
          ) {
            res["_audio"] = cc.loader["_cache"][res["_audio"]]["buffer"];
          }
          this.clips.add(res.name, res);
          this.audioID[name] = cc.audioEngine.playMusic(res, loop);
        }
      });
    }
  }

  private bindTouch() {
    if (!AudioController.hasBindTouch) {
      let self = this;
      let playFunc = function () {
        cc.game.canvas.removeEventListener("touchstart", playFunc);
        AudioController.canPlay = true;
        let item: AudioItem;
        while (
          (item = AudioController.PlayedList.pop()) &&
          self.clips.get(item.clipName) &&
          !item.skip
        ) {
          cc.audioEngine.playMusic(self.clips.get(item.clipName), item.loop);
        }
      };
      AudioController.hasBindTouch = true;
      cc.game.canvas.addEventListener("touchstart", playFunc);
    }
  }
}
/**
 * ????????????????????????
 */
export const gAudio = AudioController.inst;
