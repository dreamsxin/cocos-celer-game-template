import { MinPotentialPacker } from "../../AlgorithmUtils/MinimumPotentialLayout/MinPotentialPacker";
import { StartBindAtlasSignal } from "../../App/App";
import { GameLogic } from "../../GamePlay/Model/GameLogic";
import {
  CountPerLevelFloor,
  GetCollectCount,
  GetTotalLevel,
  GetTypeCount,
} from "../../Global/GameRule";
import { PolygonDataModel } from "../../Model/PolygonDataModel";
import { Animals, Class_ID, Random_ID, Random_Pool } from "../../table";
import { TableManager } from "../../TableManager";
import { CelerSDK } from "../../Utils/Celer/CelerSDK";
import { disOrderArray } from "../../Utils/Cocos";
import {
  InitialFacade,
  UpdateInitLoadingSignal,
} from "../Facade/InitialFacade";

export class LoadJsonCommand extends puremvc.SimpleCommand {
  public static STEP: string = "LoadJson";
  private percent1: number = 0;
  private percent2: number = 0;
  private percent3: number = 0;
  private percent4: number = 0;
  execute(notification: puremvc.INotification) {
    this.count = 0;
    this.notification = notification;
    TableManager.inst.startLoad(
      "/json",
      () => {
        StartBindAtlasSignal.inst.dispatch();
        CelerSDK.inst.defineLan();
        this.addCount();
      },
      (progress: number) => {
        // CC_DEBUG && console.log("GameData:", progress);
        UpdateInitLoadingSignal.inst.dispatchOne(
          (1 / this.Total / InitialFacade.TOTAL_STEPS.length) *
            (progress - this.percent1)
        );
        this.percent1 = progress;
      }
    );

    PolygonDataModel.inst.load(
      "/polygonData/polygon",
      (data) => {
        this.addCount();
      },
      (progress: number) => {
        // CC_DEBUG && console.log("PolygonData:", progress);
        UpdateInitLoadingSignal.inst.dispatchOne(
          (1 / this.Total / InitialFacade.TOTAL_STEPS.length) *
            (progress - this.percent2)
        );
        this.percent2 = progress;
      }
    );
  }

  private count = 0;
  private Total = 2;
  private notification: puremvc.INotification;
  private addCount() {
    let body = this.notification.getBody<InitialFacade>();

    this.count++;
    if (this.notification && this.count >= this.Total) {
      GameLogic.inst.initData();
      let polygonData = PolygonDataModel.inst.getData();

      /** 解集合 */
      let polygonsNeed: {
        key: string;
        points: Array<{ x: number; y: number }>;
        type: Random_ID;
        subType: Random_Pool;
      }[][] = [];

      /** 全部集合 */
      let polygons: {
        [key: string]: {
          points: Array<{ x: number; y: number }>;
          type: Random_ID;
          subType: Random_Pool;
        };
      } = {};

      let allTypes = TableManager.inst.getRandom(Random_ID.SuiJiChi).Pool;
      for (let type of allTypes) {
        let table = TableManager.inst.getClass(type).Table;
        if (TableManager.inst["getAll_" + table + "_Data"]) {
          let allData = TableManager.inst["getAll_" + table + "_Data"]() as {
            [key: string]: Animals;
          };
          for (let subType in allData) {
            let data = allData[subType];
            for (let icon of data.Icons) {
              let key = icon.split(".")[0];
              polygons[key] = {
                points: polygonData[key],
                type: data.Type,
                subType: data.ID,
              };
            }
          }
        }
      }

      /** 总共几轮 */
      let TotalLevel = GetTotalLevel();

      for (let level = 0; level < TotalLevel; level++) {
        polygonsNeed[level] = [];

        for (let typeIndex = 0; GameLogic.inst.Types[typeIndex]; typeIndex++) {
          let type = GameLogic.inst.Types[typeIndex];

          let spNames = [];
          let tableName = TableManager.inst.getClass(type.Type).Table;

          if (TableManager.inst["get" + tableName]) {
            spNames = (
              TableManager.inst["get" + tableName](type.SubType) as Animals
            ).Icons.concat();
            let sps = [];
            disOrderArray(spNames);
            while (sps.length < CountPerLevelFloor) {
              sps.push(spNames.pop());
              if (spNames.length <= 0) {
                spNames = (
                  TableManager.inst["get" + tableName](type.SubType) as Animals
                ).Icons.concat();
                disOrderArray(spNames);
              }
            }

            for (let sp of sps) {
              let key = sp.split(".")[0];
              polygonsNeed[level].push({
                key: key,
                points: polygonData[key],
                type: type.Type,
                subType: type.SubType,
              });
            }
          }
        }
      }

      if (CC_DEBUG) {
        console.log(polygonsNeed);
      }
      body.startStep("ITEMS");
      MinPotentialPacker.inst.init(
        1080,
        polygons,
        polygonsNeed,
        (percent: number) => {
          // CC_DEBUG && console.log("PolygonLayout:", percent);
          UpdateInitLoadingSignal.inst.dispatchOne(
            (1 / InitialFacade.TOTAL_STEPS.length) * (percent - this.percent3)
          );
          this.percent3 = percent;
        },
        () => {
          body.startStep("POLYGON");
          GameLogic.inst.initItemModel(
            (percent: number) => {
              // CC_DEBUG && console.log("Item:", percent);
              UpdateInitLoadingSignal.inst.dispatchOne(
                (1 / InitialFacade.TOTAL_STEPS.length) *
                  (percent - this.percent4)
              );
              this.percent4 = percent;
            },
            () => {
              body.step("POLYGON");
            }
          );

          if (body && body.step) {
            body.step("ITEMS");
          }
        }
      );

      if (body && body.step) {
        body.step(LoadJsonCommand.STEP);
      }
    }
  }
}
