// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property, executeInEditMode } = cc._decorator;

@ccclass
@executeInEditMode
export default class PolygonScene extends cc.Component {
  @property
  Threshold: number = 10;
  private physicsUtils: any = null;
  private ipcListener: Editor.IpcListener;

  get IpcListener() {
    if (this.ipcListener == null) {
      this.ipcListener = new Editor.IpcListener();
    }
    return this.ipcListener;
  }

  private totalCount = 0;
  private count: number = 0;
  private atlasList: cc.SpriteFrame[] = [];

  private polygonData: any = {};
  get Count() {
    return this.count;
  }

  get PercentLabel() {
    return this.node.getChildByName("PercentLabel").getComponent(cc.Label);
  }

  set Count(val: number) {
    this.count = val;
    this.PercentLabel.string =
      ((this.count / this.totalCount) * 100).toFixed(2) + "%";
    if (this.count >= this.totalCount) {
      this.done();
    }
  }

  onLoad() {
    if (CC_EDITOR) {
      this.physicsUtils = Editor.require("scene://utils/physics");
      this.IpcListener.clear();
      this.IpcListener.once(
        "start-gen-polygon",
        this.startGeneratePolygonData.bind(this)
      );
    }
  }

  show() {
    cc.loader.loadResDir(
      "./Items/",
      cc.SpriteFrame,
      (err: Error, atlas: cc.SpriteFrame[]) => {
        if (err) {
          Editor.Dialog.messageBox({
            type: "error",
            title: "Load Failed",
            message: " Load item atlas failed.",
          });
          return;
        }

        this.atlasList = atlas;

        let count = 0;
        for (let spriteFrame of this.atlasList) {
          if (
            !this.polygonData[spriteFrame.name] ||
            this.polygonData[spriteFrame.name].length < 4
          ) {
            continue;
          }

          setTimeout(
            (spriteFrame) => {
              let node = new cc.Node();
              node.addComponent(cc.Sprite).spriteFrame = spriteFrame;

              let rigidBody = node.addComponent(cc.RigidBody);
              rigidBody.bullet = true;
              rigidBody.linearDamping = 0.4;
              rigidBody.angularDamping = 0.4;
              let polygon = node.addComponent(cc.PhysicsPolygonCollider);
              polygon.friction = 0.5;
              polygon.density = 1;
              let points = [];
              for (let point of this.polygonData[spriteFrame.name]) {
                points.push(cc.v2(point.x, point.y));
              }

              polygon.points = points;

              setTimeout(
                (node) => {
                  this.node.addChild(node);
                  console.log(" count:", this.node.childrenCount);
                },
                1000,
                node
              );
            },
            count++ * 1000,
            spriteFrame
          );
        }
      }
    );
  }

  startGeneratePolygonData() {
    Editor.info(" startGeneratePolygonData ");
    cc.loader.loadResDir(
      "./Items/",
      cc.SpriteFrame,
      (err: Error, atlas: cc.SpriteFrame[]) => {
        if (err) {
          Editor.Dialog.messageBox({
            type: "error",
            title: "Load Failed",
            message: " Load item atlas failed.",
          });
          return;
        }

        this.atlasList = atlas;
        this.totalCount = atlas.length;

        this.Count = 0;
        Editor.assetdb.createOrSave(
          "db://assets/resources/polygonData/polygon.json",
          "{}",
          () => {}
        );
        this.polygonData = {};
        Editor.info(" start generate ");
        this.generateByAtlasList();
      }
    );
  }

  generateByAtlasList() {
    if (this.atlasList.length <= 0) return;
    Editor.info(" start generate " + this.atlasList.length);

    this.generateByAtlas(this.atlasList);
  }

  generateByAtlas(atlas: cc.SpriteFrame[], index: number = 0) {
    let node = new cc.Node();
    let spriteFrame = atlas[index];
    Editor.info(index + "-" + spriteFrame.name);
    node.addComponent(cc.Sprite).spriteFrame = spriteFrame;
    let polygon = node.addComponent(cc.PolygonCollider);
    this.node.addChild(node);

    this.physicsUtils.resetPoints(polygon, { threshold: this.Threshold });

    setTimeout(() => {
      if (polygon.points.length < 4) {
        Editor.error(" points error:" + spriteFrame.name);
      } else {
        this.polygonData[spriteFrame.name] = [];
        for (let point of polygon.points) {
          this.polygonData[spriteFrame.name].push({ x: point.x, y: point.y });
        }
      }

      node.destroy();

      this.Count++;
      index++;
      if (index >= atlas.length) {
      } else {
        this.generateByAtlas(atlas, index);
      }
    }, 5000);
  }

  done() {
    Editor.assetdb.createOrSave(
      "db://assets/resources/polygonData/polygon.json",
      JSON.stringify(this.polygonData),
      (err) => {
        if (err) {
          Editor.Dialog.messageBox({
            type: "error",
            title: "Gen failed.",
            message: " Generate polygon data failed.",
          });
          return;
        }
        Editor.Dialog.messageBox({
          type: "info",
          title: "Gen done",
          message: " Generate polygon data success.",
        });
      }
    );
  }
}
