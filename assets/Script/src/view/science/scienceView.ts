const {ccclass,property} = cc._decorator;

import Utils from "../../utils/Utils";
import Events from "../../signal/Events";

@ccclass
export default class ScienceView extends cc.Component{
    //场景元素
    @property(cc.Node)
    private btn_close = null;

    //场景模块
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
        this.btn_close.getComponent(cc.Button).clickEvents.push(
            Utils.bindBtnEvent(this.node,"ScienceView","onClose")
        )
    }

    private onClose(e):void{
        this.node.destroy();
    }
}