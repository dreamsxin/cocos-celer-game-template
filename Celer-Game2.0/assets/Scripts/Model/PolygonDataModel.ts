import { SingleTon } from "../utils/ToSingleton";

export class PolygonDataModel extends SingleTon<PolygonDataModel>() {
  private polygon: { [key: string]: Array<{ x: number; y: number }> } = null;
  load(
    url: string,
    callback: (polygon: {
      [key: string]: Array<{
        x: number;
        y: number;
      }>;
    }) => void,
    progress?: (progress: number) => void
  ) {
    cc.loader.loadRes(
      url,
      (completed: number, total: number) => {
        if (progress) {
          progress(completed / total);
        }
      },
      (err: Error, json: cc.JsonAsset) => {
        if (err) {
          console.error("load polygon err:", err);
        } else {
          this.polygon = json.json;
          callback(this.polygon);
        }
      }
    );
  }

  getPoints(name: string): { x: number; y: number }[] {
    return this.polygon[name];
  }

  getData() {
    return this.polygon;
  }
}
