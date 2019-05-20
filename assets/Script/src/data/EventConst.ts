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

export default class EventConst{
    /**事件-显示队伍创建界面*/
		public static SHOW_CREATE:String = "show_create_team"
		/**事件-显示主界面*/
		public static SHOW_MAIN:String = "show_main";
		/**事件-关闭主界面*/
		public static CLOSE_MAIN:String = "close_main"
		/**事件-显示比赛选择界面*/
		public static SHOW_MATCH_SELECT:String = "show_match_select";
		/**事件-显示阵型*/
		public static SHOW_TEAM:String = "show_team"
		/**事件-显示科技*/
		public static SHOW_SCIENCE:String = "show_science"
		/**事件-显示选秀*/
		public static SHOW_LOTTERY:String = "show_lottery"
		/**事件-显示商城*/
		public static SHOW_AUCTION:String = "show_auction"
		/**事件-显示训练*/
		public static SHOW_TRAIN:String = "show_train";
		/**事件-显示工会*/
		public static SHOW_CLUB:String = "show_club"
		/**事件-显示荣誉殿堂*/
		public static SHOW_HONOR:String = "show_honor";
		/**事件-显示背包*/
		public static SHOW_BAG:String = "show_bag";
		/**事件-显示时间*/
		public static SHOW_MAIL:String = "show_mail";
		/**事件-显示好友*/
		public static SHOW_FRIEND:String  = "show_friend";
		/**事件-显示猎命*/
		public static SHOW_ASKSKILL:String = "show_askskill";
		/**事件-显示卡牌相关*/
		public static SHOW_MAGIC:String = "show_magic";
		/**事件-显示查看玩家信息*/
		public static SHOW_MANAGER_INFO:String = "show_manager_info";
		/**事件-显示查看跨服玩家信息*/
		public static SHOW_CROSSSERVER_MANAGER_INFO:String = "show_crossserver_manager_info";
		
		public static CLOSE_MANAGER_INFO:String = "close_manager_info";
		/**事件-显示NPC信息*/
		public static SHOW_NPC_INFO:String = "show_npc_info";
		/**事件-显示战术升级*/
		public static SHOW_TATICS:String = "show_tatics";
		/**事件-显示天赋*/
		public static SHOW_GENIUS:String = "show_genius";
		/**事件-显示意志*/
		public static SHOW_WILL:String = "show_will";
		/**事件-球员管理*/
		public static SHOW_PLAYERMANAGE:String = "show_playermanage";
		/**事件-显示排行*/
		public static SHOW_RANK:String = "show_rank";
		/**事件-显示登录送礼*/
		public static SHOW_LOGINREWARD:String = "show_loginReward";
		/**事件-显示活跃度*/
		public static SHOW_LOGINGIFT:String = "show_logingift";
		/**事件-显示任务面板*/
		public static SHOW_MISSION:String = "show_mission";
		/**事件-联赛竞猜*/
		public static SHOW_GUESS:String = "show_guess";
		
		/**事件-显示普通背景*/
		public static SHOW_NORMAL_BG:String = "show_normal_bg";
		/**事件-显示比赛背景*/
		public static SHOW_MATCH_BG:String = "show_match_bg"
		/**国战-更新目的地时间*/
		public static SHOW_TARGET_TIME:String = "show_target_time";
		/**国战-显示前往按钮*/
		public static SHOW_GOTO_TARGET:String = "show_goto_target";
		/**国战-显示挑战/防守按钮*/
		public static SHOW_ATTACK_DEFEND:String = "show_attack_defend";
		/**国战-显示撤销按钮*/
		public static SHOW_CANCEL:String = "show_cancel";
		/**国战-不显示所有按钮*/
		public static DISABLE_BUTTON:String = "disable_button";
		
		/**比赛事件-隐藏篮球*/
		public static CLOSE_BALL:String = "close_ball";
		/**比赛事件-回合变动*/
		public static CHANGE_STEP:String = "change_step";
		/**暂停比赛*/
		//public static PAUSE_MATCH:String = "pause_match";
		/**重新开始比赛*/
		//public static RESTART_MATCH:String = "restart_match";
		/**发动技能*/
		public static ATTACK_SKILL:String = "attack_skill";
		
		/**事件-发送聊天消息*/
		public static SEND_MSG:String = "send_msg";
		/**事件-发送展示消息*/
		public static SEND_SHOW:String = "send_show"
		/**事件-显示一条消息*/
		public static SHOW_MSG:String = "show_c_msg";
		/**事件-显示VIP*/
		public static SHOW_VIP:String = "show_vip"; //xxxxxxxxxxxxxxxxxxxxxx
		
		/**事件-显示联赛锁定消息*/
		public static SHOW_L_TEAM_INFO:String = "show_l_team_info";
		
		public static SHOW_UNION:String = "show_union";
		
		public static ADD_UNION_SKILL:String = "add_union_skill";
		
		public static REMOVE_UNION_SKILL:String = "remove_union_skill";
		
		public static SHOW_LIMIT_GIFT:String = "show_limit_gitf";
		
		public static CLOSE_LIMIT_GIFT:String = "close_limit_gitf";
}
