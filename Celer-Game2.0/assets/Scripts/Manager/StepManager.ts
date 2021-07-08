export class StepManager {
  private completeCallback: Function;
  private totalStep: string[] = [];
  private curStep: string[] = [];
  private loadTime = {};

  register(complete: Function, totalSteps: string[]) {
    this.completeCallback = complete;
    this.totalStep = totalSteps;
    for (let key of totalSteps) {
      this.loadTime[key] = Date.now();
    }
  }

  start(step: string) {
    this.loadTime[step] = Date.now();
  }

  nextStep(step: string) {
    if (this.totalStep.indexOf(step) < 0) {
      console.error(" 没有这一步：", step);
      return;
    }

    if (this.curStep.indexOf(step) >= 0) {
      console.warn(" 步骤已完成：", step);
      return;
    }

    this.curStep.push(step);

    this.curStep.sort((a, b) => {
      return a > b ? -1 : 1;
    });
    this.totalStep.sort((a, b) => {
      return a > b ? -1 : 1;
    });

    let now = this.curStep.join("-");
    let total = this.totalStep.join("-");

    let costTime = Date.now() - this.loadTime[step];

    console.log(
      " cur step:",
      step,

      ", cost time:",
      costTime,
      " ms"
    );

    if (now == total) {
      console.log(" step done");
      this.totalStep.length = 0;
      this.completeCallback();
      this.completeCallback = null;
    }
  }
}
