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
export default class LanConfig{

    /**通用-tip-金币*/
    public static money: string  = "3$<font color='#FFCC33'>金币</font>\n可用于强化装备等， 总之没有钱是万万不能的|参加巡回赛等可以获得"
    /**通用-tip-球票*/
    public static point: string  = "3$<font color='#FFCC33'>球票</font>\n热血NBA官方指定通用货币，可在球票商城购买极品道具|可通过活动和充值获得"
    /**通用-tip-经验*/
    public static exp: string = "3$<font color='#FFCC33'>经验</font>\n升级的依据|参加巡回赛等可以获得"
    /**通用-tip-阅历*/
    public static yueli: string  = "3$<font color='#FFCC33'>阅历</font>\n用于升级战术|参加巡回赛等可以获得";
    /**通用-tip-灵气*/
    public static sp: string  = "3$<font color='#FFCC33'>灵气</font>\n用于球员成长，激活球星技能全靠它。|分解球员卡可以获得";
    /** 工资帽提示 */
    public static hat: string = "3$<font color='#FFCC33'>工资帽</font>\n用于签约球员。|领取后直接提升球队工资帽上限";
    /** 五一活动卡片提示 */
    public static wuyiCard: string = "五一活动卡牌|只做活动期间兑换奖励使用，抽中后在五一活动排行界面计数，不在背包中出现|过期作废，请及时兑换奖励";
    /** 五一活动套装提示 */
    public static suitTips:Array< string> = [//
        "火爆套系装备|1|火爆头巾*1\n火爆护腕*1\n火爆球衣*1\n火爆护膝*1\n火爆战靴*1|兑换后发送至背包，请注意查收",//
        "热焰套系装备|1|热焰头巾*1\n热焰护腕*1\n热焰球衣*1\n热焰护膝*1\n热焰战靴*1|兑换后发送至背包，请注意查收",//
        "裂魂套系装备|1|裂魂头巾*1\n裂魂护腕*1\n裂魂球衣*1\n裂魂护膝*1\n裂魂战靴*1|兑换后发送至背包，请注意查收",//
        "殿堂套系装备|1|殿堂头巾*1\n殿堂护腕*1\n殿堂球衣*1\n殿堂护膝*1\n殿堂战靴*1|兑换后发送至背包，请注意查收",//
        ];
    
    
    /**JS错误*/
    public static jsErr: string = "亲~您的运行环境js什么的不认识哦~"
    /**文本提示-开发中*/
    public static commingSoon: string = "开发中~很带感哦，亲~";
    /**文本提示-未定义错误*/
    public static unknownErr: string = "嗷嗷，出了点问题哦~"
    /**文本提示-基础数据获取失败*/
    public static basicDataErr: string = "基础数据获取失败！";
    /**文本提示-错误信息数据获取失败*/
    public static errDataErr: string  = "提示语信息获取失败！";
    /**文本提示，常规赛数据获取失败！*/
    public static regularDataErr: string = "常规赛数据获取失败！刷新一下试试"
    /**文本提示，球员数据获取失败*/
    public static itemDataErr: string = "球员数据获取失败！刷新一下试试";
    /**文本提示，阵型数据获取失败*/
    public static formationDataErr: string = "战术数据获取失败！刷新一下试试！";
    /**文本-球员位置*/
    public static posStr: string = "大前锋$小前锋$中锋$得分后卫$控球后卫"
    /**文本-球员位置*/
    public static posStr2: string = "中锋$大前锋$小前锋$得分后卫$控球后卫"
    /**文本提示，体力不足*/
    public static noStamina: string = "体力不足啦！！！";
    /**文本，您选中了*/
    public static sure: string = "您选中了"
    /**tips，花费XXX球票可以立即刷新*/
    public static cost: string = "花费${freshPoint}球票立即刷新"
    /**文本提示，球票不足*/
    public static noPoint: string = "您的球票不足啦 ！！！"
    public static noMoney: string = "您的金币不足啦 ！！！"
    /**
     * 国战进攻防守
     */
    public static globleState: string = "进攻方;防守方";
    
    /**
     * 报名参加国战
     */
    public static applySucc: string = "报名成功";
    
    /**
     * 国战信息失败
     */
    public static globleDataErr: string = "国战数据获取失败！刷新一下试试！";
    
