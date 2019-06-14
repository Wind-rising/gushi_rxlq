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

/**
 * 解析战斗数据，将二进制文件转换成json结构
 */
var Zlib = require('zlib');
var Buffer = require('buffer').Buffer;
import ItemData from '../data/ItemData'
import Singleton from './Singleton';
import CountPlayerType from '../data/CountPlayerType';
import PlayerActionType from '../data/PlayerActionType';
import PlayerSideType from '../data/PlayerSideType';
import MatchConfig from '../config/MatchConfig';
import GridController from '../controllor/GridController';

@ccclass
export default class Trancelate extends Singleton {

    _curRound:0;
    _roundList:Array<any> = null;
    private Outside:number = 10;
    /**
     * 解析战斗数据
     * @param {ByteArray} data 
     * @param {function} callBack 
     */
    ConverData(byteArray:ArrayBuffer) 
    {	
        this._roundList = [];
        if(byteArray.byteLength <= 0)
        {
            console.log('战斗数据为空');
            return;
        }

        var compressArray = new jspb.BinaryDecoder(byteArray.slice(0,1));
        var dataArray = new jspb.BinaryDecoder(byteArray.slice(1,byteArray.byteLength));
        if(compressArray.readUint8() == 1)
        {
            byteArray = Zlib.inflateSync(new Buffer(byteArray.slice(1,byteArray.byteLength)));
            dataArray = new jspb.BinaryDecoder(byteArray);
        }
        else
        {
            cc.log('data not compressed');
        }
        

        var matchVo = {};

        var matchInfo = this.matchBasicInfo(dataArray);
        var homeManager = this.managerInfo(dataArray);
        var awayManager = this.managerInfo(dataArray);
        var roundTime = this.roundTime(dataArray);
        var roundInfo = this.roundDataInfo(dataArray);
        
        
        this.processMatchInfo(matchInfo, matchVo);
        
        this.processManagerInfo(homeManager, roundInfo, matchVo, PlayerSideType.Home);
        
        this.processManagerInfo(awayManager, roundInfo, matchVo, PlayerSideType.Away);
        
        this.processRoundInfo(roundTime, matchVo);
        
        this.processMatchRound(roundInfo, matchVo);
        
        //统计比赛
        var home = {};
        var away = {};
        var matchCount = {};
        matchCount['teamList'] = [];
        matchCount['teamList'].push(home);
        matchCount['teamList'].push(away);
        
        home['score'] = matchInfo['homeScore'];
        away['score'] = matchInfo['awayScore'];
        
        home['logoId'] = homeManager['logo'];
        home['name'] = homeManager['managerName'];
        home['managerId'] = homeManager['managerId'];
        
        away['logoId'] = awayManager['logo'];
        away['name'] = awayManager['managerName'];
        away['managerId'] = awayManager['managerId'];

        var array = this.countPlayer(homeManager, awayManager, roundInfo);
        
        matchCount['homeList'] = array[0];
        matchCount['awayList'] = array[1];
        matchCount['scoreList'] = array[2];
        
        var i;
        var mc = {};
        for(i=0;i<array[0].length;i++)
        {
            mc = matchCount['teamList'][0];
            mc['assistant'] += array[0][i].assistant;
            mc['block'] += array[0][i].block;
            mc['foul'] += array[0][i].foul;
            mc['foulShoot'] += array[0][i].foulShoot;
            mc['foulShootNum'] += array[0][i].foulShootNum;
            mc['miss'] += array[0][i].miss;
            mc['rebounds'] += array[0][i].rebounds;
            mc['shoot'] += array[0][i].shoot;
            mc['shootNum'] += array[0][i].shootNum;
            mc['takeOff'] += array[0][i].takeOff;
            mc['threeShoot'] += array[0][i].threeShoot;
            mc['threeShootNum'] += array[0][i].threeShootNum;
        }
        
        for(i=0;i<array[1].length;i++)
        {
            mc = matchCount['teamList'][1];
            mc['assistant'] += array[1][i].assistant;
            mc['block'] += array[1][i].block;
            mc['foul'] += array[1][i].foul;
            mc['foulShoot'] += array[1][i].foulShoot;
            mc['foulShootNum'] += array[1][i].foulShootNum;
            mc['miss'] += array[1][i].miss;
            mc['rebounds'] += array[1][i].rebounds;
            mc['shoot'] += array[1][i].shoot;
            mc['shootNum'] += array[1][i].shootNum;
            mc['takeOff'] += array[1][i].takeOff;
            mc['threeShoot'] += array[1][i].threeShoot;
            mc['threeShootNum'] += array[1][i].threeShootNum;
        }
        matchVo['matchCount'] = matchCount;

        return matchVo;
    };
    
