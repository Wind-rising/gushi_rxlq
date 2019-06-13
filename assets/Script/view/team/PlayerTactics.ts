/**
 * 战术设置子页面
 */
const {ccclass, property} = cc._decorator;

import Utility from "../../utils/Utility";
import PlayerControllor from "../../controllor/PlayerControllor";
import PlayerUtil from "../../utils/PlayerUtil";
import URLConfig from "../../config/URLConfig";
import HttpManager from "../../utils/HttpManager";
import ManagerData from "../../data/ManagerData";
import ErrMsg from "../../data/ErrMsg";
import Events from "../../signal/Events";
import FormationData from "../../data/FormationData";
import SoundManager from "../../manager/SoundManager";
import SoundConfig from "../../config/SoundConfig";
import XUtil from "../../utils/XUtil";
import PlayerInfo from "../common/PlayerInfo";

@ccclass
export default class PlayerTactics extends cc.Component {

    private EventListenerTag:string = 'PlayerTacticsListener';

    //队伍数据
    private teamData:Object = null;
    //战术数据
    private taticsData:Object = null;
    //主力
    private mainArr:Array<Object>;
    //替补
    private tempArr:Array<Object> = new Array();
    
    private legendNum:number = 0;
    
    //球队数量
    private PLAYER_NUM:number = 5;
    //替补席数目
    private PAGE_SIZE:number = 4;
    //战术数量
    private SKILL_NUM:number = 6
    /**最大元老数*/
    private MAX_LEGEND:number = 2;

    /** 进攻战术优先度列表 */
    private teamPriorityData:Array<Array<number>> = [[0, 3, 2, 1, 0], [2, 0, 1, 0, 3], [2, 0, 0, 3, 1], [0, 0, 1, 2, 3], [3, 2, 1, 0, 0], [0, 2, 3, 1, 0]];
    
    /** 球员控制器 */
    private controllor:PlayerControllor = null;

    /** 选中的按钮 */
    private selectedBtn:cc.Button = null;

    /** 综合实力 */
    private lbl_kpi:cc.Label = null;
    /** 工资帽 */
    private lbl_max_cat:cc.Label = null;
    /** 进攻战术 */
    private lbl_tactics_name:cc.Label = null;
    private lbl_tactics_level:cc.Label = null;

    /** 防守战术 */
    private lbl_tactics_defence_name:cc.Label = null;
    private lbl_tactics_defence_level:cc.Label = null;

    /** 选中进攻战术标志 */
    private nod_tactics_list:cc.Node = null;
    private img_selected_defence:cc.Node = null;
    private img_selected_attack:cc.Node = null;

    /** 拷贝战术按钮 */
    private btnCopyArray:cc.Button[] = null;

    /** 元老球员 */
    private lbl_legend:cc.Label = null;

    /** 主力球员列表 */
    private mainPlayerList:cc.Node[] = null;
    /** 替补球员列表，画面只显示四个 */
    private tempPlayerList:cc.Node[] = null;
    private btn_left:cc.Button = null;
    private btn_right:cc.Button = null;

