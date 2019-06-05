import Events from "../../signal/Events";
import EventConst from "../../data/EventConst";
import CountController from "../../controllor/CountController";
import ManagerData from "../../data/ManagerData";
import PlayerSide from "../../data/type/PlayerSide";
import IconManager from "../../config/IconManager";
import Utils from "../../utils/Utils";
import MatchConfig from "../../config/MatchConfig";

/**
 * 战斗页面UI
 */
const {ccclass, property} = cc._decorator;

@ccclass
export default class CompetitionUI extends cc.Component {

    // @property(cc.Label)
    // label: cc.Label = null;
    /** 头像品质框，在编辑器中赋值 */
    @property([cc.SpriteFrame])
    colorFrame:cc.SpriteFrame[] = [];

    // LIFE-CYCLE CALLBACKS:
    /** 玩家姓名 */
    lbl_name_a:cc.Label = null;
    lbl_name_b:cc.Label = null;
    /** 比分 */
    lbl_score_a:cc.Label = null;
    lbl_score_b:cc.Label = null;
    /** 当前几节 */
    lbl_section:cc.Label = null;
    /** 比赛剩余时间 */
    lbl_time:cc.Label = null;
    /** 加载进度文本 */
    lbl_loading:cc.Label = null;

    /** 切换播放速度 */
    tgl_speedup:cc.Toggle = null;
    /** 跳过全场 */
    btn_end:cc.Button = null;
    /** 声音 */
    tgl_voice:cc.Toggle = null;
    /** 特效 */
    tgl_effect:cc.Toggle = null;

    /** 玩家头像列表 */
    _playerList:Object;
    leftPlayer:cc.Node[] = [];
    rightPlayer:cc.Node[] = [];

    /** 比赛总时间 */
    private _totalTime:number;

    /** 己方名字 */
    private _homeName:string;
	/** 对方名字 */
	private _awayName:string;
    /** 己方得分 */
    private _homeScore:number;
	/** 地方得分 */
	private _awayScore:number;

    /** 体力列表 */
    private _powerList:Object;

    /** 得分 */
    private _scoreList:Object;

    /** 动画播放速度 1 快速  2 慢速 默认快速播放*/
    private _speed:number = 1;

    /** 玩家数据 */
    private _homeDic:Array<Object>;
	private _awayDic:Array<Object>;

    onLoad () {
        this.node.setContentSize(cc.winSize)
        /** 顶部居中部分 */
        let top_center = this.node.getChildByName('top_center');
        this.lbl_name_a = top_center.getChildByName('lbl_name_a').getComponent(cc.Label);
        this.lbl_name_b = top_center.getChildByName('lbl_name_b').getComponent(cc.Label);
        this.lbl_score_a = top_center.getChildByName('lbl_score_a').getComponent(cc.Label);
        this.lbl_score_b = top_center.getChildByName('lbl_score_b').getComponent(cc.Label);
        this.lbl_section = top_center.getChildByName('lbl_section').getComponent(cc.Label);
        this.lbl_time = top_center.getChildByName('lbl_time').getComponent(cc.Label);
        this.lbl_loading = top_center.getChildByName('lbl_loading').getComponent(cc.Label);

        /** 左下部分UI */
        let left_bottom = this.node.getChildByName('left_bottom');
        this.tgl_speedup = left_bottom.getChildByName('tgl_speedup').getComponent(cc.Toggle);
        this.btn_end = left_bottom.getChildByName('btn_end').getComponent(cc.Button);
        this.tgl_voice = left_bottom.getChildByName('tgl_voice').getComponent(cc.Toggle);
        this.tgl_effect = left_bottom.getChildByName('tgl_effect').getComponent(cc.Toggle);

        this.leftPlayer.push(left_bottom.getChildByName('player_portrait1'));
        this.leftPlayer.push(left_bottom.getChildByName('player_portrait2'));
        this.leftPlayer.push(left_bottom.getChildByName('player_portrait3'));
        this.leftPlayer.push(left_bottom.getChildByName('player_portrait4'));
        this.leftPlayer.push(left_bottom.getChildByName('player_portrait5'));

        /** 右下UI */
        let right_bottom = this.node.getChildByName('right_bottom')
        this.rightPlayer.push(right_bottom.getChildByName('player_portrait1'));
        this.rightPlayer.push(right_bottom.getChildByName('player_portrait2'));
        this.rightPlayer.push(right_bottom.getChildByName('player_portrait3'));
        this.rightPlayer.push(right_bottom.getChildByName('player_portrait4'));
        this.rightPlayer.push(right_bottom.getChildByName('player_portrait5'));

        this.lbl_loading.node.active = false;

        this.lbl_name_a.string = '';
        this.lbl_name_b.string = '';
        this.lbl_score_a.string = '00';
        this.lbl_score_b.string = '00';
        this.lbl_section.string = '1st';
        this.lbl_time.string = '00';


        /** 播放速度切换 */
        let eventHandler = new cc.Component.EventHandler();
        eventHandler.target = this.node; 
        eventHandler.component = 'CompetitionUI';//这个是脚本文件名
        eventHandler.handler = 'skipStep'; //回调函名称
        this.tgl_speedup.checkEvents.push(eventHandler);
    }

