const {ccclass,property} = cc._decorator;

import ItemData from "../../data/ItemData"
import Utils from "../../utils/Utils"
import ManagerData from "../../data/ManagerData";
import ScienceData from "./data_science"
import Events from "../../signal/Events"
import IconManager from "../../config/IconManager"
import EquipData from "../../data/EquipData"

@ccclass
export default class prefab_Equip extends cc.Component{
    
    @property(cc.Node)
    public EName:cc.Node;
    @property(cc.SpriteFrame)
    public active_on:cc.SpriteFrame;
    @property(cc.SpriteFrame)
    public active_off:cc.SpriteFrame;
    @property(cc.Node)
    public maxUI:cc.Node;
    @property(cc.Node)
    public LevelUI:cc.Node;
    @property(cc.Node)
    public bg:cc.Node;
    @property(cc.Node)
    public pic:cc.Node;
    public id;
    public _data;
    public _itemData;
    public index;

    start(){
        this.onClick();
    }
    onDestroy(){
        // Events.getInstance().removeListener("PlayerListClick",this.stateChange,this);
    }
    public onClick(){
        this.node.getComponent(cc.Button).clickEvents.push(
            Utils.bindBtnEvent(this.node,"prefab_Equip","openEquip")
        )
    }

    public async stateChange(){
        if(ScienceData.selectEquip&&(ScienceData.selectEquip.id == this.id)){
            this.bg.getComponent(cc.Sprite).spriteFrame = this.active_on;
        }else{
            this.bg.getComponent(cc.Sprite).spriteFrame = this.active_off;
        }
    }
    public openEquip(){
        ScienceData.equipIndex = this.index;
        ScienceData.selectEquip = this;
        Events.getInstance().dispatch("equipListClick");
    }
    public change(data,i){
        this.id = data.Uuid;
        this._data = data;
        this.index = i;
        if(data.hasOwnProperty('Ruby')){
            IconManager.getIcon('1',IconManager.ITEM_ICON,(spriteFrame)=>{
                this.pic.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            })
            this._itemData = EquipData.getRingPro(data.Type);
            this.EName.getComponent(cc.RichText).string =  `<color=${ItemData.getEquipColor(8)}>总冠军戒指</c>`
        }else{
            IconManager.getIcon(data.Type+(data.Pair),IconManager.EQUP_ICON,(spriteFrame)=>{
                this.pic.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            })
            this._itemData = ItemData.getEquipInfo(data.Type+String(data.Pair));
            this.EName.getComponent(cc.RichText).string =  `<color=${ItemData.getEquipColor(data.Pair)}>${this._itemData.Name}</c>`
        }
        this.LevelUI.getComponent(cc.Label).string = "LV"+this.Lvl;
        if(this.Lvl == ManagerData.getInstance().Level){
            this.maxUI.active = true;
        }else{
            this.maxUI.active = false;
        }
    }
    public get Lvl(){
        return Math.max(this._data.Lvl,1)
    }
}
