/**
 * 球星技能
 */
const {ccclass, property} = cc._decorator;
import Singleton from "../Utils/Singleton";
import Events from "../signal/Events";
@ccclass
export default class StarSkillData extends Singleton {
    /**数据*/
    private data:Object;
    /**数据地址*/
    private URL:string = "Dic_starskills_chs";
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
    /**获取技能信息*/
    public getSkillInfo(skillId:string, playerLv:number):Object{
        if(!skillId){
            return null;
        }
        var index:number = 0;
        if(playerLv >= 9){
            index = 3;
        }else if(playerLv >= 7){
            index = 2;
        }else {
            index = 1;
        }
        return this.data[skillId+"_"+index];
    }
}
StarSkillData.getInstance();