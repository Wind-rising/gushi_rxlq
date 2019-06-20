
/**
 * 球员培养
 */
const {ccclass, property} = cc._decorator;
import Utility from "../../utils/Utility";
import PlayerUtil from "../../utils/PlayerUtil";
import ManagerData from "../../data/ManagerData";
import HttpManager from "../../utils/HttpManager";
import URLConfig from "../../config/URLConfig";
import ErrMsg from "../../data/ErrMsg";
import Events from "../../signal/Events";
import PlayerControllor from "../../controllor/PlayerControllor";
import PlayerManage from "./PlayerManage";
@ccclass
export default class PlayerTrain extends cc.Component {

    EventListenerTag:string = 'PlayerTrainListener';
    attrlist:Array<string> = ['attack','defend','skill','strength','body'];
    private LOCK_POINTS:Array<number> = [0,10, 30, 70, 150];
    private POINT:number = 20;

    /** 训练属性增加值 */
    totalExtPro:number = 0;
    /** 训练结果 */
    currentExData:Object = null;
    /** 训练类型 */
    trainType:number = 1;//普通培养 1 巨星培养 2
    /** 属性锁定数量 */
    selectedNum:number = 0;

    // LIFE-CYCLE CALLBACKS:
    playerInfo:Object = null;
    needRefresh:boolean = false;

    /**---UI节点---- */
    nod_attr_list:cc.Node[] = null;
    toggleList:cc.Toggle[] = null;

    toggle_type:cc.ToggleContainer = null;
    lbl_train_cost:cc.RichText = null;
    lbl_total_money:cc.Label = null;
    lbl_total_point:cc.Label = null;
    btn_save:cc.Button = null;
    btn_train:cc.Button = null;


    onLoad () {
        
        this.needRefresh = true;

        this.lbl_total_money = this.node.getChildByName('lbl_total_money').getComponent(cc.Label);
        this.lbl_total_point = this.node.getChildByName('lbl_total_point').getComponent(cc.Label);
        this.btn_train = this.node.getChildByName('btn_train').getComponent(cc.Button);
        this.btn_save = this.node.getChildByName('btn_save').getComponent(cc.Button);
        this.toggle_type = this.node.getChildByName('toggle_type').getComponent(cc.ToggleContainer);
        this.lbl_train_cost = this.node.getChildByName('lbl_train_cost').getComponent(cc.RichText);

        this.nod_attr_list = [];
        this.toggleList = [];
        for(let i = 0;i<5;i++){
            let nod_attr = this.node.getChildByName('nod_attr_'+i);
            let toggle = nod_attr.getChildByName('toggle_lock').getComponent(cc.Toggle);
            toggle.isChecked = false;
            toggle.checkEvents.push(
                Utility.bindBtnEvent(this.node,'PlayerTrain','checkAttrLock',i+'')
            );
            this.toggleList.push(toggle);
            this.nod_attr_list.push(nod_attr);
        }
        this.btn_train.clickEvents.push(
            Utility.bindBtnEvent(this.node,'PlayerTrain','onPlayerTrain')
        );
        this.btn_save.clickEvents.push(
            Utility.bindBtnEvent(this.node,'PlayerTrain','onSave')
        );

        /** 普通培养 巨星培养切换 */
        this.toggle_type.toggleItems[(this.trainType-1)].isChecked = true;
        this.toggle_type.checkEvents.push(
            Utility.bindBtnEvent(this.node,'PlayerTrain','selectedTrainType')
        );

        this.node.on('selectedPlayer',(playerInfo)=>{
            //选中球员的时候被调用
            this.playerInfo = playerInfo;
            if(this.node.active){
                this.formatData();
            }else{
                this.needRefresh = true;
            }
        });

        Events.getInstance().addListener(ManagerData.PROPERTY_CHANGED,()=>{
            this.lbl_total_money.string = ''+ManagerData.getInstance().Money;
            this.lbl_total_point.string = ''+ManagerData.getInstance().Point;
        },this,this.EventListenerTag);
        
    }

    onDestroy(){
        Events.getInstance().removeByTag(this.EventListenerTag);
    }

    onEnable () {
        if(this.needRefresh){
            this.formatData();
        }
    }

    // update (dt) {}

    

    /** 切换选中球员的时候调用 */
    formatData () {
        this.needRefresh = false;
        this.playerInfo = PlayerControllor.getInstance().playerInfo;
        for(let i = 0;i<this.nod_attr_list.length;i++){
            this.toggleList[i].isChecked = false;
        }
        //上次培养的信息
        this.btn_save.interactable = false;
        //this.btn_train.interactable = false;
        
        this.formatPro();
        this.getPYData();
        
        this.toggle_type.toggleItems[(this.trainType-1)].isChecked = true;
    }

    /** 培养按钮 */
    onPlayerTrain (){
        var lockList = [];
        for(let i=0; i<this.nod_attr_list.length; i++){
            if(this.toggleList[i].isChecked){
                lockList.push(i+1);
            }
        }
        let args  = {Tid:this.playerInfo['Tid'], Type:this.trainType, Lock:lockList.toString()};
        HttpManager.getInstance().request({args:args,action:URLConfig.Post_Team_PyPlayer},(responce)=>{
            if(responce['res']){
                this.btn_save.interactable = true;
                //this.btn_train.interactable = false;
				//
				this.currentExData = responce['data']['Post_Team_PyPlayer'];
				this.formatEx();
				//
				if(responce['data']['SyncData']['Money']){
					ManagerData.getInstance().Money = responce['data']['SyncData']['Money'];
				}
				if(responce['data']['SyncData']['Point']){
					ManagerData.getInstance().Point = responce['data']['SyncData']['Point'];
                }
			}else{
				Utility.fadeErrorInfo(ErrMsg.getInstance().getErr(responce['code']));
			}
        });
    }
    /** 保存按钮 */
    onSave (e:cc.Event.EventTouch){
        let mode = 1;
        let args  = {Tid:this.playerInfo['Tid'], Mode:mode};
        HttpManager.getInstance().request({args:args,action:URLConfig.Post_Team_PyPlayerSave},(responce)=>{
            if(responce['res']){
                if(responce.data && responce.data.SyncData.Score)
                    ManagerData.getInstance().Score = parseInt(responce.data.SyncData.Score);
                //this.btn_save.interactable = false;
                //this.btn_train.interactable = true;
                if(mode ==1){
                    this.playerInfo['PptPy'] = this.currentExData;
                }
                // this.formatPro();
                // this.formatEx();
                //更新数据============
                Events.getInstance().dispatch(PlayerManage.REFRESH,[this.playerInfo]);
            }
        });
    }

