// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

'use strict';

const {ccclass, property} = cc._decorator;

import Singleton from './../utils/Singleton';
import ManagerLvData from './ManagerLvData';
import Utils from './../utils/Utils';
import ItemData from './ItemData';
import ErrMsg from './ErrMsg';
import Events from '../signal/Events';
import RegistrationView from '../view/registration/RegistrationView';
import HttpManager from '../utils/HttpManager';
import URLConfig from '../config/URLConfig';
import AppConfig from '../config/AppConfig';

@ccclass
export default class ManagerData extends Singleton {
    /**数据源*/
    private _data:Object;
    /**用户ID*/
    private _Uid:string;
    /**ID*/
    private _Mid:string;
    /**LOGO*/
    private _Logo:string;
    /**Name*/
    private _Name:string;
    /**未知-Uname*/
    private _Uname:string;
    /**未知-Uvip------------------------------------------------------------------------------*/
    private _Uvip:string;
    /***/
    private _SalaryCap:number;
    
    private _VipReward:number;
    
    private _gid:number;
    
    private _gname:string;
    
    private _sid:string;
    
    private _applystatus:number;
    
    /**经验*/
    private _Exp:number;
    /**等级*/
    private _Level:number=0;
    /**金币*/
    private _Money:number;
    /**点券*/
    private _Point:number;
    /**灵气*/
    private _Sp:number;
    /**Stamina-行动力*/
    private _Stamina:number;
    /**体力恢复时间*/
    private _StaminaTime:number;
    /**体力恢复时间戳*/
    private _StaminaTimeSt:number;
    /**最大行动力*/
    private _StaminaMax:number;
    /** 活跃度 */
    private _Score:number;
    /**Vip等级----------------------------------------------------------------------------------------------*/
    private _Vip:number;
    
    private _SnsVip:number;
    /**KPI信息*/
    private _Info:Object;
    /**VIP信息，只读---------------------*/
    public vipInfo:Object;
    /**当前工资帽，人肉只读----------------------*/
    public totalSalary:number;
    //获取数据的服务端时间
    public ts:number;
    /***/
    private _Yueli:number;
    
    /**替补席位置*/
    private _BenchNum:number;
    /**球队阵型？Fid*/
    private _Fid:string;
    /**球队阵型列表*/
    private _Fids:Array<Object>;
    /**球队信息*/
    private _Project:Array<Object>=[];
    /** 球员托管信息 {tid：value} value：0托管，1托管 */
    public storeDic:Object = new Object();
    /**Buff信息*/
    private _List:Object;
    /**Buff列表*/
    private _guildList:Object
    /**战术*/
    private _Formation:Array<Object>=[]
    /**四节阵容*/
    private _Period:Array<Object> = [];
    /**是否升级-用于判定升级动画*/
    private _isLevelUp:boolean = false;
    
    /**常量-事件-属性改变*/
    public static PROPERTY_CHANGED:string = "m_p_changed";
    /**常量-事件-初始化成功*/
    public static INIT:string = "m_init";
    /**常量-事件-升级*/
    public static LV_UP:string = "lvUp"
    /**没有球队code*/
    private NO_TEAM_ERR:string  = "2000";
    /**最大等级*/
    public static MAX_LV:number = 80;

    private dispatchEvent(eventName:string){
        Events.getInstance().dispatch(eventName);
    };

    /**刷新*/
    public refresh():void{
        let args  = [{"n":URLConfig.ManagerBasic, "i":{"Mid":""}}, {"n":URLConfig.ManagerPpt, "i":{"Mid":""}}, 
            {"n":URLConfig.ManagerTeam, "i":{"Mid":""}}, {"n":URLConfig.TeamPeriod, "i":{"Mid":""}}, 
            {"n":URLConfig.ManagerBuff, i:{"Mid":""}}, {"n":URLConfig.KpiInfo, i:{}}];

        HttpManager.getInstance().request({args:args,action:URLConfig.Get_Data},this.onGetData,this);
    }
    
    /**刷新KPI*/
    public refreshKP():void{
        let args  = [{"n":URLConfig.KpiInfo, i:{}}];

        HttpManager.getInstance().request({args:args,action:URLConfig.Get_Data},this.onGetData,this);
    }
    
    /**刷新BUFF*/
    public refreshBuff():void{
        let args  = [{"n":URLConfig.ManagerBuff, i:{"Mid":""}}];

        HttpManager.getInstance().request({args:args,action:URLConfig.Get_Data},this.onGetData,this);

        this.checkClothesBuff();
    }
    
    /**从服务器获取VIP信息,充值之后修改-----*/
    public getVipInfo():void{
        function onGetVip(data:Object):void{
            if(data['res']){
                this.vipInfo = data['data'][0];
                this.Vip = this.vipInfo.Lv;
            }
        }

        let args  = [{"n":URLConfig.Vip, i:{}}];

        HttpManager.getInstance().request({args:args,action:URLConfig.Get_Data},onGetVip,this);
    }
    
