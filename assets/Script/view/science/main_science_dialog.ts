// import PlayerListData from "../../data/PlayerListData"
import ScieneceData from "./data_science"
import Utils from "../../utils/Utils"
import Event from "../../signal/Events"
import switchPage from "../public/switch_page"
import ManagerData from "../../data/ManagerData";
import URLConfig from "../../config/URLConfig";
import HttpManager from "../../utils/HttpManager";
import PlayerUtil from "../../utils/PlayerUtil";
import ItemData from "../../data/ItemData";


const {ccclass,property} = cc._decorator;

@ccclass
export default class main_science_dialog extends cc.Component{
    //声明模块
    @property(cc.Node)
    private btn_close = null;
    @property([cc.Node])
    private switch_head:Array<cc.Node> = [];
    @property([cc.Node])
    private switch_body:Array<cc.Node> = [];
    @property(cc.Node)
    private PlayerListUI:cc.Node;
    @property(cc.Node)
    private TurnPageUI:cc.Node;
    @property(cc.Node)
    private EquipListUI:cc.Node;
    //球员切换
    @property(cc.Node)
    private playerListPrev:cc.Node;
    @property(cc.Node)
    private playerListNext:cc.Node;
    @property(cc.Node)
    private playerListShow:cc.Node;
    //装备切换
    @property(cc.Node)
    private equipListPrev:cc.Node;
    @property(cc.Node)
    private equipListNext:cc.Node;
    @property(cc.Node)
    private equipListShow:cc.Node;


    private _data = null;
    private playerData = null;
    private PlayerItemPrefabUrl = "Science/ballPlayerItem";
    private PackageItemrefabUrl = "Science/packageItem";
    private EquipItemrefabUrl = "Science/equipmentItem";
    private PlayerItemPrefabComponent = "prefab_player_item"
    private EquipItemPrefabComponent = "prefab_Equip"
    private NavItemPrefabComponent = "prefab_Switch_head"
    private aPLayerItem = [];
    private aEquipItem = [];

    private selectModule;
    private nowEquipList = null;
    private nowPlayerList = null;

