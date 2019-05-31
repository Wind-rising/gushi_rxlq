
import switch_content from "./switch_content";
import ScienceData from "./data_science"
import ItemData from "../../data/ItemData"
import ManagerData from "../../data/ManagerData";
import Utils from "../../utils/Utils"
import URLConfig from "../../config/URLConfig"
import HttpManager from "../../utils/HttpManager"
import Events from "../../signal/Events";
const {ccclass,property} = cc._decorator;

@ccclass    
export default class StrengthCom extends switch_content{
    @property(cc.Node)
    private icon:cc.Node;
    @property(cc.Node)
    private EName:cc.Node;
    @property(cc.Node)
    private levelUI:cc.Node;
    @property(cc.Node)
    private moneyUI:cc.Node;
    @property(cc.Node)
    private upButton:cc.Node;
    @property(cc.Node)
    private upFiveButton:cc.Node;

    private _remainTimes = 0;
    start(){
        this.onClick()
    }
    public onClick(){
        this.upButton.getComponent(cc.Button).clickEvents.push(
            Utils.bindBtnEvent(this.node,"switch_content","onClickUp",1)
        )
        this.upFiveButton.getComponent(cc.Button).clickEvents.push(
            Utils.bindBtnEvent(this.node,"switch_content","onClickUp",5)
        )
    }
    public show(isFresh = false){
        super.show();
        isFresh&&this.setSelectItem(true);
    }
    public setSelectItem(isClear = false){
        if(isClear){
            this.icon.getComponent(cc.Sprite).spriteFrame = null;
            this.EName.getComponent(cc.RichText).string = "";
            this.levelUI.getComponent(cc.Label).string = "";
            this.moneyUI.getComponent(cc.Label).string = "";
            this.upButton.getComponent(cc.Button).interactable = false;
            this.upFiveButton.getComponent(cc.Button).interactable = false;
        }
        if(ScienceData.selectEquip){
            this.upButton.getComponent(cc.Button).interactable = true;
            this.upFiveButton.getComponent(cc.Button).interactable = true;
            let selectEquip = ScienceData.selectEquip;
            this.icon.getComponent(cc.Sprite).spriteFrame = selectEquip.pic.getComponent(cc.Sprite).spriteFrame;
            this.EName.getComponent(cc.RichText).string = selectEquip.EName.getComponent(cc.RichText).string;
            this.levelUI.getComponent(cc.Label).string = "装备等级"+selectEquip.Lvl;
            this.moneyUI.getComponent(cc.Label).string = "消耗金币："+ItemData.getStrMoney(selectEquip.Lvl , selectEquip._data.Pair);
            if(selectEquip.Lvl >= ScienceData.EQUIP_MAX_LV){
                this.moneyUI.getComponent(cc.Label).string = "已到最高等级";
            }
        }
    }
    public onClickUp(e,num){
        if(!ScienceData.selectEquip)return;//提示暂无装备
        if(ScienceData.selectEquip.Lvl == ManagerData.getInstance().Level){
            this._remainTimes = 0;
        }else{
            this._remainTimes = num;
        }
        this.Strength();
    }
    private Strength(){
        if(ScienceData.selectEquip.Lvl == ManagerData.getInstance().Level){
            console.log("装备等级不能超过经理等级!")
            Utils.showAlert("装备等级不能超过经理等级!");
            if(this._remainTimes != 0){
                this._remainTimes = 0;
                Events.getInstance().dispatch("ScienceUpDate")
            }
        }else{
            var srvArgs = {action:URLConfig.Post_Equip_Strengthen,args:{
                Source:ScienceData.selectPlayer._data.Tid,
                Uuid:ScienceData.selectEquip.id
            }};
            HttpManager.getInstance().request(srvArgs,this.onStrength,this);
        }
    }
    private onStrength(data){
        if(data.res){
            if(ScienceData.selectPlayer._data.Tid){
                // ScienceData.selectPlayer.ScienceData.equipIndex
                ScienceData.selectPlayer._data.Equip[ScienceData.equipIndex] = data.data.SyncData.Equip;
                ManagerData.getInstance().refreshKP();
            }else{
                //背包
            }
            ManagerData.getInstance().Money = data.data.SyncData.Money;
            if(data.data && data.data.SyncData.Score){
                ManagerData.getInstance().Score = parseInt(data.data.SyncData.Score);
            }
            ScienceData.selectEquip._data = data.data.SyncData.Equip;
            ScienceData.playerEquip[ScienceData.equipListPageIndex*ScienceData.equipListNum+ScienceData.equipIndex] = data.data.SyncData.Equip;
            this.setSelectItem();
        }
        this._remainTimes--;
        if(this._remainTimes>0){
            this.Strength();
        }else if(this._remainTimes<=0){
            Events.getInstance().dispatch("ScienceUpDate")
        }
    }
}