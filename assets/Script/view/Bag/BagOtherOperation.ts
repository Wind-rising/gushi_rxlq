import Utils from "../../utils/Utils";
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
            Utils.bindBtnEvent(this.node,"BagOtherOperation","onSign")
        )
        this.buttonShow.clickEvents.push(
            Utils.bindBtnEvent(this.node,"BagOtherOperation","onShow")
        )
        this.buttonDiscard.clickEvents.push(
            Utils.bindBtnEvent(this.node,"BagOtherOperation","onDiscard")
        )
    }
    public onSign(){
        //打开装备界面
        if(!MainData.scienceOpen){
            Utils.showDialog('Science/ScienceView');
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