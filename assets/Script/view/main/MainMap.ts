import Events from "../../signal/Events";
import EventConst from "../../data/EventConst";

/**
 * 主场景地图
 */
const {ccclass, property} = cc._decorator;

@ccclass
export default class MainMap extends cc.Component {

    @property
    EventListenerTag: string = 'MainMapListener';

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        Events.getInstance().addListener(EventConst.SHOW_MAIN,()=>{
            this.node.active = true;
        },this,this.EventListenerTag);
        Events.getInstance().addListener(EventConst.CLOSE_MAIN,()=>{
            this.node.active = false;
        },this,this.EventListenerTag);
    }

    onDestroy () {
        Events.getInstance().removeByTag(this.EventListenerTag);
    }

    start () {

    }

    // update (dt) {}
}
