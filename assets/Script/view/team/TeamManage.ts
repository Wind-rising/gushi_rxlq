
/**
 * @author zzb
 * 
 * 球员界面主场景脚本，处理部分通用功能
 */
const {ccclass, property} = cc._decorator;

import Utility from "../../utils/Utility";
import TabsPage from "../control/TabsPage";
import PlayerControllor from "../../controllor/PlayerControllor";

@ccclass
export default class TeamManage extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        //设置当前选中标签页
        this.node.getChildByName('img_shortcat_bar').getComponent(TabsPage).index = PlayerControllor.getInstance().playerPageIndex;

        let img_shortcat_bar = this.node.getChildByName('img_shortcat_bar');
        let btn_2 = img_shortcat_bar.getChildByName('btn_2');
        let btn_5 = img_shortcat_bar.getChildByName('btn_5');

        //战术研究
        btn_2.getComponent(cc.Button).clickEvents.push(
            Utility.bindBtnEvent(this.node,'TeamManage','onShowTaticsResearch')
        );
        //背包
        btn_5.getComponent(cc.Button).clickEvents.push(
            Utility.bindBtnEvent(this.node,'TeamManage','onShowPackage')
        );

    }

    start () {

    }

    // update (dt) {}

    /**
     * 背包按钮
     */
    onShowPackage (e){

    }

    /**
     * 显示战术研究
     */
    onShowTaticsResearch(e){
        //
    }
}
