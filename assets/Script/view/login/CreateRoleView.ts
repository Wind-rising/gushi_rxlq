import URLConfig from "../../config/URLConfig";
import HttpManager from "../../utils/HttpManager";
import Utils from "../../utils/Utils";
import ErrMsg from "../../data/ErrMsg";
import ItemData from "../../data/ItemData";
import IconManager from "../../config/IconManager";
import AppConfig from "../../config/AppConfig";
import Events from "../../signal/Events";
import ManagerData from "../../data/ManagerData";
import LanConfig from "../../config/LanConfig";

/**
 * 
 * 创建角色页面控制脚本
 */
const {ccclass, property} = cc._decorator;

@ccclass
export default class CreateRoleView extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    /** 球员背景图片 */
    @property([cc.SpriteFrame])
    public iconBgFrame:cc.SpriteFrame[] = [];


    /** 综合能力 */
    @property(cc.Label)
    lbl_kpi:cc.Label = null;

    /** 更换球员 */
    @property(cc.Button)
    btn_change:cc.Button = null;

    /** 赛区名字 */
    @property(cc.Label)
    lbl_pos:cc.Label = null;

    /** 球队标记 */
    @property(cc.Sprite)
    img_logo:cc.Sprite = null;

    /** 切换球队标记 */
    @property(cc.Button)
    btn_left:cc.Button = null;
    @property(cc.Button)
    btn_right:cc.Button = null;

    /** 左右切换赛区  东部联盟 西部联盟 */
    @property(cc.Button)
    btn_pos_left:cc.Button = null;
    @property(cc.Button)
    btn_pos_right:cc.Button = null;

    /** 随机名字 */
    @property(cc.Button)
    btn_random:cc.Button = null;

    /** 进入游戏 */
    @property(cc.Button)
    btn_enter:cc.Button = null;

    /** 球队名字编辑框 */
    @property(cc.EditBox)
    edt_name:cc.EditBox = null;

    /** 五个球员头像 */
    @property([cc.Node])
    playerList:cc.Node[] = [];

    private _teamId:string;
    private _logo:number;
    /** 当前选中那个赛区 0 东部赛区 1 西部赛区*/
    private _posIndex:number;
    /** 东西部赛区logo列表 */
    private _eastLogo:Array<number>;
    private _westLogo:Array<number>;
    private _currentLogoList:Array<number>;
    
    /** 球员数量 总共五个 */
    private ITEM_MUN:number = 5;
    /** 球队图标 */
    private LOGO_NUM:number = 15;
    /** 球队特殊图标 */
	private SPECIAL_LOGO:number = 29;

    onLoad () {
        /** 赋值，也可以在编辑器上直接赋值，在代码中写仅仅为了方便查阅读代码 */
        this.lbl_kpi = this.node.getChildByName('lbl_kpi').getComponent(cc.Label);
        this.btn_change = this.node.getChildByName('btn_change').getComponent(cc.Button);
        this.lbl_pos = this.node.getChildByName('lbl_pos').getComponent(cc.Label);
        this.img_logo = this.node.getChildByName('img_logo').getComponent(cc.Sprite);
        this.btn_left = this.node.getChildByName('btn_left').getComponent(cc.Button);
        this.btn_right = this.node.getChildByName('btn_right').getComponent(cc.Button);
        this.btn_pos_left = this.node.getChildByName('btn_pos_left').getComponent(cc.Button);
        this.btn_pos_right = this.node.getChildByName('btn_pos_right').getComponent(cc.Button);
        this.btn_random = this.node.getChildByName('btn_random').getComponent(cc.Button);
        this.btn_enter = this.node.getChildByName('btn_enter').getComponent(cc.Button);
        this.playerList.push(this.node.getChildByName('player_1'));
        this.playerList.push(this.node.getChildByName('player_2'));
        this.playerList.push(this.node.getChildByName('player_3'));
        this.playerList.push(this.node.getChildByName('player_4'));
        this.playerList.push(this.node.getChildByName('player_5'));
        this.edt_name = this.node.getChildByName('edt_name').getComponent(cc.EditBox);

        /** 绑定按钮事件 */
        this.btn_change.clickEvents.push(Utils.bindBtnEvent(this.node,'CreateRoleView','onBtnChange'));
        this.btn_left.clickEvents.push(Utils.bindBtnEvent(this.node,'CreateRoleView','onBtnLeft'));
        this.btn_right.clickEvents.push(Utils.bindBtnEvent(this.node,'CreateRoleView','onBtnRight'));
        this.btn_pos_left.clickEvents.push(Utils.bindBtnEvent(this.node,'CreateRoleView','onBtnPosLeft'));
        this.btn_pos_right.clickEvents.push(Utils.bindBtnEvent(this.node,'CreateRoleView','onBtnPosRight'));
        this.btn_random.clickEvents.push(Utils.bindBtnEvent(this.node,'CreateRoleView','onBtnRandom'));
        this.btn_enter.clickEvents.push(Utils.bindBtnEvent(this.node,'CreateRoleView','onBtnEnter'));

        this._logo = 1;
        this._posIndex = 0;
        this._eastLogo = new Array();
        this._westLogo = new Array();
        for(let i=0; i<this.LOGO_NUM; i++){
            this._eastLogo[i] = i+1;
            this._westLogo[i] =  i+1+this.LOGO_NUM;
            if(this._westLogo[i] == this.SPECIAL_LOGO){
                this._westLogo[i] = 44;
            }
        }
        /** 初始化赛区信息 */
        this.posChange(0);

        this.initName();
        this.initTeam();
    }

    start () { }

    // update (dt) {}
    /** 更换球员按钮 */
    onBtnChange (e) {
        cc.log('onBtnChange');
        this.initTeam();
    }
    /** 切换球队logo */
    onBtnLeft (e) {
        this.logoChange(-1);
    }
    onBtnRight (e) {
        this.logoChange(1);
    }
    /** 切换赛区 */
    onBtnPosLeft (e) {
        //cc.log('onBtnPosLeft');
        this.posChange(-1);
        this.formatLogo();
    }
    onBtnPosRight (e) {
        //cc.log('onBtnPosRight');
        this.posChange(1);
    }
    /** 随机球队名字 */
    onBtnRandom (e) {
        cc.log('onBtnRandom');
        this.initName();
    }
    /** 开始游戏 */
    onBtnEnter (e) {
        cc.log('onBtnEnter');
        let srvArgs = {action:URLConfig.Post_Manager_New,args:{Name:this.edt_name.string,TeamId:this._teamId,Logo:''+this._logo}}
        HttpManager.getInstance().request(srvArgs,this.onManager,this);
    }

    /** 切换赛区 */
    private posChange(idx){
        this._posIndex = (this._posIndex+idx)%2;
        if(this._posIndex == 0){
            this._currentLogoList = this._westLogo;
            this.lbl_pos.string = LanConfig.east;
        }else{
            this._currentLogoList = this._eastLogo;
            this.lbl_pos.string = LanConfig.west;
        }
        this._logo = 1;
        this.formatLogo();
    }

    /** 更改logo */
    private logoChange (idx){
        this._logo += idx;
        while(this._logo <= 0){
            this._logo += this._currentLogoList.length
        }
        this._logo %= this._currentLogoList.length;
        this.formatLogo();
    }

    /** 显示logo */
    private formatLogo():void{
        var url:string = IconManager.preURL+IconManager.BIG_LOGO
        if(this._logo<10){
            url = url +"img_0"+this._logo+".png"
        }else{
            url = url +"img_"+this._logo+".png"
        }
        cc.loader.loadRes(url,cc.SpriteFrame,(err,spriteFrame)=>{
            if(err){
                Utils.fadeErrorInfo('图片加载失败 url = ' + url + '  err.message = ' + err.message);
            }
            this.img_logo.spriteFrame = spriteFrame;
        })
    }

    /** 创建球队回调 */
    private onManager(data:Object):void{
        if(data['res']){
            Utils.fadeInfo("球队已经创建成功，现在就开始您的热血NBA之旅吧")
            ManagerData.getInstance().refresh();
            //Events.getInstance().dispatch(new Event(AppConfig.SHOW_LOADER));
            this.node.destroy();
        }else{
            Utils.fadeErrorInfo(ErrMsg.getInstance().getErr(data['code']))
        }
    }

    /**创建球队名字*/
    private initName():void{
        var srvArgs = {action:URLConfig.Post_Manager_RandName};
        HttpManager.getInstance().request(srvArgs,this.onCreateName,this);
    }

    /** 获取球队名字回调 */
    private onCreateName(data:Object):void{
        if(data['res']){
            this.edt_name.string = data['data']['Post_Manager_RandName']['Name'];
        }
    }

    /**设置初始化球队球员*/
    private initTeam():void{
        var srvArgs = {action:URLConfig.Post_Manager_RandTeam};
        HttpManager.getInstance().request(srvArgs,this.onInitTeam,this);
    }
    /** 球队队员数据显示 */
    private onInitTeam(data:Object):void{
        if(data['res']){
            var tempData:Object = data['data']['Post_Manager_RandTeam']['Pids'];
            let arr = [];
            let info;
            for(var i = 0;i < this.ITEM_MUN; i++){
                let mc = this.playerList[i];
                info = ItemData.getPlayerInfo(tempData[i]);
                arr.push(info.Pid);

                /** 球员位置缩写 */
                // mc.getChildByName('img_position_abridge').getComponent(cc.Sprite).spriteFrame = Math.max(info.Position, 1)
                //球员位置
                // mc.getChildByName('img_position').getComponent(cc.Sprite).spriteFrame = "lv_"+info.CardLevel

                //球员数据
                var kp = tempData['KpInfo'][info.Pid]['Kp']
                mc.getChildByName('lbl_kpi').getComponent(cc.Label).string = ''+Math.floor(kp);
                if(info){
                    mc.getChildByName('lbl_name').getComponent(cc.RichText).string = "<font color='"+ItemData.getCardColor(info.CardLevel)+"'>"+info.ShowName+"</font>";
                }
                mc.getComponent(cc.Sprite).spriteFrame = this.iconBgFrame[info.CardLevel]
                var url:string = IconManager.preURL+IconManager.PLAYER_HEAD+info.HeadStyle+".png"
                cc.loader.loadRes(url,cc.SpriteFrame,(err,spriteFrame)=>{
                    if(err){
                        Utils.fadeErrorInfo('图片加载错误！ url = ' + url);
                    }
                    mc.getChildByName('img_icon').getComponent(cc.Sprite).spriteFrame = spriteFrame;
                });
            }
            info.Period = [[{Pid:arr[0]},{Pid:arr[1]},{Pid:arr[2]},{Pid:arr[3]},{Pid:arr[4]}],
                [{Pid:arr[0]},{Pid:arr[1]},{Pid:arr[2]},{Pid:arr[3]},{Pid:arr[4]}],
                [{Pid:arr[0]},{Pid:arr[1]},{Pid:arr[2]},{Pid:arr[3]},{Pid:arr[4]}],
                [{Pid:arr[0]},{Pid:arr[1]},{Pid:arr[2]},{Pid:arr[3]},{Pid:arr[4]}]
            ]

            this._teamId = data['data']['Post_Manager_RandTeam']['TeamId'];
            this.lbl_kpi.string = '' + parseInt(tempData['KPI']);
        }else{
            Utils.fadeErrorInfo(ErrMsg.getInstance().getErr(data['code']));
        }
    }
}
