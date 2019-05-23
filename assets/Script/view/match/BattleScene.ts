/**
 * 
 * 战斗场景主逻辑，相当于CountCountroller
 * 
 */
const {ccclass, property} = cc._decorator;

import Trancelate from "../../utils/Trancelate";
import Utils from "../../utils/Utils";
import Events from "../../signal/Events";
import ManagerLvData from "../../data/ManagerLvData";
import ErrMsg from "../../data/ErrMsg";
import ItemData from "../../data/ItemData";
import MatchConfig from "../../config/MatchConfig";
import EventConst from "../../data/EventConst";
import HttpManager from "../../utils/HttpManager";
import CountController from "../../controllor/CountController";

@ccclass
export default class BattleScene extends cc.Component {

    private EVENT_LISTENER_NAME:string = 'BattleSceneListener'
    /**
     * 主场景
     */
    //private _main:CountView;
    
    /**
     * 场景
     */
    //private _scene:SceneView;
    
    /**
     * 播报
     */
    //private _cast:CountAnalizeView;
    
    /**
     * 篮球
     */
    //private  _ball:BallView;
    //private _ball:Ball;
    
    /**
     * 比赛数据加载器
     */
    //private _loader:URLLoader;
    
    /**
     * 比赛数据
     */
    private _match:Object;
    
    /**
     * UI显示的球员列表
     */
    //private _playerList:Array<Player>;
    
    /**
     * 当前节
     */
    private _curQuater:number;
    
    /**
     * 时间轴
     */
    //private _timer:Timer;
    
    /**
     * 回合数
     */
    private  _step:number;
    
    /**
     * 左右篮网
     */
    //private  _leftNet:MovieClip;
    
    //private  _rightNet:MovieClip;
    
    /**
     * 加载计数器
     */
    private  _countLoader:number;
    
    //private  _slamDunkPlayer:Player;
    
    //private  _reboundPlayer:Player;
    
    private  _obj:Object;
    
    private  _speStep:number;
    
    private  _loadStep:number;
    
    private  _messagetype:number;
    
    private  _messageSkill: string;
    
    private patX:RegExp = /X/gi;
    
    private patY:RegExp = /Y/gi;
    
    private patZ:RegExp = /Z/gi;
    
    private  _skipLimit:Boolean;
    
    public  _inPause:Boolean;
    
    public  _spePass:number;
    
    //private  _tween:TweenLite;
    
    public static curve:number = 1;
    
    public static ground:number = 2;
    
    private  _speed:number = 1;
    
    private  _score:Object;
    
    private  _inShowUi:Boolean;
    
    private  _inShoot:Boolean;
    
    private  _uiComplete:Boolean;

