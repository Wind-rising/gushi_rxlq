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
@ccclass
export default class PlayerNode extends cc.Component {
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

    update (dt) {}

    /**
     * 初始化数据
     */
    public init(info:Object,side:number,cloth:number,matchType:number,showId:number){
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
        
        if(move == true)
        {
            this.node.stopAllActions();
            this.node.runAction(cc.moveTo(MatchConfig.MoveLive,this._info['match'][round]['playerPoint']));
        }
        else
        {
            this.node.x = this._info['match'][round]['playerPoint'].x;
            this.node.y = this._info['match'][round]['playerPoint'].y;
        }
    }

    /**
     * 
     * @param round 某一节比赛开始
     */
    public doAction (round:number){
        if((this._info['match'][round] && this._info['match'][round].hasModel != 0) || (this._info['skillRes'] && this._info['skillRes'][round]))
        {
            this._direction = this._info['match'][round].dir;
            
            if(this._info['match'][round]['hasModel'] != 0)
            {	
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
                                //TODO: 
                                //CountController.getInstance().processSkill(this._info['skillRes'][round][1], this._info['skillRes'][round][0]);
                            }
                            
                            
                        }
                    }
                    
                    return;
                }
            }
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
        
        // if(_shadow)
        // {
        //     _shadow.scaleX = _scaleX;
        //     _shadow.x = _mc.x;
        //     _shadow.y = _mc.y;
            
        //     _shadow.txtPlayerName.scaleX = _scaleX;
        //     if(_scaleX == -1)
        //     {
        //         _shadow.txtPlayerName.x = _mc.width/2 + _shadow.txtPlayerName.width/2;
                
        //         //_shadow.cardLevel.x = _shadow.txtPlayerName.width-28;
        //     }
        //     else
        //     {
        //         _shadow.txtPlayerName.x = 0;
                
        //         //_shadow.cardLevel.x = 16;
        //     }
            
        //     if(_action == PlayerActionType.rebounds_noBall)
        //     {
        //         _shadow.doAction(PlayerActionType.getActionName(PlayerActionType.attack_rebounds) + _direction);
        //     }
        //     else
        //     {
        //         _shadow.doAction(_actionName + _direction);
        //     }
        // }
        
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
        
        // if(this._action == PlayerActionType.jump_ball)
        // {
        //     this._inJump = true;
        // }
        // else if(this._action == PlayerActionType.slam_dunk || this._action == PlayerActionType.shot || this._action == PlayerActionType.three_point)
        // {
        //     this._dunkStep = 0;
            
        //     this._filterStep = 0;
        //     this.removeChild(_mc);
        //     this._mc.filters = CoolEffect.playerFilter;
        //     this.addChild(this._mc);
        // }
        // else if(this._action == PlayerActionType.outside_ball)
        // {
        //     CountController.getInstance().removeNetFrame();
        // }
        // else if(this._action == -1 && this._actionName == "rebounds_")
        // {
        //     this._filterStep = 0;
        //     this.removeChild(_mc);
        //     _mc.filters = CoolEffect.playerFilter;
        //     this.addChild(_mc);
        // }
        // else if(this._action == PlayerActionType.take_ball)
        // {
        //     SoundManager.play(SoundConfig.COUNT_GET_BALL, 1, 0, 1);
        // }
        // else if(this._action == PlayerActionType.idle_pass || this._action == PlayerActionType.run_pass)
        // {
        //     SoundManager.play(SoundConfig.COUNT_PASS_BALL, 1, 0, 1);
        // }
        // else if(this._action == PlayerActionType.steal || this._action == PlayerActionType.intercept)
        // {
        //     var data:Object = {};
        //     data.steal = 1;
        //     data.cid = _info.cid;
        //     data.pid = _info.pid;
        //     data.side = _side;
            
        //     CountUiController.getInstance().updateSingleInfo(data);
        // }
        
        // if(this._skin == null)
        // {
        //     return;
        // }
        
        // //_skin.removeEventListener(Event.ENTER_FRAME, playerMove);
        // if(this._inActionFrame == false)
        // {
        //     this._inActionFrame = true;
        //     this._skin.addEventListener(Event.ENTER_FRAME, playerMove);
        // }
    }

    private processMcPos(mc):void
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
        
        // if(_action == PlayerActionType.rebounds_noBall || _action == PlayerActionType.defend_rebound)
        // {
        //     _head.gotoAndStop(PlayerActionType.getActionName(PlayerActionType.attack_rebounds) + _direction);
        // }
        // else
        // {
        //     _head.gotoAndStop(value);
        // }
        
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
//         if(this._skillId == -1)
//         {
//             this._skillId = skillId;
//         }
//         else
//         {
//             if(this._skillId == skillId)
//             {
//                 return;
//             }
//             else
//             {
//                 if(_skillMc &&　this.contains(_skillMc))
//                 {	
//                     this.removeChild(_skillMc);
                    
