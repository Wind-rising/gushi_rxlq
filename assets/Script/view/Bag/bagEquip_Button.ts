import Utils from "../../utils/Utils";

const {ccclass,property} = cc._decorator;

@ccclass
export default class bagEquip_Button extends cc.Component{
    @property(cc.Button)
    private buttonEquip:cc.Button;
    @property(cc.Button)
    private buttonUp:cc.Button;
    @property(cc.Button)
    private buttonWash:cc.Button;
    @property(cc.Button)
    private buttonShow:cc.Button;
    @property(cc.Button)
    private buttonDiscard:cc.Button;

    start(){
        this.buttonEquip.clickEvents.push(
            Utils.bindBtnEvent(this.node,"bagEquip_Button","onEquip")
        )
        this.buttonUp.clickEvents.push(
            Utils.bindBtnEvent(this.node,"bagEquip_Button","onUp")
        )
        this.buttonWash.clickEvents.push(
            Utils.bindBtnEvent(this.node,"bagEquip_Button","onWash")
        )
        this.buttonShow.clickEvents.push(
            Utils.bindBtnEvent(this.node,"bagEquip_Button","onShow")
        )
        this.buttonDiscard.clickEvents.push(
            Utils.bindBtnEvent(this.node,"bagEquip_Button","onDiscard")
        )
    }
    public onEquip(){
        //打开装备界面
    }
    public onUp(){

    }
    public onWash(){
        
    }
    public onShow(){

    }
    public onDiscard(){

    }
}