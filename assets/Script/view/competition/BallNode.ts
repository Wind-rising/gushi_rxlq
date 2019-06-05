
/**
 * 场景中的篮球，在传球，投篮的情况下会显示，
 * 平时球员运球 将球与球员做在同一个动画里
 */
const {ccclass, property} = cc._decorator;

import MatchConfig from "../../config/MatchConfig";

@ccclass
export default class BallNode extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    private _show:boolean;
		
    private _start:cc.Vec2;
    
    private _point:cc.Vec2 = cc.Vec2.ZERO;
    
    private _res:Object;
    
    private BALL_OFFSET:number = 20;
    
    private _s:cc.Vec2;
    
    private _e:cc.Vec2;

    set show (value:boolean) {
        this.node.active = value;
    }

    // onLoad () {}

    start () {

    }

    // update (dt) {}

    public init () {
    }

    /**
     * 篮球的运动轨迹
     * passDir:表示开始的球员方向
     * getDir:表示得球球员的方向
     * startPos, endPos, round(开始位置，结束位置，总计回合数)
     */
    public passPos(passDir:number, getDir:number, startPos:cc.Vec2, endPos:cc.Vec2, round:number, fun:Function=null):void
    {	
        this._s = this.countPoint(passDir, startPos);
        
        this.node.x = this._s.x;
        this.node.y = this._s.y;
        
        this._e = this.countPoint(getDir, endPos);
        
        var dis:number;
        
        this.node.active = true;

        this.node.stopAllActions();
        this.node.runAction(cc.sequence(cc.moveTo(MatchConfig.Living * (round + 1),this._e),cc.callFunc(
            ()=>{
                if(fun == null)
                {
                    this.node.active = false;
                }
                else
                {
                    fun();
                }
            }
        )));
    }

    private countPoint(dir:number, point:cc.Vec2):cc.Vec2
    {
        switch(dir)
        {
            case 0:
                point.x += this.BALL_OFFSET;
                break;
            case 1:
                point.x += this.BALL_OFFSET;
                point.y += this.BALL_OFFSET;
                break;
            case 2:
                point.y += this.BALL_OFFSET;
                break;
            case 3:
                point.x -= this.BALL_OFFSET;
                point.y += this.BALL_OFFSET;
                break;
            case 4:
                point.x -= this.BALL_OFFSET;
                break
            case 5:
                point.x -= this.BALL_OFFSET;
                point.y -= this.BALL_OFFSET;
                break;
            case 6:
                point.y -= this.BALL_OFFSET;
                break;
            case 7:
                point.x += this.BALL_OFFSET;
                point.y -= this.BALL_OFFSET;
                break
            default:
                break;
        }
        
        return point;
    }

    setPosition (point:cc.Vec2){
        this.node.position = new cc.Vec2(point.x,cc.winSize.height-point.y);
    }
    runAction(action: cc.Action): cc.Action
    {
        return this.node.runAction(action);
    }
}
