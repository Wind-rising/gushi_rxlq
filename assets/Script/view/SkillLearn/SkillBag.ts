import URLConfig from "../../config/URLConfig";
import HttpManager from "../../utils/HttpManager";
import Utility from "../../utils/Utility";
import SkillItem from "./SkillItem";
import SkillLearnModel from "./SkillLearnModel";
import switch_page from "../public/switch_page";
import Events from "../../signal/Events";
import ErrMsg from "../../data/ErrMsg";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SkillBag extends cc.Component {
    @property(cc.Node)
    private cont_bag:cc.Node = null;
    @property(cc.Button)
    private btn_close:cc.Button = null;
    @property(cc.Button)
    private btn_eat:cc.Button = null;
    @property([cc.Button])
    private btn_tabArr:Array<cc.Button> = [];
    @property(cc.Label)
    private lbl_switchNumUI = null;
    @property(cc.Button)
    private btn_prev:cc.Button = null;
    @property(cc.Button)
    private btn_next:cc.Button = null;

    public static currentPage = 0;
    public static count = 30;
    // public max = 30;

    //是否可以拖拽
    public _canDrag:boolean;
    public _tid;
    public _playerData;
    public static url = 'Skill/SkillPackageView';
    public static componentName = 'SkillBag';
    public _currentItems;
    public _items;
    public isInit = false;
    public _pageCom;
    public nowItems;
    //导航
    //内容
    start(){
        this.addListener();
    }
    onDestroy(){
        this.removeListener();
    }
    public addListener(){
        Events.getInstance().addListener(SkillLearnModel.EventSkillBagChange,this.onPageChange,this)
    }
    public removeListener(){
        Events.getInstance().removeListener(SkillLearnModel.EventSkillBagChange,this.onPageChange,this)
    }
    public static async open(data,canDrag = true,needUpdate = false){
        let prefab = await Utility.insertPrefab(SkillBag.url);
        prefab['sComponent'] = prefab['getComponent'](SkillBag.componentName);
        prefab['sComponent'].showBag(data,canDrag = true,needUpdate = false);
        prefab['parent'] = cc.director.getScene()
        return prefab;
    }
    public showBag(data,canDrag = true,needUpdate = false){
        this._canDrag = false;
        this._tid = data.data[0].Tid;
        if(!needUpdate){
            this._playerData = data;
        }
        this.show();
    }
    public show(){
        if(!this.isInit){
            this._pageCom = new switch_page(this.btn_prev,this.btn_next,this.lbl_switchNumUI,SkillLearnModel.EventSkillBagChange,{
                "main":SkillBag,
                "pageNum":"currentPage",
                "pageCount":"count"
            })
            this.btn_close.clickEvents.push(
                Utility.bindBtnEvent(this.node,"SkillBag","onClose")
            )
            this.btn_eat.clickEvents.push(
                Utility.bindBtnEvent(this.node,"SkillBag","eatOnce")
            )
            for(let i = 0;i<this.btn_tabArr.length;i++){
                this.btn_tabArr[i].clickEvents.push(
                    Utility.bindBtnEvent(this.node,"SkillBag","onTabChange",i+"")
                )
            }
            
            this.isInit = true;
        }
        this.getPlayerData();
    }
    private onClose(){
        this.node.destroy();
    }
    private getPlayerData(){
        var srvArgs = {
            action:URLConfig.Get_Data,
            args: [{
                "n":URLConfig.ManagerPlayer, 
                "i":{
                    "Mid":"",
                    "Tid":this._tid
                }
            }]
        };
        HttpManager.getInstance().request(srvArgs,(data)=>{
            this.onGetPlayerData(data)
        },this);
    }
    private async onGetPlayerData(data){
        if(data.res){
            let info = data.data[0].SkillPkg;
            this.clear(true);
            let item;
            for(let i in info){
                if(info[i] == null){
                    continue;
                }
                item = await SkillLearnModel.createSkillItem({
                    data:info[i],
                    index:i,
                    type:1
                });

                this._items.push(item);
                //加载item
            }
            this.onTabChange(false,0)
            // this._pageCom.max = this._items.length;
            // Events.getInstance().dispatch(SkillLearnModel.EventSkillBagChange)
        }
    }
    public onPageChange(){
        this.cont_bag.removeAllChildren();
        let start = (SkillBag.currentPage) * SkillBag.count;
        let end = (SkillBag.currentPage+1) * SkillBag.count;
        if(end>this.nowItems.length)
            end = this.nowItems.length

        for(let i = start;i<end;i++){
            this.nowItems[i].parent =  this.cont_bag;
        }
    }
    private clear(isAll = false){
        if(this._currentItems){
            // this.
            this.cont_bag.removeAllChildren();
        }
        this._currentItems = [];
        if(isAll){
            this._items = [];
        }
    }
    public last_index = -1;
    private onTabChange(e,index){
        if(this.last_index == index)return;
        if(this.last_index != -1){
            this.btn_tabArr[this.last_index - 0].node.getChildByName('on').active = false;
        }
        this.btn_tabArr[index - 0].node.getChildByName('on').active = true;
        if(index == 0){
            this.nowItems = this._items;
        }else{
            this.nowItems = [];
        }
        for(let i = 0;i<this._items.length;i++){
            if(this._items[i].sComponent._data.Type == index){
                this.nowItems.push(this._items[i]);
            }
        }
        SkillBag.currentPage = 0;
        this._pageCom.max = this.nowItems.length;
        Events.getInstance().dispatch(SkillLearnModel.EventSkillBagChange)
        this.last_index = index;
    }

    private eatOnce(){
        let uuid:string;
        let uuids = [];
        let targetItem;
        let otherItems = [];
        let item;
        for(let i = 0;i<this.nowItems.length;i++){
            item = this.nowItems[i];
            if(item){
                if(!targetItem){
                    targetItem = item;
                }else{
                    console.log(item.sComponent.color,targetItem.sComponent.color,"targetItem.sComponent.color")
                    if(item.sComponent.color<targetItem.sComponent.color){
                        targetItem = item;
                    }else if(item.sComponent.color == targetItem.sComponent.color){
                        if(item.sComponent.lv > targetItem.lv){
                            targetItem = item;
                        }
                    }
                }
                if(item.sComponent.color > SkillItem.COLOR_2){
                    otherItems.push(item);
                }
            }
        }
        uuid = targetItem.sComponent.uuid;
        for(let i = 0;i<otherItems.length;i++){
            if(otherItems[i]!=targetItem){
                uuids.push(otherItems[i].sComponent.uuid);
            }
        }
        console.log(otherItems,uuids,"targetItem")
        if(uuids.length>0){
            var srvArgs = {
                action:URLConfig.Post_Team_SkillEat,
                args: {
                    "Tid":SkillLearnModel.currentTid, 
                    "Uuid":uuid,
                    "EatUuids":uuids.join(",")
                }
            };
            HttpManager.getInstance().request(srvArgs,(data)=>{
                this.onEat(data)
            },this);
        }else{
            Utility.showAlert("背包中已没有蓝色和绿色品质技能");
        }
    }

    private onEat(data){
        if(data.res){
            this.refresh();
        }else{
            let msg = ErrMsg.getInstance().getErr(data.code)
            Utility.showAlert(msg);
        }
    }
    private refresh(){
        this.getPlayerData();
    }
}