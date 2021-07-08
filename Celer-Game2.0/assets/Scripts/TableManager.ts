import { Animals,Animals_en,Ball,Ball_en,Books,Books_en,Buildings,Buildings_en,Class,En,Food,Food_en,Fruits,Fruits_en,Makeup,Makeup_en,Ornament,Ornament_en,Other,Other_en,Outlet,Outlet_en,Plants,Plants_en,Random,Shape,Shape_en,Tool,Tool_en,Vegetable,Vegetable_en,} from  './table';

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
        if (this.progressCallback) {
      this.progressCallback(this.complete / this.total);
    }
        if (this.complete >= this.total) {
            if (this.completeCallback) this.completeCallback();
        }
    }
private Animals: any = {};
private Animals_en: any = {};
private Ball: any = {};
private Ball_en: any = {};
private Books: any = {};
private Books_en: any = {};
private Buildings: any = {};
private Buildings_en: any = {};
private Class: any = {};
private En: any = {};
private Food: any = {};
private Food_en: any = {};
private Fruits: any = {};
private Fruits_en: any = {};
private Makeup: any = {};
private Makeup_en: any = {};
private Ornament: any = {};
private Ornament_en: any = {};
private Other: any = {};
private Other_en: any = {};
private Outlet: any = {};
private Outlet_en: any = {};
private Plants: any = {};
private Plants_en: any = {};
private Random: any = {};
private Shape: any = {};
private Shape_en: any = {};
private Tool: any = {};
private Tool_en: any = {};
private Vegetable: any = {};
private Vegetable_en: any = {};
 public getAnimals (key: string|number) : Animals{
    if (this.Animals[key]){
 return this.Animals[key];
}
 else { console.error('Animals 不存key：'+key); return null;}
 }
 public getAll_Animals_Data() : any{
 return this.Animals;}
 public getAnimals_en (key: string|number) : Animals_en{
    if (this.Animals_en[key]){
 return this.Animals_en[key];
}
 else { console.error('Animals_en 不存key：'+key); return null;}
 }
 public getAll_Animals_en_Data() : any{
 return this.Animals_en;}
 public getBall (key: string|number) : Ball{
    if (this.Ball[key]){
 return this.Ball[key];
}
 else { console.error('Ball 不存key：'+key); return null;}
 }
 public getAll_Ball_Data() : any{
 return this.Ball;}
 public getBall_en (key: string|number) : Ball_en{
    if (this.Ball_en[key]){
 return this.Ball_en[key];
}
 else { console.error('Ball_en 不存key：'+key); return null;}
 }
 public getAll_Ball_en_Data() : any{
 return this.Ball_en;}
 public getBooks (key: string|number) : Books{
    if (this.Books[key]){
 return this.Books[key];
}
 else { console.error('Books 不存key：'+key); return null;}
 }
 public getAll_Books_Data() : any{
 return this.Books;}
 public getBooks_en (key: string|number) : Books_en{
    if (this.Books_en[key]){
 return this.Books_en[key];
}
 else { console.error('Books_en 不存key：'+key); return null;}
 }
 public getAll_Books_en_Data() : any{
 return this.Books_en;}
 public getBuildings (key: string|number) : Buildings{
    if (this.Buildings[key]){
 return this.Buildings[key];
}
 else { console.error('Buildings 不存key：'+key); return null;}
 }
 public getAll_Buildings_Data() : any{
 return this.Buildings;}
 public getBuildings_en (key: string|number) : Buildings_en{
    if (this.Buildings_en[key]){
 return this.Buildings_en[key];
}
 else { console.error('Buildings_en 不存key：'+key); return null;}
 }
 public getAll_Buildings_en_Data() : any{
 return this.Buildings_en;}
 public getClass (key: string|number) : Class{
    if (this.Class[key]){
 return this.Class[key];
}
 else { console.error('Class 不存key：'+key); return null;}
 }
 public getAll_Class_Data() : any{
 return this.Class;}
 public getEn (key: string|number) : En{
    if (this.En[key]){
 return this.En[key];
}
 else { console.error('En 不存key：'+key); return null;}
 }
 public getAll_En_Data() : any{
 return this.En;}
 public getFood (key: string|number) : Food{
    if (this.Food[key]){
 return this.Food[key];
}
 else { console.error('Food 不存key：'+key); return null;}
 }
 public getAll_Food_Data() : any{
 return this.Food;}
 public getFood_en (key: string|number) : Food_en{
    if (this.Food_en[key]){
 return this.Food_en[key];
}
 else { console.error('Food_en 不存key：'+key); return null;}
 }
 public getAll_Food_en_Data() : any{
 return this.Food_en;}
 public getFruits (key: string|number) : Fruits{
    if (this.Fruits[key]){
 return this.Fruits[key];
}
 else { console.error('Fruits 不存key：'+key); return null;}
 }
 public getAll_Fruits_Data() : any{
 return this.Fruits;}
 public getFruits_en (key: string|number) : Fruits_en{
    if (this.Fruits_en[key]){
 return this.Fruits_en[key];
}
 else { console.error('Fruits_en 不存key：'+key); return null;}
 }
 public getAll_Fruits_en_Data() : any{
 return this.Fruits_en;}
 public getMakeup (key: string|number) : Makeup{
    if (this.Makeup[key]){
 return this.Makeup[key];
}
 else { console.error('Makeup 不存key：'+key); return null;}
 }
 public getAll_Makeup_Data() : any{
 return this.Makeup;}
 public getMakeup_en (key: string|number) : Makeup_en{
    if (this.Makeup_en[key]){
 return this.Makeup_en[key];
}
 else { console.error('Makeup_en 不存key：'+key); return null;}
 }
 public getAll_Makeup_en_Data() : any{
 return this.Makeup_en;}
 public getOrnament (key: string|number) : Ornament{
    if (this.Ornament[key]){
 return this.Ornament[key];
}
 else { console.error('Ornament 不存key：'+key); return null;}
 }
 public getAll_Ornament_Data() : any{
 return this.Ornament;}
 public getOrnament_en (key: string|number) : Ornament_en{
    if (this.Ornament_en[key]){
 return this.Ornament_en[key];
}
 else { console.error('Ornament_en 不存key：'+key); return null;}
 }
 public getAll_Ornament_en_Data() : any{
 return this.Ornament_en;}
 public getOther (key: string|number) : Other{
    if (this.Other[key]){
 return this.Other[key];
}
 else { console.error('Other 不存key：'+key); return null;}
 }
 public getAll_Other_Data() : any{
 return this.Other;}
 public getOther_en (key: string|number) : Other_en{
    if (this.Other_en[key]){
 return this.Other_en[key];
}
 else { console.error('Other_en 不存key：'+key); return null;}
 }
 public getAll_Other_en_Data() : any{
 return this.Other_en;}
 public getOutlet (key: string|number) : Outlet{
    if (this.Outlet[key]){
 return this.Outlet[key];
}
 else { console.error('Outlet 不存key：'+key); return null;}
 }
 public getAll_Outlet_Data() : any{
 return this.Outlet;}
 public getOutlet_en (key: string|number) : Outlet_en{
    if (this.Outlet_en[key]){
 return this.Outlet_en[key];
}
 else { console.error('Outlet_en 不存key：'+key); return null;}
 }
 public getAll_Outlet_en_Data() : any{
 return this.Outlet_en;}
 public getPlants (key: string|number) : Plants{
    if (this.Plants[key]){
 return this.Plants[key];
}
 else { console.error('Plants 不存key：'+key); return null;}
 }
 public getAll_Plants_Data() : any{
 return this.Plants;}
 public getPlants_en (key: string|number) : Plants_en{
    if (this.Plants_en[key]){
 return this.Plants_en[key];
}
 else { console.error('Plants_en 不存key：'+key); return null;}
 }
 public getAll_Plants_en_Data() : any{
 return this.Plants_en;}
 public getRandom (key: string|number) : Random{
    if (this.Random[key]){
 return this.Random[key];
}
 else { console.error('Random 不存key：'+key); return null;}
 }
 public getAll_Random_Data() : any{
 return this.Random;}
 public getShape (key: string|number) : Shape{
    if (this.Shape[key]){
 return this.Shape[key];
}
 else { console.error('Shape 不存key：'+key); return null;}
 }
 public getAll_Shape_Data() : any{
 return this.Shape;}
 public getShape_en (key: string|number) : Shape_en{
    if (this.Shape_en[key]){
 return this.Shape_en[key];
}
 else { console.error('Shape_en 不存key：'+key); return null;}
 }
 public getAll_Shape_en_Data() : any{
 return this.Shape_en;}
 public getTool (key: string|number) : Tool{
    if (this.Tool[key]){
 return this.Tool[key];
}
 else { console.error('Tool 不存key：'+key); return null;}
 }
 public getAll_Tool_Data() : any{
 return this.Tool;}
 public getTool_en (key: string|number) : Tool_en{
    if (this.Tool_en[key]){
 return this.Tool_en[key];
}
 else { console.error('Tool_en 不存key：'+key); return null;}
 }
 public getAll_Tool_en_Data() : any{
 return this.Tool_en;}
 public getVegetable (key: string|number) : Vegetable{
    if (this.Vegetable[key]){
 return this.Vegetable[key];
}
 else { console.error('Vegetable 不存key：'+key); return null;}
 }
 public getAll_Vegetable_Data() : any{
 return this.Vegetable;}
 public getVegetable_en (key: string|number) : Vegetable_en{
    if (this.Vegetable_en[key]){
 return this.Vegetable_en[key];
}
 else { console.error('Vegetable_en 不存key：'+key); return null;}
 }
 public getAll_Vegetable_en_Data() : any{
 return this.Vegetable_en;}
}