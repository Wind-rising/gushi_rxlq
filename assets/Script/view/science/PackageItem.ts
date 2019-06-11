const {ccclass,property} = cc._decorator;

import Utils from "../../utils/Utils"
import ScienceData from "./ScienceData"
import Events from "../../signal/Events"

@ccclass
export default class PackageItem extends cc.Component{
    
    @property(cc.Node)
    public pos:cc.Node = null;
    @property(cc.Node)
    public active_on:cc.Node = null;
    @property(cc.Node)
    public maxUI:cc.Node = null;
    @property(cc.Node)
    public upUI:cc.Node = null;
    @property(cc.Node)
    public thisName:cc.Node = null;
    public id = "BAG";
    public _data;

    start(){
        this.onClick();
    }
    public onClick(){
        this.node.getComponent(cc.Button).clickEvents.push(
            Utils.bindBtnEvent(this.node,"PackageItem","openEquip")
        )
    }

    public  stateChange(){
        if(ScienceData.player_id == this.id){
            this.active_on.active = true;
        }else{
            this.active_on.active = false;
        }
    }
    public openEquip(){
        if(ScienceData.player_id == this.id)return;
        ScienceData.player_id = this.id;
        ScienceData.playerEquip = this._data;
        ScienceData.selectPlayer = this;
        Events.getInstance().dispatch(ScienceData.EventChange);
    }
    public change(data){
        this._data = data;
    }
}
