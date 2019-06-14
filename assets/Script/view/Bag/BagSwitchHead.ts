
const LEVEL = cc.Enum({IMAGE:0,CCNODE:1})
const {ccclass,property} = cc._decorator;
import Utility from "../../utils/Utility"
import Events from "../../signal/Events"
@ccclass    
export default class BagSwitchHead extends cc.Component{
     /**
     * 全局变量
     * const LEVEL = cc.Enum({EASY:1,HARD:2});
     */ 
    @property({
        type:LEVEL,
    })
    private active_on_state = LEVEL.IMAGE;
    @property({
        type:cc.SpriteFrame,
    })
    private acitve_on_img:cc.SpriteFrame = null;
    @property({
        type:cc.Node,
    })
    private acitve_on_node:cc.Node = null;
    @property({
        type:LEVEL,
    })
    private active_off_state = LEVEL.IMAGE;
    @property({
        type:cc.SpriteFrame,
    })
    private acitve_off_img:cc.SpriteFrame = null;
    @property({
        type:cc.Node,
    })
    private acitve_off_node:cc.Node = null;
    @property
    private index:number = 0;
    start(){
        this.node.getComponent(cc.Button).clickEvents.push(
            Utility.bindBtnEvent(this.node,"BagSwitchHead","active_on")
        )
    }
    public state = 0;
    public active_on(){
        if(this.state == 1){
            return;
        }
        this.state = 1;
        this.node.getChildByName('word').color = new cc.Color(255, 255, 255);
        switch(this.active_on_state){
            case 0:
                this.node.getComponent(cc.Sprite).spriteFrame = this.acitve_on_img;
                break;
            case 1:
                this.acitve_on_node.active = true;
                this.acitve_off_node.active = false;
                break;
        }
        Events.getInstance().dispatch("BagNavClick",[this.index]);
    }
    public active_off(){
        this.state = 0;
        this.node.getChildByName('word').color = new cc.Color(166, 166, 166);
        switch(this.active_off_state){
            case 0:
                this.node.getComponent(cc.Sprite).spriteFrame = this.acitve_off_img;
                break;
            case 1:
                this.acitve_on_node.active = false;
                this.acitve_off_node.active = true;
                break;
        }
    }
    // @property
    // _eventParams: string = '';
    // @property({
    //     displayName: '事件参数',
    //     tooltip: '触发...',
    //     type: cc.String
    // })
    // get eventParam(): string {
    //     return this._eventParams;
    // }
    // set eventParam(newEventParam: string) {
    //     this.notify(this._eventParams, newEventParam);
    //     this._eventParams = newEventParam;
    // }
    
    // notify(oldEventParam: string, newEventParam: string) {
    //     cc.log(oldEventParam, newEventParam);
    // }

}