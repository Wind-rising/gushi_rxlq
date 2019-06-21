import Utility from "../../utils/Utility";
import MatchType from "../../data/type/MatchType";
import SoundManager from "../../manager/SoundManager";
import SoundConfig from "../../config/SoundConfig";
import ManagerData from "../../data/ManagerData";
import LanConfig from "../../config/LanConfig";
import MatchControllor from "../../controllor/MatchControllor";

/**
 * 比赛类型选择
 */
const {ccclass, property} = cc._decorator;

@ccclass
export default class MatchSelectView extends cc.Component {

    private selectedMatchType:number = 0;
    /**比赛种类*/
    private TYPE_NUM:number = 7;
    /**比赛类型*/
    private MATCH_LIST:Array<string> = [MatchType.NORMAL_MATCH, MatchType.LADDER_MATCH, MatchType.LADDER_CROSSSERVER_MATCH, MatchType.LEAGUE_MATCH,MatchType.CHAMPION_MATCH, MatchType.ARENA_MATCH, MatchType.ALLSTAR_MATCH];
    //比赛介绍
    private MATCH_INTRO:Array<string> = [
        "巡回赛提供历届NBA赛季所有球队，供玩家挑战、扫荡，可获得经理经验、金币、球员卡等奖励",
        "天梯赛可自由报名参加，通过比赛获得天梯积分，根据积分排名发放天梯奖励。天梯比赛同时产出声望，可以兑换专属奖励",
        "跨服天梯为全服的PVP赛事，通过跨服比赛建立全服排名，根据排名发放奖励。跨服天梯同时产出荣誉度，可以兑换专属道具",
        "NBA联赛赛制模拟美职篮联赛，所有玩家通过比赛胜负获得积分，进入季后赛决出总冠军。NBA联赛赛事可以竞猜",
        "冠军试炼将NBA的每年的冠军球队分成5个时代，作为挑战对象供玩家以闯关形式进行挑战，可获得装备升级的材料",
        "竞技场中玩家可自主挑战其他玩家，挑战胜利就替换掉对手的排名，以两天为一个周期，获得竞技场排名奖励",
        "全明星赛提供每个赛季的NBA东西部全明星球队，玩家每天有两次免费挑战机会，可获得改造装备品质的图纸",
    ];

    pgv_match_type:cc.PageView = null;
    btn_left:cc.Button = null;
    btn_right:cc.Button = null;
    lbl_desc:cc.Label = null;

    onLoad () {
        this.pgv_match_type = this.node.getChildByName('pgv_match_type').getComponent(cc.PageView);
        this.btn_left = this.node.getChildByName('btn_left').getComponent(cc.Button);
        this.btn_left.clickEvents.push(
            Utility.bindBtnEvent(this.node,'MatchSelectView','onBtnPrev')
        );
        this.btn_right = this.node.getChildByName('btn_right').getComponent(cc.Button);
        this.btn_right.clickEvents.push(
            Utility.bindBtnEvent(this.node,'MatchSelectView','onBtnNext')
        );

        this.node.getChildByName('btn_enter').getComponent(cc.Button).clickEvents.push(
            Utility.bindBtnEvent(this.node,'MatchSelectView','onBtnEnter')
        );
        this.node.getChildByName('btn_return').getComponent(cc.Button).clickEvents.push(
            Utility.bindBtnEvent(this.node,'MatchSelectView','onBtnReturn')
        );
        this.lbl_desc = this.node.getChildByName('lbl_desc').getComponent(cc.Label);

        this.pgv_match_type.pageEvents.push(
            Utility.bindBtnEvent(this.node,'MatchSelectView','onPageScroll')
        );
    }

    start () {
        this.lbl_desc.string = this.MATCH_INTRO[this.selectedMatchType];
        this.pgv_match_type.scrollToPage(this.selectedMatchType,0.5);
    }

    // update (dt) {}


    onPageScroll (e:cc.PageView){
        let idx = e.getCurrentPageIndex();
        this.selectedMatchType = idx;
        this.lbl_desc.string = this.MATCH_INTRO[idx];
    }
    onBtnPrev () {
        this.selectedMatchType--;
        if(this.selectedMatchType<0){
            this.selectedMatchType = 0;
        }else{
            this.pgv_match_type.scrollToPage(this.selectedMatchType,0.5);
        }
    }
    onBtnNext () {
        this.selectedMatchType++;
        if(this.selectedMatchType<this.TYPE_NUM){
            this.pgv_match_type.scrollToPage(this.selectedMatchType,0.5);
        }else{
            this.selectedMatchType=this.TYPE_NUM-1;
        }
        
    }

    onBtnReturn (){
        SoundManager.play(SoundConfig.BTN_CLICK, 1, 0, 0, false);
        this.node.destroy();
    }
    onBtnEnter(){
        SoundManager.play(SoundConfig.BTN_CLICK);
        this.onShowMatch();
    }

    public setPageIdx (idx:number){
        this.selectedMatchType = idx;
        this.pgv_match_type.scrollToPage(idx,0.5);
    }

    private onShowMatch():void{
        switch((this.selectedMatchType+1)+''){
            case MatchType.NORMAL_MATCH://巡回赛
                MatchControllor.getInstance().showNormalMatch();
                break;
            case MatchType.LEAGUE_MATCH:
                // if(!_leagueMatch){
                //     _leagueMatch = new LeagueMatchView();
                // }
                // _leagueMatch.show();
                break;
            case MatchType.LADDER_MATCH:
                //LadderView.getInstance().show();
                break;
            case MatchType.LADDER_CROSSSERVER_MATCH:
                //跨服天梯30级开放
                if(ManagerData.getInstance().Level < 30)
                {
                    Utility.fadeErrorInfo("30级开启");
                    return;
                }
                // LadderCrossServerView.getInstance().show();
                
                // LadderCrossServerView.getInstance().addEventListener(Event.ADDED_TO_STAGE,onAddedToStage);
                
                break;
            case MatchType.ALLSTAR_MATCH:
                //AllStarController.getInstance().show();
                break;
            case MatchType.CHAMPION_MATCH:
                //ChampionView.getInstance().show();
                break;
            //竞技场
            case MatchType.ARENA_MATCH:
                //竞技场20级开放
                if(ManagerData.getInstance().Level < 20)
                {
                    Utility.fadeErrorInfo("20级开启");
                    return;
                }
                // ArenaView.getInstance().show();
                break;
            case MatchType.PLAYOFF_MATCH:
                // _playoffs = new PlayoffsView();
                // _playoffs.show();
                break;
            case MatchType.BLOOD_MATCH:
                // if(!_firstBlood){
                //     _firstBlood = new FirstBloodMatchView();
                // }
                // _firstBlood.show();
                break;
            default:
                Utility.fadeErrorInfo(LanConfig.commingSoon);
                break;
        }
    }
}
