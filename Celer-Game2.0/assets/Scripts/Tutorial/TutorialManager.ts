import { HashMap } from "../Utils/HashMap";
import { SingleTon } from "../utils/ToSingleton";
import { ShowTutorialSignal } from "./TutorialView";

/**
 * 界面分类
 */
export enum LayerType {
  Main,
  Bag,
  PetInfo,
  LeaderBoard,
  Cook,
  Skin,
  Feed,
  Abilities,
  AwardAlert,
  AbilitiesDetail,
  SkinDetail,
}

/**
 * 指引类型
 */
export enum TutorialType {
  Click,
  Tip,
}

/**
 * 新手指引数据结构
 */
export interface TutorialStruct {
  /** 指引的节点 */
  node: cc.Node;
  /** 类型 */
  type: TutorialType;
  layer: LayerType;
  /** 显示tip的内容 */
  tip: string;
  /** 延迟显示 second */
  delay?: number;
  /** 是否需要遮罩 */
  needMask?: boolean;
  /** 是否定时自动跳转下一个指引 second */
  lastTime?: number;
  /**透明 */
  maskClear?: boolean;
}

export class TutorialManager extends SingleTon<TutorialManager>() {
  private tutorialMap: HashMap<LayerType, TutorialStruct[]> = new HashMap();

  /**
   * 注册指引信息
   * @param layer
   * @param tutorials
   */
  register(layer: LayerType, tutorials: TutorialStruct[]) {
    if (this.tutorialMap.has(layer)) {
      this.tutorialMap.add(
        layer,
        this.tutorialMap.get(layer).concat(tutorials)
      );
    } else {
      this.tutorialMap.add(layer, tutorials);
      this.start(layer);
    }
  }

  public getLayerNodesCount(layer: LayerType): number {
    if (this.tutorialMap.has(layer)) {
      return this.tutorialMap.get(layer).length;
    } else {
      return 0;
    }
  }

  private shift(layer: LayerType) {
    if (this.tutorialMap.has(layer) && this.tutorialMap.get(layer).length > 0) {
      return this.tutorialMap.get(layer).shift();
    } else {
      console.error(" layer:", LayerType[layer], " empty.");
      return null;
    }
  }

  private isDone(layer: LayerType) {
    return (
      this.tutorialMap.has(layer) == false ||
      this.tutorialMap.get(layer).length == 0
    );
  }

  private start(layer: LayerType) {
    ShowTutorialSignal.inst.dispatchOne(layer);
  }

  /** @friend  TutorialView */
  next(layer: LayerType) {
    return new Promise(
      (isDone: (layer: LayerType) => void, reject: () => void) => {
        this.shift(layer);
        if (this.isDone(layer)) {
          isDone(layer);
        } else {
          reject();
        }
      }
    );
  }

  /** @friend  TutorialView */
  show(layer: LayerType) {
    return new Promise(
      (goNext: (tutorial: TutorialStruct) => void, done: () => void) => {
        if (this.isDone(layer)) {
          done();
        } else {
          goNext(this.tutorialMap.get(layer)[0]);
        }
      }
    );
  }
}