    countPlayer(home:Object, away, round)
    {
        var i;
        
        var mi;
        
        var homeResult = [];
        
        for(i=0;i<home['players'].length;i++)
        {
            mi = {};
            
            mi.name = ItemData.getInstance().getPlayerInfo(home['players'][i].pid).ShowName;
            
            mi.managerId = home['players'][i].pid;
            
            mi.cardLevel = ItemData.getInstance().getPlayerInfo(home['players'][i].pid).CardLevel;
            
            mi.assistant = home['players'][i].assitant;
            
            homeResult.push(mi);
        }
        
        var awayResult = [];
        
        for(i=0;i<away.players.length;i++)
        {
            mi = {};
            
            mi.name = ItemData.getInstance().getPlayerInfo(away.players[i].pid).ShowName;
            
            mi.managerId = away.players[i].pid;
            
            mi.cardLevel = ItemData.getInstance().getPlayerInfo(away.players[i].pid).CardLevel;
            
            mi.assistant = away.players[i].assitant;
            
            awayResult.push(mi);
        }
        
        var scoreList = [];
        
        for(i=0;i<4;i++)
        {
            scoreList.push([0,0]);
        }
        
        var j = 0;
        
        for(i=0;i<round.length;i++)
        {
            if(round[i].interuption != 0)
            {
                j++;
            }
            
            if(round[i].type == CountPlayerType.none || round[i].type == CountPlayerType.passSuss)
            {
                continue;
            }

            switch(round[i].type)
            {
                case CountPlayerType.shoot:
                    if(round[i].shoot.isFoul != 0)
                    {
                        if(round[i].shoot.shootCid < 99)
                        {
                            awayResult[round[i].shoot.blockCid%100].foul++;
                        }
                        else
                        {
                            homeResult[round[i].shoot.blockCid%100].foul++;
                        }
                    }
                    
                    if(round[i].shoot.isBlock != 0 && round[i].shoot.isGoal == 0)
                    {
                        if(round[i].shoot.blockCid < 99)
                        {
                            homeResult[round[i].shoot.blockCid].block++;
                        }
                        else
                        {
                            awayResult[round[i].shoot.blockCid%100].block++;
                        }
                    }
                    
                    if(round[i].shoot.shootCid < 99)
                    {
                        if(home['players'][round[i].shoot.shootCid].match[round[i].round].state == PlayerActionType.shot)
                        {
                            homeResult[round[i].shoot.shootCid].shootNum++;
                        }
                        else
                        {
                            homeResult[round[i].shoot.shootCid].threeShootNum++;
                        }
                        
                        if(round[i].shoot.score == 2)
                        {
                            homeResult[round[i].shoot.shootCid].shoot++;
                            
                            homeResult[round[i].shoot.shootCid].score += 2;
                            
                            scoreList[j][0] += 2;
                        }
                        else if(round[i].shoot.score == 3)
                        {
                            homeResult[round[i].shoot.shootCid].threeShoot++;
                            
                            homeResult[round[i].shoot.shootCid].score += 3;
                            
                            scoreList[j][0] += 3;
                        }
                            
                    }
                    else
                    {
                        if(away.players[round[i].shoot.shootCid%100].match[round[i].round].state == PlayerActionType.shot)
                        {
                            awayResult[round[i].shoot.shootCid%100].shootNum++;
                        }
                        else
                        {
                            awayResult[round[i].shoot.shootCid%100].threeShootNum++;
                        }
                        
                        if(round[i].shoot.score == 2)
                        {
                            awayResult[round[i].shoot.shootCid%100].shoot++;
                            
                            awayResult[round[i].shoot.shootCid%100].score += 2;
                            
                            scoreList[j][1] += 2;
                        }
                        else if(round[i].shoot.score == 3)
                        {
                            awayResult[round[i].shoot.shootCid%100].threeShoot++;
                            
                            awayResult[round[i].shoot.shootCid%100].score += 3;
                            
                            scoreList[j][1] += 3;
                        }
                    }
                    break;
                case CountPlayerType.steal:
                    if(round[i].steal.getBallCid < 99)
                    {
                        homeResult[round[i].steal.getBallCid].miss ++;
                    }
                    else
                    {
                        awayResult[round[i].steal.getBallCid%100].miss ++;
                    }
                    
                    if(round[i].steal.stealCid < 99)
                    {
                        homeResult[round[i].steal.stealCid].takeOff ++;
                    }
                    else
                    {
                        awayResult[round[i].steal.stealCid%100].takeOff ++;
                    }
                    break;
                case CountPlayerType.rebound:
                    if(round[i].rebound.getBallCid < 99)
                    {
                        homeResult[round[i].rebound.getBallCid].rebounds ++;
                    }
                    else
                    {
                        awayResult[round[i].rebound.getBallCid%100].rebounds ++;
                    }
                    break;
                case CountPlayerType.slamDunk:
                    if(round[i].dunk.isFoul != 0)
                    {
                        if(round[i].dunk.blockCid < 99)
                        {
                            homeResult[round[i].dunk.blockCid%100].foul++;
                        }
                        else
                        {
                            awayResult[round[i].dunk.blockCid%100].foul++;
                        }
                    }
                    if(round[i].dunk.shootCid < 99)
                    {
                        homeResult[round[i].dunk.shootCid].shootNum ++;
                    }
                    else
                    {
                        awayResult[round[i].dunk.shootCid%100].shootNum ++;
                    }
                    
                    if(round[i].dunk.isGoal != 0)
                    {
                        if(round[i].dunk.shootCid < 99)
                        {
                            homeResult[round[i].dunk.shootCid].shoot ++;
                            
                            homeResult[round[i].dunk.shootCid].score += 2;
                            
                            scoreList[j][0] += 2;
                        }
                        else
                        {
                            awayResult[round[i].dunk.shootCid%100].shoot ++;
                            
                            awayResult[round[i].dunk.shootCid%100].score += 2;
                            
                            scoreList[j][1] += 2;
                        }
                    }
                    break;
                case CountPlayerType.foulShoot:
                    if(round[i].foul.shootCid < 99)
                    {
                        homeResult[round[i].foul.shootCid].foulShootNum ++;
                    }
                    else
                    {
                        awayResult[round[i].foul.shootCid%100].foulShootNum ++;
                    }
                    
                    if(round[i].foul.isGoal != 0)
                    {
                        if(round[i].foul.shootCid < 99)
                        {
                            homeResult[round[i].foul.shootCid].foulShoot ++;
                            homeResult[round[i].foul.shootCid].score ++;
                            
                            scoreList[j][0] += 1;
                        }
                        else
                        {
                            awayResult[round[i].foul.shootCid%100].foulShoot ++;
                            awayResult[round[i].foul.shootCid%100].score ++;
                            
                            scoreList[j][1] += 1;
                        }
                    }
                    break;
            }
        }
        
        return [homeResult, awayResult, scoreList];
    };

