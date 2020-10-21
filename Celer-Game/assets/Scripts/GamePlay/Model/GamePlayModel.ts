import { Theme } from "../../Global/Theme";
import { TotalTime, FreePauseLimit, PauseScoreCost } from "../../Global/GameRule";
import { GameThemeInit, PlayerScoreChanged, NoviceScoreChanged } from "../../Command/CommonSignal";
import { Level } from "../../Global/Level";
import { Random } from "../../Utils/Random";
export enum ScoreType {
    Combo,
    CardBonus,
    TimeBonus,
    Normal
}
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
    private streak: number = 0;
    private totalStreak: number = 0;
    private maxSteak: number = 0;
    private scoreMap = {};

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


    get TotalScore() {

        return this.Timebonus + this.ScoreSpread + this.playerScore;
    }

    get Timebonus() {
        return 0;
    }

    get ScoreSpread() {
        return 0;
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

       get TotalCombo() {
        return this.totalStreak;
    }

    get PauseCount() {
        return this.pauseCount;
    }

    /**  初始化游戏主题 */
    initGametheme() {
        let pool = Level.getThemeRandomPool(this.Level);
        this.Theme = pool[Math.floor(Random.getRandom() * pool.length)];
    }

    addPlayerScore(score: number, type: ScoreType, times: number = 1, fromNode: cc.Node = null): number {


        if (score == 0) return;
        if (this.scoreMap[type] == null) this.scoreMap[type] = 0;

        this.scoreMap[type] += score;
        let oldScore = this.playerScore;

        this.playerScore += score;
        if (score > 0) {
        } else {
            this.resetCombo();
        }

        this.playerScore = Math.max(this.playerScore, 0);

        PlayerScoreChanged.inst.dispatchFour(this.playerScore, score, times, fromNode);

        return this.playerScore - oldScore;

    }

    addNoviceScore(score: number, times: number = 1) {

        this.noviceScore += score;
        this.noviceScore = Math.max(this.noviceScore, 0);

        NoviceScoreChanged.inst.dispatchThree(this.noviceScore, score, times);

    }

    getScoreByType(type: ScoreType) {
        return this.scoreMap[type];
    }

  

    addPauseCount() {
        this.pauseCount++;
        console.log("pause count:", this.pauseCount);
        if (this.pauseCount > FreePauseLimit) {
            this.addPlayerScore(-PauseScoreCost, ScoreType.Normal);
        }
    }

    

    resetCombo() {
        this.streak = 0;
    }

    addStreak() {
        this.streak++;
        this.totalStreak++;
        this.maxSteak = Math.max(this.maxSteak, this.streak);
    }

     dump() {
     
    }

}