    start () {
        this.init();

        /** 默认普通速度播放 */
        this.tgl_speedup.check();
        MatchConfig.Living = 0.2;
        MatchConfig.MoveLive = 0.4;
    }

    // update (dt) {}

    /**
     * 测试代码，直接删除好了
     */
    onBtnEnd (){
        this.node.parent.destroy();
        Events.getInstance().dispatch(EventConst.SHOW_MAIN);
    }

    //无用方法
    public skipStep(e:cc.Toggle):void
    {
        if(e.isChecked)
        {
            MatchConfig.Living = 0.1;
            
            MatchConfig.MoveLive = 0.2;
        }
        else
        {
            MatchConfig.Living = 0.2;
            
            MatchConfig.MoveLive = 0.4;
        }
    }

    /**
     * 初始化数据
     */
    private init() {
        this._totalTime = -1;
        this._homeScore = 0;
		this._awayScore = 0;
    }


    /**
     * 显示比赛结束动画 播放完动画执行回调
     * @param result Array
     * @param score Array
     * @param callback Function
     */
    public showEnd(result, score, callback:Function):void
    {
        this.node.runAction(cc.sequence(cc.delayTime(5),cc.callFunc(()=>{
            if(callback){
                callback();
            }
        })));
        // _endFun = callback;
        
        // _managerId = result;
        
        // _score = score;
        
        // if(Manager.getInstance().Mid == _managerId[0])
        // {
        //     if(score[0] > score[1])
        //     {
        //         _endPanel = MatchConfig.MatchResource[ResourceType.countWin];
                
        //         SoundManager.play(SoundConfig.COUNT_WIN, 1, 0, 1);
        //     }
        //     else
        //     {
        //         _endPanel = MatchConfig.MatchResource[ResourceType.countEnd];
                
        //         _endPanel.baby.gotoAndStop(1);
                
        //         SoundManager.play(SoundConfig.COUNT_LOSE, 1, 0, 1);
        //     }
        // }
        // else if(_managerId[1] == Manager.getInstance().Mid)
        // {
            
        //     if(score[1] > score[0])
        //     {
        //         _endPanel = MatchConfig.MatchResource[ResourceType.countWin];
                
        //         SoundManager.play(SoundConfig.COUNT_WIN, 1, 0, 1);
        //     }
        //     else
        //     {
        //         _endPanel = MatchConfig.MatchResource[ResourceType.countEnd];
                
        //         _endPanel.baby.gotoAndStop(1);
                
        //         SoundManager.play(SoundConfig.COUNT_LOSE, 1, 0, 1);
        //     }
        // }
        // else
        // {
        //     _endPanel = MatchConfig.MatchResource[ResourceType.countEnd];
            
        //     _endPanel.result.visible = false;
        //     _endPanel.baby.gotoAndStop(1);
        // }
        
        // _main.addChild(_endPanel);
        
        // _endPanel.x = (_main.stage.stageWidth - _endPanel.width)/2 - LayerManager.delX/2;
        // _endPanel.y = (_main.stage.stageHeight - _endPanel.height)/2 - LayerManager.delY/2;
        
        // _endPanel.addEventListener(Event.ENTER_FRAME, endFun);
        // _endPanel.gotoAndPlay(1);
    }

