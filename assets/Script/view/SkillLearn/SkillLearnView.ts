import ManagerData from "../../data/ManagerData";
import URLConfig from "../../config/URLConfig";
import HttpManager from "../../utils/HttpManager";
import SkillLearnModel from "./SkillLearnModel";
import PlayerUtil from "../../utils/PlayerUtil";
import Utility from "../../utils/Utility";
import ItemData from "../../data/ItemData";
import Events from "../../signal/Events";
import ErrMsg from "../../data/ErrMsg";

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
        this.init();
    }
    onDestroy(){
        this.removeListener();
    }

    private init(){
        this.getPlayerListData();
        for(let i = 0;i<this.btn_arr_train.length;i++){
            this.btn_arr_train[i].clickEvents.push(
                Utility.bindBtnEvent(this.node,'SkillLearnView','askSkill',[{
                    type:"1",
                    lv:1,
                    oneKey:0
                }])
            )
        }
        this.btn_close.clickEvents.push(
            Utility.bindBtnEvent(this.node,'SKillLearnView','onClose')
        )
        // askSkill
    }
    private addListener(){
        Events.getInstance().addListener(SkillLearnModel.EventSelect,this.onSelect,this)
    }
    private removeListener(){
        Events.getInstance().addListener(SkillLearnModel.EventSelect,this.onSelect,this)
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
                    Tid:playerList[i].Tid
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
                    SkillLearnModel.playerListData[i].Pid = ManagerData.getInstance().Project[i].Pid;
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
            item = await SkillLearnModel.createBagItem({});
            item.sComponent.node_bg.interactable = true;
            let isMainPlayer = Utility.checkMVP(SkillLearnModel.playerListData[i].Tid);
            if(!isMainPlayer){
                item.sComponent.node_bg.interactable = false;
            }
            item.sComponent.node_effect.active = false;
            data = ItemData.getPlayerInfo(SkillLearnModel.playerListData[i].Pid);
            item.sComponent.data = SkillLearnModel.playerListData[i];
            item.sComponent.rtxt_MName.string = `<color=${ItemData.getCardColor(data.CardLevel)}>${data.ShowName}</c>`;
            item.sComponent.lbl_trainPoint.string = SkillLearnModel.playerListData[i].TrainExp+"";
            console.log(data,"datadatadatadata")
            item.sComponent.lbl_pos.string = ItemData.getLabel(data.Position - 0);
            SkillLearnModel.playerItemArr.push(item);
            if(SkillLearnModel.currentPlayer&&SkillLearnModel.playerListData[i].Pid == SkillLearnModel.currentPlayer){
                sItem = item;
            }
        }
        if(!sItem){
            sItem = SkillLearnModel.playerItemArr[0];
        }
        SkillLearnModel.selectPlayer = sItem;
        for(let i = 0;i<SkillLearnModel.playerItemArr.length;i++){
            console.log(SkillLearnModel.playerItemArr[i])
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
        console.log(data,111111555555555)
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
            item = await SkillLearnModel.createSkillItem({data:iconList[i]});
            SkillLearnModel.skillItems.push(item);
        }
        SkillLearnModel._skillMap[SkillLearnModel.currentTid] = iconList.length;
        data.SkillItems = SkillLearnModel.skillItems;
        for(let i = 0;i<SkillLearnModel.skillItems.length;i++){
            SkillLearnModel.skillItems[i].parent = this.cont_skillList[Math.floor(i/SkillLearnModel.SKILL_NUM)];
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
                SkillLearnModel.selectPlayer.sComponent.data.TrainExp = parseInt(data.data.SyncData.TrainExp);
                
            }else{
                let msg = ErrMsg.getInstance().getErr(data);
                msg = msg.replace("${level}",data['var'].Level);
                Utility.showAlert(msg);
            }
        }
    }
}