    onLoad () {
        this.controllor = PlayerControllor.getInstance();

        let nod_left = this.node.getChildByName('nod_left');
        let nod_right = this.node.getChildByName('nod_right');

        this.lbl_kpi = nod_left.getChildByName('lbl_kpi').getComponent(cc.Label);
        this.lbl_max_cat = nod_left.getChildByName('lbl_max_cat').getComponent(cc.Label);
        this.lbl_tactics_name = nod_left.getChildByName('lbl_tactics_name').getComponent(cc.Label);
        this.lbl_tactics_level = nod_left.getChildByName('lbl_tactics_level').getComponent(cc.Label);
        this.lbl_tactics_defence_name = nod_left.getChildByName('lbl_tactics_defence_name').getComponent(cc.Label);
        this.lbl_tactics_defence_level = nod_left.getChildByName('lbl_tactics_defence_level').getComponent(cc.Label);

        this.lbl_legend = nod_right.getChildByName('lbl_legend').getComponent(cc.Label);
        
        /** 返回按钮 */
        this.node.getChildByName('btn_return').getComponent(cc.Button).clickEvents.push(
            Utility.bindBtnEvent(this.node,'PlayerTactics','onReturn')
        );

        /** 工资帽 */
        nod_left.getChildByName('btn_add_hat').getComponent(cc.Button).clickEvents.push(
            Utility.bindBtnEvent(this.node,'PlayerTactics','addWageCap')
        );
        

        /** 切换节 */
        for(let i = 0;i < this.PAGE_SIZE;i++){
            let btn = nod_left.getChildByName('btn_section_'+i).getComponent(cc.Button);
            btn.clickEvents.push(
                Utility.bindBtnEvent(this.node,'PlayerTactics','onSelectSection', i+'')
            )
            //选中的按钮就不能再点击
            if(i == this.controllor.tacticsSection){
                btn.interactable = false;
                this.selectedBtn = btn;
                this.onSelectSection(null,i+'');
            }else{
                btn.interactable = true;
            }
        }
        
        /** 更改战术 */
        this.nod_tactics_list = nod_left.getChildByName('nod_tactics_list');
        //进攻战术
        for(let i = 0;i<this.SKILL_NUM;i++){
            let tacticsIcon = this.nod_tactics_list.getChildByName('t'+(i+1));
            if(!this.img_selected_attack){
                this.img_selected_attack = tacticsIcon.getChildByName('img_selected_attack');
            }
            tacticsIcon.getComponent(cc.Button).clickEvents.push(
                Utility.bindBtnEvent(this.node,'PlayerTactics','onSelectedTacticAttack',''+i)
            );
        }
        //防守战术
        for(let i = 0;i<this.SKILL_NUM;i++){
            let tacticsIcon = this.nod_tactics_list.getChildByName('t'+(this.SKILL_NUM+i+1));
            if(!this.img_selected_defence){
                this.img_selected_defence = tacticsIcon.getChildByName('img_selected_defence');
            }
            tacticsIcon.getComponent(cc.Button).clickEvents.push(
                Utility.bindBtnEvent(this.node,'PlayerTactics','onSelectedTacticDefence',''+i)
            );
        }
        
        //拷贝战术
        this.btnCopyArray = [];
        for(let i = 0;i<this.PAGE_SIZE;i++){
            let btn = nod_left.getChildByName('btn_copy_'+i).getComponent(cc.Button);
            this.btnCopyArray.push(btn);
            btn.clickEvents.push(
                Utility.bindBtnEvent(this.node,'PlayerTactics','onCopyTactic',''+i)
            );
        }

        //主力球员列表
        this.mainPlayerList = [];
        for(let i = 0;i < this.PLAYER_NUM;i++){
            let nod = nod_right.getChildByName('nod_player_'+i);
            this.mainPlayerList.push(nod);
            this.addDragEvent(nod,1);
        }
        //替补球员节点 4个
        this.tempPlayerList = [];
        for(let i = 0;i < this.PAGE_SIZE;i++){
            let nod = nod_right.getChildByName('nod_player_temp_'+i);
            this.tempPlayerList.push(nod);
            this.addDragEvent(nod,2);
        }
        /** 替补球员列表翻页按钮 */
        this.btn_left = nod_right.getChildByName('btn_left').getComponent(cc.Button)
        this.btn_left.clickEvents.push(
            Utility.bindBtnEvent(this.node,'PlayerTactics','onTurnPage','-1')
        );
        this.btn_right = nod_right.getChildByName('btn_right').getComponent(cc.Button);
        this.btn_right.clickEvents.push(
            Utility.bindBtnEvent(this.node,'PlayerTactics','onTurnPage','1')
        );


        Events.getInstance().addListener(ManagerData.PROPERTY_CHANGED, this.onProChange,this,this.EventListenerTag);
        
        this.getData();

    }

    onDestroy () {
        Events.getInstance().removeByTag(this.EventListenerTag);
    }

    start () {

    }

    // update (dt) {}

