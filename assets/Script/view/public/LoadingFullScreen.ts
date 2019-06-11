import CountController from "../../controllor/CountController";
import Utility from "../../utils/Utility";

/**
 * 加载数据
 */
const {ccclass, property} = cc._decorator;

@ccclass
export default class LoadingFullScreen extends cc.Component {

    /** 保存当前对象 */
    static instance:LoadingFullScreen = null;

    /**
     * 加载进度
     * 0-0.7   percent 0-100
     */
    @property(cc.Sprite)
    img_loading: cc.Sprite = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        LoadingFullScreen.instance = this;
    }
    onDestroy () {
        LoadingFullScreen.instance = null;
    }

    start () {
        this.img_loading.fillRange = 0;
    }

    update (dt) {
        this.img_loading.fillRange = 0.7*CountController.getInstance().loadingProgress/100;
        // if(this.img_loading.fillRange>=0.7){
        //     this.node.runAction(cc.sequence(cc.delayTime(0.5),cc.fadeOut(0.5),cc.callFunc(function(){
        //         this.node.destory();
        //     },this)));
        // }
    }

    /**
     * 
     * @param percent 0-100
     */
    public updateProgress (percent){
        if(!LoadingFullScreen.instance){
            LoadingFullScreen.fadeIn();
            return;
        }
        this.img_loading.fillRange = 0.7*CountController.getInstance().loadingProgress/100;
    }

    /**
     * 显示 关闭加载战报页
     */
    public static fadeIn(callBack?:Function) {
        //已经存在了，不再显示
        if(this.instance){
            return;
        }
        Utility.showDialog('match/LoadingDialog',{callBack:callBack});
    }

    public static fadeOut () {
        if(!this.instance){
            return;
        }
        this.instance.node.runAction(cc.sequence(cc.fadeOut(0.5),cc.callFunc(function(){
            this.instance.node.destroy();
        },this)));
    }
}
