/**
 * 加载数据
 */
const {ccclass, property} = cc._decorator;

@ccclass
export default class LoadingFullScreen extends cc.Component {

    /**
     * 加载进度
     * 0-0.7   percent 0-100
     */
    @property(cc.Sprite)
    img_loading: cc.Sprite = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.img_loading.fillRange = 0;
    }

    /**
     * 设置百分比
     */
    public set fillRange(value:number){
        this.img_loading.fillRange = value;
    }
}
