/**
 * 
 * 球员管理
 */
const {ccclass, property} = cc._decorator;
import Utility from "../../utils/Utility";
import PlayerControllor from "../../controllor/PlayerControllor";
import ManagerData from "../../data/ManagerData";
import PlayerUtil from "../../utils/PlayerUtil";
import URLConfig from "../../config/URLConfig";
import HttpManager from "../../utils/HttpManager";
import ListViewCtrl from "../control/ListViewCtrl";
import ItemData from "../../data/ItemData";
@ccclass
export default class PlayerManage extends cc.Component {

    /** 常量 */
    EventListenerTag:string = 'PlayerManageListener';
    controllor:PlayerControllor = null;

    /** 球员数据 */
    playerData:Object = null;
    /** 球员列表 */
    src_player_list:cc.Node = null;

    // LIFE-CYCLE CALLBACKS:
    lbl_max_cat:cc.Label = null;

    onLoad () {
        let img_player_list = this.node.getChildByName('img_player_list');
        this.lbl_max_cat = img_player_list.getChildByName('lbl_max_cat').getComponent(cc.Label);
        this.src_player_list = img_player_list.getChildByName('src_player_list');

        this.controllor = PlayerControllor.getInstance();

        //返回
        /** 返回按钮 */
        img_player_list.getChildByName('btn_return').getComponent(cc.Button).clickEvents.push(
            Utility.bindBtnEvent(this.node,'PlayerManage','onReturn')
        );

        //增加工资帽
        img_player_list.getChildByName('btn_add_hat').getComponent(cc.Button).clickEvents.push(
            Utility.bindBtnEvent(this.node,'PlayerManage','addWageCap')
        );

        
        this.getData();
    }

    start () {

    }

    // update (dt) {}

    /**
     * 添加工资帽
     * @param e 
     */
    addWageCap (e:cc.Event) {
        this.controllor.addWageCap();
    }

    /**
     * 返回按钮
     * @param e 
     */
    onReturn (e:cc.Event) {
        this.node.parent.destroy();
    }

    /** 工资帽 */
    private formatSalary () {
        this.lbl_max_cat.string = ManagerData.getInstance().totalSalary + "/" + ManagerData.getInstance().SalaryCap+"万";
    }

    /**
     * 从服务器获取数据
     */
    private getData():void{
        let args  = [{"n":URLConfig.TeamPeriod, "i":{}},{"n":URLConfig.Tactics, "i":{}}, {n:URLConfig.ManagerTeam, i:{}}];
        HttpManager.getInstance().request({args:args,action:URLConfig.Get_Data},this.onGetData,this);
    }
    
    /**
     * 获取服务器数据返回
     * @param data 
     */
    private onGetData(data:Object):void{
        if(data['res']){
            this.playerData = data['data'];
            if(this.playerData){
                ManagerData.getInstance().setValue(this.playerData);
            }
        }
        let playerList = ManagerData.getInstance().Project;
        /** 服务器列表 */
        this.src_player_list.off('initCell');
        this.src_player_list.on('initCell',(cell,idx)=>{
            if(playerList.length>idx){
                //初始化球员节点信息
            }
        });
        
        this.src_player_list.on('selectedCell',(cell,idx)=>{
            if(playerList.length>idx){
                //选择某个球员
                this.refreshListCell(cell,playerList[idx]);
            }
        });
        
        this.src_player_list.getComponent(ListViewCtrl).addItem(playerList.length);
        this.src_player_list.getComponent(ListViewCtrl).onCellSelected(0);//默认选中第0个
    }

    /**
     * 显示球员列表节点信息
     * @param cell 
     * @param data 
     */
    refreshListCell (cell:cc.Node, data:Object) {
        let cfgData = ItemData.getPlayerInfo(data['Pid']);
        cell.getChildByName('lbl_name').getComponent(cc.Label);
        cell.getChildByName('lbl_kpi').getComponent(cc.Label);
        cell.getChildByName('lbl_pos').getComponent(cc.Label);
        cell.getChildByName('img_state').getComponent(cc.Sprite);
        cc.log(data)
        cc.log(cfgData)
    }
};
