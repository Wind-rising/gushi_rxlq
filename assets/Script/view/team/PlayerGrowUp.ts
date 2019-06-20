/**
 * 球员成长 升阶
 */
const {ccclass, property} = cc._decorator;
import PlayerControllor from "../../controllor/PlayerControllor";
import PlayerUtil from "../../utils/PlayerUtil";
import URLConfig from "../../config/URLConfig";
import HttpManager from "../../utils/HttpManager";
import VipRateData from "../../data/VipRateData";
import Utility from "../../utils/Utility";
import ManagerData from "../../data/ManagerData";
import TeamGrowthData from "../../data/TeamGrowthData";
@ccclass
export default class PlayerGrowUp extends cc.Component {

    
    /**成长方式-普通*/
    private NORMAL:number = 1;
    /**成长方式-快速*/
    private QUICK:number = 2;
    /***/
    private TOTAL_EXP:number = 100;
    private MAX_LV:number = 9;

    //球员数据相关
    needRefresh:boolean = false;
    playerInfo:Object = null;

    /** 自动升级 */
    autoGrow:boolean = false;
    autoGrowType:number = 1;

    //UI节点
    lbl_state:cc.Label = null;
    pgb_grow:cc.ProgressBar = null;
    lbl_value_grow:cc.Label = null;
    lbl_sp:cc.Label = null;
    rtx_ordinary:cc.RichText = null;
    rtx_senior:cc.RichText = null;
    lbl_max:cc.Label = null;
    btn_ordinary:cc.Button = null;
    btn_senior:cc.Button = null;

    nod_upgrade:cc.Node = null;


    onLoad () {
        this.needRefresh = true;


        this.lbl_state = this.node.getChildByName('lbl_state').getComponent(cc.Label);
        this.pgb_grow = this.node.getChildByName('pgb_grow').getComponent(cc.ProgressBar);
        this.lbl_value_grow = this.node.getChildByName('lbl_value_grow').getComponent(cc.Label);
        this.lbl_sp = this.node.getChildByName('lbl_sp').getComponent(cc.Label);
        this.rtx_ordinary = this.node.getChildByName('rtx_ordinary').getComponent(cc.RichText);
        this.rtx_senior = this.node.getChildByName('rtx_senior').getComponent(cc.RichText);
        this.lbl_max = this.node.getChildByName('lbl_max').getComponent(cc.Label);
        this.nod_upgrade = this.node.getChildByName('nod_upgrade');
        this.btn_ordinary = this.node.getChildByName('btn_ordinary').getComponent(cc.Button);
        this.btn_senior = this.node.getChildByName('btn_senior').getComponent(cc.Button);

        this.btn_ordinary.clickEvents.push(
            Utility.bindBtnEvent(this.node,'PlayerGrowUp','onBtnGrowOrdinary')
        );
        this.btn_senior.clickEvents.push(
            Utility.bindBtnEvent(this.node,'PlayerGrowUp','onBtnGrowSenior')
        );
        this.nod_upgrade.getChildByName('btn_upgrade').getComponent(cc.Button).clickEvents.push(
            Utility.bindBtnEvent(this.node,'PlayerGrowUp','onBtnUpgrade')
        );


        this.node.on('selectedPlayer',()=>{
            //选中球员的时候被调用
            if(this.node.active){
                this.formatData();
            }else{
                this.needRefresh = true;
            }
        });
    }

    start () {

    }

    onEnable () {
        if(this.needRefresh){
            this.formatData();
        }
    }

    // update (dt) {}

    /**
     * 普通成长
     * @param e 
     */
    onBtnGrowOrdinary (e:cc.Event.EventTouch) {
        this.growPlayer(this.NORMAL);
    }

    /**
     * 高级生产
     * @param e 
     */
    onBtnGrowSenior (e:cc.Event.EventTouch) {
        this.growPlayer(this.QUICK);
    }

    /**
     * 升阶
     * @param e 
     */
    onBtnUpgrade (e:cc.Event.EventTouch) {
        //_selectedItem.vo.Uuid
        // let args  = {Tid:this.playerInfo['Tid'], Uuid:uuid};
        // HttpManager.getInstance().request({args:args,action:URLConfig.Post_Team_GrowPlayerBreak},(responce)=>{
        //     if(responce['res']){
        //     }
        // });
    }

