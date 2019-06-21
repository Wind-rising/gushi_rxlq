/**
 * 巡回赛
 */
const {ccclass, property} = cc._decorator;
import Utility from "../../utils/Utility";
import MatchControllor from "../../controllor/MatchControllor";
import MatchType from "../../data/type/MatchType";
import URLConfig from "../../config/URLConfig";
import HttpManager from "../../utils/HttpManager";
import ErrMsg from "../../data/ErrMsg";
import IconManager from "../../config/IconManager";
import ManagerData from "../../data/ManagerData";
import RegularSeasonData from "../../data/RegularSeasonData";
@ccclass
export default class NormalMatchView extends cc.Component {

    private ITEM_NUM:number = 12;

    srcData:Object = null;
    matchList:Array<Object> = null;
    currentPage:number = 0;//当前选中第几页
    currentSeason:number = 1;//当前赛季

    lbl_season:cc.Label = null;
    img_season:cc.Node = null;
    enemyNodeList:Array<cc.Node> = null;
    onLoad () {
        this.enemyNodeList = [];
        for(let i = 0;i<12;i++)
        {
            let nod_enemy = this.node.getChildByName('nod_enemy_'+i);
            this.enemyNodeList.push(nod_enemy);
            nod_enemy.getChildByName('btn_challenge').getComponent(cc.Button).clickEvents.push(
                Utility.bindBtnEvent(this.node,'NormalMatchView','onBtnChallenge',i+'')
            );
            nod_enemy.getChildByName('nod_small_button').getChildByName('btn_challenge').getComponent(cc.Button).clickEvents.push(
                Utility.bindBtnEvent(this.node,'NormalMatchView','onBtnChallenge',i+'')
            );
            nod_enemy.getChildByName('nod_small_button').getChildByName('btn_sweep').getComponent(cc.Button).clickEvents.push(
                Utility.bindBtnEvent(this.node,'NormalMatchView','onBtnSweep',i+'')
            );
        }

        this.lbl_season = this.node.getChildByName('lbl_season').getComponent(cc.Label);
        this.img_season = this.node.getChildByName('img_season');
        this.img_season.active = false;

        this.node.getChildByName('btn_season').getComponent(cc.Button).clickEvents.push(
            Utility.bindBtnEvent(this.node,'NormalMatchView','onBtnSeason')
        );


        this.node.getChildByName('btn_left').getComponent(cc.Button).clickEvents.push(
            Utility.bindBtnEvent(this.node,'NormalMatchView','onBtnLeft')
        );
        this.node.getChildByName('btn_right').getComponent(cc.Button).clickEvents.push(
            Utility.bindBtnEvent(this.node,'NormalMatchView','onBtnRight')
        );

        this.node.getChildByName('btn_close').getComponent(cc.Button).clickEvents.push(
            Utility.bindBtnEvent(this.node,'NormalMatchView','onBtnClose')
        );

        this.node.getChildByName('btn_return').getComponent(cc.Button).clickEvents.push(
            Utility.bindBtnEvent(this.node,'NormalMatchView','onBtnReturn')
        );
    }

    start () {
        let serverArgs = {action:URLConfig.Get_Data,args:[{"n":URLConfig.Regular,"i":{}}]};
        HttpManager.getInstance().request(serverArgs,(resp)=>{
            if(resp['res']){
                this.srcData = resp['data'][0];
                this.onChange();
            }else{
                Utility.fadeErrorInfo(ErrMsg.getInstance().getErr(resp['code']));
            }
        })
    }

    // update (dt) {}

