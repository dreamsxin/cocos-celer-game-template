import { _decorator, Component, Node, sys, AudioClip, loader, game } from "cc";
import { HashMap } from "../Common/HashMap";
import { SingleTon } from "../Common/ToSingleTon";
import {
  ButtonClickSignal,
  CountDownSignal,
  GameOverSignal,
  NextLevelSignal,
  OpenResultLayerSignal,
  PlayerScoreChanged,
  ScoreCountingSignal,
  ShowSubmitSignal,
  StartCountSignal,
  UpdateTimeNumber,
} from "../Signal/Signal";
import { RoundEndType } from "./GameStateController";
const { ccclass, property } = _decorator;

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
  public static canPlay: boolean = CC_DEBUG || sys.WIN32 == sys.platform;
  private static hasBindTouch: boolean = false;

  private audioID: { [key: string]: AudioClip } = {};
  private effectCount: number = 0;

  get EffectCount() {
    return this.effectCount;
  }

  set EffectCount(val: number) {
    this.effectCount = val;
    this.effectCount = Math.max(0, this.effectCount);
  }

  private clips: HashMap<string, AudioClip> = new HashMap();
  private bgm: AudioClip = null;
  init(callback: Function, progress?: Function) {
    console.log(" start load AudioClip ");

    let self = this;
    loader.loadRes(
      PATH + "bgm",
      AudioClip,
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
            loader["_cache"] &&
            loader["_cache"][clip["_audio"]] &&
            loader["_cache"][clip["_audio"]]["buffer"]
          ) {
            clip["_audio"] = loader["_cache"][clip["_audio"]]["buffer"];
          }
          self.clips.add(clip.name, clip);
          self.bgm = clip;
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

    loader.loadResDir(PATH, (err, res, urls) => {
      if (err) {
        console.error(err);
      } else {
        for (let clip of res) {
          if (
            typeof clip["_audio"] == "string" &&
            loader["_cache"] &&
            loader["_cache"][clip["_audio"]] &&
            loader["_cache"][clip["_audio"]]["buffer"]
          ) {
            clip["_audio"] = loader["_cache"][clip["_audio"]]["buffer"];
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
    this.clips.forEach((key: string, clip: AudioClip) => {
      if (this.bgm && clip.name != this.bgm.name) {
        clip.setVolume(volume * this.effectVolumeScale);
      }
    });
  }

  setMusicVolume(volume: number) {
    this.musicVolumeScale = 1;
    if (this.bgm) {
      this.bgm.setVolume(volume * this.musicVolumeScale);
    }
  }

  get EffectVolume() {
    if (this.clips.length <= 0) return 0;
    for (let clip of this.clips.values) {
      if (clip.value.name != this.bgm.name) {
        return clip.value.getVolume() / this.effectVolumeScale;
      }
    }
    return 0;
  }

  get MusicVolume() {
    if (!this.bgm) return 0;
    return this.bgm.getVolume() / this.musicVolumeScale;
  }

  bindSignal() {
    this.setEffectVolume(1);
    this.setMusicVolume(1);

    // bgm
    UpdateTimeNumber.inst.addListener((time: number) => {
      if (time >= 30) {
        if (
          this.bgm &&
          this.bgm.name == "bgm" &&
          this.bgm.state == AudioClip.PlayingState.PLAYING
        ) {
          return;
        }
        this.playMusic("bgm", true);
      } else {
        if (
          this.bgm &&
          this.bgm.name == "bgm_30" &&
          this.bgm.state == AudioClip.PlayingState.PLAYING
        ) {
          return;
        }
        this.playMusic("bgm_30", true);
      }
    }, this);

    StartCountSignal.inst.addListener(() => {
      this.playEffect("start_count");
    }, this);

    /** 结算分数跳动 */
    ScoreCountingSignal.inst.addListener(() => {
      if (
        this.audioID["scoreCount"] &&
        this.audioID["scoreCount"].state == AudioClip.PlayingState.PLAYING
      )
        return;

      this.playEffect("scoreCount", false, () => {
        this.audioID["scoreCount"] = null;
      });
    }, this);

    /** 显示结算按钮 */
    ShowSubmitSignal.inst.addListener(() => {
      if (this.audioID["scoreCount"]) {
        this.audioID["scoreCount"].stop();
      }
      this.playEffect("showSubmit");
    }, this);

    /** 打开结算界面 */
    OpenResultLayerSignal.inst.addListener((type: RoundEndType) => {
      if (type == RoundEndType.TimeUp) {
        this.playEffect("show_result");
      } else if (type == RoundEndType.Complete) {
        this.playEffect("show_result");
      } else {
        this.playEffect("show_result");
      }
    }, this);

    /** 玩家加分 */
    PlayerScoreChanged.inst.addListener(
      (playerScore: number, addScore: number, times: number) => {},
      this
    );

    NextLevelSignal.inst.addListener((level: number) => {
      if (level == 0) return;
      this.playEffect("pass_level");
      // this.playEffect("map_move");
    }, this);

    // /** 游戏暂停 */
    // GamePauseSignal.inst.addListener(() => {
    //   this.playEffect("pause");
    // }, this);

    /** 按钮点击 */
    ButtonClickSignal.inst.addListener(() => {
      this.playEffect("click");
    }, this);

    /** 倒计时 */
    CountDownSignal.inst.addListener(() => {
      this.playEffect("countDown");
    }, this);

    GameOverSignal.inst.addListener((type: RoundEndType) => {
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

    if (this.EffectVolume <= 0.05) return;

    let effect = this.clips.get(name);
    // if (this.audioID[name]) return;

    if (effect) {
      this.audioID[name] = effect;
      effect.play();
      effect.setLoop(loop);

      this.EffectCount++;
      effect.once(
        "ended",
        () => {
          this.EffectCount--;
          this.audioID[name] = null;
          finishCallback && finishCallback();
        },
        this
      );

      if (EffectLimitTime > 0) {
        setTimeout(() => {
          this.audioID[name] = null;
        }, EffectLimitTime);
      }
    } else {
      loader.loadRes(PATH + name, AudioClip, (err, res) => {
        if (err) {
          console.error(err);
        } else {
          if (
            typeof res["_audio"] == "string" &&
            loader["_cache"] &&
            loader["_cache"][res["_audio"]] &&
            loader["_cache"][res["_audio"]]["buffer"]
          ) {
            res["_audio"] = loader["_cache"][res["_audio"]]["buffer"];
          }
          this.clips.add(res.name, res);
          // if (this.audioID[name]) return;
          this.audioID[name] = res;
          res.play();
          res.setLoop(loop);
          this.EffectCount++;
          this.audioID[name].once(
            "ended",
            () => {
              finishCallback && finishCallback();
              this.audioID[name] = null;
              this.EffectCount--;
            },
            this
          );
          if (EffectLimitTime > 0) {
            setTimeout(() => {
              this.audioID[name] = null;
            }, EffectLimitTime);
          }
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
      this.bgm = music;
      this.audioID[name] = music;
      this.bgm.play();
      this.bgm.setLoop(true);
    } else {
      loader.loadRes(PATH + name, AudioClip, (err, res) => {
        if (err) {
          console.error(err);
        } else {
          if (
            typeof res["_audio"] == "string" &&
            loader["_cache"] &&
            loader["_cache"][res["_audio"]] &&
            loader["_cache"][res["_audio"]]["buffer"]
          ) {
            res["_audio"] = loader["_cache"][res["_audio"]]["buffer"];
          }
          this.clips.add(res.name, res);
          this.bgm = res;
          this.audioID[name] = res;
          this.bgm.play();
          this.bgm.setLoop(true);
        }
      });
    }
  }

  private bindTouch() {
    if (!AudioController.hasBindTouch) {
      let self = this;
      let playFunc = function () {
        game.canvas.removeEventListener("touchstart", playFunc);
        AudioController.canPlay = true;
        let item: AudioItem;
        while (
          (item = AudioController.PlayedList.pop()) &&
          self.clips.get(item.clipName) &&
          !item.skip
        ) {
          self.playMusic(item.clipName, item.loop);
        }
      };
      AudioController.hasBindTouch = true;
      game.canvas.addEventListener("touchstart", playFunc);
    }
  }
}
/**
 * 只管理游戏内音频
 */
export const gAudio = AudioController.inst;
