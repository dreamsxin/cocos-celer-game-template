import { SingleTon } from "../Utils/ToSingleton";
import { HashMap } from "../Utils/HashMap";
import { Random_ID } from "../table";

export const Title = {
  Complete: "bg_font_complete",
  CompleteAni: "ae_complete",
  TimeUp: "bg_font_time'sup",
  Over: "bg_font_gameover",
  OutOfMove: "bg_font_gameover",
};

export const PauseFont = {
  HasFree: "bg_fontfree",
  NoneFree: "bg_fontnofree",
};

export const Font = {
  TotalScore: "totalScore",
  ResultScore: "resultScore",
  TimeWhite: "TimeWhite",
  TimeRed: "TimeRed",
  AddScore: "addScore",
  SubScore: "subScore",
  ShowScore: "showScore",
};

export enum AnimationType {
  UI,
  GamePlay,
}
export class ResourceController extends SingleTon<ResourceController>() {
  private fontMap: HashMap<string, cc.Font> = new HashMap();

  private UIAtlas: cc.SpriteAtlas = null;
  private ResultAtlas: cc.SpriteAtlas = null;
  private PauseAtlas: cc.SpriteAtlas = null;
  private Animations: HashMap<AnimationType, cc.SpriteAtlas> = new HashMap();
  private ItemAtlas: HashMap<Random_ID, cc.SpriteAtlas> = new HashMap();

  setFont(key: string, font: cc.Font) {
    this.fontMap.add(key, font);
  }

  setAtlas(atlas: cc.SpriteAtlas) {
    console.assert(atlas != null, "game atlas is null!");
    this.UIAtlas = atlas;
  }

  setResultAtlas(atlas: cc.SpriteAtlas) {
    console.assert(atlas != null, "game atlas is null!");
    this.ResultAtlas = atlas;
  }

  setPauseAtlas(atlas: cc.SpriteAtlas) {
    console.assert(atlas != null, "game atlas is null!");
    this.PauseAtlas = atlas;
  }

  getTitleSprite(name: string) {
    return this.UIAtlas.getSpriteFrame(name);
  }

  getResultSprite(name: string) {
    return this.ResultAtlas.getSpriteFrame(name);
  }

  getAltas(name: string) {
    return this.UIAtlas.getSpriteFrame(name);
  }

  getPauseAtlas(name: string) {
    return this.PauseAtlas.getSpriteFrame(name);
  }

  pushItemAtlas(type: Random_ID, altas: cc.SpriteAtlas) {
    this.ItemAtlas.add(type, altas);
  }

  getItemSprite(type: Random_ID, spName: string) {
    if (this.ItemAtlas.has(type)) {
      return this.ItemAtlas.get(type).getSpriteFrame(spName);
    }
    return null;
  }

  pushAnimationAtlas(animationType: AnimationType, atlas: cc.SpriteAtlas) {
    console.assert(atlas != null, "animation atlas is null!");
    this.Animations.add(animationType, atlas);
  }

  getAnimationAtlas(animationType: AnimationType, name: string) {
    return this.Animations.get(animationType).getSpriteFrame(name);
  }

  getAddScoreFont() {
    return this.fontMap.get(Font.AddScore);
  }

  getSubScoreFont() {
    return this.fontMap.get(Font.SubScore);
  }

  getSoundDisabled() {
    return this.PauseAtlas.getSpriteFrame("btn_nosound");
  }

  getSoundEnable() {
    return this.PauseAtlas.getSpriteFrame("btn_sound");
  }

  getPauseFont(name: string) {
    return this.PauseAtlas.getSpriteFrame(name);
  }

  getTimeRedFont() {
    return this.fontMap.get(Font.TimeRed);
  }

  getTimeWhiteFont() {
    return this.fontMap.get(Font.TimeWhite);
  }
}
