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

const { ccclass, property } = cc._decorator;

@ccclass
export default class SingleTouchMediator<T extends cc.Component> extends cc.Component {

    public bind(view: T) {

        this.view = view;
    }

    private view: T;
    get View(): T {
        console.assert(this.view != null, " view is null");
        return this.view;
    }


    private touchid: number = null;

    onRegister() {
        this.node.targetOff(this);

        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchCancel, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchStart, this);
    }

    onUnregister() {

        this.node.targetOff(this);
    }

    private touchStart(event: cc.Event.EventTouch) {

        if (this.touchid !== null && this.touchid !== event.getID()) {
            console.log(this.node.name, " touch start  touchid is different: ", this.touchid, event.getID());
            return;
        }
        this.touchid = event.getID();

        this.onTouchStart(event);
    }

    private touchMove(event: cc.Event.EventTouch) {
        if (this.touchid !== null && this.touchid !== event.getID()) {
            //console.log(this.node.name, " touch move  touchid is different! ");
            return;
        }
        this.touchid = event.getID();
        this.onTouchMove(event);
    }

    private touchEnd(event: cc.Event.EventTouch) {
        if (this.touchid !== null && this.touchid !== event.getID()) {
            console.log(this.node.name, " touch end  touchid is different: ", this.touchid, event.getID());
            return;
        }

        if (this.touchid == null) {
            return;
        }

        this.touchid = null;
        this.onTouchEnd(event);
        this.OnClick();
    }

    private touchCancel(event: cc.Event.EventTouch) {
        if (this.touchid !== null && this.touchid !== event.getID()) {
            console.log(this.node.name, " touch cancel  touchid is different: ", this.touchid, event.getID());
            return;
        }

        if (this.touchid == null) {
            return;
        }

        this.touchid = null;
        this.onTouchCancel(event);
    }


    protected OnClick() {

    }

    protected onTouchStart(event: cc.Event.EventTouch) {

    }

    protected onTouchMove(event: cc.Event.EventTouch) {

    }

    protected onTouchEnd(event: cc.Event.EventTouch) {


    }

    protected onTouchCancel(event: cc.Event.EventTouch) {

    }
}