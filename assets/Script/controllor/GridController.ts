
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
     * 通过对应格子坐标计算出屏幕上的绝对坐标
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

        return tar;
    }

    private local3DToGlobal (p:cc.Vec3):cc.Vec2 {
        let ret = new cc.Vec2();
        ret.x = p.x * 7;
        ret.y = p.y * 7;
        return ret;
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
