import { SingleTon } from "../Utils/ToSingleton";
import { GamePauseSignal } from "../Command/CommonSignal";
import { PlayModelProxy } from "../Model/PlayModelProxy";


export enum RoundEndType {

    TimeUp
}

export class GameStateController extends SingleTon<GameStateController>() {


    private pauseCount: number = 0;


    private roundstart: boolean = false;

    private currentRound: number = 0;

    private onResumeCallbacks: Function[] = [];



    start() {
        this.pauseCount = 0;

    }

    canStart() {
        return true;
    }

    roundStart() {
        console.log(" round start:", ++this.currentRound);
        this.roundstart = true;


    }

    roundEnd(type: RoundEndType) {
        console.log("round end :", RoundEndType[type]);
        this.roundstart = false;





    }

    isRoundStart() {
        return this.roundstart;
    }


    pause(isFree: boolean = false) {





        if (this.isPause() == false) {

            this.onResumeCallbacks.length = 0;

            GamePauseSignal.inst.dispatch();


            if (!isFree) {
                this.onResumeCallbacks.push(() => {
                    PlayModelProxy.inst.addPauseCount();
                })
            }


        }

        this.pauseCount++;


    }

    clearResumeCallback() {
        this.onResumeCallbacks.length = 0;
    }

    resume() {
        this.pauseCount--;
        console.assert(this.pauseCount >= 0, " pause count smaller than 0!!!");
        this.pauseCount = Math.max(this.pauseCount, 0);
        if (this.pauseCount <= 0) {
            for (let callback of this.onResumeCallbacks) {
                callback();
            }
            this.onResumeCallbacks.length = 0;
        }
    }

    isPause() {
        return this.pauseCount > 0;
    }

    addResumeCallback(callback: Function) {

        if (!this.onResumeCallbacks) this.onResumeCallbacks = [];
        this.onResumeCallbacks.push(callback);

    }

}