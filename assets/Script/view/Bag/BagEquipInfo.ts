import ItemData from "../../data/ItemData";
import IconManager from "../../config/IconManager";

const {ccclass,property} = cc._decorator;

//背包UI系统
@ccclass
export default class BagEquipInfo extends cc.Component{
    @property(cc.RichText)
    private CName:cc.RichText = null;
    @property(cc.Label)
    private level:cc.Label = null;
    @property(cc.Sprite) 
    private icon:cc.Sprite= null;
    @property(cc.RichText)
    private attr:cc.RichText= null;
    @property(cc.Node)
    private effectNode:cc.Node= null;
    @property(cc.RichText)
    private effect:cc.RichText= null;
    @property(cc.Label)
    private tips:cc.Label= null;
    @property(cc.RichText)
    private signUI:cc.RichText= null;
    private MAX_PAIR = 8;
    private data;

    public init(data){
        this.data = data.Equip;
        let equipData = ItemData.getInstance().getEquipInfo(this.data.Type+""+this.data.Pair);
        let str = "";
        //附加效果
        let holeInfo;
        for(let i = 0;i<this.data.Hole.length;i++){
            if(this.data.Hole[i]){
                holeInfo = ItemData.getInstance().getHoleInfo(this.data.Hole[i]);
                if(holeInfo){
                    if(str = ""){
                        str = `<color=${ItemData.getInstance().getCardColor(holeInfo.color)}>${holeInfo.Desc}</c>\r\n`
                    }else{
                        str += `<color=${ItemData.getInstance().getCardColor(holeInfo.color)}>${holeInfo.Desc}</c>`
                    }
                }
            }
        }
        if(str){
            this.effectNode.active = true;
            this.effect.string = str;
        }else{
            this.effectNode.active = false;
            this.effect.string = '';
        }
        //名字
        this.CName.string = `<color=${ItemData.getInstance().getEquipColor(equipData['Pair'])}>${equipData['Name']}</c>`;
        //等级
        this.level.string = `装备等级：${this.data.Lvl}`;
        //属性
        let str2 = ``;
        str2 += `${equipData['Attr_1_Name']}+${this.getTotalPro(equipData['Attr_1_Num'],equipData['Grow'],this.data.Lvl)}\n`
        str2 += `${equipData['Attr_2_Name']}+${this.getTotalPro(equipData['Attr_2_Num'],equipData['Grow'],this.data.Lvl)}\n`
        this.attr.string = str2;
        //签名
        if(this.data.Sign){
            let itemInfo = ItemData.getInstance().getItemInfo(this.data.Sign);
            if(itemInfo){
                let color:any = 5;
                if(itemInfo['Effect']){
                    let tempArr = String(itemInfo['Effect']).split(';');
                    for(let i = 0;i<tempArr.length;i++){
                        if(String(tempArr[i]).indexOf('color')!= -1){
                            color = String(tempArr[i]).split(":")[1];
                            break;
                        }
                    }
                }
                let desArr = (itemInfo['Desc']+'').split('</p>');
                if(desArr[1]){
                    desArr = (desArr[1]+"").split("<br/>");
                }
                this.signUI.string = `<color=${ItemData.getInstance().getCardColor(5-color)}>${itemInfo['Name']}</c>\n<color=${ItemData.getInstance().getCardColor(5-color)}>${desArr[1]}</c>`
            }
        }
        //
        let nextInfo = ItemData.getInstance().getEquipInfo(this.data.Type+String(this.data.Pair+1));
        if(this.data.Pair >= this.MAX_PAIR){
            this.tips.string = '顶级神装 龙腾出品';
        }else{
            this.tips.string = `可改造成【${nextInfo['Name']}`;
        }
        IconManager.getIcon(equipData['Type'] + (equipData['Pair']+''),IconManager.EQUP_ICON,(spriteFrame)=>{
            this.icon.spriteFrame = spriteFrame;
        });
    }
    public getTotalPro(basic,growV,lv){
        return parseInt(basic - 0 + growV * Math.max(0,(lv-1)) + '')
    }
}