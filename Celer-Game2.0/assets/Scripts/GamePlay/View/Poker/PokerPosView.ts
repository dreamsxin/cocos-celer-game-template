import { ConvertToNodeSpaceAR } from "../../../Utils/Cocos";
import BaseView from "../../../View/BaseView";
import PositionView from "../../../View/Transform/PositionView";
// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { PokerModel } from "../../Model/Poker/PokerModel";
import PokerPosMediator from "./PokerPosMediator";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PokerPosView extends PositionView {

    // LIFE-CYCLE CALLBACKS:
    private model: PokerModel = null;
    get Model() {
        return this.model;
    }

    onLoad() {
        this.BindMedaitor(PokerPosMediator);
    }

    reuse(model: PokerModel) {

        this.model = model;
        this.node["_onSetParent"] = this.onParentChanged.bind(this);
    }

    unuse() {

        this.model = null;

    }

    onParentChanged(parent: cc.Node) {

        // this.node.position = ConvertToNodeSpaceAR(this.node, parent);

    }
}
