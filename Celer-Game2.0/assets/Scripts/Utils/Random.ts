import { BaseSignal } from "./Signal";

export class RandomSeedInitSignal extends BaseSignal {}
export class Random {
  private static randomSeed: number = Math.random();
  private static sharedSeed: number = Math.random();

  private static seededRandom(seed: number, min: number, max: number): number {
    let seed1 = (1711 * seed + 88888) % 302654;
    let seed2 = (1722 * seed + 55555) % 302665;
    let seed3 = (1755 * seed + 23333) % 302766;

    let rand =
      (((seed1 / 302654 + seed2 / 302665 + seed3 / 302766) * 1000000) %
        1000000) /
      1000000;
    return min + rand * (max - min);
  }

  public static getRandom(min: number = 0, max: number = 1) {
    let seed = this.randomSeed;

    let result = this.seededRandom(seed, min, max);
    let step = Math.floor(this.seededRandom(seed, 1, 302766));
    this.randomSeed += step;
    return result;
  }

  public static setRandomSeed(seed: number) {
    console.log(" set random seed:", seed);
    this.randomSeed = seed;
    this.sharedSeed = seed;
    RandomSeedInitSignal.inst.dispatchOne(seed);
  }

  public static randomRoundToInt(min: number = 0, max: number = 1) {
    return Math.round(this.getRandom(min, max));
  }

  public static randomFloorToInt(min: number = 0, max: number = 1) {
    return Math.floor(this.getRandom(min, max));
  }

  public static randomCeilToInt(min: number = 0, max: number = 1) {
    return Math.ceil(this.getRandom(min, max));
  }

  public static clamp(val: number, min: number, max: number) {
    return Math.max(min, Math.min(val, max));
  }
}
