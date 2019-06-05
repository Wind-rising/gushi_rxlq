/**
 * 球员
 */
const {ccclass, property} = cc._decorator;
import PlayerSide from "../../data/type/PlayerSide";
import ItemData from "../../data/ItemData";
import PlayerActionType from "../../data/PlayerActionType";
import EventConst from "../../data/EventConst";
import Events from "../../signal/Events";
import MatchConfig from "../../config/MatchConfig";
import CountSkillType from "../../data/CountSkillType";
import CountController from "../../controllor/CountController";
import CompetitionView from "./CompetitionView";
import SoundManager from "../../manager/SoundManager";
import SoundConfig from "../../config/SoundConfig";
@ccclass
export default class PlayerNode extends cc.Component {
    private _competitionView:CompetitionView = null;

    /** 球员配置数据 */
    private _data:Object = 0;
    /** 球员比赛数据 */
    private _info:Object = null;
    /** 标识敌我双方 */
    private _side:number = 0;
    /** 球员衣服 */
    private _cloth:number = 0;
    /** 比赛类型 */
    private _matchType:number = 0;
    /** 球员索引 */
    private _showId:number = 0;
    /** 强制修改球员状态。在换节的时候使用 */
    private _inAction:boolean = false;

    private _nameVisible:boolean = false;
    /** 是否需要刷新 */
    public change:boolean = false;

    /** 该物体的方向 */	
    protected _direction:number;

    /** 实际的球员朝向 */
    private _factDir:number;

    private _dunkStep:number;
    private DunkRound:number = 6;

    private _filterStep:number;

    private _inActionFrame:boolean = false;

    /** 用于暂时模拟帧动画 */
    private _skin:Object = {
        player:{
            currentFrame:0,
            totalFrames:20
        }
    };
    /** doaction的回调函数 */
    private _actionFun:Function;

    private _inReboundAction:number;
    private _dunkEndRound:number;
    private _skillRound:number= -1;
    private _change:boolean;
    private _skillId:number = -1;
    private _action:number;
    private _actionName:string;
    private _scaleX:number;

