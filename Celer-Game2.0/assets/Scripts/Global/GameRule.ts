import { ScoreType } from "../GamePlay/Model/GamePlayModel";
import { PlayModelProxy } from "../Model/PlayModelProxy";

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
      return 500;
    case ScoreType.StepBonus:
      return 100;
  }
  return 0;
}

export function GetTotalLevel() {
  return 2;
}
