// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { Font, ResourceController } from "../Controller/ResourceController";
import { InitialFacade } from "../Initialization/Facade/InitialFacade";
import { PlayModelProxy } from "../Model/PlayModelProxy";
import { HashMap } from "../Utils/HashMap";

const { ccclass, property } = cc._decorator;

@ccclass
export default class App extends cc.Component {
  @property(cc.SpriteAtlas)
  UI: cc.SpriteAtlas = null;
  @property(cc.SpriteAtlas)
  Animation: cc.SpriteAtlas = null;
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

  public static TuneMatchMap: HashMap<number, cc.Node> = new HashMap();
  public static TuneRootMap: HashMap<number, cc.Node> = new HashMap();
  onLoad() {
    console.log(" app onload ");
    this.UI && ResourceController.inst.setAtlas(this.UI);
    this.Animation && ResourceController.inst.setAnimationAtlas(this.Animation);

    this.Result &&
      ResourceController.inst.setFont(Font.ResultScore, this.Result);
    this.Add && ResourceController.inst.setFont(Font.AddScore, this.Add);
    this.Sub && ResourceController.inst.setFont(Font.SubScore, this.Sub);
    this.ShowScore &&
      ResourceController.inst.setFont(Font.ShowScore, this.ShowScore);
    this.TimeRed && ResourceController.inst.setFont(Font.TimeRed, this.TimeRed);
    this.TimeWhite &&
      ResourceController.inst.setFont(Font.TimeWhite, this.TimeWhite);
  }

  start() {
    InitialFacade.inst.start();
  }

  update(dt: number) {
    PlayModelProxy.inst.addGameTime(-dt);
  }
}
