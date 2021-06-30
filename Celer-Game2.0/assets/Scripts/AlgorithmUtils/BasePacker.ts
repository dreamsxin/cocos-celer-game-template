import { HashMap } from "../Utils/HashMap";
import { Random } from "../Utils/Random";
import { BaseSignal } from "../Utils/Signal";
import { SingleTon } from "../utils/ToSingleton";
import { GeometryPolygon } from "./GeometryPolygon/GeometryPolygon";
export class UpdatePanelHeightSignal extends BaseSignal {}
export class PolygonPackDoneSignal extends BaseSignal {}

export interface IPacker {
  Area: number;
}
export class BasePacker extends SingleTon<BasePacker>() {
  protected width: number = 0;
  protected height: number = 0;
  protected indexMap: HashMap<string, number> = new HashMap();
  DebugNode: any;

  get TotalArea() {
    return this.height * this.width;
  }

  private _polygonsSort: any[] = [];

  private _currentPack: any[] = [];

  protected _polygonData = {};
  private _idcount: number = 0;
  init<T extends IPacker>(
    width: number,
    polygons: { [key: number]: Array<{ x: number; y: number }> }
  ) {
    this.width = width;
    this.height = 0;
    this._polygonData = polygons;
    this.setPolygons();
    this.pack();
  }

  protected setPolygons(sp: string = "") {
    if (sp != "" && this._polygonsSort.length > 0) {
      let ID = sp + ":" + this._idcount++;
      let polygon = new GeometryPolygon(this._polygonData[sp], ID);
      polygon.expend(10);
      polygon.rotateTo(Random.randomFloorToInt(0, 360));
      this._polygonsSort.push(polygon);
      this._polygonsSort.sort((a: GeometryPolygon, b: GeometryPolygon) => {
        return a.Area - b.Area;
      });
      return;
    }

    if (this._polygonsSort.length <= 0) {
      for (let sp in this._polygonData) {
        let ID = sp + ":" + this._idcount++;

        let polygon = new GeometryPolygon(this._polygonData[sp], ID);
        polygon.expend(10);
        polygon.rotateTo(Random.randomFloorToInt(0, 360));
        this._polygonsSort.push(polygon);
      }

      this._polygonsSort.sort((a: GeometryPolygon, b: GeometryPolygon) => {
        return a.Area - b.Area;
      });
    }
  }

  polygons<T>(): T[] {
    return this._polygonsSort;
  }

  packeds<T>(): T[] {
    return this._currentPack;
  }

  addPack<T>(polygon: T) {
    this._currentPack.push(polygon);
  }

  protected pack() {
    console.error("should override this method.");
  }

  protected done() {
    PolygonPackDoneSignal.inst.dispatchOne(this._currentPack);
    UpdatePanelHeightSignal.inst.dispatchOne(this.height);
  }

  startPack(height: number = 1920 * 1.5) {
    console.error("should override this method.");
  }
}