    /** 赛季选择 */
    onBtnSeason (e:cc.Event){
        this.img_season.active = !this.img_season.active;
        //切换赛季功能后续再加，当前只有第一赛季
    }
    onBtnLeft (e:cc.Event){
        this.currentPage --;
        if(this.currentPage<0){
            this.currentPage = 0;
        }
        this.onChange();
    }
    onBtnRight (e:cc.Event){
        this.currentPage ++;
        this.onChange();
    }
    onBtnClose (e:cc.Event){
        this.node.destroy();
    }
    onBtnReturn (e:cc.Event){
        MatchControllor.getInstance().showMatchSelect();
    }
    onBtnChallenge(e:cc.Event,customData:string){
        let data = this.matchList[this.currentPage*this.ITEM_NUM+parseInt(customData)];
        MatchControllor.getInstance().startMatch(MatchType.NORMAL_MATCH, data['Rid']);
    }
    onBtnSweep(e:cc.Event,customData:string){
        //扫荡
        cc.log('扫荡');
    }

    private onChange():void{
        let list = RegularSeasonData.getInstance().getRegularMatchList(this.currentSeason);;
        this.matchList = new Array();
        let rid:number = parseInt(this.srcData['Rid']);
        for(let i=0; i<list.length; i++){
            if(parseInt(list[i]['Rid']) <= rid+3){
                this.matchList.push(list[i]);
            }
        }
        this.format(this.matchList,rid)
        //getData();
    }
    private format(arr:Array<Object>,rid:number):void{
        let del:number = rid%30;
        if(del == 0){
            this.currentPage = 3;
        }else{
            this.currentPage = Math.ceil(del/this.ITEM_NUM);
        }
        this.currentPage--;
        let maxPageIdx = Math.ceil(arr.length/this.ITEM_NUM)-1;
        if(this.currentPage > maxPageIdx){
            this.currentPage = maxPageIdx;
        }
        let data = [];
        for(let i = 0;i<this.ITEM_NUM;i++){
            if(arr[this.currentPage*this.ITEM_NUM+i]){
                data.push(arr[this.currentPage*this.ITEM_NUM+i]);
            }
        }

        this.setPageList(data);
    }

    setPageList(data:Array<Object>){
        let rid:number = parseInt(this.srcData['Rid']);
        for(let i = 0; i < this.ITEM_NUM; i++){
            this.enemyNodeList[i].active = false;
        }
        for(let i=0;i<data.length;i++){
            let enemyNode = this.enemyNodeList[i];
            enemyNode.active = true;
            let url:string = '';
            if(parseInt(data[i]['TeamId'])<10){
                url = url +"img_0"+data[i]['TeamId']
            }else{
                url = url +"img_"+data[i]['TeamId']
            }
            IconManager.getIcon(url,IconManager.LOGO,(spriteFrame)=>{
                enemyNode.getChildByName('img_logo').getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });
            enemyNode.getChildByName('lbl_name').getComponent(cc.Label).string = data[i]['Name'];

            if(parseInt(data[i]['Rid']) < rid){
                //已经通过了，显示扫荡
                enemyNode.getChildByName('nod_small_button').active = true;
                enemyNode.getChildByName('img_lock').active = false;
                enemyNode.getChildByName('btn_challenge').active = false;
            }else if(parseInt(data[i]['Rid']) == rid){//
                
                if(parseInt(data[i]['Lvl']) > ManagerData.getInstance().Level){
                    //未解锁，灰色
                    enemyNode.getChildByName('nod_small_button').active = false;
                    enemyNode.getChildByName('img_lock').active = true;
                    enemyNode.getChildByName('btn_challenge').active = false;
                    enemyNode.color = cc.Color.GRAY;
                }else{
                    //已解锁可以挑战
                    enemyNode.getChildByName('nod_small_button').active = false;
                    enemyNode.getChildByName('img_lock').active = false;
                    enemyNode.getChildByName('btn_challenge').active = true;
                }
            }else{
                enemyNode.getChildByName('nod_small_button').active = false;
                enemyNode.getChildByName('img_lock').active = true;
                enemyNode.getChildByName('btn_challenge').active = false;

                if(parseInt(data[i]['Rid']) <= rid+3){
                    //未解锁，灰色
                    enemyNode.color = cc.Color.GRAY;
                }
            }
        }
    }
}
