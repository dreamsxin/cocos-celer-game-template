import { SingleTon } from "../Utils/ToSingleton";
import { HashMap } from "../Utils/HashMap";

export const Title = {
  Complete: "font_complete",
  TimeUp: "font_time's up",
  Over: "font_over",
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
    return this.fontMap.get(Font.AddScore);
  }

  getSubScoreFont() {
    return this.fontMap.get(Font.SubScore);
  }

  getSoundDisabled() {
    return this.UIAtlas.getSpriteFrame("btn_nosound");
  }

  getSoundEnable() {
    return this.UIAtlas.getSpriteFrame("btn_sound");
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
