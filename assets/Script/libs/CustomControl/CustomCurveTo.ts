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
export default class CustomCurveTo extends cc.Component {
    
    private _a:number;
    
    private _b:number;
    
    private _c:number;
    
    private _vx:number;
    
    private _vy:number;
    
    private _start:cc.Vec2;
    
    private _end:cc.Vec2;
    
    private _step:number;
    
    private _round:number;
    
    private _fun:Function;
    
    private _sped:number = 3;

    private _active:boolean = false;
    
    /**
     * 空间抛物线公式
     * y = a*x*x + b*x + c
     * z = a*x*x + b*y
     */
    public curveTo(start:cc.Vec2, end:cc.Vec2, round:number, fun:Function):void
    {
        this._start = start;
        
        this._end = end;
        
        this._round = round;
        
        this._fun = fun;
        
        this._step = 0;
        
        var dis:number = Math.sqrt(Math.pow(start.x - end.x, 2) + Math.pow(start.y - end.y, 2))/2;
        
        var high:number = 10
        
        this._vx = (end.x - start.x)/(round*this._sped);
        this._vy = (end.y - start.y)/(round*this._sped);
        
        var vx:number = (end.x - start.x)/2 + start.x;
        
        var vy:number = (end.y - start.y)/2 + start.y;
        
        this.setPoint(new cc.Vec2(end.x, -70), new cc.Vec2(vx, -MatchConfig.NetHeight-high), new cc.Vec2(start.x, -MatchConfig.NetHeight));
        
        if(isNaN(this._a) || isNaN(this._b) || isNaN(this._c))
        {
            this.moveUpAndDown(start, end);
            return;
        }

        this._active = true;
        
    }
    
    private moveUpAndDown(start:cc.Vec2, end:cc.Vec2):void
    {
        let pos:cc.Vec2 = GridController.getInstance().getScenePosition(new cc.Vec3(end.x, end.y));
        //this.node.stopAllActions();
        this.node.runAction(cc.sequence(
            cc.moveTo(MatchConfig.Living*2,this.node.x,this.node.y-20)
            ,cc.moveTo(MatchConfig.Living*3,pos.x,pos.y-10)
        ));
    }
    
    update(dt)
    {
        if(!this._active){
            return;
        }
        this._step+=1;
        this._start.x = this._start.x + this._vx;
        this._start.y = this._start.y + this._vy;
        var vz:number = this._a * this._start.x * this._start.x + this._b * this._start.x + this._c;
        
        var p:cc.Vec2 = GridController.getInstance().getScenePosition(new cc.Vec3(this._start.x, this._start.y, vz));
        
        this.node.setPosition(p);
        
        if(this._step >= this._round*this._sped)
        {
            this._active = false;
            stop();
            
            return;
        }
    }
    
    public stop():void
    {
        if(this._fun != null)
        {
            this._fun();
            
            this._fun = null;
        }
    }
    
    private setPoint(pos1:cc.Vec2, pos2:cc.Vec2, pos3:cc.Vec2):void
    {
        var x1:number = pos1.x;
        var y1:number = pos1.y;
        
        var x2:number = pos2.x 
        var y2:number = pos2.y
        
        var x3:number = pos3.x;
        var y3:number = pos3.y;
        
        this._b = ((y1-y3)*(x1*x1-x2*x2)-(y1-y2)*(x1*x1-x3*x3))/((x1-x3)*(x1*x1-x2*x2)-(x1-x2)*(x1*x1-x3*x3));   
        this._a = ((y1-y2)-this._b*(x1-x2))/(x1*x1-x2*x2);   
        this._c = y1-this._a*x1*x1-this._b*x1; 
    }
    
    // private test(name:String):Sprite
    // {
    //     var s:Sprite = new Sprite();
    //     s.graphics.beginFill(0xff);
    //     s.graphics.drawRect(0, 0, 10, 10);
    //     s.graphics.endFill();
        
    //     var tf:TextField = new TextField();
    //     tf.text = name;
        
    //     s.addChild(tf);
        
    //     return s;
    // }
}
