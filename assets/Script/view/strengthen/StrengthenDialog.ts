// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


const {ccclass, property} = cc._decorator;

import Utility from "../../utils/Utility";
@ccclass
export default class StrengthenDialog extends cc.Component {

    @property(cc.Node)
    private btn_close:cc.Node = null;

    start () {
        this.btn_close.getComponent(cc.Button).clickEvents.push(Utility.bindBtnEvent(this.node,"StrengthenDialog","onClose")); //增加处理
    }
    public onClose():void{
        this.node.destroy();
    }
}
