/**
 * 主界面UI控制脚本
 */
const {ccclass, property} = cc._decorator;
import Utility from "../../utils/Utility";
import Events from "../../signal/Events";
import EventConst from "../../data/EventConst";
import MainControllor from "../../controllor/MainControllor";
import PlayerControllor from "../../controllor/PlayerControllor";
@ccclass
export default class GameHud extends cc.Component {

    // LIFE-CYCLE CALLBACKS:
    EventListenerTag:string = 'GameHudListener';
    @property(cc.Node)
    private btn_Player_Strengthen = null;
    @property(cc.Node)
    private btn_Science = null;
    @property(cc.Button)
    private btn_Bag = null;

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

        this.btn_Player_Strengthen.getComponent(cc.Button).clickEvents.push(
            Utility.bindBtnEvent(this.node,"GameHud","onShowPlayerStrengthenView")
        );
        this.btn_Science.getComponent(cc.Button).clickEvents.push(
            Utility.bindBtnEvent(this.node,"GameHud","onShowScienceView")
        );

        /** 球员按钮 */
        bottom_right.getChildByName('btn_player').getComponent(cc.Button).clickEvents.push(
            Utility.bindBtnEvent(this.node,'GameHud','onShowPlayer')
        )
        
        this.btn_Bag.clickEvents.push(
            Utility.bindBtnEvent(this.node,"GameHud","onShowBag")
        );
    }

    /**
     * 
     * @param data 显示聊天信息，需要换个地方加，先这么放着
     */
    public onShowMsg(data):void{
        //
    }

    public onShowBag(){
        Utility.showDialog('bag/Bag');
    }
    public onShowPlayerStrengthenView():void{
        Utility.showDialog('StrengthenView');
    }
    public onShowScienceView():void{
        Utility.showDialog('Science/ScienceView');
    }


    // btnClick2(e){
    //     //全局事件
    //     //显示加载效果
    //     Utils.showLoading();
    //     setTimeout(function(){
    //         Utils.hideLoading();
    //     },2000);
    // };
    btnClick3(e){
        // Utils.alert('这是一个全局提示框',function(){
        //     console.log('点击OK按钮');
        // },{title:'提示11'});
        Utility.fadeErrorInfo('Utils.fadeInfo');
    };

    btnShowTactics(e){
        Utility.showDialog('TacticsView');
    };

    onShowPlayer (e){
        PlayerControllor.getInstance().showPlayer();
    }

    btnClick4(e){
    }
    // update (dt) {}
}
