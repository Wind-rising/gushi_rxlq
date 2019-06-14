import ItemData from "../../data/ItemData";
import { stringify } from "querystring";
import IconManager from "../../config/IconManager";
import BagItem from "./BagItem";

const {ccclass,property} = cc._decorator;

//背包UI系统
@ccclass
export default class BagPlayerInfo extends cc.Component{
    @property(cc.Sprite)
    private playerImg:cc.Sprite = null;
    @property(cc.Sprite)
    private posUI:cc.Sprite = null;
    @property(cc.Label)
    private score:cc.Label = null;
    @property(cc.Label)
    private price:cc.Label = null;
    @property(cc.Sprite)
    private skill:cc.Sprite = null;
    @property(cc.Sprite)
    private groupskill:cc.Sprite = null;
    private _data;
    private SALARY_LEN = 5;

    public init(data){
        this.playerImg.spriteFrame = null;
        this.posUI.spriteFrame = null;
        this.skill.spriteFrame = null;
        this.groupskill.spriteFrame = null;
        this.score.string = '';
        this.price.string = '';
        this._data = data;
        let info = ItemData.getPlayerInfo(data.ItemCode);
        this.price.string = `工资：${info.Salary}`;
        this.score.string = info.Kp;
        let pos = ItemData.getLabel(info.Position - 0);
        IconManager.getIcon(`img_${pos}`,IconManager.PLAYER_ITEM_ICON,(spriteFrame)=>{
            this.posUI.spriteFrame = spriteFrame;
        })
        IconManager.getIcon(`${info.Pid}`,IconManager.LOTTERY_PIC,(spriteFrame)=>{
            this.playerImg.spriteFrame = spriteFrame;
        })
        if(info.StarSkill){
            IconManager.getIcon(`${info.StarSkill}`,IconManager.SKILL_WORDS,(spriteFrame)=>{
                this.playerImg.spriteFrame = spriteFrame;
            })
        }
        if(info.CombSkill){
            IconManager.getIcon(`${info.CombSkill}`,IconManager.SKILL_WORDS,(spriteFrame)=>{
                this.groupskill.spriteFrame = spriteFrame;
            })
        }

    }
}