    private onGetData(data:Object):void{
        if(data['res']){
            this.ts = data['ts'];
            if(!this._data){//刚登录检测
                this.checkClothesBuff();
            }
            this.setValue(data['data']);
        }else{
            if(data['code'] == this.NO_TEAM_ERR){
                this.dispatchEvent(ManagerData.INIT);
            }else{
                if(!this._data){
                    Events.getInstance().dispatch(AppConfig.SYS_ERR, ErrMsg.getInstance().getErr(data['code']));
                }
                Utils.alert(ErrMsg.getInstance().getErr(data['code']),null,{title:"出错啦"});
            }
        }
    }

    /** 检查球服到期提示 */
    private checkClothesBuff():void
    {
        //核查是否存在球服到期提示
        let args  = [{"n":URLConfig.ManagerBuffMsg, i:{}}];
        HttpManager.getInstance().request({args:args,action:URLConfig.Get_Data},onPostBuffMsg,this);

        function onPostBuffMsg(data:Object):void
        {
            if (data['res'])
            {
                if (data['data'] && data['data'][0] && data['data'][0].List && data['data'][0].List[0])
                {
                    var buffMsg:Object = data['data'][0].List[0];
                    //球员id
                    var clothesId:string = buffMsg['Value'];
                    var itemObj:Object = ItemData.getItemInfo(clothesId);
                    var color:string = ItemData.getCardColor(1) ;

                    //您使用的 尼克斯队服 即将到期，是否续约该队服
                    var altStr:string  = "您使用的<font color='"+color+"'>"+itemObj['Name']+"</font>已经到期，综合实力已降低，是否重新购买该队服？";
                    Utils.alert(altStr,(itemCode)=>{
                        //cc.log(itemCode);
                        // MallView.getInstance().willBuyItemObj = {itemCode:itemCode,type:2};
                        // MallView.getInstance().show();
                        Utils.showDialog('MallView');//怎么传参数
                    },{
                        onCancel:function(){
                            Utils.alert("您的队服已到期消失，综合实力已降低。");
                        },
                        showCancel:true
                    });
                }
            }
        }
    }
            
    /**赋值*/
    public setValue(value:Object):void{
        if(!value){
            return;
        }
        let i:string;
        let tempInfo:Object;
        if(value.hasOwnProperty("totalSalary")){
            this.totalSalary = value['totalSalary']
        }
        
        for(let i in value){
            tempInfo = value[i];
            for(let j in tempInfo){
                if(j =="Level" && this._Level != 0 && this._Level>5 && this._Level != tempInfo[j]){//五级以上显示动画
                    this._isLevelUp = true;
                    this["_"+j] = tempInfo[j];
                    this.dispatchEvent(ManagerData.LV_UP);
                }else{
                    this["_"+j] = tempInfo[j];
                }
            }
        }
        this.dispatchEvent(ManagerData.PROPERTY_CHANGED);
        if(!this._data){
            this.dispatchEvent(ManagerData.INIT);
            this.finish();
        }
        this._data = value;
    }
    
    /**向服务发送完成事件*/
    private finish():void{
        let args  = [{"n":URLConfig.Post_Manager_LoadFinish, i:{}}];

        HttpManager.getInstance().request({args:args,action:URLConfig.Get_Data},()=>{},this);
    }
    
    /**升级*/
    public lvUp():void{
        // if(_isLevelUp){
        //     _isLevelUp = false;
        //     LevelUPView.getInstance().show();
        // }
    }

    /**队服--从BUFF中找*/
    public get clothes():string{
        var id:string = "0"
        for(let i in this._List){
            if(i == "105"){
                id = (parseInt(this._List[i]['Value']) - 18000)+""
            }
        }
        return id;
    };
    
    /**用户ID*/
    public get Uid():string
    {
        return this._Uid;
    };
    
    /**LOGO*/
    public set Logo(logoId:string){
        this._Logo = logoId;
        this.dispatchEvent(ManagerData.PROPERTY_CHANGED);
    }
    
    /**LOGO*/
    public get Logo():string{
        return this._Logo
    }
    
    /***/
    public set Name(v:string){
        this._Name = v;
    }
    /**Name*/
    public get Name():string{
        return this._Name;
    }
    
    /***/
    public set Uname(v:string){
        this._Uname = v;
    }
    /**Name*/
    public get Uname():string{
        return this._Uname;
    }
    
    /**Uvip*/
    public get Uvip():string{
        return this._Uvip;
    }
    
    /***/
    public set SalaryCap(v:number){
        this._SalaryCap = v;
    }
    
    //
    public get SalaryCap():number{
        return this._SalaryCap;
    }
    
    /**经验*/
    public set Exp(value:number){
        this._Exp = value;
        this.dispatchEvent(ManagerData.PROPERTY_CHANGED);
    }
    
    /**经验*/
    public get Exp():number{
        return this._Exp;
    }
    
    /**获取升级经验*/
    public get lvExp():number{
        return ManagerLvData.getInstance().getLvExp(this._Level);
    }
    
