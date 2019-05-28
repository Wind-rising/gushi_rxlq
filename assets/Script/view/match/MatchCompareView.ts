import URLConfig from "../../config/URLConfig";
import MatchType from "../../data/type/MatchType";
import Utils from "../../utils/Utils";
import HttpManager from "../../utils/HttpManager";
import MatchControllor from "../../controllor/MatchControllor";
import PlayerUtil from "../../utils/PlayerUtil";
import ErrMsg from "../../data/ErrMsg";
import IconManager from "../../config/IconManager";
import PlayerInfo from "./PlayerInfo";
import LoadingFullScreen from "../public/LoadingFullScreen";

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
export default class MatchCompareView extends cc.Component {

    //客队队员
    private _awayPlayers:Array<Object>;
    //分节
    //private _typeGroup:XSelecteGroup;
    //球队信息
    private _teamData:Object;
    //2个球队的四节阵容
    private _data:Object;
    //
    private PLAYER_NUM:number = 5;
    private UI_POS:cc.Vec2 = new cc.Vec2(700, 343);

    /** 跨服天梯赛 对方所在服务器编号 */
    public AwaySid:string;
    /** 跨服天梯赛 自己所在服务器编号 */
    public HomeSid:string;
    /** 跨服天梯赛 比赛编号 */
    public MatchId:string;
    
    // LIFE-CYCLE CALLBACKS:

    /** 页面UI */
    @property(cc.Button)
    btn_start:cc.Button = null;

    @property(cc.Button)
    btn_return:cc.Button = null;

    @property(cc.ToggleContainer)
    toggleContainer:cc.ToggleContainer = null;

    @property(cc.Sprite)
    img_section_a:cc.Sprite = null;
    @property(cc.Sprite)
    img_section_b:cc.Sprite = null;
    /** 比赛四节图片 */
    @property([cc.SpriteFrame])
    spriteFrame:cc.SpriteFrame[] = [];


    onLoad () {
        /** 获取ui节点 */
        this.btn_return = this.node.getChildByName('btn_return').getComponent(cc.Button);
        this.btn_start = this.node.getChildByName('btn_start').getComponent(cc.Button);
        this.toggleContainer = this.node.getChildByName('toggleContainer').getComponent(cc.ToggleContainer);
        this.img_section_a = this.node.getChildByName('img_section_a').getComponent(cc.Sprite);
        this.img_section_b = this.node.getChildByName('img_section_b').getComponent(cc.Sprite);

        this.btn_return.clickEvents.push(
            Utils.bindBtnEvent(this.node,'MatchCompareView','onBtnReturn')
        );
        this.btn_start.clickEvents.push(
            Utils.bindBtnEvent(this.node,'MatchCompareView','onBtnStartMatch')
        );

        this.initUI();

        MatchControllor.getInstance().getCompareData(this.onGetData,this);
    }

    start () {

    }

    // update (dt) {}

    initUI () {
        this.btn_return.node.active = false;
        this.btn_start.node.active = false;

        this.toggleContainer.toggleItems[0].isChecked = true;
    }

    /** 点击返回按钮 */
    onBtnReturn (e) {
        this.node.destroy();
    }
    /** 点击开始比赛按钮 */
    onBtnStartMatch (e) {
        //关闭当前页面，显示加载页面加载
        LoadingFullScreen.fadeIn(()=>{
            MatchControllor.getInstance().onStart();
            this.node.destroy();
        });
    }
    /** toggle group 按钮 */
    onToggleEvent(e){
        //e.target.name  toggle1  -  toggle4
        let index = parseInt(e.target.name.charAt(e.target.name.length-1));
        this.onChange(index);
    }

