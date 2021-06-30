// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import {
  AnimationType,
  Font,
  ResourceController,
} from "../Controller/ResourceController";
import { GameRecorder } from "../GameRecorder/GameRecorder";
import { InitialFacade } from "../Initialization/Facade/InitialFacade";
import { PlayModelProxy } from "../Model/PlayModelProxy";
import { Random_ID } from "../table";
import { TableManager } from "../TableManager";
import { HashMap } from "../Utils/HashMap";
import { BaseSignal } from "../Utils/Signal";

const { ccclass, property } = cc._decorator;

export class StartBindAtlasSignal extends BaseSignal {}
@ccclass
export default class App extends cc.Component {
  @property(cc.SpriteAtlas)
  UI: cc.SpriteAtlas = null;

  @property(cc.SpriteAtlas)
  PauseUI: cc.SpriteAtlas = null;

  @property(cc.SpriteAtlas)
  ResultUI: cc.SpriteAtlas = null;

  @property(cc.SpriteAtlas)
  UIAnimation: cc.SpriteAtlas = null;

  @property(cc.SpriteAtlas)
  GamePlayAnimation: cc.SpriteAtlas = null;

  @property(cc.Font)
  Add: cc.Font = null;

  @property(cc.Font)
  Sub: cc.Font = null;

  @property(cc.Font)
  ShowScore: cc.Font = null;

  @property(cc.Font)
  TimeRed: cc.Font = null;

  @property(cc.Font)
  TimeWhite: cc.Font = null;

  @property(cc.Font)
  Result: cc.Font = null;

  @property({
    type: cc.SpriteAtlas,
    displayName: "动物类",
  })
  Animals: cc.SpriteAtlas = null;

  @property({
    type: cc.SpriteAtlas,
    displayName: "植物类",
  })
  Plants: cc.SpriteAtlas = null;

  @property({
    type: cc.SpriteAtlas,
    displayName: "建筑",
  })
  Buildings: cc.SpriteAtlas = null;

  @property({
    type: cc.SpriteAtlas,
    displayName: "书籍",
  })
  Books: cc.SpriteAtlas = null;

  @property({
    type: cc.SpriteAtlas,
    displayName: "球",
  })
  Ball: cc.SpriteAtlas = null;

  @property({
    type: cc.SpriteAtlas,
    displayName: "食物类",
  })
  Food: cc.SpriteAtlas = null;

  @property({
    type: cc.SpriteAtlas,
    displayName: "形状",
  })
  Shape: cc.SpriteAtlas = null;

  @property({
    type: cc.SpriteAtlas,
    displayName: "服装类",
  })
  Outlet: cc.SpriteAtlas = null;

  @property({
    type: cc.SpriteAtlas,
    displayName: "配饰",
  })
  Ornament: cc.SpriteAtlas = null;

  @property({
    type: cc.SpriteAtlas,
    displayName: "文具工具",
  })
  Tool: cc.SpriteAtlas = null;

  @property({
    type: cc.SpriteAtlas,
    displayName: "化妆品",
  })
  Makeup: cc.SpriteAtlas = null;

  @property({
    type: cc.SpriteAtlas,
    displayName: "水果",
  })
  Fruits: cc.SpriteAtlas = null;

  @property({
    type: cc.SpriteAtlas,
    displayName: "蔬菜",
  })
  Vegetable: cc.SpriteAtlas = null;

  @property({
    type: cc.SpriteAtlas,
    displayName: "干扰",
  })
  Other: cc.SpriteAtlas = null;

  public static TuneMatchMap: HashMap<number, cc.Node> = new HashMap();
  public static TuneRootMap: HashMap<number, cc.Node> = new HashMap();
  onLoad() {
    console.log(" app onload ");
    this.UI && ResourceController.inst.setAtlas(this.UI);
    this.PauseUI && ResourceController.inst.setPauseAtlas(this.PauseUI);
    this.ResultUI && ResourceController.inst.setResultAtlas(this.ResultUI);

    this.Result &&
      ResourceController.inst.setFont(Font.ResultScore, this.Result);
    this.Add && ResourceController.inst.setFont(Font.AddScore, this.Add);
    this.Sub && ResourceController.inst.setFont(Font.SubScore, this.Sub);
    this.ShowScore &&
      ResourceController.inst.setFont(Font.ShowScore, this.ShowScore);
    this.TimeRed && ResourceController.inst.setFont(Font.TimeRed, this.TimeRed);
    this.TimeWhite &&
      ResourceController.inst.setFont(Font.TimeWhite, this.TimeWhite);
    this.UIAnimation &&
      ResourceController.inst.pushAnimationAtlas(
        AnimationType.UI,
        this.UIAnimation
      );

    this.GamePlayAnimation &&
      ResourceController.inst.pushAnimationAtlas(
        AnimationType.GamePlay,
        this.GamePlayAnimation
      );

    cc.game.setFrameRate(60);

    cc.debug.setDisplayStats(!CELER_X);
    StartBindAtlasSignal.inst.addListener(this.bindItemAtals, this);
  }

  bindItemAtals() {
    let types = TableManager.inst.getRandom(Random_ID.SuiJiChi).Pool;
    for (let type of types) {
      let tableName = TableManager.inst.getClass(type).Table;
      if (this[tableName] && this[tableName] instanceof cc.SpriteAtlas) {
        //  console.log("bind :", tableName);
        ResourceController.inst.pushItemAtlas(type, this[tableName]);
      }
    }
  }

  start() {
    GameRecorder.inst.init();
    InitialFacade.inst.start();
  }

  update(dt: number) {
    PlayModelProxy.inst.addGameTime(-dt);
  }
}
