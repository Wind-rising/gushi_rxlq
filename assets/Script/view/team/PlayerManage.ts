/**
 * 
 * 球员管理
 */
const {ccclass, property} = cc._decorator;
import Utility from "../../utils/Utility";
import PlayerControllor from "../../controllor/PlayerControllor";
import ManagerData from "../../data/ManagerData";
import URLConfig from "../../config/URLConfig";
import HttpManager from "../../utils/HttpManager";
import ListViewCtrl from "../control/ListViewCtrl";
import ItemData from "../../data/ItemData";
import PlayerInfoCom from "./PlayerInfoCom";
import XUtil from "../../utils/XUtil";
import PlayerUtil from "../../utils/PlayerUtil";
import Events from "../../signal/Events";
@ccclass
export default class PlayerManage extends cc.Component {

    /** 常量 */
    EventListenerTag:string = 'PlayerManageListener';
    controllor:PlayerControllor = null;

    /** 球员数据 */
    playerData:Object = null;

    /** 选中的节点 */
    selectedCell:cc.Node = null;

    /** 球员列表 */
    src_player_list:cc.Node = null;

    /** 中间部分选中的球员信息 */
    nod_show:PlayerInfoCom = null;

    /** 球员属性页面四个节点（最右侧信息） */
    nod_attrs:cc.Node[] = null;

    // LIFE-CYCLE CALLBACKS:
    lbl_max_cat:cc.Label = null;

    static REFRESH:'player_info_refresh';

    onLoad () {
        let img_player_list = this.node.getChildByName('img_player_list');
        this.lbl_max_cat = img_player_list.getChildByName('lbl_max_cat').getComponent(cc.Label);
        this.src_player_list = img_player_list.getChildByName('src_player_list');

        this.nod_show = this.node.getChildByName('nod_show').getComponent(PlayerInfoCom);
        
        this.nod_attrs = [];
        let nod_attr = this.node.getChildByName('nod_attr');
        for(let i = 0;i < 4;i++){
            this.nod_attrs.push(nod_attr.getChildByName('nod_'+i));
        }

        this.controllor = PlayerControllor.getInstance();
        this.playerData = {};

        //返回
        /** 返回按钮 */
        img_player_list.getChildByName('btn_return').getComponent(cc.Button).clickEvents.push(
            Utility.bindBtnEvent(this.node,'PlayerManage','onReturn')
        );

        //增加工资帽
        img_player_list.getChildByName('btn_add_hat').getComponent(cc.Button).clickEvents.push(
            Utility.bindBtnEvent(this.node,'PlayerManage','addWageCap')
        );

        /** 事件处理 */
        Events.getInstance().addListener(PlayerManage.REFRESH,()=>{
            let data = PlayerControllor.getInstance().playerInfo;
            let args  = [{"n":URLConfig.ManagerPlayer, "i":{Mid:"", Tid:data['Tid']}}];
            HttpManager.getInstance().request({args:args,action:URLConfig.Get_Data},(responce)=>{
                if(responce['res']){
                    let playerInfo = responce['data'][0];
                    playerInfo['basicData'] = data['basicData'];
                    this.playerData[data['Tid']] = playerInfo;
                    this.formatPlayerData(playerInfo,this.selectedCell);
                }else{
                    Utility.fadeErrorInfo('获取球员信息失败');
                }
            },this);

        },this,this.EventListenerTag)
        
        this.getData();
    }

    onDestroy () {
        Events.getInstance().removeByTag(this.EventListenerTag);
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
            if(data['data']){
                ManagerData.getInstance().setValue(data['data']);
            }
        }
        this.formatSalary();
        PlayerUtil.getKP(()=>{
            let playerList = [];
            for(let i = 0;i<ManagerData.getInstance().Project.length;i++){
                let playerData = XUtil.cloneObject(ManagerData.getInstance().Project[i]);
                playerData['basicData'] = ItemData.getInstance().getPlayerInfo(playerData['Pid']);
                playerList.push(playerData);
            }
            this.initScrollList(playerList);
        });
    }

    /**
     * 初始化球员列表
     * @param playerList 
     */
    initScrollList(playerList:Array<Object>){
        /** 排序 */
        playerList.sort((a:Object,b:Object):number=>{
            return b['Kp'] - a['Kp'];
        });
        /** 服务器列表 */
        this.src_player_list.off('initCell');
        this.src_player_list.on('initCell',(cell,idx)=>{
            if(playerList.length>idx){
                //初始化球员节点信息
                this.refreshListCell(cell,playerList[idx]);
            }
        });
        
        this.src_player_list.on('selectedCell',(cell,idx)=>{
            if(playerList.length>idx){
                //选择某个球员
                this.controllor.selectedPlayerIdx = idx;
                this.selectedCell = cell;
                this.selectListCell(playerList[idx],null);
            }
        });
        
        this.src_player_list.getComponent(ListViewCtrl).addItem(playerList.length);

        this.src_player_list.getComponent(ListViewCtrl).onCellSelected(this.controllor.selectedPlayerIdx);
    }

    /**
     * 显示球员列表节点信息
     * @param cell 
     * @param data 
     */
    refreshListCell (cell:cc.Node, data:Object) {
        let basicData = data['basicData'];
        let lbl_name = cell.getChildByName('lbl_name');
        lbl_name.getComponent(cc.Label).string = basicData['Name'];
        lbl_name.color = new cc.Color().fromHEX(ItemData.getInstance().getCardColor(parseInt(basicData['CardLevel'])));

        cell.getChildByName('lbl_kpi').getComponent(cc.Label).string = ''+Math.floor(data['Kp']);
        cell.getChildByName('lbl_pos').getComponent(cc.Label).string = ItemData.getInstance().getLabel(parseInt(basicData['Position']));;
        cell.getChildByName('img_state').active = false;
    }
    /**
     * 选中球员
     * @param cell 选中的节点
     * @param data 
     */
    selectListCell(data:Object, cell:cc.Node){
        let playerInfo:Object = this.playerData[data['Tid']];
        if(playerInfo){
            this.formatPlayerData(playerInfo,cell);
        }else{
            let args  = [{"n":URLConfig.ManagerPlayer, "i":{Mid:"", Tid:data['Tid']}}];
            HttpManager.getInstance().request({args:args,action:URLConfig.Get_Data},(responce)=>{
                if(responce['res']){
                    let playerInfo = responce['data'][0];
                    playerInfo['basicData'] = data['basicData'];
                    this.playerData[data['Tid']] = playerInfo;
                    this.formatPlayerData(playerInfo,cell);
                }else{
                    Utility.fadeErrorInfo('获取球员信息失败');
                }
            },this);
        }
    }

    formatPlayerData(playerInfo:Object, cell:cc.Node){
        this.nod_show.formatData(playerInfo);
        for(let i = 0;i<this.nod_attrs.length;i++){
            PlayerControllor.getInstance().playerInfo = playerInfo;
            this.nod_attrs[i].emit('selectedPlayer');
        }
        if(cell){
            this.refreshListCell(cell,playerInfo);
        }
    }
};
