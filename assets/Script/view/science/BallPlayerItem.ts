const {ccclass,property} = cc._decorator;

import ItemData from "../../data/ItemData"
import ManagerData from "../../data/ManagerData";
import ScienceData from "./ScienceData"
import PackageItem from "./PackageItem"

@ccclass
export default class BallPlayerItem extends PackageItem{

    constructor(){
        super();
    }

    public change(data){
        super.change(data);
        if(!ScienceData.player_id){
            ScienceData.player_id = data.Pid;
        }
        let playerInfo = data.srcData;
        this.thisName.getComponent(cc.RichText).string = "<color="+ItemData.getInstance().getCardColor(playerInfo.CardLevel)+">"+playerInfo.ShowName+"</c>";
        this.pos.getComponent(cc.Label).string = ItemData.getInstance().getLabel(playerInfo.Position);
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
        if(ScienceData.index == 0){
            this.maxUI.active = canUp2;
        }else if(ScienceData.index == 1){
            this.upUI.active = canPair;
        }
        this.active_on.active = false;

        this.stateChange();
    }
}
