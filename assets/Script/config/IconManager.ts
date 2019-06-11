import Utils from "../utils/Utils";
import AppConfig from "./AppConfig";

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
export default class IconManager extends cc.Component {

    /**球员卡位图信息*/
		private static _palyerIconMap:Object = new Object();
		/**位图map--可能考虑是否需要弱引用*/
		private static _bmdMap:Object = new Object();
		/**常量-图片类型-抽卡*/
		public static LOTTERY_PIC:string = "playerPic/";
		/**常量-图片类型-小Logo*/
		public static LOGO:string = "logoSmall/"
		/**常量-图片类型-大Logo*/
		public static BIG_LOGO:string  = "logoBig/"
		/**常量-图片类型-迷你LOGO*/
		public static MINI_LOGO:string = "logoMini/"
		/**常量-图片类型-长LOGO*/
		public static LONG_LOGO:string = "logoLong/";
		/**常量-图片类型-正常LOGO-联赛，天梯赛*/
		public static NORMAL_LOGO:string = "logoNormal/"
		/***/
		/**常量-图片类型-玩家LOGO*/
		public static PLAYER_LOGO:string = "logoPlayer/";
		public static NPC_LOGO:string = "npclogo/";
		public static COUNT_LOGO:string = "countUiLogo/";
		public static COUNT_LONG_LOGO:string = "logoSmall2/";
		public static COUNT_COMPOSE:string = "compose/"
		//
		public static PLAYER_HEAD:string = "player/"
		public static PLAYER_ICON:string = "playerIcon/";
		public static PLAYER_PER:string = "playerPer/";
		/**常量—图片类型-道具*/
		public static ITEM_ICON:string = "item/";	
		/**常量-图片类型-普通技能*/
		public static COMM_SKILL:string = "commSkill/"
		/**常量-图片类型-球星技能*/
		public static STAR_SKILL:string = "starSkill/"
		/**常量-图片类型-技能文字*/
		public static SKILL_WORDS:string = "starSkillWords/";
		/**常量-图片类型-装备*/
		public static EQUP_ICON:string = "equip/"
		/**常量-图片类型-天赋*/
		public static GENIUS_ICON:string = "genius/";
		/** 奖励图标 */
		public static REWARD_ICON:string = "reward";
		/**常量-图片类型-天赋*/
		public static WILL_ICON:string = "willIcon/";
		/**常量-图片类型-组合*/
		public static COMBO_ICON:string = "comboIcon/";
		/** 视频缩略图 */
		public static FLV_IMAGE:string = "flv/";
		/** 选秀球员图片 */
		public static DRAFT_IMAGE:string = "draftpng/";
		/** 日常活动图片 */
		public static COMMONACTIVITY_ICON:string = "CommonActivity/";
		/** 球员背包模块相关图片*/
		public static PLAYER_ITEM_ICON:string = "playItem/";
		
		/**公会技能图片*/
		public static UNION_SKILL:string = "unionSkill/";
		/**公会活动图片*/
		public static UNION_ACTIVE:string = "unionActive/";
		
		/**
		 * 获取图片资源
		 * @param url 图片地址
		 * @param type 图片类型： 
		 * @param callback 回调函数，参数为cc.SpriteFrame
		 * @return cc.SpriteFrame;
		 */
		public static getIcon(url:string, type:string, callback:Function, context?){
			url = 'image/'+type+url
			cc.loader.loadRes(url, cc.SpriteFrame, function (err, spriteFrame) {
                if (err) {
                    Utils.fadeErrorInfo(err.message || JSON.stringify(err));
                    return;
                }
                if(context){
                    callback.apply(context, [spriteFrame]);
                }else{
                    callback(spriteFrame);
                }
            });
		}
		
		/**获取球员ICON*/
		public static getPlayerIcon(vo){
			//需要缓存的
			var key:string= vo.ItemCode+"_"+vo.playPos+"_"+vo.Str;
			console.log(key)
			// return bmd;
		}
		
		/**获取完整图像地址*/
		public static get preURL():string{
			return 'image/';
		}
		
		/**
		 * 图片加载成功
		 * */
		// private static onComplete(info:LoaderInfo, url:string, bmd:BitmapData, type:int, callback:Function=null):void{
		// 	_bmdMap[url] = bmd;
		// 	bmd.draw(info.content);
		// 	if(callback != null){
		// 		callback(bmd);
		// 	}
		// }
}
