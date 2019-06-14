import Utility from "../../utils/Utility";
import BagData from "./BagData";
import Events from "../../signal/Events";
import ItemData from "../../data/ItemData";
import IconManager from "../../config/IconManager";

const {ccclass,property} = cc._decorator;

//背包UI系统
@ccclass
export default class BagItem extends cc.Component{
    @property(cc.Node)//关闭界面
    private goodsItem:cc.Node = null;
    @property(cc.Node)//关闭界面
    private unlock:cc.Node= null;
    @property(cc.Label)//关闭界面
    private numUI:cc.Label= null;
    @property(cc.Sprite)//关闭界面
    private playerNum:cc.Sprite= null;
    public ItemCode:string;
    public _isLocked = false;
    public _data = null;
    /**道具Uuid，唯一索引*/
    public  Uuid;
    /**道具UUid列表-能叠加的道具*/
    public  Uuids;
    /**ItemName*/
    public  itemName;
    /***/
    public  Num;
    /**场上位置*/
    public  playPos;
    /**卡牌等级*/
    public  CardLevel=1
    /**装备信息-只有类型为装备时才有*/
    public  Equip;
    /**戒指才会有*/
    public  Ring;
    public Image;
    /**道具描述*/
    public  Desc;
    /**关联图片*/
    public _itemType:string;
    public isOutBag = false;
    /**常量-其他-球员最大属性1000-400为临时值*/
    public static  MAX_PLAYER_PRO = 400;
    
    public static  TYPE_OTHER = "3";
    /**常量-类型-门票*/
    public static  TYPE_TICKET  ="10";
    /**常量-类型-强化辅助*/
    public static  TYPE_STRENGTHEN_HELPER  ="12";
    /**常量-类型-材料*/
    public static  TYPE_STUFF = "13";
    /**常量-类型-卡包*/
    public static  TYPE_CARDL = "16";
    /**常量-类型-签名纸*/
    public static  TYPE_SIGNER = "17";
    /**常量-类型-球衣*/
    public static  TYPE_CLOTHES = "18";
    /**常量-类型-成长卡*/
    public static  TYPE_COMPOSE_0= "21";
    /**常量-类型-高阶成长卡*/
    public static  TYPE_COMPOSE_1 = "22";
    /**常量-类型-乔丹成长卡*/
    public static  TYPE_JORDAN = "28"
    /**常量-类型-戒指*/
    public static  TYPE_RING = "Ring";
    /**常量-类型-装备*/
    public static  TYPE_EQUIP = "Equip";
    /**常量-类型-道具*/
    public static  TYPE_ITEM = "Item";
    /**常量-类型-球员卡*/
    public static  TYPE_PLAYER = "Player";
    /**常量-类型-球魂*/
    public static  TYPE_BALLSOUL = "14";
    /**常量-类型-技能卡*/
    public static  TYPE_SKILLCARD = "SkillCard"
    /**常量-类型-强化石*/
    public static  TYPE_EQUIPSTONE = "EquipStone"
    /**常量-类型-图纸*/
    public static  TYPE_MAP = "15"; 
    public _info;
    start(){
        this.goodsItem.getComponent(cc.Button).clickEvents.push(
            Utility.bindBtnEvent(this.node,'BagItem','onClick')
        )  
    }
    onDestroy(){

    }
    //data
    public init(data = null){
        this._data = data;
        this.initData();
        if(data == 0){
            this.goodsItem.getComponent(cc.Button).interactable = false;
            this.goodsItem.getComponent(cc.Button).enabled = false;
            this.unlock.active = false;
        }else if(data == -1){
            this.goodsItem.getComponent(cc.Button).interactable = false;
            this.goodsItem.getComponent(cc.Button).enabled = false;
        }else{
            this.setValue(data);
            if(data.ItemCode){
                let info = ItemData.getInstance().getItemInfo(data.ItemCode);
                this._info = info;
                if(this.ItemType == BagItem.TYPE_EQUIP){
                    info = ItemData.getInstance().getEquipInfo(this.Equip.Type + "" + this.Equip.Pair);
                    if(info){
                        this.itemName = info.Name+"";
                        this.Desc = info.Desc;
                    }
                }else if(this.ItemType == BagItem.TYPE_RING){
					this.itemName = "总冠军戒指";
					//info = EquipData.getRingPro(data.Ring.Type);
				}else{
					if(info){
						this.isOutBag  = (parseInt(info.UseFlag) != 0);
						if(info.Type){
							this._itemType = info.Type;
						}
						this.itemName = info.Name+"";
						this.Image = info.Image;
						this.Desc = info.Desc;
						if(this.ItemType == BagItem.TYPE_PLAYER){
							this.playPos = info.Position
							this.CardLevel = info.CardLevel;
						}else if(this.ItemType == BagItem.TYPE_SIGNER){
							// if(info.Effect){
							// 	var tempArr:Array = String(info.Effect).split(";");
							// 	for(var i:uint=0; i<tempArr.length; i++){
							// 		if(String(tempArr[i]).indexOf("color") != -1){
							// 			CardLevel= 5-int(String(tempArr[i]).split(":")[1]);
							// 			break;
							// 		}
							// 	}
							// }
						}else if(this.ItemType == BagItem.TYPE_COMPOSE_0 ||this.ItemType == BagItem.TYPE_COMPOSE_1){
							// if(info.Effect){
							// 	this.Str = (info.Effect+"").split("_")[1]
							// }
						}
					}
				}
                this.goodsItem.getComponent(cc.Button).interactable = true;
                this.goodsItem.getComponent(cc.Button).enabled = true;
                this.unlock.active = false;
                this.createIcon();
                this.createNum();
            }
        }
    }
    public initData(){
        this.goodsItem.getComponent(cc.Sprite).spriteFrame = null;
        this.numUI.enabled = false;
        this.unlock.active = true;
        this.isLock = false;
        this.playerNum.enabled = false;
    }
    public onClick(){
        BagData.getInstance().nowItems = this;
        Events.getInstance().dispatch('BagClick',[this.ItemType,this._data]);
    }

