const {ccclass,property} = cc._decorator;

import ItemData from "../../data/ItemData"
import Utils from "../../utils/Utils"
import ManagerData from "../../data/ManagerData";
import ScienceViewData from "./data_ScienceViewData"
import Events from "../../signal/Events"

@ccclass
export default class PackageItem extends cc.Component{
    
    @property(cc.Node)
    public pos:cc.Node;
    @property(cc.Node)
    public active_on:cc.Node;
    @property(cc.Node)
    public maxUI:cc.Node;
    @property(cc.Node)
    public upUI:cc.Node;
    @property(cc.Node)
    public thisName:cc.Node;
    public id = "package";

    start(){
        this.node.getComponent(cc.Button).clickEvents.push(
            Utils.bindBtnEvent(this.node,"PackageItem","openEquip")
        )
        Events.getInstance().addListener("PlayerListClick",this.stateChange,this);
    }
    onDestroy(){
        Events.getInstance().removeListener("PlayerListClick",this.stateChange,this);
    }

    public async stateChange(){
        if(ScienceViewData.playerList_ID == this.id){
            this.active_on.active = true;
        }else{
            this.active_on.active = false;
        }
    }
    public openEquip(){
        ScienceViewData.playerList_ID = this.id;
        Events.getInstance().dispatch("PlayerListClick");
    }
}
