import { Animals,Ball,Books,Buildings,Class,Food,Fruits,Makeup,Ornament,Other,Outlet,Plants,Shape,Tool,Vegetable,} from  './table';

/**
* json数据管理
*/

export class TableManager {  
    private static ins: TableManager;
    public static JSON_URL: string = "";
    public static get inst() {
        return this.ins ? this.ins : (this.ins = new TableManager());
    }

    private constructor() {}

    private load = TableManager.JSON_URL && TableManager.JSON_URL != "" ? cc.loader.load.bind(cc.loader) : cc.loader.loadRes.bind(cc.loader);
    private fileFormat = TableManager.JSON_URL && TableManager.JSON_URL != "" ? ".json?time=" + Date.now() : "";
    private total: number = 0;
    private complete: number = 0;
    private completeCallback: () => void;
    private progressCallback: (progress: number) => void;
    /** 
    *
    * @param url json 路径
    * @param complete
    * @param progress
    */
    startLoad(url: string, complete: () => void, progress?: (progress: number) => void) {
        this.completeCallback = complete;
        this.progressCallback = progress;

        let self = this;
        console.log("Base URL:", TableManager.JSON_URL);
        this.load(TableManager.JSON_URL + url.trim().split('/').join('') + '/file_list' + this.fileFormat, function(err, JsonAsset: cc.JsonAsset) {
            if (err) {
                console.error(err.errorMessage);
            } else {
                let jsonArray = JsonAsset.constructor["name"] == "Array" ? JsonAsset : JsonAsset.json;
                 this.total = jsonArray.length;
                 for (let jsonFile of jsonArray) {
                     self.loadJson(url.trim().split('/').join('')+'/' + jsonFile.replace('.json', ''));
                 }
            }
            }.bind(this)
        );
    }
        
    private loadJson(url) {
        console.log('start load:' + url);
        
        let self = this;
        let tableName = url.split("/")[1];
        tableName = tableName.charAt(0).toUpperCase() + tableName.slice(1, tableName.length);
        this.load(TableManager.JSON_URL + url + this.fileFormat, function(err, JsonAsset: cc.JsonAsset) {
            if (err) {
                console.error(err.errorMessage);
            } else {
                let jsonArray = JsonAsset.constructor["name"] == "Array" ? JsonAsset : JsonAsset.json;
                for (let json of jsonArray) {
                    self[tableName][json['ID']] = json;
                }
                self.completeLoad();
            }
        }.bind(this));
    }
    private completeLoad() {
        this.complete++;
        if (this.complete >= this.total) {
            if (this.completeCallback) this.completeCallback();
        }
    }
private Animals: any = {};
private Ball: any = {};
private Books: any = {};
private Buildings: any = {};
private Class: any = {};
private Food: any = {};
private Fruits: any = {};
private Makeup: any = {};
private Ornament: any = {};
private Other: any = {};
private Outlet: any = {};
private Plants: any = {};
private Shape: any = {};
private Tool: any = {};
private Vegetable: any = {};
 public getAnimals (key: string|number) : Animals{
    if (this.Animals[key]){
 return this.Animals[key];
}
 else { console.error('Animals 不存key：'+key); return null;}
 }
 public getAll_Animals_Data() : any{
 return this.Animals;}
 public getBall (key: string|number) : Ball{
    if (this.Ball[key]){
 return this.Ball[key];
}
 else { console.error('Ball 不存key：'+key); return null;}
 }
 public getAll_Ball_Data() : any{
 return this.Ball;}
 public getBooks (key: string|number) : Books{
    if (this.Books[key]){
 return this.Books[key];
}
 else { console.error('Books 不存key：'+key); return null;}
 }
 public getAll_Books_Data() : any{
 return this.Books;}
 public getBuildings (key: string|number) : Buildings{
    if (this.Buildings[key]){
 return this.Buildings[key];
}
 else { console.error('Buildings 不存key：'+key); return null;}
 }
 public getAll_Buildings_Data() : any{
 return this.Buildings;}
 public getClass (key: string|number) : Class{
    if (this.Class[key]){
 return this.Class[key];
}
 else { console.error('Class 不存key：'+key); return null;}
 }
 public getAll_Class_Data() : any{
 return this.Class;}
 public getFood (key: string|number) : Food{
    if (this.Food[key]){
 return this.Food[key];
}
 else { console.error('Food 不存key：'+key); return null;}
 }
 public getAll_Food_Data() : any{
 return this.Food;}
 public getFruits (key: string|number) : Fruits{
    if (this.Fruits[key]){
 return this.Fruits[key];
}
 else { console.error('Fruits 不存key：'+key); return null;}
 }
 public getAll_Fruits_Data() : any{
 return this.Fruits;}
 public getMakeup (key: string|number) : Makeup{
    if (this.Makeup[key]){
 return this.Makeup[key];
}
 else { console.error('Makeup 不存key：'+key); return null;}
 }
 public getAll_Makeup_Data() : any{
 return this.Makeup;}
 public getOrnament (key: string|number) : Ornament{
    if (this.Ornament[key]){
 return this.Ornament[key];
}
 else { console.error('Ornament 不存key：'+key); return null;}
 }
 public getAll_Ornament_Data() : any{
 return this.Ornament;}
 public getOther (key: string|number) : Other{
    if (this.Other[key]){
 return this.Other[key];
}
 else { console.error('Other 不存key：'+key); return null;}
 }
 public getAll_Other_Data() : any{
 return this.Other;}
 public getOutlet (key: string|number) : Outlet{
    if (this.Outlet[key]){
 return this.Outlet[key];
}
 else { console.error('Outlet 不存key：'+key); return null;}
 }
 public getAll_Outlet_Data() : any{
 return this.Outlet;}
 public getPlants (key: string|number) : Plants{
    if (this.Plants[key]){
 return this.Plants[key];
}
 else { console.error('Plants 不存key：'+key); return null;}
 }
 public getAll_Plants_Data() : any{
 return this.Plants;}
 public getShape (key: string|number) : Shape{
    if (this.Shape[key]){
 return this.Shape[key];
}
 else { console.error('Shape 不存key：'+key); return null;}
 }
 public getAll_Shape_Data() : any{
 return this.Shape;}
 public getTool (key: string|number) : Tool{
    if (this.Tool[key]){
 return this.Tool[key];
}
 else { console.error('Tool 不存key：'+key); return null;}
 }
 public getAll_Tool_Data() : any{
 return this.Tool;}
 public getVegetable (key: string|number) : Vegetable{
    if (this.Vegetable[key]){
 return this.Vegetable[key];
}
 else { console.error('Vegetable 不存key：'+key); return null;}
 }
 public getAll_Vegetable_Data() : any{
 return this.Vegetable;}
}