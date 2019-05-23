const {ccclass,property} = cc._decorator;

import Utils from "../../utils/Utils";

@ccclass
export default class ScienceDialog extends cc.Component{
    //场景元素
    @property(cc.Node)
    private btn_close = null;
    //场景模块
    private module_switch;
    private module_playList;
    private module_equipment;
    private module_upgrade;
    private module_reform;
    private module_wash;
    private module_sign;


    onLoad(){

    }
    onDestroy(){

    }

    start(){
        console.log(this.btn_close.getComponent(cc.Button).node,"this.btn_close")
        this.btn_close.getComponent(cc.Button).clickEvents.push(
            Utils.bindBtnEvent(this.node,"ScienceDialog","onClose")
        )
        // this.btn_close.getComponent(cc.Button).node.on('click',this.onClose,this);
    }

    public onClose(e):void{
        this.node.destroy();
    }
}