    /**
     * 分数
     */
    public static scoreName: string = "分区比分;总比分;大西洋分区;东南分区;中央分区;东部联盟区域;西部联盟区域";
    
    /**
     * 国战错误信息
     */
    public static globleErro: string = "请选择你要到达的据点;";
    
    /**
     * 时间变化
     */
    public static globleTimeMes: string = "前往目的地;挑战时间;比赛CD时间;复活时间;等待比赛中";
    
    /**
     * 玩家defuf
     */
    public static globlePlayerDebuff: string = "连胜疲劳中-;%球员属性";
    
    /**
     * 清楚CD
     */
    public static clearLose: string = "可通过消耗20球票或者复活币清除复活时间。";
    
    public static clearDebuff: string = "可通过消耗球票清除负面效果。";
    
    /**
     * 清楚面板内容
     */
    public static clearContentLose: string = "清除复活时间需要花费";
    
    public static clearContentDebuff: string = "清除球队的负面效果需要花费";
    
    public static clearUnit: string = "球票";
    
    public static free: string = "确定要将所有关卡重置吗？本次免费。";
    
    public static clearSuc: string = "成功清除";
    
    public static globlePos: string = "东部;西部";
    
    public static globleEvent: string = "正在前往"
    
    public static east: string = "东部联盟"
    public static west: string = "西部联盟"
    
    public static player: string = "玩家";
    public static tag: string = "号位"
    public static tag_1: string = "1号位"
    public static tag_2: string = "2号位"
    public static tag_3: string = "3号位"
    public static tag_4: string = "4号位"
    public static tag_5: string = "5号位"
    public static free_: string = "免费"
    
    public static globleStep1_A: string = "每个赛季东、西部联盟会轮换扮演进攻方与防守方。本赛季你将作为进攻方进攻对手联盟的赛区，攻占他们的球馆。"
    public static globleStep1_D: string = "每个赛季东、西部联盟会轮换扮演进攻方与防守方。本赛季你将作为防守方防守本方联盟的赛区，防止球馆被对手攻占。"
    public static globleStep1: string = "比赛地图将会采用防守方联盟所在的地图。"
    
    public static globleStep2_A: string = "进攻方：进攻方玩家可在守方的2分钟“布阵”时间结束后进入赛场。首次可不受转场时间影响，选择任意赛区的任意球馆。"
    public static globleStep2_D: string = "防守方：作为防守方在游戏开始的时候有优先进场权，在为期2分钟的“布阵”时间中，玩家会被指派到自己所在赛区的某个球馆。玩家可以利用联盟聊天频道沟通，选择去更需要你防守的球馆。"
    
    public static globleStep3_A: string = "进攻方玩家：玩家需要在进入某个球馆后点击“挑战”按钮来报名参加比赛，系统会自动匹配守方玩家。"
    public static globleStep3_D: string = "防守方玩家：在任意球馆中点击 “防守”按钮就进入到防守状态，等待与攻方配对比赛。"
    public static globleStep3: string = "比赛失利：当双方匹配进行比赛后，输的一方将会进入复活CD中，。玩家可通过消费球票或者复活币清除复活CD。比赛连胜：当玩家持续获得2场胜利后，会进入连胜疲劳状态，在此状态下球队的实力将被削弱。直到比赛失利削弱效果将被清除。玩家可通过消费球票清除此削弱效果。"
    
    public static globleStep4: string = "配对：在比赛双方玩家进攻与防守时，系统会优先选择与玩家实力相近的对手进行比赛。赛区冠军助阵：东西部各自的三个赛区冠军将会提供进攻与防守帮助。并每过一定时间更换进攻或防守的球馆。无对手的积分增加说明：如果进攻方在报名进攻后持续10秒都找不到对手则会每隔10秒增加一次积分。防守方玩家类似，但球馆总积分不会超过对手积分。"
    
    public static globleStep5: string = "比赛积分：每场比赛后玩家会根据自己在比赛中的得分获得相应的积分，连胜或击败赛区冠军都将获得额外积分奖励。球馆积分：攻守双方在每个球馆累加玩家获得的积分，积分高的一方获胜（如果积分持平则算守方获胜），获得球馆分数。球馆分数分为赛区冠军球馆3分，普通球馆1分。胜负判定：当比赛时间到，统计东西部联盟各自获得的球馆分数，多的一方获胜。"
    