    /**等级*/
    public set Level(value:number){
        this._Level = value;
        this.dispatchEvent(ManagerData.PROPERTY_CHANGED);
    }
    
    /**等级*/
    public get Level():number{
        return this._Level
    }
    
    /**金币*/
    public set Money(value:number){
        this._Money = value;
        if(this._Money < 0){
            this._Money = 0;
        }
        this.dispatchEvent(ManagerData.PROPERTY_CHANGED);
    }
    
    /**金币*/
    public get Money():number{
        return this._Money;
    }
    
    /***/
    public set Info(v:Object){
        this._Info = v;
        this.dispatchEvent(ManagerData.PROPERTY_CHANGED);
    }
    
    /***/
    public get Info():Object{
        return this._Info;
    }
    
    /**获取KPI值*/
    public get KPI():number{
        if(!this._Info){
            return 0;
        }
        return this._Info[0]?this._Info[0].KPI:0
    }
    
    /**阅历*/
    public set Yueli(v:number){
        this._Yueli = Math.max(v.valueOf(), 0);
        this.dispatchEvent(ManagerData.PROPERTY_CHANGED);
    }
    
    /**阅历*/
    public get Yueli():number{
        return this._Yueli;
    }
    
    /**点卷*/
    public set Point(value:number){
        this._Point = value;
        if(this._Point<0){
            this._Point = 0;
        }
        this.dispatchEvent( ManagerData.PROPERTY_CHANGED);
    };
    
    /**点卷*/
    public get Point():number{
        return this._Point;
    };
    
    /**Stamina-行动力*/
    public set Stamina(value:number){
        this._Stamina = value;
        this.dispatchEvent( ManagerData.PROPERTY_CHANGED);
    };
    
    /**体力恢复时间*/
    public set StaminaTime(v:number){
        this._StaminaTime = v;
    }
    
    /**体力恢复时间*/
    public get StaminaTime():number{
        return this._StaminaTime;
    }
    
    /**体力恢复时间戳*/
    public set StaminaTimeSt(v:number){
        this._StaminaTimeSt = v;
    }
    
    /**体力恢复时间戳*/
    public get StaminaTimeSt():number{
        return this._StaminaTimeSt;
    }
    
    /**Stamina-行动力*/
    public get Stamina():number{
        return this._Stamina;
    }
    
    /**最大行动力*/
    public get StaminaMax():number{
        return this._StaminaMax;
    }
    
    /**Vip*/
    public set Vip(v:number){
        this._Vip = v;
        this.dispatchEvent( ManagerData.PROPERTY_CHANGED);
    }
    
    /**vip*/
    public get Vip():number{
        return this._Vip;
    }
    
    /**Vip*/
    public set SnsVip(v:number){
        this._SnsVip = v;
        this.dispatchEvent( ManagerData.PROPERTY_CHANGED);
    }
    
    /**黄钻等级*/
    public get SnsVip():number{
        return this._SnsVip;
    }
    
    /**经理ID*/
    public get Mid():string{
        return this._Mid;
    }
    
    /**灵气*/
    public set Sp(v:number){
        if(this._Sp != v){
            this._Sp = v;
            this.dispatchEvent( ManagerData.PROPERTY_CHANGED);
        }
    }
    
    /**灵气*/
    public get Sp():number{
        return this._Sp;
    }
    
    /**替补席位置*/
    public get BenchNum():number{
        return this._BenchNum;
    }
    /**球队阵型？Fid*/
    public get Fid():string{
        return this._Fid;
    }
    /**球队阵型列表*/
    public get Fids():Array<Object>{
        return this._Fids;
    }
    /**球队信息*/
    public get Project():Array<Object>{
        return this._Project;
    }
    
    /***/
    public get List():Object{
        return this._List;
    }
    
    /**战术*/
    public get Formation():Array<Object>{
        return this._Formation;
    }
    /**四节阵容*/
    public get Period():Array<Object>{
        return this._Period;
    }

    /** 活跃度 */
    public get Score():number
    {
        return this._Score;
    }

    public set Score(value:number)
    {
        this._Score = value;
        this.dispatchEvent(RegistrationView.REGISTRATION_CHANGED);
    }

    public get VipReward():number
    {
        return this._VipReward;
    }
    
    public set VipReward(value:number)
    {
        this._VipReward = value;
    }

    public get gid():number
    {
        return this._gid;
    }

    public set gid(value:number)
    {
        this._gid = value;
    }

    public get gname():string
    {
        return this._gname;
    }

    public set gname(value:string)
    {
        this._gname = value;
    }

    public get applystatus():number
    {
        return this._applystatus;
    }

    public set applystatus(value:number)
    {
        this._applystatus = value;
    }
    
    public set guildList(value:Object)
    {
        this._guildList = value;
    }

    public get guildList():Object
    {
        return this._guildList;
    }

    public get sid():string
    {
        return this._sid;
    }

    public set sid(value:string)
    {
        this._sid = value;
    }
}

ManagerData.getInstance();
