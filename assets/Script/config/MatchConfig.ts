
export default class MatchConfig {
	/**
	 * 球场宽高 瓦片地图
	 */
	public static GroundWidth:number = 190;
	public static GroundHeight:number = 100;
	
	public static LeftNet:cc.Vec2 = new cc.Vec2(9.5, 50);
	public static RightNet:cc.Vec2 = new cc.Vec2(179.5, 50);
	
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
	
	public static MoveLive:number = 0.4;
	
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