    public static globleStep6: string = "更换进攻与防守的球馆需要玩家先撤出进攻或防守状态，并选择自己将要前往的目的地，同赛区换场需要消耗1分钟的时间，跨赛区转场则消耗3分钟。"
    
    public static globleStep7: string = "获胜方奖励：所有参赛的胜方玩家将获得联盟胜利奖章，奖章将为玩家提供5%的球队实力加成，效果持续到下次联盟争霸赛开始。积分奖励：任何参赛并获得积分的玩家将根据自己获得的积分折算成金币奖励。积分排名奖励：积分排名前20的玩家将会获得排名奖励。"
    
    public static countQualter: string = "第;节比赛结束";
    
    public static qualterNum: string = "1st;2nd;3rd;4th";
    
    public static shoot:Array<string> = ["我的SHOWTIME时间到了!", '我证明了，我是能投进的。','没有人能阻止我得分！',
        '能多几个人来防我吗？这么轻松就进了。','我的中投很稳定的！','下一球还是我投。','我才是MVP投手！','才投了几分，你们这就垮了？',
        '我今天的投篮手感很好。','投出感觉来了。','我今天一定会投中很多球。', 'Bingo！中了！','射死你们！','懦夫，你防不住我的。',
        'So Easy，妈妈再也不用担心我的投篮。'];
    
    public static threeShoot:Array<string> = ["看我的百步穿杨!", '让我用三分终结你们。','我才是三分杀手。',
        '我会用三分击垮你们。','我的三分很稳定，不要妄想胜利了。','三分射中，看对面还有什么招数。','三分是我的拿手绝活。',
        '我投的三分还是完美的抛物线。'];
    
    public static slamdunk:Array<string> = ["防我，你还嫩着呢！", '我就是能在你头上扣进！','砸爆你们的篮筐！',
        '我就是全明星扣篮王！','我还想再次在你头上飞翔。','刚才真是一次完美的扣篮啊！','灌篮的感觉真不错！','我真的还想再灌一个球！',
        '这感觉真好。'];
    
    public static noShoot:Array<string> = ["今天我不在状态啊！", '我得赶紧找回感觉！','太对不起观众了。',
        '这铁打的丁玲咣当的！','再不进我会绝望的！','太失望了，下次都不敢投了！','没进？不会吧！','我的投篮怎么没进啊！',
        '不会的，下次一定会进的。','我还要继续找手感。','这么好的机会就被我浪费了。', '篮筐太小了，感到压力好大。','上帝，求你让我进一个吧。','再给我一次机会，我一定能投中。',
        '这都不进！是不是策划把数值搞错了？'];
    
    public static block:Array<string> = ["不要把球投在我手里！", '你投一次我盖一次。','让你再耍帅，盖死你。',
        '不知道我是盖帽高手嘛。','盖的就是你！','你是来得分的还是来送帽的？','不要以为我的防守是假的！',
        '敢在我头顶上出手，找盖！'];
    
    public static rebound:Array<string> = ["我是篮下小霸王！", '你长得高，不见得就能摘板！','篮板球是我的！',
        '你这么瘦弱怎么能抢过我。','你这也叫抢篮板，看我！','悲剧，你永远抢不到球的！','看我这次的表现。',
        '篮板球是我摘的，记住了。','不错啊，这球直接掉我手里了。','你们是拿不到篮板的。','你们的内线是来看戏的吧。','你们是拿不到篮板的。'];
    
    public static steal:Array<string> = ["这球断的太轻松了。", '这么慢的速度也敢过我？','过我？自寻死路！',
        '小伙子，再回去练几年吧！','要速度没速度，要技术没技术，怎么过我？','别瞪眼，下次照样断你！','你突破就是直接往我怀里撞？',
        '抢断+1，你是在让我刷数据吗。','无视对手的后果，就是被断球。','想过我可没这么容易。','你敢突破一次，我就敢断你一次！'];
    
    public static keepOff:Array<string> = ["你这传球意图太明显了。", '这种球最容易断了。','毫无威胁的传球，我都看不下去了。',
        '就知道你会往这边传。','你这传球的火候不够啊。','这球估计也就我能断下来。','神一般的意识，神一般的断抢。',
        '软绵绵的传球，在梦游吗？','无力度，无准度，你是在学中国足球吗。'];
    /**
     * 全明星信息失败
     */
    public static allStarDataErr: string = "全明星数据获取失败！刷新一下试试！";
    
