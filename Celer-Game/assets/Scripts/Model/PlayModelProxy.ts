import { SingleTon } from "../Utils/ToSingleton";
import { GameStateController, RoundEndType } from "../Controller/GameStateController";
import { GamePlayModel } from "../GamePlay/Model/GamePlayModel";
import { UpdateTimeNumber, TimeAnimationStateChanged } from "../Command/CommonSignal";
import { FreePauseLimit } from "../Global/GameRule";

export class PlayModelProxy extends SingleTon<PlayModelProxy>() {

    private constructor() {
        super();
        this.bindSignal();
    }


    private isGameOver: boolean = false;
    private playerModel: GamePlayModel = null;


    private get Model() {
        return this.playerModel ? this.playerModel : (this.playerModel = new GamePlayModel())
    }


    get TimeLeft() {
        return this.Model.Time;
    }

    get PlayerScore() {
        return this.Model.PlayerScore;
    }

    get NoviceScore() {
        return this.Model.NoviceScore;
    }

    get PointSpread() {
        return this.Model.ScoreSpread;
    }

    get TimeBonus() {
        return this.Model.Timebonus;
    }

    get Theme() {
        return this.Model.Theme;
    }

    get Level() {
        return this.Model.Level;
    }

    set Level(val: number) {
        this.Model.Level = val;
    }

    get PauseScore() {
        return this.Model.PauseScore;
    }

    get FreePauseCount() {
        return Math.max(0, FreePauseLimit - this.Model.PauseCount);
    }


    private bindSignal() {


    }

    /** 初始化随机主题 */
    initGametheme() {
        this.Model.initGametheme();
    }

    getTotalScore() {
        return this.Model.TotalScore;
    }

    addPauseCount() {
        this.Model.addPauseCount();
    }

    addGameTime(dt: number) {
        if (GameStateController.inst.isPause() || GameStateController.inst.isRoundStart() == false) {
            return;
        }

        if (this.isGameOver) return;

        this.Model.Time += dt;

        UpdateTimeNumber.inst.dispatchOne(this.Model.Time);
        TimeAnimationStateChanged.inst.dispatchOne(this.Model.Time <= 30);

        if (this.Model.Time <= 0) {
            GameStateController.inst.roundEnd(RoundEndType.TimeUp);
        }

    }


}