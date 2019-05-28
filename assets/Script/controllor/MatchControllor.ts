
/**
 * 比赛信息控制类
 */
const {ccclass, property} = cc._decorator;
import Singleton from "../Utils/Singleton";
import AppConfig from "../config/AppConfig";
import MatchType from "../data/type/MatchType";
import URLConfig from "../config/URLConfig";
import HttpManager from "../utils/HttpManager";
import ManagerData from "../data/ManagerData";
import EventConst from "../data/EventConst";
import Events from "../signal/Events";
import ErrMsg from "../data/ErrMsg";
import Utils from "../utils/Utils";
import CountController from "./CountController";
import LoadingFullScreen from "../view/public/LoadingFullScreen";

@ccclass
export default class MatchControllor extends Singleton {
    private  _matchType: string;
    //
    private  _awayId: string;
    //
    private  _homeId: string;
    //
    private  _matchId: string;
    //比赛数据
    private  _matchData:Object;


    /** 跨服天梯赛 对方所在服务器编号 */
    public  AwaySid: string;
    /** 跨服天梯赛 自己所在服务器编号 */
    public  HomeSid: string;
    /** 跨服天梯赛 比赛编号 */
    public  MatchId: string;

    //赋值赛后奖励，静态处理
    public static rewardData:Object;
    
    /** get set */
    get matchType ():string{
        return this._matchType;
    }
    get awayId ():string{
        return this._awayId;
    }
    get homeId ():string{
        return this._homeId;
    }
    get matchId ():string{
        return this._matchId;
    }
    set matchId (value:string){
        this._matchId = value;
    }

    /**
     * 比赛开始-由赛前对比开始
     * @param matchType 比赛类型
     * @param awayId 对手ID
     * @param homeId挑战者ID，默认为玩家自己
     * @param matchId:比赛id，如天梯赛已经生成MatchId;
     * */
    public startMatch(matchType: string, awayId: string, homeId: string = "", matchId: string=""):void{
        this._homeId = homeId;
        this._awayId = awayId;
        this._matchType = matchType;
        this._matchId = matchId;

        /*if(_matchType == MatchType.ALLSTAR_MATCH || _matchType == MatchType.NORMAL_MATCH){*/
        // if(this._matchType == MatchType.LADDER_CROSSSERVER_MATCH)
        // {
        //     _matchCompareNew.AwaySid = AwaySid;
        //     _matchCompareNew.HomeSid = HomeSid;
        //     _matchCompareNew.MatchId = MatchId;
        //     _matchCompareNew.showCompare(matchType, awayId, homeId);
        //     _matchCompareNew.addEventListener(MatchCompareView.START, onStart);
        // }
        // else if(_matchType != "-1"){
        //     _matchCompareNew.showCompare(matchType, awayId, homeId);
        //     _matchCompareNew.addEventListener(MatchCompareView.START, onStart);
        // }else{
        //     _matchCompare.showCompare(matchType, awayId, homeId);
        //     _matchCompare.addEventListener(MatchCompareView.START, onStart);
        // }
        Utils.showDialog('match/MatchCompareView');
    }
    
    //获取比赛数据
    //发送比赛请求
        public onStart(){
        let vo = {};
        if(this._matchType == MatchType.NORMAL_MATCH){
            vo['action'] = URLConfig.Post_Regular_Fight;
            vo['args'] = {Rid:this._awayId}
            HttpManager.getInstance().request(vo,this.onPostMatch,this);
        }else if(this._matchType == MatchType.LADDER_MATCH){
            this.onPostMatch({res:true, data:{SyncData:{MatchId:this._matchId}}});
        }else if(this._matchType == MatchType.LADDER_CROSSSERVER_MATCH){
            this.onPostMatch({res:true, data:{SyncData:{MatchId:this._matchId}}});
        }
        else if(this._matchType == MatchType.ALLSTAR_MATCH)
        {
            vo['action'] = URLConfig.Post_AllStar_Fight;
            vo['args'] = {Tid:this._awayId}
            HttpManager.getInstance().request(vo,this.onPostMatch,this);
        }else if(this._matchType == MatchType.CHAMPION_MATCH){
            this.onPostMatch({res:true, data:{SyncData:{MatchId:this._matchId}}});
        }
    }

