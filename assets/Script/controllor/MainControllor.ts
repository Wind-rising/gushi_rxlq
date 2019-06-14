/**
 * 页面主控制逻辑
 */
const {ccclass, property} = cc._decorator;

import ManagerData from '../data/ManagerData';
import Events from '../signal/Events';
import HttpManager from '../utils/HttpManager';
import PlayerUtil from '../utils/PlayerUtil';
import AppConfig from '../config/AppConfig';
import URLConfig from '../config/URLConfig';
import LimitGiftModel from '../data/LimitGiftModel';
import FriendModel from '../data/FriendModel';
import EventConst from '../data/EventConst';
import UnionMode from '../data/UnionMode';
import Utility from '../utils/Utility';
import Singleton from '../Utils/Singleton';

@ccclass
export default class MainControllor extends Singleton {
    //是否需要刷新-防止比赛是弹出分享等--------------------------------------------------
    private _needFresh:boolean = false;
    //刷新时间
    public REFRESH_TIME:number = 180;
    public BEAT_TIME:number = 300;

    /** 用户名，登录的时候用 其他信息以后接渠道的时候再处理*/
    public userName:string = '';

    private _schedule:cc.Scheduler = null;

    /**
     * 构造函数
     */
    public constructor(){
        super();
        this._schedule = new cc.Scheduler();
        this.init();
    };
    /**
     * 初始化
     */
    private init():void{
        Events.getInstance().addListener(ManagerData.INIT, this.onInit,this);
        //ManagerData.getInstance().refresh();
    };

    public update(dt){
        this._schedule.update(dt);
    }
    /**
     * 侦听ManagerData.INIT 事件
     * @param event 
     */
    private onInit (event):void{
        if(ManagerData.getInstance().Logo){//加载主场景
            Events.getInstance().addListener(AppConfig.SYS_INIT, this.onSysInit,this);
            //先预加载主场景
            cc.director.preloadScene('MainScene',(completedCount, totalCount, item)=>{
            },(error, asset)=>{
                if(error){
                    Utility.alert('加载失败,请重试！',this.onInit.bind(this),{title:'提示',showCancel:false});
                    return;
                }
                /**
                 * 自动登录，如果失败了，要设置按钮再次登录
                 */
                this.startGame();
            });
        }else{//创建球队
            Utility.showDialog('login/CreateRoleView');
            
        }
    };
    
    /**start游戏开始*/
    public startGame ()
    {
        //显示主场景
        cc.director.loadScene('MainScene');
        
        //发送一个完成事件,移除loader--
        //events.dispatch(EventConst.EVENT_HIDE_LOADING);
        
        // if(_limitGiftView == null)
        // {
        //     _limitGiftView = new LimitGitfView(_main.ui.limitGift);
        // }
        
        LimitGiftModel.getInstance().pointGift();
    };
    //     /**系统初始化成功*/
    public onSysInit (){
        //刷新一下信息
        this.refreshData();
        //心跳服务
        this.heartbeat();
        // //获取球员KP
        PlayerUtil.getKP(null);
        //固定时间间隔刷新数据

        //todo 需要从外部调用
        this._schedule.schedule(this.refreshData,this,this.REFRESH_TIME);
    };

    /**
     * 心跳
     */
    heartbeat(){
        function beat(){
            let srvArgs = {action:URLConfig.Post_Manager_HeartBeat,
                args:[]};
            HttpManager.getInstance().request(srvArgs,()=>{},this);
        };
        this._schedule.schedule(beat,this,this.BEAT_TIME);
    };
    
    //     /**刷新信息*/
    private refreshData (){
        // if(MatchBG.getInstance().isShow){
        //     this._needFresh = true;
        //     return;
        // }
        //MissionView.getInstance().getData();
        FriendModel.getData(onFreshFriend);
        Utility.getFeed();
        ManagerData.getInstance().refreshBuff();
        
        ManagerData.getInstance().refresh();
        
        MainControllor.getInstance().addUnionSkillBUff();
        
        UnionMode.getInstance().getManager("", 
            function(obj:Object):void
            {
                if(obj['data']['managerGuildInfo'] && obj['data']['managerGuildInfo'].gid == 0 && obj['data']['guildInvite'].length > 0)
                {
                    for(var i=0;i < obj['data']['guildInvite'].length;i++)
                    {
                        Utility.showConfirm("<font color='#FFCC33'>【" + obj['data']['LidInfo'][obj['data']['guildInvite'][i].Lid] + "】</font>" + "邀请你加入" + 
                            "<font color='#FF6600'>【" + obj['data']['guildInvite'][i]['Name'] + "】</font>公会！"
                                , yesFun
                                , {title:"公会",showCancel:true,onCancel:noFun}
                            );
                        
                        break;
                    }
                }
            }
        )
        
        function yesFun(id:number):void
        {
            UnionMode.getInstance().postGuildInviteDispose(id, 1, 
                function():void
                {
                    Events.getInstance().addListenerOnce(ManagerData.PROPERTY_CHANGED, showUnion,this);
                    ManagerData.getInstance().refresh();
                }
            );
        }
        
        function showUnion(e:Event):void
        {
            Events.getInstance().dispatch(EventConst.SHOW_UNION);
        }
        
        function noFun(id:number):void
        {
            UnionMode.getInstance().postGuildInviteDispose(id, 0, null);
        }
        
        //刷新好友，如果有人邀请，则弹出提示框
        function onFreshFriend(data:Object):void{
            if(data['res']){
                var inviteList:Object = data['data'][0].InviteList;
                for(var i in inviteList){
                    //加好友	
                    Utility.showConfirm("<font color='#FF6600'>"+inviteList[i]+"</font>已加您为好友，是否加TA为好友？", FriendModel.accept,{
                        title:"好友",
                        showCancel:true,
                        onCancel:FriendModel.refuse
                    });
                    break
                }
            }
        };
    };
    public addUnionSkillBUff():void
    {
        UnionMode.getInstance().postGuildSkill(
            function(obj:Object):void
            {
                if(ManagerData.getInstance().gid == 0 || obj['studyedskill'] == null || obj['studyedskill'].length == 0)
                {
                    Events.getInstance().dispatch(EventConst.REMOVE_UNION_SKILL);
                }
            }
        );
    }
}
