import { GameOverSignal, GamePauseSignal } from "../../../Command/CommonSignal";
import { GameStateController } from "../../../Controller/GameStateController";
import { PlayModelProxy } from "../../../Model/PlayModelProxy";
import { BaseSignal } from "../../../Utils/Signal";
// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import SingleTouchMediator from "../../../View/SingleTouchMediator";
import { Poker } from "../../Model/Poker/PokerModel";
import { ShakePokerSignal } from "../Poker/PokerPosMediator";
import PokerToucher from "./PokerToucher";

const { ccclass, property } = cc._decorator;

export class DrawCardSignal extends BaseSignal {}

export class CheckAutoRecycleSignal extends BaseSignal {}

@ccclass
export default class PokerToucherMediator extends SingleTouchMediator<PokerToucher> {
  onRegister() {
    super.onRegister();
  }
}
