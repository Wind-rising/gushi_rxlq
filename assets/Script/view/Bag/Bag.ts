import BagData from "./BagData";
import switch_page from "../public/switch_page";
import Events from "../../signal/Events";
import Utils from "../../utils/Utils";
import BagItem from "./BagItem";
import Alert from "../public/Alert";
import ErrMsg from "../../data/ErrMsg";
import ManagerData from "../../data/ManagerData";

const {ccclass,property} = cc._decorator;

//背包UI系统
@ccclass
export default class Bag extends cc.Component{
    @property(cc.Button)//关闭界面
    private btnClose:cc.Button;
    @property([cc.Node])//导航头
    private switch_head:Array<cc.Node> = [];
    @property(cc.Node)//也换内容
    private switch_content:cc.Node;
    @property(cc.Node)//也换内容
    private switch_pageNum:cc.Node;
    @property(cc.Node)//上一页
    private bagPrev:cc.Node;
    @property(cc.Node)//下一页
    private bagNext:cc.Node;
    @property(cc.Button)//扩展按钮
    private expansionButton:cc.Button;
    @property(cc.Button)//整理按钮
    private arrangeButton:cc.Button;
    @property(cc.Node)//物品介绍模块
    private goodsUI:cc.Node;
    @property(cc.Node)//物品操作模块
    private buttonUI:cc.Node;
    @property(cc.Node)//物品信息模块
    private infoProp:cc.Node;

    private _srcItems = null;
    private _pageCom = null;
    private NavItemPrefabComponent = "BagSwitchHead"
    private BASIC_BAG_NUM = 36;
    private EXTEND_NUM = 6;