    /**
     * 更新比赛时间
     * step:表示回合
     * 整个比赛的时间
     */
    public updateTime(value:Object, round:number, useTime:number):void
    {	
        if(this._totalTime == -1)
        {
            this._totalTime = useTime;
        }
        
        var useT:number;
        if(value[round])
        {
            useT = value[round]%= useTime;
        }
        else
        {
            return;
        }
            
        var t:number = 12*60 - 12*60 * useT /this._totalTime;
        
        if(ManagerData.getInstance().Level >= 20 && t == 6*60)
        {
            this.btn_end.enabled = false;
        }
        
        //每一分钟更新所有球员的体力值
        if(12*60*useT/this._totalTime%60 == 0)
        {
            this.updatePower(Math.floor(t/60));
        }
    
        this.lbl_time.string = this.tranTime(t);
    }

    private updatePower(min:number):void
    {
        for(var key in this._powerList)
        {
            if((this._powerList[key][0] - this._powerList[key][1]) == 0)
            {
                continue;
            }

            let percent = this.countPower(this._powerList[key][0] - (this._powerList[key][0] - this._powerList[key][1]) * (12 - min) / 12)

            //这是一个很难理解的公式
            this._playerList[key].getChildByName('prg_spirit').getComponent(cc.ProgressBar).percent = percent;
        }
    }

    /**
     * 添加球员信息
     * 主客队的球员列表
     */
    public ListInfo(home:Array<Object>, away:Array<Object>, dic:Object):void
    {
        if(this._playerList == null)
        {
            this._playerList = {};
        }
        
        if(this._powerList == null)
        {
            this._powerList = {};
        }
        
        this._homeDic = home;
        this._awayDic = away;
        
        this._scoreList = dic;
        
        this.updateInfo(this.leftPlayer, home, PlayerSide.Home);
        this.updateInfo(this.rightPlayer, away, PlayerSide.Away);
    }

    private updateInfo(player:Array<cc.Node>,list:Array<Object>, side:number):void
    {
        for(let i=0;i<player.length;i++)
        {
            let tem = player[i];

            this.playerLogo75(list[i][1].HeadStyle, tem.getChildByName('img_portrait').getComponent(cc.Sprite));
            tem.getChildByName('img_bg').getComponent(cc.Sprite).spriteFrame = this.colorFrame[parseInt(list[i][1].CardLevel)]
            tem.getChildByName('lbl_spirit').getComponent(cc.Label).string = this._scoreList[list[i][0].cid][0];
            tem.getChildByName('prg_spirit').getComponent(cc.ProgressBar).progress = this.countPower(list[i][0].power[list[i][2]][0]);
            
            this._playerList[list[i][0].pid + "_" + side] = tem;
            
            //[0]表示最大值，[1]表示最小值
            this._powerList[list[i][0].pid + "_" + side] = [list[i][0].power[list[i][2]][0], list[i][0].power[list[i][2]][1]]
        }
    }

    private playerLogo75(headStyle:String, mc:cc.Sprite):void
    {
        var url:string = IconManager.preURL+IconManager.PLAYER_PER+headStyle;
        cc.loader.loadRes(url,cc.SpriteFrame,(err,spriteframe)=>{
            if(err){
                Utils.fadeErrorInfo(err.message);
                return;
            }
            mc.spriteFrame = spriteframe;
        });
    }
    
