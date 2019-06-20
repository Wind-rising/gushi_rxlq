/**
 * VIP提升概率
 */
const {ccclass, property} = cc._decorator;
import Singleton from "../Utils/Singleton";
import Events from "../signal/Events";
import ManagerData from "./ManagerData";
@ccclass
export default class VipRateData extends Singleton {

    private data:Object;

    /**数据地址*/
    private URL:string = "Dic_vip_chs";
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
    /**获取强化VIP加成*/
    public getStrengthRate(rate:number):string{
        let key:string = "LEVEL_" + this.vipLevel;
        if(this.data['STRENGTHEN'][key]){
            return "<font color='#00ff00'>+"+Math.round(this.data['STRENGTHEN'][key]*rate/100)+"%</font>";
            //return "<font color='#00ff00'>+"+_data.STRENGTHEN[key]+"%</font>";
        }
        return "";
    }
    
    /**获取合成VIP加成*/
    public getComposeRate(rate:number):string{
        let key:string = "LEVEL_" + this.vipLevel;
        if(this.data['MERGE'][key]){
            return "<font color='#00ff00'>+"+Math.round(this.data['MERGE'][key]*rate/100)+"%</font>";
            //return "<font color='#00ff00'>+"+_data.MERGE[key]+"%</font>";
        }
        return "";
    }
    
    /**获取强化VIP加成*/
    public getGrowthRate(rate:number):string{
        let key:string = "LEVEL_"+this.vipLevel;
        if(this.data['GROW'][key]){
            return "<font color='#00ff00'>+"+Math.round(this.data['GROW'][key]*rate/100)+"%</font>";
            //return "<font color='#00ff00'>+"+_data.GROW[key]+"%</font>";
        }
        return "";
    }
    /***/
    public get vipLevel():number{
        return ManagerData.getInstance().Vip;
    }
}

VipRateData.getInstance()