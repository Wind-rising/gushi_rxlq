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
export default class URLConfig {
    /**Get_Data二级参数----------------------------------------------------------*/
    /**经理基础信息[ManagerBasic]  Mid:  */ 
    public static ManagerBasic:String = "ManagerBasic"
    /**经理属性[ManagerPpt]  Mid:   */
    public static ManagerPpt:String = "ManagerPpt";
    /**球队[ManagerTeam]  Mid:   */
    public static ManagerTeam:String = "ManagerTeam";
    /**球队技能卡[ManagerTeamSkillCard]  */ 
    public static ManagerTeamSkillCard:String  ="ManagerTeamSkillCard";
    /**球员[ManagerPlayer]  Mid:  Tid:  */ 
    public static ManagerPlayer:String = "ManagerPlayer";
    /**球员训练[ManagerTrain]   */
    public static ManagerTrain:String = "ManagerTrain";
    /**球员训练基地[ManagerTrainBase]  Mid:   */
    public static ManagerTrainBase:String = "ManagerTrainBase";
    /**装备属性[ManagerEquipment]  Mid:  Euid:*/   
    public static ManagerEquipment:String = "ManagerEquipment";
    /**好友可观摩列表[ManagerTrainWatch]*/   
    public static ManagerTrainWatch:String = "ManagerTrainWatch";
    /**常规背包[ManagerItem]   */
    public static ManagerItem:String = "ManagerItem";
    /**技能卡背包[ManagerSkillCard]*/   
    public static ManagerSkillCard:String = "ManagerSkillCard";
    /**统计[ManagerStat]  Mid:   */
    public static ManagerStat:String  ="ManagerStat";
    /**经理搜索[ManagerSearch]  Name:*/   
    public static ManagerSearch:String = "ManagerSearch";
    /**Buff列表[ManagerBuff] */
    public static ManagerBuff:String = "ManagerBuff";
    /**Buff消息[ManagerBuffMsg] */
    public static ManagerBuffMsg:String = "ManagerBuffMsg";
    /**Feed列表[ManagerFeed]   */
    public static ManagerFeed:String = "ManagerFeed";
    /**vip[Vip]*/
    public static Vip:String = "Vip"
    /**KPI信息[KpiInfo]*/
    public static KpiInfo:String = "KpiInfo";
    /**球员综合能力[PlayerKp]   */
    public static PlayerKp:String = "PlayerKp"
    /**球员培养[PlayerPy]  Tid:   */
    public static PlayerPy:String  = "PlayerPy";
    /**邮件列表[MailList]  Type:  Page:  PageItems:   */
    public static MailList:String = "MailList";
    /**未读邮件数[MailUnReadNum]   */
    public static MailUnReadNum:String = "MailUnReadNum"
    /**请教临时栏位[SkillAsk]*/   
    public static SkillAsk:String  = "SkillAsk";
    /**好友信息[Friend]   */
    public static Friend:String = "Friend";
    /**球员分解提示[MagicDecompose]  Type:   */
    public static MagicDecompose:String  = "MagicDecompose";
    /**球员强化提示[MagicStrengthen]  Flag:  Type:  ItemCode1:  ItemCode2:  Str1:  Str2: */  
    public static MagicStrengthen:String  = "MagicStrengthen";
    /**球员合成提示[MagicMerge]  KP1:  KP2:  KP3:  KP4:  KP5:  Flag: */  
    public static MagicMerge:String = "MagicMerge";
    /**随机好友[RandFriend]*/   
    public static RandFriend:String  = "RandFriend";
    /**战术[Tactics]   */
    public static Tactics:String  = "Tactics";
    /**换人[Substitute]   */
    public static Substitute:String  ="Substitute";
    /**常规赛进程[Regular]   */
    public static Regular:String  = "Regular";
    /**经理二进制比赛队伍信息[ManagerMatchBin]   */
    public static ManagerMatchBin:String  ="ManagerMatchBin";
    /**npc二进制比赛队伍信息[NpcMatchBin]  Rid:  */
    public static NpcMatchBin:String = "NpcMatchBin";
    /**四节阵容[TeamPeriod]   */
    public static TeamPeriod:String  = "TeamPeriod";
    /**赛前实例对比[MatchView]*/
    public static MatchView:String = "MatchView";
    /** 跨服天梯阵容[LadderGlobalMatchView] HomeId: */
    public static LadderGlobalMatchView:String = "LadderGlobalMatchView";
    /**国战赛季信息*/
    public static GvgInfo:String = "GvgInfo";
    /** 国战比赛奖励信息 */
    public static GvgEndInfo:String = "GvgEndInfo";
    /**玩家区域信息[LeaguePlayer]*/
    public static LeaguePlayer:String = "LeaguePlayer";
    /**联赛信息[LeagueInfo]  Division:  Type:  Group: */
    public static LeagueInfo:String  ="LeagueInfo"
    /**联赛状态[LeagueStatus]  Division:  Type:  Group: */
    public static LeagueStatus:String  ="LeagueStatus"
    /**联赛赔率[LeagueGambleOdd]  Lid:   */
    public static LeagueGambleOdd:String = "LeagueGambleOdd";
    /**联赛赛季奖励[LeagueSeasonPrize]*/
    public static LeaguePrize:String = "LeaguePrize";
    /**季后赛信息[PlayOffInfo] */
    public static PlayOffInfo:String  = "PlayOffInfo";
    /**季后赛状态[PlayOffStatus] */
    public static PlayOffStatus:String  = "PlayOffStatus";
    /**季后赛赛季奖励[PlayOffSeasonPrize] */
    public static PlayOffSeasonPrize:String = "PlayOffSeasonPrize";
    /**选秀*/
    public static MagicDraft:String = "MagicDraft"
    /**天梯*/
    public static Ladder:String = "Ladder"
    /**天梯赛季*/
    public static LadderInfo:String = "LadderInfo"
    /**天梯-教练*/
    public static LadderHonor:String = "LadderHonor"
    /**天梯-历程*/
    public static LadderHistory:String = "LadderHistory"
    /** 当日的跨服天梯历时比赛结果记录[Post_LadderGlobal_TodayLog] */
    public static Post_LadderGlobal_TodayLog:String = "Post_LadderGlobal_TodayLog"
    /**天梯-播报*/
    public static LadderReport:String = "LadderReport"
    /**天梯-状态*/
    public static LadderStatus:String = "LadderStatus"
    /**天梯-对手*/
    public static LadderMatch:String = "LadderMatch"
    /**天梯总排行*/
    public static LadderRankAll:String = "LadderRankAll"
    /**天梯我的排行*/
    public static LadderRankMy:String = "LadderRankMy";
    
