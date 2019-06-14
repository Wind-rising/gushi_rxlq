import AppConfig from "../config/AppConfig";
import Singleton from "../Utils/Singleton";
import Events from "../signal/Events";
import ItemData from "./ItemData";

export default class SkillData extends Singleton
{
    /**数据*/
    private   _data:Object;
    //等级数据
    private   _lvData:Object;
    /***/
    private   _callback:Function;
    /***/
    private   _args;
    /**数据地址*/
    private  static URL:String = "Dic_dic_skillcard_chs";
    /**等级地址*/
    private static  LV_URL:String = "Dic_skillcardlv_chs";
    

    constructor(){
        super();
        this.init();
    }
    public init():void{
        Events.getInstance().addListener('EventJsonDataLoaded',function(name,data){
            switch(name){
                case SkillData.URL:
                    this._data = {};
                    for(let i in data){
                        let arr1 = i.split(',');
                        let arr2;
                        let arr3;
                        for(let j in data[i]){
                            arr2 = j.split(',');
                            arr3 = data[i][j].split(',');
                        }
                        this._data[arr1[0]] = {};
                        for(let j = 0;j<arr2.length;j++){
                            this._data[arr1[0]][arr2[j]] = arr3[j];
                        }
                    }
                    break;
                case SkillData.LV_URL:
                    this._lvData = data;
                    break;
            }
        },this);
    }
    
    /**获取技能信息*/
    public getSkillInfo(skillId):Object{
        console.log(this._data)
        return this._data[skillId]; 
    }
    
    /**获取技能卡升级经验*/
    public  getSkillLvExp(cardLv:number, lv:number):Number{
        return this._lvData[cardLv]?this._lvData[cardLv][lv+1]:0;
    }
    
    /**获取技能卡类型*/
    public getSkillType(type:String):String{
        switch(type){
            case "1":
                return "进攻"
                break;
            case "2":
                return "防守"
                break;
            case  "3":
                return "组织"
                break;
        }
        return "进攻"
    }
    
    /**
     * 获取技能html带颜色名称 
     * @param skillId 技能编号
     * @return 带颜色名称
     */		
    public getSkillHtmlName(skillId:String, name:String):String
    {
        var skillName:String = "";
        var data:Object = this.getSkillInfo(skillId);
        if(data)
        {
            skillName =   `<color=${ItemData.getCardColor(parseInt(data.Color)+1)}>${name}</c>`;
        }
        return skillName;
    }
}
SkillData.getInstance();
