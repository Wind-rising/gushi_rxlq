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
export default class UIConfig {

    /**公用组件*/
    public static common: string = "assets/chs/swf/common.swf";
    
    /**公用组件2-ui特效*/
    public static uiEffect: string  = "assets/chs/swf/uiEffect.swf"
    
    /**创建角色*/
    public static createRole: string = "assets/chs/swf/createRole.swf"
    
    /**首页*/		
    public static index: string = "assets/chs/swf/index.swf";
    
    /**比赛选择*/
    public static matchSelect: string = "assets/chs/swf/matchSelect.swf";
    
    /**巡回赛*/
    public static normalMatch: string = "assets/chs/swf/normalMatch.swf";
    
    /** 竞技场 */
    public static arenaMatch: string = "assets/chs/swf/arenaMatch.swf";

    /**赛后分析*/
    public static matchCompare: string = "assets/chs/swf/compare.swf";
    
    /**球队设置*/
    public static team: string = "assets/chs/swf/team.swf";
    
    /**背包*/
    public static bag: string  = "assets/chs/swf/bag.swf";
    /** 商城 */
    public static mall: string = "assets/chs/swf/mall.swf";
    /** VIP介绍 */
    public static vip: string = "assets/chs/swf/VIP.swf";
    
    /**事件*/
    public static mail: string = "assets/chs/swf/mail.swf";
    
    /**聊天*/
    public static chat: string = "assets/chs/swf/chat.swf";
    
    /**抽卡*/
    public static lottery: string = "assets/chs/swf/lottery.swf"
        
    /**球场地图*/
    public static countMap: string = "image/map/map_";
    
    /** 球  */
    public static countBall: string = "prefabs/competition/BallNode.prefab";
    
    /** 球员 */
    public static countPlayer: string = "prefabs/competition/PlayerNode.prefab";

    /** 比赛场景 */
    public static CompetitionView: string = "prefabs/competition/CompetitionView.prefab";
    
    /** 比赛结束页面的prefab */
    public static countEnd: string = "prefabs/competition/CompetitionEndView.prefab";
    
    public static countButton: string = "assets/chs/swf/count/countButton.swf";
    
    public static countEffect: string = "assets/chs/swf/count/countEffect.swf"
    
    /** 衣服*/
    public static commonCloth1: string = "assets/chs/swf/count/cloth1.swf";
    public static commonCloth2: string = "assets/chs/swf/count/cloth2.swf";
    
    public static commPlayer: string = "assets/chs/swf/count/commonPlayer.swf"
    
    /**皮肤*/
    public static skinB: string = "assets/chs/swf/count/skin/skinB.swf";
    public static skinW: string = "assets/chs/swf/count/skin/skinW.swf";
    
    /**头*/
    public static head: string = "assets/chs/swf/count/head/";
    
    public static cloth: string = "assets/chs/swf/count/cloth/c";
    
    public static skill: string = "assets/chs/swf/count/skill/"
    
    /** 客队球员*/
    public static shadow: string = "assets/chs/swf/count/shadow.swf";
    
    /**球场地图国战*/
    public static  globle: string = "assets/chs/swf/globle.swf";
    
    /**选秀*/
    public static talent: string = "assets/chs/swf/show.swf"
        
    /**选秀人物皮肤*/
    public static talentSkin: string = "assets/chs/swf/talentSkin.swf"
        
    /**选秀人物衣服*/
    public static clothes_dratf: string = "assets/chs/swf/draft/clothes"
    /**选秀人物头*/
    public static head_dratf: string = "assets/chs/swf/draft/head"
    /**选秀通用头*/
    public static headCom: string =  "assets/chs/swf/draft/headCom_"
    
    /**好友*/
    public static friend: string = "assets/chs/swf/friend.swf";
    
    /**联赛*/
    public static league: string = "assets/chs/swf/league.swf";
    
    /**球员管理*/
    public static playerManage: string = "assets/chs/swf/playerManage.swf";
    
    /**球员交易*/
    public static playerDeal: string = "assets/chs/swf/playerDeal.swf";
    
    /**天梯*/
    public static ladder: string = "assets/chs/swf/ladder.swf";
    
    /**跨服天梯*/
    public static crossServerLadder: string = "assets/chs/swf/crossServerLadder.swf";
    
    /**跨服天梯广告 */
    public static crossServerLadderAdvertisement: string = "assets/chs/swf/crossServerLadderAdvertisement.swf";
        
    /**技能学习*/
    public static skillLearn: string = "assets/chs/swf/skillLearn.swf";
    
    /**全明星*/
    public static allStar: string = "assets/chs/swf/allStar.swf"
    /**技能学习*/
    public static science: string = "assets/chs/swf/science.swf";
    /**天赋*/
    public static genius: string = "assets/chs/swf/genius.swf";
    
