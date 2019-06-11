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

@ccclass
export default class PlayerTactics extends cc.Component {

    private EventListenerTag:string = 'PlayerTacticsListener';

    private teamData:Object = null;
    private taticsData:Object = null;
    //主力
    private mainArr:Array<Object>;
    //替补
    private tempArr:Array<Object> = new Array();
    
    /** 球员控制器 */
    private controllor:PlayerControllor = null;
    
    /** 战术数量 */
	private SKILL_NUM:number = 6


    /** 选中的按钮 */
    private selectedBtn:cc.Button = null;

    /** 综合实力 */
    private lbl_kpi:cc.Label = null;
    /** 工资帽 */
    private lbl_max_cat:cc.Label = null;
    /** 战术名 */
    private lbl_tactics_name:cc.Label = null;
    /** 战术等级 */
    private lbl_level:cc.Label = null;

    /** 选中进攻战术标志 */
    private img_selected_defence:cc.Node = null;
    private img_selected_attack:cc.Node = null;

    onLoad () {
        this.controllor = PlayerControllor.getInstance();

        let nod_left = this.node.getChildByName('nod_left');
        let nod_right = this.node.getChildByName('nod_right');

        this.lbl_kpi = nod_left.getChildByName('lbl_kpi').getComponent(cc.Label);
        this.lbl_max_cat = nod_left.getChildByName('lbl_max_cat').getComponent(cc.Label);
        this.lbl_tactics_name = nod_left.getChildByName('lbl_tactics_name').getComponent(cc.Label);
        this.lbl_level = nod_left.getChildByName('lbl_level').getComponent(cc.Label);

        
        /** 返回按钮 */
        this.node.getChildByName('btn_return').getComponent(cc.Button).clickEvents.push(
            Utility.bindBtnEvent(this.node,'PlayerTactics','onReturn')
        );

        /** 工资帽 */
        nod_left.getChildByName('btn_add_hat').getComponent(cc.Button).clickEvents.push(
            Utility.bindBtnEvent(this.node,'PlayerTactics','onAddHat')
        );
        

        /** 切换节 */
        for(let i = 0;i < 4;i++){
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
        let nod_tactics_list = nod_left.getChildByName('nod_tactics_list');
        //进攻战术
        for(let i = 0;i<this.SKILL_NUM;i++){
            let tacticsIcon = nod_tactics_list.getChildByName('t'+(i+1));
            if(!this.img_selected_attack){
                this.img_selected_attack = tacticsIcon.getChildByName('img_selected_attack');
            }
            tacticsIcon.getComponent(cc.Button).clickEvents.push(
                Utility.bindBtnEvent(this.node,'PlayerTactics','onSelectedTacticAttack',''+i)
            );
        }
        //防守战术
        for(let i = 0;i<this.SKILL_NUM;i++){
            let tacticsIcon = nod_tactics_list.getChildByName('t'+(this.SKILL_NUM+i+1));
            if(!this.img_selected_defence){
                this.img_selected_defence = tacticsIcon.getChildByName('img_selected_defence');
            }
            tacticsIcon.getComponent(cc.Button).clickEvents.push(
                Utility.bindBtnEvent(this.node,'PlayerTactics','onSelectedTacticDefence',''+i)
            );
        }

        this.initEvent();
        
        this.getData();

    }

    start () {

    }

    // update (dt) {}
    
    /** 初始化事件 */
    private initEvent () {
        Events.getInstance().addListener(ManagerData.PROPERTY_CHANGED, this.onProChange,this,this.EventListenerTag);
    }
    
    /**
     * 返回按钮
     * @param e 
     */
    onReturn (e:cc.Event) {

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
    }
    
    /** 选择进攻战术 */
    onSelectedTacticAttack (e:cc.Event,customEventData){
        this.img_selected_attack.parent = e.currentTarget;
    }
    /** 选择防守战术 */
    onSelectedTacticDefence (e:cc.Event,customEventData){
        this.img_selected_defence.parent = e.currentTarget;
    }

    /**
     * 添加工资帽
     * @param e 
     */
    onAddHat (e:cc.Event) {
        cc.log('添加工资帽')
    }

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
        
        this.onProChange();
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
            
            var item;
            var info;
            for(var i=0; i<this.SKILL_NUM; i++){
                info = FormationData.getInstance().getFormation((i+1)+"");
                info.lv = this.taticsData[i+1]
                info = FormationData.getInstance().getFormation((i+1+this.SKILL_NUM)+"");
                info.lv = this.taticsData[i+1+this.SKILL_NUM]
            }
        }else{
            Utility.fadeErrorInfo(ErrMsg.getInstance().getErr(data['code']));
        }
    }

    private formatSalary () {
        this.lbl_max_cat.string = ManagerData.getInstance().totalSalary + "/" + ManagerData.getInstance().SalaryCap+"万";
    }

    /**
     * 格式化队伍信息
     */
    private formatTeam():void{
        this.getTeam(this.teamData['Period'][this.controllor.playerPageIndex])
        // var page = _pageCom.currentPage;
        // _pageCom.removeEventListener(XPageCom.TURN_PAGE, onTurnPage);
        // _pageCom.data = _tempArr;
        // _pageCom.currentPage = page;
        // _pageCom.addEventListener(XPageCom.TURN_PAGE, onTurnPage);
        // onTurnPage(null);
        
        // var player:PlayerC;
        // _legendNum = 0;
        // for(var i:uint=0; i<PLAYER_NUM; i++){
        //     player = _players[i];
        //     player.addEventListener(PlayerC.SELECTED, onSelected);
        //     player.format(_mainArr[i], int(_tacticsGroup.selectedButton.data));
        //     if(player.data.CardLevel == 1){
        //         _legendNum++;
        //     }
        // }
        // $legendNumTxt.text = "元老球员："+_legendNum + "/" + MAX_LEGEND;
        // formatTatics();
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
        //格式化阵型
        // var formationList:Array = this.teamData.Formation[_tacticsGroup.selectedButton.data];
        // var info:Object;
        // for(var i:int=0; i<formationList.length; i++){
        //     info = FormationData.getFormation(formationList[i]);
        //     if(info.Type == "0"){
        //         $defendFormationTxt.text = info.Name+" Lv"+_taticsData[formationList[i]];
        //         _defendGroup.selectedButton = _defendGroup.buttons[formationList[i]-7];
        //     }else{
        //         $attackFormationTxt.text = info.Name+" Lv"+_taticsData[formationList[i]];
        //         _attackGroup.selectedButton = _attackGroup.buttons[formationList[i] - 1];
        //         updateTeamPriority(formationList[i] - 1);
        //     }
        // }
    }
}
