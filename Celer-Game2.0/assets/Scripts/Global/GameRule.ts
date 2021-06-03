import { ScoreType } from "../GamePlay/Model/GamePlayModel";
import { PlayModelProxy } from "../Model/PlayModelProxy";
import { Random } from "../Utils/Random";

export const DrawDebug = false;

export const FreePauseLimit = 3;

/** 游戏总时长 */
export function GetTotalTime() {
  return CC_DEBUG ? 60 * 1000 : 60 * 1.5;
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

export function GetTotalLevel() {
  return 2;
}

export function GetCollectCount() {
  return Random.getRandom() > 0.5 ? 4 : 5;
}

/** 得分模型 */
export class ScoreModel {
  private static lastType: string = "";

  public static GetScore(type: string, setType: boolean = false): number {
    if (this.lastType == null) {
      if (setType) {
        this.lastType = type;
      }
      return 50;
    }

    if (this.lastType == type) return 50;
    if (setType) {
      this.lastType = type;
    }
    return 60;
  }
}
