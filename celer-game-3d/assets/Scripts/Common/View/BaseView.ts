import { _decorator, Component, Node, Vec3, tween, v3 } from "cc";
const { ccclass, property } = _decorator;

@ccclass("BaseView")
export class BaseView extends Component {
  onLoad() {
    this.node.setScale(Vec3.ZERO);
  }

  Show(callback?: () => void) {
    this.node.active = true;
    tween(this.node)
      .sequence(
        tween(this.node).to(0.1, { scale: v3(1, 1, 1) }),
        tween(this.node).call(() => {
          callback && callback();
        })
      )
      .start();
  }

  Hide(callback?: () => void) {
    tween(this.node)
      .sequence(
        tween(this.node).to(0.1, { scale: Vec3.ZERO }),
        tween(this.node).call(() => {
          this.node.active = false;
          callback && callback();
        })
      )
      .start();
  }

  OnClick() {}

  BindMedaitor<T extends Component>(type: { new (): T }): T {
    if (this.node.getComponent(type)) {
      console.warn(" this node already has the same component..");
      return;
    }

    let comp = this.node.addComponent(type);
    if (comp["bind"]) comp["bind"](this);
    if (comp["onRegister"]) {
      comp["onRegister"]();
    }
    return comp;
  }

  UnbindMedaitor<T extends Component>(type: { new (): T }): void {
    let comp = this.node.getComponent(type);
    if (!comp) {
      console.warn(" component already removed..");
      return;
    }

    if (comp["onUnregister"]) {
      comp["onUnregister"]();
    }
    if (comp["bind"]) comp["bind"](null);
    comp.destroy();
  }
}
