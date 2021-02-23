import { PokerType } from "./PokerModel";
import {
  DeskParents,
  ParentType,
  PokerParent,
  RecycleParents,
} from "./PokerParentModel";

export const PokerSize = cc.size(156, 212);
export const GuidePokers = [
  "diamond_,1", //3
  "spade_,1", //0
  "heart_,1", //1
  "club_,1", //2

  "spade_,2", //4
  "heart_,2", //5
  "club_,2", //6
  "club_,5", //7

  "spade_,3", //8
  "heart_,3", //9
  "club_,3", //10
  "diamond_,3", //11

  "spade_,4", //12
  "heart_,13", //13
  "club_,4", //14
  "diamond_,4", //15

  "spade_,5", //16
  "heart_,5", //17
  "diamond_,2", //18
  "spade_,6", //19

  "club_,6", //20
  "heart_,6", //21
  "diamond_,5", //22
  "diamond_,6", //23

  "heart_,7", //24
  "spade_,7", //25
  "club_,8", //26
  "diamond_,7", //27

  "spade_,8", //28
  "heart_,8", //29
  "club_,7", //30
  "diamond_,8", //31

  "spade_,9", //32
  "heart_,9", //33
  "club_,9", //34
  "diamond_,9", //35

  "spade_,10", //36
  "heart_,10", //37
  "club_,10", //38
  "diamond_,10", //39

  "spade_,11", //40
  "heart_,11", //41
  "club_,11", //42
  "diamond_,11", //43

  "spade_,12", //44
  "heart_,12", //45
  "club_,12", //46
  "diamond_,12", //47

  "spade_,13", //48
  "heart_,4", //49
  "club_,13", //50
  "diamond_,13", //51
];

export const Pokers = [
  "spade_,1", //0
  "spade_,1", //1
  "spade_,1", //2
  "spade_,1", //3
  "spade_,1", //2
  "spade_,1",

  "spade_,2", //4
  "spade_,2", //5
  "spade_,2", //6
  "spade_,2", //7
  "spade_,2", //6
  "spade_,2", //7

  "spade_,3", //8
  "spade_,3", //9
  "spade_,3", //10
  "spade_,3", //11
  "spade_,3", //10
  "spade_,3", //1

  "spade_,4",
  "spade_,4",
  "spade_,4",
  "spade_,4",
  "spade_,4",
  "spade_,4",

  "spade_,5",
  "spade_,5",
  "spade_,5",
  "spade_,5",
  "spade_,5",
  "spade_,5",

  "spade_,6",
  "spade_,6",
  "spade_,6",
  "spade_,6",
  "spade_,6",
  "spade_,6",

  "spade_,7",
  "spade_,7",
  "spade_,7",
  "spade_,7",
  "spade_,7",
  "spade_,7",

  "spade_,8",
  "spade_,8",
  "spade_,8",
  "spade_,8",
  "spade_,8",
  "spade_,8",

  "spade_,9",
  "spade_,9",
  "spade_,9",
  "spade_,9",
  "spade_,9",
  "spade_,9",

  "spade_,10",
  "spade_,10",
  "spade_,10",
  "spade_,10",
  "spade_,10",
  "spade_,10",

  "spade_,11",
  "spade_,11",
  "spade_,11",
  "spade_,11",
  "spade_,11",
  "spade_,11",

  "spade_,12",
  "spade_,12",
  "spade_,12",
  "spade_,12",
  "spade_,12",
  "spade_,12",

  "spade_,13",
  "spade_,13",
  "spade_,13",
  "spade_,13",
  "spade_,13",
  "spade_,13",
];

export function GetPokerString(pokerType: PokerType, point: number) {
  let typeStr = "";
  let pointStr = point.toString();

  switch (pokerType) {
    case PokerType.Club:
      typeStr = "club_,";
      break;
    case PokerType.Diamond:
      typeStr = "diamond_,";
      break;
    case PokerType.Heart:
      typeStr = "heart_,";
      break;
    case PokerType.Spade:
      typeStr = "spade_,";
      break;
  }

  return typeStr + pointStr;
}

export enum PokerColor {
  Red,
  Black,
}

const checkIndexes = [0, 7, 13, 18, 22, 25, 27];
const stackCheckIndexes = [49, 46, 43, 40, 37, 34, 31, 28];

export function GetParentType(parent: PokerParent) {
  if (DeskParents.indexOf(parent) >= 0) {
    return ParentType.Desk;
  }

  if (RecycleParents.indexOf(parent) >= 0) {
    return ParentType.Recycle;
  }

  if (parent == PokerParent.Draw) return ParentType.Draw;

  if (parent == PokerParent.Ready) return ParentType.Ready;

  if (parent == PokerParent.Removed) return ParentType.Removed;
}

export function getType(pokerInfo: string) {
  let type = pokerInfo.split(",")[0];

  switch (type) {
    case "spade_":
      return PokerType.Spade;

    case "club_":
      return PokerType.Club;

    case "heart_":
      return PokerType.Heart;

    case "diamond_":
      return PokerType.Diamond;
  }
}

export function getColor(pokerInfo: string) {
  let type = pokerInfo.split(",")[0];
  let pokerColer =
    type == "spade_" || type == "club_" ? PokerColor.Black : PokerColor.Red;
  return pokerColer;
}

export function getColorByType(pokerType: PokerType) {
  let color =
    pokerType == PokerType.Club || pokerType == PokerType.Spade
      ? PokerColor.Black
      : PokerColor.Red;
  return color;
}

export function checkCanMove(
  val1: number,
  val2: number,
  color1: PokerColor,
  color2: PokerColor
): boolean {
  if (val1 == 1 || val2 == 1) return true;

  return val1 - val2 == 1 && color1 != color2;
}

export function checkIsNotZeroScore(pokers: string[]): boolean {
  return true;
  let isDeskCanMove = false;
  let isStackCanMove = false;

  // check desk
  for (let i = 0; i < checkIndexes.length; ++i) {
    let indexi = checkIndexes[i];
    let pokerInfoi = pokers[indexi];
    let pokerVali = parseInt(pokerInfoi.split(",")[1]);
    let pokerColori = getColor(pokerInfoi.split(",")[0]);

    for (let j = i + 1; j < checkIndexes.length; ++j) {
      let indexj = checkIndexes[j];
      let pokerInfoj = pokers[indexj];
      let pokerValj = parseInt(pokerInfoj.split(",")[1]);
      let pokerColorj = getColor(pokerInfoj.split(",")[0]);
      if (
        checkCanMove(pokerVali, pokerValj, pokerColori, pokerColorj) ||
        checkCanMove(pokerValj, pokerVali, pokerColori, pokerColorj)
      ) {
        isDeskCanMove = true;
        break;
      }
    }
  }

  // checkstack
  for (let i = 0; i < checkIndexes.length; ++i) {
    let indexi = checkIndexes[i];
    let pokerInfoi = pokers[indexi];
    let pokerVali = parseInt(pokerInfoi.split(",")[1]);
    let pokerColori = getColor(pokerInfoi.split(",")[0]);

    for (let j = 0; j < stackCheckIndexes.length; ++j) {
      let indexj = stackCheckIndexes[j];
      let pokerInfoj = pokers[indexj];
      let pokerValj = parseInt(pokerInfoj.split(",")[1]);
      let pokerColorj = getColor(pokerInfoj.split(",")[0]);
      if (checkCanMove(pokerVali, pokerValj, pokerColori, pokerColorj)) {
        isStackCanMove = true;
        break;
      }
    }
  }
  return isDeskCanMove || isStackCanMove;
}
