import { _decorator, Component, Node } from "cc";
import { BaseView } from "../Common/View/BaseView";
const { ccclass, property } = _decorator;

@ccclass("TestSprite")
export class TestSprite extends BaseView {
  /* class member could be defined like this */
  // dummy = '';

  /* use `property` decorator if your want the member to be serializable */
  // @property
  // serializableDummy = 0;

  start() {
    // Your initialization goes here.
  }

  // update (deltaTime: number) {
  //     // Your update function goes here.
  // }
}
