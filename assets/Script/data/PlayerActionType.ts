
export default class PlayerActionType{
    /**
		 * 跑动
		 */
		public static run:number = 0;
		
		/**
		 * 进攻待机
		 */
		public static attack_wait:number = 1;
		
		/**
		 * 防守待机
		 */
		public static defend_wait:number = 2;
		
		/**
		 * 运球
		 */
		public static run_ball:number = 3;
		
		/**
		 * 单手传球
		 */
		public static run_pass:number = 4;
		
		/**
		 * 双手传球
		 */
		public static idle_pass:number = 5;
		
		/**
		 * 接球
		 */
		public static take_ball:number = 6;
		
		/**
		 * 投篮
		 */
		public static shot:number = 7;
		
		/**
		 * 单手扣篮
		 */
		public static slam_dunk:number = 8;
		
		/**
		 * 罚球
		 */
		public static foul_shot:number =9;
		
		/**
		 * 篮板
		 */
		public static attack_rebounds:number = 10;
		
		/**
		 * 篮板无球
		 */
		public static rebounds_noBall:number = -1;
		
		/**
		 * 拦截
		 */
		public static intercept:number = 11;
		
		/**
		 * 抢断
		 */
		public static steal:number = 12;
		
		/**
		 * 封盖
		 */
		public static block:number = 13;
		
		/**
		 * 防守干扰
		 */
		public static defend_interference:number = 14;
		
		/**
		 * 持球观察
		 */
		public static idle_hold:number = 15;
		
		/**
		 * 边线开球
		 */
		public static outside_ball:number = 16;
		
		/**
		 * 跳球
		 */
		public static jump_ball:number = 17;
		
		/**
		 * 表示持续前一个状态
		 */
		public static do_pre_action:number = 18
		
		/**
		 * 运球观察
		 */
		public static idle_ball:number = 19;
		
		/**
		 * 三分投篮
		 */
		public static three_point:number = 20;
		
		/**
		 * 界外球
		 */
		public static out_ball:number = 21;

		/**
		 * 防守篮板球
		 */
		public static defend_rebound:number = 22;
		
		private static _callback:Function;
		
		private static _dir:number;
		
		private static _action:number;
		
		private static _pos:cc.Vec2;
		
		public static getActionName(action:number):string
		{
			switch(action)
			{
				case PlayerActionType.run:
					return "run_";
				case PlayerActionType.run_ball:
					return "run_ball_";
				case PlayerActionType.attack_wait:
					return "idle_";
				case PlayerActionType.run_pass:
					return "run_pass_";
				case PlayerActionType.idle_pass:
					return "run_pass_"
				case PlayerActionType.defend_wait:
				case PlayerActionType.defend_interference:
					return "defend_";
				case PlayerActionType.intercept:
				case PlayerActionType.steal:
					return "defend_";
				case PlayerActionType.three_point:
				case PlayerActionType.shot:
					return "shot_";
				case PlayerActionType.slam_dunk:
					return "slam_dunk_";
				case PlayerActionType.foul_shot:
					return "foul_shot_";
				case PlayerActionType.attack_rebounds:
					return "rebounds_";
				case PlayerActionType.defend_rebound:
				case PlayerActionType.rebounds_noBall:
					return "rebounds_noBall_";
				case PlayerActionType.block:
				case PlayerActionType.jump_ball:
					return "block_";
				case PlayerActionType.take_ball:
					return "take_ball_";
				case PlayerActionType.idle_hold:
					return "idle_hold_";
				case PlayerActionType.outside_ball:
					return "outside_ball_";
				case PlayerActionType.idle_ball:
					return "idle_ball_";
			}
			
			return "";
		}
		
		/**
		 * 获取球员对象MC
		 * @pid:球员ID
		 * @action:球员动作（PlayerActionType）
		 */
		// public function getPlayer(pid:String, dir:number, pos:Point, action:number, callback:Function=null):void
		// {
		// 	_callback = callback;
			
		// 	_dir = dir;
			
		// 	_action = action;
			
		// 	_pos = pos;
			
		// 	var cpv:CountPlayerView = new CountPlayerView(pid, dir, action, pos);
			
		// 	callback(cpv);
		// }
}
