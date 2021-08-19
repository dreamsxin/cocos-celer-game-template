import { _decorator, Component, Node, RichText, Label } from "cc";
import { ShowHelpLayerSignal } from "../../../Signal/Signal";
import { En_ID, En_View } from "../../../table";
const { ccclass, property } = _decorator;

@ccclass("HelpTextView")
export class HelpTextView extends Component {
  get richText() {
    return this.getComponent(RichText);
  }

  get text() {
    return this.getComponent(Label);
  }

  onLoad() {
    ShowHelpLayerSignal.inst.addListener(this.renderText, this);
  }

  private rendered: boolean = false;
  renderText() {
    if (this.rendered) return;
    this.rendered = true;

    if (this.text) {
      this.text.string = lan.t(
        En_View.BangZhuJieMian,
        En_ID.BangZhuYeMian1 + parseInt(this.node.name)
      );
    } else if (this.richText) {
      this.richText.string = lan.t(
        En_View.BangZhuJieMian,
        En_ID.BangZhuYeMian1 + parseInt(this.node.name)
      );
    }
  }
}
