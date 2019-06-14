/**
 * 拖拽组件
 */
const {ccclass, property} = cc._decorator;

@ccclass
export default class Dragger extends cc.Component {
    /**
     * 保存节点列表
     */
    private static drawNodeList:Object = {};
    // LIFE-CYCLE CALLBACKS:

    /** 点击状态 */
    private downState:boolean = false;

    private prevOpacity:number;

    private dragNode:cc.Node = null;
    
    onLoad () {
        this.prevOpacity = this.node.opacity;
    }

    start () {
        /** 触摸 */
        this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            this.onStart(event);
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            this.onMove(event);
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            this.onEnd(event);
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
            this.onEnd(event);
        }, this);

        /** 鼠标 */
        // this.node.on(cc.Node.EventType.MOUSE_DOWN, function (event) {
        //     this.onStart(event);
        // }, this);
        // this.node.on(cc.Node.EventType.MOUSE_MOVE, function (event) {
        //     this.onMove(event);
        // }, this);
        // this.node.on(cc.Node.EventType.MOUSE_UP, function (event) {
        //     this.onEnd(event);
        // }, this);

    }

    onEnable() {
        Dragger.drawNodeList[this.node.uuid] = this.node;
    }

    onDisable () {
        delete Dragger.drawNodeList[this.node.uuid];
    }

    // update (dt) {}

    onStart (event:cc.Event.EventTouch){
        if(this.dragNode){
            this.dragNode.destroy();
            this.dragNode = null;
        }
        /** 复制一个拖拽效果的节点 */
        this.dragNode = cc.instantiate(this.node);
        this.dragNode.removeComponent(Dragger);//复制的节点不能在挂载拖拽组件
        this.dragNode.zIndex = 1000;
        this.dragNode.position = this.node.parent.convertToWorldSpaceAR(this.dragNode.position);
        this.dragNode.parent = cc.director.getScene();

        this.node.opacity -= 80;
        this.downState = true;
    }
    onMove (event:cc.Event.EventTouch) {
        if (!this.downState) {
            return;
        }
        let delta = event.touch.getDelta();
        this.dragNode.x += delta.x;
        this.dragNode.y += delta.y;
    }
    onEnd (event:cc.Event.EventTouch) {
        if (!this.downState) {
            return;
        }
        let location = event.touch.getLocation();
        this.node.emit('drag2',location);
        for(let key in Dragger.drawNodeList){
            if(key != this.node.uuid){
                let dragNode = Dragger.drawNodeList[key];
                if(dragNode.getBoundingBoxToWorld().contains(location)){
                    //需要接收点击事件的节点侦听drag事件
                    dragNode.emit('drag',this.node);
                    break;
                }
            }
        }

        if(this.dragNode){
            this.dragNode.destroy();
            this.dragNode = null;
        }
        this.node.opacity = this.prevOpacity;
        this.downState = false;
    }
}