    countManager (obj, match)
    {
        match.managerId = obj.managerId;
        match.name = obj.managerName;
        match.logoId = obj.logo;
    }
    
    processMatchInfo(matchInfo, mv)
    {
        mv.awayScore = matchInfo.awayScore;
        mv.homeScore = matchInfo.homeScore;
        mv.mapId = matchInfo.mapId;
        mv.matchType = matchInfo.matchType;
        mv.singleRound = matchInfo.period;
        mv.totalRound = matchInfo.totalRound;
    };
    
    processManagerInfo(playerInfo, roundInfo, mv, side)
    {
        //填充玩家信息
        this.processPlayerRound(playerInfo, roundInfo, mv.totalRound);
        
        if(side == PlayerSideType.Home)
        {
            mv.enterHomePlayer = playerInfo.format;
            mv.homeLogo = playerInfo.logo;
            mv.homeCloth = playerInfo.cloth;
            mv.homeName = playerInfo.managerName;
            mv.homeManagerId = playerInfo.managerId;
            mv.homePlayerInfo = playerInfo.players;
            mv.homeCom = playerInfo.combo;
        }
        else
        {
            mv.enterAwayPlayer = playerInfo.format;
            mv.awayLogo = playerInfo.logo;
            mv.awayCloth = playerInfo.cloth;
            mv.awayName = playerInfo.managerName;
            mv.awayManagerId = playerInfo.managerId;
            mv.awayPlayerInfo = playerInfo.players;
            mv.awayCom = playerInfo.combo;
        }
        
        for(var obj in playerInfo.players)
        {
            if(obj['skillNum'] == 0)
            {
                continue;
            }
            
            for(var key in obj['skillRes'])
            {
                cc.log("回合：" + key + " 球星技能:" +  obj['skillRes'][key][0])
                    
                if(MatchConfig.MatchSkill[obj['skillRes'][key][0]] == null)
                {
                    MatchConfig.MatchSkill[obj['skillRes'][key][0]] = obj['skillRes'][key][1];
                }
            }
        }
    };
    
