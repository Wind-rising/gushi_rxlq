
import SwitchCom from "./SwitchCom";
import ScienceData from "./ScienceData"
import EquipData from "../../data/EquipData";
import ItemData from "../../data/ItemData";
import Events from "../../signal/Events";
import Utility from "../../utils/Utility";
import BagData from "../Bag/BagData";
import BagItem from "../Bag/BagItem";
import IconManager from "../../config/IconManager";
import HttpManager from "../../utils/HttpManager";
import URLConfig from "../../config/URLConfig";
import ManagerData from "../../data/ManagerData";
const {ccclass,property} = cc._decorator;

@ccclass    
export default class SignCom extends SwitchCom{
    @property(cc.Sprite)
    private icon:cc.Sprite = null;
    @property(cc.RichText)
    private CName:cc.RichText = null;
    @property(cc.RichText)
    private haveSignUI:cc.RichText = null;
    @property(cc.Sprite)
    private SignIcon:cc.Sprite = null;
    @property(cc.RichText)
    private SignName:cc.RichText = null;
    @property(cc.RichText)
    private SignInfo:cc.RichText = null;
    @property(cc.RichText)
    private SignEffect:cc.RichText = null;
    @property(cc.RichText)
    private SignMoney:cc.RichText = null;
    @property(cc.Button)
    private signButton:cc.Button = null;
    @property(cc.Button)
    private openBag:cc.Button = null;
    public _data;
    public isInit = false;
    onDestroy(){
        this.removeListener();
    }


    public onBag(){
        BagData.getInstance().nowType = [BagItem.TYPE_SIGNER];
        Utility.showDialog('bag/Bag');
    }
    public show(isFresh = false){
        super.show();
        isFresh&&this.setSelectItem(true);
    }
    public addListener(){
        Events.getInstance().addListener("signClick",this.onSignClick,this)
    }
    public removeListener(){
        Events.getInstance().removeListener("signClick",this.onSignClick,this)
    }
    
