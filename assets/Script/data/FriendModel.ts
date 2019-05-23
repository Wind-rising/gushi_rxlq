import HttpManager from "../utils/HttpManager";
import URLConfig from "../config/URLConfig";
import Utils from "../utils/Utils";
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
export default class FriendModel{

    //加好友
		public static addFriend(name:String, callback:Function=null):void{
            let srvArgs = {args:{Name:name},action:URLConfig.Post_Friend_Apply};
			Utils.showLoading();
			if(callback != null){
                HttpManager.getInstance().request(srvArgs,callback,this);
			}else{
                HttpManager.getInstance().request(srvArgs,onAdd,this);
			}
			
			function onAdd(data:Object):void{
				Utils.hideLoading();
				Utils.alert(ErrMsg.getInstance().getErr(data['code']));
			}
		}
		
		//显示加好友界面
		public static showAddFriend(data:Object=null):void{
			if(data){
				Utils.alert(ErrMsg.getInstance().getErr(data['code']));
			}
			FriendModel.getData(onFreshFriend);
			
			//刷新好友，如果有人邀请，则弹出提示框
			function onFreshFriend(data:Object):void{
				if(data['res']){
					var inviteList:Object = data['data'][0].InviteList;
					for(var i in inviteList){
						//加好友	
						Utils.alert("<font color='#FF6600'>"+inviteList[i]+"</font>已加您为好友，是否加TA为好友？", FriendModel.accept, {title:"好友",showCancel:true,onCancel:FriendModel.refuse});
						break
					}
				}
			}
		}
		
		//获取好友列表数据
		public static getData(callback:Function):void{
            let srvArgs = {args:[{"n":URLConfig.Friend, "i":{"Mid":""}}],action:URLConfig.Get_Data};
			HttpManager.getInstance().request(srvArgs,callback,this);
		}
		
		/**接受邀请*/
		public static accept(mid:String, callback:Function=null):void{
			if(callback == null){
				callback = this.showAddFriend;
            }
            
            let srvArgs = {args:{Mids:mid},action:URLConfig.Post_Friend_AcceptInvite};
            HttpManager.getInstance().request(srvArgs,callback,this);
		}
		
		/**拒绝邀请*/
		public static refuse(mid:String, callback:Function=null):void{
			if(callback == null){
				callback = this.showAddFriend;
            }
            
            let srvArgs = {args:{Mids:mid},action:URLConfig.Post_Friend_RefuseInvite};
            HttpManager.getInstance().request(srvArgs,callback,this);
		}
}