    private playerLogo(headStyle:String, mc:cc.Sprite):void
    {
        var url:string = IconManager.preURL+IconManager.PLAYER_ICON+headStyle;
        cc.loader.loadRes(url,cc.SpriteFrame,(err,spriteframe)=>{
            if(err){
                Utils.fadeErrorInfo(err.message);
                return;
            }
            mc.spriteFrame = spriteframe;
        });
    }

    private countPower(value:number):number
    {
        return (Math.floor(25 * value/100));
    }
    
    private tranTime(sec:number):string
    {
        var result:string;
        
        if(Math.floor(sec/60) < 10)
        {
            result = "0" + Math.floor(sec/60);
        }
        else
        {
            result = Math.floor(sec/60) + "";
        }
        
        result += ":";
        
        if(Math.floor(sec%60) < 10)
        {
            result += "0" + Math.floor(sec%60);
        }
        else
        {
            result += Math.floor(sec%60);
        }
        
        return result;
    }

    //显示犯规动画
    public showFoul(callback:Function):void
    {
        this.node.runAction(cc.sequence(cc.delayTime(5),cc.callFunc(
            ()=>{
                if(callback){
                    callback();
                }
            }
        )))
        // if(_foulPanel == null)
        // {
        //     _foulPanel = MatchConfig.MatchResource[ResourceType.foul];
        // }
        
        // _main.addChild(_foulPanel);
        
        // _foulFun = callback;
        
        // _foulPanel.x = (_main.stage.stageWidth - _foulPanel.width)/2 - LayerManager.delX/2;
        // _foulPanel.y = (_main.stage.stageHeight - _foulPanel.height)/2 - LayerManager.delY/2;
        
        // _foulPanel.addEventListener(Event.ENTER_FRAME, foulEnd);
        // _foulPanel.gotoAndPlay(1);
    }

    /**
     * 单节结束动画
     */
    public oneQuater(step:number, callback:Function):void
    {
        this.node.runAction(cc.sequence(cc.delayTime(5),cc.callFunc(()=>{
            this.lbl_section.string = step+'st';
            this.lbl_time.string = '12:00';
            if(callback){
                callback();
            }
        })));
        // if(_qualterPanel == null)
        // {
        //     _qualterPanel = MatchConfig.MatchResource[ResourceType.countMid];
        // }
        
        // if(step == 1)
        // {
        //     XUtil.disableDisplayObject(_skipBtn, false);
        // }
        
        // _qualter = step;
        // _qualterFun = callback;
        
        // _totalTime = -1;
        
        // _main.addChild(_qualterPanel);
        
        // _qualterPanel.x = (_main.stage.stageWidth - _qualterPanel.width)/2 - LayerManager.delX/2;
        // _qualterPanel.y = (_main.stage.stageHeight - _qualterPanel.height)/2 + 120 - LayerManager.delY/2;
        // _qualterPanel.addEventListener(Event.ENTER_FRAME, qualterComplete);
        
        // _qualterPanel.gotoAndPlay(1);;
    }