    formatData(){
        this.needRefresh = false;
        this.playerInfo = PlayerControllor.getInstance().playerInfo;
        let level = parseInt(this.playerInfo['Level']);
        let isMax = level < this.MAX_LV;
        this.nod_upgrade.active = isMax;
        
        this.lbl_max.node.active = !isMax;

        let lbl_next = this.nod_upgrade.getChildByName('lbl_next').getComponent(cc.Label);
        lbl_next.string = this.getTipInfo(level);
        lbl_next.node.active = isMax;
        this.lbl_sp.string = ''+ManagerData.getInstance().Sp;
        if(isMax){
            let exp = Math.floor(Math.floor(this.playerInfo['Exp']));
            this.lbl_state.string = this.getLvName(level);
            this.lbl_value_grow.string = this.playerInfo['Exp']+'/'+this.MAX_LV;
            let str = TeamGrowthData.getInstance().getLvSp(level, this.NORMAL)+'';
            this.rtx_ordinary.string = cc.js.formatStr('消耗<color=#52DD3C>%s</color>灵气，获得<color=#52DD3C>9</color>点成长',str);
            str = TeamGrowthData.getInstance().getLvSp(level, this.QUICK)+'';
            this.rtx_senior.string = cc.js.formatStr('消耗<color=#52DD3C>%s</color>灵气，获得<color=#52DD3C>3-6</color>点成长',str);
            this.pgb_grow.progress = exp/100;
            this.btn_ordinary.interactable = true;
            this.btn_senior.interactable = true;
            if(exp >= this.TOTAL_EXP){
                this.nod_upgrade.getChildByName('lbl_warm').active = false;
            }else{
                this.nod_upgrade.getChildByName('lbl_warm').active = true;
            }
        }else{
            this.nod_upgrade.getChildByName('lbl_warm').active = false;
            this.btn_ordinary.interactable = false;
            this.btn_senior.interactable = false;
            this.lbl_value_grow.string = '100%';
            this.pgb_grow.progress = 1;
            this.rtx_ordinary.string = '--';
            this.rtx_senior.string = '--';
        }
        
    }

    /**
     * 球员成长
     */
    private growPlayer(type:number = 1){
        let sp:number = TeamGrowthData.getInstance().getLvSp(this.playerInfo['Level'], type);
        if(ManagerData.getInstance().Sp >= sp){
            if(!this.autoGrow){
                if(type == this.NORMAL){
                    this.btn_ordinary.interactable = false;
                }else{
                    this.btn_senior.interactable = false;
                }
            }
            let args  = {Tid:this.playerInfo['Tid'], Type:type};
            HttpManager.getInstance().request({args:args,action:URLConfig.Post_Team_GrowPlayer},(responce)=>{
                if(!this.autoGrow){
					if(type == this.NORMAL){
						this.btn_ordinary.interactable = true;
					}else{
						this.btn_senior.interactable = true;
					}
				}
                if(responce['res']){
                    this.playerInfo['Exp'] = parseInt(this.playerInfo['Exp'])+responce['data']['Post_Team_GrowPlayer'];
					ManagerData.getInstance().Sp -= TeamGrowthData.getInstance().getLvSp(this.playerInfo['Level'], type);
					if(responce['data'] && responce['data']['SyncData']['Score'])
                    ManagerData.getInstance().Score = parseInt(responce['data']['SyncData']['Score']);
					this.formatData();
					if(this.autoGrow){
						this.growPlayer(this.autoGrowType);
					}
                }
            });
        }else{
            this.autoGrow = false;
            Utility.showConfirm("灵气不足！分解球员卡可获得灵气，立刻前往分解卡牌?",()=>{
                //显示卡牌分解页面
            });
        }
    }

    /**
     * 升阶成功率
     * @param uuid 球员id
     */
    private getRate(uuid:string):void{
        let args  = {Tid:this.playerInfo['Tid'], Uuid:uuid, Tip:1};
        HttpManager.getInstance().request({args:args,action:URLConfig.Post_Team_GrowPlayerBreak},(responce)=>{
            if(responce['res']){
                //显示成功率
                let str = "升阶成功率："+Math.floor(responce['data']['Post_Team_GrowPlayerBreak_Tip'])+"%" + VipRateData.getInstance().getGrowthRate(Math.floor(responce['data']['Post_Team_GrowPlayerBreak_Tip']));
                this.nod_upgrade.getChildByName('lbl_rate').getComponent(cc.Label).string = str;
                
            }
        });
    }


