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
    /** 球员位置图片 */
    nod_pos:cc.Node = null;
    /** 球员位置文本 */
    lbl_position:cc.Label = null;
    /** 球员名称 */
    lbl_player_name:cc.Label = null;
    /** 球员工资 */
    lbl_salary:cc.Label = null;
    /** 球员综合能力 */
    lbl_kpi:cc.Label = null;
    /** 球员装备列表 */
    img_equipment_0:cc.Sprite = null;

    // LIFE-CYCLE CALLBACKS:
    lbl_max_cat:cc.Label = null;

    onLoad () {
        let img_player_list = this.node.getChildByName('img_player_list');
        this.lbl_max_cat = img_player_list.getChildByName('lbl_max_cat').getComponent(cc.Label);
        this.src_player_list = img_player_list.getChildByName('src_player_list');

        let nod_show = this.node.getChildByName('nod_show');
        this.nod_pos = nod_show.getChildByName('nod_pos');
        this.lbl_position = nod_show.getChildByName('lbl_position').getComponent(cc.Label);
        this.lbl_player_name = nod_show.getChildByName('lbl_player_name').getComponent(cc.Label);
        this.lbl_salary = nod_show.getChildByName('lbl_salary').getComponent(cc.Label);
        this.lbl_kpi = nod_show.getChildByName('lbl_kpi').getComponent(cc.Label);
        this.img_equipment_0 = nod_show.getChildByName('img_equipment_0').getComponent(cc.Sprite);

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

        //解雇球员
        nod_show.getChildByName('btn_fire').getComponent(cc.Button).clickEvents.push(
            Utility.bindBtnEvent(this.node,'PlayerManage','onFirePlayer')
        );

        //一键脱装备
        nod_show.getChildByName('btn_unload_equipment').getComponent(cc.Button).clickEvents.push(
            Utility.bindBtnEvent(this.node,'PlayerManage','onUnloadEquipment')
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
     * 解雇球员
     */
    onFirePlayer () {
        //
    }

    /**
     * 一键脱装备
     */
    onUnloadEquipment(){
        //
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
        this.initScrollList(ManagerData.getInstance().Project);
    }

    /**
     * 初始化球员列表
     * @param playerList 
     */
    initScrollList(playerList:Array<Object>){
        /** 服务器列表 */
        this.src_player_list.off('initCell');
        this.src_player_list.on('initCell',(cell,idx)=>{
            if(playerList.length>idx){
                //初始化球员节点信息
                this.refreshListCell(cell,playerList[idx],idx);
            }
        });
        
        this.src_player_list.on('selectedCell',(cell,idx)=>{
            if(playerList.length>idx){
                //选择某个球员
                this.controllor.selectedPlayerIdx = idx;
                this.selectListCell(cell,playerList[idx]);
            }
        });
        
        this.src_player_list.getComponent(ListViewCtrl).addItem(playerList.length);

        this.src_player_list.getComponent(ListViewCtrl).onCellSelected(this.controllor.selectedPlayerIdx);//默认选中第0个
    }

    /**
     * 显示球员列表节点信息
     * @param cell 
     * @param data 
     */
    refreshListCell (cell:cc.Node, data:Object, idx:number) {
        let cfgData = ItemData.getInstance().getPlayerInfo(data['Pid']);
        let lbl_name = cell.getChildByName('lbl_name');
        lbl_name.getComponent(cc.Label).string = cfgData['Name'];
        lbl_name.color = new cc.Color().fromHEX(ItemData.getInstance().getCardColor(parseInt(cfgData['CardLevel'])));

        cell.getChildByName('lbl_kpi').getComponent(cc.Label).string = cfgData['Kp'];
        cell.getChildByName('lbl_pos').getComponent(cc.Label).string = ItemData.getInstance().getLabel(parseInt(cfgData['Position']));;
        //cell.getChildByName('img_state').getComponent(cc.Sprite);
    }
    /**
     * 选中球员
     * @param cell 选中的节点
     * @param data 
     */
    selectListCell(cell:cc.Node, data:Object){
        let cfgData = ItemData.getInstance().getPlayerInfo(data['Pid']);
        let pos = parseInt(cfgData['Position']);
        for(let i = 0;i < 5; i++){
            this.nod_pos.getChildByName('img_'+i).active = pos == (i+1);
        }
        this.lbl_position.string = ItemData.getInstance().getPosStr(pos);
        this.lbl_player_name.string = cfgData['Name']
        this.lbl_player_name.node.color = new cc.Color().fromHEX(ItemData.getInstance().getCardColor(parseInt(cfgData['CardLevel'])));
        
        this.lbl_salary.string = "球员工资："+cfgData['Salary']+"万";
        this.lbl_kpi.string = cfgData['Kp'];
    }
};