    /**
     * 
     * @param nod 接收拖拽事件的节点
     * @param type 接受拖动事件的球员类型 1、主力球员 2、替补球员
     */
    addDragEvent( nod:cc.Node,type:number){
        nod.on('drag',(dragNode)=>{
            let mainPlayer:PlayerInfo;//主力球员
            let tempPlayer:PlayerInfo;//替补球员
            if(1 == type){
                mainPlayer = nod.getComponent(PlayerInfo);
                tempPlayer = dragNode.getComponent(PlayerInfo);
                if(this.tempArr.indexOf(tempPlayer.srcData) < 0){
                    return;
                }
            }else{
                mainPlayer = dragNode.getComponent(PlayerInfo);
                tempPlayer = nod.getComponent(PlayerInfo);
                if(this.mainArr.indexOf(mainPlayer.srcData) < 0){
                    return;
                }
            }
            if(parseInt(mainPlayer.srcData['Tid']) == 1 || parseInt(tempPlayer.srcData['Tid']) == 1)
            {
                Utility.fadeErrorInfo("托管球员无法出场");
                return;
            }
            //新增-如果传奇卡达到上限，则不能上场------------------------
            if(this.legendNum == this.MAX_LEGEND){
                //如果上场的为传奇，下场的不是传奇，---
                if(mainPlayer.data['CardLevel'] == 1 && tempPlayer.data['CardLevel'] != 1){
                    Utility.fadeErrorInfo("最多只能有两名元老球员同时出场");
                    return;
                }
            }
            //所有球员列表数据更新
            let Project = ManagerData.getInstance().Project;
            for(let i = 0;i<Project.length;i++){
                if(Project[i]['Tid'] == mainPlayer.srcData['Tid']){
                    Project[i]['Tid'] = tempPlayer.srcData['Tid'];
                    Project[i]['Pid'] = tempPlayer.srcData['Pid'];
                }
            }
            //交换页面数据
            for(let key in tempPlayer.srcData){
                let temp = tempPlayer.srcData[key];
                tempPlayer.srcData[key] = mainPlayer.srcData[key];
                mainPlayer.srcData[key] = temp;
            }

            mainPlayer.setPlayerData(mainPlayer.srcData,this.teamData['Formation']);
            tempPlayer.setPlayerData(tempPlayer.srcData,this.teamData['Formation']);
            this.saveTatics();
        });
    }
    
    
    /**
     * 返回按钮
     * @param e 
     */
    onReturn (e:cc.Event) {
        this.node.parent.destroy();
    }

    /**
     * 切换节
     * @param e 
     */
    onSelectSection (e:cc.Event = null,customEventData:string) {
        if(e){
            this.selectedBtn.interactable = true;
            this.selectedBtn = e.currentTarget.getComponent(cc.Button);
            this.selectedBtn.interactable = false;
        }
        this.controllor.tacticsSection = parseInt(customEventData);
        if(!this.teamData){
            return;
        }
        for(let i = 0;i< this.btnCopyArray.length;i++){
            this.btnCopyArray[i].interactable = (this.controllor.tacticsSection != i);
        }
        this.formatTeam();
    }
    
    /** 选择进攻战术 */
    onSelectedTacticAttack (e:cc.Event,customEventData:string){
        let skillIndex = parseInt(customEventData)+1;
        if(this.teamData['Formation'][this.controllor.tacticsSection][1] == skillIndex){
            return;
        }
        this.img_selected_attack.parent = e.currentTarget;
        this.teamData['Formation'][this.controllor.tacticsSection][1] = skillIndex;
        this.formatTatics();
        this.saveTatics();
    }
    /** 选择防守战术 */
    onSelectedTacticDefence (e:cc.Event,customEventData){
        let skillIndex = parseInt(customEventData)+this.SKILL_NUM+1;
        if(this.teamData['Formation'][this.controllor.tacticsSection][0] == skillIndex){
            return;
        }
        this.img_selected_defence.parent = e.currentTarget;
        this.teamData['Formation'][this.controllor.tacticsSection][0] = skillIndex;
        this.formatTatics();
        this.saveTatics();
    }