    processRoundInfo(roundInfo, mv)
    {
        mv.roundInfo = roundInfo;
    };
    
    processMatchRound (roundInfo, mv)
    {
        mv.matchInfo = {};
        for(var i=0;i<roundInfo.length;i++)
        {
            mv.matchInfo[roundInfo[i].round] = roundInfo[i];
        }
    };
    
    processPlayerRound (obj, round, total)
    {
        let _start;
        
        let _end;
        
        let totalRound = total;
        
        for(var i=0;i<4;i++)
        {
            if(i == 0)
            {
                _start = 0;
                _end = this._roundList[0];
            }
            else if(i == 3)
            {
                _start = this._roundList[i-1] + 1;
                _end = totalRound;
            }
            else
            {
                _start = this._roundList[i-1] + 1;
                _end = this._roundList[i];
            }
            
            this.processPlayer(_start, _end, i, obj);
        }
    };
    
    processPlayer (start, end, r, obj)
    {
        var player;
        
        var nextRound = -1;
        
        var p;
        
        for(var j=0;j<obj.format[r].length;j++)
        {
            player = obj.players[obj.format[r][j][0]];
            
            if(player.power == null)
            {
                player.power = new Array();
                
                player.power.length = 4;
            }
            
            player.power[r] = [obj.format[r][j][1],obj.format[r][j][2]];
            
            for(var i=start;i<=end;i++)
            {
                //用来统计赛场内球员得分
                player.score = 0;
                
                if(player.match[i] != null)
                {
                    nextRound = player.match[i].nextRound;
                    
                    if(player.match[i].state == PlayerActionType.attack_rebounds || player.match[i].state == PlayerActionType.defend_rebound)
                    {
                        player.match[i].state = PlayerActionType.rebounds_noBall;
                    }
                    
                    if(player.match[i].hasModel != 0)
                    {
                        //MatchConfig.MatchMessage += "回合: " + i + "模型：" + player.match[i].model + "";
                        
                        if(MatchConfig.MatchMode[player.match[i].model] == null)
                        {
                            MatchConfig.MatchMode[player.match[i].model] = true;
                        }
                    }
                    
                    continue;
                }
                
                player.match[i] = {};
                
                player.match[i].dir = player.match[i-1].dir;
                player.match[i].hasModel = player.match[i-1].hasModel;
                player.match[i].model = player.match[i-1].model;
                player.match[i].nameVisible = player.match[i-1].nameVisible;
                player.match[i].round = i;
                player.match[i].state = player.match[i-1].state;

                if(player.match[i].hasModel != 0)
                {
                    if(MatchConfig.MatchMode[player.match[i].model] == null)
                    {
                        MatchConfig.MatchMode[player.match[i].model] = true;
                    }
                }
                
                if(player.match[i].state == PlayerActionType.run || player.match[i].state == PlayerActionType.run_ball)
                {
                    if(nextRound <= 0)
                    {
                        p = new cc.Vec2(player.match[i-1].x, player.match[i-1].y);
                    }
                    else
                    {
                        p = this.fillPlayer(i, i-1, nextRound-1, new cc.Vec2(player.match[i-1].x, player.match[i-1].y), 
                            new cc.Vec2(player.match[nextRound].x, player.match[nextRound].y))
                    }
                }
                else
                {
                    p = new cc.Vec2(player.match[i-1].x, player.match[i-1].y);
                }
                
                player.match[i].x = p.x;
                player.match[i].y = p.y;
                player.match[i].playerPoint = GridController.getInstance().getScenePosition(new cc.Vec3(p.x, p.y));
                
                if(player.match[i].state == PlayerActionType.run)
                {
                    if(player.match[i].x == player.match[i-1].x && player.match[i].y == player.match[i-1].y)
                    {
                        player.match[i].state == PlayerActionType.attack_wait;
                    }
                }
            }
        }
    };
    
    fillPlayer(curR, startR, endR, startP, endP)
    {
        var total = endR - startR;
        
        var offSet = curR - startR;

        
        var x = startP.x + (endP.x - startP.x)*offSet/total;
        
        var y = startP.y + (endP.y - startP.y)*offSet/total;
        
        return new cc.Vec2(x, y);
    };
    
    matchBasicInfo(data)
    {
        var info = {};
        
        info['version'] = data.readUint8()
        info['matchType'] = data.readUint8();
        info['mapId'] = data.readUint8();
        info['homeScore'] = data.readUint8();
        info['awayScore'] = data.readUint8();
        
        info['period'] = this.readRound(data);
        info['totalRound'] = this.readRound(data);
        return info;
    };
    