    private createIcon(){
        if(this.ItemType == BagItem.TYPE_PLAYER){
            let pos = ItemData.getInstance().getLabel(this._info.Position - 0);
            IconManager.getIcon(`img_${this._info.CardLevel}${pos}`,IconManager.PLAYER_ITEM_ICON,(spriteFrame)=>{
                this.goodsItem.active = true;
                this.goodsItem.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                IconManager.getIcon(`img_${this._data.Str}${this._info.CardLevel}`,IconManager.PLAYER_ITEM_ICON,(spriteFrame)=>{
                    this.playerNum.enabled = true;
                    this.playerNum.spriteFrame = spriteFrame;
                    console.log(this.playerNum.spriteFrame)
                })
            })
        }else if(this.ItemType == BagItem.TYPE_EQUIP){
             IconManager.getIcon(this.Equip.Type + (this.Equip.Pair+'.png'),IconManager.EQUP_ICON,(spriteFrame)=>{
                this.goodsItem.active = true;
                this.goodsItem.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            })
        }else if(this.ItemType == BagItem.TYPE_CLOTHES||this._data.ItemType == BagItem.TYPE_RING){
            IconManager.getIcon(this.ItemCode+'.png',null,(spriteFrame)=>{
                this.goodsItem.active = true;
                this.goodsItem.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            })
        }else{
            IconManager.getIcon(this.Image+'.png',IconManager.ITEM_ICON,(spriteFrame)=>{
                this.goodsItem.active = true;
                this.goodsItem.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            })
        }
        // this.updateWillIcon();
    }
    private createNum(){
        if(this._data.Num>1){
            this.numUI.enabled = true;
            this.numUI.string = this._data.Num+"";
        }
    }

    public setValue(data){
        this._data = data;
        if(this._data){
            for(let i in this._data){
                if(!this[i]){
                    this[i] = this._data[i];
                }
            }
        }
    }

    public get ItemType(){
        var type = this.getItemType(parseInt(this.ItemCode));
        if(!type){
            type = this._itemType;
        }
        return type;
    }
    
    private getItemType(itemCode){
        var type:string  ="";
        if (parseInt(itemCode) < 1 ) {
        }else if ( parseInt(itemCode) < 6 ) {
            type = BagItem.TYPE_RING 
        }else if ( parseInt(itemCode) < 10 ) {
        }else if ( parseInt(itemCode) < 15 ) {
            type = BagItem.TYPE_EQUIP 
        }else if ( parseInt(itemCode) < 100 ) {
            
        }else if ( parseInt(itemCode) < 100000 ) {
        }else if ( parseInt(itemCode) < 200000 ) {
            type = BagItem.TYPE_PLAYER;
        }else if ( parseInt(itemCode) < 300000 ) {
        }else if ( parseInt(itemCode) < 400000 ) {
            type = BagItem.TYPE_BALLSOUL;
        }else if ( parseInt(itemCode) < 500000 ) {
            type = BagItem.TYPE_SKILLCARD;
        }else if ( parseInt(itemCode) < 600000 ) {
            type = BagItem.TYPE_EQUIPSTONE;
        }
        return type;
    }

    public set isLock(e){
        if(this._data == 0 || this._data == -1)return;
        if(this._isLocked != e){
            this._isLocked = e;
            if(this._isLocked){
                this.goodsItem.getComponent(cc.Button).interactable = false;
            }else{
                this.goodsItem.getComponent(cc.Button).interactable = true;
            }
        }
    }
}