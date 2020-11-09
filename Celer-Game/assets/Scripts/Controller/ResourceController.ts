import { SingleTon } from "../Utils/ToSingleton";
import { HashMap } from "../Utils/HashMap";

export const Title = {
  Complete: "bg_font_complete",
  TimeUp: "bg_font_timeup",
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

export class ResourceController extends SingleTon<ResourceController>() {
  private fontMap: HashMap<string, cc.Font> = new HashMap();

  private UIAtlas: cc.SpriteAtlas = null;
  private Animation: cc.SpriteAtlas = null;

  setFont(key: string, font: cc.Font) {
    this.fontMap.add(key, font);
  }

  setAtlas(atlas: cc.SpriteAtlas) {
    console.assert(atlas != null, "game atlas is null!");
    this.UIAtlas = atlas;
  }

  getTitleSprite(name: string) {
    return this.UIAtlas.getSpriteFrame(name);
  }

  getAltas(name: string) {
    return this.UIAtlas.getSpriteFrame(name);
  }

  setAnimationAtlas(atlas: cc.SpriteAtlas) {
    console.assert(atlas != null, "animation atlas is null!");
    this.Animation = atlas;
  }

  getAnimationAtlas(name: string) {
    return this.Animation.getSpriteFrame(name);
  }
  getAddScoreFont() {
    console.error(" show return a font.");
    return null;
  }

  getSubScoreFont() {
    console.error(" show return a font.");
    return null;
  }

  getSoundDisabled() {
    console.error(" show return a spriteframe.");
    return null;
  }

  getSoundEnable() {
    console.error(" show return a spriteframe.");
    return null;
  }

  getPauseFont(name: string) {
    return this.UIAtlas.getSpriteFrame(name);
  }

  getTimeRedFont() {
    return this.fontMap.get(Font.TimeRed);
  }

  getTimeWhiteFont() {
    return this.fontMap.get(Font.TimeWhite);
  }
}