    start(){
        this.init();
        this.addListener();
    }
    onDestroy(){
        this.removeListener();
    }
    public addListener(){
        Events.getInstance().addListener("BagPageChange",this.page_change,this)
        Events.getInstance().addListener("BagClick",this.onItemClick,this)
        Events.getInstance().addListener("BagNavClick",this.onPageChange,this)
    }
    public removeListener(){
        Events.getInstance().removeListener("BagPageChange",this.page_change,this)
        Events.getInstance().removeListener("BagClick",this.onItemClick,this)
    }
    public init(){
        this.btnClose.clickEvents.push(
            Utils.bindBtnEvent(this.node,'Bag','onClose')
        )
        this.expansionButton.clickEvents.push(
            Utils.bindBtnEvent(this.node,'Bag','onExpansion')
        )
        this._pageCom = new switch_page(this.bagPrev,this.bagNext,this.switch_pageNum,"BagPageChange",{
            "main":BagData.getInstance(),
            "pageNum":"_currentPage",
            "pageCount":"_count"
        })
        BagData.getInstance().getItemList((items)=>{
            this.onGetItems(items);
        });
    }
    public onExpansion(){
        if(BagData.getInstance().INum >= BagData.getInstance().MAX_PAGECOUNT){
            Utils.showAlert('背包已扩容至最大！')
        }else{
            let time = (BagData.getInstance().INum - this.BASIC_BAG_NUM)/6 + 1;
            let extendPoint = Math.min(time*this.BASIC_BAG_NUM,BagData.getInstance().MAX_PAGECOUNT);
            Utils.alert(`扩展${this.EXTEND_NUM}格背包需要消耗${extendPoint}球票`,()=>{
                BagData.getInstance().extendBag(this.onExtend)
            },{
                'title':'扩充背包',
                'parent':this.node
            })
        }
    }
    public onClose(){
        this.node.parent.destroy();
        this.node.destroy();
    }
    public onGetItems(items){
        this._srcItems = items;
        this._pageCom.max = BagData.getInstance().INum;
        let page = BagData.getInstance()._currentPage;
        BagData.getInstance()._data = items;
        if(BagData.getInstance()._currentPage == page){
            Events.getInstance().dispatch('BagPageChange')
        }
    }
    public onExtend(data){
        if(data.res){
            BagData.getInstance().INum += this.EXTEND_NUM;
            BagData.getInstance().getItemList(this.onGetItems);
            if(data.data.SyncData['Point']){
                ManagerData.getInstance().Point = data.data.SyncData.Point;
            }
        }else{
            Utils.showAlert(ErrMsg.getInstance().getErr(data.code));
        }
    }
    public onPageChange(index){
        for(let i = 0;i<this.switch_head.length;i++){
            if(i == index){
                continue;
            }
            this.switch_head[i].getComponent(this.NavItemPrefabComponent).active_off();
        }
        switch(index){
            case 0:
                BagData.getInstance().nowIndex = 0;
                BagData.getInstance().getItemList((items)=>{
                    this.onGetItems(items);
                });
                BagData.getInstance()._currentPage = 0;
                this.page_change();
                break;
            case 1:
                BagData.getInstance().nowIndex = 1;
                BagData.getInstance().getItemByTypes([BagItem.TYPE_PLAYER],(items)=>{
                    this._srcItems = items;
                });
                this._pageCom.max = this._srcItems.length?this._srcItems.length:0;
                this.page_other_change();
                break;
            case 2:
                BagData.getInstance().nowIndex = 2;
                BagData.getInstance().getItemByTypes([BagItem.TYPE_OTHER,BagItem.TYPE_ITEM,,BagItem.TYPE_TICKET,,BagItem.TYPE_STRENGTHEN_HELPER,,BagItem.TYPE_CARDL,,BagItem.TYPE_SIGNER,,BagItem.TYPE_CLOTHES,,BagItem.TYPE_MAP],(items)=>{
                    this._srcItems = items;
                });
                this._pageCom.max = this._srcItems.length?this._srcItems.length:0;
                this.page_other_change();
                break;
        }
    }
    public async page_change(){
        if(BagData.getInstance().nowIndex!=0){
            this.page_change();
            return;
        }
        this.switch_content.removeAllChildren();
        let state = (BagData.getInstance()._count*(BagData.getInstance()._currentPage+1))<BagData.getInstance().INum - 1 ;
        let nowBagItem = 0;
        if(!state){
            nowBagItem = BagData.getInstance()._count*(BagData.getInstance()._currentPage+1) - (BagData.getInstance().INum - 1);
        }
        for(let i = 0; i<BagData.getInstance()._count;i++){
            if(state){
                if(this._srcItems[i + BagData.getInstance()._count*BagData.getInstance()._currentPage]){
                    let obj = this._srcItems[i + BagData.getInstance()._count*BagData.getInstance()._currentPage];
                    // obj.sComponent.refresh()
                    obj.parent = this.switch_content;
                }else{
                    await BagData.getInstance().createBagItem(0,this.switch_content)
                }
            }else{
                if(i<(BagData.getInstance()._count - nowBagItem+1)){
                    if(this._srcItems[i + BagData.getInstance()._count*BagData.getInstance()._currentPage]){
                        let obj = this._srcItems[i + BagData.getInstance()._count*BagData.getInstance()._currentPage];
                        // obj.sComponent.refresh()
                        obj.parent = this.switch_content;
                    }else{
                        await BagData.getInstance().createBagItem(0,this.switch_content)
                    }
                }else{
                    await BagData.getInstance().createBagItem(-1,this.switch_content)
                }
            }
        }
    }
    public async page_other_change(){
        this.switch_content.removeAllChildren();
        for(let i = 0; i<BagData.getInstance()._count;i++){
            if(this._srcItems[i + BagData.getInstance()._count*BagData.getInstance()._currentPage]){
                let obj = this._srcItems[i + BagData.getInstance()._count*BagData.getInstance()._currentPage];
                obj.parent = this.switch_content;
            }else{
                await BagData.getInstance().createBagItem(0,this.switch_content)
            }
        }
    }
    public async onItemClick(e,info){
        this.goodsUI.removeAllChildren();
        this.buttonUI.removeAllChildren();
        await BagData.getInstance().createShowUI(e,info,this.goodsUI);
        await BagData.getInstance().createButtonUI(e,info,this.buttonUI);
        // if(e == BagItem.TYPE_PLAYER){
        //     await BagData.getInstance().createShowUI(e,info,this.goodsUI);
        // }else if(e == BagItem.TYPE_EQUIP){
        //     await BagData.getInstance().createShowUI(e,info,this.goodsUI);
        // }else if(e == BagItem.TYPE_RING){
        //     await BagData.getInstance().createShowUI(e,info,this.goodsUI);
        // }else{
        //     await BagData.getInstance().createShowUI(e,info,this.goodsUI);
        // }
    }
}