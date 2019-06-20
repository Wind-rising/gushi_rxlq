
/**
 * 球员技能
 */
const {ccclass, property} = cc._decorator;

import Singleton from "../../Utils/Singleton";
import PlayerControllor from "../../controllor/PlayerControllor";
import Utility from "../../utils/Utility";
import IconManager from "../../config/IconManager";
import WillData from "../../data/WillData";
import StarSkillData from "../../data/StarSkillData";

@ccclass
export default class PlayerSkills extends Singleton {

    //球员数据相关
    needRefresh:boolean = false;
    playerInfo:Object = null;

    img_skill_0:cc.Node = null;
    img_skill_1:cc.Node = null;
    img_skill_2:cc.Node = null;
    img_skill_3:cc.Node = null;

    onLoad () {
        this.needRefresh = true;

        this.img_skill_0 = this.node.getChildByName('img_skill_0');
        this.img_skill_1 = this.node.getChildByName('img_skill_1');
        this.img_skill_2 = this.node.getChildByName('img_skill_2');
        this.img_skill_3 = this.node.getChildByName('img_skill_3');

        this.img_skill_0.getComponent(cc.Button).clickEvents.push(
            Utility.bindBtnEvent(this.node,'PlayerSkills','onBtnSkill0')
        );
        this.img_skill_1.getComponent(cc.Button).clickEvents.push(
            Utility.bindBtnEvent(this.node,'PlayerSkills','onBtnSkill1')
        );
        this.img_skill_2.getComponent(cc.Button).clickEvents.push(
            Utility.bindBtnEvent(this.node,'PlayerSkills','onBtnSkill2')
        );
        this.img_skill_3.getComponent(cc.Button).clickEvents.push(
            Utility.bindBtnEvent(this.node,'PlayerSkills','onBtnSkill3')
        );

        this.node.getChildByName('btn_learn').getComponent(cc.Button).clickEvents.push(
            Utility.bindBtnEvent(this.node,'PlayerSkills','onBtnLearnSkill')
        );


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

        let skillList = this.playerInfo['Skill'];
        if(typeof skillList == "boolean"){
            skillList = {};
        }
        //为毛是从1开始取的？？？？
        this.initSkillIcon(this.img_skill_0,skillList[1]);

        this.initSkillIcon(this.img_skill_1,skillList[2]);

        /** 组合技能 */
        if(this.playerInfo['CombSkill'] && this.playerInfo['CombSkill']['SkillCode']){
            let willData = WillData.getInstance().getWill();
            let info:Object = willData[this.playerInfo['CombSkill']['SkillCode']];
            //if(!info)不做判断 方便查找bug
            IconManager.getIcon(this.playerInfo['CombSkill']['SkillCode'], IconManager.COMM_SKILL, (spriteFrame)=>{
                this.img_skill_2.getChildByName('img_icon').getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });
            let lbl_name = this.img_skill_2.getChildByName('lbl_name').getComponent(cc.Label);
            lbl_name.string = info['Name'];
            let lbl_tag = this.img_skill_2.getChildByName('lbl_tag').getComponent(cc.Label);
            if(this.playerInfo['CombSkill']['Put'] == "0"){
                lbl_tag.node.color = cc.Color.RED;
                lbl_tag.string = '（未激活）';
            }else{
                lbl_tag.node.color = cc.Color.GREEN;
                lbl_tag.string = '（已生效）';
            }
        }else{
            this.initSkillIcon(this.img_skill_2);
        }

        /** 球星技能 */
        if(this.playerInfo['basicData'] && this.playerInfo['basicData']['StarSkill']){
            let starSkill = this.playerInfo['basicData']['StarSkill'];
            let starInfo = StarSkillData.getInstance().getSkillInfo(starSkill, this.playerInfo['Level']);
            let lv = starInfo['SkillCode'].split("_")[1];
            this.img_skill_3.getChildByName('lbl_level').getComponent(cc.Label).string = 'Lv' + lv;
            this.img_skill_3.getChildByName('lbl_name').getComponent(cc.Label).string = starInfo['Name'];

            let lbl_tag = this.img_skill_3.getChildByName('lbl_tag').getComponent(cc.Label)
            if(this.playerInfo['Level'] < parseInt(starInfo['ConditionLevel'])){
                lbl_tag.node.color = cc.Color.RED;
                lbl_tag.string = '球员'+starInfo['ConditionLevel']+'阶可激活Lv'+lv+starInfo['Name'];
            }else{
                lbl_tag.node.color = cc.Color.GREEN;
                lbl_tag.string = '已激活';
            }
        }else{
            this.initSkillIcon(this.img_skill_3);
        }
        
    }

    onBtnLearnSkill (e:cc.Event.EventTouch) {
        cc.log('打开技能界面');
    }
    /** 通用技能1 */
    onBtnSkill0 () {

    }
    /** 通用技能2 */
    onBtnSkill1 () {

    }
    /** 球星技能 */
    onBtnSkill2 () {

    }
    /** 组合技能 */
    onBtnSkill3 () {

    }

    /** 显示技能图标 */
    initSkillIcon (skillIcon:cc.Node,data:Object = null) {
        if(data&&data['ItemCode']){
            let skillId:string = ''+data['ItemCode'];
            skillIcon.getChildByName('lbl_level').getComponent(cc.Label).string = "Lv"+skillId.charAt(skillId.length-1);
            skillIcon.getChildByName('lbl_name').getComponent(cc.Label).string = '';
            skillIcon.getChildByName('lbl_tag').getComponent(cc.Label).string = '';

            IconManager.getIcon(data['ItemCode'], IconManager.COMM_SKILL, (spriteFrame)=>{
                skillIcon.getChildByName('img_icon').getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });
            
        }else{
            skillIcon.getChildByName('lbl_level').getComponent(cc.Label).string = '';
            skillIcon.getChildByName('lbl_name').getComponent(cc.Label).string = '';
            skillIcon.getChildByName('lbl_tag').getComponent(cc.Label).string = '';
            skillIcon.getChildByName('img_icon').getComponent(cc.Sprite).spriteFrame = null;
        }
        
    }
}
