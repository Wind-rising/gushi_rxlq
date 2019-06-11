import Singleton from "../Utils/Singleton";
import URLConfig from "../config/URLConfig";
import HttpManager from "../utils/HttpManager";
import Events from "../signal/Events";
import EventConst from "./EventConst";
import Utility from "../utils/Utility";
import ErrMsg from "./ErrMsg";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class LimitGiftModel extends Singleton {

    public pointGift():void
		{
            let srvArgs = {action:URLConfig.Get_Data,
                args:[{"n":URLConfig.PointGift, "i":{}}]};
            HttpManager.getInstance().request(srvArgs,(result)=>{
                if(result.res)
                {
                    if(result.data[0].ItemCode == "0")
                    {
                        Events.getInstance().dispatch(EventConst.CLOSE_LIMIT_GIFT);
                    }
                    else
                    {
                        if(result.data[0].Get == "0")
                        {
                            Events.getInstance().dispatch(EventConst.SHOW_LIMIT_GIFT, result);
                        }
                        else if(result.data[0].Get == "1")
                        {
                            Events.getInstance().dispatch(EventConst.CLOSE_LIMIT_GIFT);
                        }
                        else
                        {
                            Events.getInstance().dispatch(EventConst.CLOSE_LIMIT_GIFT);
                        }
                    }
                }
                else
                {
                    Utility.alert(ErrMsg.getInstance().getErr(result.code), null,{title:"出错啦"});
                }
            },this);
		}
		
		public postGiftPoint(callback:Function):void
		{
            let srvArgs = {action:URLConfig.Post_Gift_Point,
                args:[]};
            HttpManager.getInstance().request(srvArgs,(result)=>{
                if(result.res)
                {
                    callback();
                }
                else
                {
                    Utility.alert(ErrMsg.getInstance().getErr(result.code));
                }
            },this);
		}
}

LimitGiftModel.getInstance();
