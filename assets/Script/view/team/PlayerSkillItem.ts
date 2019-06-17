import IconManager from "../../config/IconManager";
import SkillData from "../../data/SkillData";

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
export default class PlayerSkillItem extends cc.Component {

    // LIFE-CYCLE CALLBACKS:
    private skillId:string
    //uuid
    public uuid:string;
    public lv:number;
    public exp:number=0
    public data;
    //技能颜色
    public color:number;
    //技能卡最搞等级
    private MAX_LV:number = 5;
    
    /**技能卡品质*/
    public static COLOR_1:number = 1;
    public static COLOR_2:number = 2;
    public static COLOR_3:number = 3;
    public static COLOR_4:number = 4;
    public static COLOR_5:number = 5;
    /**
    * 绿色：10点技能经验
    * 蓝色：20点技能经验
    * 紫色：40点技能经验
    * 橙色：80点技能经验
    */
    public static ITEM_EXP:Array<number> = [80,40,20,10];

    // onLoad () {}

    start () {
        this.node.getComponent(cc.Sprite).spriteFrame = null;
    }

    // update (dt) {}

    formatSkillData (info:Object = null){
        if(info&&info.hasOwnProperty("ItemCode")){
            this.skillId = info['ItemCode'];
            this.exp = info['Exp'];
            this.uuid = info['Uuid']
        }else{
            this.skillId = '';
        }
        this.refresh();
    }

    private refresh():void{
        if(this.skillId != '' && this.skillId != '0'){
            this.data = SkillData.getInstance().getSkillInfo(this.skillId);
            if(this.data){
                this.lv=parseInt(this.data.charAt(this.skillId.length-1));
                this.color = this.data.Color;
                //设置图标
                IconManager.getIcon(this.data['ItemCode'], IconManager.COMM_SKILL, (spriteFrame)=>{
                    this.node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                });
            }
        }else{
            this.node.getComponent(cc.Sprite).spriteFrame = null;
        }
        
    }
    //获得总经验
    public get totalExp():number{
        var num:number = this.exp;
        num += PlayerSkillItem.ITEM_EXP[this.color-1];
        return num;
    }
}
