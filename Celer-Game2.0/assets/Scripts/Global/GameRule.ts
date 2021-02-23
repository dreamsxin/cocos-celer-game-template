import { Theme } from "./Theme";

/** 游戏总时长 */

export const DrawDebug = false;

export const FreePauseLimit = 3;

export const PauseScoreCost = 1000;

export const RecycleLastTime = 0.2;

export const Speed = 3000;

export function GetDrawCost() {
  return -20;
}

export function GetRevertCost() {
  return 0;
}

export function GetPokerFlipScore() {
  return 50;
}

export function GetPokerRecycleScore(point: number) {
  return (13 - point) * 10;
}

export function GetGameTime(difficultyLevel: number) {
  switch (difficultyLevel) {
    case 1:
      return 60 * 5;
    case 2:
      return CELER_X ? 60 * 3 : 60 * 3;
    case 3:
      return CELER_X ? 60 * 3 : 60 * 3;
    default:
      return 60 * 5;
  }
}
