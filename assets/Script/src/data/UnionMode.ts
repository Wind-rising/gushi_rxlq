import Singleton from "../Utils/Singleton";
import HttpManager from "../utils/HttpManager";
import URLConfig from "../config/URLConfig";
import ErrMsg from "./ErrMsg";
import Utils from "../utils/Utils";

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
export default class UnionMode extends Singleton {
    public getManager(mid:string, callback:Function):void
    {
        let srvArgs  = {args:[{"n":URLConfig.ManagerBasic, "i":{"Mid":mid}}],action:URLConfig.Get_Data};
        HttpManager.getInstance().request(srvArgs,function(result:Object):void
        {
            if(result['res'])
            {	
                if(callback != null)
                {
                    callback(result);
                }
            }
            else
            {
                this.showErr(result);
            }
        },this);
    }
    
    /**
     * 处理邀请
     */
    public postGuildInviteDispose(gid:number, type:number, callback:Function):void
    {
        let srvArgs  = {args:{Gid:gid, Type:type},action:URLConfig.Post_Guild_InviteDispose};
        HttpManager.getInstance().request(srvArgs,function(result:Object):void
        {
            if(result['res'])
            {	
                if(callback != null)
                {
                    callback(result);
                }
            }
            else
            {
                this.showErr(result);
            }
        },this);
    };

    /**
     * 公会技能
     */
    public postGuildSkill(callback:Function):void
    {
        let srvArgs  = {args:{},action:URLConfig.Post_Guild_Skill};
        HttpManager.getInstance().request(srvArgs,function(result:Object):void
        {
            if(result['res'])
            {	
                if(callback != null)
                {
                    callback(result);
                }
            }
            else
            {
                this.showErr(result);
            }
        },this);
    }

    private showErr(code:Object):void
    {
        var value:String = ErrMsg.getInstance().getErr(code['code']);
        
        for(var j in code["var"])
        {
            //trace(code["var"][j])
            value = value.replace("${" + j + "}", code["var"][j]);
        }
        
        Utils.alert(value);
    }
    
}
