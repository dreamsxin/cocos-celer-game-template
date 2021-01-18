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
export default class FontView extends cc.Component {


    // LIFE-CYCLE CALLBACKS:

    onLoad() {

    }

    start() {

    }

    update(dt: number) {

        if (this.node.parent.scaleX >= 0) {
            this.node.scaleX = 1;
        } else {
            this.node.scaleX = 0;
        }

        if (this.node.parent.scaleY < 0) {
            this.node.scaleY = 1;
        } else {
            this.node.scaleY = 0;
        }
    }
}
