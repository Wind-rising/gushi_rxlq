
import Events from "../../signal/Events"
import Utils from "../../utils/Utils"
import PlayerListData from "../../data/PlayerListData"
export default class Page_Content{
    private data:any;
    private url:String;
    private content:cc.Node;
    private componentName:String;
    private callBack:Function;
    public prefabArr = [];
    constructor({
        data = null,//Object 数据
        url,//String prefab地址
        content,//cc.Node 插入壳
        componentName,//String prefab-ts组件名称
        callBack = null//function 回调函数
    }){
        this.data = data;
        this.url = url;
        this.content = content;
        this.componentName = componentName;
        this.callBack = callBack;
        this.addItem();
    }
    public async addItem(){
        let type = Utils.judgeDataType(this.data);
        if(type == "array"){
            for(let i = 0;i<this.data.length;i++){
                let prefab = await this.createPrefab(this.data[i],false);
                this.prefabArr.push(prefab);
            }
            for(let i = 0;i<this.prefabArr.length;i++){
                this.prefabArr[i].parent = this.content;
            }
            this.callBack&&this.callBack();
        }else{
            this.prefabArr.push(this.createPrefab(this.data));
            this.callBack&&this.callBack();
        }
    }
    public async createPrefab(data,isIn = true){
        let prefab = await Utils.insertPrefab(this.url);
        if(prefab.getComponent(this.componentName).change){
            prefab.getComponent(this.componentName).change(data)
        }
        isIn&&(prefab.parent = this.content);
        return prefab;
    }
    public refresh(data){
        let type = Utils.judgeDataType(data);
        if(type == "array"){
            for(let i = 0;i<this.data.length;i++){
                if(this.prefabArr[i].getComponent(this.componentName).change){
                    this.prefabArr[i].getComponent(this.componentName).change(data[i])
                }
            }
        }else{
            if(this.prefabArr[0].getComponent(this.componentName).change){
                this.prefabArr[0].getComponent(this.componentName).change(data)
            }
        }
    }
}