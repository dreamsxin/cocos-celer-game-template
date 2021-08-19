import { _decorator, Component, Node } from "cc";
import { Theme } from "../../../GamePlay/GameRule";
import { GameThemeInit } from "../../../Signal/Signal";
const { ccclass, property } = _decorator;

@ccclass("ThemeView")
export class ThemeView extends Component {
  onLoad() {
    GameThemeInit.inst.addListener(this.onThemeInit, this);
  }

  start() {}

  onThemeInit(theme: Theme) {
    this.node.active = this.node.name == Theme[theme];
  }
}
