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

import Singleton from './Singleton';

@ccclass
export default class XUtil {
    /**禁用列表*/
    private static disableMap:Object = {};

    public constructor()
    {
    };

    /**
     * 弧度转为角度
     * @param radians 弧度数值
     * @return number
     */
    public static rad2deg(radians:number):number
    {
        return radians * 180 / Math.PI;
    }
    
    /**
     * 角度转为弧度
     * @param degrees 角度数值
     * @return
     *
     */
    public static deg2rad(degrees:number):number
    {
        return degrees * Math.PI / 180;
    }
    
    /**
     * 把一个物体用一个物体包装后放回原处
     * @param dis 子容器;
     * @param disc 父容器；
     */
    // public static setOldPosition(dis:DisplayObject,disc:DisplayObjectContainer):void{
    //     disc.x = dis.x;
    //     disc.y = dis.y;
    //     if(dis.parent){
    //         dis.parent.addChildAt(disc,dis.parent.getChildIndex(dis));
    //     }
    //     disc.addChild(dis);
    //     dis.x = dis.y = 0;
    // }
    
    /**
     * 物体居中对齐
     * @param dis 需要对齐的物体，注意，此时物体必须已经加入到舞台
     */
    // public static alignCenter(dis:DisplayObject):void{
    //     if(!dis.stage){
    //         return;
    //     } 
    //     var rect:Rectangle = dis.getRect(dis);
    //     dis.x = (getStageWidth(dis.stage.stageWidth) - dis.width - Math.min(0, LayerManager.delX)) * 0.5 - rect.x;
    //     dis.y = (getStageHeight(dis.stage.stageHeight) - dis.height -  Math.min(LayerManager.delY, 0)) * 0.5 - rect.y;
    // }
    
    /**获取有效舞台宽度*/
    public static getStageWidth(width:number):number{
        return Math.min(width, 1400);
    }
    
    /**获取有效舞台高度*/
    public static getStageHeight(height:number):number{
        return Math.min(height, 700);
    }
    
    
    /**
     * 获取物体全局坐标
     * @param dis 需要获取全局坐标的物体
    * */
    // public static getGlobalPostion(dis:DisplayObject):cc.Vec2{
    //     var p:cc.Vec2 = new cc.Vec2(dis.x, dis.y);
    //     var parent:DisplayObjectContainer = dis.parent;
    //     while(parent && !(parent instanceof Stage)){
    //         p.x += parent.x;
    //         p.y += parent.y;
    //         parent = parent.parent;
    //     }
    //     return p;
    // }
    
    /**删除数组重复元素--简单数据类型*/
    public static delRepeatItem(arr:Array<Object>):Array<Object>{
        var item:Object;
        for(var i:number=0; i< arr.length; i++){
            item = arr[i];
            for(var j:number = i+1; j<arr.length; j++){
                if(arr[j] == item){
                    arr.splice(j,1);
                    j --;
                }
            }
        }
        return arr
    }
    
    /**
     * 判断一个是否object是否为空
     * @param obj 需要检测的对象
     * @return true(空)/false;
     * */
    public static isEmpty(obj:Object):Boolean{
        for(let i in obj){
            return false;
        }
        return true;
    }
    
    /**计算KEY数目*/
    public static count(obj:Object):number{
        let num:number = 0;
        for(let i in obj){
            num ++;
        }
        return num;
    }
    
    /**计算字符长度-汉字算2个*/
    public static countStrLen(str:string):number{
        var len:number = 0;
        if(str){
            var code:number
            for(let i:number=0; i<str.length; i++){
                code = str.charCodeAt(i);
                if(code >= 128){
                    len += 2;
                }else{
                    len++;
                }
            }
        }
        return len
    }
    
    /**
     * 克隆数据
     * @param source源数据
     * */
    public static clone(source:Object):any
    { 
        // var myBA:ByteArray = new ByteArray(); 
        // myBA.writeObject(source); 
        // myBA.position = 0; 
        // return(myBA.readObject()); 
        return  JSON.parse(JSON.stringify(source));
    }
    
    
    /**
     * 禁用可视化对象 
     * @param mc
     * @param isDisable
     * 
     */		
    // public static disableDisplayObject(mc:InteractiveObject, isDisable:Boolean = true):void
    // {
    //     if(mc){
    //         var param:Object
    //         if (isDisable)
    //         {
    //             if (!disableMap[mc]){
                    
    //                 param = new Object();
    //                 param['mouseEnabled'] = mc.mouseEnabled;
    //                 param['filter'] = mc.filters;
    //                 disableMap[mc] = param;
                    
    //                 mc.filters = CoolEffect.blackFilter;
    //                 mc.mouseEnabled = false;
    //                 if (mc.hasOwnProperty('mouseChildren')){
    //                     param['mouseChildren'] = mc['mouseChildren'];
    //                     mc['mouseChildren'] = false;
    //                 }
    //             }
    //         }else {
    //             param = disableMap[mc];
    //             if(param){
    //                 mc.filters = param['filter'];
    //                 mc.mouseEnabled = param['mouseEnabled'];
    //                 if (mc.hasOwnProperty('mouseChildren')){
    //                     mc['mouseChildren'] = param['mouseChildren']; 
    //                 }
    //                 delete disableMap[mc];
    //             }
    //         }
    //     }
    // }
};
