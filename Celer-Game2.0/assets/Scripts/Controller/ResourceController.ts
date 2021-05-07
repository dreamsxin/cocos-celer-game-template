import { SingleTon } from "../Utils/ToSingleton";
import { HashMap } from "../Utils/HashMap";

export const Title = {
  Complete: "font_complete",
  TimeUp: "font_timeup",
  Over: "font_gameover",
  OutOfMove: "font_outofmove",
};

export const PauseFont = {
  HasFree: "bg_pause_font1",
  NoneFree: "bg_pause_font2",
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
