import Utils from "../../utils/Utils";
import MainData from "../MainData";
import BagData from "./BagData";

const {ccclass,property} = cc._decorator;

@ccclass
export default class BagEquipOperation extends cc.Component{
    @property(cc.Button)
    private buttonEquip:cc.Button = null;
    @property(cc.Button)
    private buttonUp:cc.Button = null;
    @property(cc.Button)
    private buttonWash:cc.Button = null;
    @property(cc.Button)
    private buttonShow:cc.Button = null;
    @property(cc.Button)
    private buttonDiscard:cc.Button = null;

    start(){
        this.buttonEquip.clickEvents.push(
            Utils.bindBtnEvent(this.node,"BagEquipOperation","onEquip")
        )
        this.buttonUp.clickEvents.push(
            Utils.bindBtnEvent(this.node,"BagEquipOperation","onUp")
        )
        this.buttonWash.clickEvents.push(
            Utils.bindBtnEvent(this.node,"BagEquipOperation","onWash")
        )
        this.buttonShow.clickEvents.push(
            Utils.bindBtnEvent(this.node,"BagEquipOperation","onShow")
        )
        this.buttonDiscard.clickEvents.push(
            Utils.bindBtnEvent(this.node,"BagEquipOperation","onDiscard")
        )
    }
    public onEquip(){
        //打开装备界面
    }
    public onUp(){
        if(!MainData.scienceOpen){
            Utils.showDialog('Science/ScienceView');
            BagData.getInstance().bag.parent.destroy();
            return;
        }
    }
    public onWash(){
        
        if(!MainData.scienceOpen){
            Utils.showDialog('Science/ScienceView');
            BagData.getInstance().bag.parent.destroy();
            return;
        }
    }
    public onShow(){

    }
    public onDiscard(){

    }
}