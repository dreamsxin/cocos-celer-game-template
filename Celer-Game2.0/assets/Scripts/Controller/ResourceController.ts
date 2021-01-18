import { SingleTon } from "../Utils/ToSingleton";
import { HashMap } from "../Utils/HashMap";
import { Poker, PokerType } from "../GamePlay/Model/Poker/PokerModel";

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

export const PokerSprite = {
  [Poker.$_A]: "bg_solitarie_[color]A",
  [Poker.$_2]: "bg_solitarie_[color]2",
  [Poker.$_3]: "bg_solitarie_[color]3",
  [Poker.$_4]: "bg_solitarie_[color]4",
  [Poker.$_5]: "bg_solitarie_[color]5",
  [Poker.$_6]: "bg_solitarie_[color]6",
  [Poker.$_7]: "bg_solitarie_[color]7",
  [Poker.$_8]: "bg_solitarie_[color]8",
  [Poker.$_9]: "bg_solitarie_[color]9",
  [Poker.$_10]: "bg_solitarie_[color]10",
  [Poker.$_J]: "bg_solitarie_[color]J",
  [Poker.$_Q]: "bg_solitarie_[color]Q",
  [Poker.$_K]: "bg_solitarie_[color]K",
};

export const PokerColorType = {
  [PokerType.Club]: "03",
  [PokerType.Diamond]: "04",
  [PokerType.Heart]: "02",
  [PokerType.Spade]: "01",
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

  getPokerSprite(point: Poker, color: PokerType) {
    let key = PokerSprite[point].replace("[color]", PokerColorType[color]);
    return this.UIAtlas.getSpriteFrame(key);
  }
}
