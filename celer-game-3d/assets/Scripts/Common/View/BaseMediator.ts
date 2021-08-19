import { _decorator, Component, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("BaseMediator")
export class BaseMediator<T extends Component> extends Component {
  public bind(view: T) {
    this.view = view;
  }

  private view: T;
  get View(): T {
    console.assert(this.view != null, " view is null");
    return this.view;
  }

  onRegister() {
    console.error(" should override onRegister ");
  }

  onUnregister() {
    console.error(" should override onUnregister ");
  }
}