    /** 	成长期（2、3阶）每阶提升1%全属性
     成熟期（4、5、6阶）每阶提升3%全属性
    巅峰期（7、8、9阶）每阶提升5%全属性
    	元老、橙色会激活球星专属技能
    橙色球员3阶可激活1级球星技能；5阶激活2级，7阶激活3级
    紫色球员5阶可激活1级球星技能；7阶激活2级，9阶激活3级
    */
    private getLvName(lv:number):string{
        let str:string;
        switch(lv){
            case 1:
                str = lv+"阶 成长初期";
                break;
            case 2:
                str = lv+"阶 成长中期";
                break;
            case 3:
                str = lv+"阶 成长后期";
                break;
            case 4:
                str = lv+"阶 成熟初期";
                break;
            case 5:
                str = lv+"阶 成熟中期";
                break;
            case 6:
                str = lv+"阶 成熟后期";
                break;
            case 7:
                str = lv+"阶 巅峰初期";
                break;
            case 8:
                str = lv+"阶 巅峰中期";
                break;
            case 9:
                str = lv+"阶 巅峰后期";
                break;
        }
        return str;
    }
    /**
     * 升阶提示信息统一579
     * :普通（白色）、4:精英（蓝色）、3:元老（紫色）、2:史诗（橙色）、1:传奇（金色）
     * */
    private getTipInfo(lv:number):string{
        var str:string ="下一阶"
        str += "\n全属性+"+Math.round(PlayerUtil.getLvPro(lv+1)*100)+"%";
        var cardLevel = this.playerInfo['basicData']['CardLevel'];
        switch(lv){
            case 2:
                if(cardLevel == 2 || cardLevel == 3){
                    str+= "\n可激活1级球星技能";
                }
                break;
            case 6:
                if(cardLevel ==2 || cardLevel == 3){
                    str+= "\n可激活2级球星技能";
                }
                break;
                break;
            case 8:
                if(cardLevel == 3 || cardLevel == 3){
                    str+= "\n可激活3级球星技能";
                }
                break;
        }
        return str;
    }
    /**
     * 成功率
    */
    private getGrowRate(currentLv:number, cardStrLv:number):number{
        let num:number;
        switch(currentLv){
            case 1:
                num = 1
                break;
            case 2:
                num = 0.8+(cardStrLv-1)*0.1;
                break;
            case 3:
                if(cardStrLv<3){
                    num = 0.6+(cardStrLv-1)*0.13;
                }else{
                    num = 1;
                }
                break;
            case 4:
                num = 0.4+(cardStrLv-1)*0.15;
                break;
            case 5:
                num = 0.3+(cardStrLv-1)*0.14;
                break;
            case 6://①	+5及以下，球员卡每提升1级，成功率+5%②	+5以上，球员卡每提升1级，成功率+15%③	+7以上球员卡成功率为100%
                num = 0.2
                if(cardStrLv < 5){
                    num+= (cardStrLv-1)*0.05;
                }else if(cardStrLv<7){
                    num+= (cardStrLv-1)*0.15;
                }else{
                    num = 1;
                }
                break;
            case 7://①	+5及以下，每提升1级，成功率+5%②	+5以上，每提升1级，成功率+15%③	+8以上球员卡成功率为100%
                num =0.1
                if(cardStrLv < 5){
                    num += (cardStrLv-1)*0.05;
                }else if(cardStrLv < 8){
                    num += (cardStrLv-1)*0.15;
                }else {
                    num = 1;
                }
                break;
            case 8://①	+5及以下，每提升1级，成功率+5%②	+5以上，每提升1级，成功率+15%③	+9球员卡成功率为100%
                num = 0.05
                if(cardStrLv < 5){
                    num += (cardStrLv-1)*0.05;
                }else if(cardStrLv < 9){
                    num += (cardStrLv-1)*0.15;
                }else{
                    num = 1;
                }
                break;
            case 9:
                num = 0;
                break;
        }
        return Math.floor(Math.min(num ,1)*100);
    }
}
