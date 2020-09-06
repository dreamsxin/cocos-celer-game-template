import BaseView from "../../../View/BaseView";
import NumberChangedView from "../../../View/NumberChangedView";
import { OpenResultLayerSignal, ShowSubmitSignal, ScoreCountingSignal } from "../../../Command/CommonSignal";
import { RoundEndType } from "../../../Controller/GameStateController";
import { ResourceController, Title } from "../../../Controller/ResourceController";
import { Time } from "../../../Utils/Time";
import { PlayModelProxy } from "../../../Model/PlayModelProxy";
import { CelerSDK } from "../../../Utils/Celer/CelerSDK";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ResultLayerView extends BaseView {


    // LIFE-CYCLE CALLBACKS:


    /** 根节点 */
    get Root() {
        return this.node.getChildByName("Root");
    }

    /** 光圈 */
    get Light() {
        return this.Root.getChildByName("Light");
    }


    /** 标题 */
    get Title() {
        return this.Root.getChildByName("Title").getComponent(cc.Sprite);
    }

    /** 总分 */
    get TotalScore() {
        return this.Root.getChildByName("TotalScore").getComponent(NumberChangedView);
    }

    /**时间加成 */
    get TimeBonus() {
        return this.Root.getChildByName("TimeBonus").getComponent(NumberChangedView);
    }

    /** spine根节点 */
    get SpineRoot() {
        return this.Root.getChildByName("Spine");
    }

    private spine: sp.Skeleton;


    /** 提交按钮 */
    get Submit() {
        return this.Root.getChildByName("Submit");
    }

    private CountTotal = 4;

    onLoad() {
        this.node.active = false;
        this.node.scale = 1;
        OpenResultLayerSignal.inst.addListenerOne(this.onGameOver, this);
    }

    onGameOver(type: RoundEndType) {

        this.Submit.scale = 0;
        this.Light.scale = 0;



        if (type == RoundEndType.TimeUp) {
            this.Title.spriteFrame = ResourceController.inst.getTitleSprite(Title.TimeUp)
        } else {
            this.Title.spriteFrame = ResourceController.inst.getTitleSprite(Title.Complete)
        }


        if (this.SpineRoot) {
            for (let child of this.SpineRoot.children) {
                if (child.active) {
                    this.spine = child.getComponent(sp.Skeleton);
                }
            }
        }

        let time = Time.timeFormat(PlayModelProxy.inst.TimeLeft);

        this.Root.scale = 0;
        this.node.active = true;
        this.Root.runAction(cc.sequence(
            cc.scaleTo(0.1, 0.9, 1.3),
            cc.scaleTo(0.1, 1.2, 0.9),
            cc.scaleTo(0.1, 1, 1),
            cc.callFunc(this.showInfo.bind(this))
        ))
    }


    private count = 0;

    private get Count() {
        return this.count;
    }

    private set Count(val: number) {
        if (this.count == val) return;

        this.count = val;
        console.log("count:", this.Count);
        if (this.Count >= this.CountTotal) {

            ShowSubmitSignal.inst.dispatch();

            this.Submit.runAction(cc.sequence(
                cc.scaleTo(0.1, 1.2),
                cc.scaleTo(0.1, 1),
                cc.callFunc(() => {

                    this.Submit.once(cc.Node.EventType.TOUCH_END, () => {

                        CelerSDK.inst.submitScore(PlayModelProxy.inst.getTotalScore());

                    }, this);

                    if (CELER_X) {
                        setTimeout(() => {
                            CelerSDK.inst.submitScore(PlayModelProxy.inst.getTotalScore());
                        }, 5000);
                    }

                })
            ))
        }
    }


    showInfo() {

        this.Count = 0;

        if (this.spine) {
            this.spine.animation = "animation";

            this.spine.setEventListener((trackEntry: any, event: any) => {
                switch (event.stringValue) {
                    case "light":

                        this.Light.runAction(cc.sequence(
                            cc.scaleTo(0.1, 3),
                            cc.callFunc(() => {
                                this.Light.runAction(cc.repeatForever(cc.rotateBy(0.1, 1)))
                            })
                        ))
                        break;

                }
            })
        }

        this.TotalScore.STEP = 150;
        this.TimeBonus.STEP = 150;

        let step = () => {
            ScoreCountingSignal.inst.dispatch();
        }

        this.TimeBonus.onStep = step;
        this.TotalScore.onStep = step;


        this.TimeBonus.onNumberChanged(PlayModelProxy.inst.TimeBonus, () => {
            this.Count++;
            console.log("TimeBonus Done")
        });

        this.TotalScore.onNumberChanged(PlayModelProxy.inst.getTotalScore(), () => {
            this.Count++;
            console.log("TotalScore Done")
        });

    }




}