    // LIFE-CYCLE CALLBACKS:

//     onLoad () {
//         this.node.getChildByName('count_map').active = false;
//         this.node.getChildByName('count_view').active = false;
//         this.node.getChildByName('loading_dialog').active = true;

//         /** 测试，为了能正常进入游戏加载配置表 */
//         ManagerLvData.getInstance().init();
//         ErrMsg.getInstance().init();
//         ItemData.init();
//         cc.loader.loadRes('data/JsonList',(err, data)=>{
//             if(!err){
//                 let urls = [];
//                 for(let i = 0;i<data.json.length;i++){
//                     urls.push('data/'+data.json[i].split('.')[0]);
//                 }
//                 //加载资源，显示进度条
//                 cc.loader.loadResArray(urls,(completedCount, totalCount, item)=>{
//                 }, (error, resource)=>{
//                     if(!error){
//                         let len = resource.length;
//                         for(let i = 0;i<len;i++){
//                             if(resource[i].json){
//                                 Events.getInstance().dispatch('EventJsonDataLoaded',[resource[i].name,resource[i].json]);
//                             }
//                         }
//                         this.getData();
//                     }else{
//                         Utils.alert('配置文件加载失败,请重试！',this.start,{title:'提示',showCancel:false});
//                     }
//                 });
//             }
//         });
//     }

//     start () {

//         this._countLoader = 0;
        
//         this._curQuater = 0;
        
//         MatchConfig.MatchTalk = 0;
        
//         MatchConfig.MatchAnalize = 0;
        
//         MatchConfig.MatchAttackStep = 0;
        
//         MatchConfig.Living = 0.2;
        
//         MatchConfig.MoveLive = 0.4;
        
//         this._uiComplete = false;
        
//         this._speed = 1;
        
//         this._loadStep = 0;
        
//         this._inShowUi = true;
        
//         if(this._score == null)
//         {
//             this._score = new Object();
//         }
        
//         this._skipLimit = false;
        
//         this.addEvent();
        
//         CountController.getInstance().getData(this.binaryGameDataHandler,this);
//     };

//     // update (dt) {}
    
    
//     private addEvent():void
//     {
//         //移除球的显示位置
//         Events.getInstance().addListener(EventConst.CLOSE_BALL, this.closeBall,this,this.EVENT_LISTENER_NAME);
        
//         Events.getInstance().addListener(EventConst.CHANGE_STEP, this.roundChange,this,this.EVENT_LISTENER_NAME);
        
//         Events.getInstance().addListener(EventConst.ATTACK_SKILL, this.processSkill,this,this.EVENT_LISTENER_NAME);
//     }
    
//     /**
//      * 解析数据
//      */
//     private binaryGameDataHandler(data):void
//     {	
//         //获取比赛奖励
//         //MatchControllor.getInstance().getRewardData();
        
//         this._match = Trancelate.getInstance().ConverData(data);

//         cc.log('this._match = ' + this._match);
//         //预加载所需要的资源
//         CountController.getInstance().loadRes(this._match, this.initScene,this);

//         // CountLoadPlayerController.getInstance().loadPlayer(this._match);
        
//         // CountResController.getInstance().loadModel();
//     }
    
//     /**
//      * 初始化场景
//      */
//     private initScene():void
//     {	
//         _scene = new SceneView();
        
//         _scene.x =0;
//         _scene.y =0;

//         _scene.container = _main;
        
//         _main.addChild(_scene);
        
//         _scene.show();
        
//         _scene.addMap(_match.mapId);
        
//         _leftNet = MatchConfig.MatchResource[ResourceType.map + _match.mapId].left;
//         _rightNet = MatchConfig.MatchResource[ResourceType.map + _match.mapId].right;
        
//         _leftNet.gotoAndStop(1);
//         _rightNet.gotoAndStop(1);

//         CameraController.getInstance().scene = _scene;
        
//          i:number;
//          home:Array = [];
//         for(i=0;i<_match.enterHomePlayer[0].length;i++)
//         {
//             home.push(ItemData.getPlayerInfo(_match.homePlayerInfo[_match.enterHomePlayer[0][i][0]].pid));
//         }
        
//          away:Array = [];
//         for(i=0;i<_match.enterAwayPlayer[0].length;i++)
//         {
//             away.push(ItemData.getPlayerInfo(_match.awayPlayerInfo[_match.enterAwayPlayer[0][i][0]].pid));
//         }
        
//         _loadStep = 0;
        
//         CountResController.getInstance().loadUi(_match, endLoad);
        
//         CountUiController.getInstance().showCountBefore(home, away, _match, endLoad);
//     }
    
//     private endLoad():void
//     {	
//         _loadStep++;
        
//         if(_loadStep >= 2)
//         {
//             CountUiController.getInstance().removeUpdate();
//             CountUiController.getInstance().removeSkip()
//             initPlayer();
//         }
//     }
    
//     /**
//      * 初始化球员
//      */
//     private initPlayer():void
//     {
//         CountUiController.getInstance().removeBeforePanel();
        
//         _scene.addMask();
        
//         initCountPlayer();
        
//         _ball = new Ball(_scene);
        
//         _scene.addBall(_ball);
        
//          point:Point = GridController.instance.getScenePosition(new Vector3D(MatchConfig.GroundWidth/2, MatchConfig.GroundHeight/2, -60));
        
//         _ball.setPosition(point);
        
//         _scene.sortItems();
        
//         //190
//         _step = 0;
        
//         if(_cast == null)
//         {
//             _cast = new CountAnalizeView();
//         }
        
//         _main.addChild(_cast);
        
//         _cast.show();
        
//         _cast.x = (_main.stage.stageWidth - _cast.width)/2 - LayerManager.delX/2;
//         if(LayerManager.delY < 0)
//         {
//             _cast.y = _main.stage.stageHeight - 76 - LayerManager.delY/2;
//         }
//         else
//         {
//             _cast.y = _main.stage.stageHeight - 76 - LayerManager.delY;
//         }
        
//         CountUiController.getInstance().showTime(_match.homeName, _match.awayName, _match.homeLogo, _match.awayLogo);
        
//         updatePlayerList();
        
//         CountUiController.getInstance().addBtn();
        
//         if(_match.homeCom[0] == null && _match.awayCom[0] == null)
//         {
//             endInit();
//         }
//         else
//         {
//             //处理天赋
//             CountComposeController.instace.showCompose(_match, 0, _playerList, endInit);
//         }
//         //CountAssitantController.getInstance().excuteJump(_ball, startGame);	
//     }
    
//     private endInit():void
//     {
//         CountAssitantController.getInstance().excuteJump(_ball, startGame);	
//     }
    
//     public closeUi():void
//     {
//         _inShowUi = false;
//         TweenLite.to(_cast, 0.5, {alpha:0});
//     }
    
//     public showUi():void
//     {
//         _inShowUi = true;
//         TweenLite.to(_cast, 0.5, {alpha:1});
//     }
    
//     /**
//      * 公告板
//      */
//     public updateAnalizeView():void
//     {
//         if(_cast)
//         {
//             _cast.x = (_main.stage.stageWidth - _cast.width)/2 - LayerManager.delX/2;

//             if(LayerManager.delY < 0)
//             {
//                 _cast.y = _main.stage.stageHeight - 76 - LayerManager.delY/2;
//             }
//             else
//             {
//                 _cast.y = _main.stage.stageHeight - 76 - LayerManager.delY;
//             }
//         }
//     }
    
//     /**
//      *  更新每一节球员信息
//      */
//     private updatePlayerList():void
//     {
//          home:Array = new Array();
//          away:Array = new Array();
        
//         for each(var player:Player in _playerList)
//         {
//             if(player.info.cid < 100)
//             {
//                 home.push([player.info,player.data, _curQuater]);
//             }
//             else
//             {
//                 away.push([player.info,player.data, _curQuater]);
//             }
            
//             if(_score[player.info.cid] == null)
//             {
//                 _score[player.info.cid] = [0,0,0,0,0,0];
//             }
//         }

//         CountUiController.getInstance().ListInfo(home, away, _score, _inShowUi);
//     }
    
//     /**
//      * 初始化每一节的球员数据
//      * 通过_curQualter的变化进行更改球员信息
//      */
//     private initCountPlayer():void
//     {
//         if(_playerList == null)
//         {
//             _playerList = new Vector.<Player>();
//             _playerList.length = 10;
//         }
        
//          i:number;
        
//         for(i=0;i<_match.enterHomePlayer[_curQuater].length;i++)
//         {
//             if(_playerList[i] == null)
//             {
//                 _playerList[i] = new Player(_scene, _main, PlayerSide.Home, _match.homeCloth, _match.matchType, i);					
//             }
            
//             _playerList[i].info = _match.homePlayerInfo[_match.enterHomePlayer[_curQuater][i][0]];
//         }
        
//         for(i=0;i<_match.enterAwayPlayer[_curQuater].length;i++)
//         {
//             if(_playerList[i + 5] == null)
//             {
//                 _playerList[i + 5] = new Player(_scene, _main, PlayerSide.Away, _match.awayCloth, _match.matchType, i+5);
//             }
            
//             _playerList[i + 5].info = _match.awayPlayerInfo[_match.enterAwayPlayer[_curQuater][i][0]];
//         }
        
//         if(_curQuater == 0)
//         {
//             initRound();
//         }
//         else
//         {
//             for each(var player:Player in _playerList)
//             {
//                 player.doAction(-1);
//             }
//         }
//     }
    
//     /**
//      * 初始化每一节开始球员的位置和影子
//      */
//     private initRound():void
//     {
//         for each(var player:Player in _playerList)
//         {
//             _scene.addPlayer(player);
            
//             player.shadow = new ShadowView(_scene, XFacade.getInstance().getUI("CountShadow"));
            
//             player.setPos(0, false);
//             player.doAction(-1);
//         }
//     }
    
//     /**
//      * 开始比赛
//      */
//     private startGame():void
//     {	
//         SoundManager.stop(SoundConfig.COUNT_LOADING);
        
//         SoundManager.play(SoundConfig.COUNT_GROUND, 0.5, 0, 5000);
        
//         SoundManager.play(SoundConfig.COUNT_GROUND2, 0.4, 0, 5000);
        
//         _loadStep = 0;
        
//         for(var i:number=0;i<_playerList.length;i++)
//         {
//             _playerList[i].doAction(0, startMatch);
//         }		
//     }
    
//     private endStart():void
//     {
//         _loadStep++;
        
//         if(_loadStep == 2)
//         {
//             startMatch();
//         }
//     }
    
//     /**
//      * 加载两边UI
//      */
//     private startMatch():void
//     {
//         if(_step > 100)
//         {
//             return;
//         }
        
//          player:Object
//         for(var i:number=0;i<_playerList.length;i++)
//         {
//             if(_playerList[i].info.match[1].state == PlayerActionType.take_ball)
//             {
//                 player = _playerList[i].info.match[1];
//                 break;
//             }
//         }
        
//         _tween = TweenLite.to(_ball, 0.4, {x:player.playerPoint.x, y:player.playerPoint.y - 40, onComplete:
//             function():void
//             {
//                 //_tween.kill();
                
//                 //TweenLite.killTweensOf(_ball);
                
//                 _tween.kill();
                
//                 _tween = null;
//             }
//         });
        
//         if(_timer == null)
//         {
//             _timer = new Timer(MatchConfig.Living*1000);
//             _timer.addEventListener(TimerEvent.TIMER, play);
//             _timer.start();
//         }
//     }
    
//     /**
//      * 球场整个逻辑的运算
//      * 每一次timer都需要执行
//      */
//     public play(e:TimerEvent=null):void
//     {	
//         //无用
//         if(_step <= 10)
//         {
//             //_step = 1660;
//             //CountLoadPlayerController.getInstance().loadPlayer(_match);
//             //_curQuater = 3;
//         }
        
//         //处理球员后加载
//         if(_uiComplete == false)
//         {
//              tag1:Boolean = false;
            
//             for each(var player1:Player in _playerList)
//             {
//                 if(player1 == false)
//                 {
//                     tag1 = true;
//                     break;
//                 }
//             }
            
//             if(tag1 == false)
//             {
//                 _uiComplete = true;
                
//                 CountUiController.getInstance().removeInfo();
//             }
//         }
        
//         //CountUiController.getInstance().updateRound(_step);
        
//          tag:Boolean = false;
        
//         for each(var player:Player in _playerList)
//         {
//             if(player.uiCom == false)
//             {
//                 tag = true;
                
//                 break;
//             }
//         }
        
//         if(tag)
//         {
//             CountUiController.getInstance().addLoad();
//         }
//         else
//         {
//             CountUiController.getInstance().removeLoad();
//         }
        
//         //新手引导
//         if(_step == 5)
//         {
//             if(FirstMatchGuide.getInstance()){
//                 FirstMatchGuide.getInstance().showMatch(CountUiController.getInstance().skipBtn);
//             }else if(SecondMatchGuide.getInstance()){
//                 SecondMatchGuide.getInstance().showMatch(CountUiController.getInstance().skipBtn);
//             }else if(ThirdMatchGuide.getInstance()){
//                 ThirdMatchGuide.getInstance().showMatch(CountUiController.getInstance().skipBtn);
//             }else if(ForthMatchGuide.getInstance()){
//                 ForthMatchGuide.getInstance().showMatch(CountUiController.getInstance().skipBtn);
//             }else if(LadderGuide.getInstance()){
//                 LadderGuide.getInstance().showMatch(CountUiController.getInstance().skipBtn);
//             }else if(AllStarGuide.getInstance()){
//                 AllStarGuide.getInstance().showMatch(CountUiController.getInstance().skipBtn);
//             }
//         }
        
//         //更新球场时间
//         CountUiController.getInstance().updateTime(_match.roundInfo, _step, _match.singleRound);

//         if(_step == _match.totalRound)
//         {
//             pause();
            
//             if(_inShoot == false)
//             {
//                 skipMatch();
//             }
//             else
//             {
//                 TimerCommand.registerTimeCommand(endShoot, null, 10);
//             }
            
//             return;
//         }
        
//         if(_obj)
//         {
//             dispatch(EventConst.CHANGE_STEP);
//         }
        
//         //处理回合信息
//         processRoundInfo();
//     }
    
//     private endShoot():void
//     {
//         if(_inShoot == false)
//         {
//             TimerCommand.removeTimeCommand(endShoot);
            
//             skipMatch();
//         }
//     }
    
//     //更新球员信息
//     private updatePlayer():void
//     {
//          i:number;
        
//         for(i=0;i<_match.enterHomePlayer[_curQuater].length;i++)
//         {
//             _playerList[i].info = _match.homePlayerInfo[_match.enterHomePlayer[_curQuater][i][0]];
            
//             _playerList[i].setPos(_step + 1);
            
//             _playerList[i].inAction = false;
            
//             _playerList[i].change = true;
            
//             _playerList[i].doAction(_step + 1);
//         }
        
//         for(i=0;i<_match.enterAwayPlayer[_curQuater].length;i++)
//         {
//             _playerList[i + 5].info = _match.awayPlayerInfo[_match.enterAwayPlayer[_curQuater][i][0]];
            
//             _playerList[i + 5].setPos(_step + 1);
            
//             _playerList[i + 5].inAction = false;
            
//             _playerList[i + 5].change = true;
            
//             _playerList[i + 5].doAction(_step + 1);
//         }
        
//         //计算球场镜头位置
//         CameraController.getInstance().speMove(_step, _playerList);
        
//         updatePlayerList();
        
//         _leftNet.gotoAndStop(1);
//         _rightNet.gotoAndStop(1);
        
//         if(_match.homeCom[_curQuater] == null && _match.awayCom[_curQuater] == null)
//         {
//             restart();
//         }
//         else
//         {
//             //处理天赋
//             CountComposeController.instace.showCompose(_match, _curQuater, _playerList, restart);
//         }
//     }
    
//     private processRoundInfo():void
//     {	
//         CameraController.getInstance().move(_step, _playerList);
        
//          i:number;
        
//         if(_step == 0)
//         {	
//             _step++;
            
//             return;
//         }
        
//         //过节比赛
//         if(_match.matchInfo[_step] && _match.matchInfo[_step].interuption != 0)
//         {
//             pause();
            
//             SoundManager.play(SoundConfig.COUNT_END_QUALTER, 1, 0, 1);
            
//             _ball.show = false;
            
//             for each(var player:Player in _playerList)
//             {
//                 player.stop();
//                 player.inAction = false;
//             }
            
//             CountUiController.getInstance().oneQuater(_curQuater + 1,
//                 function():void
//                 {
//                     _curQuater++;
//                     updatePlayer();
//                     _step++;
//                 }
//             );
//             return;
//         }
        
//         _skipLimit = false;
        
        
//         //处理每个球员的动作
//         for(i=0;i<_playerList.length;i++)
//         {	
//             if(_slamDunkPlayer && _slamDunkPlayer == _playerList[i])
//             {
//                 continue;
//             }
            
//             if(_inPause == true)
//             {
//                 return;
//             }
            
//             _playerList[i].change = false;
            
//             _playerList[i].setPos(_step);
            
//             _playerList[i].doAction(_step);
            
//             if(_playerList[i].info.match[_step] && _playerList[i].info.match[_step].state == PlayerActionType.slam_dunk)
//             {
//                 _slamDunkPlayer = _playerList[i];
//             }
//             else if(_playerList[i].info.match[_step] && (_playerList[i].info.match[_step].state == PlayerActionType.take_ball || _playerList[i].info.match[_step].state == PlayerActionType.idle_ball))
//             {
//                 _ball.show = false;
//             }
//         }
        
//         //球员重新排序
//         _scene.sortItems();
        
//         if(_match.matchInfo[_step] == null)
//         {
//             _step++;
            
//             return;
//         }

//         _obj = _match.matchInfo[_step];

//         //分别对每一个球员的动作做预先处理的工作
//         if(_obj.type == CountPlayerType.none || _obj.type == CountPlayerType.rebound || _obj.type == CountPlayerType.reboundFree)
//         {
//             if(_obj.type == CountPlayerType.rebound)
//             {
//                 for each(var p:Player in _playerList)
//                 {
//                     if(p.info.cid == _obj.rebound.getBallCid)
//                     {
//                         p.inReboundAction = PlayerActionType.attack_rebounds;
                        
//                         break;
//                     }
//                 }
//             }
            
//             _obj = null;
//             _speStep = 0;
//         }
//         else if(_obj.type == CountPlayerType.passSuss || _obj.type == CountPlayerType.openBall || _obj.type == CountPlayerType.passFail)
//         {
//             _speStep = _step + 1;
//         }
//         else if(_obj.type == CountPlayerType.shoot||_obj.type == CountPlayerType.steal)
//         {
//             _speStep = _step + 2;
            
//             for each(var pr:Player in _playerList)
//             {
//                 if(pr.info.match[_step].state == PlayerActionType.shot)
//                 {
//                     if(pr.info.skillNum == 0 && pr.info.match[_step].hasModel == 0)
//                     {
//                         _messagetype = CountMessageType.noSkillShootGoal;
//                     }
//                     else
//                     {
//                         if(pr.info.skillNum != 0 && pr.info.skillRes[_step])
//                         {
//                             _messagetype = CountMessageType.skillShootGoal;
                            
//                             _messageSkill = CountSkillType.getInstance().getModeName(number(pr.info.skillRes[_step]));
//                         }
//                         else if(pr.info.match[_step].hasModel != 0)
//                         {
//                             _messagetype = CountMessageType.skillShootGoal;
                            
//                             _messageSkill = CountSkillType.getInstance().getModeName(number(pr.info.match[_step].model));
//                         }
//                         else
//                         {
//                             _messagetype = CountMessageType.noSkillShootGoal;
//                         }
//                     }
                    
//                     break;
//                 }
//                 else if(pr.info.match[_step].state == PlayerActionType.three_point)
//                 {
//                     if(pr.info.skillNum == 0 && pr.info.match[_step].model == 0)
//                     {
//                         _messagetype = CountMessageType.noSkillThreeGoal
//                     }
//                     else
//                     {
//                         if(pr.info.skillNum != 0)
//                         {
//                             if(pr.info.skillRes[_step])
//                             {
//                                 _messagetype = CountMessageType.skillThreeGoal;
                                
//                                 _messageSkill = CountSkillType.getInstance().getModeName(number(pr.info.skillRes[_step]));
//                             }
//                             else
//                             {
//                                 _messagetype = CountMessageType.noSkillThreeGoal;
//                             }
//                         }
                        
//                         if(pr.info.match[_step].model != 0)
//                         {
//                             _messagetype = CountMessageType.skillThreeGoal;
                            
//                             _messageSkill = CountSkillType.getInstance().getModeName(number(pr.info.match[_step].model));
//                         }
                        
//                         break;
//                     }
//                 }
//             }
//         }
//         else if(_obj.type == CountPlayerType.foulShoot)
//         {
//             _speStep = _step + 2;
//         }
//         else if(_obj.type == CountPlayerType.steal)
//         {
//             _speStep = _step 
//         }
//         else if(_obj.type == CountPlayerType.slamDunk)
//         {
//             for each(var pe:Player in _playerList)
//             {
//                 if(pe.info.match[_step].state == PlayerActionType.slam_dunk)
//                 {
//                     if(pe.info.skillNum == 0)
//                     {
//                         _messagetype = CountMessageType.noSkillSlamdunk;
//                     }
//                     else
//                     {
//                         if(pe.info.skillRes[_step])
//                         {
//                             _messagetype = CountMessageType.skillSlamdunk;
                            
//                             _messageSkill = CountSkillType.getInstance().getSkillName(number(pe.info.skillRes[_step]));
//                         }
//                         else
//                         {
//                             _messagetype = CountMessageType.noSkillSlamdunk;
//                         }							
//                     }
//                     break;
//                 }
//             }
            
//             _inShoot = true;
            
//             processSlamDunk(_obj.dunk, _obj.nextRound);
//         }
        
//         if(Test.isTestSkill)
//         {
//             this.processSkill([_playerList[0].info.cid],Test.testSkillId);
//         }
        
//         _step++;
//         return;
//     }
    
//     //根据当前的状态处理动作
//     private roundChange(e:Event):void
//     {
//         if(_speStep == _step)
//         {
//             _inShoot = false;
            
//             switch(_obj.type)
//             {
//                 case CountPlayerType.none:
//                 case CountPlayerType.reboundFree:
//                 case CountPlayerType.rebound:
//                 case CountPlayerType.slamDunk:
//                 case CountPlayerType.blockFree:
//                 case CountPlayerType.blockOutside:
//                     //在投篮后立刻被处理，不需要后续处理
//                     //灌篮在前面直接处理
//                     break;
//                 case CountPlayerType.passSuss:
//                     processPass(_obj.pass, clearOjb);
//                     break;
//                 case CountPlayerType.passFail:
//                     processPassFaul(_obj.passFaul, clearOjb);
//                     break;
//                 case CountPlayerType.shoot:
//                     _inShoot = true;
//                     processShoot(_obj, clearOjb)
//                     break;
//                 case CountPlayerType.foulShoot:
//                     processFoul(_obj);
//                     break;
//                 case CountPlayerType.reboundOutside:
//                     //processBlockOut(_obj.blockOutside);
//                     //to-do
//                     break;
//                 case CountPlayerType.steal:
//                     processSteal(_obj.steal, clearOjb);
//                     break;
//                 case CountPlayerType.openBall:
//                     processPass(_obj.offSide, clearOjb);
//                     break;
//             }
//         }
//     }
    
//     private clearOjb():void
//     {
//         _obj = null;
//         _speStep = 0;
//     }
    
//     //传球
//     private processPass(obj:Object, fun:Function):void
//     {
//         if(_match.matchInfo[obj.endRound] && _match.matchInfo[obj.endRound].interuption != 0)
//         {
//             return;
//         }
        
//         if(_spePass == 0)
//         {
//             if(obj.passCid > 99)
//             {
//                 _ball.passPos(_match.awayPlayerInfo[obj.passCid%100].match[_step].dir, 
//                     _match.awayPlayerInfo[obj.getBallCid%100].match[obj.endRound].dir, 
//                     obj.startFact, obj.endFact, obj.endRound - _step, fun);
//             }
//             else
//             {
//                 _ball.passPos(_match.homePlayerInfo[obj.passCid].match[_step].dir, 
//                     _match.homePlayerInfo[obj.getBallCid].match[obj.endRound].dir, 
//                     obj.startFact, obj.endFact, obj.endRound - _step, fun);
//             }
//         }
//         else
//         {
//             _ball.show = true;
            
//             if(_spePass == ground)
//             {
//                 addBallOnGround(obj.endRound - _step, obj.startFact, obj.endFact, 
//                     function():void
//                     {	
//                         _ball.show = false;
//                     }
//                 )
                
//                 _spePass = 0;
//             }
//             else
//             {
//                 MovingController.getInstance().curveTo(new Point(obj.startX, obj.startY), new Point(obj.endX, obj.endY), _ball, obj.endRound - _step, false, null, true);
//             }
//         }
        
//     }
    
//     //犯规
//     private processFoul(foul:Object):void
//     {	
//          obj:Object = foul.foul;
        
//         //罚球动作做偏移
//         if(getEndPoint(obj.shootSide).x == MatchConfig.LeftNet.x)
//         {
//             obj.shootX -= 8;
//         }
//         else
//         {
//             obj.shootX += 8;
//         }
        
//         _ball.setPosition(obj.startFact);
        
//         _ball.show = true;
        
//         MovingController.getInstance().curveTo(new Point(obj.shootX, obj.shootY), getEndPoint(obj.shootSide), _ball, obj.endRound - _step, true, 
//             function(point:Point):void
//             {
//                 //进球
//                 if(obj.isGoal != 0)
//                 {	
//                     SoundManager.play(SoundConfig.COUNT_SHOOT, 1.2, 0, 1);

//                     _ball.show = false;
                    
//                     if(obj.originSide == PlayerSide.Home)
//                     {
//                         CountUiController.getInstance().updateScore(obj.score, 0);
//                     }
//                     else
//                     {
//                         CountUiController.getInstance().updateScore(0, obj.score);
//                     }
                    
//                     showPlayerInfo(obj);
                    
//                      mc:MovieClip
//                     if(obj.shootSide == PlayerSide.Home)
//                     {
//                         mc = _rightNet;
//                     }
//                     else
//                     {
//                         mc = _leftNet;
//                     }
                    
//                     pause();
                    
//                     mc.removeEventListener(Event.ENTER_FRAME, ballFallFrame);
//                     mc.addEventListener(Event.ENTER_FRAME, ballFallFrame);
//                     mc.gotoAndPlay(1);
//                 }
//                 else
//                 {
//                     SoundManager.play(SoundConfig.COUNT_NO_SHOOT, 1.2, 0, 1);
                    
//                      tem:Object = _match.matchInfo[foul.nextRound];
                    
//                     if(tem.type == CountPlayerType.reboundFree)
//                     {
//                         //篮板自由球
//                         if((tem.reboundFreeBall.endRound - _step) <= 3)
//                         {
//                             _tween = TweenLite.to(_ball, MatchConfig.Living * (tem.reboundFreeBall.endRound - step), {x:tem.reboundFreeBall.endFact.x, y:tem.reboundFreeBall.endFact.y, 
//                                 onComplete:function():void
//                                 {
//                                     //
                                    
//                                     //TweenLite.killTweensOf(_ball);
                                    
//                                     _tween.kill();
                                    
//                                     _tween = null;
                                    
//                                     _ball.show = false;
//                                 }
//                             });
//                         }
//                         else
//                         {
//                             MoveToController.getInstance().curveTo(point, new Point(tem.reboundFreeBall.endX, tem.reboundFreeBall.endY), _ball, tem.reboundFreeBall.endRound - _step - 1, 
//                                 function():void
//                                 {
//                                     _ball.show = false;
//                                 }
//                             );
//                         }
//                     }
//                     else if(tem.type == CountPlayerType.rebound)
//                     {
//                         //抢篮板回合rebounds_noBall
//                         MoveToController.getInstance().curveTo(point, new Point(tem.rebound.targetX, tem.rebound.targetY), _ball, 
//                             tem.rebound.reboundEndRound - _step + 2, 
//                             function():void
//                             {
//                                 _ball.show = false;
//                             }
//                         );
//                     }
//                     else if(tem.type == CountPlayerType.foulShoot)
//                     {
//                         MoveToController.getInstance().curveTo(point, new Point(tem.foul.shootX, tem.foul.shootY), _ball, 5, 
//                             function():void
//                             {
//                                 _ball.show = false;
//                             }
//                         );
//                     }
                    
//                 }
//             });
//     }
    
//     public removeNetFrame():void
//     {
//         if(_leftNet)
//         {
//             _leftNet.removeEventListener(Event.ENTER_FRAME, ballFallFrame);
//         }
        
//         if(_rightNet)
//         {
//             _rightNet.removeEventListener(Event.ENTER_FRAME, ballFallFrame);
//         }
//     }
    
//     //投篮
//     private processShoot(shoot:Object, fun:Function):void
//     {
//          obj:Object = shoot.shoot;
//          tem:Object;
//          player:Player;
        
//          data:Object = {};
//         data.shootNum = 1;
//         data.pid = findPlayerByCid(obj.shootCid);
//         data.side = obj.shootSide;
//         data.shootCid = obj.shootCid;
//         if(obj.assitant < 255)
//         {
//             data.ass = obj.assitant;
//             data.assPid = findPlayerByCid(obj.assitant);
//         }
        
//         if(obj.isFoul != 0)
//         {
//             SoundManager.play(SoundConfig.COUNT_FOUL, 1.2, 0, 1);
            
//             pause();
            
//             CountUiController.getInstance().showFoul(restart);
//         }
        
//          end:Point;
        
//         _ball.show = true;
//         _ball.setPosition(GridController.instance.getScenePosition(new Vector3D(obj.shootX, obj.shootY)));
        
//         //说明被盖帽
//         if(obj.isGoal == 0 && obj.isBlock != 0)
//         {
//             tem = _match.matchInfo[shoot.nextRound];
            
//             if(tem .type == CountPlayerType.blockFree)
//             {	
//                 processBlockFree(tem.blockFree);
//             }
//             else
//             {
//                 processBlockOut(tem.blockOutside);
//             }
            
//             for each(player in _playerList)
//             {
//                 if(obj.blockCid == player.info.cid)
//                 {
//                     player.addTalk(MatchConfig.MatchResource[ResourceType.talk], LanConfig.block[MatchConfig.MatchTalk%LanConfig.block.length]);
                    
//                     MatchConfig.MatchTalk++;
//                     break;
//                 }
//             }
//             CountUiController.getInstance().updateSingleInfo(data);
//             return;
//         }
        
//         CameraController.getInstance().moveToSeeBall(obj.shootSide);
        
//         MovingController.getInstance().curveTo(new Point(obj.shootX, obj.shootY), getEndPoint(obj.shootSide), _ball, obj.endRound - _step, true,
//             function(point:Point):void
//             {
//                 if(obj.isFoul != 0)
//                 {
//                     pause();
                    
//                     _ball.show = false;
//                 }
                
//                 //进球
//                 if(obj.isGoal != 0)
//                 {
//                     SoundManager.play(SoundConfig.COUNT_SHOOT, 1.2, 0, 1);
                    
//                     data.shoot=1;
                    
//                     CountUiController.getInstance().updateSingleInfo(data);
// //						if(obj.shootSide == PlayerSide.Home)
// //						{
// //							_scene.addShine(CountResController.getInstance().res[ResourceType.rightShine], MatchConfig.RightNet);
// //						}
// //						else
// //						{
// //							_scene.addShine(CountResController.getInstance().res[ResourceType.leftShine], MatchConfig.LeftNet);
// //						}
                    
//                     for each(player in _playerList)
//                     {
//                         if(obj.shootCid == player.info.cid)
//                         {
//                             if(player.info.match[shoot.round].state == PlayerActionType.shot)
//                             {
//                                 player.addTalk(XFacade.getInstance().getUI("playerTalk"), LanConfig.shoot[MatchConfig.MatchTalk%LanConfig.shoot.length]);
                                
//                                 MatchConfig.MatchTalk++;
                                
//                                 player.info.score += 2;
//                             }
//                             else
//                             {
//                                 player.addTalk(XFacade.getInstance().getUI("playerTalk"), LanConfig.threeShoot[MatchConfig.MatchTalk%LanConfig.threeShoot.length]);
                                
//                                 MatchConfig.MatchTalk++;
                                
//                                 player.info.score += 3;
//                             }
                            
//                             break;
//                         }
//                     }
                    
//                     if(obj.isBlock == PlayerSide.Home)
//                     {
//                         CountUiController.getInstance().updateScore(obj.score, 0);
//                     }
//                     else
//                     {
//                         CountUiController.getInstance().updateScore(0, obj.score);
//                     }
                    
//                     showPlayerInfo(obj);
                    
//                     _ball.show = false;
//                      mc:MovieClip
//                     if(obj.shootSide == PlayerSide.Home)
//                     {
//                         mc = _rightNet;
//                     }
//                     else
//                     {
//                         mc = _leftNet;
//                     }
                    
//                     pause();
                    
//                     mc.addEventListener(Event.ENTER_FRAME, ballFallFrame);
//                     mc.gotoAndPlay(1);
//                 }
//                 else
//                 {
//                     data.shoot = 0;
                    
//                     _inShoot = false;
                    
//                     CountUiController.getInstance().updateSingleInfo(data);
                    
//                     SoundManager.play(SoundConfig.COUNT_NO_SHOOT, 1.2, 0, 1);
                    
//                     if(_messagetype == CountMessageType.noSkillShootGoal)
//                     {
//                         _messagetype = CountMessageType.noSkillShootNoGoal;
//                     }
//                     else if(_messagetype == CountMessageType.skillShootGoal)
//                     {
//                         _messagetype = CountMessageType.skillShootNoGoal;
//                     }
//                     else if(_messagetype == CountMessageType.noSkillThreeGoal)
//                     {
//                         _messagetype = CountMessageType.noSkillThreeNoGoal;
//                     }
//                     else if(_messagetype == CountMessageType.noSkillShootGoal)
//                     {
//                         _messagetype = CountMessageType.skillThreeNoGoal;
//                     }
                    
//                     if(obj.isGoal == 0)
//                     {
//                         for each(player in _playerList)
//                         {
//                             if(obj.shootCid == player.info.cid)
//                             {
//                                 player.addTalk(XFacade.getInstance().getUI("playerTalk"), LanConfig.noShoot[MatchConfig.MatchTalk%LanConfig.noShoot.length]);
                                
//                                 MatchConfig.MatchTalk++;
//                                 break;
//                             }
//                         }
//                     }
//                     //由于投篮需要篮球立刻做出反应，所以matchProcess里面的数据可能要提前执行
//                     tem = _match.matchInfo[shoot.nextRound];
                    
//                     if(tem == null)
//                     {
//                         return;
//                     }
                    
//                     if(tem.type == CountPlayerType.none)
//                     {	
//                         for each(player in _playerList)
//                         {
//                             if(obj.shootCid == player.info.cid)
//                             {
//                                 showMessage(player.data.Pid);
                                
//                                 break;
//                             }
//                         }
//                         return;
//                     }
                    
//                     if(tem.type == CountPlayerType.reboundFree)
//                     {
//                         //篮板自由球
//                         if((tem.reboundFreeBall.endRound - _step) <= 3)
//                         {
//                             _tween = TweenLite.to(_ball, MatchConfig.Living * (tem.reboundFreeBall.endRound - step), {x:tem.reboundFreeBall.endFact.x, y:tem.reboundFreeBall.endFact.y, 
//                                 onComplete:function():void
//                                 {
//                                     _tween.kill();
                                    
//                                     _tween = null;
                                    
//                                     _ball.show = false;
//                                 }
//                             });
//                         }
//                         else
//                         {
//                             MoveToController.getInstance().curveTo(point, new Point(tem.reboundFreeBall.endX, tem.reboundFreeBall.endY), _ball, tem.reboundFreeBall.endRound - _step - 1, 
//                                 function():void
//                                 {
//                                     _ball.show = false;
//                                 }
//                             );
//                         }
//                     }
//                     else if(tem.type == CountPlayerType.rebound)
//                     {
//                         _messagetype = CountMessageType.rebound;
                        
//                         for each(player in _playerList)
//                         {
//                             if(tem.rebound.getBallCid == player.info.cid)
//                             {
//                                 showMessage(player.data.Pid);
                                
//                                 player.rebEffect = MatchConfig.MatchResource[ResourceType.rebEffect];
//                                 player.inReboundAction = PlayerActionType.attack_rebounds;
                                
//                                  data1:Object = {};
//                                 data1.rebound = 1;
//                                 data1.cid = tem.rebound.getBallCid;
//                                 data1.pid = findPlayerByCid(tem.rebound.getBallCid);
                                
//                                 CountUiController.getInstance().updateSingleInfo(data1);
//                                 break;
//                             }
//                         }
                        
//                         //抢篮板回合rebounds_noBall
//                         MoveToController.getInstance().curveTo(point, new Point(tem.rebound.targetX, tem.rebound.targetY), _ball, 
//                             tem.rebound.reboundEndRound - _step + 5, 
//                             function():void
//                             {
//                                 _ball.show = false;
//                             }
//                         );
                        
//                         return;
//                     }
//                 }
                
//                 //showMessage();
//                 for each(player in _playerList)
//                 {
//                     if(obj.shootCid == player.info.cid)
//                     {
//                         showMessage(player.data.Pid);
                        
//                         break;
//                     }
//                 }
//             }
//         );
//     }
    
//     //篮球落地
//     private ballFallFrame(e:Event):void
//     {
//          mc:MovieClip = e.currentTarget as MovieClip;
        
//         if(mc.currentFrame == 8)
//         {
//             if(!_match.matchInfo[_step] || _match.matchInfo[_step].interuption == 0)
//             {
//                 restart();
//             }
//         }
//         else if(mc.currentFrame == 12)
//         {
//             mc.gotoAndStop(1);
            
//             _inShoot = false;
            
//             restart();
//         }
//     }
    
//     //灌篮
//     private processSlamDunk(obj:Object, nextRound:number):void
//     {
//          end:Point;
        
//          player:Player;
        
//          dunEnd:Point = new Point(getEndPoint(obj.shootSide).x,getEndPoint(obj.shootSide).y) ;
        
//          data:Object = {};
//         data.shootNum = 1;
//         data.pid = findPlayerByCid(obj.shootCid);
//         data.side = obj.shootSide;
//         data.shootCid = obj.shootCid;
//         if(obj.assitant < 255)
//         {
//             data.ass = obj.assitant;
//             data.assPid = findPlayerByCid(obj.assitant);
//         }
        
//         if((_slamDunkPlayer.info.skillNum > 0 && _slamDunkPlayer.info.skillRes[_step]) || (_slamDunkPlayer.info.match[_step].hasModel != 0))
//         {
//             switch(_slamDunkPlayer.info.match[_step].model)
//             {
//                 case 61:
//                 case 62:
//                 case 63:
//                 case 64:
//                 case 65:
//                     if(dunEnd.x == MatchConfig.LeftNet.x)
//                     {
//                         dunEnd.x += 3;
//                     }
//                     else
//                     {
//                         dunEnd.x -= 3;
//                     }
//                     dunEnd.y+=2;
//                     break;
//                 case 51:
//                 case 52:
//                 case 53:
//                 case 54:
//                 case 55:
//                     if(dunEnd.x == MatchConfig.LeftNet.x)
//                     {
//                         dunEnd.x += 8;
//                     }
//                     else
//                     {
//                         dunEnd.x -= 8;
//                     }
//                     dunEnd.y+=2;
//                     break;
//                 case 56:
//                 case 57:
//                 case 58:
//                 case 59:
//                 case 60:
//                     if(dunEnd.x == MatchConfig.LeftNet.x)
//                     {
//                         dunEnd.x += 4;
//                     }
//                     else
//                     {
//                         dunEnd.x -= 4;
//                     }
//                     dunEnd.y+=3;
//                     break;
//                 case 66:
//                 case 67:
//                 case 68:
//                 case 69:
//                 case 70:
//                     if(_slamDunkPlayer.info.match[_step].dir != 2 && _slamDunkPlayer.info.match[_step].dir != 6)
//                     {
//                         if(dunEnd.x == MatchConfig.LeftNet.x)
//                         {
//                             dunEnd.x += 4;
//                         }
//                         else
//                         {
//                             dunEnd.x -= 4;
//                         }
//                     }
//                     dunEnd.y++;
//                     break;
//                 default:
//                     if(dunEnd.x == MatchConfig.LeftNet.x)
//                     {
//                         dunEnd.x += 5;
//                     }
//                     else
//                     {
//                         dunEnd.x -= 5;
//                     }
//                     dunEnd.y+=2;
//                     break;
//             }
//         }
//         else
//         {
//             if(dunEnd.x == MatchConfig.LeftNet.x)
//             {
//                 dunEnd.x -= 1;
//             }
//             else
//             {
//                 dunEnd.x += 1;
//             }
//         }
        
//         _slamDunkPlayer.dunkEndRound = obj.endRound;
        
//         MovingController.getInstance().curveTo(new Point(obj.shootX, obj.shootY), dunEnd, _slamDunkPlayer, obj.endRound - _step, false, 
//             function(point:Point):void
//             {
//                 _slamDunkPlayer = null;
                
//                 if(obj.isFoul != 0)
//                 {
//                     pause();
                    
//                     CountUiController.getInstance().showFoul(restart);
//                 }
                
//                 if(obj.isGoal != 0)
//                 {
//                     SoundManager.play(SoundConfig.COUNT_SLAMDUNK, 1.2, 0, 1);
                    
//                     data.shoot = 1;
                    
//                     CountUiController.getInstance().updateSingleInfo(data);
                    
//                     for each(player in _playerList)
//                     {
//                         if(obj.shootCid == player.info.cid)
//                         {
//                             player.addTalk(XFacade.getInstance().getUI("playerTalk"), LanConfig.slamdunk[MatchConfig.MatchTalk%LanConfig.slamdunk.length]);
                            
//                             MatchConfig.MatchTalk++;
                            
//                             player.info.score += 2;
                            
//                             showMessage(player.data.Pid);
                            
//                             break;
//                         }
//                     }
                    
//                     if(obj.isBlock == PlayerSide.Home)
//                     {
//                         CountUiController.getInstance().updateScore(obj.score, 0);
//                     }
//                     else
//                     {
//                         CountUiController.getInstance().updateScore(0, obj.score);
//                     }
                    
//                     showPlayerInfo(obj);
                    
//                     pause();
                    
//                      mc:MovieClip
//                     if(obj.isBlock == PlayerSide.Home)
//                     {
//                         mc = _rightNet;
//                     }
//                     else
//                     {
//                         mc = _leftNet;
//                     }
                    
//                     SoundManager.play(SoundConfig.COUNT_SHOOT, 1.2, 0, 1);
                    
//                     mc.addEventListener(Event.ENTER_FRAME, ballFallFrame);
//                     mc.gotoAndPlay(1);
//                 }
//                 else
//                 {
//                     _inShoot = false;
                    
//                     SoundManager.play(SoundConfig.COUNT_NO_SLAMDUNK, 1.2, 0, 1);
                    
//                     data.shoot = 0;
                    
//                     CountUiController.getInstance().updateSingleInfo(data);
                    
//                     if(_messagetype == CountMessageType.noSkillSlamdunk)
//                     {
//                         _messagetype = CountMessageType.noSkillNoDunk;
//                     }
//                     else if(_messagetype == CountMessageType.skillSlamdunk)
//                     {
//                         _messagetype = CountMessageType.skillNoDunk;
//                     }
                    
//                     for each(player in _playerList)
//                     {
//                         if(obj.shootCid == player.info.cid)
//                         {
//                             player.addTalk(XFacade.getInstance().getUI("playerTalk"), LanConfig.noShoot[MatchConfig.MatchTalk%LanConfig.noShoot.length]);
                            
//                             MatchConfig.MatchTalk++;
                            
//                             showMessage(player.data.Pid);
                            
//                             break;
//                         }
//                     }
                    
//                      tem:Object = _match.matchInfo[nextRound];
                    
//                     if(tem.type == CountPlayerType.reboundFree)
//                     {
//                         //篮板自由球
//                         if((tem.reboundFreeBall.endRound - _step) <= 3)
//                         {
//                             _tween = TweenLite.to(_ball, MatchConfig.Living * (tem.reboundFreeBall.endRound - step), {x:tem.reboundFreeBall.endFact.x, y:tem.reboundFreeBall.endFact.y, 
//                                 onComplete:function():void
//                                 {
//                                     //TweenLite.killTweensOf(_ball);
                                    
//                                     _tween.kill();
                                    
//                                     _tween = null;
                                    
//                                     _ball.show = false;
//                                 }
//                             });
//                         }
//                         else
//                         {
//                             MoveToController.getInstance().curveTo(point, new Point(tem.reboundFreeBall.endX, tem.reboundFreeBall.endY), _ball, tem.reboundFreeBall.endRound - _step - 1, 
//                                 function():void
//                                 {
//                                     _ball.show = false;
//                                 }
//                             );
//                         }
//                     }
//                     else if(tem.type == CountPlayerType.rebound)
//                     {
// //							var data1:Object = {};
// //							data1.rebound = 1;
// //							data1.cid = tem.rebound.getBallCid;
// //							data1.pid = findPlayerByCid(tem.rebound.getBallCid);
// //							
// //							CountUiController.getInstance().updateSingleInfo(data1);
                        
//                         //抢篮板回合rebounds_noBall
//                         MoveToController.getInstance().curveTo(point, new Point(tem.rebound.targetX, tem.rebound.targetY), _ball, 
//                             tem.rebound.reboundEndRound - _step + 2, 
//                             function():void
//                             {
//                                 _ball.show = false;
//                             }
//                         );
//                     }
//                 }
//             }
//         );
        
//         //被盖帽的话球不需要做处理
//     }
    
//     //盖帽
//     private processBlockOut(obj:Object):void
//     {
//         _ball.show = true;
        
//         _ball.setPosition(obj.startFact);
        
//         _tween = TweenLite.to(_ball, MatchConfig.Living * (obj.endRound - _step), {x:obj.endFact.x, y:obj.endFact.y, 
//             onComplete:function():void
//             {
//                 _ball.show = false;
                
//                 //TweenLite.killTweensOf(_ball);
                
//                 _tween.kill();
                
//                 _tween = null;
                
//                 pause();
                
//                 CountUiController.getInstance().showFoul(restart);
//             }
//         });
//     }
    
//     //盖帽自由球
//     private processBlockFree(obj:Object):void
//     {
//         _ball.show = true;
        
//         _ball.setPosition(obj.startFact);
        
//         _tween = TweenLite.to(_ball, MatchConfig.Living * (obj.endRound - _step), {x:obj.endFact.x, y:obj.endFact.y, 
//             onComplete:function():void
//             {
//                 _tween.kill();
                
//                 //TweenLite.killTweensOf(_ball);
                
//                 _tween = null;
                
//                 _ball.show = false;
//             }
//         });
//     }
    
//     //盗球
//     private processSteal(obj:Object, fun:Function):void
//     {
//          player:Player
        
//         for each(player in _playerList)
//         {
//             if(obj.stealCid == player.info.cid)
//             {
//                 player.addTalk(XFacade.getInstance().getUI("playerTalk"), LanConfig.steal[MatchConfig.MatchTalk%LanConfig.steal.length]);
                
//                 MatchConfig.MatchTalk++;
//                 break;
//             }
//         }
        
//         _ball.show = true;
        
//         _ball.setPosition(obj.stealFact);
        
//         addBallOnGround(obj.endRound - _step, obj.stealFact, obj.endFact, fun);
//     }
    
//     //传球失误
//     private processPassFaul(obj:Object, fun:Function):void
//     {
//          player:Player
        
//         for each(player in _playerList)
//         {
//             if(obj.getBallCid == player.info.cid)
//             {
//                 player.addTalk(XFacade.getInstance().getUI("playerTalk"), LanConfig.keepOff[MatchConfig.MatchTalk%LanConfig.keepOff.length]);
                
//                 MatchConfig.MatchTalk++;
//                 break;
//             }
//         }
        
//         //传球不成功
//         if(obj.passCid > 99)
//         {	
//             _ball.passPos(_match.awayPlayerInfo[obj.passCid%100].match[_step].dir, -100, obj.startFact, obj.stopFact, (obj.endRound - _step)/2, 
//                 function():void
//                 {
//                     addBallOnGround(obj.endRound - _step, obj.stopFact, obj.endFact, fun);
//                 }
//             );
//         }
//         else
//         {
//             _ball.passPos(_match.homePlayerInfo[obj.passCid].match[_step].dir, -100, obj.startFact, obj.stopFact, (obj.endRound - _step)/2, 
//                 function():void
//                 {
//                     addBallOnGround(obj.endRound - _step, obj.stopFact, obj.endFact,fun);
//                 }
//             );
//         }
//     }
    
//     //显示播报信息
//     private showMessage(XPid:string, YPid:string="")
//     {
//          playerX: string = ItemData.getPlayerHtmlName(XPid);
        
//          mes: string;
        
//         switch(_messagetype)
//         {
//             case CountMessageType.noSkillShootGoal:
                
//                 mes = BroadCastConfig.noSkillShootGoal[MatchConfig.MatchAnalize%BroadCastConfig.noSkillShootGoal.length]
                
//                 break;
//             case CountMessageType.skillShootGoal:
                
//                 mes = BroadCastConfig.skillShootGoal[MatchConfig.MatchAnalize%BroadCastConfig.skillShootGoal.length];
                
//                 mes = mes.replace(patZ, _messageSkill);
                
//                 break;
//             case CountMessageType.noSkillShootNoGoal:
                
//                 mes = BroadCastConfig.noSkillShootNoGoal[MatchConfig.MatchAnalize%BroadCastConfig.noSkillShootNoGoal.length];
                
//                 break;
//             case CountMessageType.skillShootNoGoal:
                
//                 mes = BroadCastConfig.skillShootNoGoal[MatchConfig.MatchAnalize%BroadCastConfig.skillShootNoGoal.length];
                
//                 mes = mes.replace(patZ, _messageSkill);
                
//                 break;
//             case CountMessageType.noSkillThreeGoal:
                
//                 mes = BroadCastConfig.noSkillThreeGoal[MatchConfig.MatchAnalize%BroadCastConfig.noSkillThreeGoal.length];
                
//                 break;
//             case CountMessageType.skillThreeGoal:
                
//                 mes = BroadCastConfig.skillThreeGoal[MatchConfig.MatchAnalize%BroadCastConfig.skillThreeGoal.length];
                
//                 mes = mes.replace(patZ, _messageSkill);
                
//                 break;
//             case CountMessageType.noSkillThreeNoGoal:
                
//                 mes = BroadCastConfig.noSkillThreeNoGoal[MatchConfig.MatchAnalize%BroadCastConfig.noSkillThreeNoGoal.length];
                
//                 break;
//             case CountMessageType.skillThreeNoGoal:
                
//                 mes = BroadCastConfig.skillThreeNoGoal[MatchConfig.MatchAnalize%BroadCastConfig.skillThreeNoGoal.length];
                
//                 mes = mes.replace(patZ, _messageSkill);
                
//                 break;
//             case CountMessageType.noSkillSlamdunk:
                
//                 mes = BroadCastConfig.noSkillSlam[MatchConfig.MatchAnalize%BroadCastConfig.noSkillSlam.length];
                
//                 break;
//             case CountMessageType.skillSlamdunk:
                
//                 mes = BroadCastConfig.skillSlam[MatchConfig.MatchAnalize%BroadCastConfig.skillSlam.length];
                
//                 mes = mes.replace(patZ, _messageSkill);
                
//                 break;
//             case CountMessageType.noSkillNoDunk:
                
//                 mes = BroadCastConfig.noSkillNoSlam[MatchConfig.MatchAnalize%BroadCastConfig.noSkillNoSlam.length];
                
//                 break;
//             case CountMessageType.skillNoDunk:
                
//                 mes = BroadCastConfig.skillNoSlam[MatchConfig.MatchAnalize%BroadCastConfig.skillNoSlam.length];
                
//                 mes = mes.replace(patZ, _messageSkill);
                
//                 break;
//             case CountMessageType.rebound:
                
//                 mes = BroadCastConfig.rebound[MatchConfig.MatchAnalize%BroadCastConfig.rebound.length];
                
//                 break;
//         }
        
//         mes = mes.replace(patX, playerX);
        
//         mes = rebuildMessage(mes);
        
//         MatchConfig.MatchAnalize++;
        
//         _cast.updateMessage(mes);
//     }
    
//     private getDirOffset(dir:number, pos:Point):void
//     {
//         switch(dir)
//         {
//             case 0:
//                 pos.x += 60;
//                 break;
//             case 1:
//                 pos.x += 60;
//                 break;
//             case 2:
//                 break;
//             case 3:
//                 pos.x -= 40;
//                 break;
//             case 4:
//                 pos.x -= 60;
//                 break;
//             case 5:
//                 pos.x -= 45;
//                 break;
//             case 6:
//                 pos.x += 5;
//                 break;
//             case 7:
//                 pos.x += 60;
//                 break;
//         }
//     }
    
//     //处理每个球员的实时得分情况
//     private showPlayerInfo(obj:Object):void
//     {
//         CountUiController.getInstance().showScore(MatchConfig.PlayerInfo[obj.shootCid], obj);
//     }
    
//     /**
//      * 添加球在地上滚的动画
//      * round:表示滚的回合数
//      * pos:表示滚动的结束位置
//      */
//     private addBallOnGround(round:number, start:Point, end:Point, fun:Function=null):void
//     {
//         MovingController.getInstance().curveMore(_scene, start, end, _ball, round, 
//             function():void
//             {
//                 _ball.show = false;
//                 if(fun != null)
//                 {
//                     fun();
//                 }
//             }
//         );
//     }
    
//     private getEndPoint(value:number):Point
//     {
//         if(value == PlayerSide.Home)
//         {
//             return new Point(MatchConfig.RightNet.x, MatchConfig.RightNet.y);
//         }
//         else
//         {
//             return new Point(MatchConfig.LeftNet.x, MatchConfig.LeftNet.y);
//         }
//     }
    
// //		private down(e:KeyboardEvent):void
// //		{
// //			if(e.ctrlKey == true && e.keyCode == 77)
// //			{
// //				CountUiController.getInstance().test(_match);
// //			}
// //		}
    
//     private closeBall(e)
//     {
//         removeBall();
//     }
    
//     private removeBall():void
//     {
//         _ball.show = false;
//     }
    
//     //比赛结束
//     public endMatch():void
//     {	
//         if(MatchConfig.EndMatch != null)
//         {
//             Events.getInstance().removeByTag(this.EVENT_LISTENER_NAME);
//             _scene.removePlayer();
//             //_main.close();
            
//             for each(var player:Player in _playerList)
//             {
//                 _playerList.pop();
                
//                 player = null;
//             }
            
//             _playerList = null;
            
//             MatchConfig.EndMatch(MatchConfig.MatchCount);
            
//             CountLoadPlayerController.getInstance().remove();
            
//             if(_scene && _main.contains(_scene))
//             {
//                 _main.removeChild(_scene);
                
//                 _scene = null;
//             }
            
//             _main.close();
//         }
//     }
    
//     public pause(e:Event=null):void
//     {
//         if(_timer && _timer.running == true)
//         {
//             _timer.stop();
//         }
        
//         for each(var player:Player in _playerList)
//         {
//             player.pause();
//         }
//     }
    
//     public pause2():void
//     {
//         if(_timer && _timer.running == true)
//         {
//             _timer.stop();
//         }
        
//         for each(var player:Player in _playerList)
//         {
//             player.stopAction();
//         }
//     }
    
//     //跳过比赛
//     public skipMatch(type:number=0):void
//     {
//         if(type >= 0)
//         {
//             if(_step < 5)
//             {
//                 return;
//             }
//         }
        
//         SoundManager.play(SoundConfig.COUNT_END_QUALTER, 1, 0, 1);
        
//         pause();
        
//         if(_timer)
//         {
//             _timer.stop();
            
//             _timer.removeEventListener(TimerEvent.TIMER, play);
            
//             _timer = null;
//         }
        
//         for each(var player:Player in _playerList)
//         {
//             player.close();
//         }
        
//         if(_cast && _main.contains(_cast))
//         {
//             _main.removeChild(_cast);
            
//             _cast.clear();
//         }
        
//         _score = null;
        
//         SoundManager.stopAll();
        
//         _inPause = false;
        
//         _main.stage.frameRate = 24;
//         _main.root.transform.perspectiveProjection.fieldOfView = 55;
        
//         removeNetFrame();
        
//         CountUiController.getInstance().close();
//         CountUiController.getInstance().showEnd([_match.homeManagerId, _match.awayManagerId], [_match.homeScore, _match.awayScore],endMatch);
//     }
    
//     //无用方法
//     public skipStep():void
//     {
//         if(_timer && _timer.running)
//         {
//             _timer.stop();
            
//             _timer.removeEventListener(TimerEvent.TIMER, play);
            
//             _timer = null;
            
//             if(_speed == 1)
//             {
//                 _speed = 2;
                
//                 MatchConfig.Living = 0.1;
                
//                 MatchConfig.MoveLive = 0.2;
//             }
//             else
//             {
//                 _speed = 1;
                
//                 MatchConfig.Living = 0.2;
                
//                 MatchConfig.MoveLive = 0.4;
//             }
            
//             _timer = new Timer(MatchConfig.Living*1000);
            
//             _timer.addEventListener(TimerEvent.TIMER, play);
            
//             _timer.start();
//         }
//     }
    
//     public skipQualter():void
//     {	
//         _ball.show = false;
        
//          tag:Boolean = false;
        
//          i:number;
        
//         for(i = _step;i < _step + MatchConfig.SkipStep;i++)
//         {
//             if(_match.matchInfo[i] && _match.matchInfo[i].interuption != 0)
//             {
//                 _step = i-1;
                
//                 tag = true;
                
//                 CountUiController.getInstance().updateScore(MatchConfig.MatchCount.scoreList[_curQuater][0], MatchConfig.MatchCount.scoreList[_curQuater][1]);
                
//                 break;
//             }
//         }
        
//         if(tag == false)
//         {
//              home:number = 0;
            
//              away:number = 0;
            
//             for(i = _step;i<_step + MatchConfig.SkipStep;i++)
//             {
//                 if(_match.matchInfo[i] == null)
//                 {
//                     continue;
//                 }
                
//                 if(_match.matchInfo[i].shoot && _match.matchInfo[i].shoot.isGoal != 0)
//                 {
//                     if(_match.matchInfo[i].shoot.shootSide == PlayerSide.Home)
//                     {
//                         home += _match.matchInfo[i].shoot.score;
//                     }
//                     else
//                     {
//                         away += _match.matchInfo[i].shoot.score;
//                     }
//                 }
//                 else if(_match.matchInfo[i].foul && _match.matchInfo[i].foul.isGoal != 0)
//                 {
//                     if(_match.matchInfo[i].shoot.originSide == PlayerSide.Home)
//                     {
//                         home += _match.matchInfo[i].shoot.score;
//                     }
//                     else
//                     {
//                         away += _match.matchInfo[i].shoot.score;
//                     }
//                 }
//             }
            
//             CountUiController.getInstance().updateScore(home, away);
            
//             _step += MatchConfig.SkipStep;
//         }
        
//         if(_step >= _match.totalRound)
//         {
//             pause();
            
//             skipMatch();
            
//             return;
//         }
        
//         processRoundInfo();

//         for each(var player:Player in _playerList)
//         {
//             player.doAction(_step, null);
            
//             if(player.action == PlayerActionType.attack_wait || 
//                 player.action == PlayerActionType.defend_wait || 
//                 player.action == PlayerActionType.defend_interference ||
//                 player.action == PlayerActionType.run)
//             {
//                 continue;
//             }
            
//             if(player.position.x < MatchConfig.GroundWidth/2)
//             {
//                 CameraController.getInstance().moveToSeeBall(PlayerSide.Home);
//             }
//             else
//             {
//                 CameraController.getInstance().moveToSeeBall(PlayerSide.Away);
//             }
            
//             break;
//         }
//     }
    
//     //处理球星技能
//     public processSkill(array:Array, skillId:number):void
//     {
//         pause();
        
//         for(var i:number = 0;i<array.length;i++)
//         {
//             for each(var player:Player in _playerList)
//             {	
//                 if(player.info.cid == array[i])
//                 {
//                     player.processSkill(skillId);
                    
//                     break;
//                 }
//             }
//         }
//     }
    
//     //改变球的效果
//     public changeBall(mc:MovieClip):void
//     {
//         _ball.changeBall(mc);
//     }
    
//     public findPlayerByCid(cid:number): string
//     {
//         for each(var player:Player in _playerList)
//         {
//             if(player.info.cid == cid)
//             {
//                 return player.info.pid
//             }
//         }
        
//         return null;
//     }
    
//     public restart(e:Event=null):void
//     {
//         if(_timer && _timer.running == false)
//         {
//             _timer.start();
//         }
        
//         for each(var player:Player in _playerList)
//         {
//             player.restart();
//         }
//     }
    
//     public dispatch(value: string):void
//     {
//         _main.dispatchEvent(new Event(value));
//     }
    
//     /**
//      * 重新构建播报信息
//      */
//     public rebuildMessage(value: string): string
//     {
//         return "<font color='" + _cast.Time + "'>第" + (_curQuater +1) + "节 " + CountUiController.getInstance().matchTime + 
//             " </font>" + "<font color='" + _cast.Value + "'>" + value + "</font>";
//     }
    
//     public showGroundInfo(value: string): string
//     {
//         return "<font color='#ffffff'>" + value + "</font>"
//     }
    
//     private gameDataError(e:IOErrorEvent):void
//     {
//         _loader.removeEventListener(Event.COMPLETE, binaryGameDataHandler);
//         _loader.removeEventListener(IOErrorEvent.IO_ERROR, gameDataError);
        
//         trace("error")
//     }
}
