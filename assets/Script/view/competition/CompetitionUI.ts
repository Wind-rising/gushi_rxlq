import Events from "../../signal/Events";
import EventConst from "../../data/EventConst";
import CountController from "../../controllor/CountController";

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
export default class CompetitionUI extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.setContentSize(cc.winSize)
    }

    start () {

    }

    // update (dt) {}

    /**
     * 测试代码，直接删除好了
     */
    onBtnEnd (){
        this.node.parent.destroy();
        Events.getInstance().dispatch(EventConst.SHOW_MAIN);
    }


    /**
     * 显示比赛结束动画
     * @param result Array
     * @param score Array
     * @param callback Function
     */
    public showEnd(result, score, callback:Function):void
    {
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
        // if(_totalTime == -1)
        // {
        //     _totalTime = useTime;
        // }
        
        // var useT:int;
        // if(value[round])
        // {
        //     useT = value[round]%= useTime;
        // }
        // else
        // {
        //     return;
        // }
            
        // var t:int = 12*60 - 12*60 * useT /_totalTime;
        
        // if(Manager.getInstance().Level >= 20 && t == 6*60)
        // {
        //     XUtil.disableDisplayObject(_skipQualterBtn, false);
        // }
        
        // //每一分钟更新所有球员的体力值
        // if(12*60*useT/_totalTime%60 == 0)
        // {
        //     updatePower(int(t/60));
        // }
    
        // _infoPanel.matchTime.text = tranTime(t);
    }

    //显示犯规动画
    public showFoul(callback:Function):void
    {
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
        // if(data)
        // {
        //     if(data.shootNum)
        //     {
        //         if(data.shootCid < 100)
        //         {
        //             data.side = PlayerSide.Home;
        //         }
        //         else
        //         {
        //             data.side = PlayerSide.Away;
        //         }
        //         var str:Array = _playerList[data.pid + "_" + data.side].tips.mc.txtShoot.text.split("/");
        //         _playerList[data.pid + "_" + data.side].tips.mc.txtShoot.text = (data.shoot + int(str[0])) + "/" + (data.shootNum + int(str[1]));
            
        //         _scoreList[data.shootCid][1] += data.shoot;
                
        //         _scoreList[data.shootCid][2] += data.shootNum;
        //     }
            
        //     if(data.shoot != 0 && data.ass)
        //     {
        //         _scoreList[data.ass][3] ++;
        //         _playerList[data.assPid + "_" + data.side].tips.mc.txtAssitant.text = _scoreList[data.ass][3];
        //     }
            
        //     if(data.rebound)
        //     {
        //         _scoreList[data.cid][4] ++;
        //         if(data.cid >= 100)
        //         {
        //             data.side = PlayerSide.Away;
        //         }
        //         else
        //         {
        //             data.side = PlayerSide.Home;
        //         }
        //         _playerList[data.pid + "_" + data.side].tips.mc.txtRebound.text = _scoreList[data.cid][4];
        //     }
            
        //     if(data.steal)
        //     {
        //         _scoreList[data.cid][5] ++;
        //         _playerList[data.pid + "_" + data.side].tips.mc.txtSteal.text = _scoreList[data.cid][5];
        //     }
        // }
    }

    //显示比分
    public showScore(pid:string, obj:Object):void
    {
        // SoundManager.play(SoundConfig.COUNT_GOAL, 1, 0, 1);
        
        // var side:int;
        // if(obj.shootCid < 100)
        // {
        //     side = PlayerSide.Home;
        // }
        // else
        // {
        //     side = PlayerSide.Away;
        // }
        
        // _scoreList[obj.shootCid][0] += obj.score;
        
        // _playerList[pid + "_" + side].shine.gotoAndPlay(1);
        
        // _playerList[pid + "_" + side].score.addEventListener(Event.ENTER_FRAME, scoreMove);
        
        // _playerList[pid + "_" + side].score.gotoAndPlay(1);
        
        // _playerList[pid + "_" + side].score.mc.mcScore.gotoAndStop(obj.score);
        
        // _playerList[pid + "_" + side].stren.text = int(_playerList[pid + "_" + side].stren.text) + obj.score;
    }

    //更新球场信息
    public updateScore(home:number,away:number):void
    {
        // _homeScore += home;
        // _awayScore += away;
        
        // if(home == 0 && away == 0)
        // {
        //     return;
        // }
        
        // if(home > 0)
        // {
        //     _scoreShine = _infoPanel.homeLogo.goal;
        // }
        // else
        // {
        //     _scoreShine = _infoPanel.awayLogo.goal;
        // }
        
        // _scoreShine.addEventListener(Event.ENTER_FRAME, goalShow);
        // _scoreShine.gotoAndPlay(1);
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