    public get info ():Object {
        return this._info;
    }
    public set info (value:Object) {
        this._info = value;
    }
    public get data () {
        return this._data;
    }
    public get inAction ():boolean {
        return this._inAction;
    }
    public set inAction( value:boolean){
        this._inAction = value;
    }
    public set inReboundAction (value:number){
        this._inReboundAction = value;
    }
    public get dunkEndRound ():number{
        return this._dunkEndRound;
    }
    public set dunkEndRound (value:number){
        this._dunkEndRound = value;
    }

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this._inAction = false;
    }

    start () {
    }

    update (dt) {
        if(this._skin['player']['currentFrame'] < this._skin['player']['totalFrames']){
            this._skin['player']['currentFrame']++;
        }

        if(this._inActionFrame){
            this.playerMove();
        }

    }

    /**
     * 初始化数据
     */
    public init(view:CompetitionView,info:Object,side:number,cloth:number,matchType:number,showId:number){
        this._competitionView = view;
        this._info = info;
        this._side = side;
        this._cloth = cloth;
        this._matchType = matchType;
        this._showId = showId;
        this._data = ItemData.getPlayerInfo(this._info['pid']);
    }
    
    stop () {
        this._inAction = false;
    }

    /**
     * 更新球员位置
     * @param round 回合数
     * @param move 是否移动过去，如果为否直接设置坐标，否则播放移动动画
     */
    public setPos(round:number, move:Boolean = true):void
    {
        this._nameVisible = this._info['match'][round]['nameVisible'] == 1?true:false;
        
        if(this._inAction == true)
        {
            return;
        }

        let endPos = this._info['match'][round]['playerPoint'];
        if(move == true)
        {
            this.node.stopAllActions();
            this.node.runAction(cc.moveTo(MatchConfig.MoveLive,endPos.x,endPos.y));
        }
        else
        {
            this.node.x = endPos.x;
            this.node.y = endPos.y;
        }
    }

    /**
     * 
     * @param round 某一节比赛开始
     */
    public doAction (round:number,fun:Function = null){
        if((this._info['match'][round] && this._info['match'][round].hasModel != 0) || (this._info['skillRes'] && this._info['skillRes'][round]))
        {
            this._direction = this._info['match'][round].dir;
            
            if(this._info['match'][round]['hasModel'] != 0)
            {	
                /** 获取技能动画并且播放 */
                // var mc;
                // if(this._info['match'][round]['model'] >= 191 && this._info['match'][round]['model'] <= 215)
                // {
                //     mc =MatchConfig.MatchResource[this.getSkill(this._info['match'][round].model) + "_" + this._showId];
                // }
                // else
                // {
                //     mc = MatchConfig.MatchResource[this.getSkill(this._info['match'][round].model) + "_0"];
                // }
                
                // if(mc != null)
                // {
                //     this.processModel(this._info['match'][round]['model'], this._info['match'][round]['dir']);
                // }
                this.processModel(this._info['match'][round]['model'], this._info['match'][round]['dir']);
                
            }
            else
            {	
                if(this._info['skillRes'][round][0] <2000)
                {
                    var array;
                    
                    if(CountSkillType.getInstance().getSkillTarget(this._info['skillRes'][round][0]) == 1)
                    {
                        if(this._skillRound != round)
                        {
                            this._skillRound = round;
                            
                            array = MatchConfig.MatchResource[this.getSkill(this._info['skillRes'][round][0])];
                            
                            if(array != null && array[0] != null)
                            {
                                this.processSkill(this._info['skillRes'][round][0]);
                            }
                        }
                    }
                    else
                    {
                        if(this._skillRound != round)
                        {
                            this._skillRound = round;
                            
                            array = MatchConfig.MatchResource[this.getSkill(this._info['skillRes'][round][0])];
                            
                            if(array != null && array[0] != null)
                            {
                                /** 球星技能，会影响其他球员 */
                                this._competitionView.processSkill(this._info['skillRes'][round][1], this._info['skillRes'][round][0]);
                            }
                            
                            
                        }
                    }
                    
                    return;
                }
            }
        }

        if(fun != null)
        {
            this._actionFun = fun;
        }
        
        if(this._inAction == true)
        {
            if(this._info['match'][round]['state'] != PlayerActionType.slam_dunk 
                && this._info['match'][round]['state'] != PlayerActionType.run_pass
                && this._info['match'][round]['state'] != PlayerActionType.shot)
            {
                return;
            }
            
            this._inAction = false;
        }
        
        if(this._change == false)
        {
            if(round != -1)
            {
                if(this._info['match'][round] == null)
                {
                    return;
                }
                
                if(this._action == this._info['match'][round].state && this._factDir == this._info['match'][round].dir)
                {
                    return;
                }
            }
        }
        
        
        if(round == -1)
        {
            this._action = PlayerActionType.attack_wait;
            this._actionName = PlayerActionType.getActionName(PlayerActionType.attack_wait);
            this._direction = this._info['match'][0].dir;
            this._factDir =  this._info['match'][0].dir;
        }
        else
        {
            this._action = this._info['match'][round]['state'];
            this._actionName = PlayerActionType.getActionName(this._info['match'][round]['state']);
            this._direction = this._info['match'][round]['dir'];
            this._factDir =  this._info['match'][round]['dir'];
            //_shadow.nameVisible = this._info['match'][round]['nameVisible'];
        }
        
        this.processDir();
        
        if(this._action == PlayerActionType.do_pre_action)
        {
            this.excuteAction(PlayerActionType.getActionName(PlayerActionType.attack_wait) + this._direction);
            return;
        }
        
        //this.processMcPos(_mc);
        
        //篮板球判断
        if(this._info['match'][round] && this._info['match'][round].state == PlayerActionType.rebounds_noBall)
        {
            if(this._inReboundAction == PlayerActionType.attack_rebounds)
            {
                this._info['match'][round].state = PlayerActionType.attack_rebounds;
                
                this._actionName = PlayerActionType.getActionName(PlayerActionType.attack_rebounds);
                
                this._inReboundAction = -1;
            }
        }
        
        this.excuteAction(this._actionName + this._direction);
        
        //_mc.visible = true;
        
        if(round != -1)
        {	
            switch(this._info['match'][round]['state'])
            {
                case PlayerActionType.shot:
                case PlayerActionType.three_point:
                case PlayerActionType.idle_pass:
                case PlayerActionType.run_pass:
                case PlayerActionType.block:
                case PlayerActionType.jump_ball:
                case PlayerActionType.slam_dunk:
                case PlayerActionType.outside_ball:
                case PlayerActionType.foul_shot:
                case PlayerActionType.attack_rebounds:
                case PlayerActionType.defend_rebound:
                case PlayerActionType.rebounds_noBall:
                case PlayerActionType.steal:
                case PlayerActionType.intercept:
                case PlayerActionType.take_ball:
                    if(this._info['match'][round].state == PlayerActionType.take_ball)
                    {
                        Events.getInstance().dispatch(EventConst.CLOSE_BALL);
                    }
                    this.setAction();
                    break;
            }
        }
    }

    /**
     * 处理球员转向
     */
    private processDir():void
    {
        if(this._direction == 0)
        {
            this._scaleX = -1;
            this._direction = 4;
        }
        else if(this._direction == 1)
        {
            this._scaleX = -1;
            this._direction = 3;
        }
        else if(this._direction == 7)
        {
            this._scaleX = -1;
            this._direction = 5;
        }
        else
        {
            this._scaleX = 1;
        }
    }

    private setAction():void
    {	
        this._inAction = true;
        
        if(this._action == PlayerActionType.slam_dunk || this._action == PlayerActionType.shot || this._action == PlayerActionType.three_point)
        {
            this._dunkStep = 0;
            
            this._filterStep = 0;
        }
        else if(this._action == PlayerActionType.outside_ball)
        {
            //CountController.getInstance().removeNetFrame();
        }
        else if(this._action == -1 && this._actionName == "rebounds_")
        {
            this._filterStep = 0;
        }
        else if(this._action == PlayerActionType.take_ball)
        {
            SoundManager.play(SoundConfig.COUNT_GET_BALL, 1, 0, 1);
        }
        else if(this._action == PlayerActionType.idle_pass || this._action == PlayerActionType.run_pass)
        {
            SoundManager.play(SoundConfig.COUNT_PASS_BALL, 1, 0, 1);
        }
        else if(this._action == PlayerActionType.steal || this._action == PlayerActionType.intercept)
        {
            var data:Object = {};
            data['steal'] = 1;
            data['cid'] = this._info['cid'];
            data['pid'] = this._info['pid'];
            data['side'] = this._side;
            
            this._competitionView.updateSingleInfo(data);
        }
        
        if(this._inActionFrame == false)
        {
            this._inActionFrame = true;
        }
    }

    private playerMove () {
        /** 更换球员皮肤 */
        // if((this._action == PlayerActionType.shot || (this._action == -1 && this._actionName == "rebounds_") 
        //     || this._action == PlayerActionType.slam_dunk || this._action == PlayerActionType.three_point) 
        //     && _skin.player.currentFrame %3 == 0)
        // {
        //     this._filterStep++;
            
        //     if(this._filterStep%2 == 1)
        //     {
        //         this.removeChild(_mc);
        //         _mc.filters = null;
        //         this.addChild(_mc);
        //     }
        //     else
        //     {
        //         this.removeChild(_mc);
        //         _mc.filters = CoolEffect.playerFilter;
        //         this.addChild(_mc);
        //     }
        // }
        
        
        //灌篮动作特殊处理
        if(this._action == PlayerActionType.slam_dunk)
        {
            if(this._skin['player']['currentFrame'] == 9)
            {
                this._dunkStep++;
                if(this._dunkStep >= this.DunkRound)
                {
                    // _head.player.play();
                    // _cloth.player.play();
                    // _skin.player.play();
                }
            }
            else if(this._skin['player']['currentFrame'] == 10)
            {
                /** 播放画面抖动 */
                this._competitionView.moveUpAndDown();
            }
            else if(this._skin['player']['currentFrame'] == 13)
            {
                this.addDunkEffect();
            }
            else if(this._skin['player']['currentFrame'] == 14)
            {
                this._dunkStep == 0;
                
                // _head.player.stop();
                // _cloth.player.stop();
                // _skin.player.stop();
                
                this._dunkStep++;
                if(this._dunkStep >= 3)
                {
                    // _head.player.play();
                    // _cloth.player.play();
                    // _skin.player.play();
                }
            }
            else if(this._skin['player']['currentFrame'] == 15)
            {
                this._dunkStep == 0;
                
                // _head.player.stop();
                // _cloth.player.stop();
                // _skin.player.stop();
                
                this._dunkStep++;
                if(this._dunkStep >= 12)
                {
                    // _head.player.play();
                    // _cloth.player.play();
                    // _skin.player.play();
                    this.node.stopAllActions();
                    this.node.runAction(cc.moveTo(MatchConfig.Living,this._info['match'][this._dunkEndRound]['playerPoint']));
                }
                
                this.stopAction();
            }
        }
        
        if(this._action == PlayerActionType.shot || this._action == PlayerActionType.three_point)
        {
            if(this._skin['player']['currentFrame'] == 12)
            {
                // this.addChild(MatchConfig.MatchResource[ResourceType.shootEffect]);
                
                // MatchConfig.MatchResource[ResourceType.shootEffect].gotoAndPlay(1);
                
                if(this._factDir == 0)
                {
                    // MatchConfig.MatchResource[ResourceType.shootEffect].x = 20;
                    
                    // MatchConfig.MatchResource[ResourceType.shootEffect].y = -120;
                }
                else if(this._factDir == 1)
                {
                    // MatchConfig.MatchResource[ResourceType.shootEffect].x = 20;
                    
                    // MatchConfig.MatchResource[ResourceType.shootEffect].y = -120;
                }
                else if(this._factDir == 2)
                {
                    // MatchConfig.MatchResource[ResourceType.shootEffect].x = 7;
                    
                    // MatchConfig.MatchResource[ResourceType.shootEffect].y = -120;
                }
                else if(this._factDir == 3)
                {
                    // MatchConfig.MatchResource[ResourceType.shootEffect].x = -20;
                    
                    // MatchConfig.MatchResource[ResourceType.shootEffect].y = -120;
                }
                else if(this._factDir == 4)
                {
                    // MatchConfig.MatchResource[ResourceType.shootEffect].x = -20;
                    
                    // MatchConfig.MatchResource[ResourceType.shootEffect].y = -120;
                }
                else if(this._factDir == 5)
                {
                    // MatchConfig.MatchResource[ResourceType.shootEffect].x = -2;
                    
                    // MatchConfig.MatchResource[ResourceType.shootEffect].y = -130;
                }
                else if(this._factDir == 6)
                {
                    // MatchConfig.MatchResource[ResourceType.shootEffect].x = -3;
                    
                    // MatchConfig.MatchResource[ResourceType.shootEffect].y = -130;
                }
                else if(this._factDir == 7)
                {
                    // MatchConfig.MatchResource[ResourceType.shootEffect].x = 2;
                    
                    // MatchConfig.MatchResource[ResourceType.shootEffect].y = -130;
                }
            }
            else if(this._skin['player']['currentFrame'] == 13)
            {
                // _head.player.stop();
                // _cloth.player.stop();
                // _skin.player.stop();
                
                this._dunkStep++;
                
                if(this._dunkStep == 4)
                {
                    // _head.player.play();
                    // _cloth.player.play();
                    // _skin.player.play();
                }
            }
        }
        
        if(this._action == PlayerActionType.rebounds_noBall || this._action == PlayerActionType.attack_rebounds || this._action == PlayerActionType.defend_rebound)
        {
            if(this._skin['player']['currentFrame'] == 6)
            {
                this._competitionView.stopBall();
                // MoveToController.getInstance().stop();
                
                // if(_rebEffect && !this.contains(_rebEffect))
                // {
                //     _rebEffect.mc.gotoAndPlay(1);
                    
                //     this.addChild(_rebEffect);
                    
                //     _rebEffect.y = -130;
                // }
            }
        }
        
        // if(this._rebEffect)
        // {
        //     if(_rebEffect.mc.currentFrame == _rebEffect.mc.totalFrames)
        //     {
        //         if(this.contains(_rebEffect))
        //         {
        //             this.removeChild(_rebEffect);
                    
        //             _rebEffect.mc.gotoAndStop(1);
        //         }
                
        //         _rebEffect = null;
        //     }
        // }
        
        if(this._skin['player']['currentFrame'] == this._skin['player']['totalFrames'] - 12)
        {
            if(this._actionFun != null)
            {
                this._actionFun();
                
                this._actionFun = null;
            }
        }
        
        if(this._skin['player']['currentFrame'] == this._skin['player']['totalFrames'])
        {	
            this._inActionFrame = false;
            
            // if(this.contains(MatchConfig.MatchResource[ResourceType.shootEffect]))
            // {
            //     this.removeChild(MatchConfig.MatchResource[ResourceType.shootEffect]);
            // }
            
            this._inActionFrame = false;

            this.stopAction();
            
            this.processDir();
            
            this.excuteAction(PlayerActionType.getActionName(PlayerActionType.attack_wait) + this._direction);
            
            this._inAction = false;
        }
    }

    /**
     * 添加灌篮效果
     */
    private addDunkEffect():void
    {
        // var mc:MovieClip = MatchConfig.MatchResource[ResourceType.dunkEffect];
        
        // this.addChild(mc);
        
        // mc.y = -150
        
        // mc.gotoAndPlay(1);
        
        // mc.addEventListener(Event.ENTER_FRAME, dunkFrame);
    }

    private processMcPos(mc:cc.Node):void
    {
        // mc.scaleX = this._scaleX;
        
        // if(_head == null || _skin == null || _cloth == null)
        // {
        //     if(_scaleX < 0)
        //     {
        //         mc.x = 90;
        //     }
        //     else
        //     {
        //         mc.x = -90;	
        //     }
        // }
        // else
        // {	
        //     if(_scaleX < 0)
        //     {
        //         mc.x = _mc.width/2;
        //     }
        //     else
        //     {
        //         mc.x = -_mc.width/2;	
        //     }
        // }
        
        // mc.y = -155;
    }

    /**
     * 播放球员动画
     */
    public excuteAction(value:string):void
    {
        //cc.log('播放球员动画 value = ' + value);
        // if(this._head == null || _skin == null || _cloth == null)
        // {
        //     return;
        // }
        
        // if(this._action == PlayerActionType.rebounds_noBall || this._action == PlayerActionType.defend_rebound)
        // {
        //     _head.gotoAndStop(PlayerActionType.getActionName(PlayerActionType.attack_rebounds) + _direction);
        // }
        // else
        // {
        //     _head.gotoAndStop(value);
        // }
        
        this._skin['player']['currentFrame'] = 1;
        // _head.player.gotoAndPlay(1);
        // _skin.gotoAndStop(value);
        // _skin.player.gotoAndPlay(1);
        // _cloth.gotoAndStop(value);
        // _cloth.player.gotoAndPlay(1);
    }

    /**
     * 处理球员模型
     */
    private processModel(skillId:number, dir:number):void
    {	
        if(this._skillId == -1)
        {
            this._skillId = skillId;
        }
        else
        {
            if(this._skillId == skillId)
            {
                return;
            }
            else
            {
                // if(_skillMc &&　this.contains(_skillMc))
                // {	
                //     this.removeChild(_skillMc);
                    
                //     _skillMc.removeEventListener(Event.ENTER_FRAME, modeFrame);
                    
                //     _skillMc.player.gotoAndStop(1);
                    
                //     _skillMc = null;
                // }
                
                this._skillId = skillId;
            }
        }
        
        
        //_mc.visible = false;
        
        // if(skillId >= 191 && this._skillId <= 215)
        // {
        //     _skillMc = MatchConfig.MatchResource[getSkill(skillId) + "_" + _showId];
        // }
        // else
        // {
        //     _skillMc = MatchConfig.MatchResource[getSkill(skillId) + "_0"];
        // }
        
        // _remind = MatchConfig.MatchResource[ResourceType.skillRemid + "_" + _showId];
        
        // this.addChild(_remind);
        
        // _remind.x = -30;
        // _remind.y = -150;
        
        // _remind.moveMc.word.gotoAndStop(int((_skillId-1)/5)+1);
        // _remind.moveMc.lv.gotoAndStop((_skillId - 1)%5+1);
                
        this._direction = dir;
        
        this.processDir();
        
        //this.processMcPos(_skillMc);
        
        // if(CountSkillType.getInstance().getModeResId(skillId) == "421281")
        // {
        //     _skillMc.y = -130
        // }
        
        // this.addChild(_skillMc);
        
        if(((this._skillId >= 1 && this._skillId <= 50) || (this._skillId >= 81 && this._skillId <= 85)) && CountSkillType.getInstance().getLast(this._skillId) != 0)
        {
            //处理抢挡篮板
            this._competitionView.pause2();
        }
        
        if(this._skillId >= 51 && this._skillId <= 75)
        {
            // this._moveMatch = true;
        }
        else if(this._skillId >= 81 && this._skillId <= 85)
        {
            this._competitionView.pause();
        }
        else if(this._skillId >= 141 && this._skillId <= 145)
        {
            // this._pauseMatch = true;
            // this._skillNum = 0;
            // this._skillTotal = 0;
        }
        else if(this._skillId >= 146 && this._skillId <= 150)
        {
            // this._pauseMatch = true;
            // this._skillNum = 0;
            // this._skillTotal = 0;
            this._competitionView._spePass = CompetitionView.curve;
        }
        else if(this._skillId >= 151 && this._skillId <= 155)
        {
            // this._pauseMatch = true;
            // this._skillNum = 0;
            // this._skillTotal = 0;
            this._competitionView._spePass = CompetitionView.ground;
        }
        else if(this._skillId >= 156 && this._skillId <= 165)
        {
            // this._pauseMatch = true;
            // this._skillNum = 0;
            // this._skillTotal = 0;
        }
//			else if(_skillId >= 166 && _skillId <= 190)
//			{
//				_skillNum = 0;
//				_skillTotal = 1;
//				_pauseMatch = true;
//				CountController.getInstance().pause();
//			}
        else if((this._skillId >= 191 && this._skillId <= 205) || (this._skillId >= 211))
        {
            // this._skillNum = 0;
            // this._skillTotal = 0;
            // this._pauseMatch = true;
            this._competitionView.pause();
        }
        
        this.scheduleOnce(()=>{
            this._competitionView.restart();
        },1);
        // _skillMc.addEventListener(Event.ENTER_FRAME, modeFrame);
        // _remind.addEventListener(Event.ENTER_FRAME, remindModelFrame);
        
        // _skillMc.gotoAndStop("c" + _direction);
        // _skillMc.player.gotoAndPlay(1);
        
        // _remind.gotoAndPlay(1);
        // _remind.moveMc.gotoAndPlay(1);
    }

    private getSkill(value:number):string
    {	
        if(value > 1000)
        {
            return CountSkillType.getInstance().getSkillResId(value.toString());
        }
        else
        {
            return CountSkillType.getInstance().getModeResId(value);
        }
    }

    /**
     * 处理球员技能
     */
    public processSkill(skillId:number):void
    {
        SoundManager.play(SoundConfig.COUNT_SKILL, 1, 0, 1);
        
        if(this._skillId == -1)
        {
            this._skillId = skillId;
        }
        else
        {
            if(this._skillId == skillId)
            {
                return;
            }
            else
            {
                // if(this._skillMc &&　this.contains(this._skillMc))
                // {
                //     this.removeChild(_skillMc);
                // }
                
                // this._skillMc.removeEventListener(Event.ENTER_FRAME, modeFrame);
                
                // this._skillMc = null;
                
                this._skillId = skillId
            }
        }
        
        this._competitionView.pause();
        
        // var array:Array = MatchConfig.MatchResource[getSkill(_skillId)]
        
        // _skillMc = array[0];
        
        // this.addChild(_skillMc);

        // _skillMc.gotoAndPlay(1);
        
        // _skillMc.x = -_skillMc.width/2;
        // _skillMc.y = -_skillMc.height/2;
        
        // _skillMc.addEventListener(Event.ENTER_FRAME, skillFrame);
    }
    /**
     * 添加球员头上的弹出框
     */
    public addTalk(value:String):void
    {
        // mc.talkContent.text = value;
        
        // mc.y = -155;
        // mc.x = -120;
        
        // this.addChild(mc);
        
        // _tween = TweenLite.to(mc, MatchConfig.Living, {onCompleteParams:[mc, this], onComplete:
        //     function(value:MovieClip, player:Player):void
        //     {
        //         TweenLite.killTweensOf(this, true);
                
        //         //_tween.kill();
        //         //_tween = null;
                
        //         if(player.contains(value))
        //         {
        //             player.removeChild(value);
        //         }
        //     }
        // })
        
    }

    public restart():void
    {
        // if(_head && _cloth && _skin)
        // {
        //     _head.player.play();
        //     _cloth.player.play();
        //     _skin.player.play();
        // }
        
        // if(_skillMc)
        // {
        //     if(_skillMc.player)
        //     {
        //         _skillMc.player.play();
        //     }
        // }
        // _shadow.start();
    }

    public stopAction(){
        this.node.stopAllActions();
    }
}