    start(){
        this.initData();
        this.init();
        this.eventAddListener();
    }
    onDestroy(){
        this.eventRemoveListener();
    }
    public initData(){
        ScieneceData.playerListPageIndex = 0;
        ScieneceData.player_id = -1;
        ScieneceData.equipListPageIndex = 0;
        ScieneceData.equipIndex = -1;
        ScieneceData.playerEquip = null;
    }
    //初始化设置
    public async init(){
        this.btn_close.getComponent(cc.Button).clickEvents.push(
            Utils.bindBtnEvent(this.node,"main_science_dialog","close")
        )
        this.navChange(0,false);
        //初始化球员信息
        this.getPlayerData(this.refresPlayeer)
        // await this.onPLayerListChange();
        //获取所有球员长度
        //球员列表切换切换
        this.nowPlayerList = new switchPage(this.playerListPrev,this.playerListNext,this.playerListShow,"playerListChange",{
            "main":ScieneceData,
            "pageNum":"playerListPageIndex",
            "pageCount":"playerListNum"
        })

        this.nowEquipList = new switchPage(
            this.equipListPrev,
            this.equipListNext,
            this.equipListShow,
            "equipListChange",
            {
                "main":ScieneceData,
                "pageNum":"equipListPageIndex",
                "pageCount":"equipListNum"
            }
        )
        //初始化装备信息
    }
    public close(){
        this.node.destroy();
    }
    //事件监听
    public eventAddListener(){
        Event.getInstance().addListener(ScieneceData.EventChange,this.onPLayerItemClick,this);
        Event.getInstance().addListener("playerListChange",this.onPLayerListChange,this);
        Event.getInstance().addListener("equipListChange",this.fnPlayerEquip,this);
        Event.getInstance().addListener("equipListClick",this.onEquipItemClick,this);
        Event.getInstance().addListener("switchNavClick",this.navChange,this);
        Event.getInstance().addListener("ScienceUpDate",this.onUpdate,this);
    }
    //事件移除
    public eventRemoveListener(){
        Event.getInstance().removeListener(ScieneceData.EventChange,this.onPLayerItemClick,this);
        Event.getInstance().removeListener("playerListChange",this.onPLayerListChange,this);
        Event.getInstance().removeListener("equipListChange",this.fnPlayerEquip,this);
        Event.getInstance().removeListener("equipListClick",this.onEquipItemClick,this);
        Event.getInstance().removeListener("switchNavClick",this.navChange,this);
        Event.getInstance().removeListener("ScienceUpDate",this.onUpdate,this);
    }
    //获取数据
    public getPlayerData(callBack){
        let playerList = ManagerData.getInstance().Project;
        let args = [];
        for(let i = 0;i<playerList.length;i++){
            args.push({
                "n":URLConfig.ManagerPlayer,
                "i":{
                    Mid:"",
                    Tid:playerList[i].Tid
                }
            })
        }
        var srvArgs = {action:URLConfig.Get_Data
            ,args:args
        };
        HttpManager.getInstance().request(srvArgs,callBack,this);
    }
    private refresPlayeer(data){
        if(data.res){
            this.playerData = data.data;
            console.log(this.playerData,"1111")
            for(var i=0; i<this.playerData.length; i++){
                if(ManagerData.getInstance().Project[i]){
                    this.playerData[i].Pid = ManagerData.getInstance().Project[i].Pid;
                    this.playerData[i].Kp = PlayerUtil.getKPByTid(this.playerData[i].Tid);
                }
            }
            this.nowPlayerList.max = this.getDataLength();
            this.onPLayerListChange();
        }
    }
    public getPlayListData(index,num){

        console.log(this.playerData,"22222")
        let originalData = this.playerData.slice(num*index,num*(index+1));
        for(let i = 0;i<originalData.length;i++){
            if(!originalData[i].srcData){
                originalData[i].srcData = ItemData.getPlayerInfo(originalData[i].Pid);
            }
        }
        return originalData;
    }
    public getDataLength(){
        return this.playerData.length;
    }
    //导航切换
    public navChange(index,noFirst = true){
        for(let i = 0;i<this.switch_head.length;i++){
            if(i == index){
                continue;
            }
            this.switch_head[i].getComponent(this.NavItemPrefabComponent).active_off();
        }
        for(let i = 0;i<this.switch_body.length;i++){
            if(i == index){
                this.switch_body[i].getComponent("switch_content").show(noFirst);
                this.selectModule = this.switch_body[i].getComponent("switch_content");
            }else{
                this.switch_body[i].getComponent("switch_content").close();
            }
        }
    }
    //清空功能数据
    //根据页数读取展示数据
    public onPLayerListChange(){
        this._data = this.getPlayListData(ScieneceData.playerListPageIndex,ScieneceData.playerListNum);
        this.playerList();
    }
    //球员列表导入
    public async playerList(){
        this.aPLayerItem = [];
        this.PlayerListUI.removeAllChildren();
        for(let i = 0;i<this._data.length;i++){
            // if(i == 0){
            //     ScieneceData.player_id = this._data[i].Pid;
            //     ScieneceData.playerEquip = this._data[i];
            // }
            this.aPLayerItem.push(await this.insertPrefab(1,this._data[i]));
        }
        this.aPLayerItem.push(await this.insertPrefab(2));
    }
    //state参数 1球员子项 2背包子项 3装备子项
    public async insertPrefab(state,data = null,i = null){
        let prefab = null
        switch(state){
            case 1:
                prefab = await Utils.insertPrefab(this.PlayerItemPrefabUrl);
                prefab.getComponent(this.PlayerItemPrefabComponent).change(data)
                prefab.parent = this.PlayerListUI;
                break;
            case 2:
                prefab = await Utils.insertPrefab(this.PackageItemrefabUrl);
                prefab.parent = this.PlayerListUI;
                break;
            case 3:
                prefab = await Utils.insertPrefab(this.EquipItemrefabUrl);
                prefab.getComponent(this.EquipItemPrefabComponent).change(data,i)
                prefab.parent = this.EquipListUI;
                break;
        }
        return prefab;
    }
    //球员列表点击
    public onPLayerItemClick(){
        ScieneceData.selectEquip = null;
        this.selectModule.setSelectItem(true);
        for(let i = 0;i<this.aPLayerItem.length;i++){
            this.aPLayerItem[i].getComponent("prefab_package_item").stateChange();
        }
        let data = [];
        console.log(ScieneceData.playerEquip.Equip,"ScieneceData.playerEquip.Equip")
        for(let j = 0;j<3;j++){
            for(let i in ScieneceData.playerEquip.Equip){
                data.push(ScieneceData.playerEquip.Equip[i])
            }
        }
        ScieneceData.playerEquip = data;
        this.nowEquipList.max = ScieneceData.playerEquip.length;
        this.fnPlayerEquip(true);
        //刷新装备页面
    }
    //初始化装备页面导入当前球员装备数据
    public async fnPlayerEquip(isInit = false){
        if(isInit){
            ScieneceData.equipListPageIndex = 0;
            ScieneceData.equipIndex = -1;
            ScieneceData.selectEquip = null;
        }
        this.aEquipItem = [];
        this.EquipListUI.removeAllChildren();
        let aNowEquipData = ScieneceData.playerEquip.slice(ScieneceData.equipListNum*ScieneceData.equipListPageIndex,ScieneceData.equipListNum*(ScieneceData.equipListPageIndex+1));
        
        for(let i = 0;i<aNowEquipData.length;i++){
            this.aEquipItem.push(await this.insertPrefab(3,aNowEquipData[i],i));
        }
        this.onEquipItemClick();
    }
    //装备列表点击
    public onEquipItemClick(){
        for(let i = 0;i<this.aEquipItem.length;i++){
            this.aEquipItem[i].getComponent(this.EquipItemPrefabComponent).stateChange();
        }
        this.selectModule.setSelectItem(true);
    }

    //刷新
    public onUpdate(){
        this.onPLayerListChange();
        this.fnPlayerEquip();
    }
}