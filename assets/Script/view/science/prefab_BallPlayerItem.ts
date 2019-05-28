const {ccclass,property} = cc._decorator;

import ItemData from "../../data/ItemData"
import Utils from "../../utils/Utils"
import ManagerData from "../../data/ManagerData";
import ScienceViewData from "./data_ScienceViewData"
import Events from "../../signal/Events"
import PackageItem from "./prefab_PackageItem"

@ccclass
export default class BallPlayerItem extends PackageItem{

    constructor(){
        super();
    }
    // public onClick(){
    //     this.node.getComponent(cc.Button).clickEvents.push(
    //         Utils.bindBtnEvent(this.node,"prefab_PackageItem","openEquip")
    //     )
    // }

    public change(data){
        if(!ScienceViewData.playerList_ID){
            ScienceViewData.playerList_ID = data.Pid;
        }
        let playerInfo = data.srcData;
        this.thisName.getComponent(cc.RichText).string = "<color="+ItemData.getCardColor(playerInfo.CardLevel)+">"+playerInfo.ShowName+"</c>";
        this.pos.getComponent(cc.Label).string = ItemData.getLabel(playerInfo.Position);
        this.id = data.Pid;
        
        let equipNum = 0;
        let canUp = false;
        let canPair = false;
        for(let i in data.Equip){
            equipNum ++;
            if(data.Equip[i].Lvl<ManagerData.getInstance().Level){
                canUp = true;
            }else{
                canPair = true;
            }
        }
        let canUp2 = false;
        if(!canUp && equipNum == 5){
            canUp2 = true;
        }else{
            canUp2 = false;
        }
        if(ScienceViewData.type == 0){
            this.maxUI.active = canUp2;
        }else if(ScienceViewData.type == 1){
            this.upUI.active = canPair;
        }
        this.active_on.active = false;

        this.stateChange();
    }
}
