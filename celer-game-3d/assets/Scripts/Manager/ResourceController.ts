import { Font, SpriteAtlas } from "cc";
import { HashMap } from "../Common/HashMap";
import { SingleTon } from "../Common/ToSingleTon";

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

export const FontType = {
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
  private fontMap: HashMap<string, Font> = new HashMap();

  private UIAtlas: SpriteAtlas = null;
  private ResultAtlas: SpriteAtlas = null;
  private PauseAtlas: SpriteAtlas = null;
  private Animations: HashMap<AnimationType, SpriteAtlas> = new HashMap();

  setFont(key: string, font: Font) {
    this.fontMap.add(key, font);
  }

  setAtlas(atlas: SpriteAtlas) {
    console.assert(atlas != null, "game atlas is null!");
    this.UIAtlas = atlas;
  }

  setResultAtlas(atlas: SpriteAtlas) {
    console.assert(atlas != null, "game atlas is null!");
    this.ResultAtlas = atlas;
  }

  setPauseAtlas(atlas: SpriteAtlas) {
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

  pushAnimationAtlas(animationType: AnimationType, atlas: SpriteAtlas) {
    console.assert(atlas != null, "animation atlas is null!");
    this.Animations.add(animationType, atlas);
  }

  getAnimationAtlas(animationType: AnimationType, name: string) {
    return this.Animations.get(animationType).getSpriteFrame(name);
  }

  getAddScoreFont() {
    return this.fontMap.get(FontType.AddScore);
  }

  getSubScoreFont() {
    return this.fontMap.get(FontType.SubScore);
  }

  getSoundDisabled() {
    return this.PauseAtlas.getSpriteFrame("btn_no sound");
  }

  getSoundEnable() {
    return this.PauseAtlas.getSpriteFrame("btn_sound");
  }

  getPauseFont(name: string) {
    return this.PauseAtlas.getSpriteFrame(name);
  }

  getTimeRedFont() {
    return this.fontMap.get(FontType.TimeRed);
  }

  getTimeWhiteFont() {
    return this.fontMap.get(FontType.TimeWhite);
  }
}
