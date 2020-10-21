// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import BaseView from "./BaseView";
import HelpLayerMediator from "./HelpLayerMediator";
import { ButtonClickSignal, HideHelpLayerSignal } from "../Command/CommonSignal";






const { ccclass, property } = cc._decorator;
enum State {
    Show,
    Hide
}
@ccclass
export default class HelpLayerView extends BaseView {

    private state: State = State.Hide;
    // LIFE-CYCLE CALLBACKS:

    @property(cc.Node)
    Next: cc.Node = null;

    @property(cc.Node)
    Close: cc.Node = null;

    @property(cc.PageView)
    GuidePage: cc.PageView = null;

    @property(cc.Label)
    TotalPage: cc.Label = null

    @property(cc.Label)
    Page: cc.Label = null

    onLoad() {
        this.BindMedaitor(HelpLayerMediator);
        this.state = State.Hide;

        this.node.scale = 1;
        this.node.active = false;

        this.GuidePage.node.on("page-turning", this.onPageChanged, this);

        this.Close.on(cc.Node.EventType.TOUCH_END, this.close, this);
        this.Next.on(cc.Node.EventType.TOUCH_END, this.next, this);

    }

    start() {

    }

    close() {

        ButtonClickSignal.inst.dispatch();
        HideHelpLayerSignal.inst.dispatch();

    }

    next() {

        ButtonClickSignal.inst.dispatch();
        this.GuidePage.scrollToPage((this.GuidePage.getCurrentPageIndex() + 1) % this.GuidePage.content.childrenCount, 0);
        this.onPageChanged();

    }

    onPageChanged() {

        if (this.TotalPage) {
            this.TotalPage.string = this.GuidePage.content.childrenCount.toString();
        }

        if (this.Page) {
            this.Page.string = (this.GuidePage.getCurrentPageIndex() + 1).toString();
        }


        if (this.GuidePage.getCurrentPageIndex() >= this.GuidePage.content.childrenCount - 1) {
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
        this.node.stopAllActions();

        this.node.scale = 0;

        this.node.runAction(cc.sequence(cc.callFunc(() => {

        }), cc.scaleTo(0.1, 1), cc.callFunc(() => {
            callback && callback();
        })));

        this.Next.active = true;
        this.Close.active = false;
        this.GuidePage.scrollToPage(0, 0);
        this.onPageChanged();

    }

    Hide(callback?: Function) {

        if (this.isShowed() == false) return;

        this.state = State.Hide;
        this.node.stopAllActions();
        this.node.runAction(cc.sequence(cc.scaleTo(0.1, 0), cc.callFunc(() => {

            this.node.scale = 1;
            callback && callback();

            this.node.active = false;
        })));
    }


    // update (dt) {}
}
