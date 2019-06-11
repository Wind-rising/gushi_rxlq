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
    //导航-头集合
    @property([cc.Node])
    private nav_head:Array<cc.Node> = [];
    //导航-切换内容
    @property(cc.Node)
    private nav_content:cc.Node = null;
    //页面-页数
    @property(cc.Node)
    private page_num:cc.Node = null;
    //页面-上一页
    @property(cc.Node)
    private page_prev:cc.Node = null;
    //页面-下一页
    @property(cc.Node)
    private page_next:cc.Node = null; 
    //按钮-关闭页面
    @property(cc.Button)
    private btn_close:cc.Button = null;
    //按钮-扩展
    @property(cc.Button)
    private btn_expansion:cc.Button = null;
    //按钮-整理
    @property(cc.Button)
    private btn_arrange:cc.Button = null;
    //容器-物品介绍
    @property(cc.Node)
    private ctnr_goods:cc.Node = null;
    //容器-物品操作
    @property(cc.Node)
    private ctnr_operation:cc.Node = null;
    //容器-物品信息
    @property(cc.Node)//物品信息模块
    private ctnr_info:cc.Node = null;

    //一页背包个数
    private BASIC_BAG_NUM = 36;
    //背包扩充-球票参数
    private BASIC_EXTEND_POINT = 10;
    //背包扩充-个数
    private EXTEND_NUM = 6;
    //预制体脚本-导航头
    private prefab_script_nav_head = "BagSwitchHead"
    //当前背包物体对象
    private _srcItems = null;
    //切换对象
    private _pageCom = null;
    //背包展示类型列表
    public exceptTypeList = null;
    //背包展示ID列表
    public exceptIdLIst = null;

    //声明周期-加载
    start(){
        this.init();
        this.fn_addListener();
    }
    //声明周期-销毁
    onDestroy(){
        this.fn_removeListener();
    }

    public fn_addListener(){
        Events.getInstance().addListener("BagRresh",this.refresh,this)
        Events.getInstance().addListener("BagPageChange",this.page_change,this)
        Events.getInstance().addListener("BagClick",this.onItemClick,this)
        Events.getInstance().addListener("BagNavClick",this.onPageChange,this)
    }
    public fn_removeListener(){
        Events.getInstance().removeListener("BagRresh",this.refresh,this)
        Events.getInstance().removeListener("BagPageChange",this.page_change,this)
        Events.getInstance().removeListener("BagClick",this.onItemClick,this)
        Events.getInstance().removeListener("BagNavClick",this.onPageChange,this)
    }
    //初始化
    public init(){
        this.btn_close.clickEvents.push(
            Utils.bindBtnEvent(this.node,'Bag','onClose')
        )
        this.btn_expansion.clickEvents.push(
            Utils.bindBtnEvent(this.node,'Bag','onExpansion')
        )
        this.btn_arrange.clickEvents.push(
            Utils.bindBtnEvent(this.node,'Bag','onArrange')
        )
        this._pageCom = new switch_page(this.page_prev,this.page_next,this.page_num,"BagPageChange",{
            "main":BagData.getInstance(),
            "pageNum":"_currentPage",
            "pageCount":"_count"
        })
        BagData.getInstance().bag = this.node;
        BagData.getInstance().getItemList((items)=>{
            this.onGetItems(items);
        });
    }
    //整理
    public onArrange(){
        BagData.getInstance().sort((data)=>{
            this.onSort(data);
        });
    }
    //整理回调
    public onSort(data){
        if(data.res){
            BagData.getInstance().refresh((items)=>{
                this.onGetItems(items);
            })
        }else{

        }
    }
    //刷新
    public refresh(){
        BagData.getInstance().refresh((items)=>{
            this.onGetItems(items);
        })
    }
    //扩充
    public onExpansion(){
        if(BagData.getInstance().INum >= BagData.getInstance().MAX_PAGECOUNT){
            Utils.showAlert('背包已扩容至最大！')
        }else{
            let time = (BagData.getInstance().INum - this.BASIC_BAG_NUM)/6 + 1;
            let extendPoint = Math.min(time*this.BASIC_EXTEND_POINT,BagData.getInstance().MAX_EXENTD_POINT);
            Utils.alert(`扩展${this.EXTEND_NUM}格背包需要消耗${extendPoint}球票`,()=>{
                BagData.getInstance().extendBag((data)=>{
                    this.onExtend(data);
                })
            },{
                'title':'扩充背包',
                'parent':this.node
            })
        }
    }
    //背包扩充回调
    public onExtend(data){
        if(data.res){
            BagData.getInstance().INum += this.EXTEND_NUM;
            BagData.getInstance().getItemList((data)=>{
                this.onGetItems(data)
            });
            if(data.data.SyncData['Point']){
                ManagerData.getInstance().Point = data.data.SyncData.Point;
            }
        }else{
            Utils.showAlert(ErrMsg.getInstance().getErr(data.code));
        }
    }
    //关闭
    public onClose(){
        BagData.getInstance().nowType = [];
        this.node.parent.destroy();
        this.node.destroy();
    }
    //背包展示类型
    public lockExcept(exceptTypeList = null,exceptIdLIst = null){
        this.exceptTypeList = exceptTypeList;
        this.exceptIdLIst = exceptIdLIst;
        let i;
        let item;
        if(exceptTypeList){
            for(i in this._srcItems){
                item = this._srcItems[i];
                console.log(item)
                if(!exceptTypeList || exceptTypeList.indexOf(item.sComponent.ItemType) == -1){
                    item.sComponent.isLock = true;
                }
            }
        }
        if(exceptIdLIst){
            for(i in this._srcItems){
                item = this._srcItems[i];
                if(exceptIdLIst.indexOf(item.sComponent.ItemType)==-1){
                    if(!exceptTypeList || exceptTypeList.indexOf(item.sComponent.ItemType) == -1){
                        item.sComponent.isLock = true;
                    }else{
                        item.sComponent.isLock = false; 
                    }
                }else{
                    item.sComponent.isLock = false;
                }
            }
        }
    }
    //获取背包列表回调
    public onGetItems(items){
        this.ctnr_goods.removeAllChildren();
        this.ctnr_operation.removeAllChildren();
        this._srcItems = items;
        if(BagData.getInstance().nowType.length>0){
            this.lockExcept(BagData.getInstance().nowType);
        }
        this._pageCom.max = BagData.getInstance().INum;
        BagData.getInstance()._data = items;
        Events.getInstance().dispatch('BagPageChange')
    }
    //背包导航切换
    public onPageChange(index,isFresh = true){
        for(let i = 0;i<this.nav_head.length;i++){
            if(i == index){
                continue;
            }
            this.nav_head[i].getComponent(this.prefab_script_nav_head).active_off();
        }
        if(isFresh){
            BagData.getInstance()._currentPage = 0;
        }
        switch(index){
            case 0:
                BagData.getInstance().nowIndex = 0;
                BagData.getInstance().getItemList((items)=>{
                    this.onGetItems(items);
                });
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
    //背包全部索引翻页
    public async page_change(){
        if(BagData.getInstance().nowIndex!=0){
            this.onPageChange(BagData.getInstance().nowIndex,false);
            return;
        }
        this.nav_content.removeAllChildren();
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
                    obj.parent = this.nav_content;
                }else{
                    await BagData.getInstance().createBagItem(0,this.nav_content)
                }
            }else{
                if(i<(BagData.getInstance()._count - nowBagItem+1)){
                    if(this._srcItems[i + BagData.getInstance()._count*BagData.getInstance()._currentPage]){
                        let obj = this._srcItems[i + BagData.getInstance()._count*BagData.getInstance()._currentPage];
                        // obj.sComponent.refresh()
                        obj.parent = this.nav_content;
                    }else{
                        await BagData.getInstance().createBagItem(0,this.nav_content)
                    }
                }else{
                    await BagData.getInstance().createBagItem(-1,this.nav_content)
                }
            }
        }
    }
    //背包其他类型翻页
    public async page_other_change(){
        this.nav_content.removeAllChildren();
        for(let i = 0; i<BagData.getInstance()._count;i++){
            if(this._srcItems[i + BagData.getInstance()._count*BagData.getInstance()._currentPage]){
                let obj = this._srcItems[i + BagData.getInstance()._count*BagData.getInstance()._currentPage];
                obj.parent = this.nav_content;
            }else{
                await BagData.getInstance().createBagItem(0,this.nav_content)
            }
        }
    }
    //背包子集点击效果
    public async onItemClick(e,info){
        this.ctnr_goods.removeAllChildren();
        this.ctnr_operation.removeAllChildren();
        await BagData.getInstance().createShowUI(e,info,this.ctnr_goods);
        await BagData.getInstance().createButtonUI(e,info,this.ctnr_operation);
    }
}