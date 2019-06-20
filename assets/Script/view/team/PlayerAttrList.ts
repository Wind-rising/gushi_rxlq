
/**
 * 球员属性
 */
const {ccclass, property} = cc._decorator;
import PlayerUtil from "../../utils/PlayerUtil";
import PlayerControllor from "../../controllor/PlayerControllor";
@ccclass
export default class PlayerAttrList extends cc.Component {


    // LIFE-CYCLE CALLBACKS:
    playerInfo:Object = null;
    needRefresh:boolean = false;

    //属性列表
    nod_attr_list:cc.Node[] = null;
    onLoad () {
        this.needRefresh = false;

        this.nod_attr_list = [];
        for(let i = 0;i< 15;i++){
            let nod_attr = this.node.getChildByName('nod_attr_'+i);
            nod_attr.getChildByName('lbl_value').getComponent(cc.Label).string = '';
            nod_attr.getChildByName('pgs_1').getComponent(cc.ProgressBar).progress = 0;
            this.nod_attr_list.push(nod_attr);
        }

        this.node.on('selectedPlayer',()=>{
            //选中球员的时候被调用
            if(this.node.active){
                this.formatData();
            }else{
                this.needRefresh = true;
            }
        });
    }

    start () {
        
    }

    onEnable () {
        if(this.needRefresh){
            this.formatData();
        }
    }

    // update (dt) {}

