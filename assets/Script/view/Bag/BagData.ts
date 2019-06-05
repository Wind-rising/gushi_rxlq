
import { callbackify, types } from "util";
import URLConfig from "../../config/URLConfig";
import HttpManager from "../../utils/HttpManager";
import Singleton from "../../Utils/Singleton";
import ItemPool from "../../utils/ItemPool";
import Utils from "../../utils/Utils";
import BagItem from "./BagItem";

export default class BagData extends Singleton{
    constructor(){
        super();
    }
    private _Items;
    private _needFresh = true;
    private _funList = [];
    private _dataFunMap = {};
    public INum;
    public nowItems = null;
    public bagItemPrefabUrl = "bag/Bagitem"
    public bagItemComponent = "BagItem"
    public equipPrefabUrl = "bag/equip_content_Item"
    public equipItemComponent = "bagInfo_equie"
    public otherPrefabUrl = "bag/other_content_Item"
    public otherItemComponent = "bagInfo_other"
    public equipButtonPrefabUrl = "bag/equip_button_item"
    public equipButtonItemComponent = "bagEquip_Button"
    public otherButtonPrefabUrl = "bag/other_button_item"
    public otherButtonItemComponent = "bagOther_Button"
    public _currentPage = 0;
    public _count = 30;
    public MAX_PAGECOUNT = 120;
    public _data;
    public nowIndex = 0;


    public init(){

    }
    public getItemList(callBack:Function = null){
        if(this.Items){
            if(this._needFresh){
                this.refresh(callBack);
            }else{
                callBack(this.Items)
            }
        }else{
            this.refresh(callBack);
        }
    }
    public getItemByTypes(types = [],callBack=null){
        let tempItems = [];
        let item;
        if(types && types.length){
            for(let i = 0;i<this.Items.length;i++){
                item = this.Items[i];
                console.log(types.indexOf(item.sComponent.ItemType));
                if(item && (types.indexOf(item.sComponent.ItemType)!= -1)){
                    tempItems.push(item);
                }
            }
        }
        callBack&&callBack(tempItems);
        return tempItems;
    }
    public refresh(callBack:Function = null){
        if(callBack != null){
            this._funList.push(callBack);
        }
        if(callBack == null){
            this._needFresh = true;
        }else{
            var srvArgs = {
                action:URLConfig.Get_Data,
                args: [{
                    "n":URLConfig.ManagerItem, 
                    "i":{
                        "Mid":""
                    }
                }]
            };
            HttpManager.getInstance().request(srvArgs,this.onRefresh,this);
        }
    }

    public async onRefresh(data){
        console.log(data,"data");
        if(data.res){
            data = data.data[0];
            this.INum = data.INum;
            this._Items = []; 
            let itemList = data.Item;
            let item;
            let info;
            for(let i in itemList){
                info= itemList[i]
                if(info){
                    item = ItemPool.getItem(itemList[i].Uuid);
                    if(item){
                        if(item.sComponent.goodsItem){
                            item.sComponent.init(info);
                        }else{
                            item = await this.createBagItem(itemList[i])
                            ItemPool.putItem(item);
                        }
                        
                    }
                    if(!item){
                        item = await this.createBagItem(itemList[i])
                        ItemPool.putItem(item);
                    }
                    this.Items[item.sComponent._data.Pos] = item;
                }
            }

            this._funList.forEach(fun => {
                fun(this.Items);
                fun = null;
            });
            this._funList = [];
            for(let i in this._dataFunMap){
                this._dataFunMap[i](this.Items);
            }
        }else{
            //提示
        }
    }
    public async createBagItem(data,parent = null){
        let prefab = await Utils.insertPrefab(this.bagItemPrefabUrl);
        prefab.sComponent = prefab.getComponent(this.bagItemComponent);
        prefab.getComponent(this.bagItemComponent).init(data)
        if(parent)
            prefab.parent = parent;
        return prefab;
    }
    public async createShowUI(e,data,parent = null){
        let prefabUrl;
        let component;
        switch(e){
            case BagItem.TYPE_PLAYER:
                    // prefabUrl = this.equipPrefabUrl;
                    // component = this.equipItemComponent;
                break;
            case BagItem.TYPE_EQUIP:
                    prefabUrl = this.equipPrefabUrl;
                    component = this.equipItemComponent;
                break;
            case BagItem.TYPE_RING:
                    // prefabUrl = this.equipPrefabUrl;
                    // component = this.equipItemComponent;
                break;
            default:
                    prefabUrl = this.otherPrefabUrl;
                    component = this.otherItemComponent;
                break;
        }
        let prefab = await Utils.insertPrefab(prefabUrl);
        prefab.sComponent = prefab.getComponent(component);
        prefab.getComponent(component).init(data)
        if(parent)
            prefab.parent = parent;
        return prefab;
    }
    public async createButtonUI(e,data,parent = null){
        let prefabUrl;
        let component;
        switch(e){
            case BagItem.TYPE_PLAYER:
                    // prefabUrl = this.equipPrefabUrl;
                    // component = this.equipItemComponent;
                break;
            case BagItem.TYPE_EQUIP:
                    prefabUrl = this.equipButtonPrefabUrl;
                    component = this.equipButtonItemComponent;
                break;
            case BagItem.TYPE_RING:
                    // prefabUrl = this.equipPrefabUrl;
                    // component = this.equipItemComponent;
                break;
            default:
                    prefabUrl = this.otherButtonPrefabUrl;
                    component = this.otherButtonItemComponent;
                break;
        }
        let prefab = await Utils.insertPrefab(prefabUrl);
        prefab.sComponent = prefab.getComponent(component);
        // prefab.getComponent(component).init(data)
        if(parent)
            prefab.parent = parent;
        return prefab;
    }

    public extendBag(callBack){
        let srvArgs = {
            action:URLConfig.Post_Pkg_ExtItem,
            args: {}
        };
        HttpManager.getInstance().request(srvArgs,callBack,this);
    }

    public get Items(){
        return this._Items;
    }
}