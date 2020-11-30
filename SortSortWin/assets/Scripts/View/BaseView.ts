// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class BaseView extends cc.Component {



    onLoad() {
        this.node.scale = 0;
    }

    Show(callback?: () => void) {
        this.node.active = true;
        this.node.runAction(cc.sequence(cc.callFunc(() => {

        }), cc.scaleTo(0.1, 1), cc.callFunc(() => {
            callback && callback();
        })))
    }

    Hide(callback?: () => void) {
        this.node.runAction(cc.sequence(cc.scaleTo(0.1, 0), cc.callFunc(() => {
            this.node.active = false;
            callback && callback();
        })));
    }

    OnClick() {

    }


    BindMedaitor<T extends cc.Component>(type: { new(): T }): T {

        if (this.node.getComponent(type)) {
            console.warn(" this node already has the same component..");
            return;
        }

        let comp = this.node.addComponent(type);
        if (comp["bind"]) comp["bind"](this);
        if (comp["onRegister"]) {
            comp["onRegister"]();
        }
        return comp;
    }

    UnbindMedaitor<T extends cc.Component>(type: { new(): T }): T {
        let comp = this.node.getComponent(type);
        if (!comp) {
            console.warn(" component already removed..");
            return;
        }

        if (comp["onUnregister"]) {
            comp["onUnregister"]();
        }
        if (comp["bind"]) comp["bind"](null);
        this.node.removeComponent(type);
        return comp;
    }
}
