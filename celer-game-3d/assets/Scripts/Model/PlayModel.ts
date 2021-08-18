import { SingleTon } from "../Common/ToSingleTon";

export class PlayModel extends SingleTon<PlayModel>() {
  getTotalScore() {
    return 0;
  }

  setTotalTime(time: number) {}

  addPauseCount() {}

  addGameTime(dt: number) {}
}
