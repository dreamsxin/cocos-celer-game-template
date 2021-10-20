export enum Direction {
  AntiClockWise,
  ClockWise,
}

export const SliceRange = [0, 1, 2, 3, 4, 5];

export class SliceModel {
  private static objCount = 0;
  private direction: Direction = null;
  private start: number = 0;
  private length: number = 0;
  private id: string = "";
  constructor(direction: Direction, start: number, lenght: number) {
    this.id =
      SliceModel.objCount++ +
      ":" +
      Direction[direction] +
      "-Lenght:" +
      lenght +
      "-Start:" +
      start;
    this.id = this.id;
    this.direction = this.direction;
    this.start = start;
    this.length = lenght;
  }

  get ID() {
    return this.id;
  }

  get Length() {
    return this.length;
  }

  get Start() {
    return this.start;
  }

  get Direction() {
    return this.direction;
  }
}
