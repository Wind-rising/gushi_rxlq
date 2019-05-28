import CountController from "../../controllor/CountController";
import Events from "../../signal/Events";
import EventConst from "../../data/EventConst";
import CompetitionUI from "./CompetitionUI";
import CompetitionMap from "./CompetitionMap";
import ItemData from "../../data/ItemData";
import BallNode from "./BallNode";
import PlayerNode from "./PlayerNode";
import UIConfig from "../../config/UIConfig";
import PlayerSide from "../../data/type/PlayerSide";
import PlayerActionType from "../../data/PlayerActionType";
import MatchConfig from "../../config/MatchConfig";
import CountPlayerType from "../../data/CountPlayerType";
import { parse } from "path";
import CountMessageType from "../../data/type/CountMessageType";
import CountSkillType from "../../data/CountSkillType";
import CustomCurving from "../../libs/CustomControl/CustomCurving";
import CustomCurveTo from "../../libs/CustomControl/CustomCurveTo";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class CompetitionView extends cc.Component {

    controller:CountController = CountController.getInstance();
    
    /** 保存UI节点 */
    private competitionUI:CompetitionUI = null;
    private competitionMap:CompetitionMap = null;
    /** 左右篮网 */
    private _leftNet = null;
    private _rightNet = null;


    /** 篮球 */
    private ballNode:BallNode = null;
    /** 球员列表 */
    private playerList:Array<PlayerNode> = null;
    /** 正在扣篮的球员 */
    private _slamDunkPlayer:PlayerNode = null;

    /** 暂存一些当前时间的比赛信息 */
    private _obj:Object;
    private _speStep:number;
    private _messagetype:number;
	private _messageSkill:string;
    
    /** 当前节 */
    private _curQuater:number = 0;
    
    /** 回合数 */
    private _step:number;

    /** 播放速度 */
    private _speed:number = 1;

    /** 是否在投篮状态 */
    private _inShoot:boolean = false;

    /** 暂停状态 */
    private _inPause:boolean = false;

    /** 得分情况 */
    private _score:Object = null;

    /** 获取当前节己方球员数据 */
    public get enterHomePlayer () {
        return this.controller.data['enterHomePlayer'][this._curQuater];
    }

    /** 获取当前节对方球员数据 */
    public get enterAwayPlayer () {
        return this.controller.data['enterAwayPlayer'][this._curQuater];
    }
    /** 获取比赛总数据 */
    public get data () {
        return this.controller.data;
    }


    onLoad () {
        this.controller.init();
        this._curQuater = 0;
        this._speed = 1;
        this._step = 0;
        this._score = {};

        /** 保存UI节点 */
        this.competitionUI = this.node.getChildByName('count_ui').getComponent(CompetitionUI);
        this.competitionMap = this.node.getChildByName('count_map').getComponent(CompetitionMap);

        
        this.initPlayer();
    }

    onDestroy () {
        this.controller.resourceMap = null;//清除缓存
        this.competitionUI = null;
        this.competitionMap = null;
    }

    start () {

    }

    onEnable () {
        //隐藏主场景
        Events.getInstance().dispatch(EventConst.CLOSE_MAIN);
    }

    onDisable () {
        //显示主场景
        Events.getInstance().dispatch(EventConst.SHOW_MAIN);
    }
    
    update (dt) {
        //TODO:
        /** 什么时候开始正式执行 */

        //更新球场时间
        this.competitionUI.updateTime(this.data['roundInfo'], this._step, this.data['singleRound']);

        if(this._step == this.data['totalRound'])
        {
            if(this._inShoot == false)
            {
                this.skipMatch();
            }
            else
            {
                this.scheduleOnce(this.endShoot,10);
            }
            
            return;
        }
        
        //处理回合信息
        this.processRoundInfo();
    }

    /** 初始化球员 */
    initPlayer(){
        /** 创建篮球节点 */
        let ball = cc.instantiate(this.controller.getPrefabInstance(UIConfig.countBall));
        ball.parent = this.node.getChildByName('count_map');;

        this.ballNode = ball.getComponent(BallNode);
        this.ballNode.init();

        this.initCountPlayer();

        //competitionUI.showTime(this.data['homeName'], this.data['awayName'], this.data['homeLogo'], this.data['awayLogo']);

        this.updatePlayerList();
    }

    /** 当正在投篮的时候无法立即结束比赛，延迟10秒等投篮结束再结束 */
    private endShoot():void
    {
        if(this._inShoot == false)
        {
            this.skipMatch();
        }
    }

    //跳过比赛
    public skipMatch(type:number=0):void
    {
        if(type >= 0)
        {
            if(this._step < 5)
            {
                return;
            }
        }
        
        //SoundManager.play(SoundConfig.COUNT_END_QUALTER, 1, 0, 1);
        
        this.node.pauseAllActions();
        
        this._score = null;
        
        //SoundManager.stopAll();
        
        this._inPause = false;
        
        let data = this.data;
        this.competitionUI.showEnd([data['homeManagerId'], data['awayManagerId']], [data['homeScore'], data['awayScore']],this.endMatch);
    }

    //更新球员信息
    private updatePlayer():void
    {
        var i:number;
        
        for(i=0;i<this.data['enterHomePlayer'][this._curQuater].length;i++)
        {
            this.playerList[i].info = this.data['homePlayerInfo'][this.data['enterHomePlayer'][this._curQuater][i][0]];
            
            this.playerList[i].setPos(this._step + 1);
            
            this.playerList[i].inAction = false;
            
            this.playerList[i].change = true;
            
            this.playerList[i].doAction(this._step + 1);
        }
        
        for(i=0;i<this.data['enterAwayPlayer'][this._curQuater].length;i++)
        {
            this.playerList[i + 5].info = this.data['awayPlayerInfo'][this.data['enterAwayPlayer'][this._curQuater][i][0]];
            
            this.playerList[i + 5].setPos(this._step + 1);
            
            this.playerList[i + 5].inAction = false;
            
            this.playerList[i + 5].change = true;
            
            this.playerList[i + 5].doAction(this._step + 1);
        }
        
        //计算球场镜头位置
        //CameraController.getInstance().speMove(_step, _playerList);
        
        this.updatePlayerList();
        
        /** 篮筐动画 */
        // _leftNet.gotoAndStop(1);
        // _rightNet.gotoAndStop(1);
        
        // if(this.data['homeCom'][this._curQuater] == null && this.data['awayCom'][this._curQuater] == null)
        // {
        //     this.restart();
        // }
        // else
        // {
        //     //处理天赋
        //     CountComposeController.instace.showCompose(_match, _curQuater, _playerList, restart);
        // }
    }

    /**
     * 更新单节信息
     */
    private processRoundInfo():void
    {	
        /** 移动摄像头 */
        //CameraController.getInstance().move(_step, _playerList);
        
        var i:number;
        
        if(this._step == 0)
        {	
            this._step++;
            
            return;
        }
        
        //过节比赛
        if(this.data['matchInfo'][this._step] && this.data['matchInfo'][this._step]['interuption'] != 0)
        {
            this.ballNode.node.active = false;
            
            this.playerList.forEach( player => {
                player.stop();
                player.inAction = false;
            });
            
            this.competitionUI.oneQuater(this._curQuater + 1,
                ()=>
                {
                    this._curQuater++;
                    this.updatePlayer();
                    this._step++;
                }
            );
            return;
        }
        
        
        //处理每个球员的动作
        for(i=0;i<this.playerList.length;i++)
        {	
            if(this._slamDunkPlayer && this._slamDunkPlayer == this.playerList[i])
            {
                continue;
            }
            
            if(this._inPause == true)
            {
                return;
            }
            
            this.playerList[i].change = false;
            
            this.playerList[i].setPos(this._step);
            
            this.playerList[i].doAction(this._step);
            
            if(this.playerList[i].info['match'][this._step] && this.playerList[i].info['match'][this._step].state == PlayerActionType.slam_dunk)
            {
                this._slamDunkPlayer = this.playerList[i];
            }
            else if(this.playerList[i].info['match'][this._step] && (this.playerList[i].info['match'][this._step].state == PlayerActionType.take_ball || this.playerList[i].info['match'][this._step].state == PlayerActionType.idle_ball))
            {
                this.ballNode.node.active = false;
            }
        }
        
        //球员重新排序
        if(this.data['matchInfo'][this._step] == null)
        {
            this._step++;
            
            return;
        }

        this._obj = this.data['matchInfo'][this._step];

        //分别对每一个球员的动作做预先处理的工作
        if(this._obj['type'] == CountPlayerType.none 
            || this._obj['type'] == CountPlayerType.rebound 
            || this._obj['type'] == CountPlayerType.reboundFree)
        {
            if(this._obj['type'] == CountPlayerType.rebound)
            {
                this.playerList.forEach((p)=>
                {
                    if(p.info['cid'] == this._obj['rebound']['getBallCid'])
                    {
                        p.inReboundAction = PlayerActionType.attack_rebounds;
                        return;
                    }
                });
            }
            
            this._obj = null;
            this._speStep = 0;
        }
        else if(this._obj['type'] == CountPlayerType.passSuss || this._obj['type'] == CountPlayerType.openBall || this._obj['type'] == CountPlayerType.passFail)
        {
            this._speStep = this._step + 1;
        }
        else if(this._obj['type'] == CountPlayerType.shoot||this._obj['type'] == CountPlayerType.steal)
        {
            this._speStep = this._step + 2;
            
            this.playerList.forEach((pr)=>{
                if(pr.info['match'][this._step].state == PlayerActionType.shot)
                {
                    if(pr.info['skillNum'] == 0 && pr.info['match'][this._step].hasModel == 0)
                    {
                        this._messagetype = CountMessageType.noSkillShootGoal;
                    }
                    else
                    {
                        if(pr.info['skillNum'] != 0 && pr.info['skillRes'][this._step])
                        {
                            this._messagetype = CountMessageType.skillShootGoal;
                            
                            this._messageSkill = CountSkillType.getInstance().getModeName(parseInt(pr.info['skillRes'][this._step]));
                        }
                        else if(pr.info['match'][this._step].hasModel != 0)
                        {
                            this._messagetype = CountMessageType.skillShootGoal;
                            
                            this._messageSkill = CountSkillType.getInstance().getModeName(parseInt(pr.info['match'][this._step].model));
                        }
                        else
                        {
                            this._messagetype = CountMessageType.noSkillShootGoal;
                        }
                    }
                }
                else if(pr.info['match'][this._step].state == PlayerActionType.three_point)
                {
                    if(pr.info['skillNum'] == 0 && pr.info['match'][this._step].model == 0)
                    {
                        this._messagetype = CountMessageType.noSkillThreeGoal
                    }
                    else
                    {
                        if(pr.info['skillNum'] != 0)
                        {
                            if(pr.info['skillRes'][this._step])
                            {
                                this._messagetype = CountMessageType.skillThreeGoal;
                                
                                this._messageSkill = CountSkillType.getInstance().getModeName(parseInt(pr.info['skillRes'][this._step]));
                            }
                            else
                            {
                                this._messagetype = CountMessageType.noSkillThreeGoal;
                            }
                        }
                        
                        if(pr.info['match'][this._step].model != 0)
                        {
                            this._messagetype = CountMessageType.skillThreeGoal;
                            
                            this._messageSkill = CountSkillType.getInstance().getModeName(parseInt(pr.info['match'][this._step].model));
                        }
                    }
                }
            });
        }
        else if(this._obj['type'] == CountPlayerType.foulShoot)
        {
            this._speStep = this._step + 2;
        }
        else if(this._obj['type'] == CountPlayerType.steal)
        {
            this._speStep = this._step 
        }
        else if(this._obj['type'] == CountPlayerType.slamDunk)
        {
            this.playerList.forEach((pe)=>{
                if(pe.info['match'][this._step].state == PlayerActionType.slam_dunk)
                {
                    if(pe.info['skillNum'] == 0)
                    {
                        this._messagetype = CountMessageType.noSkillSlamdunk;
                    }
                    else
                    {
                        if(pe.info['skillRes'][this._step])
                        {
                            this._messagetype = CountMessageType.skillSlamdunk;
                            
                            this._messageSkill = CountSkillType.getInstance().getSkillName(parseInt(pe.info['skillRes'][this._step]));
                        }
                        else
                        {
                            this._messagetype = CountMessageType.noSkillSlamdunk;
                        }							
                    }
                }
            });
            
            this._inShoot = true;
            
            this.processSlamDunk(this._obj['dunk'], this._obj['nextRound']);
        }
        
        // if(Test.isTestSkill)
        // {
        //     processSkill([_playerList[0].info.cid],Test.testSkillId);
        // }
        
        this._step++;
        return;
    }

    /** 比赛结束 清理数据 */
    public endMatch():void
    {	
        cc.log('比赛结束，清理数据！');
        // if(MatchConfig.EndMatch != null)
        // {
        //     MatchConfig.EndMatch(MatchConfig.MatchCount);
            
        //     CountLoadPlayerController.getInstance().remove();
            
        //     if(_scene && _main.contains(_scene))
        //     {
        //         _main.removeChild(_scene);
                
        //         _scene = null;
        //     }
            
        //     _main.close();
        // }
    }

    public initCountPlayer () {
        /** 比赛数据 */
        let controller = CountController.getInstance();
        let data = controller.data;

        this.playerList = [];

        /** 创建己方球员节点 */
        let enterHomePlayer = data['enterHomePlayer'][this._curQuater];
        for(let i=0;i<enterHomePlayer.length;i++)
        {
            let node = cc.instantiate(controller.getPrefabInstance(UIConfig.countPlayer));
            node.parent = this.node.getChildByName('count_map');
            let player:PlayerNode = node.getComponent(PlayerNode);
            this.playerList.push(player);

            player.init(data['homePlayerInfo'][data['enterHomePlayer'][this._curQuater][i][0]],
                PlayerSide.Home,
                data['homeCloth'],
                data['matchType'],
                i);
        }
        /** 对方球员节点 */
        let enterAwayPlayer = data['enterAwayPlayer'][this._curQuater];;
        for(let i=0;i<enterAwayPlayer.length;i++)
        {
            let node = cc.instantiate(controller.getPrefabInstance(UIConfig.countPlayer));
            node.parent = this.node.getChildByName('count_map');
            let player:PlayerNode = node.getComponent(PlayerNode);
            this.playerList.push(player);

            player.init(data['awayPlayerInfo'][data['enterAwayPlayer'][this._curQuater][i][0]],
                PlayerSide.Home,
                data['awayCloth'],
                data['matchType'],
                i);
        }
        
        if(this._curQuater == 0)
        {
            this.initRound();
        }
        else
        {
            this.playerList.forEach(player => {
                player.doAction(-1);
            });
        }
    }

    /**
     *  更新每一节球员信息
     */
    private updatePlayerList():void
    {
        var home = new Array();
        var away = new Array();
        this.playerList.forEach(player => {
            if(player.info['cid'] < 100)
            {
                home.push([player.info,player.data, this._curQuater]);
            }
            else
            {
                away.push([player.info,player.data, this._curQuater]);
            }
            
            if(this._score[player.info['cid']] == null)
            {
                this._score[player.info['cid']] = [0,0,0,0,0,0];
            }
        });
        
        // this.competitionUI.ListInfo(home, away, _score, _inShowUi);
    }

    /**
     * 初始化开始球员的位置
     */
    private initRound():void
    {
        this.playerList.forEach(player => {
            player.node.position = cc.Vec2.ZERO;
            player.doAction(-1);
        });
    }

    /**
     * 获取两个篮框的坐标
     * @param value
     */
    private getEndPoint(value:number):cc.Vec2
    {
        if(value == PlayerSide.Home)
        {
            return new cc.Vec2(MatchConfig.RightNet.x, MatchConfig.RightNet.y);
        }
        else
        {
            return new cc.Vec2(MatchConfig.LeftNet.x, MatchConfig.LeftNet.y);
        }
    }
    /**
     * 获取球员节点
     * @param cid 
     */
    public findPlayerByCid(cid:number):string
    {
        for(let i = 0;i<this.playerList.length;i++){
            let player = this.playerList[i];
            if(player.info['cid'] == cid)
            {
                return player.info['pid']
            }
        }
        
        return null;
    }

    //灌篮
    private processSlamDunk(obj:Object, nextRound:number):void
    {
        var end:cc.Vec2;
        
        var player;
        
        var dunEnd:cc.Vec2 = new cc.Vec2(this.getEndPoint(obj['shootSide']).x,this.getEndPoint(obj['shootSide']).y) ;
        
        var data:Object = {};
        data['shootNum'] = 1;
        data['pid'] = this.findPlayerByCid(obj['shootCid']);
        data['side'] = obj['shootSide'];
        data['shootCid'] = obj['shootCid'];
        if(obj['assitant'] < 255)
        {
            data['ass'] = obj['assitant'];
            data['assPid'] = this.findPlayerByCid(obj['assitant']);
        }
        
        if((this._slamDunkPlayer.info['skillNum'] > 0 && this._slamDunkPlayer.info['skillRes'][this._step]) || (this._slamDunkPlayer.info['match'][this._step].hasModel != 0))
        {
            switch(this._slamDunkPlayer.info['match'][this._step].model)
            {
                case 61:
                case 62:
                case 63:
                case 64:
                case 65:
                    if(dunEnd.x == MatchConfig.LeftNet.x)
                    {
                        dunEnd.x += 3;
                    }
                    else
                    {
                        dunEnd.x -= 3;
                    }
                    dunEnd.y+=2;
                    break;
                case 51:
                case 52:
                case 53:
                case 54:
                case 55:
                    if(dunEnd.x == MatchConfig.LeftNet.x)
                    {
                        dunEnd.x += 8;
                    }
                    else
                    {
                        dunEnd.x -= 8;
                    }
                    dunEnd.y+=2;
                    break;
                case 56:
                case 57:
                case 58:
                case 59:
                case 60:
                    if(dunEnd.x == MatchConfig.LeftNet.x)
                    {
                        dunEnd.x += 4;
                    }
                    else
                    {
                        dunEnd.x -= 4;
                    }
                    dunEnd.y+=3;
                    break;
                case 66:
                case 67:
                case 68:
                case 69:
                case 70:
                    if(this._slamDunkPlayer.info['match'][this._step].dir != 2 && this._slamDunkPlayer.info['match'][this._step].dir != 6)
                    {
                        if(dunEnd.x == MatchConfig.LeftNet.x)
                        {
                            dunEnd.x += 4;
                        }
                        else
                        {
                            dunEnd.x -= 4;
                        }
                    }
                    dunEnd.y++;
                    break;
                default:
                    if(dunEnd.x == MatchConfig.LeftNet.x)
                    {
                        dunEnd.x += 5;
                    }
                    else
                    {
                        dunEnd.x -= 5;
                    }
                    dunEnd.y+=2;
                    break;
            }
        }
        else
        {
            if(dunEnd.x == MatchConfig.LeftNet.x)
            {
                dunEnd.x -= 1;
            }
            else
            {
                dunEnd.x += 1;
            }
        }
        
        this._slamDunkPlayer.dunkEndRound = obj['endRound'];

        this._slamDunkPlayer.addComponent(CustomCurving).curveTo(new cc.Vec2(obj['shootX'], obj['shootY'])
            ,dunEnd
            ,obj['endRound'] - this._step
            ,false
            ,false
            ,(point:cc.Vec2)=>{
                this._slamDunkPlayer = null;
                
                if(obj['isFoul'] != 0)
                {
                    //pause();
                    
                    this.competitionUI.showFoul(this.restart);
                }
                
                if(obj['isGoal'] != 0)
                {
                    //SoundManager.play(SoundConfig.COUNT_SLAMDUNK, 1.2, 0, 1);
                    
                    data['shoot'] = 1;
                    
                    this.competitionUI.updateSingleInfo(data);
                    
                    for(let i = 0;i<this.playerList.length;i++)
                    {
                        let player = this.playerList[i];
                        if(obj['shootCid'] == player.info['cid'])
                        {
                            //player.addTalk(XFacade.getInstance().getUI("playerTalk"), LanConfig.slamdunk[MatchConfig.MatchTalk%LanConfig.slamdunk.length]);
                            
                            MatchConfig.MatchTalk++;
                            
                            player.info['score'] += 2;
                            
                            this.competitionUI.showMessage(player.data['Pid']);
                            
                            break;
                        }
                    }
                    
                    if(obj['isBlock'] == PlayerSide.Home)
                    {
                        this.competitionUI.updateScore(obj['score'], 0);
                    }
                    else
                    {
                        this.competitionUI.updateScore(0, obj['score']);
                    }
                    
                    this.competitionUI.showScore(MatchConfig.PlayerInfo[obj['shootCid']], obj);
                    
                    //pause();
                    
                    //TODO: 播放灌篮动画
                    // var mc
                    // if(obj['isBlock'] == PlayerSide.Home)
                    // {
                    //     mc = this._rightNet;
                    // }
                    // else
                    // {
                    //     mc = this._leftNet;
                    // }
                    
                    // //SoundManager.play(SoundConfig.COUNT_SHOOT, 1.2, 0, 1);
                    
                    // mc.addEventListener(Event.ENTER_FRAME, ballFallFrame);
                    // mc.gotoAndPlay(1);
                }
                else
                {
                    this._inShoot = false;
                    
                    //SoundManager.play(SoundConfig.COUNT_NO_SLAMDUNK, 1.2, 0, 1);
                    
                    data['shoot'] = 0;
                    
                    //CountUiController.getInstance().updateSingleInfo(data);
                    
                    if(this._messagetype == CountMessageType.noSkillSlamdunk)
                    {
                        this._messagetype = CountMessageType.noSkillNoDunk;
                    }
                    else if(this._messagetype == CountMessageType.skillSlamdunk)
                    {
                        this._messagetype = CountMessageType.skillNoDunk;
                    }

                    for(let i = 0;i< this.playerList.length;i++)
                    {
                        let player = this.playerList[i];
                        if(obj['shootCid'] == player.info['cid'])
                        {
                            //player.addTalk(XFacade.getInstance().getUI("playerTalk"), LanConfig.noShoot[MatchConfig.MatchTalk%LanConfig.noShoot.length]);
                            
                            MatchConfig.MatchTalk++;
                            
                            this.competitionUI.showMessage(player.data['Pid']);
                            
                            break;
                        }
                    }
                    
                    var tem:Object = this.data['matchInfo'][nextRound];
                    
                    if(tem['type'] == CountPlayerType.reboundFree)
                    {
                        //篮板自由球
                        if((tem['reboundFreeBall'].endRound - this._step) <= 3)
                        {
                            this.ballNode.node.runAction(cc.sequence(
                                cc.moveTo(MatchConfig.Living * (tem['reboundFreeBall']['endRound'] - this._step),tem['reboundFreeBall']['endFact']['x'], tem['reboundFreeBall']['endFact']['y']),
                                cc.callFunc(function(){
                                    this.ballNode.node.active = false;
                                },this)
                            ));
                        }
                        else
                        {
                            this.ballNode.addComponent(CustomCurveTo).curveTo(point
                                ,new cc.Vec2(tem['reboundFreeBall']['endX'], tem['reboundFreeBall']['endY'])
                                ,tem['reboundFreeBall']['endRound'] - this._step - 1
                                ,()=>
                                {
                                    this.ballNode.node.active = false;
                                }
                            );
                        }
                    }
                    else if(tem['type'] == CountPlayerType.rebound)
                    {
                        //抢篮板回合rebounds_noBall
                        this.ballNode.addComponent(CustomCurveTo).curveTo(point
                            , new cc.Vec2(tem['rebound']['targetX']
                            , tem['rebound']['targetY'])
                            , tem['rebound']['reboundEndRound'] - this._step + 2, 
                            ()=>
                            {
                                this.ballNode.node.active = false;
                            }
                        );
                    }
                }
            }

        );
        //被盖帽的话球不需要做处理
    }

    public restart(e:Event=null):void
    {
        // if(_timer && _timer.running == false)
        // {
        //     _timer.start();
        // }
        
        // for each(var player:Player in _playerList)
        // {
        //     player.restart();
        // }
    }
    
}
