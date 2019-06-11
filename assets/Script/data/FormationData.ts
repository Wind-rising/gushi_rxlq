/**
 * 阵型数据
 */
const {ccclass, property} = cc._decorator;

import Singleton from "../Utils/Singleton";
import Events from "../signal/Events";
import LanConfig from "../config/LanConfig";
import Utility from "../utils/Utility";

@ccclass
export default class FormationData extends Singleton {
    //
    private _data:Object;
    //
    private _lvData:Object;
    //
    private URL:string = "Dic_formation_chs.jpg";
    //阵型升级需要的数据
    private FORMATION_LV_URL:string = "def/Dic_formationlv_chs.jpg";

    constructor () {
        super();
        this.init();
    }
    //初始化
    public init():void{
        Events.getInstance().addListener('EventJsonDataLoaded',function(name,data){
            switch(name){
                case this.URL:{
                    this._data = data;
                    break;
                }
                case this.FORMATION_LV_URL:{
                    this._lvData = data;
                    break;
                }
            }
        },this);
    }

    /***/
    private  onError():void{
        Utility.fadeErrorInfo(LanConfig.formationDataErr);
    }
    
    /**获取战术ID*/
    public getFormation(fid:string):Object{
        if(!this._data){
            this.onError();
            return null;
        }
        return this._data[fid];
    }
    
    /**获取升级需要的阅历*/
    public getFormationLvYueli(lv:number):number{
        if(!this._lvData){
            this.onError();
            return null;
        }
        return this._lvData[lv];
    }
}
FormationData.getInstance();