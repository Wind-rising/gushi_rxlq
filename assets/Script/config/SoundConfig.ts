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
export default class SoundConfig {

    /**背景音乐*/
		public static BG: string = "bg"
		/**点击特效*/
		public static BTN_CLICK: string = "ClickSND";
		/**滑动特效*/
		public static TURN_PAGE: string = "SelectedSND";
		
		public static COUNT_SLAMDUNK: string = "Slamdunk";
		
		public static COUNT_SHOOT: string = "Shoot";
		
		public static COUNT_NO_SLAMDUNK: string = "NoSlamdunk";
		
		public static COUNT_NO_SHOOT: string = "NoShoot";
		
		//public static COUNT_GROUND1: string = "Ground1";
		
		public static COUNT_GROUND: string = "Ground";
		
		public static COUNT_GROUND2: string = "Ground2";
		
		public static COUNT_LOADING: string = "Loading";
		
		public static COUNT_GOAL: string = "Goal";
		
		public static COUNT_GET_BALL: string = "GetBall";
		
		//public static COUNT_ATTACK1: string = "Attack1";
		
		public static COUNT_PASS_BALL: string = "PassBall";
		
		public static COUNT_SKILL: string = "Skill";
		
		public static COUNT_CLICK_BTN: string = "ClickBtn";

		public static COUNT_END_QUALTER: string = "EndQualter";
		
		public static COUNT_FOUL: string = "Foul";
		
		public static COUNT_WIN: string = "CountWin";
		
		public static COUNT_LOSE: string = "CountLose"
		
		/**任务完成*/
		public static MISSION_SND: string = "MissionSND";
		
		/**获得橙卡*/
		public static ORANGE_SND: string = "OrangeSND"
		
		/**合成强化成功*/
		public static SUCCESS_SND: string = "SuccessSND";
		
		/**合成强化失败*/
		public static FAILED_SND: string = "FailedSND";
		
		/**弹出框声音*/
		public static ALERT_SND: string = "AlertSND";
		
		/**升级*/
		public static LVUP_SND: string = "LvUpSND";
}
