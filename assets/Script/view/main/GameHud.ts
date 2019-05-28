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
import Utils from "../../utils/Utils";
import Events from "../../signal/Events";
import EventConst from "../../data/EventConst";
@ccclass
export default class GameHud extends cc.Component {

    // LIFE-CYCLE CALLBACKS:
    EventListenerTag:string = 'GameHudListener';
    @property(cc.Node)
    private btn_Player_Strengthen = null;
    @property(cc.Node)
    private btn_Science = null;

    onLoad () {
        Events.getInstance().addListener(EventConst.SHOW_MSG, this.onShowMsg,this,this.EventListenerTag);
        Events.getInstance().addListener(EventConst.SHOW_MAIN,()=>{
            this.node.active = true;
        },this,this.EventListenerTag);
        Events.getInstance().addListener(EventConst.CLOSE_MAIN,()=>{
            this.node.active = false;
        },this,this.EventListenerTag);
    }

    onDestroy(){
        Events.getInstance().removeByTag(this.EventListenerTag);
    }

    start () {
        var bottom_right = this.node.getChildByName('bottom_right').getChildByName('button_wrap');
        //绑定按钮事件，不一定全部要这么写，但是尽量
        var clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = this.node; //这个 node 节点是你的事件处理代码组件所属的节点，这里就是Button2
        clickEventHandler.component = "GameHud";//这个是脚本文件名
        clickEventHandler.handler = "btnClick2"; //回调函名称
        clickEventHandler.customEventData = "click2 user data"; //用户数据

        var button = bottom_right.getChildByName('button1').getComponent(cc.Button); //获取cc.Button组件
        button.clickEvents.push(clickEventHandler); //增加处理


        this.btn_Player_Strengthen.getComponent(cc.Button).clickEvents.push(
            Utils.bindBtnEvent(this.node,"GameHud","onShowPlayerStrengthenView")
        );
        this.btn_Science.getComponent(cc.Button).clickEvents.push(
            Utils.bindBtnEvent(this.node,"GameHud","onShowScienceView")
        );
    }

    /**
     * 
     * @param data 显示聊天信息，需要换个地方加，先这么放着
     */
    public onShowMsg(data):void{
        //
    }

    public onShowPlayerStrengthenView():void{
        Utils.showDialog('StrengthenView');
    }
    public onShowScienceView():void{
        Utils.showDialog('Science/ScienceView');
    }


    btnClick2(e){
        //全局事件
        //显示加载效果
        Utils.showLoading();
        setTimeout(function(){
            Utils.hideLoading();
        },2000);
    };
    btnClick3(e){
        // Utils.alert('这是一个全局提示框',function(){
        //     console.log('点击OK按钮');
        // },{title:'提示11'});
        Utils.fadeErrorInfo('Utils.fadeInfo');
    };

    btnShowTactics(e){
        Utils.showDialog('TacticsView');
    };

    btnClick4(e){
        cc.director.loadScene('BattleScene');
    }
    // update (dt) {}
}
