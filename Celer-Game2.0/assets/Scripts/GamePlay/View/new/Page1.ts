// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class Page1 extends cc.Component {
  @property(cc.Node)
  ball: cc.Node = null;

  @property(cc.Node)
  ballStart: cc.Node = null;

  @property(cc.Node)
  ballReady: cc.Node = null;

  @property(cc.Node)
  ballReady2: cc.Node = null;

  @property(cc.Node)
  ballTarget: cc.Node = null;

  @property(cc.Node)
  hand: cc.Node = null;

  @property(cc.Node)
  handStart: cc.Node = null;

  @property(cc.Node)
  handEnd: cc.Node = null;

  // LIFE-CYCLE CALLBACKS:

  onLoad() {}

  start() {}

  // update (dt) {}

  play() {
    this.ball.stopAllActions();
    this.hand.stopAllActions();
    this.hand.opacity = 255;
    this.ball.opacity = 255;
    this.ball.setPosition(this.ballStart.position);
    this.hand.setPosition(this.handStart.position);
    /*
    this.hand.runAction(
      cc.repeatForever(
        cc.sequence(
          cc.rotateBy(0.1, -10),
          cc.rotateBy(0.2, 20),
          cc.rotateBy(0.1, -10),
          cc.delayTime(0.1), // ball start to ready
          cc.fadeOut(0.1), // ball start to ready2
          cc.moveTo(0.2, this.handEnd.position),
          cc.fadeIn(0.1), // ball in ready2
          cc.rotateBy(0.1, -10),
          cc.rotateBy(0.2, 20),
          cc.rotateBy(0.1, -10),
          cc.delayTime(0.1), // ball start to target
          cc.fadeOut(0.1),
          cc.moveTo(0.2, this.handStart.position),
          cc.fadeIn(0.1)
        )
      )
    );
*/
    this.ball.runAction(
      cc.repeatForever(
        cc.sequence(
          cc.delayTime(0.05),
          cc.callFunc(() => {
            // 手点击
            this.hand.runAction(
              cc.sequence(
                cc.fadeIn(0),
                cc.moveTo(0, this.handStart.position),
                cc.rotateBy(0.1, -10),
                cc.rotateBy(0.2, 20),
                cc.rotateBy(0.1, -10),
                cc.fadeOut(0.1)
              )
            );
          }),

          cc.delayTime(0.4),
          cc.moveTo(0.1, this.ballReady.position),

          cc.callFunc(() => {
            // 手点击
            this.hand.runAction(
              cc.sequence(
                cc.fadeIn(0),
                cc.moveTo(0, this.handEnd.position),
                cc.rotateBy(0.1, -10),
                cc.rotateBy(0.2, 20),
                cc.rotateBy(0.1, -10),
                cc.fadeOut(0.1)
              )
            );
          }),
          cc.delayTime(0.6),
          cc.moveTo(0.4, this.ballReady2.position),
          cc.delayTime(0.1),
          cc.moveTo(0.1, this.ballTarget.position),
          cc.delayTime(0.4),
          cc.fadeOut(0.1),
          cc.moveTo(0.2, this.ballStart.position),
          cc.fadeIn(0.1)
        )
      )
    );
  }
}
