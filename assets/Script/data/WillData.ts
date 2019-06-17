
/**
 * 意志数据
 */
const {ccclass, property} = cc._decorator;

import Events from "../signal/Events";
import Singleton from "../Utils/Singleton";

@ccclass
export default class WillData extends Singleton {
    private WILL_URL:string = "Dic_combskill_chs";

    private tempInfo:Object = null;
    /** 被动意志 */
    public list_1:Array<Object>;
    /** 主动意志 */
    public list_2:Array<Object>;
    /** 意志字典 */
    public list_Dic:Object;

    /** 卡片与意志对应表 */
    public cardWillDic:Object;
    
    /** 意志与卡片对应表 */
    public willCardDic:Object;

    /** 初始化意志数据 */
    public static INIT_WILL_DATA:String = "initWillData";
    
    /** 意志数据改变 */
    public static INIT_WILL_DATA_CHANGE:String = "initWillDataChange";
    
    constructor(){
        super();
        this.init();
    }
    public init():void{
        Events.getInstance().addListener('EventJsonDataLoaded',function(name,data){
            if(name == this.WILL_URL){
                this.tempInfo = data;
                this.initWillList();
            }
        },this);
    }

    initWillList (){
        this.list_1 = [];
        this.list_2 = [];
        this.list_Dic = {};
        for(let str in this.tempInfo){
            let willObj = this.tempInfo[str];
            this.list_Dic[willObj['SkillCode']] = willObj;
            if(parseInt(willObj['Mode']) == 1){
                this.list_1.push(willObj);
            }else{
                this.list_2.push(willObj);
            }
        }
    }

    public getWill():Object{
        return this.tempInfo;
    }
    
    /** 初始化意志卡片数据 */
    public initWillCardData(data:Object):void
    {
        this.cardWillDic = {};
        this.willCardDic = {};
        
        let i:number = 0;
        let j:number = 0;
        let obj:Object;
        let obj1:Object;
        let cardObj:Object;
        for(let key in data) 
        {
            for (let key1 in data[key]) 
            {
                for(let key2 in data[key][key1]['ProjectInfo'])
                {
                    let cardObj = data[key][key1]['ProjectInfo']['key2']
                    if(parseInt(cardObj['put']) == 0)
                    {
                        //卡片相关的意志列表
                        let willList = this.cardWillDic[cardObj['Pid']];
                        if(willList == null)
                        {
                            willList = this.cardWillDic[cardObj['Pid']] = [];
                        }
                        willList.push({SkillCode:obj1['SkillCode'],Str:cardObj['Str']});
                        //意志相关的卡片列表
                        let cardList = this.willCardDic[obj1['SkillCode']];
                        if(cardList == null)
                        {
                            cardList = this.willCardDic[obj1['SkillCode']] = [];
                        }
                        cardList.push({Pid:cardObj.Pid,Str:cardObj.Str});
                    }
                }
            }
        }
        
        Events.getInstance().dispatch(WillData.INIT_WILL_DATA);
    }

    /** 插入卡片 */
		public insertCard(inSertData:Object):void
		{
			var cardObj:Object;
			for (let key in inSertData['ProjectInfo'])
			{
                let cardObj = inSertData['ProjectInfo']['key'];
				if (parseInt(cardObj['put']) != 0)
				{
					var i:number;
					var obj:Object;
					//卡片相关的意志列表
					var willList = this.cardWillDic[cardObj['Pid']];
					if(willList)
					{
						for (i = willList.length - 1; i >= 0; i--)
						{
							obj = willList[i];
							if (obj['SkillCode'] == inSertData['SkillCode'])
								willList.splice(i, 1);
						}
						if(willList.length == 0)
						{
							delete this.cardWillDic[cardObj['Pid']];
						}
					}
					//意志相关的卡片列表
					var cardList = this.willCardDic[inSertData['SkillCode']];
					if(cardList)
					{
						for (i = cardList.length - 1; i >= 0; i--)
						{
							obj = cardList[i];
							if (obj['Pid'] == cardObj['Pid'])
								cardList.splice(i, 1);
						}
						if(cardList.length == 0)
						{
							delete this.willCardDic[inSertData['SkillCode']];
						}
					}
				}
			}

            Events.getInstance().dispatch(WillData.INIT_WILL_DATA_CHANGE);
		}
}

WillData.getInstance();
