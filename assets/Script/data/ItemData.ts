/**
 * 物品数据保存
 */
//'use strict';



const {ccclass, property} = cc._decorator;

import Events from "../signal/Events";
import Singleton from "../Utils/Singleton";

@ccclass
export default class ItemData extends Singleton {

    /**文本-球员位置*/
    private posStr:string = "大前锋$小前锋$中锋$得分后卫$控球后卫";
    /**道具数据*/
    private _itemData:Object;
    /**球员数据*/
    private _playerData:Object;
    /**装备数据*/
    private _equipData:Object;
    //
    private _equipPairData:Object;
    /**洗练属性数据*/
    private _holeData:Object;
    /**装备强化需要的钱*/
    private _strData:Object;
    
    /**道具数据地址*/
    private static ITEM_URL:string = "Dic_item_chs";
    /**球员数据地址*/
    private static PLAYER_URL:string = "Dic_player_chs";
    /**装备*/
    private static EQUIP_URL:string = "Dic_equip_chs";
    /**套装公式*/
    private static EQUP_PAIR_M_URL:string = "Dic_equippairkosshiki_chs";
    /**洗练属性*/
    private static EQUIP_WASH_URL:string = "Dic_equipmenthole_chs";
    /**装备强化需要的钱*/
    private static EQUIP_STR_URL:string = "Dic_equipment_chs";

    constructor(){
        super();
        this.init();
    }
    public init():void{
        this._itemData = null;
        this._playerData = null;
        this._equipData = null;
        this._equipPairData = null;
        this._holeData = null;
        this._strData = null;
        Events.getInstance().addListener('EventJsonDataLoaded',function(name,data){
            switch(name){
                case ItemData.ITEM_URL:{
                    this._itemData = data;
                    break;
                }
                case ItemData.PLAYER_URL:{

                    this._playerData = data;
                    break;
                }
                case ItemData.EQUIP_URL:{
                    this._equipData = data;
                    break;
                }
                case ItemData.EQUP_PAIR_M_URL:{
                    this._equipPairData = data;
                    break;
                }
                case ItemData.EQUIP_WASH_URL:{
                    this._holeData = data;
                    break;
                }
                case ItemData.EQUIP_STR_URL:{
                    this._strData = data;
                    break;
                }
            }
        },this,'ItemDataLoadListener');
    };
    /**
     * 获取球员数据
     * 1:大前锋（PF）、2:小前锋（SF）、3:中锋（C）、4:得分后卫（SG）、5:控球后卫（PG）
     * 5:普通（白色）、4:精英（蓝色）、3:元老（紫色）、2:史诗（橙色）、1:传奇（金色）
     * JumpShot 中投	ThreePoints 三分	Rejection 封盖	Steals 抢断	Pass 传球	Dribble 控球	Dunk 扣篮	Rebound 篮板	Speed 速度	Stamina 体能
     * */
    public getPlayerInfo(pid):any
    {
        return this._playerData[pid];
    };
    /**根据位置获取标签*/
    public getLabel(pos:number):string
    {   

        switch(pos){
            case 1:
                return "PF";
                break;
            case 2:
                return "SF";
                break;
            case 3:
                return "C";
                break;
            case 4:
                return "SG";
                break;
            case 5:
                return "PG";
                break;
        }
        return "PF";
    };
    /**
     * 获取道具数据
     * 
     * */
    public getItemInfo(itemCode:String):Object
    {
        var obj = this._itemData[itemCode.valueOf()];
        if(!obj){
            obj = this._playerData[itemCode.valueOf()];
            if(obj && !obj.UseFlag){
                obj.UseFlag = true;
            }
        }
        return obj;
    };

    /**获取装备属性--其实就是套装属性*/
    public getEquipInfo(itemCode:string):Object
    {
        var obj = this._equipData[itemCode];
        return obj;
    };
    
    /**
     * 获取套装公式
     * @param pairKey，组成为装备Id+套装ID；
     * */
    public getEquipPairInfo(pairKey:string):Object
    {
        return this._equipPairData[pairKey]
    };
    
    /**
     * 获取球员位置
     * @position球员位置
     * */
    public getPosStr(positon:number):string
    {
        //需要换个方式
        let arr = this.posStr.split("$");
        return arr[positon-1];
    };
    
    /**获取洗练属性*/
    public getHoleInfo(id:number):Object
    {
        return this._holeData[id]
    };
    
    /**根据卡牌获取卡牌颜色代码-如*/
    public getCardColor(lv:number):string
    {
        let color = "#33FF33"
        switch(lv){
            case 1:
                color = "#FFCC33"
                break;
            case 2:
                color = "#FF6600"
                break;
            case 3:
                color = "#BC4FFF"
                break;
            case 4:
                color = "#0099FF";
                break;
            case 5:
                color = "#33FF33";
                break;
            default:
                color = "#33FF33";
                break;
        }
        //new cc.Color().fromHEX(
        return color;
    };
    
    /**根据装备套系获取装备颜色*/
    public getEquipColor(pair:number):string
    {
        let color:string = "#33FF33"
        switch(pair){
            case 9:
                color = "#FFCC33"
                break;
            case 7:
            case 8:
                color = "#FF6600"
                break;
            case 5:
            case 6:
                color = "#BC4FFF"
                break;
            case 3:
            case 4:
                color = "#0099FF";
                break;
            case 0:
            case 1:
            case 2:
                color = "#33FF33";
                break;
            default:
                color = "#33FF33";
                break;
        }
        return color;
    };
    
    /**
     * 获取强化需要的钱
     * @param lv 装备等级
     * @param pair 装备套系
     */
    public getStrMoney(lv:number, pair:number):number
    {
        let info = this._strData[lv];
        if(!info){
            info = {};
        }
        return info["pair_"+(pair+1)]
    };
    
    /**
     * 获取球员带颜色名字【html】 
     * @param pid 球员编号
     * @return 带颜色名字
     */		
    public getPlayerHtmlName(pid:string):String
    {
        var nameStr:string = "";
        var info = this.getPlayerInfo(pid);
        if(info){
            nameStr = "<font color='"+this.getCardColor(info.CardLevel)+"'>"+info.ShowName+"</font>";
        }
        return nameStr;
    };

    /**球员数据*/
    public getPlayerData():Object
    {
        return this._playerData;
    };
}

ItemData.getInstance();
