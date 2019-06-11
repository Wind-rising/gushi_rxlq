import Utility from "../../utils/Utility";
import BagData from "./BagData";
import BagItem from "./BagItem";
import Events from "../../signal/Events";
import MainData from "../MainData";

const {ccclass,property} = cc._decorator;

@ccclass
export default class BagOtherOperation extends cc.Component{
    @property(cc.Button)
    private buttonSign:cc.Button = null;
    @property(cc.Button)
    private buttonShow:cc.Button = null;
    @property(cc.Button)
    private buttonDiscard:cc.Button = null;

    start(){
        this.buttonSign.clickEvents.push(
            Utility.bindBtnEvent(this.node,"BagOtherOperation","onSign")
        )
        this.buttonShow.clickEvents.push(
            Utility.bindBtnEvent(this.node,"BagOtherOperation","onShow")
        )
        this.buttonDiscard.clickEvents.push(
            Utility.bindBtnEvent(this.node,"BagOtherOperation","onDiscard")
        )
    }
    public onSign(){
        //打开装备界面
        if(!MainData.scienceOpen){
            Utility.showDialog('Science/ScienceView');
            BagData.getInstance().bag.parent.destroy();
            return;
        }
        if(BagData.getInstance().nowType.indexOf(BagItem.TYPE_SIGNER) != -1){
            Events.getInstance().dispatch("signClick",[BagData.getInstance().nowItems._data])
            BagData.getInstance().bag.parent.destroy();
        }
    }
    public onShow(){

    }
    public onDiscard(){

    }
}