    /** 天梯基本信息获取[Post_LadderGlobal_Manager] */
    public static Post_LadderGlobal_Manager:String = "Post_LadderGlobal_Manager";
    /** 跨服天梯赛季信息[Post_LadderGlobal_Info] */
    public static Post_LadderGlobal_Info:String = "Post_LadderGlobal_Info";
    /** 天梯我的排行信息[Post_LadderGlobal_Myrank] */
    public static Post_LadderGlobal_Myrank:String = "Post_LadderGlobal_Myrank";
    /** 天梯总排行信息[Post_LadderGlobal_Allrank] */
    public static Post_LadderGlobal_Allrank:String = "Post_LadderGlobal_Allrank";
    /** 跨服天梯当前比赛ID[Post_LadderGlobal_Match] */
    public static Post_LadderGlobal_Match:String = "Post_LadderGlobal_Match";
    /** 跨服天梯获取历时排名纪录[Post_LadderGlobal_SeasonRank] */
    public static Post_LadderGlobal_SeasonRank:String = "Post_LadderGlobal_SeasonRank";
    /** 获取天梯赛得分 */
    public static Post_LadderGlobal_MatchScore:String = "Post_LadderGlobal_MatchScore";
    /** 获取跨服天梯赛玩家信息 */
    public static Post_LadderGlobal_ManagerView:String = "Post_LadderGlobal_ManagerView";
    /** 跨服天梯-播报*/
    public static Post_LadderGlobal_Report:String = "Post_LadderGlobal_Report";
        
    /**全明星*/
    public static AllStar:String = "AllStar";
    /**冠军试炼*/
    public static Champion:String = "Champion"
    /**天赋[Talent]  */
    public static Talent:String = "Talent";
    /**血战[Blood]*/
    public static Blood:String = "Blood";
    /**意志[ManagerTeamComb]*/
    public static ManagerTeamComb:String = "ManagerTeamComb"
    /**排行[Rank] Type: */
    public static Rank:String = "Rank";
    /**天梯奖励*/
    public static LadderPrize:String = "LadderPrize"
    /**工资帽预览SalaryCap*/
    public static SalaryCap:String = "SalaryCap";
    /**经理登录信息*/
    public static ManagerLogin2:String = "ManagerLogin";
    /**签到*/
    public static ManagerLogin:String = "ManagerLogin"
    /**获取任务列表和活跃度奖励数据*/
    public static MissionAct:String = "MissionAct";
    /**领取活跃度奖励*/
    public static MissionActDone:String = "Post_Mission_ActDone";
    /**每日任务[MissionDay]*/
    public static MissionDay:String = "MissionDay";
    /**精英任务[MissionElite]*/
    public static MissionElite:String = "MissionElite";
    /**新手任务[MissionGuide] */
    public static MissionGuide:String = "MissionGuide";
    /**成长任务[MissionGrow] */
    public static MissionGrow:String = "MissionGrow";
    /**副本任务[MissionCopy]   */
    public static MissionCopy:String = "MissionCopy";
    /**功能引导任务[MissionIntro]   */
    public static MissionIntro:String = "MissionIntro";
    /**NPC详细信息[NpcTeam]  Rid:*/
    public static NpcTeam:String = "NpcTeam";
    /**每日消费列表[DayConsume]   */
    public static DayConsume:String = "DayConsume" 
    /**月卡数据包[MonthGift]   */
    public static MonthGift:String = "MonthGift";
    /**限购礼包*/
    public static PointGift:String = "PointGift";
    