//                     _skillMc.removeEventListener(Event.ENTER_FRAME, modeFrame);
                    
//                     _skillMc.player.gotoAndStop(1);
                    
//                     _skillMc = null;
//                 }
                
//                 _skillId = skillId;
//             }
//         }
        
//         _skillStep = 0;
        
//         _mc.visible = false;
        
//         if(skillId >= 191 && _skillId <= 215)
//         {
//             _skillMc = MatchConfig.MatchResource[getSkill(skillId) + "_" + _showId];
//         }
//         else
//         {
//             _skillMc = MatchConfig.MatchResource[getSkill(skillId) + "_0"];
//         }
        
//         _remind = MatchConfig.MatchResource[ResourceType.skillRemid + "_" + _showId];
        
//         this.addChild(_remind);
        
//         _remind.x = -30;
//         _remind.y = -150;
        
//         _remind.moveMc.word.gotoAndStop(int((_skillId-1)/5)+1);
//         _remind.moveMc.lv.gotoAndStop((_skillId - 1)%5+1);
                
//         _direction = dir;
        
//         processDir();
        
//         processMcPos(_skillMc);
        
//         if(CountSkillType.getInstance().getModeResId(skillId) == "421281")
//         {
//             _skillMc.y = -130
//         }
        
//         this.addChild(_skillMc);
        
//         if(((_skillId >= 1 && _skillId <= 50) || (_skillId >= 81 && _skillId <= 85)) && CountSkillType.getInstance().getLast(_skillId) != 0)
//         {
//             //处理抢挡篮板
//             CountController.getInstance().pause2();
//         }
        
//         if(_skillId >= 51 && _skillId <= 75)
//         {
//             _moveMatch = true;
//         }
//         else if(_skillId >= 81 && _skillId <= 85)
//         {
//             CountController.getInstance()._inPause = true;
//         }
//         else if(_skillId >= 141 && _skillId <= 145)
//         {
//             _pauseMatch = true;
//             _skillNum = 0;
//             _skillTotal = 0;
//         }
//         else if(_skillId >= 146 && _skillId <= 150)
//         {
//             _pauseMatch = true;
//             _skillNum = 0;
//             _skillTotal = 0;
//             CountController.getInstance()._spePass = CountController.curve;
//         }
//         else if(_skillId >= 151 && _skillId <= 155)
//         {
//             _pauseMatch = true;
//             _skillNum = 0;
//             _skillTotal = 0;
//             CountController.getInstance()._spePass = CountController.ground;
//         }
//         else if(_skillId >= 156 && _skillId <= 165)
//         {
//             _pauseMatch = true;
//             _skillNum = 0;
//             _skillTotal = 0;
//         }
// //			else if(_skillId >= 166 && _skillId <= 190)
// //			{
// //				_skillNum = 0;
// //				_skillTotal = 1;
// //				_pauseMatch = true;
// //				CountController.getInstance().pause();
// //			}
//         else if((_skillId >= 191 && _skillId <= 205) || (_skillId >= 211))
//         {
//             _skillNum = 0;
//             _skillTotal = 0;
//             _pauseMatch = true;
//             CountController.getInstance().pause();
//         }
        
//         _skillMc.addEventListener(Event.ENTER_FRAME, modeFrame);
//         _remind.addEventListener(Event.ENTER_FRAME, remindModelFrame);
        
//         _skillMc.gotoAndStop("c" + _direction);
//         _skillMc.player.gotoAndPlay(1);
        
//         _remind.gotoAndPlay(1);
//         _remind.moveMc.gotoAndPlay(1);
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
        //SoundManager.play(SoundConfig.COUNT_SKILL, 1, 0, 1);
        
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
        
        //CountController.getInstance().pause();
        
        // var array:Array = MatchConfig.MatchResource[getSkill(_skillId)]
        
        // _skillMc = array[0];
        
        // CountController.getInstance()._inPause = true;
        
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
}