    /** 锁定属性 */
    checkAttrLock (e:cc.Toggle,customData:string){
        let selectedNum:number =0;
        for(let i=0; i<this.toggleList.length; i++){
            if(this.toggleList[i].isChecked){
                selectedNum ++;
            }
        }
        if(selectedNum>=5){
            Utility.fadeErrorInfo("亲~最大只能锁定四项属性哦~");
            e.isChecked = false;
        }else{
            this.caculateTotalMoney();
        }
    }

    /** 获得培养数据 */
    private getPYData():void{
        let args  = [{"n":URLConfig.PlayerPy, "i":{Tid:this.playerInfo['Tid']}}];
        HttpManager.getInstance().request({args:args,action:URLConfig.Get_Data},(responce)=>{
            if(responce['res']){
                this.currentExData = responce['data'][0];
                if(this.isValidate(this.currentExData)){
                    this.btn_save.interactable = true;
                }else{
                    this.currentExData = this.playerInfo['PptPy'];
                    this.btn_save.interactable = false;
                }
                this.formatEx();
			}
        });
    }
    //判定附加属性是否有效
    private isValidate(obj:Object):boolean{
        for(let i in obj){
            if(obj[i]){
                return true;
            }
        }
        return false;
    }
    /** 训练类型选择 */
    selectedTrainType (e){
        if(e.node.name == 'toggle1'){
            this.trainType = 1;
        }else{
            this.trainType = 2;
        }
        this.caculateTotalMoney();
    }
    /** 基础球员属性 */
    private formatPro () {
        for(let i = 0;i<this.attrlist.length;i++){
            let key = this.attrlist[i];
            let value = PlayerUtil.getTotalPro(key, this.playerInfo, 2);
            this.nod_attr_list[i].getChildByName('lbl_value').getComponent(cc.Label).string = value+"";
            let num1:number = PlayerUtil.getBigPro(key, this.playerInfo['basicData']);
            let num2:number = PlayerUtil.getBigPro(key, this.playerInfo['PptPy']);
            let lv:number = ManagerData.getInstance().Level;
            if(Math.floor(num1*(0.2+0.04*lv)) <= num2){
                this.nod_attr_list[0].getChildByName('lbl_max_tag').active = true;
            }else{
                this.nod_attr_list[0].getChildByName('lbl_max_tag').active = false;
            }
        }
    }
    /** 训练增加值 */
    private formatEx () {
        let extData:Object = PlayerUtil.getMinus(this.currentExData, this.playerInfo['PptPy']);
        this.totalExtPro = 0;
        for(let i = 0;i<this.attrlist.length;i++){
            let key = this.attrlist[i];
            let value = PlayerUtil.getTotalPro(key, this.playerInfo, 2);
            let exNum = PlayerUtil.getBigPro(key, extData);
            let exStr = PlayerUtil.getNumStr(exNum);
            this.totalExtPro += exNum;
            this.nod_attr_list[i].getChildByName('lbl_value_new').getComponent(cc.Label).string = value+exStr;
        }
        for(let i = 0;i < this.attrlist.length;i++){
            let img_flat = this.nod_attr_list[i].getChildByName('img_flat');
            let img_up = this.nod_attr_list[i].getChildByName('img_up');
            let img_down = this.nod_attr_list[i].getChildByName('img_down');
            if(this.totalExtPro == 0){
                img_up.active = false;
                img_down.active = false;
                img_flat.active = true;
                img_flat.getComponent(cc.Animation).stop();
            }else{
                let key = this.attrlist[i];
                let exNum = PlayerUtil.getBigPro(key, extData);
                img_up.active = exNum>0;
                img_flat.active = exNum == 0;
                img_down.active = exNum < 0;
                if(exNum>0){
                    img_up.getComponent(cc.Animation).play('up_down');
                }else if(exNum<0){
                    img_down.getComponent(cc.Animation).play('up_down');
                }else{
                    img_flat.getComponent(cc.Animation).play('up_down');
                }
            }
        }
    }

    /**计算总额*/
    private caculateTotalMoney():void{
        let selectedNum:number =0;
        for(let i=0; i<this.toggleList.length; i++){
            if(this.toggleList[i].isChecked){
                selectedNum ++;
            }
        }
        let str = '合计需要<color=#52DD3C>%s</color>金币，需要<color=#52DD3C>%s</color>球票/次培养';

        if(this.trainType == 1){
            str = cc.js.formatStr(str,this.getmoney()+'',this.LOCK_POINTS[selectedNum]+"");
        }else{
            str = cc.js.formatStr(str,'0',(this.LOCK_POINTS[selectedNum]+this.POINT)+"");
        }
        this.lbl_train_cost.string = str;
    }

    private getmoney():number{
        return (ManagerData.getInstance().Level*37+40);
    }
}