    //-------------- 活动相关接口 --------------
    /** 日常活动列表 */
    public static ActiveList:String = "ActiveList";		
    /** 首次充值活动 */
    public static FirstPayGift:String = "FirstPayGift";		
    /** 每日充值数据 */
    public static Post_Active_PayGiftData:String = "Post_Active_PayGiftData";		
    /** 领取每日每日&连续7天接口 */
    public static Post_Active_PayGift:String = "Post_Active_PayGift";		
    /** 领取首充奖励接口 */
    public static Post_Active_FirstPay:String = "Post_Active_FirstPay";	
    /**每日消费奖励[Post_Active_Consume]  Date:  */
    public static Post_Active_Consume:String = "Post_Active_Consume";
    /** 51活动 */
    public static WuyiActiveData:String = "WuyiActiveData";		
    /** 五一常规购买 */
    public static Post_Active_Wuyibuy:String = "Post_Active_Wuyibuy";		
    /** 五一冠军购买 */
    public static Post_Active_Wuyibuyten:String = "Post_Active_Wuyibuyten";		
    /** 五一兑换奖励 */
    public static Post_Active_Wuyiexchange:String = "Post_Active_Wuyiexchange";		
    
    /** 活动列表[Post_Active_ActiveList] （跨服天梯广告显示状态） （巨星来袭开启控制）*/
    public static Post_Active_ActiveList:String = "Post_Active_ActiveList";		
    
    /** 黄钻方面的数据包 */
    public static ManagerGift:String = "ManagerGift";		
    /** 黄钻尊享礼包领取 */
    public static Post_Manager_Gift:String = "Post_Manager_Gift";		
    /** 黄钻每日包领取 */
    public static Post_Manager_GiftDay:String = "Post_Manager_GiftDay";
    
    public static Post_Manager_LoginG:String = "Post_Manager_LoginG";
    

    /**定义接口名-----------------------------------------------------------------*/
    /**获取数据包方式*/
    public static Get_Data:String = "Get_Data";
    /**创建经理[Post_Manager_New]  Name:  TeamId:  Logo:   */
    public static Post_Manager_New:String = "Post_Manager_New";
    /**买工资帽[Post_Manager_BuySalaryCap]*/
    public  static Post_Manager_BuySalaryCap:String = "Post_Manager_BuySalaryCap";
    /**买体力[Post_Manager_BuyStamina] */
    public static Post_Manager_BuyStamina:String = "Post_Manager_BuyStamina"
    /**体力提示[Post_Manager_Stamina]*/
    public static Post_Manager_Stamina:String = "Post_Manager_Stamina";
    /**加载结束[Post_Manager_LoadFinish]*/
    public static Post_Manager_LoadFinish:String = "Post_Manager_LoadFinish";
    /**赞助商[Post_Manager_Sponsor]  Tip:  */
    public static Post_Manager_Sponsor:String = "Post_Manager_Sponsor";
    /**心跳(5min)[Post_Manager_HeartBeat]  */
    public static Post_Manager_HeartBeat:String = "Post_Manager_HeartBeat";
    
