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
  EmployState,
  Grid,
  GridEmployStateChangedSignal,
  RemoveGridSignal,
} from "../Controller/PolygonPacker";
import { gFactory } from "../Factory/GameFactory";
import PrefabBaseView from "../GamePlay/View/Game/PrefabBaseView";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GridView extends PrefabBaseView<Grid> {
  onReuse() {}

  onUnuse() {
    this.model = null;
    this.node.color = cc.Color.WHITE;
  }

  onLoad() {
    GridEmployStateChangedSignal.inst.addListenerOne((grid: Grid) => {
      if (this.model && this.model.ID == grid.ID) {
        switch (this.model.State) {
          case EmployState.Abandoned:
            this.node.color = cc.Color.ORANGE;
            break;
          case EmployState.Free:
            this.node.color = cc.Color.WHITE;
            break;
          case EmployState.Employed:
            this.node.color = cc.Color.YELLOW;
            break;
        }
      }
    }, this);

    RemoveGridSignal.inst.addListenerOne((grid: Grid) => {
      if (this.model && this.model.ID == grid.ID) {
        gFactory.putObj("Grid", this.node);
      }
    }, this);
  }
}