    public static lockYear: string = "解锁条件:需要通关巡回赛;赛季";
    
    public static challenge: string = "";
    
    public static resetYear: string = "需要重置或者等待明天更新才可继续挑战";
    
    public static allStarReward: string = "获得比赛奖励:";
    
    public static resetMatch: string = "重置所有关卡需要花费;球票，是否需要重置?";
    
    public static freeReset: string = "免费重置关卡";
    
    public static commonStar: string = "赛季;全明星";
    
    public static lock: string = "经理等级不够，当前关卡不能解锁"
    
    public static will_1: string = "被动"
    public static will_2: string = "主动"
    public static will_3: string = "级"
    public static will_5: string = "球员卡" 
    public static tomail: string = "背包已满，请到邮件里领取球员"
    public static will_6: string = "显示全部意志"
    public static will_7: string = "显示可收集意志"
    public static will_8: string = "显示收集中意志"
    public static will_9: string = "显示已激活意志"
    public static will_10: string = "显示全部组合"
    public static will_11: string = "显示可收集组合"
    public static will_12: string = "显示收集中组合"
    public static will_13: string = "显示已激活组合"
    public static will_14: string = "卡牌强化等级不够";
    /** 赛区名称 */
    public static AREA_NAMES:Object = {"1":"大西洋分区","2":"东南分区","3":"中央分区","4":"太平洋分区","5":"西北分区","6":"西南分区"};	
    
    /**活跃度礼包*/
    public static active_1: string = "3$<font color='#FFCC33'>活跃度25礼包</font>\n金币*3000、灵气*1000、阅历*600|活跃度达到25获得";
    public static active_2: string = "3$<font color='#FFCC33'>活跃度35礼包</font>\n金币*5000、灵气*1500、阅历*1200、<font color='#BC4FFF'>紫色球员卡包</font>|活跃度达到35获得";
    public static active_3: string = "3$<font color='#FFCC33'>活跃度55礼包</font>\n<font>金币*8000、灵气*2000、阅历*1800、<font color='#BC4FFF'>紫色百搭卡</font></font>|活跃度达到55获得";
    public static active_4: string = "3$<font color='#FFCC33'>活跃度85礼包</font>\n金币*13000、灵气*3000、阅历*3000、<font color='#FF6600'>橙色百搭卡</font>|活跃度达到85获得";
    
    public static dayPay_0: string = "3$<font color='#FFCC33'>20球票礼包</font>\n金币*5000，<font color='#FF6600'>橙色球员卡包</font>*1|当日累计充值20球票";
    public static dayPay_1: string = "3$<font color='#FFCC33'>100球票礼包</font>\n金币*8000，<font color='#FF6600'>5级灵气礼包</font>*3|当日累计充值100球票";
    public static dayPay_2: string = "3$<font color='#FFCC33'>500球票礼包</font>\n金币*10000，<font color='#FF6600'>全效百搭卡</font>*1|当日累计充值500球票";
    public static dayPay_3: string = "3$<font color='#FFCC33'>1000球票礼包</font>\n金币*20000，<font color='#FF6600'>+3成长卡</font>*1|当日累计充值1000球票";
    