    /**赛后抽卡[Post_Match_Lottery]   MatchId:  */
    public static Post_Match_Lottery:String = "Post_Match_Lottery"
    /**抽卡片[Post_Match_GetLottery] MatchId:  */
    public static Post_Match_GetLottery:String = "Post_Match_GetLottery"
    /**赛前对比[Post_Regular_Fight]  Rid：*/
    public static Post_Regular_Fight:String = "Post_Regular_Fight";
    /** 巡回赛挂机 */
    public static Post_Regular_Practice:String = "Post_Regular_Practice";
    /** 巡回赛取消挂机 */
    public static Post_Regular_Cancel:String = "Post_Regular_Cancel";
    /** 巡回赛挂机加速 */
    public static Post_Regular_Speed:String = "Post_Regular_Speed";
    /** 巡回赛挂机时间到 */
    public static Post_Regular_Pfight:String = "Post_Regular_Pfight";
    /**设置阵型[Post_Team_SetSolution]  Fids[0]:  Fids[1]:  Fids[2]:  Fids[3]:  Tids[0]:  Tids[1]:  Tids[2]:  Tids[3]:   */
    public static Post_Team_SetSolution:String = "Post_Team_SetSolution";
    /**删除道具[Post_Pkg_DropItem]  Uuids: */  
    public static Post_Pkg_DropItem:String  ="Post_Pkg_DropItem";
    /**整理道具[Post_Pkg_SortItem]   */
    public static Post_Pkg_SortItem:String  = "Post_Pkg_SortItem";
    /**扩展背包[Post_Pkg_ExtItem]  */
    public static Post_Pkg_ExtItem:String = "Post_Pkg_ExtItem";
    /**使用道具[Post_Pkg_UseItem]  Uuid:   */
    public static Post_Pkg_UseItem:String  = "Post_Pkg_UseItem";
    /**扩展技能背包[Post_Pkg_ExtSkillCard]   */
    public static Post_Pkg_ExtSkillCard:String  = "Post_Pkg_ExtSkillCard";
    /**穿装备戒指[Post_Pkg_EquipSuit]  Uuid:  Tid:   */
    public static Post_Pkg_EquipSuit:String  = "Post_Pkg_EquipSuit";
    /**卸装备戒指[Post_Pkg_EquipDrop]  Uuid:  Tid:   */
    public static Post_Pkg_EquipDrop:String = "Post_Pkg_EquipDrop";
    /**比赛二进制数据（伪）[Post_Match_GetMatchBin]   MatchId:  */
    public static Post_Match_GetMatchBin:String = "Post_Match_GetMatchBin";
    /**随机获取球队[Post_Manager_RandTeam]*/
    public static Post_Manager_RandTeam:String = "Post_Manager_RandTeam"
    /**随机球队名字[Post_Manager_RandName]*/
    public static Post_Manager_RandName:String = "Post_Manager_RandName"
    //-----------------------------------国战相关接口---------------------------------------
    /**玩家信息*/
    public static Post_Gvg_ManagerInfo:String = "Post_Gvg_ManagerInfo";
    /**国战报名*/
    public static Post_Gvg_SignUp:String = "Post_Gvg_SignUp";
    /**前往据点*/
    public static Post_Gvg_Goto:String = "Post_Gvg_Goto";
    /**防守*/
    public static Post_Gvg_Hold:String = "Post_Gvg_Hold";
    /**取消防守进攻*/
    public static Post_Gvg_Leave:String = "Post_Gvg_Leave";
    /**挑战*/
    public static Post_Gvg_Raise:String = "Post_Gvg_Raise";
    /**区域信息*/
    public static Post_Gvg_ZoneInfo:String = "Post_Gvg_ZoneInfo";
    /**清除失败CD*/
    public static Post_Gvg_ClearLoseCd:String = "Post_Gvg_ClearLoseCd";
    /**清除连胜Debuff*/
    public static Post_Gvg_ClearDebuff:String = "Post_Gvg_ClearDebuff";
    /**国战排行榜*/
    public static Post_Gvg_RankList:String = "Post_Gvg_RankList";
    
    //-------------------------------------------------竞技场接口开始-----------------------------------------
    public static ArenaInfo:String = "ArenaInfo"; //竞技场信息
    public static ArenaOppo:String = "ArenaOppo"; //挑战列表
    public static Post_Arena_Oppo:String = "Post_Arena_Oppo"; //使用球票更换对手
    public static ArenaRankAll:String = "ArenaRankAll"; //竞技场排行
    public static ArenaHistory:String = "ArenaHistory"; //比赛记录
    public static Post_Arena_Match:String = "Post_Arena_Match"; //打比赛
    public static Post_Arena_MatchTime:String = "Post_Arena_MatchTime"; //购买比赛次数
    public static Post_Arena_CD:String = "Post_Arena_CD"; //秒cd
    /**比赛结算[Post_Arena_Reward] MatchId:  */
    public static Post_Arena_Reward:String = "Post_Arena_Reward";
    //--------------------------------------------------竞技场接口结束-----------------------------------------
    /**公告*/
    public static Post_Gvg_NoticeList:String = "Post_Gvg_NoticeList";
    /** 比赛匹配结果 */
    public static Post_Gvg_MatchView:String = "Post_Gvg_MatchView";
    //-----------------------------------国战相关接口---------------------------------------
    /**选秀刷新[Post_Magic_Draft]*/
    public static Post_Magic_Draft:String = "Post_Magic_Draft"
    /**选秀抽签[Post_Magic_DraftSave]*/
    public static Post_Magic_DraftSave:String = "Post_Magic_DraftSave"
    
    /**发送邮件[Post_Mail_Send]  Mid:  Title:  Content:  */
    public static Post_Mail_Send:String = "Post_Mail_Send"
    /**邮件附件领取[Post_Mail_Draw]  Idx:  */
    public static Post_Mail_Draw:String = "Post_Mail_Draw";
    /**邮件附件一键领取[Post_Mail_DrawAll]  */
    public static Post_Mail_DrawAll:String = "Post_Mail_DrawAll"
    /**邮件处理[Post_Mail_Set]  Type:  Idxs:  */
    public static Post_Mail_Set:String = "Post_Mail_Set";
    /**一键删除[Post_Mail_DelAll]*/
    public static Post_Mail_DelAll:String = "Post_Mail_DelAll";
    
