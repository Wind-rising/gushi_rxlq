
export default class MatchConfig {
/**
		 * 球场宽度
		 */
		public static GroundWidth:number = 190;
		
		/**
		 * 球场高度
		 */
		public static GroundHeight:number = 100;
		
		public static LeftNetMap:cc.Vec2 = new cc.Vec2(8, 48.5);
		
		public static RightNetMap:cc.Vec2 = new cc.Vec2(178, 48.5);
		
		public static LeftNet:cc.Vec2 = new cc.Vec2(9.5, 50);
		
		public static RightNet:cc.Vec2 = new cc.Vec2(179.5, 50);
		
		public static PlayerHeight:number = 70;
		
		public static MaxWidth:number = 1400;
		
		public static NetHeight:number = 188;
		
		/**
		 * 主队
		 */
		public static HomePlayer:number = 1;
		
		/**
		 * 客队
		 */
		public static AwayPlayer:number = 2;
		
		/**
		 * 比赛时间回合间隔
		 */
		public static Living: number = 0.2;
		
		public static MoveLive:number = 4;
		
		/**
		 * 当前的窗口大小
		 */
		public static WindowWidth:number;
		
		public static WindowHeight:number;
		
		/**
		 * 比赛回调
		 */
		public static EndMatch:Function;
		
		public static NoMatch:Function;
		
		public static MatchCount:Object;
		
		/**
		 * 只负责记录
		 */
		public static MatchSkill:Object = new Object();
		
		public static MatchMode:Object = new Object();
		
		public static MatchRebound:Object;
		
		public static PlayerInfo:Object = new Object();
		
		public static MatchId:string;
		
		public static MatchResource:Object;
		
		/**
		 * 比赛时间(秒)
		 */
		public static MatchTime:number = 90;
		
		/**
		 * 篮球离开地面的高度
		 */
		public static BALL_HEIGHT:number = -60;
		
		public static MatchTalk:number = 0;
		
		public static MatchAnalize:number = 0;

		public static SkipStep:number = 300;
		
		public static MatchAttackStep:number = 0;
		
		public static Version:string = "1.0.3";
    
}