    //天赋帮助说明
    public static help_1: string = "<font color='#ffffff' size='12'>" +
        "1. 经理等级到达1.	经理等级到达10级时开启球队天赋\n" +
        "2. 经理等级每升级2级，获得1个天赋点\n" +
        "3. 经理最多同时可拥有10页天赋\n" +
        "4. 每页天赋所用天赋点互不关联，每页天赋首次重置免费\n" +
        "5.	每节比赛可任意选用一页天赋，该节比赛仅所选用的天赋效果有效\n" +
        "6.	天赋中所有位置，包括强化位选择的球员位置，都是指场上阵容中的位置，与球员本身位置无关</font>";
    //意志组合
    public static help_2: string = "<font color='#ffffff' size='12'>" +
        "1.	收集特定的球员卡，插入球员意志、球员组合卡牌槽可激活球员意志组合\n" +
        "2.	球员卡等级需要大于等于卡牌槽球员等级要求方可插入，球员卡插入后不可取出\n" +
        "3.	意志组合中效果加成的位置，都是指场上阵容中的位置，与球员本身位置无关\n" +
        "4.	球员意志激活后，可直接获得加成效果，与场上球员无关球员无关\n" +
        "5.	球员组合激活后，可获得被动效果及组合技能\n" +
        "6.	被动效果：激活后全场有效，与场上球员无关\n" +
        "7.	组合技能：激活后，需要组合球员同时上场才能触发，缺一不可\n" +
        "8.	组合技能可使用金币或球票进行磨合升级，组合技能等级不可超过经理等级</font>"
    //科技馆
    public static help_3: string = "<font color='#ffffff' size='12'>" +
        "<font color='#f0bb01'><b>装备强化\n</b></font>" +
        "1. 装备强化消耗金币，强化等级不可超过经理等级，强化成功率为100%\n" +
        "<font color='#f0bb01'><b>装备改造\n</b></font>" +
        "1. 装备改造需要改造图纸跟改造材料，改造成功率为100%；改造成功后，装备强化等级下降5级\n" +
        "2. 改造图纸可通过参加<a href='event:AllStar_Fight'><u><font color='#ff0000'>全明星赛</font></u></a>获得\n" +
        "3. 改造材料可通过参加<a href='event:Champion_Fight'><u><font color='#ff0000'>冠军试炼</font></u></a>获得\n" +
        "<font color='#f0bb01'><b>装备洗炼\n</b></font>" +
        "1. 每件装备强化等级达到10级、20级、50级时，将分别开启一个洗炼槽\n" +
        "2. 经理每天拥有3次免费洗炼的机会\n" +
        "3. 装备洗炼会将该装备未锁定的全部洗练槽进行效果重置\n" +
        "<font color='#f0bb01'><b>装备签名\n</b></font>" +
        "1. 装备签名需消耗签名图纸，签名图纸可通过参加<a href='event:Blood_Fight'><u><font color='#ff0000'>百战不殆</font></u></a>获得\n" +
        "2. 装备需要与图纸的签名位置相同，且达到图纸所要求的装备等级，才可完成签名\n" +
        "3. 装备签名可替换，替换后原签名效果直接被替代</font>"
        
    //科技馆2
    public static help_3_1: string = "<font color='#ffffff' size='12'>" +
        "<font color='#f0bb01'><b>球员卡强化\n</b></font>" +
        "1. 球员卡强化将会提升球员卡等级，球员卡等级越高，提升球员升阶成功率越高\n" +
        "2. 球员卡强化时，可以使用<a href='event:Mall'><u><font color='#ff0000'>强化百搭卡</font></u></a>，代替任意+1球员卡\n" +
        "<font color='#f0bb01'><b>球员卡合成\n</b></font>" +
        "1. 球员卡合成可以将5张相同品质的球员卡，合成为一张高品质的球员卡，无论合成成功或者失败，5张卡牌都将消失\n" +
        "2. 使用合成保护后，若合成失败，5张球员卡不消失\n" +
        "<font color='#f0bb01'><b>球员卡分解\n</b></font>" +
        "1. 球员卡分解可获的灵气值，不同品质的球员卡所能获得的灵气值不同，灵气值用于球员<a href='event:Team_GrowPlayerBreak'><u><font color='#ff0000'>成长升阶</font></u></a>\n" +
        "<font color='#f0bb01'><b>球员卡配方合成\n</b></font>" +
        "1. 球员卡配方可指定去合成已在阵容中的同名球员卡，把5张和目标球员同品质的球员卡，合成一张1级的目标球员同名球员卡，无论合成成功或者失败，5张卡牌都将消失\n" +
        "2. 使用合成保护后，若合成失败，5张球员卡不消失\n</font>";
    
    public static help_4: string = "<font color='#ffffff' size='12'>" +
        "1. 球员成长升阶的属性加成，以球员原始属性为标准计算\n" +
        "2. 热血NBA其余所有百分比加成效果计算，以球员升阶、培养后的属性为标准计算\n" +
        "3. 球员综合能力、球队综合实力仅为参考数值，不对经理所有加成效果进行显示球员综合能力值仅计算球员属性、装备属性（计算不包括装备洗练、装备签名、球员技能计算）\n" +
        "4. 球队综合实力值以球员综合能力值为基础，计算包括攻防战术、意志组合、经理BUFF等效果加成（不包括：球队天赋、组合技能及球员综合能力计算不包括部分）</font>";
    
    /**欢迎-聊天框标题*/
    public static welcome: string = "欢迎来到热血NBA，加官方Q群：325344664"

    public static wxurl: string = "xx.com/api/wx_code"
        
