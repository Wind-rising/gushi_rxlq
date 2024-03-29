import ManagerData from "../../data/ManagerData";
import URLConfig from "../../config/URLConfig";
import HttpManager from "../../utils/HttpManager";
import SkillLearnModel from "./SkillLearnModel";
import PlayerUtil from "../../utils/PlayerUtil";
import Utility from "../../utils/Utility";
import ItemData from "../../data/ItemData";
import Events from "../../signal/Events";
import ErrMsg from "../../data/ErrMsg";
import SkillBag from "./SkillBag";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SkillLearnView extends cc.Component {
    //按钮-返回
    @property(cc.Button)
    private btn_close:cc.Button = null;
    //按钮-教练请教-组
    @property([cc.Button])
    private btn_arr_train:Array<cc.Button> = [];
    //按钮-一键请教
    @property(cc.Button)
    private btn_allTrain:cc.Button = null;
    //按钮-一键拾取
    @property(cc.Button)
    private btn_allPick:cc.Button = null;
    //按钮-装备技能
    @property(cc.Button)
    private btn_equipmentSkill:cc.Button = null;
    //按钮-技能升级
    @property(cc.Button)
    private btn_skillUp:cc.Button = null;
    //按钮-技能背包
    @property(cc.Button)
    private btn_skillBag:cc.Button = null;
    @property(cc.Node)
    public skillBag:cc.Node = null;

    //内容-球员列表
    @property(cc.Node)
    private cont_playerList:cc.Node = null;
    //内容-技能列表-组
    @property([cc.Node])
    private cont_skillList:Array<cc.Node> = [];
    //内容-教练-组
    @property([cc.Node])
    private cont_trainList:Array<cc.Node> = [];

    start(){
        this.addListener();
        SkillLearnModel.skillBag = this.skillBag;
        this.init();
    }
    onDestroy(){
        this.removeListener();
    }

    private init(){
    SkillLearnModel.playerListData = null;
    SkillLearnModel.playerItemArr = [];
    SkillLearnModel.currentPlayer = "";
    SkillLearnModel.currentTid;
    SkillLearnModel._selectPlayer;
    SkillLearnModel.playerSkillMap = {};
    SkillLearnModel.skillItems = [];
    SkillLearnModel.skillBag =null;
    SkillLearnModel._skillMap = {};


        this.getPlayerListData();
        for(let i = 0;i<this.btn_arr_train.length;i++){
            this.btn_arr_train[i].clickEvents.push(
                Utility.bindBtnEvent(this.node,'SkillLearnView','askSkill',[{
                    type:"1",
                    lv:i+1,
                    oneKey:0
                }])
            )
        }
        this.btn_close.clickEvents.push(
            Utility.bindBtnEvent(this.node,'SkillLearnView','onClose')
        )
        this.btn_allTrain.clickEvents.push(
            Utility.bindBtnEvent(this.node,'SkillLearnView','askSkill',[{
                type:"1",
                lv:1,
                oneKey:1
            }])
        )
        this.btn_skillBag.clickEvents.push(
            Utility.bindBtnEvent(this.node,'SkillLearnView','onBag')
        )
        this.btn_allPick.clickEvents.push(
            Utility.bindBtnEvent(this.node,'SkillLearnView','save')
        )
        // askSkill
    }
    private addListener(){
        Events.getInstance().addListener(SkillLearnModel.EventSelect,this.onSelect,this)
        Events.getInstance().addListener(SkillLearnModel.EventSkillItemClick,this.save,this)
    }
    private removeListener(){
        Events.getInstance().removeListener(SkillLearnModel.EventSelect,this.onSelect,this)
        Events.getInstance().removeListener(SkillLearnModel.EventSkillItemClick,this.save,this)
    }
    private onClose(){
        this.node.destroy();
    }
    //获取球员列表信息
    private getPlayerListData(){
        let playerList = ManagerData.getInstance().Project;
        let args = [];
        for(let i = 0;i<playerList.length;i++){
            args.push({
                "n":URLConfig.ManagerPlayer,
                "i":{
                    Mid:"",
                    Tid:playerList[i]['Tid']
                }
            })
        }
        var srvArgs = {action:URLConfig.Get_Data
            ,args:args
        };
        HttpManager.getInstance().request(srvArgs,(data)=>{
            this.onGetData(data);
        },this);
    }
    //球员信息处理回调
    private onGetData(data){
        if(data.res){
            SkillLearnModel.playerListData = data.data;
            for(let i = 0;i<SkillLearnModel.playerListData.length;i++){
                if(ManagerData.getInstance().Project[i]){
                    SkillLearnModel.playerListData[i].Pid = ManagerData.getInstance().Project[i]['Pid'];
                    SkillLearnModel.playerListData[i].Kp = PlayerUtil.getKPByTid(SkillLearnModel.playerListData[i].Tid)
                }
            }
            SkillLearnModel.playerListData.sort(function(a,b){
                return b.Kp - a.Kp;
            });
            this.format();
        }
    }
    //球员信息具现化
    private async format(){
        this.cont_playerList.removeAllChildren();
        let item;
        let data;
        let sItem;
        for(let i = 0;i<SkillLearnModel.playerListData.length;i++){
            item = await SkillLearnModel.createBagItem({data:SkillLearnModel.playerListData[i]});
            // item.sComponent.init(SkillLearnModel.playerListData[i]);
            item.sComponent.node_bg.interactable = true;
            let isMainPlayer = Utility.checkMVP(SkillLearnModel.playerListData[i].Tid);
            if(!isMainPlayer){
                item.sComponent.node_bg.interactable = false;
            }
            item.sComponent.node_effect.active = false;
            data = ItemData.getInstance().getPlayerInfo(SkillLearnModel.playerListData[i].Pid);
            item.sComponent.data = SkillLearnModel.playerListData[i];
            item.sComponent.rtxt_MName.string = `<color=${ItemData.getInstance().getCardColor(data.CardLevel)}>${data.ShowName}</c>`;
            item.sComponent.lbl_trainPoint.string = SkillLearnModel.playerListData[i].TrainExp+"";
            item.sComponent.lbl_pos.string = ItemData.getInstance().getLabel(data.Position - 0);
            SkillLearnModel.playerItemArr.push(item);
            if(SkillLearnModel.currentPlayer&&SkillLearnModel.playerListData[i].Pid == SkillLearnModel.currentPlayer){
                sItem = item;
            }
        }
        if(!sItem){
            sItem = SkillLearnModel.playerItemArr[0];
        }
        // SkillLearnModel.selectPlayer = sItem;
        for(let i = 0;i<SkillLearnModel.playerItemArr.length;i++){
            SkillLearnModel.playerItemArr[i].parent = this.cont_playerList;
        }
    }
    //球员被选中后
    private onSelect(){
        for(let i = 0;i<SkillLearnModel.playerItemArr.length;i++){
            if(SkillLearnModel.playerItemArr[i].sComponent.data.Tid == SkillLearnModel.selectPlayer.sComponent.data.Tid){
                SkillLearnModel.playerItemArr[i].sComponent.node_effect.active = true;
            }else{
                SkillLearnModel.playerItemArr[i].sComponent.node_effect.active = false;
            }
        }
        let data = SkillLearnModel.selectPlayer.sComponent.data;
        SkillLearnModel.currentTid = data.Tid;
        this.getPlayerSkill(data.Tid);
    }
    //获取球员技能栏信息
    private getPlayerSkill(tid){
        if(!SkillLearnModel.playerSkillMap[tid]){
            var srvArgs = {
                action:URLConfig.Get_Data,
                args: [{
                    "n":URLConfig.SkillAsk, 
                    "i":{
                        "Tid":tid
                    }
                }]
            };
            HttpManager.getInstance().request(srvArgs,onGetPlayerSkill,this);
        }else{
            this.formatPlayer(SkillLearnModel.playerSkillMap[tid])
        }
        function onGetPlayerSkill(data){
            if(data.res){
                SkillLearnModel.playerSkillMap[tid] = data.data[0];
                this.formatPlayer(SkillLearnModel.playerSkillMap[tid])
            }
        }
    }
    //清除前任遗留
    private clear(){
        // if(SkillLearnModel.skillItems){
        //     for(let i = 0;i<SkillLearnModel.skillItems;i++){
        //         if(SkillLearnModel.skillItems[i] && SkillLearnModel[i].skillItems[i].parent){

        //         }
        //     }
        // }
        for(let i = 0;i<this.cont_skillList.length;i++){
            this.cont_skillList[i].removeAllChildren();
        }
        SkillLearnModel.skillItems = [];
    }
    //技能列表，背包，请教
    private async formatPlayer(data){
        this.clear();
        let index = 0;
        for(let i = 0;i<SkillLearnModel.BTN_NUM;i++){
            if(parseInt(data["Lv"+(i+1)])!=0){
                this.cont_trainList[i].active = true;
                this.btn_arr_train[i].interactable = true;
            }else{
                this.cont_trainList[i].active = false;
                this.btn_arr_train[i].interactable = false;
            }
        }
        let iconList = data.Bag;
        let item;
        let iconC;

        for(let i = 0;i<iconList.length;i++){
            if(!data.SkillItems){
                data.SkillItems = {};
            }
            item = await SkillLearnModel.createSkillItem({
                data:iconList[i],
                index:i
            });
            SkillLearnModel.skillItems.push(item);
        }
        SkillLearnModel._skillMap[SkillLearnModel.currentTid] = iconList.length;
        data.SkillItems = SkillLearnModel.skillItems;
        for(let i = 0;i<SkillLearnModel.skillItems.length;i++){
            SkillLearnModel.skillItems[i].parent = this.cont_skillList[0];
        }
    }
    //请教
    private askSkill(e,option){
        let {type,lv,oneKey=1} = option[0];
        var srvArgs = {
            action:URLConfig.Post_Team_SkillAsk,
            args: {
                "Tid":SkillLearnModel.currentTid,
                "Type":type, 
                "Lv":lv,
                "OneKey":oneKey
            }
        };
        HttpManager.getInstance().request(srvArgs,onAskSkill,this);

        function onAskSkill(data){
            if(data.res){
                let info = SkillLearnModel.playerSkillMap[SkillLearnModel.currentTid];
                let tempInfo = data.data.Post_Pkg_SkillAsk;
                if(data.data && data.data.SyncData.Score)
                    ManagerData.getInstance().Score = parseInt(data.data.SyncData.Score);
                info.Lv2 = tempInfo.Lv2;
                info.Lv3 = tempInfo.Lv3;
                info.Lv4 = tempInfo.Lv4;
                info.Lv5 = tempInfo.Lv5;
                info.Bag = tempInfo.Bag;
                if(tempInfo.ItemCode && tempInfo.ItemCodes[0] == "0" && oneKey != 1){
                    Utility.showAlert("运气欠佳，什么都没得到!");
                }
                let trainExp = parseInt(data.data.SyncData.TrainExp);
                SkillLearnModel.selectPlayer.sComponent.data.TrainExp = trainExp;
                SkillLearnModel.selectPlayer.sComponent.lbl_trainPoint = trainExp+"";
                Events.getInstance().dispatch(SkillLearnModel.EventSelect)
                // SkillLearnModel.player
            }else{
                let msg = ErrMsg.getInstance().getErr(data.code);
                // msg = msg.replace("${level}",data['var'].Level);
                Utility.showAlert(msg);
            }
        }
    }
    //一键拾取
    private save(index = -1){
        var srvArgs = {
            action:URLConfig.Post_Team_SkillAskSave,
            args: {
                "Tid":SkillLearnModel.currentTid, 
                "Num":index - 0 + 1
            }
        };
        HttpManager.getInstance().request(srvArgs,onSaveSkill,this);

        function onSaveSkill(data){
            if(data.res){
                SkillLearnModel._skillMap[SkillLearnModel.currentTid] = 0;
                let info = SkillLearnModel.playerSkillMap[SkillLearnModel.currentTid];
                if(index == -1){
                    this.showEffect();
                    info.Bag = [];
                }else{
                    this.showEffect(SkillLearnModel.skillItems[index]);
                }
            }
        }
    }
    private showEffect(disPlayObject = null){
        let dis = disPlayObject;
        if(dis){
            this.effect(dis);
        }else{
            this.effect();
        }
    }
    private effect(obj:cc.Node = null){
        if(obj){
            obj.removeFromParent();
        }else{
            this.cont_skillList[0].removeAllChildren();
        }
        this.delSKill(obj);
    }
    private delSKill(obj){
        if(obj){
            for(let i = 0;i<SkillLearnModel.skillItems.length;i++){
                if(SkillLearnModel.skillItems[i].uuid == obj.uuid){
                    SkillLearnModel.skillItems.splice(i,1);
                }
            }
        }else{
            SkillLearnModel.skillItems = [];
        }
    }
    private onBag(){
        // this.SkillBag()
        if(SkillLearnModel.selectPlayer){
            SkillBag.open({
                data:[SkillLearnModel.selectPlayer.sComponent.data],
                res:true,
            },true,true);
        }
    }
}