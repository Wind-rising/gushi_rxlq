
/**
 * 球员管理-球员成长数据
 */

const {ccclass, property} = cc._decorator;

import Singleton from "../Utils/Singleton";
import Events from "../signal/Events";

@ccclass
export default class TeamGrowthData extends Singleton {

    private data:Object;

    /**数据地址*/
    private URL:string = "Dic_playergrowsp_chs";
    constructor(){
        super();
        this.init();
    }
    public init():void{
        Events.getInstance().addListener('EventJsonDataLoaded',function(name,data){
            if(name == this.URL){
                this.data = data;
            }
        },this);
    }
    /**
     * 获取升级需要的灵气
     * */
    public getLvSp(lv:number, type:number = 1):number{
        return this.data[''+type][lv];
    }
}
TeamGrowthData.getInstance();
