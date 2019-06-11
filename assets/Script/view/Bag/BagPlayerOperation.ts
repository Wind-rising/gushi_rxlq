import Utils from "../../utils/Utils";
import BagData from "./BagData";
import BagItem from "./BagItem";
import Events from "../../signal/Events";
import MainData from "../MainData";
import ManagerData from "../../data/ManagerData";

const {ccclass,property} = cc._decorator;

@ccclass
export default class BagPlayerOperation extends cc.Component{
    @property(cc.Button)
    private sign:cc.Button = null;
    @property(cc.Button)
    private strength:cc.Button = null;
    @property(cc.Button)
    private buttonDecompose:cc.Button = null;
    @property(cc.Button)
    private buttonShow:cc.Button = null;
    @property(cc.Button)
    private buttonDiscard:cc.Button = null;

    start(){
        this.sign.clickEvents.push(
            Utils.bindBtnEvent(this.node,"BagPlayerOperation","onSign")
        )
    }
    public onSign(){
        BagData.getInstance().useItem(BagData.getInstance().nowItems,this.onUseItem);
    }
    public onUseItem(data){
        if(data.res){
            console.log(BagData.getInstance().nowItems._data)
            if(BagData.getInstance().nowItems._data.ItemType == BagItem.TYPE_PLAYER){
                ManagerData.getInstance().refresh();
            }else{
                ManagerData.getInstance().refresh();
            }
            Events.getInstance().dispatch('BagRresh')
        }
    }
    public onShow(){

    }
    public onDiscard(){

    }
}