    /** 复制战术 */
    onCopyTactic (e:cc.Event,customEventData:string) {
        SoundManager.play(SoundConfig.BTN_CLICK);
        let curIndex = ''+this.controllor.tacticsSection;

        let targetFormation = this.teamData['Formation'][curIndex];
        let targetPeriod = this.teamData['Period'][curIndex];
        
        this.teamData['Formation'][customEventData] = XUtil.cloneObject(targetFormation);
        this.teamData['Period'][customEventData] = XUtil.cloneObject(targetPeriod);

        e.currentTarget.getComponent(cc.Button).interactable = false;
        this.saveTatics();
    }

    /**
     * 添加工资帽
     * @param e 
     */
    addWageCap (e:cc.Event) {
        this.controllor.addWageCap();
    }

    /**
     * 
     * @param e 翻页
     * @param customEventData 
     */
    onTurnPage (e:cc.Event,customEventData:string){
        this.controllor.tempPlayerPage += parseInt(customEventData);
        if(this.controllor.tempPlayerPage<=0){
            this.controllor.tempPlayerPage = 0;
            this.btn_left.interactable = false;
        }else{
            this.btn_left.interactable = true;
        }
        let pageSize = Math.floor(this.tempArr.length/this.PAGE_SIZE);
        if(this.controllor.tempPlayerPage>=pageSize){
            this.controllor.tempPlayerPage=pageSize;
            this.btn_right.interactable = false;
        }else{
            this.btn_right.interactable = true;
        }

        for(let i = 0;i<this.PAGE_SIZE;i++){
            let player = this.tempPlayerList[i];
            player.getComponent(PlayerInfo).setPlayerData(this.tempArr[i+this.controllor.tempPlayerPage*this.PAGE_SIZE],this.teamData['Formation']);
        }
    }

    /**
     * kpi变化事件
     */
    private onProChange(){
        //显示kpi值
        this.lbl_kpi.string = ''+ManagerData.getInstance().KPI;
    }

    /**
     * 获取页面数据
     */
    private getData():void{
        PlayerUtil.getKP(()=>{
            let args  = [{"n":URLConfig.TeamPeriod, "i":{}},{"n":URLConfig.Tactics, "i":{}}, {n:URLConfig.ManagerTeam, i:{}}];
            HttpManager.getInstance().request({args:args,action:URLConfig.Get_Data},this.onGetData,this);
        });
    }
    /**
     * 获取战术数据返回
     * @param data
     */
    private onGetData (data:Object) {
        if(data['res']){
            if(data['data'][2]){
                ManagerData.getInstance().setValue([data['data'][2]]);
            }
            if(data['data']['totalSalary']){
                ManagerData.getInstance().totalSalary = data['data']['totalSalary'];
            }
            this.teamData = data['data'][0];
            this.taticsData = data['data'][1].Project;

            this.formatSalary();

            //PlayerC.teamInfo = this.data['Period'];
            this.formatTeam();
            //formatTemp();
            //formatValue(Manager.getInstance().KPI);
            //EffectUtil.numTextEffect2(_kp, Manager.getInstance().KPI, formatValue);
            
            //setBtnState();
            
            let item;
            let info;
            for(let i=0; i<this.SKILL_NUM; i++){
                info = FormationData.getInstance().getFormation((i+1)+"");
                info.lv = this.taticsData[i+1]
                info = FormationData.getInstance().getFormation((i+1+this.SKILL_NUM)+"");
                info.lv = this.taticsData[i+1+this.SKILL_NUM]
            }
        }else{
            Utility.fadeErrorInfo(ErrMsg.getInstance().getErr(data['code']));
        }
    }

