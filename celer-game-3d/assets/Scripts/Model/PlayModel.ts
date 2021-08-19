import { SingleTon } from "../Common/ToSingleTon";
import { Theme } from "../GamePlay/GameRule";

export class PlayModel extends SingleTon<PlayModel>() {
  private theme: Theme = null;

  get Theme() {
    return this.theme;
  }

  getTotalScore() {
    return 0;
  }

  setTotalTime(time: number) {}

  addPauseCount() {}

  addGameTime(dt: number) {}
}
