/**
 * 球员信息控制类
 */
const {ccclass, property} = cc._decorator;
import Singleton from "../Utils/Singleton";
import Utility from "../utils/Utility";
@ccclass
export default class PlayerControllor extends Singleton {

    //----------------------------------------------------
    //战术设置
    /** 0 战术设置 1 球员管理 2 球队天赋 3 意志组合 */
    public playerPageIndex:number = 0;
    /** 战术设置选中第几节 */
    public tacticsSection:number = 0;
    /** 替补球员列表显示第几页 */
    public tempPlayerPage:number = 0;
    //------------------------------------------------------
    /**
     * 球员信息页面
     * @param index 显示哪个页面  
     */
    public showPlayer (index:number = 0){
        this.playerPageIndex = index;
        Utility.showDialog('player/TeamManager');
    }

    /**
     * 添加工资帽
     */
    public addWageCap() {
        cc.log('显示工资帽弹窗');
    }
}
