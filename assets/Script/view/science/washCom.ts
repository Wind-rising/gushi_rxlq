
import Utility from "../../utils/Utility";
import ScienceData from "./ScienceData"
import ItemData from "../../data/ItemData";
import URLConfig from "../../config/URLConfig";
import HttpManager from "../../utils/HttpManager";
import ManagerData from "../../data/ManagerData";
import SwitchCom from "./SwitchCom";
const {ccclass,property} = cc._decorator;

@ccclass    
export default class washCom extends SwitchCom{
    @property(cc.Sprite)
    private icon:cc.Sprite = null;
    @property(cc.RichText)
    private EName:cc.RichText = null;
    @property([cc.RichText])
    private attrName:Array<cc.RichText> = [];
    @property([cc.Button])
    private attrButton:Array<cc.Button> = [];
    @property([cc.Sprite])
    private attrStateUI:Array<cc.Sprite> = [];
    @property(cc.SpriteFrame)
    public attr_on:cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    private attr_lock:cc.SpriteFrame = null;
    @property(cc.Label)
    private tip:cc.Label = null; 
    @property(cc.Button)
    private washButton:cc.Button = null;
    private _activBtnNum:number = 0;
    private _freeTimes:number;
    private isSelect = [];
    private WASH_POINTS = [20,60, 80, 120];
    start(){
        this.onClick()
    }

    public onClick(){
        this.washButton.clickEvents.push(
            Utility.bindBtnEvent(this.node,"washCom","wash")
        )
        for(let i = 0;i<this.attrButton.length;i++){
            this.attrButton[i].clickEvents.push(
                Utility.bindBtnEvent(this.node,"washCom","onAttrState",[i])
            )
        }
    }
    public show(isFresh = false){
        super.show();
        isFresh&&this.setSelectItem(true);
    }

    public setSelectItem(isClear = false){
        if(isClear){
            this.icon.spriteFrame = null;
            this.isSelect = [];
            for(let i = 0;i<this.attrName.length;i++){
                this.attrName[i].string = "";
                this.attrButton[i].interactable = false;
                this.attrStateUI[i].spriteFrame = null;
            }
            this.EName.string = "";
            this.tip.string = "";
            this.washButton.interactable = false;
        }
        // interactable
        this._activBtnNum = 0;
        if(ScienceData.selectEquip){
            let selectEquip = ScienceData.selectEquip;
            this.icon.spriteFrame = selectEquip.pic.getComponent(cc.Sprite).spriteFrame;
            this.EName.string = selectEquip.EName.getComponent(cc.RichText).string;
            for(let i = 0;i<this.attrName.length;i++){
                if(selectEquip._data.Hole[i]){
                    let holeInfo = ItemData.getInstance().getHoleInfo(selectEquip._data.Hole[i]);
                    if(holeInfo){
                        let color = ItemData.getInstance().getCardColor(holeInfo.Color);
                        color = color.replace('#','0x');
                        this.attrName[i].string = `<color=${color}>${holeInfo.Desc}</c>`
                    }
                    this._activBtnNum++;
                    this.attrButton[i].interactable = true;
                    this.attrStateUI[i].spriteFrame = null;
                }else{
                    this.attrButton[i].interactable = false;
                    this.attrStateUI[i].spriteFrame = this.attr_lock;
                    if(i == 0){
                        this.attrName[i].string = `<color=0x999999>装备等级Lv10开放</c>`
                    }else if(i==1){
                        this.attrName[i].string = `<color=0x999999>装备等级Lv20开放</c>`
                    }else{
                        this.attrName[i].string = `<color=0x999999>装备等级Lv50开放</c>`
                    }
                }
            }
            this.washButton.interactable = true;
            this.formatPoint();
        }
    }
    public onAttrState(e,i){
        if(!this.isSelect[i]){
            if(this.countLockedBtn() + 1 >= this._activBtnNum){
                console.log("不能锁定所有属性")
            }else{
                if(this.isSelect[i]){
                    this.isSelect[i] = false;
                    this.attrStateUI[i].spriteFrame = null;
                }else{
                    this.isSelect[i] = true;
                    this.attrStateUI[i].spriteFrame = this.attr_on;
                }
            }
        }else{
            if(this.isSelect[i]){
                this.isSelect[i] = false;
                this.attrStateUI[i].spriteFrame = null;
            }else{
                this.isSelect[i] = true;
                this.attrStateUI[i].spriteFrame = this.attr_on;
            }
        }
        this.formatPoint();
    }
    public wash(){
        if(ScienceData.selectEquip.Lvl < 10){
            
        }else{
            let lockArr = [];
            for(let i = 0;i<this.attrName.length;i++){
                if(this.isSelect[i]&&this.attrButton[i].interactable){
                    lockArr.push(i);
                }
            }
            var srvArgs = {action:URLConfig.Post_Equip_Wash,args:{
                Source:ScienceData.selectPlayer._data.Tid,
                Uuid:ScienceData.selectEquip.id,
                Keep:lockArr.join(',')
            }};
            HttpManager.getInstance().request(srvArgs,this.onWash,this);
        }
    }
    public onWash(data){
        if(data.res){
            ScienceData.selectEquip._data = data.data.SyncData.Equip;

            if(data.data.SyncData.hasOwnProperty("Point")){
                ManagerData.getInstance().Point = data.data.SyncData.Point;
            }
            if(data.data && data.data.SyncData.Score){
                ManagerData.getInstance().Score = parseInt(data.data.SyncData.Score);
            }
            if(!ScienceData.selectPlayer._data.Tid){
                
            }
            this.setSelectItem();
            this._freeTimes --;
            this.formatPoint();
            ManagerData.getInstance().refreshKP();
        }
    }
    public getWashCost(){
        var srvArgs = {action:URLConfig.Post_Equip_WashCost};
        HttpManager.getInstance().request(srvArgs,this.onGetWash,this);
    }
    public onGetWash(data){
        if(data.res){
            if(data.data && data.data.SyncData){
                this._freeTimes = parseInt(data.data.SyncData.Free);
                this.formatPoint();
            }
        }
    }
    public formatPoint()
		{
			if(this._freeTimes>0){
				this.tip.string = "免费次数："+this._freeTimes
			}else{
				let lockNum =0;
				for(let i = 0; i<this.attrName.length; i++){
                    if(this.isSelect[i]&&this.attrButton[i].interactable){
                        lockNum++;
                    }
				}
				this.tip.string = "球票："+ this.WASH_POINTS[lockNum];
			}
        }
    private  countLockedBtn():number{
        var num:number=0;
        for(let i = 0; i<this.attrName.length; i++){
            if(this.isSelect[i]&&this.attrButton[i].interactable){
                num++;
            }
        }
        return num;
    }
}