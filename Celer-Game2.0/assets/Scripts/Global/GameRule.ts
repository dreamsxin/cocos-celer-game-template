import { Theme } from "./Theme";

/** 游戏总时长 */
export const TotalTime = CC_DEBUG ? 60 * 5 : 60 * 5;

export const DrawDebug = false;

export const FreePauseLimit = 3;

export const PauseScoreCost = 1000;

export const SortScore = 100;
export const SortScoreStep = 10;

export const ReadyOffset = 45;

export const BallOffsetY = {
  [Theme.Blue]: 87.24,
  [Theme.Red]: 87.086,
  [Theme.Green]: 80,
};

export const BallStartOffsetY = {
  [Theme.Blue]: 0,
  [Theme.Red]: 10,
  [Theme.Green]: 0,
};
export function GetBallPos(sortIndex: number, theme: Theme) {
  return cc.v2(
    0,
    (sortIndex - 1) * BallOffsetY[theme] + BallStartOffsetY[theme]
  );
}

export function GetBallReadyPos(theme: Theme) {
  return cc.v2(
    0,
    3 * BallOffsetY[theme] + BallStartOffsetY[theme] + ReadyOffset
  );
}
