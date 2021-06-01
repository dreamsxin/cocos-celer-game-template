import { Approx } from "../Utils/Cocos";
import { Random } from "../Utils/Random";

/**
 * 需要的极值类型
 */
export enum AnnealType {
  Min,
  Max,
}

export interface IAnnealing {
  getAnnealingValue(x: number): number;
}

/**
 * 退火算法模型, 一维解
 */
export class Annealing<T extends IAnnealing> {
  private model: T;
  /** 求解的极值类型 */
  private type: AnnealType;
  /** 总的外层循环次数 */
  private totalOutLoop: number = 200;
  /** 每一个温度的内层循环次数 */
  private totalInnerLoop: number = 500;
  /** 结束迭代的温度 */
  private minTemperate: number = 0.0001;
  /** 最大最优解连续没有变化次数 */
  private maxStableCount: number = 30;
  private stableCount: number = 0;
  /** x取值返回 */
  private xRange = { min: 0, max: 0 };
  /** 第一个解 */
  private x0: number = 0;
  /** 第二个解 */
  private x1: number = 0;
  private y0: number = 0;
  private y1: number = 0;
  /** 当前外层迭代次数 */
  private t: number = 0;

  /** 初始基础随机步长 */
  private startD: number = 100;

  /** 获取当前温度 */
  get Temperate() {
    return Math.pow(0.95, this.t) * 100;
  }

  /** 获取基础步长 */
  get BaseStep() {
    return (this.Temperate / 100) * this.startD;
  }

  get Step() {
    return (
      (1 - this.t / this.totalOutLoop) *
      Math.abs(this.xRange.max - this.xRange.min)
    );
  }

  /** 获取接受新解的概率 */
  get AcceptRate() {
    return Math.pow(
      Math.E,
      -Math.abs(this.f(this.x1) - this.f(this.x0)) / this.Temperate
    );
  }

  f(x: number) {
    return this.model.getAnnealingValue(x);
  }

  /**
   * 是否结束迭代
   * 1. 达到最大迭代次数
   * 2.温度小于0.0001
   * 3.连续30次没有最优解变化
   */
  get isEndLoop() {
    return (
      this.t >= this.totalOutLoop ||
      this.Temperate <= this.minTemperate ||
      this.stableCount >= this.maxStableCount
    );
  }

  /**
   *
   * @param type 极值类型
   * @param outLoopCount 外层最大迭代次数
   * @param innerLoopCount 每一个单位温度最大迭代次数
   * @param model 模型
   * @param xRange x取值范围
   * @param minTemperate 最小温度限制
   * @param maxStableCount 最优解稳定次数限制
   * @param dStart 初始步长
   */
  constructor(
    type: AnnealType,

    outLoopCount: number,
    innerLoopCount: number,
    model: T,
    xRange: { min: number; max: number },
    minTemperate: number = 0.0001,
    maxStableCount: number = 30,
    dStart: number = 100
  ) {
    this.type = type;

    this.totalInnerLoop = innerLoopCount;
    this.totalOutLoop = outLoopCount;
    this.model = model;
    this.xRange.min = xRange.min;
    this.xRange.max = xRange.max;
    this.minTemperate = minTemperate;
    this.maxStableCount = maxStableCount;
    this.startD = dStart;
  }

  /** 开始求解 */
  loop(): number {
    this.t = 0;
    this.stableCount = 0;
    /** 1. 随机一个初始解 */
    this.x0 = Random.getRandom(this.xRange.min, this.xRange.max);

    while (true) {
      let innerCount = 0;

      while (innerCount++ <= this.totalInnerLoop) {
        this.y0 = this.f(this.x0);
        /** 2. 在x0 附近找一个解 */
        let direction = Random.getRandom() > 0.5 ? 1 : -1;
        let step = Random.getRandom() * this.Step + this.BaseStep;
        if (direction > 0) {
          step = step % Math.max(Math.floor(this.xRange.max - this.x0), 1);
        } else {
          step = step % Math.max(Math.floor(this.x0 - this.xRange.min), 1);
        }
        step *= direction;
        this.x1 = this.x0 + step;
        this.y1 = this.f(this.x1);

        if (CC_DEBUG) {
          if (this.x1 == NaN) {
            console.error(direction, step);
          }
        }

        if (Approx(this.y0, this.y1)) {
          this.stableCount++;
        } else {
          this.stableCount = 0;
          if (this.type == AnnealType.Max) {
            // 取最大值
            if (this.y1 > this.y0) {
              this.x0 = this.x1;
            } else {
              let p = Random.getRandom();
              if (p <= this.AcceptRate) {
                this.x0 = this.x1;
              }
            }
          } else {
            // 取最小值
            if (this.y1 < this.y0) {
              this.x0 = this.x1;
            } else {
              let p = Random.getRandom();
              if (p <= this.AcceptRate) {
                this.x0 = this.x1;
              }
            }
          }
        }

        if (this.stableCount >= this.maxStableCount) {
          break;
        }
      }
      this.t++;
      if (this.isEndLoop) {
        break;
      }
    }
    // console.log(
    //   "temperate:",
    //   this.Temperate,
    //   ", t:",
    //   this.t,
    //   ", stable:",
    //   this.stableCount,
    //   ",acceptrate:",
    //   this.AcceptRate,
    //   Math.abs(this.f(this.x1) - this.f(this.x0)) / this.Temperate,
    //   this.f(this.x1) - this.f(this.x0),
    //   ", answer value:",
    //   this.f(this.x0),
    //   ", test:",
    //   this.f(this.x0 + 180)
    // );
    return this.x0;
  }
}
