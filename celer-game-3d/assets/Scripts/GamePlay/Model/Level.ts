import { disOrderArray } from "../../Common/Cocos";
import { Theme } from "../GameRule";

/** 游戏不同难度内容区分 */
export class Level {
  static themePool = [];
  static GetThemeRandomPool(level: number) {
    if (this.themePool.length >= 120) {
      return this.themePool;
    }

    while (this.themePool.length < 120) {
      for (let key in Theme) {
        if (parseInt(key).toString() == "NaN") {
          this.themePool.push(Theme[key]);
        }
      }
    }
    disOrderArray(this.themePool);
    return this.themePool;
  }
}
