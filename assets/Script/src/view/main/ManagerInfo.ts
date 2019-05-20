import Events from "../../signal/Events";
import ManagerData from "../../data/ManagerData";
import URLConfig from "../../config/URLConfig";
import HttpManager from "../../utils/HttpManager";
import ErrMsg from "../../data/ErrMsg";
import IconManager from "../../config/IconManager";

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
export default class ManagerInfoView extends cc.Component {

    // LIFE-CYCLE CALLBACKS:
    EventListenerTag:string = 'ManagerInfoViewListener';

    private _guild:Array<any> = ["102","111","200","201","202","203","204","205","206","207", false];

    //购买体力tip数据
    private _tipData:Object;
    //当前体力恢复经过时间
	private _currentTime:number;
    
    //private _buffList:Array<any>;

    onLoad () {
        Events.getInstance().addListener(ManagerData.PROPERTY_CHANGED, this.onChanged,this,this.EventListenerTag);
    }

    onDestroy () {
        Events.getInstance().removeByTag(this.EventListenerTag);
    }

    start () {
        this.format();
    }

    // update (dt) {}

    /**获取经理引用*/
    private get manager():ManagerData{
        return ManagerData.getInstance();
    }
    private get recoverTime():number{
        switch(this.manager.Vip){
            case 0:
                return 15;
            case 1:
            case 2:
            case 3:
                return 15;
            case 4:
            case 5:
                return 15;
            case 6:
            case 7:
            case 8:
            case 9:
                return 15;
        }
        return 15;
    }

    onChanged () {
        //公会BUFF
        this.guild = false;
        this.format();
    }

    format(){
        this.getTip();
        this.clearBuff();
        //buff
        var buffInfo:Object = this.manager.List;
        var tempTime:number = this.manager.ts - this.manager.StaminaTimeSt;
        this._currentTime = this.recoverTime*60 -tempTime;
        if(this._currentTime > 0 && this.manager.Stamina<this.manager.StaminaMax){
            //TimerCommand.registerTimeCommand(this.updateTime, null, 1, this._currentTime);
            this.schedule(this.updateTime,1,this._currentTime);
        }else{
            this.unschedule(this.updateTime);
            // TimerCommand.removeTimeCommand(updateTime);
            // TipManager.registerTip($powerMC, "体力："+manager.Stamina+"/"+manager.StaminaMax+"\n<font color='#aaaaaa'>每"+recoverTime+"分钟回复10点体力</font>", StaminaTip);
        }


        // var buff:Buff;
        
        // var tag:int;
        
        // for(var i:String in buffInfo)
        // {			
        //     //公会BUFF
        //     tag = 0;
        //     for each(var value:String in _guild)
        //     {
        //         if(value == i)
        //         {
        //             if(guild == false)
        //             {
        //                 guild = true;
                        
        //                 tag = 1;
        //                 break;
        //             }
                    
        //             tag = 2;
        //             break;
        //         }
        //     }
        //     if(tag == 1)
        //     {
        //         //显示一个公会BUFF
        //         buff = new Buff(i, buffInfo[i], true);
        //     }
        //     else if(tag == 2)
        //     {
        //         continue;
        //     }
        //     else
        //     {
        //         //显示常规的BUFF
        //         buff = new Buff(i, buffInfo[i], false);
        //     }
        //     buff.x = BUFF_POINT.x + (buff.width + BUFF_OFFSET_X) * _buffList.length;
        //     buff.y = BUFF_POINT.y;
        //     $ui.addChild(buff);
        //     _buffList.push(buff);
        // }
        
        // if(this.manager.SnsVip > 0){
        //     $yellowMC.filters = null;
        //     TipManager.registerTip($yellowMC, "您好黄钻贵族");
        // }
        
        // $vipMC.gotoAndStop(manager.Vip);
        // if(manager.Vip == 0){
        //     $vipMC.filters = CoolEffect.blackFilter;
        //     TipManager.registerTip($vipMC, "1$您还不是VIP", WordTip);
        // }else{
        //     $vipMC.filters = null;
        //     TipManager.registerTip($vipMC, "1$您目前为VIP"+manager.Vip, WordTip);
        // }
        var sprVip = this.node.getChildByName('img_vip_level').getComponent(cc.Sprite);
        sprVip.getComponent(cc.Animation).setCurrentTime(this.manager.Vip/60);

        this.node.getChildByName('lbl_name').getComponent(cc.Label).string = this.manager.Name;
        this.node.getChildByName('lbl_money').getComponent(cc.Label).string = this.manager.Money+'';
        this.node.getChildByName('lbl_point').getComponent(cc.Label).string = this.manager.Point+'';
        this.node.getChildByName('lbl_kpi').getComponent(cc.Label).string = this.manager.KPI+'';
        /** 体力 */
        this.node.getChildByName('pgb_stamina').getComponent(cc.ProgressBar).progress = this.manager.Stamina/this.manager.StaminaMax;
        /** 经理经验 */
        var scale = this.manager.Exp/this.manager.lvExp;
        this.node.getChildByName('pgb_stamina').getComponent(cc.ProgressBar).progress = scale;
        this.node.getChildByName('lbl_level').getComponent(cc.Label).string = this.manager.Level+'';

        // var scale:Number = manager.Exp/manager.lvExp
        // if(manager.Level == Manager.MAX_LV){
        //     scale = 1;
        //     TipManager.registerTip($expMC, "MAX！");
        // }else{
        //     TipManager.registerTip($expMC, "经验："+manager.Exp+"/"+manager.lvExp);
        // }
        // $expTxt.text = int(manager.Exp*100/manager.lvExp)+"%"
        // tweenMotion($expMC.maskMC, scale);
        // TweenLite.to($expTxt, 0.5, {x:_expX - (1-scale)*$expMC.width})
        // //$expMC.maskMC.scaleX = scale;
        // scale = manager.Stamina/manager.StaminaMax;
        // //$powerMC.maskMC.scaleX = scale;
        // tweenMotion($powerMC.maskMC, scale);
        // //$powerTxt.text = manager.Stamina+"/"+manager.StaminaMax;
        // if(manager.Level < 10){
        //     $lvMC.item_1.visible = false;
        //     $lvMC.item_0.gotoAndStop(manager.Level+1);
        // }else{
        //     var h:int = manager.Level/10;
        //     var m:int = manager.Level - 10*h;
        //     $lvMC.item_1.visible = true;
        //     $lvMC.item_0.gotoAndStop(h+1);
        //     $lvMC.item_1.gotoAndStop(m+1);
        // }
        
        //logo
        let img_logo = this.node.getChildByName('img_logo').getComponent(cc.Sprite);
        var pic:string  = parseInt(this.manager.Logo)>9?this.manager.Logo:"0"+this.manager.Logo;
        pic = "img_"+pic+".png";
        function onLoaded(spriteFrame):void{
            img_logo.spriteFrame = spriteFrame;
        }
        IconManager.getIcon(pic,IconManager.PLAYER_LOGO,onLoaded);
    }

