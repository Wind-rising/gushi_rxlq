import Utils from "../../utils/Utils";

const {ccclass,property} = cc._decorator;

@ccclass
export default class bagOther_Button extends cc.Component{
    @property(cc.Button)
    private buttonSign:cc.Button;
    @property(cc.Button)
    private buttonShow:cc.Button;
    @property(cc.Button)
    private buttonDiscard:cc.Button;

    start(){
        this.buttonSign.clickEvents.push(
            Utils.bindBtnEvent(this.node,"bagOther_Button","onSign")
        )
        this.buttonShow.clickEvents.push(
            Utils.bindBtnEvent(this.node,"bagOther_Button","onShow")
        )
        this.buttonDiscard.clickEvents.push(
            Utils.bindBtnEvent(this.node,"bagOther_Button","onDiscard")
        )
    }
    public onSign(){
        //打开装备界面
    }
    public onShow(){

    }
    public onDiscard(){

    }
}