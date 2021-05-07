const { ccclass, property } = cc._decorator;

@ccclass
export default class PrefabBaseView<T> extends cc.Component {
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