    managerInfo(data)
    {
        var i;
        var j;
        
        var info = {};
                    
        info['managerId'] = this.readManagerId(data);
        info['managerName'] = this.readStr(data);
        info['cloth'] = data.readUint8();
        info['logo'] = data.readUint8();
        
        var formatNum = data.readUint8();
        //阵型信息
        info['format'] = [];
        for(i=0;i<formatNum;i++)
        {
            info['format'][i] = [];
            
            var playerIdNum = data.readUint8();
            
            for(j=0;j<playerIdNum;j++)
            {
                info['format'][i].push([data.readUint8(), data.readUint8(), data.readUint8()]);
                //表示球场上球员体力的起始值和结束值
            }
        }
        
        //需要处理组合和天赋
        var talentNum = data.readUint8();
        info['combo'] = [];
        for(i=0;i<talentNum;i++)
        {
            //组合
            var comNum = data.readUint8();
            
            if(comNum <= 0)
            {
                info['combo'][i] = null;
            }
            else
            {
                info['combo'][i] = [];
            }
            
            for(j=0;j<comNum;j++)
            {
                //0表示ID 1表示LV  (id从57-90,等级不需要显示)
                info['combo'][i].push(data.readUint8());
                data.readUint8();
            }
            
            //天赋
            var talNum = data.readUint8();
            info['talent'] = new Array();
            for(j=0;j<talNum;j++)
            {
                info['talent'].push(data.readUint8());
            }
        }
        
        var a;
        var b;
        var c;
        var d;
        
        var n;
        var m;
        var count;
        
        //经理技能
        info['managerSkillNum'] = this.readRound(data);
        
        if(info['managerSkillNum'] > 0)
        {
            if(info['managerSkillNum'] > 0)
            {
                info['manager'] = {};
                
                for(n=0;n<info['managerSkillNum'];n++)
                {
                    a = data.readUint8();
                    b = data.readUint8();
                    c = data.readUint8();
                    d = data.readUint8();
                    
                    info['managerSkillRound'] = (a & 0x0F) << 8 | b;
                    
                    count = c >> 4;
                    
                    info['managerSkillId'] = ((c << 28 >> 28)  & 0x0F) << 8 | d;
                    
                    info['manager'][info['skillRound']] = info['skillId'];
                    
                    info['managerTarget'] = [];
                    
                    for(m=0;m<count;m++)
                    {
                        info['managerTarget'].push(data.readUint8())
                    }
                    
                }
            }
        }
        
        
        //球员信息
        info['players'] = [];
        
        var playerNum = data.readUint8();
        for(i=0;i<playerNum;i++)
        {
            var playerInfo = {};
            
            playerInfo['pid'] = this.readPid(data);
            
            playerInfo['cid'] = data.readUint8();
            
            MatchConfig.PlayerInfo[playerInfo['cid']] = playerInfo['pid'];
            
            playerInfo['strengthen'] = data.readUint8();
            
            playerInfo['assitant'] = data.readUint8();

            playerInfo['match'] = {};
            
            let preRound = -1;
            
            var roundNum = this.readRound(data);
            for(var k=0;k<roundNum;k++)
            {
                this.readMatchInfo(playerInfo['match'],data);
                
                if(preRound == -1)
                {
                    preRound = this._curRound;
                }
                else
                {
                    playerInfo['match'][preRound].nextRound = this._curRound;
                    
                    preRound = this._curRound;
                }
            }
            
            //球员技能
            playerInfo['skillNum'] = this.readRound(data);
            
            if(playerInfo['skillNum'] == 0)
            {
                info['players'].push(playerInfo);
                
                continue;
            }
            
            playerInfo['skillRes'] = {};

            for(n=0;n<playerInfo['skillNum'];n++)
            {
                a = data.readUint8();
                b = data.readUint8();
                c = data.readUint8();
                d = data.readUint8();
                
                info['skillRound'] = (a & 0x0F) << 8 | b;
                
                info['targetNum'] = c >> 4;
                
                info['skillId'] = ((c << 28 >> 28)  & 0x0F) << 8 | d;
                
                info['target'] = [];
                
                cc.log(info['skillRound'], info['skillId'])
                
                for(m=0;m<info['targetNum'];m++)
                {
                    info['target'].push(data.readUint8())
                }
                
                playerInfo['skillRes'][info['skillRound']] = [info['skillId'], info['target']];

            }
            
            info['players'].push(playerInfo);
        }
        
        return info;
    };
    