    /**解雇球员[Post_Team_FirePlayer]  Tid:  IgnoreEquip:  */
    public static Post_Team_FirePlayer:String  = "Post_Team_FirePlayer";
    /**培养球员[Post_Team_PyPlayer]  Tid:  Type:  	Lock:  */
    public static Post_Team_PyPlayer:String = "Post_Team_PyPlayer";
    /**培养球员-保存[Post_Team_PyPlayerSave]  Tid:  Mode:  */
    public static Post_Team_PyPlayerSave:String = "Post_Team_PyPlayerSave";
    /**球员成长[Post_Team_GrowPlayer]  Tid:  Type:  */
    public static Post_Team_GrowPlayer:String = "Post_Team_GrowPlayer"
    /**球员成长-突破[Post_Team_GrowPlayerBreak]  Tid:  Uuid: */
    public static Post_Team_GrowPlayerBreak:String = "Post_Team_GrowPlayerBreak"
    /**设置技能卡[Post_Team_SetSkillCard]  Tid:  Pos:  Uuid:  Equip:  */
    public static Post_Team_SetSkillCard:String = "Post_Team_SetSkillCard";
    
    /**天梯-兑换[Post_Ladder_Honor] Idx:*/
    public static Post_Ladder_Honor:String = "Post_Ladder_Honor"
    /**进入天梯[Post_Ladder_Join]*/
    public static Post_Ladder_Join:String = "Post_Ladder_Join"
    /**取消天梯[Post_Ladder_Quit]*/
    public static Post_Ladder_Quit:String = "Post_Ladder_Quit";
    /**报名跨服天梯[Post_LadderGlobal_Signup]*/
    public static Post_LadderGlobal_Signup:String = "Post_LadderGlobal_Signup"
    /**取消跨服天梯  退出天梯[Post_LadderGlobal_Exit] */
    public static Post_LadderGlobal_Exit:String = "Post_LadderGlobal_Exit";
        
    /**全明星赛打比赛[Post_AllStar_Fight]*/
    public static Post_AllStar_Fight:String = "Post_AllStar_Fight";
    /**全明星重置*/
    public static Post_AllStar_Reset:String = "Post_AllStar_Reset";
    /**全明星花钱加重置次数*/
    public static Post_AllStar_Buy:String = "Post_AllStar_Buy";
    
    /**进驻[Post_League_Join]  Division:  */
    public static Post_League_Join:String = "Post_League_Join"
    /**换区[Post_League_DivisionChange]  Division:  Uuid:  */
    public static Post_League_DivisionChange:String = "Post_League_DivisionChange"
    /**竞猜[Post_League_Gamble]  Lid:  GambleResult:  Point:  */
    public static Post_League_Gamble:String = "Post_League_Gamble";
    //----------------------------冠军试练-----------------------------------------
    /**冠军试炼 [Post_Champion_Fight]*/
    public static Post_Champion_Fight:String = "Post_Champion_Fight";
    /**冠军试炼-重置[Post_Champion_Reset]*/
    public static Post_Champion_Reset:String = "Post_Champion_Reset";
    /**重置消耗*/
    public static Post_Champion_ResetCost:String = "Post_Champion_ResetCost";
    /** 挂机 */
    public static Post_Champion_Practice:String = "Post_Champion_Practice";
    /** 取消挂机 */
    public static Post_Champion_Cancel:String = "Post_Champion_Cancel";
    /** 挂机加速 */
    public static Post_Champion_Speed:String = "Post_Champion_Speed";
    /** 单场挂机奖励*/
    public static Post_Champion_Pfight:String = "Post_Champion_Pfight";
    //----------------------------冠军试练-----------------------------------------
    /**技能请教[Post_Team_SkillAsk]  Tid:  Type:  Lv:  OneKey:  */
    public static Post_Team_SkillAsk:String = "Post_Team_SkillAsk";
    /**技能请教-保存[Post_Team_SkillAskSave]  Tid:  Num:  */
    public static Post_Team_SkillAskSave:String = "Post_Team_SkillAskSave"
    /**吞噬技能卡[Post_Team_SkillEat]  Tid:  Uuid:  EatUuids:  */
    public static Post_Team_SkillEat:String = "Post_Team_SkillEat"
    /**吞噬技能卡-一键推荐[Post_Pkg_SkillEatOneKey]  Uuid:*/
    public static Post_Pkg_SkillEatOneKey:String = "Post_Pkg_SkillEatOneKey"
    