    /**
     * 保存战术数据
     */
    private saveTatics () {
        let args:Object = new Object();
        args['Fids'] = new Array();
        args['Tids'] = new Array();
        args['Fids'][0] = (this.teamData['Formation'][0]).join(",");
        args['Fids'][1] = (this.teamData['Formation'][1]).join(",");
        args['Fids'][2] = (this.teamData['Formation'][2]).join(",");
        args['Fids'][3] = (this.teamData['Formation'][3]).join(",");
        args['Tids'][0] = this.objToStr(this.teamData['Period'][0], "Tid");
        args['Tids'][1] = this.objToStr(this.teamData['Period'][1], "Tid");
        args['Tids'][2] = this.objToStr(this.teamData['Period'][2], "Tid");
        args['Tids'][3] = this.objToStr(this.teamData['Period'][3], "Tid");
        
        HttpManager.getInstance().request({args:args,action:URLConfig.Post_Team_SetSolution},this.onTaticsSave,this);
    }
    /** 战术数据保存返回 */
    private onTaticsSave (data:Object) {
        if(data['res']){
            this.getTeam(this.teamData['Period'][this.controllor.tacticsSection]);
            this.formatTeam();
            ManagerData.getInstance().refreshKP();
        }else{
            Utility.fadeErrorInfo(ErrMsg.getInstance().getErr(data['code']));
        }
    }
    //
    private objToStr(obj:Object, key:string):string{
        let arr = new Array();
        for(let i in obj){
            arr.push(obj[i][key])
        }
        return arr.join(",");;
    }

    /** 工资帽 */
    private formatSalary () {
        this.lbl_max_cat.string = ManagerData.getInstance().totalSalary + "/" + ManagerData.getInstance().SalaryCap+"万";
    }

    /**
     * 格式化队伍信息
     */
    private formatTeam():void{
        this.getTeam(this.teamData['Period'][this.controllor.tacticsSection]);
        this.onTurnPage(null,'0');
        
        this.legendNum = 0;
        for(var i=0; i<this.PLAYER_NUM; i++){
            let player = this.mainPlayerList[i].getComponent(PlayerInfo);
            player.setPlayerData(this.mainArr[i], this.teamData['Formation'], this.controllor.tacticsSection);
            if(player.data['CardLevel'] == 1){
                this.legendNum++;
            }
        }
        //元老球员
        this.lbl_legend.string = this.legendNum + "/" + this.MAX_LEGEND;
        this.formatTatics();
    }

    /**功能函数-将主力与替补分开*/
	private getTeam(list:Array<Object>):void{
        this.mainArr = list;
        this.tempArr.splice(0, this.tempArr.length);
        var team = ManagerData.getInstance().Project;
        var info:Object;
        for(var i=0; i<team.length; i++){
            info = team[i];
            if(!this.check(team[i]['Pid'], list)){
                this.tempArr.push(info);
            }
        }
    }

    private check(pid:string, list:Array<Object>):boolean{
        for(var j=0; j<list.length; j++){
            if(list[j]['Pid'] == pid){
                return true;
            }
        }
        return false;
    }

    /**格式化战术*/
    private formatTatics():void{
        let formationList = this.teamData['Formation'][this.controllor.tacticsSection];
        let info:Object;
        for(let i=0; i<formationList.length; i++){
            let skillId = formationList[i];
            info = FormationData.getInstance().getFormation(skillId);

            if(parseInt(skillId)>6){
                //防守
                this.img_selected_defence.parent = this.nod_tactics_list.getChildByName('t'+skillId);
                this.lbl_tactics_defence_name.string = info['name'];
                this.lbl_tactics_defence_level.string = 'Lv'+this.taticsData[formationList[i]];
            }else{
                //进攻
                this.lbl_tactics_name.string = info['name'];
                this.lbl_tactics_level.string = 'Lv'+this.taticsData[formationList[i]];
                this.img_selected_attack.parent = this.nod_tactics_list.getChildByName('t'+skillId);
                this.updateTeamPriority(skillId - 1);
            }
        }
    }

    /** 更改球员进攻优先级 */
    private updateTeamPriority (skillIndex:number) {
        skillIndex = Math.min(5,skillIndex);
        for (let i = 0; i < this.PLAYER_NUM; i++) 
			{
                let value = this.teamPriorityData[skillIndex][i];
                let player = this.mainPlayerList[i];
                /** 优先级总共有多少？ */
                for(let j = 0;j<3;j++){
                    player.getChildByName('img_ball_'+j).active = (j<value);
                }
			}
    }
}