    public setSelectItem(isClear = false){
        if(!this.isInit){
            this.isInit = !this.isInit;
            this.openBag.clickEvents.push(
                Utility.bindBtnEvent(this.node,'SignCom','onBag')
            )
            this.signButton.clickEvents.push(
                Utility.bindBtnEvent(this.node,'SignCom','onSign')
            )
            this.addListener();
        }
        if(isClear){
            this.icon.spriteFrame = null;
            this.CName.string = '';
            this.haveSignUI.string = '';
            this.SignIcon.spriteFrame = null;
            this.SignName.string = '';
            this.SignInfo.string = '';
            this.SignEffect.string = '';
            this.SignMoney.string = '';
            this.signButton.interactable = false;
            this._data = null;
        }
        if(ScienceData.selectEquip){
            let obj = ScienceData.selectEquip;
            let data = ScienceData.selectEquip._itemData;
            this.CName.string = obj.EName.getComponent(cc.RichText).string;
            this.icon.spriteFrame = obj.pic.getComponent(cc.Sprite).spriteFrame;
            let str = ``;
            if(data.Attr_1_Name){
                str += `${data.Attr_1_Name}+${this.getTotalPro(data.Attr_1_Num,data.Grow,data.Lvl)}\n`
            }
            if(data.Attr_2_Name){
                str += `${data.Attr_2_Name}+${this.getTotalPro(data.Attr_2_Num,data.Grow,data.Lvl)}\n`
            }
            if(obj._data.Sign){
                let itemInfo = ItemData.getItemInfo(obj._data.Sign);
                if(itemInfo){
                    let color = 5;
                    if(itemInfo.Effect){
                        let tempArr = String(itemInfo.Effect).split(';');
                        for(let i = 0;i<tempArr.length;i++){
                            if(String(tempArr[i]).indexOf('color') != -1){
                                color = String(tempArr[i]).split(':')[1];
                                break;
                            }
                        }
                    }
                    let htmlStr = `<b><color=${ItemData.getCardColor(5-color)}>${itemInfo.Name}</c></b>\n`;
                    let desArr = (itemInfo.Desc+"").split('</p>')
                    if(desArr[1]){
                        desArr = (desArr[1]+'').split('<br/>');
                    }
                    htmlStr += `<color=${ItemData.getCardColor(5-color)}>${desArr[1]}</c>`;
                    this.haveSignUI.string = htmlStr;
                }
            }

            this.signButton.interactable = true;
        }
    }
    public onSignClick(data){
        // if(data){
        //     this._data = data;
        //     if(data.source){
        //         data.source.isLocked = false;
        //     }
        //     if(data.parent)
        // }
        this._data = data;
        this.SignIcon.spriteFrame = null;
        this.SignName.string = '';
        this.SignInfo.string = '';
        this.SignEffect.string = '';
        this.SignMoney.string = '';
        if(data){
            let color = 5;
            let itemInfo = ItemData.getItemInfo(data.ItemCode);
            if(itemInfo.Effect){
                let tempArr = String(itemInfo.Effect).split(";");
                for(let i = 0;i<tempArr.length;i++){
                    if(String(tempArr[i]).indexOf('color')!=-1){
                        color = String(tempArr[i]).split(":")[1];
                        break;
                    }
                }
            }
            IconManager.getIcon(itemInfo.Image+"",IconManager.ITEM_ICON,(spriteFrame)=>{
                this.SignIcon.spriteFrame = spriteFrame;
            });
            this.SignName.string =`<color=${ItemData.getCardColor(5-color)}>${itemInfo.Name}</c>`;
            let strList = (itemInfo.Desc+"").split("</p>");
            let tempStr = (strList[0]+"").replace("<p>","");
            tempStr = tempStr.replace("<br/>","\t");
            this.SignInfo.string = tempStr;
            this.SignMoney.string = `花费：${EquipData.getSignMoney(color).money}球票`
            tempStr = (strList[1]+"").replace("<p>","");
            this.SignEffect.string = tempStr.replace("<br/>","");

        }
        
    }
    public onSign(){
        if(!this._data){
            Utility.showAlert('需要签名纸');
        }else if(!ScienceData.selectEquip){
            Utility.showAlert('需要装备');
        }else{
            if(ScienceData.selectEquip._data.Sign){
                let itemInfo = ItemData.getItemInfo(ScienceData.selectEquip._data.Sign);
                let htmlStr = '';
                if(itemInfo){
                    let color = 5;
                    if(itemInfo.Effect){
                        let tempArr = String(itemInfo.Effect).split(';');
                        for(let i = 0;i<tempArr.length;i++){
                            if(String(tempArr[i]).indexOf("color") != -1){
                                color = String(tempArr[i]).split(":")[1];
                                break;
                            }
                        }
                    }
                    htmlStr = `装备已有签名<color=${ItemData.getCardColor(5-color)}>${itemInfo.Name}</c>,是否替换为`;
                    itemInfo = ItemData.getItemInfo(this._data.ItemCode);
                    if(itemInfo.Effect){
                        let tempArr = String(itemInfo.Effect).split(';');
                        for(let i = 0;i<tempArr.length;i++){
                            if(String(tempArr[i]),indexOf("color") != -1){
                                color = String(tempArr[i]).split(":")[1];
                                break;
                            }
                        }
                    }
                    htmlStr += `<color=${ItemData.getCardColor(5-color)}>${itemInfo.Name}</c>`;
                }
                Utility.alert(htmlStr,()=>{
                    this.onConfirmSign();
                });
            }else{
                this.onConfirmSign();
            }
        }
    }

    public onConfirmSign(){
        let srvArgs = {
            action:URLConfig.Post_Equip_Sign,
            args: {
                Source:ScienceData.selectPlayer._data.Tid,
                Uuid:ScienceData.selectEquip.id,
                Sign:this._data.Uuid
            }
        };
        HttpManager.getInstance().request(srvArgs,this.sign,this);
    }
    public sign(data){
        if(data.res){
            ScienceData.selectEquip._data = data.data.SyncData.Equip;
            if(data.data.SyncData['Point']){
                ManagerData.getInstance().Point = data.data.SyncData.Point;
            }
            if(data.data.SyncData.Money){
                ManagerData.getInstance().Money = data.data.SyncData.Money;
            }
            this.setSelectItem(ScienceData.selectEquip);
            ManagerData.getInstance().refreshKP();
        }
    }
    
    public getTotalPro(basic,growV,lv){
        return parseInt(basic - 0 + growV * Math.max(0,(lv-1)) + '')
    }
}