    /**强化[Post_Equip_Strengthen]  Source:  Uuid:   */
    public static Post_Equip_Strengthen:String = "Post_Equip_Strengthen";
    /**合成[Post_Equip_Pair]  Source:  Uuid:  */
    public static Post_Equip_Pair:String = "Post_Equip_Pair"
    /**洗炼[Post_Equip_Wash]  Source:  Uuid:  Keep:  */
    public static Post_Equip_Wash:String = "Post_Equip_Wash"
    /**强化戒指[Post_Equip_RingStrengthen]  Source:  Uuid:  */
    public static Post_Equip_RingStrengthen:String = "Post_Equip_RingStrengthen"
    /**戒指升星[Post_Equip_Star]  Source:  Uuid:  */
    public static Post_Equip_Star:String = "Post_Equip_Star";
    /**戒指洗炼[Post_Equip_RingWash]  Source:  Uuid:  Keep:  */
    public static Post_Equip_RingWash:String = "Post_Equip_RingWash"
    /**粘签名纸[Post_Equip_Sign]  Source:  Uuid:  Sign:  */
    public static Post_Equip_Sign:String = "Post_Equip_Sign";
    /**洗练消耗[Post_Equip_WashCost] */
    public static Post_Equip_WashCost:String = "Post_Equip_WashCost"
        
    /**分解[Post_Magic_Decompose]  Uuid:   */
    public static Post_Magic_Decompose:String = "Post_Magic_Decompose";
    /**强化[Post_Magic_Strengthen] Uuid1:  Uuid2:  Flag:  */
    public static Post_Magic_Strengthen:String = "Post_Magic_Strengthen";
    /**合成[Post_Magic_Merge]  Uuid1:  Uuid2:  Uuid3:  Uuid4:  Uuid5:  Flag:  Rate: */
    public static Post_Magic_Merge:String = "Post_Magic_Merge";
    /**定向合成[Post_Magic_Merge]  Uuid1:  Uuid2:  Uuid3:  Uuid4:  Uuid5:  Flag: Target: */
    public static Post_Magic_MergeFormula:String = "Post_Magic_MergeFormula";
    
    /**训练-训练开始[Post_Team_TrainBegin]  Tid:  Type:  */
    public static Post_Team_TrainBegin:String = "Post_Team_TrainBegin"
    /**训练-收获/中断收获[Post_Team_TrainGain]  Tid:  */
    public static Post_Team_TrainGain:String = "Post_Team_TrainGain"
    /**球员训练加速/恢复满体力(获取提示)[Post_Team_TrainAcce]  Tid:  Tip:  Point:  */
    public static Post_Team_TrainAcce:String = "Post_Team_TrainAcce"
        
    /**升级战术[Post_Tactics_Extend]  Id:  */
    public static Post_Tactics_Extend:String = "Post_Tactics_Extend";
    /**战术降级[Post_Tactics_Degrade]  Id:  Type:  */
    public static Post_Tactics_Degrade:String = "Post_Tactics_Degrade";
    
    /**加点[Post_Team_TalentAddPoint]  Page:  Id:  */
    public static Post_Team_TalentAddPoint:String = "Post_Team_TalentAddPoint"
    /**购买天赋页[Post_Team_TalentBuyPage]  */
    public static Post_Team_TalentBuyPage:String = "Post_Team_TalentBuyPage"
    /**重置天赋页[Post_Team_TalentReset]  Page:  Point:  */
    public static Post_Team_TalentReset:String  = "Post_Team_TalentReset";
    /**设置强化位[Post_Team_TalentSetStrPos]  Page:  StrPos:  Pos:  */
    public static Post_Team_TalentSetStrPos:String = "Post_Team_TalentSetStrPos";
    /**天赋装备[Post_Team_TalentSetPeriod]  Pages:  */
    public static Post_Team_TalentSetPeriod:String = "Post_Team_TalentSetPeriod";

    /**打比赛[Post_Blood_Fight] Protect: */
    public static Post_Blood_Fight:String = "Post_Blood_Fight";
    /** 百战不殆自动挂机 */
    public static Post_Blood_Practice:String = "Post_Blood_Practice";
    /** 取消百战不殆自动挂机 */
    public static Post_Blood_Cancel:String = "Post_Blood_Cancel";
    /** 百战不殆自动挂机打比赛 */
    public static Post_Blood_Pfight:String = "Post_Blood_Pfight";
    /** 百战不殆挂机清cd打比赛 */
    public static Post_Blood_Speed:String = "Post_Blood_Speed";
    /**查看各种消耗[Post_Blood_Cost] */
    public static Post_Blood_Cost:String = "Post_Blood_Cost"
    /**重置[Post_Blood_Reset] */
    public static Post_Blood_Reset:String = "Post_Blood_Reset"
    /**补体力[Post_Blood_Beer] */
    public static Post_Blood_Beer:String = "Post_Blood_Beer";
    /**助威[Post_Blood_Morale] */
    public static Post_Blood_Morale:String = "Post_Blood_Morale"
    /**排行[Post_Blood_Rank] */
    public static Post_Blood_Rank:String = "Post_Blood_Rank";
    
    /**意志-装备[[Post_Team_WillSet]  SkillCode:  Uuid: */
    public static Post_Team_WillSet:String = "Post_Team_WillSet"
    /**意志-提升默契度[Post_Team_WillUp] SkillCode:  Type:*/
    public static Post_Team_WillUp:String = "Post_Team_WillUp";
    
