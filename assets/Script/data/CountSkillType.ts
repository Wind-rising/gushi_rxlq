import Singleton from "../Utils/Singleton";
import Events from "../signal/Events";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class CountSkillType extends Singleton {
    /**数据*/
    private Models:Object;
    private Skills:Object;
    private ShowCombs:Object;
    /***/
    //private _args:Array;
    /**数据地址*/
    private URL:String = "Dic_modelId_chs";

    /**初始化*/
    public init(/*callback:Function=null, args:Array=null*/):void{
        Events.getInstance().addListener('EventJsonDataLoaded',function(name,data){
            if(name == this.URL){
                this.Models = {};
                for(let i = 0;i<data['Models'][0]['Model'].length;i++){
                    let m = data['Models'][0]['Model'][i];
                    this.Models[m['ModelId']] = m;
                }
                this.Skills = {};
                for(let i = 0;i<data['Skills'][0]['Skill'].length;i++){
                    let s = data['Skills'][0]['Skill'][i];
                    this.Models[s['id']] = s;
                }
                this.ShowCombs = {};
                for(let i = 0;i<data['ShowCombs'][0]['Comb'].length;i++){
                    let c = data['ShowCombs'][0]['Comb'][i];
                    this.Models[c['id']] = c;
                }
            }
        },this);
    }
    public getModeResId(skillId:number):string
    {
        return this.Models[skillId - 1]['ResId'];
    }
    
    public getLast(skillId:number):number
    {
        return parseInt(this.Models[skillId - 1]['Last']);
    }
    
    public getModeName(skillId:number):string
    {
        //var skillIdStr:string = this.Models[skillId - 1]['ResId'];			

        // var skillName:string = SkillData.getSkillHtmlName(skillIdStr, this.Models[skillId - 1]['SkillName']);
        
        // return skillName;
        //TODO: get mode name
        return 'skillName';
    }
    
    public getSkillResId(skillId:string):string
    {
        var a:number = parseInt(skillId.substr(1,2));
        var b:number = parseInt(skillId.substr(3));
        
        return this.Skills[(a-1)*3+b-1]['ResId']
    }
    
    public getSkillId(resId:string):string
    {
        return "1" + resId.substr(3, 2) + resId.split("_")[1];
    }
    
    public getSkillName(skillId:number):string
    {
        var skillName:string = this.Skills[skillId%1000 - 1]['SkillName'];
        skillName = "<font color='33FF33'>"+skillName+"</font>"
        return skillName;
    }
    
    public getSkillTarget(skillId:string):number
    {
        var a:number = parseInt(skillId.substr(1,2));
        var b:number = parseInt(skillId.substr(3));
        
        return this.Skills[(a-1)*3+b-1]['Target'];
    }
    
    /**
     * 返回组合玩家的ID
     */
    public getComPlayers(id:number)
    {
        //ID是从57-90；
        id -= 57;
        
        return this.ShowCombs[id]['PlayerIds'].split(",")
    }
}
