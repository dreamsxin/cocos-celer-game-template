import { _decorator, Component, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("PrefabView")
export class PrefabView<T> extends Component {
  protected model: T = null;

  onLoad() {}

  reuse(model: T) {
    this.model = model;

    this.onReuse();
  }

  unuse() {
    if (this.model) {
    }
    this.model = null;
    this.onUnuse();
  }

  protected onReuse() {
    console.warn(" should override onReuse.");
  }

  protected onUnuse() {
    console.warn(" should override onUnuse.");
  }
}
