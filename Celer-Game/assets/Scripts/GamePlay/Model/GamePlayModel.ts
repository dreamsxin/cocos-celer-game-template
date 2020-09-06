import { Theme } from "../../Global/Theme";
import { TotalTime, FreePauseLimit, PauseScoreCost } from "../../Global/GameRule";
import { GameThemeInit, PlayerScoreChanged, NoviceScoreChanged } from "../../Command/CommonSignal";
import { Level } from "../../Global/Level";
import { Random } from "../../Utils/Random";

export class GamePlayModel {

    constructor() {

        this.init();
    }


    private theme: Theme;
    private level: number = 0;
    private playerScore: number = 0;
    private noviceScore: number = 0;
    private gameTime: number = TotalTime;
    private pauseCount: number = 0;
    private pauseScore: number = 0;



    private init() {

    }


    get Time() {
        return this.gameTime;
    }

    set Time(val: number) {
        this.gameTime = val;
        this.gameTime = Math.max(0, this.gameTime);
    }

    get Theme() {
        return this.theme;
    }

    set Theme(val: Theme) {
        console.log("set game theme:", Theme[val]);
        this.theme = val;
        GameThemeInit.inst.dispatchOne(this.theme);
    }

    get Level() {
        return this.level;
    }

    set Level(val: number) {
        console.log("set game Level:", val);
        this.level = val;

    }

    /**  初始化游戏主题 */
    initGametheme() {
        let pool = Level.getThemeRandomPool(this.Level);
        this.Theme = pool[Math.floor(Random.getRandom() * pool.length)];
    }

    addPlayerScore(score: number, times: number = 1) {


        // if (this.playerScore <= 0 && score <= 0) return;

        this.playerScore += score;

        this.playerScore = Math.max(this.playerScore, 0);

        PlayerScoreChanged.inst.dispatchThree(this.playerScore, score, times);

    }

    addNoviceScore(score: number, times: number = 1) {

        this.noviceScore += score;
        this.noviceScore = Math.max(this.noviceScore, 0);

        NoviceScoreChanged.inst.dispatchThree(this.noviceScore, score, times);

    }


    get TotalScore() {

        return this.Timebonus + this.ScoreSpread + this.playerScore;
    }

    get Timebonus() {
        return 0;
    }

    get ScoreSpread() {
        return this.playerScore - this.noviceScore;
    }

    get PlayerScore() {
        return this.playerScore;
    }

    get PauseScore() {
        return this.pauseScore;
    }

    get NoviceScore() {
        return this.noviceScore;
    }

    addPauseCount() {
        this.pauseCount++;
        console.log("pause count:", this.pauseCount);
        if (this.pauseCount > FreePauseLimit) {
            this.addPlayerScore(-PauseScoreCost);
        }
    }

    get PauseCount() {
        return this.pauseCount;
    }




}