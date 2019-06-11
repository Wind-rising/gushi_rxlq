import Utility from "../../utils/Utility";
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
            Utility.bindBtnEvent(this.node,"BagEquipOperation","onEquip")
        )
        this.buttonUp.clickEvents.push(
            Utility.bindBtnEvent(this.node,"BagEquipOperation","onUp")
        )
        this.buttonWash.clickEvents.push(
            Utility.bindBtnEvent(this.node,"BagEquipOperation","onWash")
        )
        this.buttonShow.clickEvents.push(
            Utility.bindBtnEvent(this.node,"BagEquipOperation","onShow")
        )
        this.buttonDiscard.clickEvents.push(
            Utility.bindBtnEvent(this.node,"BagEquipOperation","onDiscard")
        )
    }
    public onEquip(){
        //打开装备界面
    }
    public onUp(){
        if(!MainData.scienceOpen){
            Utility.showDialog('Science/ScienceView');
            BagData.getInstance().bag.parent.destroy();
            return;
        }
    }
    public onWash(){
        
        if(!MainData.scienceOpen){
            Utility.showDialog('Science/ScienceView');
            BagData.getInstance().bag.parent.destroy();
            return;
        }
    }
    public onShow(){

    }
    public onDiscard(){

    }
}