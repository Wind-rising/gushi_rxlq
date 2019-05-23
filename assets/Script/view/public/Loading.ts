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

@ccclass
export default class Loading extends cc.Component {

    //@property(cc.Label)
    _index: number = 0;

    // LIFE-CYCLE CALLBACKS:
    onLoad () {
        cc.game.addPersistRootNode(this.node);//loading标记为全局的，不能在切换场景的时候被移除
        this.node.active = false;
    }
    
    //onDestroy () {},

    start () {

    }

    // update (dt) {}

    onEnable () {
        //不要立刻显示，过一会
        this.node.opacity = 0;
        this.node.runAction(cc.sequence(cc.delayTime(1.0),cc.fadeIn(1.0)));
    };
    onDisable () {
        this.node.stopAllActions();
    };

    /**
     * 
     * @param content loading如果带文本，这个接口就有用
     */
    show (content:String) {
        this._index ++;
        this.node.active = this._index>0;
    };

    hide () {
        this._index --;
        this.node.active = this._index>0;
    }
}
