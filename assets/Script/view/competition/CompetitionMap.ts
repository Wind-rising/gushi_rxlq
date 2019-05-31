

const {ccclass, property} = cc._decorator;
import Utils from "../../utils/Utils";
import CountController from "../../controllor/CountController";
import URLConfig from "../../config/URLConfig";
import UIConfig from "../../config/UIConfig";
import PlayerNode from "./PlayerNode";
import BallNode from "./BallNode";
import PlayerSide from "../../data/type/PlayerSide";
import PlayerActionType from "../../data/PlayerActionType";
import XUtil from "../../utils/XUtil";
import GridController from "../../controllor/GridController";
import MatchConfig from "../../config/MatchConfig";
@ccclass
export default class CompetitionMap extends cc.Component {

    /** 背景图 */
    @property(cc.Sprite)
    private mapBg:cc.Sprite = null;

    /** 镜头左右移动的最大距离 */
    private _limit:number = 500;
    private _mapPosY:number = 0;
    private _mapPosX:number = 0;

    private _midPos:cc.Vec2;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this._midPos = GridController.getInstance().getScenePosition(new cc.Vec3(MatchConfig.GroundWidth/2, MatchConfig.GroundHeight/2));

        //需要先预加载，然后再进来直接显示出来
        cc.loader.loadRes('image/map/map_1',cc.SpriteFrame,(err,spriteFrame)=>{
            if(err){
                Utils.fadeErrorInfo(err.message);
                return;
            }
            this.mapBg.spriteFrame = spriteFrame;
        });
    }

    onDestroy () {

    }

    start () {

    }

    // update (dt) {}

    public speMove(round:number, playerList:Array<PlayerNode>):void
    {
        this.node.stopAllActions();
        let tag:boolean = false;
        
        let step:number = round + 1;
        
        let p:PlayerNode;
        
        while(true)
        {
            let player:PlayerNode = null;
            for(let i = 0; i < playerList.length; i++)
            {
                player = playerList[i];
                if(player.info['match'][step].state == PlayerActionType.outside_ball)
                {
                    tag = true;
                    
                    p = player;
                    
                    break;
                }
            }
            
            if(tag == true)
            {
                break;
            }
            else
            {
                step++;
                if(player.info['match'].length == step)
                {
                    break;
                }
            }
        }
        
        if(p && p.info['match'][step].x < 0)
        {
            this.node.runAction(cc.moveTo(1,this._mapPosX+this._limit,this._mapPosY));
        }
        else
        {
            this.node.runAction(cc.moveTo(1,this._mapPosX-this._limit,this._mapPosY));
        }
    }

    public moveToSeeBall(side:number):void
    {
        this.node.stopAllActions();
        
        if(side == PlayerSide.Home)
        {
            this.node.runAction(cc.moveTo(1,this._mapPosX-this._limit,this._mapPosY));
        }
        else
        {
            this.node.runAction(cc.moveTo(1,this._mapPosX+this._limit,this._mapPosY));
        }
    }

    public move(round:number, playerList:Array<PlayerNode>):void
    {
        this.node.stopAllActions();
        
        var pos:cc.Vec2;
        
        var prePos:cc.Vec2;
        
        for(let i = 0;i<playerList.length;i++)
        {
            let player = playerList[i];
            if(player.info['match'][round] == null)
            {
                continue;
            }
            
            if(player.info['match'][round].state == PlayerActionType.run_ball)
            {
                pos = player.info['match'][round].playerPoint;
                
                if(round == 0)
                {
                    prePos = this._midPos;
                }
                else
                {
                    prePos = player.info['match'][round-1].playerPoint
                }
                
                break;
            }
            else
            {
                if(player.info['match'][round].playerPoint.x < this._midPos.x)
                {
                    this.node.runAction(cc.moveTo(1,this._mapPosX+this._limit,this._mapPosY));
                    
                }
                else
                {
                    this.node.runAction(cc.moveTo(1,this._mapPosX-this._limit,this._mapPosY));
                }
                
                return;
            }
        }
        
        if(pos != null)
        {
            var dis:number = pos.x - prePos.x;
            
            var dis1:number = this.node.x - dis;

            if(pos.x < this._midPos.x - 300)
            {
                this.node.runAction(cc.moveTo(1,this._mapPosX+this._limit,this._mapPosY));
            }
            else if(pos.x > this._midPos.x + 300)
            {
                this.node.runAction(cc.moveTo(1,this._mapPosX-this._limit,this._mapPosY));
            }
            else
            {
                this.node.runAction(cc.moveTo(0.3,this._mapPosX+dis1,this._mapPosY));
            }
        }
    }
}
