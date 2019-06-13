import SkillData from "../../data/SkillData";
import IconManager from "../../config/IconManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SkillItem extends cc.Component {
    @property(cc.Sprite)
    public icon:cc.Sprite;

    private _skillId;
    public uuid;
    public lv;
    public exp;
    public color;
    private MAX_LV = 5;
    private _data;
    
    public static COLOR_1 = 1;
    public static COLOR_2 = 1;
    public static COLOR_3 = 1;
    public static COLOR_4 = 1;
    public static COLOR_5 = 1;

    public static ITEM_EXP = [80,40,20,10];

    constructor(){
        super();
    }

    public create(info = null){
        console.log(info,"info")
        if((typeof info == 'object')){
            this._skillId = info.ItemCode;
            this.exp = info.Exp;
            this.uuid = info.Uuid;
        }else{
            this._skillId = info;
        }
        this.init();
    }
    private init(){
        if(this._skillId != ""||this._skillId != '0'){
            this._data = SkillData.getInstance().getSkillInfo(this._skillId+"");
        }
        if(this._data){
            this.lv = parseInt((this._skillId+"").charAt(this._skillId.length - 1));
            this.color = this._data.Color;
        }
        IconManager.getIcon(this._data.ItemCode+'.png',IconManager.COMM_SKILL,(spriteFrame)=>{
            this.icon.spriteFrame = spriteFrame;
        })
    }
}