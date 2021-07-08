import { Random_ID, Random_Pool } from "../table";
import { disOrderArray } from "../Utils/Cocos";
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

  DebugNode: any;

  get TotalArea() {
    return this.height * this.width;
  }

  private _polygonsSort: any[] = [];

  private _polygonsSortNeed: any[] = [];

  private _currentPack: any[] = [];

  protected _polygonData: {
    [key: string]: {
      points: Array<{ x: number; y: number }>;
      type: Random_ID;
      subType: Random_Pool;
    };
  } = {};
  protected _polygonDataNeed: {
    key: string;
    points: Array<{ x: number; y: number }>;
    type: Random_ID;
    subType: Random_Pool;
  }[][] = [];
  private _idcount: number = 0;
  protected _progressCallback: Function;
  protected _completeCallback: Function;
  init<T extends IPacker>(
    width: number,
    polygons: {
      [key: string]: {
        points: Array<{ x: number; y: number }>;
        type: Random_ID;
        subType: Random_Pool;
      };
    },
    polygonsNeed: {
      key: string;
      points: Array<{ x: number; y: number }>;
      type: Random_ID;
      subType: Random_Pool;
    }[][],
    progress?: (progress: number) => void,
    complete?: () => void
  ) {
    this.width = width;
    this.height = 0;
    this._polygonData = polygons;
    this._polygonDataNeed = polygonsNeed;

    for (let level = 0; level < this._polygonDataNeed.length; level++) {
      let data: {
        key: string;
        points: Array<{ x: number; y: number }>;
        type: Random_ID;
        subType: Random_Pool;
      }[] = this._polygonDataNeed[level];
      this._polygonsSortNeed[level] = [];
      for (let poly of data) {
        let ID = poly.key + ":" + this._idcount++;
        let polygon = new GeometryPolygon(
          poly.points,
          ID,
          poly.type,
          poly.subType
        );
        polygon.expend(10);
        polygon.rotateTo(Random.randomFloorToInt(0, 360));
        this._polygonsSortNeed[level].push(polygon);
      }
      disOrderArray(this._polygonsSortNeed[level]);
      // this._polygonsSortNeed[level].sort(
      //   (a: GeometryPolygon, b: GeometryPolygon) => {
      //     return a.Area - b.Area;
      //   }
      // );
    }

    this._progressCallback = progress;
    this._completeCallback = complete;
    this.setPolygons();
    this.pack();
  }

  protected setPolygons(sp: string = "") {
    if (sp != "" && this._polygonsSort.length > 0) {
      let data = this._polygonData[sp];
      let ID = sp + ":" + this._idcount++;
      let polygon = new GeometryPolygon(
        data.points,
        ID,
        data.type,
        data.subType
      );
      polygon.expend(10);
      polygon.rotateTo(Random.randomFloorToInt(0, 360));
      this._polygonsSort.push(polygon);
      this._polygonsSort.sort((a: GeometryPolygon, b: GeometryPolygon) => {
        return a.Area - b.Area;
      });
      return;
    }

    if (this._polygonsSort.length <= 0) {
      console.log(" setPolygons .");
      for (let sp in this._polygonData) {
        let ID = sp + ":" + this._idcount++;
        let data = this._polygonData[sp];

        let polygon = new GeometryPolygon(
          data.points,
          ID,
          data.type,
          data.subType
        );
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

  polygonsNeed(): GeometryPolygon[][] {
    return this._polygonsSortNeed;
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