    /** 商城 - 购买 */
    public static Post_Mall_Buy:String = "Post_Mall_Buy";
    public static Mall_List:String = "MallList";
    /** 商城限量商品 */
    public static LimitShop:String = "LimitShop";
    /** 购买限量商品 */
    public static Post_Mall_LimitShopBuy:String = "Post_Mall_LimitShopBuy";
    /** 购买活动商品 */
    public static Post_Mall_PlayerBuy:String = "Post_Mall_PlayerBuy";

    /**发送邀请[Post_Friend_Apply] Name:*/
    public static Post_Friend_Apply:String = "Post_Friend_Apply";
    /**接受邀请[Post_Friend_AcceptInvite] Mids: */
    public static Post_Friend_AcceptInvite:String = "Post_Friend_AcceptInvite";
    /**拒绝邀请[Post_Friend_RefuseInvite] Mids: */
    public static Post_Friend_RefuseInvite:String = "Post_Friend_RefuseInvite";
    /**删除好友[Post_Friend_DelFriend] Mids: */
    public static Post_Friend_DelFriend:String = "Post_Friend_DelFriend";
    /**好友挑战[Post_Friend_Challenge] Mids: */
    public static Post_Friend_Challenge:String = "Post_Friend_Challenge";
    /**好友挑战次数[Post_Friend_Ctime] Mids: */
    public static Post_Friend_Ctime:String = "Post_Friend_Ctime";
    
    /**聊天校验[Post_Manager_Chat] */
    public static Post_Manager_Chat:String = "Post_Manager_Chat"
    
    /**卡牌    竞猜[Post_PlayOff_Gamble] Uuid: Round: GambleMid: */
    public static Post_PlayOff_Gamble:String = "Post_PlayOff_Gamble";
    /**签到*/
    public static Post_Manager_Sign:String = "Post_Manager_Sign";
    /**领取签到奖励*/
    public static Post_Manager_SignGift:String = "Post_Manager_SignGift"
    /**领取[Post_Mission_Done] MissionId: Type: */
    public static Post_Mission_Done:String = "Post_Mission_Done";
    
    /** 球员交易列表 */
    public static Post_Trans_Traning:String = "Post_Trans_Traning";
    /** 竞拍 */
    public static Post_Trans_Transed:String = "Post_Trans_Transed";
    /** 一口价 */
    public static Post_Trans_OneTrans:String = "Post_Trans_OneTrans";
    /** 开始拍卖 */
    public static Post_Trans_Start:String = "Post_Trans_Start";
    /** 取消拍卖 */
    public static Post_Trans_Cancel:String = "Post_Trans_Cancel";
    
    /**好友邀请*/
    public static Post_Active_Invite:String = "Post_Active_Invite";
    /**领取邀请奖励*/
    public static Post_Active_InviteReward:String = "Post_Active_InviteReward";
    /**VIP6礼包*/
    public static Post_Active_Vip6Reward:String = "Post_Active_Vip6Reward";
    /**在线奖励[Post_Active_OnlineInfo]  */
    public static Post_Active_OnlineInfo:String = "Post_Active_OnlineInfo";
    /**领取在线奖励[Post_Active_OnlineReward]  Type:  */
    public static Post_Active_OnlineReward:String = "Post_Active_OnlineReward";
    
    /**一键脱装备[Post_Pkg_AllEquipDrop]  Tid:  */
    public static Post_Pkg_AllEquipDrop:String = "Post_Pkg_AllEquipDrop";
    /**获取阵容[Post_League_TeamInfo]  Mid:  Date:  */
    public static Post_League_TeamInfo:String = "Post_League_TeamInfo";
    
    public static Post_Manager_LoginG1:String = "Post_Manager_LoginG";
    
    /**公会*/
    public static Post_Guild_AllInfo:String = "Post_Guild_AllInfo";
    
    public static Post_Guild_Create:String = "Post_Guild_Create";
    
    public static Post_Guild_Apply:String = "Post_Guild_Apply";
    
    public static Post_Guild_Info:String = "Post_Guild_Info";
    
    public static Post_Guild_Donate:String = "Post_Guild_Donate";
    
    public static Post_Guild_InfoChange:String = "Post_Guild_InfoChange";
    
    public static Post_Guild_Dissolution:String = "Post_Guild_Dissolution";
    
    public static Post_Guild_CancelApply:String = "Post_Guild_CancelApply";
    
    public static Post_Guild_Invite:String = "Post_Guild_Invite";
    
    public static Post_Guild_Shop:String = "Post_Guild_Shop";
    
    public static Post_Guild_MallBuy:String = "Post_Guild_MallBuy";
    
    public static Post_Guild_ApplyInfo:String = "Post_Guild_ApplyInfo";
    
    public static Post_Guild_Verify:String = "Post_Guild_Verify";
    
