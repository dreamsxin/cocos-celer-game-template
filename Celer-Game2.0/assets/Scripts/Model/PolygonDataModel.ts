import { SingleTon } from "../utils/ToSingleton";

export class PolygonDataModel extends SingleTon<PolygonDataModel>() {
  private polygon: { [key: string]: Array<cc.Vec2> } = null;
  load(url: string, callback: () => void) {
    cc.loader.loadRes(url, (err: Error, json: cc.JsonAsset) => {
      if (err) {
        console.error("load polygon err:", err);
      } else {
        this.polygon = json.json;
        callback();
      }
    });
  }

  getPoints(name: string): cc.Vec2[] {
    return this.polygon[name];
  }
}