    onGetData (data:Object){
        if(data['res']){
            this._data = data['data'];
            let matchControllor = MatchControllor.getInstance();
            if(matchControllor.matchType == MatchType.NORMAL_MATCH && parseInt(matchControllor.awayId) <= 30){
                //巡回赛第一赛季作假
            }else{
                PlayerUtil.addKP(this._data[0].ManagerSolutions[1].KpInfo);
            }

            this.format(this._data[0].ManagerSolutions);
            //格式化整容信息
            this.node.getChildByName('lbl_kpi_a').getComponent(cc.Label).string = Utils.getKPI(this._data[0].ManagerSolutions[0].Members)+"";
            this.node.getChildByName('lbl_kpi_b').getComponent(cc.Label).string = this._data[0].ManagerSolutions[1].KPI+"";
            
            //默认选中第一个
            this.onChange(1);

            /**
             * 天体赛显示积分，倒计时进入比赛
             * added by daylyn
             */
            if(matchControllor.matchType == MatchType.LADDER_MATCH)
            {
                //显示倒计时和积分
                // $ui["countDownMc"].visible = true;
                // //5秒倒计时
                // _ladderCountDown = 5;
                // TimerCommand.registerTimeCommand(onCountDownHandle,null,1);
                // $ui["countDownMc"].gotoAndStop(_ladderCountDown + 1);
                // $closeBtn.visible = false;
                // $startBtn.visible = false;
                // $ui["myLadderScoreMc"].visible = true;
                // $ui["myLadderScoreMc"].scoreTF.text = String(LadderView.getInstance().score);
                // $ui["otherLadderScoreMc"].visible = true;
                // $ui["otherLadderScoreMc"].scoreTF.text = String(_data[0].ManagerSolutions[1].Score);
            }
            else if(matchControllor.matchType == MatchType.LADDER_CROSSSERVER_MATCH)
            {
                //显示倒计时和积分
                // $ui["countDownMc"].visible = true;
                // //5秒倒计时
                // _ladderCountDown = 5;
                // TimerCommand.registerTimeCommand(onCountDownHandle,null,1);
                // $ui["countDownMc"].gotoAndStop(_ladderCountDown + 1);
                // $closeBtn.visible = false;
                // $startBtn.visible = false;
                // $ui["myLadderScoreMc"].visible = true;
                // $ui["myLadderScoreMc"].scoreTF.text = String(_data[0].ManagerSolutions[0].Score);
                // $ui["otherLadderScoreMc"].visible = true;
                // $ui["otherLadderScoreMc"].scoreTF.text = String(_data[0].ManagerSolutions[1].Score);
                
                // //显示综合实力
                // formatValue($ui.homeValueMC, _data[0].ManagerSolutions[0].KPI);
                // formatValue($ui.awayValueMC,  _data[0].ManagerSolutions[1].KPI);
            }
            else
            {
                this.btn_return.node.active = true;
                this.btn_start.node.active = true;
            }
            
        }else{
            Utils.fadeErrorInfo(ErrMsg.getInstance().getErr(data['code']));
        }
    }

    /**格式化-*/
    private format(data:Object):void{
        this.node.getChildByName('lbl_name_a').getComponent(cc.Label).string = data[0].Name+"";
        this.node.getChildByName('lbl_name_b').getComponent(cc.Label).string = data[1].Name+"";
        
        var url:string = IconManager.preURL+IconManager.LOGO
        if(data[0].Logo<10){
            url = url +"img_0"+data[0].Logo+".png"
        }else{
            url = url +"img_"+data[0].Logo+".png"
        }
        cc.loader.loadRes(url,cc.SpriteFrame,(err,spriteframe)=>{
            if(err){
                Utils.fadeErrorInfo(err.message);
                return;
            }
            this.node.getChildByName('img_logo_a').getComponent(cc.Sprite).spriteFrame = spriteframe;
        });
        
        url = IconManager.preURL+IconManager.LOGO
        if(data[1].Logo<10){
            url = url +"img_0"+data[1].Logo+".png"
        }else{
            url = url +"img_"+data[1].Logo+".png"
        }
        cc.loader.loadRes(url,cc.SpriteFrame,(err, spriteframe)=>{
            if(err){
                Utils.fadeErrorInfo(err.message);
                return;
            }
            this.node.getChildByName('img_logo_b').getComponent(cc.Sprite).spriteFrame = spriteframe;
        });
    }

    //
    public onChange(index):void{
        if(!this._data){
            return;
        }
        this.img_section_a.spriteFrame = this.spriteFrame[index-1];
        this.img_section_b.spriteFrame = this.spriteFrame[index-1];
        
        let player = {};
        let homeData = this._data[0].ManagerSolutions[0].Members[index-1];
        let awayData =  this._data[0].ManagerSolutions[1].Members[index-1];
        player['teamInfo'] =  this._data[0].ManagerSolutions[0].Members
            
        var hId = MatchControllor.getInstance().homeId;
        var aId = MatchControllor.getInstance().awayId;
        if(hId.indexOf("-") != -1){
            hId = "0";
        }else if(aId.indexOf("-") != -1){
            aId = "0"
        }	
        // if(!Utils.playerKPs){
        //     Utils.playerKPs = new Array();
        // }
        for(var i=0; i<this.PLAYER_NUM; i++){//玩家是主队
            let player = this.node.getChildByName('player_a_'+(i+1)).getComponent(PlayerInfo);
            player.format(homeData[i], this._data[0].ManagerSolutions[0].Members, index-1);
            // if(!Utils.playerKPs[hId]){
            //     Utils.playerKPs[hId] = new Array();
            // }
            // if(!Utils.playerKPs[hId][i]){
            //     Utils.playerKPs[hId][i] = player.kp;
            // }
        }
        // //必须指定队伍信息
        // PlayerC.teamInfo =  _data[0].ManagerSolutions[1].Members
        for(i=0; i<this.PLAYER_NUM; i++){
            let player = this.node.getChildByName('player_b_'+(i+1)).getComponent(PlayerInfo);
            player.format(awayData[i], this._data[0].ManagerSolutions[1].Members, index-1);
            // if(!Utils.playerKPs[aId]){
            //     Utils.playerKPs[aId] = new Array();
            // }
            // if(!Utils.playerKPs[aId][i]){
            //     Utils.playerKPs[aId][i] = player.kp;
            // }
        }
    }

}
