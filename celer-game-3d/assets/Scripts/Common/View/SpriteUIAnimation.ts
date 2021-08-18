import {
  _decorator,
  Component,
  Node,
  Sprite,
  SpriteAtlas,
  color,
  tween,
} from "cc";
const { ccclass, property, requireComponent } = _decorator;

@ccclass("SpriteUIAnimation")
@requireComponent(Sprite)
export class SpriteUIAnimation extends Component {
  public static aniName = "FrameAniBase";

  @property(SpriteAtlas)
  public Frames: SpriteAtlas = null;

  @property
  public PrefixName: string = "";
  @property
  public FrameCount: number = 0;

  @property
  public Interval: number = 0.05;

  @property
  public Priority: number = 0;

  @property
  public Loop: boolean = false;

  @property
  public PlayOnLoad: boolean = false;

  protected currentIndex: number = 0;
  private time: number = 0;

  public static intervalID: any = -1;
  private isPlay: boolean = false;

  get Sprite() {
    return this.node.getComponent(Sprite);
  }

  set Animation(val: SpriteAtlas) {
    this.Frames = val;
  }

  onFocusInEditor() {
    // this.time = this.Interval;
    // FrameAniBase.intervalID = setInterval(this.update.bind(this), 0.016, 0.016);
  }

  onLostFocusInEditor() {
    clearInterval(SpriteUIAnimation.intervalID);
  }

  onLoad() {
    this.time = this.Interval;
    this.isPlay = this.PlayOnLoad;
  }

  play() {
    this.isPlay = true;
    this.currentIndex = 0;
    this.Sprite.color.a = 255;
    this.updateCurrentFrame();
    if (this.isPlaying == false) {
      this.callEventComplete();
    }
  }

  onStartPlay() {}

  playOnLoop() {
    this.Loop = true;
    this.play();
  }

  playByStep() {
    this.isPlay = true;
    this.nextFrame();
    this.isPlay = false;
  }

  pause() {
    this.isPlay = false;
  }

  resume() {
    this.isPlay = true;
  }

  stop() {
    this.isPlay = false;
    this.currentIndex = 0;
    this.updateCurrentFrame();
    this.Loop = false;
  }

  updateCurrentFrame() {
    if (this.PrefixName != "") {
      this.Sprite.spriteFrame = this.Frames.getSpriteFrame(
        this.PrefixName + (this.currentIndex + 1)
      );
    } else {
      this.Sprite.spriteFrame =
        this.Frames.getSpriteFrames()[this.currentIndex];
    }
  }

  onKeyFrame(key: number) {}

  private listener: {
    callback: (key: number, name?: string) => void;
    target: any;
  }[] = [];
  addKeyEventListener(f: (key: number, name?: string) => void, target: any) {
    this.listener.push({
      callback: f,
      target: target,
    });
  }

  get ListenerCount() {
    return this.listener.length;
  }

  clearAllListener() {
    this.listener.length = 0;
    return this;
  }

  onComplete() {
    tween(this.Sprite.color)
      .to(
        0.2,
        color(this.Sprite.color.r, this.Sprite.color.g, this.Sprite.color.b, 0)
      )
      .start();
  }

  callEventFrame() {
    this.onKeyFrame(this.currentIndex);
    for (let callback of this.listener) {
      callback.callback.apply(callback.target, [
        this.currentIndex,
        this["__classname__"],
      ]);
    }
  }

  callEventComplete() {
    this.isPlay = false;
    //  this.Sprite.spriteFrame = null;

    for (let complete of this.complateEvent) {
      complete.f.apply(complete.target, [this["__classname__"]]);
    }
    this.onComplete();
  }

  private complateEvent: {
    f: (name: string) => void;
    target: any;
  }[] = [];
  addCompleteEvent(f: (name: string) => void, target: any) {
    this.complateEvent.push({
      f: f,
      target: target,
    });
  }

  get TotalFrameCount() {
    if (this.PrefixName != "" && this.FrameCount > 0)
      return this.Loop ? this.FrameCount : this.FrameCount + 1;
    return this.Frames && this.Frames.getSpriteFrames
      ? this.Frames.getSpriteFrames().length + 1
      : 0;
  }

  get CompleteEventCount() {
    return this.complateEvent.length;
  }

  clearCompleteEvent() {
    this.complateEvent.length = 0;
    return this;
  }

  start() {}

  get isPlaying() {
    if (
      this.isPlay &&
      this.Frames &&
      this.Frames.getSpriteFrames &&
      this.Frames.getSpriteFrames().length > 0
    ) {
      let Components = this.getComponents(SpriteUIAnimation);
      for (let comp of Components) {
        if (comp.Priority > this.Priority && comp.isPlaying) {
          return false;
        }
      }
      return true;
    }
    return false;
  }

  nextFrame() {
    if (this.isPlaying == false) {
      this.time = this.Interval;
      return;
    }
    if (
      this.Frames &&
      this.Frames.getSpriteFrames &&
      this.Frames.getSpriteFrames().length > 0
    ) {
      if (this.currentIndex == 0) {
        this.onStartPlay();
      }
      this.updateCurrentFrame();
      this.callEventFrame();

      this.currentIndex = (this.currentIndex + 1) % this.TotalFrameCount;

      if (this.currentIndex == 0 && this.Loop == false) {
        this.isPlay = false;
        this.callEventComplete();
      }
    }
  }

  update(dt: number) {
    if (this.time >= this.Interval) {
      this.time = 0;
      this.nextFrame();
    }
    this.time += dt;
  }
}
