import { Level,Map1_1,Map1_2,Map2_1,Map2_2,Map3_1,Map3_2,} from  './table';

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
private Level: any = {};
private Map1_1: any = {};
private Map1_2: any = {};
private Map2_1: any = {};
private Map2_2: any = {};
private Map3_1: any = {};
private Map3_2: any = {};
 public getLevel (key: string|number) : Level{
    if (this.Level[key]){
 return this.Level[key];
}
 else { console.error('Level 不存key：'+key); return null;}
 }
 public getAll_Level_Data() : any{
 return this.Level;}
 public getMap1_1 (key: string|number) : Map1_1{
    if (this.Map1_1[key]){
 return this.Map1_1[key];
}
 else { console.error('Map1_1 不存key：'+key); return null;}
 }
 public getAll_Map1_1_Data() : any{
 return this.Map1_1;}
 public getMap1_2 (key: string|number) : Map1_2{
    if (this.Map1_2[key]){
 return this.Map1_2[key];
}
 else { console.error('Map1_2 不存key：'+key); return null;}
 }
 public getAll_Map1_2_Data() : any{
 return this.Map1_2;}
 public getMap2_1 (key: string|number) : Map2_1{
    if (this.Map2_1[key]){
 return this.Map2_1[key];
}
 else { console.error('Map2_1 不存key：'+key); return null;}
 }
 public getAll_Map2_1_Data() : any{
 return this.Map2_1;}
 public getMap2_2 (key: string|number) : Map2_2{
    if (this.Map2_2[key]){
 return this.Map2_2[key];
}
 else { console.error('Map2_2 不存key：'+key); return null;}
 }
 public getAll_Map2_2_Data() : any{
 return this.Map2_2;}
 public getMap3_1 (key: string|number) : Map3_1{
    if (this.Map3_1[key]){
 return this.Map3_1[key];
}
 else { console.error('Map3_1 不存key：'+key); return null;}
 }
 public getAll_Map3_1_Data() : any{
 return this.Map3_1;}
 public getMap3_2 (key: string|number) : Map3_2{
    if (this.Map3_2[key]){
 return this.Map3_2[key];
}
 else { console.error('Map3_2 不存key：'+key); return null;}
 }
 public getAll_Map3_2_Data() : any{
 return this.Map3_2;}
}