// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

import ShaderComponent from "./../../libs/shader/ShaderComponent";
import  { ShaderType } from "./../../libs/shader/ShaderManager";

@ccclass
export default class NewClass extends cc.Component {
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        var that = this;
        this.node.on(cc.Node.EventType.TOUCH_START,(event)=>{
            that.addComponent(ShaderComponent).shader = ShaderType.FluxaySuper;
        },this);
        this.node.on(cc.Node.EventType.TOUCH_END,(event)=>{
            let shaderContent = that.getComponent(ShaderComponent);
            if(shaderContent){
                shaderContent.shader = ShaderType.Default;
                shaderContent.destroy();
            }
        },this);
    }

    // update (dt) {}
}