    /**魔法社-卡牌强化分解合成*/
    public static magic: string = "assets/chs/swf/magic.swf";
    
    /**冠军试炼*/
    public static ptls: string = "assets/chs/swf/ptls.swf"
    
    /**训练*/
    public static train: string = "assets/chs/swf/train.swf"
        
    /**玩家信息面板*/
    public static managerInfo: string = "assets/chs/swf/managerInfo.swf"
        
    /**阵型升级*/
    public static formation: string = "assets/chs/swf/formation.swf"
    
    /**意志*/
    public static will: string = "assets/chs/swf/will.swf"
    
    /**百战不殆*/
    public static firstBlood: string = "assets/chs/swf/firstBlood.swf";
    
    /**季后赛*/
    public static playoffs: string = "assets/chs/swf/playoffs.swf";
    
    /**签到*/
    public static registration: string = "assets/chs/swf/registration.swf";
    
    /**排行榜*/
    public static rank: string = "assets/chs/swf/rank.swf"
        
    /**任务*/
    public static mission: string = "assets/chs/swf/mission.swf";
    
    /**自动战斗 - 冠军试练 */
    public static autoFightChampion: string = "assets/chs/swf/autoFight_champion.swf";
    
    /**自动战斗 - 巡回赛 */
    public static autoFightRegular: string = "assets/chs/swf/autoFight_regular.swf";
    
    /**新手引导*/
    public static guide: string = "assets/chs/swf/guide.swf";
    
    /**升级动画*/
    public static levelUp: string = "assets/chs/swf/levelUp.swf";
    
    /**球员管理-球员皮肤*/
    public static playerManagerSkin: string = "assets/chs/swf/playerManageSkin.swf";
    /**球员管理-赞助商*/
    public static sponsor: string = "assets/chs/swf/sponsor.swf";
    
    /**失败提示*/
    public static failTip: string = "assets/chs/swf/failTip.swf"
                
    /** 通用活动 */
    public static commonActivity: string = "assets/chs/swf/commonActivity.swf";
    
    /** 精彩活动2 */
    public static commonActivity2: string = "assets/chs/swf/commonActivity2.swf";
    
    /** 首次充值 */
    public static firstPayActivity: string = "assets/chs/swf/firstPayActivity.swf";
        
    /** 每日充值活动 */
    public static dayPayActivity: string = "assets/chs/swf/dayPayActivity.swf";
    
    /** 黄钻贵族活动 */
    public static yellowDiamondActivity: string = "assets/chs/swf/yellowDiamondActivity.swf";
    
    /**每日消费活动*/
    public static consumeActivity: string = "assets/chs/swf/consumeActivity.swf"
        
    /** 五一活动 */
    public static wuYiActivity: string = "assets/chs/swf/wuYiActivity.swf";
    /** 五一活动排行榜 */
    public static wuYiRank: string = "assets/chs/swf/wuYiRank.swf";
    
    /** CDKey活动 */
    public static cdkeyActivity: string = "assets/chs/swf/CDKey.swf";
    
    
    
    /**技能升级*/
    public static skillLvUp: string = "assets/chs/swf/skillLvUp.swf"
    
    /**声音包 */
    public static sound: string = "assets/chs/swf/sound.swf";
    
    /**小助手*/
    public static ass: string = "assets/chs/swf/ass.swf";
    
    public static applyFriend: string = "assets/chs/swf/applyFriend.swf";
    
    public static vipSpe: string = "assets/chs/swf/vipSpe.swf";
    
    public static union: string = "assets/chs/swf/union.swf";
    
    public static unionCompain: string = "assets/chs/swf/unionCompain.swf";
    
    public static unionApply: string = "assets/chs/swf/unionApply.swf";
    /**在线奖励*/
    public static onlineReward: string = "assets/chs/swf/onlineReward.swf";

    public static loginReward: string = "assets/chs/swf/loginReward.swf";

    /** 球员图鉴 */
    public static playerShow: string = "assets/chs/swf/playerShow.swf";
    /**月卡*/
    public static monthGift: string = "assets/chs/swf/monthGift.swf";
    
    /** 组队赛 */
    public static groupMatch: string = "assets/chs/swf/groupMatch.swf";
    
    /**充值*/
    public static recharge: string = "assets/chs/swf/recharge.swf"
        
    /** boss战界面(巨星来袭) */
    public static bosswar: string = "assets/chs/swf/bosswar.swf";
    
    public static newSign: string = "assets/chs/swf/newSign.swf";

    private static nameArray:Array<string> = [];
    public static getAssetName(url:string):string{
        if(!this.nameArray[url]){
            this.nameArray[url] = url.split('/').pop().split('.').shift();
        }
        return this.nameArray[url];
    }
}
