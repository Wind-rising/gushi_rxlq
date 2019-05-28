import MatchConfig from "../../config/MatchConfig";
import GridController from "../../controllor/GridController";

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
export default class CustomCurving extends cc.Component {

    private _startPoint:cc.Vec2;
    
    private _endPoint:cc.Vec2;
    
    private _min:cc.Vec2;
    
    private _ballPoint:cc.Vec2;
    
    /**
     * 每一帧运行的角度
     */
    private _totalRound:number;
    
    private _perAngle:number;
    
    private _angle:number;
    
    private _vx:number;
    
    private _vy:number;
    
    private _vz:number;
    
    private _dis:number;
    
    private _callBack:Function;
    
    private _angleLimit:number;
    
    private _total:number;
    
    private _isBall:boolean;

    private _high:boolean;

    private _active:boolean = false;
    
    // public curveMore( start:cc.Vec2, end:cc.Vec2, round:number, fun:Function):void
    // {
    //     this._vx = (end.x - start.x)/round/(cc.game.getFrameRate() * MatchConfig.Living);
    //     this._vy = (end.y - start.y)/round/(cc.game.getFrameRate() * MatchConfig.Living);
        
    //     this._angle = 0;
        
    //     this._angleLimit = 30;
        
    //     var t1:number= MatchConfig.Living * round;
        
    //     this.schedule(()=>{
    //         this._angle += 1;
                    
    //         if(2 * this._angle * this._angle > this._angleLimit)
    //         {
    //             this._vz = this._angleLimit;
    //         }
    //         else
    //         {
    //             this._vz = 2 * this._angle * this._angle
    //         }
            
            
    //         start.x += this._vx;
    //         start.y += this._vy + this._vz;
            
    //         this.node.setPosition(start);
            
    //         if(this._vz == this._angleLimit)
    //         {
    //             this.node.runAction(cc.sequence(cc.moveTo(t1,end),cc.callFunc(function(){
    //                 if(fun != null)
    //                 {
    //                     fun();
    //                 }
    //             })));
    //         }
    //     })
    // }
    
    public curveTo(start:cc.Vec2, end:cc.Vec2, totalRound:number, isBall:boolean, isShoot:boolean, callback:Function, high:boolean=false):void
    {
        this._startPoint = this._ballPoint = start;
        
        this._endPoint = end;
        
        
        this._total = totalRound;
        
        this._callBack = callback;
        
        this._high = high;
        
        this._angle = 0;

        this._isBall = isBall;
        
        if(isBall)
        {
            if(isShoot == false)
            {
                if(this._dis < 100)
                {
                    this._total = 2;
                }
            }
            
            this._angleLimit = 180;
        }
        else
        {
            this._angleLimit = 140;
        }
        
        this._dis = Math.sqrt(Math.pow(start.x - end.x, 2) + Math.pow(start.y - end.y, 2))/2;
        
        //每一帧的角度
        this._perAngle = this._angleLimit/(this._total*cc.game.getFrameRate() * MatchConfig.Living);
        
        this._vx = (this._endPoint.x - this._startPoint.x)/(this._total*cc.game.getFrameRate() * MatchConfig.Living);
        this._vy = (this._endPoint.y - this._startPoint.y)/(this._total*cc.game.getFrameRate() * MatchConfig.Living);

        this._active = true;
    }
    
    update (dt)
    {
        if(!this._active){
            return;
        }
        if(this._isBall)
        {
            if(this._high == false)
            {
                this._vz = -Math.sin(this._angle*Math.PI/180)*this._dis*4 - MatchConfig.NetHeight + 30;
            }
            else
            {
                this._vz = -Math.sin(this._angle*Math.PI/180)*this._dis*4 - 60;
            }
            
        }
        else
        {
            this._vz = -Math.sin(this._angle*Math.PI/180)*this._dis*4 - 35;
        }
        
        this. _ballPoint.x += this._vx;
        this._ballPoint.y += this._vy;
        this._angle += this._perAngle;
        
        var point:cc.Vec2 = GridController.getInstance().getScenePosition(new cc.Vec3(this._ballPoint.x, this._ballPoint.y, this._vz));
        
        if(this._dis > 40 && this._angle > 140)
        {
            if(this._endPoint.x > 50)
            {
                point = GridController.getInstance().getScenePosition(new cc.Vec3(MatchConfig.RightNet.x, MatchConfig.RightNet.y, -180));
            }
            else
            {
                point = GridController.getInstance().getScenePosition(new cc.Vec3(MatchConfig.LeftNet.x, MatchConfig.LeftNet.y, -180));
            }
            this.node.runAction(cc.sequence(cc.moveTo(0.15,point),cc.callFunc(()=>{
                this.clear();
            })));
            this._active = false;

            return;
        }
    
        if(this._isBall)
        {
            if(this._high == false)
            {
                point.y -= 15;	
            }
        }
        else
        {
            point.y -= 10;
        }
        
        this.node.setPosition(point);
        
        if(this._angle >= this._angleLimit)
        {	
            this.clear();
        }
    }
    
    private clear():void
    {
        this._startPoint = null;
        
        this._endPoint = null;
        
        this._high = false;
        
        if(this._callBack != null)
        {
            this._callBack(this._ballPoint);
            
            this._callBack = null;
        }
    }
    
    public stopMove():void
    {
        this.destroy();

        if(this._callBack != null)
        {
            this._callBack(this._ballPoint);
            
            this._callBack = null;
        }
    }
}