    /**
     * 更新单个球员的信息
     * data.shoot
     * data.shootNum
     * data.ass
     * data.rebound
     * data.pid
     * data.side
     */
    public updateSingleInfo(data:Object):void
    {
        if(data)
        {
            if(data['shootNum'])
            {
                if(data['shootCid'] < 100)
                {
                    data['side'] = PlayerSide.Home;
                }
                else
                {
                    data['side'] = PlayerSide.Away;
                }
                
                // let str = this._playerList[data['pid'] + "_" + data['side']].tips.mc.txtShoot.text.split("/");
                //this._playerList[data['pid'] + "_" + data['side']].tips.mc.txtShoot.text = (data['shoot'] + parseInt(str[0])) + "/" + (data['shootNum'] + parseInt(str[1]));
                    
                this._scoreList[data['shootCid']][1] += data['shoot'];
                
                this._scoreList[data['shootCid']][2] += data['shootNum'];
            }
            
            if(data['shoot'] != 0 && data['ass'])
            {
                this._scoreList[data['ass']][3] ++;
                //this._playerList[data['assPid'] + "_" + data['side']].tips.mc.txtAssitant.text = this._scoreList[data['ass']][3];
                // let lbl_score = this._playerList[data['pid'] + "_" + data['side']].getChildByName('lbl_score').getComponent(cc.Label);
                // lbl_score.string = this._scoreList[data['ass']][3];
            }
            
            if(data['rebound'])
            {
                this._scoreList[data['cid']][4] ++;
                if(data['cid'] >= 100)
                {
                    data['side'] = PlayerSide.Away;
                }
                else
                {
                    data['side'] = PlayerSide.Home;
                }
                //this._playerList[data['pid'] + "_" + data['side']].tips.mc.txtRebound.text = this._scoreList[data['cid']][4];
            }
            
            if(data['steal'])
            {
                this._scoreList[data['cid']][5] ++;
                //this._playerList[data['pid'] + "_" + data['side']].tips.mc.txtSteal.text = this._scoreList[data['cid']][5];
            }
        }
    }

    //显示比分
    public showScore(pid:string, obj:Object):void
    {
        //SoundManager.play(SoundConfig.COUNT_GOAL, 1, 0, 1);
        
        var side:number;
        if(obj['shootCid'] < 100)
        {
            side = PlayerSide.Home;
        }
        else
        {
            side = PlayerSide.Away;
        }
        
        this._scoreList[obj['shootCid']][0] += obj['score'];

        let lbl_score = this._playerList[pid + "_" + side].getChildByName('lbl_score').getComponent(cc.Label);
        lbl_score.string = this._scoreList[obj['shootCid']][0];
        
        // this._playerList[pid + "_" + side].shine.gotoAndPlay(1);
        
        // this._playerList[pid + "_" + side].score.addEventListener(Event.ENTER_FRAME, scoreMove);
        
        // this._playerList[pid + "_" + side].score.gotoAndPlay(1);
        
        // this._playerList[pid + "_" + side].score.mc.mcScore.gotoAndStop(obj['score']);
        
        // this._playerList[pid + "_" + side].stren.text = parseInt(this._playerList[pid + "_" + side].stren.text) + obj['score'];
    }

    //更新球场信息
    public updateScore(home:number,away:number):void
    {
        this._homeScore += home;
        this._awayScore += away;
        
        this.lbl_score_a.string = this._homeScore+'';
        this.lbl_score_b.string = this._awayScore+'';
    }

    /**
     * 比赛时间
     *
     */
    public showTime(home:string, away:string, homeLogo:string, awayLogo:string):void
    {
        this.init();
        
        this.lbl_name_a.string = home;
        this.lbl_name_b.string = away;
        
        
        this._homeName = home;
        this._awayName = away;
        
        
        // if(homeLogo == "")
        // {
        //     this.createLogo(1, _infoPanel.homeLogo);
        // }
        // else
        // {
        //     this.createLogo(int(homeLogo), _infoPanel.homeLogo);
        // }
        
        // _infoPanel.homeLogo.goal.gotoAndStop(1);
        
        // _homeLogo = int(homeLogo);
        
        // if(awayLogo == "")
        // {
        //     createLogo(22, _infoPanel.awayLogo);
        // }
        // else
        // {
        //     createLogo(int(awayLogo), _infoPanel.awayLogo);
        // }
        
        // _infoPanel.awayLogo.goal.gotoAndStop(1);
        
        // _awayLogo = int(awayLogo);
        
        this.updateScore(0, 0);
        
        this.lbl_time.string = "12:00";
        
    }

