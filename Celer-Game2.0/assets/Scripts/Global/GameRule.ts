import exp from "constants";
import { ScoreType } from "../GamePlay/Model/GamePlayModel";
import { PlayModelProxy } from "../Model/PlayModelProxy";
import { Random } from "../Utils/Random";

export const DrawDebug = false;

export const FreePauseLimit = 3;

/** 游戏总时长 */
export function GetTotalTime() {
  return CC_DEBUG ? 60 * 1.5 : 60 * 1.5;
}

export function GetScoreByType(type: ScoreType) {
  switch (type) {
    case ScoreType.Clear:
      return 5;
    case ScoreType.MergeCross:
    case ScoreType.MergeLine:
    case ScoreType.MergeSquare:
      return 20;
    case ScoreType.MergeRainbow:
    case ScoreType.MergePeacok:
      return 30;
    case ScoreType.BlockAttack:
      return 2;
    case ScoreType.GoldAttack:
      return 5;
    case ScoreType.StoneAttack:
      return 3;
    case ScoreType.GoldGain:
      return 500;
    case ScoreType.PauseCost:
      return 100;
    case ScoreType.StepBonus:
      return 100;
  }
  return 0;
}

/** 得分模型
 * 初始收集任意类型物品成功+50分，接下来若是收集不同种类物品可以+60分，若是收集同种类物品则得分仍旧为50分。
 */
export class ScoreModel {
  private static lastType: string = null;

  public static GetScore(type: string, isSetType: boolean = false): number {
    if (this.lastType == null) {
      if (isSetType) {
        this.lastType = type;
      }
      return 50;
    }

    if (this.lastType == type) return 50;
    if (isSetType) {
      this.lastType = type;
    }
    return 60;
  }
}

/** 游戏总共多少轮 */
export function GetTotalLevel() {
  return 2;
}

/** 每轮收集多少种 */
export function GetTypeCount() {
  return 3;
}

/** 每个种类需要收集多少个 */
export function GetCollectCount() {
  return 5;
}

/** 每一轮需要收集几种类型 */

/** 总的点错次数限制 */
export function GetFaultCount() {
  return 5;
}

/** 得分加成 倒计时 */
export function ScoreBonusCountdown() {
  return 3;
}

/** 分数翻倍的倒计时范围 */
export function DoublePercent() {
  return 1 - 0.15;
}

/** 分数 1.5 倍 */
export function OneDa5Percent() {
  return 1 - 0.4;
}

/** 分数1.2倍 */
export function OneDa2Percent() {
  return 0;
}

/** 加速度 */
export function MapSpeedUpScale() {
  return 50 / 30;
}

/** 初始移动速度 */
export function StartSpeed() {
  return 50;
}

export function GetTotalMapHeight() {
  return (
    1920 +
    (StartSpeed() * GetTotalTime() +
      0.5 * MapSpeedUpScale() * GetTotalTime() * GetTotalTime())
  );
}
