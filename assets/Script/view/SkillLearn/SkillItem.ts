import SkillData from "../../data/SkillData";
import IconManager from "../../config/IconManager";
import Events from "../../signal/Events";
import SkillLearnModel from "./SkillLearnModel";
import Utility from "../../utils/Utility";
import SkillLearnView from "./SkillLearnView";
import Dragger from "../control/Dragger";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SkillItem extends cc.Component {
    @property(cc.Sprite)
    public icon:cc.Sprite;

    private _skillId;
    private _uuid;
    public lv;
    public exp;
    public color;
    private MAX_LV = 5;
    public _data;
    private _index;
    
    public static COLOR_1 = 1;
    public static COLOR_2 = 2;
    public static COLOR_3 = 3;
    public static COLOR_4 = 4;
    public static COLOR_5 = 5;

    public static ITEM_EXP = [80,40,20,10];

    public set uuid(val){
        this._uuid = val;
    }
    public get uuid(){
        return this._uuid;
    }
    constructor(){
        super();
    }
    start(){
        this.node.on('drag2',this.onClick,this)
    }
    public create({info = null,index = -1,type = 0}){
        // this._data = info;
        this._index = index;
        if(type){
            this.node.removeComponent(Dragger)
        }
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
            IconManager.getIcon(this._data.ItemCode+'',IconManager.COMM_SKILL,(spriteFrame)=>{
                this.icon.spriteFrame = spriteFrame;
            })
        }
    }
    private onClick(location){
        if(SkillLearnModel.skillBag.getBoundingBoxToWorld().contains(location)){
            Events.getInstance().dispatch(SkillLearnModel.EventSkillItemClick,[this._index])
        }
    }
}