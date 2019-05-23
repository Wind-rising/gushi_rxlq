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
export default class MatchType {

    /**常规赛*/
    public static  NORMAL_MATCH:string = "1";
    /**全明星赛*/
    public static  ALLSTAR_MATCH:string = "2";
    /**冠军试炼*/
    public static  CHAMPION_MATCH:string = "3"
    /**联赛*/
    public static  LEAGUE_MATCH:string = "4";
    /**季后赛*/
    public static  PLAYOFF_MATCH:string = "5";
    /**天梯赛*/
    public static  LADDER_MATCH:string = "6";
    /**竞技场*/
    public static  ARENA_MATCH:string = "7";
    /**国战*/
    public static  GVG_MATCH:string = "8";
    /**血战*/
    public static  BLOOD_MATCH:string = "9";
    /** 跨服天梯赛 */
    public static  LADDER_CROSSSERVER_MATCH:string = "10";
    /** 好友挑战 */
    public static  FRIEND_MATCH:string = "11";
    
    /** 巨星来袭 */
    public static  BOSSWAR_MATCH:string = "15";
}
