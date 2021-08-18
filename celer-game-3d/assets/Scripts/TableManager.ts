import { En,Physical,} from  './table';

/**\n* json数据管理\n*/
import { JsonAsset, loader } from "cc";
export class TableManager {  
    private static ins: TableManager;
    public static JSON_URL: string = "";
    public static get inst() {
        return this.ins ? this.ins : (this.ins = new TableManager());
    }

    private constructor() {}

    private load = TableManager.JSON_URL && TableManager.JSON_URL != "" ? loader.load.bind(loader) : loader.loadRes.bind(loader);
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
        this.load(TableManager.JSON_URL + url.trim().split('/').join('') + '/file_list' + this.fileFormat, function(err, JsonAsset: JsonAsset) {
            if (err) {
                console.error(err.errorMessage);
            } else {
                let jsonArray: any = JsonAsset.constructor["name"] == "Array" ? JsonAsset : JsonAsset.json;
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
        this.load(TableManager.JSON_URL + url + this.fileFormat, function(err, JsonAsset: JsonAsset) {
            if (err) {
                console.error(err.errorMessage);
            } else {
                let jsonArray: any = JsonAsset.constructor["name"] == "Array" ? JsonAsset : JsonAsset.json;
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

private En: any = {};
private Physical: any = {};
 public getEn (key: string|number) : En{
    if (this.En[key]){
 return this.En[key];
}
 else { console.error('En 不存key：'+key); return null;}
 }
 public getAll_En_Data() : {[key:number]:En}{
 return this.En;}
 public getPhysical (key: string|number) : Physical{
    if (this.Physical[key]){
 return this.Physical[key];
}
 else { console.error('Physical 不存key：'+key); return null;}
 }
 public getAll_Physical_Data() : {[key:number]:Physical}{
 return this.Physical;}
}