    public static Post_Guild_Remove:String = "Post_Guild_Remove";
    
    public static Post_Guild_Transfer:String = "Post_Guild_Transfer";
    
    public static Post_Guild_Log:String = "Post_Guild_Log";
    
    /**新手引导礼包领取[Post_Mission_Gift]  Type:  */
    public static Post_Mission_Gift:String = "Post_Mission_Gift";
    
    public static Post_Guild_Exit:String = "Post_Guild_Exit";
    
    public static Post_Guild_InviteDispose:String = "Post_Guild_InviteDispose";
    
    public static Post_Guild_Skill:String = "Post_Guild_Skill";
    
    public static Post_Guild_StudySkill:String = "Post_Guild_StudySkill";
    /**领取月卡礼包[Post_Manager_MonthGift]  */
    public static Post_Manager_MonthGift:String = "Post_Manager_MonthGift";
    /**购买月卡礼包[Post_Manager_MonthCard]  Type:  */
    public static Post_Manager_MonthCard:String = "Post_Manager_MonthCard";
    
    public static Post_Guild_DayAvaReward:String = "Post_Guild_DayAvaReward";
    
    public static Post_Guild_DayReward:String = "Post_Guild_DayReward";
    
    public static Post_Guild_ShareReward:String = "Post_Guild_ShareReward";
    
    public static Post_Gift_Point:String = "Post_Gift_Point";
    
    public static Post_GuildFight_Report32:String = "Post_GuildFight_Report32";
    
    public static Post_GuildFight_Report16:String = "Post_GuildFight_Report16";
    
    public static Post_GuildFight_Status:String = "Post_GuildFight_Status";
    
    public static Post_GuildFight_Apply:String = "Post_GuildFight_Apply";
    
    public static Post_GuildFight_Add:String = "Post_GuildFight_Add";
    
    public static Post_GuildFight_Arrange:String = "Post_GuildFight_Arrange";
    
    public static Post_GuildFight_ResetArrange:String = "Post_GuildFight_ResetArrange";
    
    public static Post_GuildFight_Pkg:String = "Post_GuildFight_Pkg";
    
    public static Post_GuildFight_AssignItem:String = "Post_GuildFight_AssignItem";
    
    
    /** 进入大厅[Post_Group_Enter] */
    public static Post_Group_Enter:String = "Post_Group_Enter";
    /** 离开大厅[Post_Group_LeftEnter] */
    public static Post_Group_LeftEnter:String = "Post_Group_LeftEnter";
    /** 创建房间[Post_Group_Create]   Type：1、组队，2、单人；Pass：密码；P_Id：章节 */
    public static Post_Group_Create:String = "Post_Group_Create";
    /** 房间信息[GroupRoom] RoomId: 房间编号 */
    public static GroupRoom:String = "GroupRoom";
    /** 解散房间[Post_Group_Fire] RoomId: 房间编号 */
    public static Post_Group_Fire:String = "Post_Group_Fire";
    /** 章节房间列表[GroupRooms] */
    public static GroupRooms:String = "GroupRooms";
    /** 报名参加比赛[Post_Group_Join] */
    public static Post_Group_Join:String = "Post_Group_Join";
    /** 离开房间[Post_Group_Quit] */
    public static Post_Group_Quit:String = "Post_Group_Quit";
    /** 快速进入[Post_Group_JoinAcc] */
    public static Post_Group_JoinAcc:String = "Post_Group_JoinAcc";
    /** 邀请玩家进入房间[Post_Group_Apply] */
    public static Post_Group_Apply:String = "Post_Group_Apply";
    /** 房主踢人[Post_Group_Kick] */
    public static Post_Group_Kick:String = "Post_Group_Kick";
    /** 开始比赛[Post_Group_Start] */
    public static Post_Group_Start:String = "Post_Group_Start";
    /** 非房主准备[Post_Group_Ready] */
    public static Post_Group_Ready:String = "Post_Group_Ready";
    /** 切换关卡[Post_Group_Cross] */
    public static Post_Group_Cross:String = "Post_Group_Cross";
    /** 产生开始比赛cd[Post_Group_CD] */
    public static Post_Group_CD:String = "Post_Group_CD";
    
    /** boss战boss阵容数据 */
    public static Post_Regular_Teaminfo:String = "Post_Regular_Teaminfo";
    /** 获取交互配置信息[Post_GetWay_Conf] */
    public static Post_GetWay_Conf:String = "Post_GetWay_Conf";
    
    /** 获取礼包奖励 */
    public static Post_Gift_Vip:String = "Post_Gift_Vip";
    
    /** 托管球员 */
    public static Post_Manager_Trusteeship:String = "Post_Manager_Trusteeship";
    /** 取消托管球员 */
    public static Post_Manager_Untrusteeship:String = "Post_Manager_Untrusteeship";
    
    /** 活动商城物品 */
    public static Post_Mall_AcShop:String = "Post_Mall_AcShop";
}