    public static const unionBuff:Array<string> = [
        "3$当日巡回赛赛后金币奖励增加10%|购买<font color='#ff0000'>制造厂Ⅰ</font>使用激活",
        "3$7日内巡回赛赛后金币奖励增加20%|购买<font color='#ff0000'>高级制造厂Ⅰ</font>使用激活",
        "3$当日巡回赛赛后阅历奖励增加10%|购买<font color='#ff0000'>制造厂Ⅱ</font>使用激活",
        "3$7日内巡回赛赛后阅历奖励增加20%|购买<font color='#ff0000'>高级制造厂Ⅱ</font>使用激活",
        "3$2天内竞技场金币奖励增加7%|购买<font color='#ff0000'>竞技勋章Ⅰ</font>使用激活",
        "3$2天内竞技场阅历奖励增加7%|购买<font color='#ff0000'>竞技勋章Ⅱ</font>使用激活",
        "3$天梯赛声望结算时声望增加7%|购买<font color='#ff0000'>荣誉证书</font>使用激活",
        "3$7日内天梯赛声望结算时声望增加14%|购买<font color='#ff0000'>高级荣誉证书</font>使用激活",
        "3$当天冠军试炼掉落装备材料数量+1|购买<font color='#ff0000'>试炼魔盒</font>使用激活",
        "3$当天参加冠军试炼球员全属性增加10%|购买<font color='#ff0000'>试炼光环</font>使用激活",
        "3$当天参加全明星赛球员全属性增加10%|购买<font color='#ff0000'>荣耀光环</font>使用激活",
        "3$当月参加天梯赛球员全属性增加5%|购买<font color='#ff0000'>天梯光环</font>使用激活",
        "3$当月参加天梯赛球员全属性增加10%|购买<font color='#ff0000'>高级天梯光环</font>使用激活",
        "3$当日参加竞技场球员全属性增加5%|购买<font color='#ff0000'>竞技光环</font>使用激活",
        "3$当日参加竞技场球员全属性增加10%|购买<font color='#ff0000'>高级竞技光环</font>使用激活"
    ];

    /** 兑换按钮tips */
    public static const wuyiExchangeTip:Array<string> = ["任意10张卡牌","任意30张卡牌","四张卡牌各25张","四张卡牌各50张"];
    
    //
    public static const groupMatchDataErr: string = "组队赛数据资源加载失败！刷新一下试试";
    
    /**
     * 配置接口信息
     * @param configData xml 外部读取的xml文档
     * */
    // public static parseConfg(configData:XML):void{
    //     try{
    //         xml:XML = configData.lan[0];
    //         for(var i: string in xml.msg){
    //             LanConfig[xml.msg[i].@name] =  string(xml.msg[i]);
    //         }
    //     }catch(e:Error){
    //         trace(e+"解析语言错误");
    //     }
    // }
    
    private static lanObj:Object = {};
    
    /**
     * 配置文件 lanConfig.xml 外部读取的xml文档
     */		
    // public static initLanConfig(configData:XML):void{
    //     try{
    //         xml:XML = configData.lan[0];
    //         for(var i: string in xml.msg){
    //             lanObj[xml.msg[i].@name] =  string(xml.msg[i]);
    //         }
    //     }catch(e:Error){
    //         trace(e+"解析语言错误");
    //     }
    // }
    
    /**
     * 获取语言数据
     * @param key 语言key
     * @param obj 包含语言中需要替换的数据
     * @return 填好变量等正确的字符串
     */
    // public static function getLan(key: string,obj:* = null): string
    // {
    //     lanStr: string = lanObj[key];
        
    //     while(lanStr.indexOf("[") != -1)
    //     {
    //         lanStr = lanStr.replace("[","<");
    //     }
        
    //     while(lanStr.indexOf("]") != -1)
    //     {
    //         lanStr = lanStr.replace("]",">");
    //     }
        
    //     pattern:RegExp = /{([a-zA-Z0-9_]+)}/;
        
    //     while(pattern.test(lanStr))
    //     {
    //         lanStr = lanStr.replace(pattern, replFN);
            
    //         function replFN(): string {
    //             return obj[arguments[1]];
    //         }
    //     }
    //     if(lanStr == null)
    //     {
    //         lanStr = "找不到提示代码"+key;
    //     }
        
    //     return lanStr;
    // }
}
