import { Theme } from "./Theme";

/** 游戏不同难度内容区分 */
export class Level {


    /** 主题随机池 */
    static getThemeRandomPool(level: number) {
        return [Theme.Number, Theme.Sweet];
    }

}