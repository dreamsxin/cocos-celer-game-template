import { SingleTon } from "../utils/ToSingleton";

const URL = "http://192.168.100.69:2021/";
export class GameRecorder extends SingleTon<GameRecorder>() {
  private readonly RATE = 6;
  private frameCount = 0;
  init() {
    if (CELER_X) return;
    if (cc.sys.isMobile) return;
    this.sendRequest(URL, "Login")
      .then((res: string) => {
        console.log("response:", res);
        this.register();
      })
      .catch((code: number) => {
        console.warn("err:", code);
      });
  }

  private register() {
    cc.director.on(cc.Director.EVENT_AFTER_DRAW, this.onGameDrawed, this);
  }

  private onGameDrawed() {
    this.frameCount++;
    if (this.frameCount < this.RATE) return;
    this.frameCount = 0;
    let canvas = document.getElementsByTagName("canvas")[0];
    this.sendRequest(URL + "capture", canvas.toDataURL("image/jpeg", 0.1));
  }

  private sendRequest(url: string, data: string) {
    return new Promise(
      (resolve: (res: string) => void, reject: (code: number) => void) => {
        let xhr = cc.loader.getXMLHttpRequest();

        xhr.onreadystatechange = function () {
          if (xhr.readyState == XMLHttpRequest.DONE) {
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve(xhr.responseText);
            } else {
              reject(xhr.status);
            }
          }
        };

        xhr.timeout = 5000;
        xhr.open("POST", url);

        xhr.send(data);
      }
    );
  }
}
