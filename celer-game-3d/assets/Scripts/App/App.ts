import { _decorator, Component, Node } from "cc";
import { InitialFacade } from "../GameLoad/InitialFacade";
import { PlayModel } from "../Model/PlayModel";
const { ccclass, property } = _decorator;

@ccclass("App")
export class App extends Component {
  /* class member could be defined like this */
  // dummy = '';

  /* use `property` decorator if your want the member to be serializable */
  // @property
  // serializableDummy = 0;

  start() {
    InitialFacade.inst.start();
  }

  update(deltaTime: number) {
    PlayModel.inst.addGameTime(-deltaTime);
  }
}