    //显示播报信息
    public showMessage(XPid:string, YPid:string=""):void
    {
        // var playerX:String = ItemData.getPlayerHtmlName(XPid);
        
        // var mes:String;
        
        // switch(_messagetype)
        // {
        //     case CountMessageType.noSkillShootGoal:
                
        //         mes = BroadCastConfig.noSkillShootGoal[MatchConfig.MatchAnalize%BroadCastConfig.noSkillShootGoal.length]
                
        //         break;
        //     case CountMessageType.skillShootGoal:
                
        //         mes = BroadCastConfig.skillShootGoal[MatchConfig.MatchAnalize%BroadCastConfig.skillShootGoal.length];
                
        //         mes = mes.replace(patZ, _messageSkill);
                
        //         break;
        //     case CountMessageType.noSkillShootNoGoal:
                
        //         mes = BroadCastConfig.noSkillShootNoGoal[MatchConfig.MatchAnalize%BroadCastConfig.noSkillShootNoGoal.length];
                
        //         break;
        //     case CountMessageType.skillShootNoGoal:
                
        //         mes = BroadCastConfig.skillShootNoGoal[MatchConfig.MatchAnalize%BroadCastConfig.skillShootNoGoal.length];
                
        //         mes = mes.replace(patZ, _messageSkill);
                
        //         break;
        //     case CountMessageType.noSkillThreeGoal:
                
        //         mes = BroadCastConfig.noSkillThreeGoal[MatchConfig.MatchAnalize%BroadCastConfig.noSkillThreeGoal.length];
                
        //         break;
        //     case CountMessageType.skillThreeGoal:
                
        //         mes = BroadCastConfig.skillThreeGoal[MatchConfig.MatchAnalize%BroadCastConfig.skillThreeGoal.length];
                
        //         mes = mes.replace(patZ, _messageSkill);
                
        //         break;
        //     case CountMessageType.noSkillThreeNoGoal:
                
        //         mes = BroadCastConfig.noSkillThreeNoGoal[MatchConfig.MatchAnalize%BroadCastConfig.noSkillThreeNoGoal.length];
                
        //         break;
        //     case CountMessageType.skillThreeNoGoal:
                
        //         mes = BroadCastConfig.skillThreeNoGoal[MatchConfig.MatchAnalize%BroadCastConfig.skillThreeNoGoal.length];
                
        //         mes = mes.replace(patZ, _messageSkill);
                
        //         break;
        //     case CountMessageType.noSkillSlamdunk:
                
        //         mes = BroadCastConfig.noSkillSlam[MatchConfig.MatchAnalize%BroadCastConfig.noSkillSlam.length];
                
        //         break;
        //     case CountMessageType.skillSlamdunk:
                
        //         mes = BroadCastConfig.skillSlam[MatchConfig.MatchAnalize%BroadCastConfig.skillSlam.length];
                
        //         mes = mes.replace(patZ, _messageSkill);
                
        //         break;
        //     case CountMessageType.noSkillNoDunk:
                
        //         mes = BroadCastConfig.noSkillNoSlam[MatchConfig.MatchAnalize%BroadCastConfig.noSkillNoSlam.length];
                
        //         break;
        //     case CountMessageType.skillNoDunk:
                
        //         mes = BroadCastConfig.skillNoSlam[MatchConfig.MatchAnalize%BroadCastConfig.skillNoSlam.length];
                
        //         mes = mes.replace(patZ, _messageSkill);
                
        //         break;
        //     case CountMessageType.rebound:
                
        //         mes = BroadCastConfig.rebound[MatchConfig.MatchAnalize%BroadCastConfig.rebound.length];
                
        //         break;
        // }
        
        // mes = mes.replace(patX, playerX);
        
        // mes = rebuildMessage(mes);
        
        // MatchConfig.MatchAnalize++;
        
        // _cast.updateMessage(mes);
    }
    
}