    readMatchInfo(dic,data)
    {
        var info = {};
        
        var n = data.readUint8();
        
        info['nameVisible'] = n >> 7;
        
        info['hasModel'] = (n & 0x7F) >> 6;
        
        info['round'] = ((n & 0x0F) << 8) | data.readUint8();
        
        this._curRound = info['round'];
                    
        info['x'] = data.readUint8();
        info['y'] = data.readUint8();
                    
        if(info['x'] == 0)
        {
            info['x'] = -5;
        }
        else if(info['x'] == MatchConfig.GroundWidth)
        {
            info['x'] += 5;
        }
                    
        if(info['y'] == 0)
        {
            info['y'] -= 5;
        }
        else if(info['y'] == MatchConfig.GroundHeight)
        {
            info['y'] += 5;
        }
        
        info['playerPoint'] = GridController.getInstance().getScenePosition(new cc.Vec3(info['x'], info['y']));
        
        n = data.readUint8();
        info['dir'] = n >> 5 & 0x07;
        info['state'] = n & 0x1F;
        
        if(info['hasModel'] != 0)
        {
            info['model'] = this.readRound(data);
        }
        
        dic[info['round']] = info;
    };
    
    roundTime(data)
    {
        var time = this.readRound(data);
        
        var usedRound = {};
        
        for(var i=0;i<time;i++)
        {
            var round = {};
            
            var high = data.readUint8();
            
            var lowround = data.readUint8();
            
            var lowusedRound = data.readUint8();
            
            round['Round'] = (((high >> 4) & 0x0F) << 8) | lowround;
            
            round['UsedRound'] = ((high & 0x0F) << 8) | lowusedRound;
            
            usedRound[round['Round']] = round['UsedRound'];
        }
        
        return usedRound;
    };
    
    roundDataInfo(data)
    {
        var i;
        var info = [];
        
        var roundNum = this.readRound(data);
        
        for(i=0;i<roundNum;i++)
        {	
            var obj = {};
            
            info.push(this.readUint16Info(data,obj));
            
            if(i != 0)
            {
                if(info[i-1].endRound && obj['round'] < info[i-1].endRound)
                {
                    if(obj['endRound'])
                    {
                        obj['endRound'] = obj['endRound'] - obj['Round'] 
                    }
                    
                    obj['round'] = info[i-1].endRound + 1;
                    
                    if(obj['endRound'])
                    {
                        obj['endRound'] += obj['round'];
                    }
                }
                info[i-1].nextRound = obj['round'];
            }
        }
        
        return info;
    }
    
    readUint16Info (data,info)
    {
        var n = data.readUint8();
        
        //比赛类型
        info.type = n >> 4 & 0x0F;
        
        //比赛回合
        info.round = (n&0x0F) << 8 | data.readUint8();
        
        //info.round = this.readRound(data);
        
        n = data.readUint8();
        
        info.inUse = n << 31 >> 31 & 0x01;
        info.interuption = n << 30 >> 31 & 0x02;
        info.inBreak = n >> 2;
        
        if(info.interuption != 0)
        {
            this._roundList.push(info.round);
        }
        
        switch(info.type)
        {
            case CountPlayerType.none:
                break;
            case CountPlayerType.passSuss:
                info.pass = {};
                this.pass(info.pass,data);
                break;
            case CountPlayerType.passFail:
                info.passFaul = {};
                this.pass(info.passFaul,data);
                
                info.passFaul.stopX = data.readUint8();
                info.passFaul.stopY = data.readUint8();
                info.passFaul.stopFact = GridController.getInstance().getScenePosition(new cc.Vec3(info.passFaul.stopX, info.passFaul.stopY, MatchConfig.BALL_HEIGHT));
                info.passFaul.stopRound = this.readRound(data);
                break;
            case CountPlayerType.shoot:
                info.shoot = {};
                this.shoot(info.shoot,data)
                break;
            case CountPlayerType.slamDunk:
                info.dunk = {};
                this.shoot(info.dunk,data)
                break;
            case CountPlayerType.foulShoot:
                info.foul = {};
                this.foulShoot(info.foul,data);
                break;
            case CountPlayerType.reboundOutside:
                info.reboundOutside = {};
                this.reboundOutside(info.reboundOutside,data);
                break;
            case CountPlayerType.reboundFree:
                info.reboundFreeBall = {};
                this.reboundFreeBall(info.reboundFreeBall,data);
                break;
            case CountPlayerType.rebound:
                info.rebound = {};
                this.rebound(info.rebound,data)
                break;
            case CountPlayerType.blockOutside:
                info.blockOutside = {};
                this.blockOutside(info.blockOutside,data);
                break;
            case CountPlayerType.blockFree:
                info.blockFree = {};
                this.blockFree(info.blockFree,data);
                break;
            case CountPlayerType.steal:
                info.steal = {};
                this.steal(info.steal,data);
                break;
            case CountPlayerType.openBall:
                info.offSide = {};
                this.offSide(info.offSide,data);
                break;
        }
        
        return info;
    };

