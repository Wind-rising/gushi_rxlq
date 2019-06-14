import ItemData from "../../data/ItemData";
import { stringify } from "querystring";
import IconManager from "../../config/IconManager";
import BagItem from "./BagItem";

const {ccclass,property} = cc._decorator;

//背包UI系统
@ccclass
export default class BagOtherInfo extends cc.Component{
    @property(cc.RichText)
    private CName:cc.RichText = null;
    @property(cc.RichText)
    private item1:cc.RichText = null;
    @property(cc.RichText)
    private item2:cc.RichText = null;
    @property(cc.RichText)
    private item3:cc.RichText = null;
    @property(cc.RichText)
    private item4:cc.RichText = null;
    private data;

    public init(data){
        this.data = data;
        let itemInfo = ItemData.getInstance().getItemInfo(this.data.ItemCode);
        let color = 1;
        if(itemInfo){
            if(itemInfo.Type == BagItem.TYPE_SIGNER){
                let colorStr = itemInfo.Effect;
                let colorArr = colorStr.split(';');
                if(colorArr[0]){
                    color = 5 - String(colorArr[0]).split(';')[1];
                }
            }else if(itemInfo.Type == BagItem.TYPE_STUFF){

            }
            if(itemInfo.Type == BagItem.TYPE_MAP || itemInfo.Type == BagItem.TYPE_STUFF||itemInfo.Type == BagItem.TYPE_SIGNER){
                let desArr = String(itemInfo.Desc).split('</p>');
                this.item1.string = String(desArr[0]).replace('<p>',"");
                this.item2.string = String(desArr[1]).replace('<p>',"");
                this.item3.string = String(desArr[2]).replace('<p>',"");

                // console.log(String(desArr[0]).replace('<p>',""),1);
                // console.log(String(desArr[1]).replace('<p>',""),2);
                // console.log(String(desArr[2]).replace('<p>',""),3);
            }else{
                this.item1.string = itemInfo.Desc+"";
                this.item2.string = itemInfo.ExtraDesc+"";
                this.item3.string = itemInfo.UseDesc+"";
                // console.log(itemInfo.ValidTime,4)
            }
            this.CName.string = `<color=${ItemData.getInstance().getCardColor(color)}>${itemInfo.Name}</c>`
        }
    }
}