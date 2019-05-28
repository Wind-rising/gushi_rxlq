const {ccclass,property} = cc._decorator;

import Utils from "../../utils/Utils";
import Events from "../../signal/Events"
import Switch_module from "./m_Switch";
import PlayerListData from "../../data/PlayerListData"
import PlayerList from "./m_PlayerList"
import Package from "../../data/PackageData"

@ccclass
export default class ScienceDialog extends cc.Component{
    //场景元素
    @property(cc.Node)
    private btn_close = null;
    @property
    private switch_name:string = "";
    @property([cc.Node])
    private switch_head:Array<cc.Node> = [];
    @property([cc.Node])
    private switch_body:Array<cc.Node> = [];
    @property(cc.Node)
    private PlayerListUI:cc.Node;
    @property(cc.Node)
    private TurnPageUI:cc.Node;
    // @property(cc.Node)
    // private module_switch = null;
    //场景模块
    private module_switch;
    private module_playList;
    private module_equipment;
    private module_upgrade;
    private module_reform;
    private module_wash;
    private module_sign;


    onLoad(){

    }
    onDestroy(){
        this.removeListener();
    }

    async start(){
        this.module_switch = new Switch_module({
            switch_name:this.switch_name,
            switch_head:this.switch_head,
            switch_body:this.switch_body
        });
        this.btn_close.getComponent(cc.Button).clickEvents.push(
            Utils.bindBtnEvent(this.node,"main_ScienceDialog","onClose")
        )
        console.log("start..................33333333")
        this.addListener();
        console.log("start..................11111111")
        await this.playList();
        console.log("start..................22222222")
        await this.EquipList();
    }
    public async playList(){
        let playerListData = await PlayerListData.getInstance().initPlayList();
        this.module_playList = new PlayerList(this.PlayerListUI,this.TurnPageUI);
    }
    public async EquipList(){
        console.log("start..................")
        Package.getInstance().getPackageData(); 
    }
    addListener(){
        for(let i = 0;i<this.switch_head.length;i++){
            Events.getInstance().addListener(this.switch_name+i,this['switch_'+i],this);
        }
    }
    removeListener(){
        for(let i = 0;i<this.switch_head.length;i++){
            Events.getInstance().removeListener(this.switch_name+i,this['switch_'+i],this);
        }
    }

    public onClose(e):void{
        this.node.destroy();
    }
    public switch_0(){
           console.log(0)
    }
    public switch_1(){
           console.log(1)
    }
    public switch_2(){
           console.log(2)
    }
    public switch_3(){
           console.log(3)
    }
}