    /**
     * 坐标转换
     * @angle角度，需要转换成弧度
     */
    round (point, angle)
    {
        let pp = cc.v2();
        let ang = angle * Math.PI /180;
        
        pp.x = point.x * Math.cos(ang) - point.y * Math.sin(ang);
        pp.y = point.y * Math.cos(ang) + point.x * Math.sin(ang);
        
        return pp;
    };

    pass(obj,data)
    {
        //obj = {};
        //var n:int = readManayByte();
        
        obj.endRound = this.readRound(data);
        
        obj.passCid = data.readUint8();
        
        obj.getBallCid = data.readUint8();
        
        obj.startX = data.readUint8();
        
        obj.startY = data.readUint8();
        
        obj.startFact = GridController.getInstance().getScenePosition(new cc.Vec3(obj.startX, obj.startY, MatchConfig.BALL_HEIGHT));
        
        obj.endX = data.readUint8();
        
        obj.endY = data.readUint8();
        
        obj.endFact = GridController.getInstance().getScenePosition(new cc.Vec3(obj.endX, obj.endY, MatchConfig.BALL_HEIGHT));
    };
    
    /**
     * 投篮和灌篮用同一个数据结构
     */
    shoot(obj,data)
    {
        var n = data.readUint8();
        
        obj.shootSide = n >> 7;
        
        obj.isGoal = n << 25 >> 31 & 0x01;
        
        obj.isBlock = n << 26 >> 31 & 0x01;
        
        obj.isFoul = n << 27 >> 31 & 0x01;
        
        obj.score = n << 30 >> 30 & 0x03;
        
        //n = readManayByte();
        
        n = this.readRound(data);
        
        obj.targetId = n >> 12 & 0xf;
        obj.endRound = n << 20 >> 20 & 0xfff;
        
        //n = data.readUint8();
        
        obj.shootCid = data.readUint8();;
        
        obj.blockCid =  data.readUint8();
        
        obj.shootX = data.readUint8();
        
        obj.shootY = data.readUint8();
        
        obj.assitant = data.readUint8();
        
        obj.startFact = GridController.getInstance().getScenePosition(new cc.Vec3(obj.shootX, obj.shootY));
    };
    
    foulShoot (obj,data)
    {
        var n = data.readUint8();
        
        obj.shootSide = n >> 7;
        
        obj.isGoal = n << 25 >> 31;
        
        obj.originSide = n << 26 >> 31;
        
        obj.score = n << 30 >> 30;
        
        n = this.readRound(data);
        
        obj.targetId = n >> 12 & 0xf;
        obj.endRound = n << 20 >> 20 & 0xfff;
        
        obj.shootCid = data.readUint8();
        
        obj.shootX = data.readUint8();
        
        obj.shootY = data.readUint8();
        
        obj.startFact = GridController.getInstance().getScenePosition(new cc.Vec3(obj.shootX, obj.shootY));
    };
    
    reboundOutside (obj,data)
    {
        obj.endRound = this.readRound(data);
        
        obj.endX = data.readUint8();
        
        obj.endY = data.readUint8();
        
        obj.endFact = GridController.getInstance().getScenePosition(new cc.Vec3(obj.endX, obj.endY));
    };
    
    reboundFreeBall (obj,data)
    {
        obj.endRound = this.readRound(data);
        
        obj.endX = data.readUint8();
        
        obj.endY = data.readUint8();
        
        obj.endFact = GridController.getInstance().getScenePosition(new cc.Vec3(obj.endX, obj.endY));
        
        obj.getBallCid = data.readUint8();
        
        //n = readManayByte();
        
        obj.getBallRound = this.readRound(data);
        
        obj.getBallX = data.readUint8();
        
        obj.getBallY = data.readUint8();
        
        obj.getBallFact = GridController.getInstance().getScenePosition(new cc.Vec3(obj.getBallX, obj.getBallY));
    };
    
    rebound(obj,data)
    {
        obj.getBallCid = data.readUint8();
        
        obj.reboundEndRound = this.readRound(data);
        
        obj.targetX = data.readUint8();
        
        obj.targetY = data.readUint8();
        
        obj.endFact = GridController.getInstance().getScenePosition(new cc.Vec3(obj.targetX, obj.targetY));
    };
    
