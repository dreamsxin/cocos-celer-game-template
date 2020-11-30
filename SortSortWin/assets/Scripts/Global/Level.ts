import { disOrderArray } from "../Utils/Cocos";
import { Theme } from "./Theme";

/** 游戏不同难度内容区分 */
export class Level {
  static pool = [];
  /** 主题随机池 */
  static getThemeRandomPool(level: number) {
    while (this.pool.length < 120) {
      this.pool.push(Theme.Blue);
      this.pool.push(Theme.Green);
      this.pool.push(Theme.Red);
    }
    disOrderArray(this.pool);
    return this.pool;
  }
}
