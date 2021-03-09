import { SingleTon } from "../utils/ToSingleton";

export class AdController extends SingleTon<AdController>() {
  private hasBind = false;
  private finishCallback = {};
  private failedCallback = {};

  private adCount: number = 0;
  private msgMap = {};
  private musicVolume: number = 0;
  private effectVolume: number = 0;

  showAd(
    adUnitId: string,
    finsh: (adUnitId: string) => void,
    failed: (adUnitId: string) => void
  ) {
    if (this.hasBind == false) {
      this.bindCallback();
    }

    let uniqueKey = adUnitId + this.adCount;
    this.msgMap[uniqueKey] = adUnitId;

    if (this.finishCallback[uniqueKey] == null) {
      this.finishCallback[uniqueKey] = [];
    }

    this.finishCallback[uniqueKey].push(finsh);

    if (this.failedCallback[uniqueKey] == null) {
      this.failedCallback[uniqueKey] = [];
    }

    this.failedCallback[uniqueKey].push(failed);

    this.musicVolume = cc.audioEngine.getMusicVolume();
    this.effectVolume = cc.audioEngine.getEffectsVolume();
    // cc.audioEngine.setEffectsVolume(0);
    // cc.audioEngine.setMusicVolume(0);
    if (CELER_X) {
      celerSDK.showAd(uniqueKey);
    } else {
      if (
        cc.director.getScene() &&
        cc.director.getScene().getChildByName("Canvas")
      ) {
        let rootNode = cc.director.getScene().getChildByName("Canvas");

        if (rootNode.getChildByName("adNode")) {
          return;
        }

        let adNode = new cc.Node("adNode");
        let videoPlayer = adNode.addComponent(cc.VideoPlayer);
        videoPlayer.remoteURL = "https://vicat.wang/GameRes/catcatcat.mp4";

        rootNode.width = 1464;
        rootNode.height = 2400;
        rootNode.addChild(adNode);

        adNode.setPosition(0, 0);

        videoPlayer.node.on(
          "ready-to-play",
          () => {
            console.log("ready-to-play");
            adNode.width = 1080;
            adNode.height = 1920;
            videoPlayer.play();
          },
          this
        );

        videoPlayer.node.on(
          "meta-loaded",
          () => {
            console.log("meta-loaded");
          },
          this
        );

        videoPlayer.node.on(
          "clicked",
          () => {
            console.log("clicked");

            adNode["pauseCount"]++;
            if (adNode["pauseCount"] >= 5) {
              let cocosVideos = document.getElementsByClassName("cocosVideo");
              for (let i = 0; i < cocosVideos.length; i++) {
                let element = cocosVideos.item(i);
                if (element) {
                  element.remove();
                }
              }
              setTimeout(() => {
                adNode.removeFromParent(true);
                this.onAddFaild(uniqueKey);
              }, 0);
            }
          },
          this
        );

        videoPlayer.node.on(
          "playing",
          () => {
            console.log("playing");
          },
          this
        );
        adNode["pauseCount"] = 0;
        videoPlayer.node.on(
          "paused",
          () => {
            console.log("paused");
            adNode["pauseCount"]++;
            if (adNode["pauseCount"] >= 5) {
              let cocosVideos = document.getElementsByClassName("cocosVideo");
              for (let i = 0; i < cocosVideos.length; i++) {
                let element = cocosVideos.item(i);
                if (element) {
                  element.remove();
                }
              }
              setTimeout(() => {
                adNode.removeFromParent(true);
                this.onAddFaild(uniqueKey);
              }, 0);
            }
          },
          this
        );

        videoPlayer.node.on(
          "stopped",
          () => {
            console.log("stopped");
          },
          this
        );

        videoPlayer.node.on(
          "completed",
          () => {
            console.log("completed");
            videoPlayer.stop();
            let cocosVideos = document.getElementsByClassName("cocosVideo");
            for (let i = 0; i < cocosVideos.length; i++) {
              let element = cocosVideos.item(i);
              if (element) {
                element.remove();
              }
            }
            setTimeout(() => {
              adNode.removeFromParent(true);
              this.onAdFinish(uniqueKey);
            }, 0);
          },
          this
        );
      }
    }

    this.adCount++;
    console.log(" request ad:", uniqueKey);
  }

  private bindCallback() {
    this.hasBind = true;
    if (CELER_X) {
      celerSDK.onAdPlayFailed(this.onAddFaild.bind(this));
      celerSDK.onAdPlayFinished(this.onAdFinish.bind(this));
    }
  }

  private onAdFinish(uniqeKey: string) {
    if (this.finishCallback[uniqeKey]) {
      let callbacks: ((adUnitId: string) => void)[] = this.finishCallback[
        uniqeKey
      ];
      for (let finish of callbacks) {
        finish(this.msgMap[uniqeKey]);
      }
      this.finishCallback[uniqeKey] = null;
      this.failedCallback[uniqeKey] = null;
      this.msgMap[uniqeKey] = null;
    }
  }

  private onAddFaild(uniqeKey: string) {
    if (this.failedCallback[uniqeKey]) {
      let callbacks: ((adUnitId: string) => void)[] = this.failedCallback[
        uniqeKey
      ];
      for (let failed of callbacks) {
        failed(this.msgMap[uniqeKey]);
      }
      this.failedCallback[uniqeKey] = null;
      this.finishCallback[uniqeKey] = null;
      this.msgMap[uniqeKey] = null;
    }
  }
}
