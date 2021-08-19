import {
  _decorator,
  Component,
  Node,
  PageView,
  Label,
  v3,
  tween,
  Vec3,
} from "cc";
import { Theme } from "../../../GamePlay/GameRule";
import { PlayModel } from "../../../Model/PlayModel";
import { ButtonClickSignal, HideHelpLayerSignal } from "../../../Signal/Signal";
import { BaseView } from "../BaseView";
import { HelpLayerMediator } from "./HelpLayerMediator";
const { ccclass, property } = _decorator;
enum State {
  Show,
  Hide,
}
@ccclass("HelpLayerView")
export class HelpLayerView extends BaseView {
  private state: State = State.Hide;
  // LIFE-CYCLE CALLBACKS:

  @property(Node)
  Next: Node = null;

  @property(Node)
  Close: Node = null;

  @property(PageView)
  GuidePage: PageView = null;

  @property(Label)
  TotalPage: Label = null;

  @property(Label)
  Page: Label = null;

  get Background() {
    return this.node.getChildByName("Background");
  }

  onLoad() {
    this.BindMedaitor(HelpLayerMediator);
    this.state = State.Hide;

    this.node.scale = v3(1, 1, 1);
    this.node.active = false;

    this.GuidePage.node.on("page-turning", this.onPageChanged, this);

    this.Close.on(Node.EventType.TOUCH_END, this.close, this);
    this.Next.on(Node.EventType.TOUCH_END, this.next, this);
  }

  start() {}

  close() {
    ButtonClickSignal.inst.dispatch();
    HideHelpLayerSignal.inst.dispatch();
  }

  next() {
    ButtonClickSignal.inst.dispatch();
    this.GuidePage.scrollToPage(
      (this.GuidePage.getCurrentPageIndex() + 1) %
        this.GuidePage.content.children.length,
      0
    );
    this.onPageChanged();
  }

  onPageChanged() {
    if (this.TotalPage) {
      this.TotalPage.string = this.GuidePage.content.children.length.toString();
    }

    if (this.Page) {
      this.Page.string = (this.GuidePage.getCurrentPageIndex() + 1).toString();
    }

    if (
      this.GuidePage.getCurrentPageIndex() >=
      this.GuidePage.content.children.length - 1
    ) {
      this.Next.active = false;
      this.Close.active = true;
    } else {
      this.Next.active = true;
      this.Close.active = false;
    }
  }

  isShowed() {
    return this.state == State.Show;
  }

  Show(callback?: Function) {
    if (this.isShowed()) return;
    this.state = State.Show;
    this.node.active = true;
    tween(this.node).stop();

    let count = 0;
    for (let child of this.Background.children) {
      child.active = child.name == Theme[PlayModel.inst.Theme];
      if (child.active) {
        count++;
      }
    }

    if (count <= 0) {
      this.Background.children[0].active = true;
    }

    this.node.scale = Vec3.ZERO;

    tween(this.node)
      .to(0.1, { scale: v3(1, 1, 1) })
      .call(() => {
        callback && callback();
      })
      .start();

    this.Next.active = true;
    this.Close.active = false;
    this.GuidePage.scrollToPage(0, 0);
    this.onPageChanged();
  }

  Hide(callback?: Function) {
    if (this.isShowed() == false) return;

    this.state = State.Hide;
    tween(this.node).stop();
    tween(this.node)
      .to(0.1, { scale: v3(0, 0, 0) })
      .call(() => {
        this.node.scale = v3(1, 1, 1);
        callback && callback();

        this.node.active = false;
      });
  }

  // update (dt) {}
}
