import { _decorator, Component, Node, Label } from "cc";
import { GameStartSignal } from "../Signal/Signal";
const { ccclass, property } = _decorator;

@ccclass("VersionLabel")
export class VersionLabel extends Component {
  /* class member could be defined like this */
  // dummy = '';

  /* use `property` decorator if your want the member to be serializable */
  // @property
  // serializableDummy = 0;

  start() {
    if (CC_DEBUG) {
      window["DEBUG_VERSION"] = "test 6.0.0";
    }
    GameStartSignal.inst.addListener(() => {
      this.getComponent(Label).string =
        window["GAME_VERSION"] &&
        window["GAME_VERSION"].split("version") &&
        window["GAME_VERSION"].split("version")[1]
          ? window["GAME_VERSION"].split("version")[1].replace(":", "")
          : window["DEBUG_VERSION"];
    }, this);
  }

  // update (deltaTime: number) {
  //     // Your update function goes here.
  // }
}
