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

import Events from '../signal/Events';
import Singleton from '../Utils/Singleton';

@ccclass
export default class ManagerLvData extends Singleton {
    /**数据*/
    private _data:Object;
    /***/
    //private _args:Array;
    /**数据地址*/
    private URL:String = "Dic_managerlv_chs";

    /**初始化*/
    public init(/*callback:Function=null, args:Array=null*/):void{
        Events.getInstance().addListener('EventJsonDataLoaded',function(name,data){
            if(name == this.URL){
                this._data = data;
            }
        },this);
    }
    
    /**获取升级经验*/
    public getLvExp(lv:number):number{
        return this._data[lv.valueOf()+1];
    }
}
