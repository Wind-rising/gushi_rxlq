
const {ccclass, property} = cc._decorator;
import Singleton from "../Utils/Singleton";
import MatchConfig from "../config/MatchConfig";
@ccclass
export default class GridController extends Singleton {

    private _p:cc.Vec2;
		
    private _pp:cc.Vec2;
    
    private _ang:number;
    
    private _pt:cc.Vec2;
    
    private _delX:number;
    private _delY:number;
    
    /**
     * 构造函数 
     * 
     */	
    public constructor()
    { 
        super();

        this._pt = new cc.Vec2();
        this._delX = 0;//LayerManager.delX/2;
        this._delY = 0;//LayerManager.delY/2;
    }
    
    /**
     * 通过对应格子坐标计算出相对于地图中心点的相对坐标
     * @param vec 分别横纵高坐标
     * @6.3:缩放比率
     */		
    public getScenePosition(vec:cc.Vec3):cc.Vec2
    {
        /**
         * 缩放比率
         */
        var _dx:number = (vec.x - MatchConfig.GroundWidth/2) * 10.28;
        var _dy:number = vec.z;
        var _dz:number = (MatchConfig.GroundHeight/2 - vec.y) * 30.1;
        
        /**
         * X轴旋转
         */
        this._p = this.round(new cc.Vec2(_dy, _dz), 7.2);
        _dy = this._p.x;
        _dz = this._p.y;

        /** 坐标转换如何实现 */
        let tar = this.local3DToGlobal(new cc.Vec3(_dx,_dy,_dz));
        
        tar.x = tar.x + this._delX;
        tar.y = tar.y + this._delY;
        tar.x *= 640/700;
        tar.y *= 640/700;//锚点问题 要减去30
        tar.y -= 30;
        return tar;
    }

    public local3DToGlobal(localPoint:cc.Vec3):cc.Vec2
    {
        return new cc.Vec2(localPoint.x,localPoint.y);
        // let a = -163.9468;
        // let b = 9.09412;
        // let c = -1.6127271;
        // let d = -0.000074560364;
        // let e = 0.00000051033208;
        // let f = 0.00000011368101;
        // let g = -0.0023050377;
        // let h = -0.00000008865188;
        // let i = 0.00000000062307369;
        // let x = localPoint.x;
        // let y = localPoint.y;
        // let rx = (a+b*x+c*y+d*Math.pow(y,2)+e*Math.pow(y,3))/(1+f*x+g*y+h*Math.pow(y,2)+i*Math.pow(y,3));

        // a = 183.1195025;
        // b = 0.00000286468;
        // c = -0.00000019425;
        // d = 0.00000000425708;
        // e = -0.000000000036961;
        // f = 0.00000000000011033;
        // g = 2.952245092;
        // h = 0.006875264;
        // i = 0.0000133373;
        // let j = 0.0000000648097;
        // let ry = a+b*x+c*Math.pow(x,2)+d*Math.pow(x,3)+e*Math.pow(x,4)+f*Math.pow(x,5)+g*y+h*Math.pow(y,2)+i*Math.pow(y,3)+j*Math.pow(y,4);
        
        // return new cc.Vec2(rx,ry);
    }
    
    /**
     * 坐标转换
     * @angle角度，需要转换成弧度
     */
    private round(point:cc.Vec2, angle:number):cc.Vec2
    {
        if(this._pp == null)
        {
            this._pp = new cc.Vec2();
        }

        this._ang = angle * Math.PI /180;
        
        this._pp.x = point.x * Math.cos(this._ang) - point.y * Math.sin(this._ang);
        this._pp.y = point.y * Math.cos(this._ang) + point.x * Math.sin(this._ang);
        
        return this._pp;
    }
}

GridController.getInstance();
