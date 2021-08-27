export enum Theme {
  Green,
  Blue,
  Red,
  Purple,
}

export enum ScoreType {
  PauseCost,
}

export function RandomTheme() {
  return null;
}

export function GetTotalTime() {
  return 60 * 2.5;
}

/** 免费暂停次数 */
export function GetFreePauseCount() {
  return 3;
}

export function GetScoreByType(scoreType: ScoreType) {
  let score = 0;
  switch (scoreType) {
    default:
      break;
  }

  return score * GetScoreRatio();
}

export function GetScoreRatio() {
  return 1;
}