    formatData(){
        this.needRefresh = false;
        this.playerInfo = PlayerControllor.getInstance().playerInfo;
        // ItemVo
        // /**常量-其他-球员最大属性1000-400为临时值*/
		// public static const MAX_PLAYER_PRO:int = 400;
        let MAX_PLAYER_PRO = 400;
        let data:Object = this.playerInfo['basicData'];
        let totalPro:Object = PlayerUtil.getTotalProObject(this.playerInfo);
        
        let JumpShot = PlayerUtil.getBigPro("JumpShot", totalPro);
        let ThreePoints = PlayerUtil.getBigPro("ThreePoints", totalPro);
        let attack = PlayerUtil.getBigPro("attack", totalPro);
        let baseAttack = Math.floor((parseInt(data['JumpShot'])+parseInt(data['ThreePoints']))/2);
        this.nod_attr_list[0].getChildByName('lbl_value').getComponent(cc.Label).string = ''+attack;
        this.nod_attr_list[0].getChildByName('pgs_0').getComponent(cc.ProgressBar).progress = baseAttack/MAX_PLAYER_PRO;
        this.nod_attr_list[0].getChildByName('pgs_1').getComponent(cc.ProgressBar).progress = attack/MAX_PLAYER_PRO;
        this.nod_attr_list[1].getChildByName('lbl_value').getComponent(cc.Label).string = ''+JumpShot;
        this.nod_attr_list[1].getChildByName('pgs_0').getComponent(cc.ProgressBar).progress = parseInt(data['JumpShot'])/MAX_PLAYER_PRO;
        this.nod_attr_list[1].getChildByName('pgs_1').getComponent(cc.ProgressBar).progress = JumpShot/MAX_PLAYER_PRO;
        this.nod_attr_list[2].getChildByName('lbl_value').getComponent(cc.Label).string = ''+ThreePoints;
        this.nod_attr_list[2].getChildByName('pgs_0').getComponent(cc.ProgressBar).progress = parseInt(data['ThreePoints'])/MAX_PLAYER_PRO;
        this.nod_attr_list[2].getChildByName('pgs_1').getComponent(cc.ProgressBar).progress = ThreePoints/MAX_PLAYER_PRO;

        let Rejection = PlayerUtil.getBigPro("Rejection", totalPro);
        let Steals = PlayerUtil.getBigPro("Steals", totalPro);
        let defend = PlayerUtil.getBigPro("defend", totalPro);
        let baseDefend = Math.floor((parseInt(data['Rejection'])+parseInt(data['Steals']))/2);
        this.nod_attr_list[3].getChildByName('lbl_value').getComponent(cc.Label).string = ''+Rejection;
        this.nod_attr_list[3].getChildByName('pgs_0').getComponent(cc.ProgressBar).progress = parseInt(data['Rejection'])/MAX_PLAYER_PRO;
        this.nod_attr_list[3].getChildByName('pgs_1').getComponent(cc.ProgressBar).progress = Rejection/MAX_PLAYER_PRO;
        this.nod_attr_list[4].getChildByName('lbl_value').getComponent(cc.Label).string = ''+defend;
        this.nod_attr_list[4].getChildByName('pgs_0').getComponent(cc.ProgressBar).progress = baseDefend/MAX_PLAYER_PRO;
        this.nod_attr_list[4].getChildByName('pgs_1').getComponent(cc.ProgressBar).progress = defend/MAX_PLAYER_PRO;
        this.nod_attr_list[5].getChildByName('lbl_value').getComponent(cc.Label).string = ''+Steals;
        this.nod_attr_list[5].getChildByName('pgs_0').getComponent(cc.ProgressBar).progress = parseInt(data['Steals'])/MAX_PLAYER_PRO;
        this.nod_attr_list[5].getChildByName('pgs_1').getComponent(cc.ProgressBar).progress = Steals/MAX_PLAYER_PRO;

        let Pass = PlayerUtil.getBigPro("Pass", totalPro);
        let Dribble = PlayerUtil.getBigPro("Dribble", totalPro);
        let skill = PlayerUtil.getBigPro("skill", totalPro);
        let baseSkill = Math.floor((parseInt(data['Pass'])+parseInt(data['Dribble']))/2);
        this.nod_attr_list[6].getChildByName('lbl_value').getComponent(cc.Label).string = ''+skill;
        this.nod_attr_list[6].getChildByName('pgs_0').getComponent(cc.ProgressBar).progress = baseSkill/MAX_PLAYER_PRO;
        this.nod_attr_list[6].getChildByName('pgs_1').getComponent(cc.ProgressBar).progress = skill/MAX_PLAYER_PRO;
        this.nod_attr_list[7].getChildByName('lbl_value').getComponent(cc.Label).string = ''+Pass;
        this.nod_attr_list[7].getChildByName('pgs_0').getComponent(cc.ProgressBar).progress = parseInt(data['Dribble'])/MAX_PLAYER_PRO;
        this.nod_attr_list[7].getChildByName('pgs_1').getComponent(cc.ProgressBar).progress = Pass/MAX_PLAYER_PRO;
        this.nod_attr_list[8].getChildByName('lbl_value').getComponent(cc.Label).string = ''+Dribble;
        this.nod_attr_list[8].getChildByName('pgs_0').getComponent(cc.ProgressBar).progress = parseInt(data['Dribble'])/MAX_PLAYER_PRO;
        this.nod_attr_list[8].getChildByName('pgs_1').getComponent(cc.ProgressBar).progress = Dribble/MAX_PLAYER_PRO;

        let Dunk = PlayerUtil.getBigPro("Dunk", totalPro);
        let Rebound = PlayerUtil.getBigPro("Rebound", totalPro);
        let strength = PlayerUtil.getBigPro("strength", totalPro);
        let baseStrength = Math.floor((parseInt(data['Dunk'])+parseInt(data['Rebound']))/2);
        this.nod_attr_list[9].getChildByName('lbl_value').getComponent(cc.Label).string = ''+strength;
        this.nod_attr_list[9].getChildByName('pgs_0').getComponent(cc.ProgressBar).progress = baseStrength/MAX_PLAYER_PRO;
        this.nod_attr_list[9].getChildByName('pgs_1').getComponent(cc.ProgressBar).progress = strength/MAX_PLAYER_PRO;
        this.nod_attr_list[10].getChildByName('lbl_value').getComponent(cc.Label).string = ''+Dunk;
        this.nod_attr_list[10].getChildByName('pgs_0').getComponent(cc.ProgressBar).progress = parseInt(data['Dunk'])/MAX_PLAYER_PRO;
        this.nod_attr_list[10].getChildByName('pgs_1').getComponent(cc.ProgressBar).progress = Dunk/MAX_PLAYER_PRO;
        this.nod_attr_list[11].getChildByName('lbl_value').getComponent(cc.Label).string = ''+Rebound;
        this.nod_attr_list[11].getChildByName('pgs_0').getComponent(cc.ProgressBar).progress = parseInt(data['Rebound'])/MAX_PLAYER_PRO;
        this.nod_attr_list[11].getChildByName('pgs_1').getComponent(cc.ProgressBar).progress = Rebound/MAX_PLAYER_PRO;

        let Speed = PlayerUtil.getBigPro("Speed", totalPro);
        let Stamina = PlayerUtil.getBigPro("Stamina", totalPro);
        let body = PlayerUtil.getBigPro("body", totalPro);
        let baseBody = Math.floor((parseInt(data['Speed'])+parseInt(data['Stamina']))/2);
        this.nod_attr_list[12].getChildByName('lbl_value').getComponent(cc.Label).string = ''+body;
        this.nod_attr_list[12].getChildByName('pgs_0').getComponent(cc.ProgressBar).progress = baseBody/MAX_PLAYER_PRO;
        this.nod_attr_list[12].getChildByName('pgs_1').getComponent(cc.ProgressBar).progress = body/MAX_PLAYER_PRO;
        this.nod_attr_list[13].getChildByName('lbl_value').getComponent(cc.Label).string = ''+Speed;
        this.nod_attr_list[13].getChildByName('pgs_0').getComponent(cc.ProgressBar).progress = parseInt(data['Speed'])/MAX_PLAYER_PRO;
        this.nod_attr_list[13].getChildByName('pgs_1').getComponent(cc.ProgressBar).progress = Speed/MAX_PLAYER_PRO;
        this.nod_attr_list[14].getChildByName('lbl_value').getComponent(cc.Label).string = ''+Stamina;
        this.nod_attr_list[14].getChildByName('pgs_0').getComponent(cc.ProgressBar).progress = parseInt(data['Stamina'])/MAX_PLAYER_PRO;
        this.nod_attr_list[14].getChildByName('pgs_1').getComponent(cc.ProgressBar).progress = Stamina/MAX_PLAYER_PRO;
    }
}
