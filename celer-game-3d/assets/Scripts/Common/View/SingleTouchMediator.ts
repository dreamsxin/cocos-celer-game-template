import { _decorator, Component, Node, EventTouch } from "cc";
const { ccclass, property } = _decorator;

@ccclass("SingleTouchMediator")
export class SingleTouchMediator<T extends Component> extends Component {
  public bind(view: T) {
    this.view = view;
  }

  private view: T;
  get View(): T {
    console.assert(this.view != null, " view is null");
    return this.view;
  }

  private _touchid: number = null;

  private get touchid() {
    return this._touchid;
  }

  private set touchid(val: number) {
    this._touchid = val;
    window["OpenTouchIDlog"] &&
      console.log(this.node.name, " touchid :", this._touchid);
  }

  onRegister() {
    this.node.targetOff(this);
    this.node.onSetParent = this._onSetParent.bind(this);
    this.node.on(Node.EventType.TOUCH_CANCEL, this.touchCancel, this);
    this.node.on(Node.EventType.TOUCH_END, this.touchEnd, this);
    this.node.on(Node.EventType.TOUCH_MOVE, this.touchMove, this);
    this.node.on(Node.EventType.TOUCH_START, this.touchStart, this);
  }

  onUnregister() {
    this.node.targetOff(this);
  }

  private touchStart(event: EventTouch) {
    if (this.touchid !== null && this.touchid !== event.getID()) {
      console.log(
        this.node.name,
        " touch start  touchid is different: ",
        this.touchid,
        event.getID()
      );
      event.propagationStopped = true;
      return;
    }
    this.touchid = event.getID();

    this.onTouchStart(event);
  }

  private touchMove(event: EventTouch) {
    if (this.touchid !== null && this.touchid !== event.getID()) {
      //console.log(this.node.name, " touch move  touchid is different! ");
      event.propagationStopped = true;
      return;
    }
    this.touchid = event.getID();
    this.onTouchMove(event);
  }

  private touchEnd(event: EventTouch) {
    if (this.touchid !== null && this.touchid !== event.getID()) {
      console.log(
        this.node.name,
        " touch end  touchid is different: ",
        this.touchid,
        event.getID()
      );
      event.propagationStopped = true;
      return;
    }

    if (this.touchid == null) {
      event.propagationStopped = true;
      return;
    }

    this.touchid = null;
    this.onTouchEnd(event);
    this.OnClick();
  }

  private touchCancel(event: EventTouch) {
    if (this.touchid !== null && this.touchid !== event.getID()) {
      console.log(
        this.node.name,
        " touch cancel  touchid is different: ",
        this.touchid,
        event.getID()
      );
      event.propagationStopped = true;
      return;
    }

    if (this.touchid == null) {
      event.propagationStopped = true;
      return;
    }

    this.touchid = null;
    this.onTouchCancel(event);
  }

  protected OnClick() {}

  protected onTouchStart(event: EventTouch) {}

  protected onTouchMove(event: EventTouch) {}

  protected onTouchEnd(event: EventTouch) {}

  protected onTouchCancel(event: EventTouch) {}

  protected onSetParent(parent: Node | null, oldParent: Node | null) {}

  private _onSetParent(parent: Node | null, oldParent: Node | null) {
    if (parent == null) {
      this.touchid = null;
    }

    this.onSetParent(parent, oldParent);
  }
}