    //更新时间
    private updateTime(){
        this._currentTime--;
        if(this._currentTime <= 0){
            this.manager.refresh();
            //TipManager.registerTip($powerMC, "体力："+manager.Stamina+"/"+manager.StaminaMax+"\n<font color='#aaaaaa'>每"+recoverTime+"分钟回复10点体力</font>");
        }
        // var tempStr:String = (formatTimeStr(_currentTime))+"后将恢复10点体力";
        // TipManager.registerTip($powerMC, "体力："+manager.Stamina+"/"+manager.StaminaMax+"\n"+tempStr+"\n<font color='#aaaaaa'>每"+recoverTime+"分钟回复10点体力</font>", StaminaTip);
        
        //格式化成分钟
        function formatTimeStr(num:number):string{
            if(num < 0 ){
                num = 0;
            }
            var min = num/60;
            var s = num - min*60;
            var str:string = min+":"
            str += s>=10?s:"0"+s;
            return str;
        }
    }

    /**获取TIP*/
    private getTip():void{
        if(!this._tipData){
            // var vo:CommandVo = new CommandVo(URLConfig.Post_Manager_Stamina);
            // NetCommand.callServer(onGetTip, vo);
            var srvArgs = {action:URLConfig.Post_Manager_Stamina,args:{}};
            HttpManager.getInstance().request(srvArgs,onGetTip,this);
        }
        
        function onGetTip(data:Object):void{
            if(data['res']){
                this._tipData = data;
                var str:string = ErrMsg.getInstance().getErr(data['code'])
                for(var i in data["var"]){
                    str = str.replace("${"+i+"}", data["var"][i]);
                }
                //tips需要换一种方式展示
                // if(data["var"].Num == 0){
                //     TipManager.registerTip($addPowerBtn, "您今日的体力购买次数已用完~");
                // }else{
                //     TipManager.registerTip($addPowerBtn, str);
                // }
            }else{
                //TipManager.registerTip($addPowerBtn, ErrMsg.getInstance().getErr(data.code));
            }
        }
    }

    /***/
    private clearBuff():void{
        // if(this._buffList){
        //     var buff;
        //     for(var i=0; i<this._buffList.length; i++){
        //         buff = this._buffList[i];
        //         if(buff){
        //             buff.dispose();
        //             if(buff.parent){
        //                 buff.parent.removeChild(buff);
        //             }
        //         }
        //     }
        // }
        // this._buffList = new Array();
    }

    public set guild(value:boolean)
    {
        this._guild[this._guild.length-1] = value;
    }
    
    public get guild():boolean
    {
        return this._guild[this._guild.length-1];
    }
}
