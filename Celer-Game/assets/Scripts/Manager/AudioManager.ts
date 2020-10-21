import { HashMap } from "../Utils/HashMap";
import { ScoreCountingSignal, ShowSubmitSignal, OpenResultLayerSignal, PlayerScoreChanged, GamePauseSignal, ButtonClickSignal, CountDownSignal, UpdateTimeNumber } from "../Command/CommonSignal";
import { RoundEndType } from "../Controller/GameStateController";
import { SingleTon } from "../Utils/ToSingleton";


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

class AudioController extends SingleTon<AudioController>() {

    private static PlayedList: AudioItem[] = [];
    public static canPlay: boolean = CC_DEBUG || cc.sys.WIN32 == cc.sys.platform;
    private static hasBindTouch: boolean = false;

    private audioID = {};

    private clips: HashMap<string, cc.AudioClip> = new HashMap();
    init(callback: Function) {
        console.log(" start load AudioClip ");

        let self = this;
        cc.loader.loadRes(PATH + "bgm", cc.AudioClip, function (err, clip) {
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
        });

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
    private musicVolumeScale = 1;

    setEffectVolume(volume: number) {
        this.effectVolumeScale = 1.8;
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

            // if (time >= 30) {
            //     if (cc.audioEngine.getState(this.audioID["bgm"]) == cc.audioEngine.AudioState.PLAYING) {
            //         return;
            //     }

            //     this.playMusic("bgm", true);
            // } else {
            //     if (cc.audioEngine.getState(this.audioID["bgm_30"]) == cc.audioEngine.AudioState.PLAYING) {
            //         return;
            //     }

            //     this.playMusic("bgm_30", true);
            // }

        }, this);


        /** 结算分数跳动 */
        ScoreCountingSignal.inst.addListener(() => {
            if (this.audioID["scoreCount"]) return;

            this.playEffect("scoreCount", false, () => {
                this.audioID["scoreCount"] = null;
            })
        }, this);

        /** 显示结算按钮 */
        ShowSubmitSignal.inst.addListener(() => {
            if (this.audioID["scoreCount"])
                cc.audioEngine.stopEffect(this.audioID["scoreCount"]);
            this.playEffect("showSubmit")
        }, this);

        /** 打开结算界面 */
        OpenResultLayerSignal.inst.addListenerOne((type: RoundEndType) => {

            if (type == RoundEndType.TimeUp) {
                this.playEffect("timeup")
            } else if (type == RoundEndType.Complete) {
                this.playEffect("complete")
            } else {
                this.playEffect("complete")
            }


        }, this);


        /** 玩家加分 */
        PlayerScoreChanged.inst.addListenerThree((playerScore: number, addScore: number, times: number) => {


        }, this);

        /** 游戏暂停 */
        GamePauseSignal.inst.addListener(() => {

            this.playEffect("pause");

        }, this);

        /** 按钮点击 */
        ButtonClickSignal.inst.addListener(() => {

            this.playEffect("click");

        }, this);

        /** 倒计时 */
        CountDownSignal.inst.addListener(() => {

            this.playEffect("countDown");

        }, this);


    }


    playEffect(name: string, loop: boolean = false, finishCallback?: Function) {
        if (!AudioController.canPlay) {
            this.bindTouch();
            return;
        }

        if (cc.audioEngine.getEffectsVolume() <= 0.05) return;

        let effect = this.clips.get(name);
        // if (this.audioID[name]) return;

        if (effect) {
            this.audioID[name] = cc.audioEngine.playEffect(effect, loop);
            // cc.audioEngine.setFinishCallback(this.audioID[name], () => {
            //   this.audioID[name] = null;
            // });
            cc.audioEngine.setFinishCallback(this.audioID[name], () => {
                finishCallback && finishCallback();
            });
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
                    cc.audioEngine.setFinishCallback(this.audioID[name], () => {
                        finishCallback && finishCallback();
                    });
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
 * 只管理游戏内音频
 */
export const gAudio = AudioController.inst;