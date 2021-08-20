export enum Theme {}

export enum ScoreType {
  PauseCost,
}

export function RandomTheme() {
  return null;
}

export function GetTotalTime() {
  return 0;
}

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