    blockFree (obj,data)
    {
        obj.startX = data.readUint8();
        
        obj.startY = data.readUint8();
        
        obj.startFact = GridController.getInstance().getScenePosition(new cc.Vec3(obj.startX, obj.startY));
        
        obj.endRound = this.readRound(data);
        
        obj.endX = data.readUint8();
        
        obj.endY = data.readUint8();
        
        obj.endFact = GridController.getInstance().getScenePosition(new cc.Vec3(obj.endX, obj.endY));
        
        var n = data.readUint8();
        
        obj.getBallCid = n >> 4;
        
        //n = readManayByte();
        
        obj.getBallRound = this.readRound(data);
        
        obj.getBallX = data.readUint8();
        
        obj.getBallY = data.readUint8();
        
        obj.getBallFact = GridController.getInstance().getScenePosition(new cc.Vec3(obj.getBallX, obj.getBallY));
    }
    
    blockOutside (obj,data)
    {
        obj.startX = data.readUint8();
        
        obj.startY = data.readUint8();
        
        obj.startFact = GridController.getInstance().getScenePosition(new cc.Vec3(obj.startX, obj.startY));
        
        obj.endRound = this.readRound(data);
        
        obj.endX = data.readUint8();
        
        obj.endY = data.readUint8();
        
        if(obj.endX == 0)
        {
            obj.endX = -this.Outside;
        }
        else if(obj.endX == MatchConfig.GroundWidth)
        {
            obj.endX += this.Outside;
        }
        
        if(obj.endY == 0)
        {
            obj.endY = -this.Outside;
        }
        else if(obj.endY == MatchConfig.GroundHeight)
        {
            obj.endY += this.Outside;
        }
        
        obj.endFact = GridController.getInstance().getScenePosition(new cc.Vec3(obj.endX, obj.endY));
    };
    
    steal(obj,data)
    {
        obj.endRound = this.readRound(data);
        
        obj.getBallCid = data.readUint8();
        
        obj.stealCid = data.readUint8();
        
        obj.targetX = data.readUint8();
        
        obj.targetY = data.readUint8();
        
        obj.endFact = GridController.getInstance().getScenePosition(new cc.Vec3(obj.targetX, obj.targetY));
        
        obj.stealX = data.readUint8();
        
        obj.stealY = data.readUint8();
        
        obj.stealFact = GridController.getInstance().getScenePosition(new cc.Vec3(obj.stealX, obj.stealY));
    }
    
    offSide (obj,data)
    {
        obj.endRound = this.readRound(data);
        
        obj.passCid = data.readUint8();
        
        obj.getBallCid = data.readUint8();
        
        obj.startX = data.readUint8();
        
        obj.startY = data.readUint8();
        
        obj.startFact = GridController.getInstance().getScenePosition(new cc.Vec3(obj.startX, obj.startY, MatchConfig.BALL_HEIGHT));
        
        obj.endX = data.readUint8();
        
        obj.endY = data.readUint8();
        
        obj.endFact = GridController.getInstance().getScenePosition(new cc.Vec3(obj.endX, obj.endY, MatchConfig.BALL_HEIGHT));
    }

    readRound(data)
    {
        var n1 = data.readUint8();
        var n2 = data.readUint8();
        
        return n1 << 8 | n2;
    }

    readManagerId (data)
    {
        var n1 = data.readUint8();
        var n2 = data.readUint8();
        var n3 = data.readUint8();
        var n4 = data.readUint8();
        var n5 = data.readUint8();
        var n6 = data.readUint8();
        var n7 = data.readUint8();
        var n8 = data.readUint8();

        var n = this.numToString2(n5) + this.numToString2(n4) + this.numToString2(n3) + this.numToString2(n2) + this.numToString2(n1);
        
        var index  = n.length - 1;
        
        var len = 0;
        
        for(var i=0;i<n.length;i++)
        {
            if(n.charAt(i) == "1")
            {
                len += Math.pow(2, index);
            }
            
            index--;
        }
        
        return len + "";
    }
    
    readPid(data)
    {
        return (data.readUint8() << 16 | data.readUint8() << 8 | data.readUint8()) + "";
    }

    readStr(data)
    {
        var n1 = data.readUint8();
        return data.readString(n1);
    };
    
    numToString2(num)
    {
        var tem = num.toString(2);
        
        var result = "";
        
        if(tem.length < 8)
        {
            for(var i=tem.length;i<8;i++)
            {
                result += "0";
            }
            
            result += tem;
        }
        else
        {
            result = tem;
        }
        
        return result;
    };
}