    public getCompareData(callback:Function,context?:Object){
        var vo = {action:URLConfig.Get_Data};
        if(this._matchType == MatchType.LADDER_CROSSSERVER_MATCH)
        {
            vo['args']  = [
                {
                    "n":URLConfig.LadderGlobalMatchView, 
                    "i":{
                        "MatchType":this._matchType,
                        "AwayId":this._awayId,
                        "HomeId":this._homeId,
                        "HomeSid":this.HomeSid,
                        "AwaySid":this.AwaySid,
                        "MatchId":this.MatchId
                    }
                }
            ]
        }
        else
        {
            vo['args']  = [
                {
                    "n":URLConfig.MatchView, 
                    "i":{
                        "MatchType":this._matchType,
                        "AwayId":this._awayId
                    }
                }
            ]
        }
        //Utils.showLoading();网络请求统一加loading
        HttpManager.getInstance().request(vo,(data)=>{
            if(context){
                callback.apply(context,[data]);
            }else{
                callback(data);
            }
        },this);
    }
    
    //请求成功，
    private onPostMatch(data:Object):void{
        //获取比赛录像
        if(data['res']){
            this._matchData = data['data']
            this.showReplay(this._matchType, this._matchData['SyncData']['MatchId']);
            if(data['data'] && data['data']['SyncData']['Score'])
                ManagerData.getInstance().Score = parseInt(data['data']['SyncData']['Score']);
        }else{
            Utils.fadeErrorInfo(ErrMsg.getInstance().getErr(data['code']));
            
            Events.getInstance().dispatch(EventConst.SHOW_MAIN);
            LoadingFullScreen.fadeOut();
        }
    }
    
    /**比赛获得奖励*/
    public getRewardData():void{
        let vo = {action:URLConfig.Post_Match_Lottery,args:{}};
        if(this._matchType == MatchType.LADDER_MATCH){
            vo.action = URLConfig.Get_Data
            vo.args = [{"n":URLConfig.LadderMatch, "i":{ MatchType:this._matchType, MatchId:this._matchId}}]
        }else if(this._matchType == MatchType.LADDER_CROSSSERVER_MATCH)
        {
            vo.action = URLConfig.Post_LadderGlobal_MatchScore;
            vo.args = {MatchId: this._matchId};
        }else if(this._matchType == MatchType.ARENA_MATCH){
            vo.action = URLConfig.Post_Arena_Reward;
            vo.args = {MatchId:this._matchId}
        }else{
            vo.action = URLConfig.Post_Match_Lottery
            vo.args = {MatchId:this._matchId}
        }
        HttpManager.getInstance().request(vo,onGet,this);
        
        function onGet(data:Object):void{
            //当跨服天梯赛 有请求奖励数据时，不再接受这次数据（服务端会在第一次请求后删除奖励数据）
            if(this._matchType == MatchType.LADDER_CROSSSERVER_MATCH && this.rewardData != null)
            {
                return;
            }
            this.rewardData = data;
        }
    }
    
    /**
     * 比赛开始
     * @param matchType，比赛类型
     * @param matchId，录像ID
     * */
    public showReplay(matchType: string, matchId: string):void{
        this._matchId = matchId;
        this._matchType = matchType;
        
        CountController.getInstance().showReplay(matchId,matchType);
    }
    
    private noMatchFun():void
    {
        Utils.fadeErrorInfo("呀~录像找不着了哦！");
        Events.getInstance().dispatch(EventConst.SHOW_MATCH_SELECT, this._matchType);
        //关闭加载
        // LoadingView.getInstance().awaysInStage = false;
        // LoadingView.getInstance().close();
    }
    
    //比赛结束，进入赛后分析
    private onMatchOver(data:Object=null):void{
        
        // SoundManager.play(SoundConfig.BG, 0.8, 0,  999);
        // Utils.playerKPs = null;
        
        // if(_matchType == "14")
        // {
        //     return;
        // }
        
        // if(_analysisView == null){
        //     _analysisView = new AnalyseView();
        // }
        //  needFresh:Boolean = (_homeId=="" || Manager.getInstance().Mid == _homeId || Manager.getInstance().Mid == _awayId)
        // _analysisView.setData(data,_matchType,_matchId, needFresh);
        // MatchBG.getInstance().show();
    }
}
