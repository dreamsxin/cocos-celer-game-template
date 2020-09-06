import { SingleTon } from "../Utils/ToSingleton";
import { HashMap } from "../Utils/HashMap";

export const Title = {
    Complete: "bg_font_complete",
    TimeUp: "bg_font_timeup"
}



export class ResourceController extends SingleTon<ResourceController>() {





    private UIAtlas: cc.SpriteAtlas = null;

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

}