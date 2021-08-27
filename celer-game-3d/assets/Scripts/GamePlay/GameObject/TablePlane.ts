import { _decorator, Component, Node, MeshRenderer, Material } from "cc";
import { GameThemeInit } from "../../Signal/Signal";
import { Theme } from "../GameRule";
const { ccclass, property } = _decorator;

@ccclass("TablePlane")
export class TablePlane extends Component {
  /* class member could be defined like this */
  // dummy = '';

  /* use `property` decorator if your want the member to be serializable */
  // @property
  // serializableDummy = 0;

  get MeshRenderer() {
    return this.getComponent(MeshRenderer);
  }

  @property(Material)
  Green: Material = null;

  @property(Material)
  Red: Material = null;

  @property(Material)
  Blue: Material = null;

  @property(Material)
  Purple: Material = null;

  start() {
    GameThemeInit.inst.addListener((theme: Theme) => {
      if (this[Theme[theme]]) {
        this.MeshRenderer.setMaterial(this[Theme[theme]], 0);
      }
    }, this);
  }

  // update (deltaTime: number) {
  //     // Your update function goes here.
  // }
}
