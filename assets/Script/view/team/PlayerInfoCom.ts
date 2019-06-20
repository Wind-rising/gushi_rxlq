import Utility from "../../utils/Utility";
import ItemData from "../../data/ItemData";
import PlayerSkillItem from "./PlayerSkillItem";
import IconManager from "../../config/IconManager";
import StarSkillData from "../../data/StarSkillData";
import Events from "../../signal/Events";
import PlayerManage from "./PlayerManage";

/**
 * 显示球员信息 
 * 球员管理界面中间部分
 */
const {ccclass, property} = cc._decorator;

@ccclass
export default class PlayerInfoCom extends cc.Component {
    //装备数量
    private EQUIP_NUM:number = 6;
    
    /** 装备列表 */
    equipDataList:Array<Object> = null;
    
    playerInfo:Object = null;
    // LIFE-CYCLE CALLBACKS:
    /** 球员位置图片 */
    nod_pos:cc.Node = null;
    /** 球员位置文本 */
    lbl_position:cc.Label = null;
    /** 球员名称 */
    lbl_player_name:cc.Label = null;
    /** 球员工资 */
    lbl_salary:cc.Label = null;
    /** 球员综合能力 */
    lbl_kpi:cc.Label = null;
    /** 球员装备列表 */
    img_equipment_0:cc.Sprite = null;

    /** 四个技能图标 */
    img_skill_0:PlayerSkillItem = null;
    img_skill_1:PlayerSkillItem = null;
    img_skill_2:cc.Sprite = null;
    img_skill_3:cc.Sprite = null;

    onLoad () {
        this.nod_pos = this.node.getChildByName('nod_pos');
        this.lbl_position = this.node.getChildByName('lbl_position').getComponent(cc.Label);
        this.lbl_player_name = this.node.getChildByName('lbl_player_name').getComponent(cc.Label);
        this.lbl_salary = this.node.getChildByName('lbl_salary').getComponent(cc.Label);
        this.lbl_kpi = this.node.getChildByName('lbl_kpi').getComponent(cc.Label);
        this.img_equipment_0 = this.node.getChildByName('img_equipment_0').getComponent(cc.Sprite);

        this.img_skill_0 = this.node.getChildByName('img_skill_0').getComponent(PlayerSkillItem);
        this.img_skill_1 = this.node.getChildByName('img_skill_1').getComponent(PlayerSkillItem);
        this.img_skill_2 = this.node.getChildByName('img_skill_2').getComponent(cc.Sprite);
        this.img_skill_3 = this.node.getChildByName('img_skill_3').getComponent(cc.Sprite);

        //解雇球员
        this.node.getChildByName('btn_fire').getComponent(cc.Button).clickEvents.push(
            Utility.bindBtnEvent(this.node,'PlayerManage','onFirePlayer')
        );

        //一键脱装备
        this.node.getChildByName('btn_unload_equipment').getComponent(cc.Button).clickEvents.push(
            Utility.bindBtnEvent(this.node,'PlayerManage','onUnloadEquipment')
        );
    }
    start () {

    }

    // update (dt) {}
    
    /**
     * 解雇球员
     */
    onFirePlayer () {
        //
    }

    /**
     * 一键脱装备
     */
    onUnloadEquipment(){
        //
    }

    init () {
        this.lbl_kpi.string = '';
        this.lbl_player_name.string = '';
        this.lbl_position.string = '';
        this.lbl_salary.string = '';
    }

    /**
     * 显示数据
     * @param data 
     */
    formatData (data:Object = null){
        if(!data){
            this.init();
        }else{
            this.showPlayerInfo(data);
        }
    }

    /**
     * 显示画面中间球员信息
     */
    showPlayerInfo(playerInfo:Object){
        this.playerInfo = playerInfo;
        let basicData = playerInfo['basicData'];

        let pos = parseInt(basicData['Position']);
        for(let i = 0;i < 5; i++){
            this.nod_pos.getChildByName('img_'+i).active = pos == (i+1);
        }
        this.lbl_position.string = ItemData.getInstance().getPosStr(pos);
        this.lbl_player_name.string = basicData['Name']
        this.lbl_player_name.node.color = new cc.Color().fromHEX(ItemData.getInstance().getCardColor(parseInt(basicData['CardLevel'])));
        
        this.lbl_salary.string = "球员工资："+basicData['Salary']+"万";
        this.lbl_kpi.string = ''+Math.floor(playerInfo['Kp']);

        this.showSkillInfo(playerInfo);

        this.showCombSkillInfo(playerInfo);

        this.formatStarSkill(basicData['StarSkill'],playerInfo['Level']);

        this.showEquipmentInfo(playerInfo);
    }
    /** 显示技能 */
    showSkillInfo (data){
        let skillList = data['Skill'] || [];
        this.img_skill_0.formatSkillData(skillList[1]);
        this.img_skill_1.formatSkillData(skillList[2]);
    }
    /** 显示组合技能 */
    showCombSkillInfo(data:Object) {
        this.nod_pos
        if(data['CombSkill']){
            if(data['CombSkill']['SkillCode']){
                IconManager.getIcon(data['CombSkill']['SkillCode'], IconManager.COMBO_ICON,(spriteFrame)=>{
                    this.img_skill_2.spriteFrame = spriteFrame;
                });
            }else{
                this.img_skill_2.spriteFrame = null;
            }
        }else{
            this.img_skill_2.spriteFrame = null;
        }
    }
    //球星技能
    private formatStarSkill(basicData:Object,level:number):void{
        let skillId = basicData['StarSkill'];
        var info:Object = StarSkillData.getInstance().getSkillInfo(skillId, level);
        if(info){
            IconManager.getIcon(skillId, IconManager.STAR_SKILL,(spriteFrame)=>{
                this.img_skill_2.spriteFrame = spriteFrame;
            });
        }else{
            this.img_skill_3.spriteFrame = null;
        }
    }
    /** 显示装备 */
    showEquipmentInfo (data) {
        //格式化装备信息
        /*'Uuid' => string '52134e197e46c7953100002d' (length=24)
        'ItemCode' => int 11
        'Str' => int 1
        'Pos' => int 28
        'Equip' => 
        array (size=7)
        'Uuid' => string '52134e197e46c7953100002d' (length=24)
        'Type' => int 11
        'Lvl' => int 1
        'Floor' => int 1
        'Pair' => int 0
        'Sign' => int 0
        'Hole' => 
        array (size=3)
        0 => int 0
        1 => int 0
        2 => int 0*/
        this.equipDataList = [];
        let equipData:Object = null;
        for(let i = 0; i < this.EQUIP_NUM; i++){
            equipData = data['Equip'][i];
            let img_equipment = this.node.getChildByName('img_equipment_'+i).getChildByName('img_icon').getComponent(cc.Sprite);
            if(equipData && equipData['Uuid'] != "000000000000000000000000"){
                let info = {};
                info['Uuid'] = equipData['Uuid'];
                info['ItemCode'] = equipData['Type'];
                info['Str'] = 1;
                info['Pos'] = -1;
                //脑残设计
                info['Equip'] = equipData;
                this.equipDataList.push(info);
                //let itemData = ItemData.getInstance().getItemInfo(info['ItemCode']);
                if(equipData['Ring'] && equipData['Ring']['Uuid'] && equipData['Ring']['Uuid'] != "000000000000000000000000"){
                    IconManager.getIcon(''+info['ItemCode'],IconManager.ITEM_ICON,(spriteFrame)=>{
                        img_equipment.spriteFrame = spriteFrame;
                    });
                }else{
                    IconManager.getIcon(''+equipData['Type']+equipData['Pair'], IconManager.EQUP_ICON,(spriteFrame)=>{
                        img_equipment.spriteFrame = spriteFrame;
                    });
                }

            }else{
                img_equipment.spriteFrame = null;
            }
        }
        
        //戒指 独立处理
        // if(data['Ring'] && data['Ring']['Uuid'] && data['Ring']['Uuid'] != "000000000000000000000000"){//
        //     equipData = data.Ring
        //     let info = {};//伪造背包数据包
        //     info['Uuid'] = equipData['Uuid']
        //     info['ItemCode'] = 1;
        //     info['Str'] = 1;
        //     info['Pos'] = -1;
        //     info['Equip'] = equipData;
        //     info['Ring'] = equipData;
        //     this.equipDataList.push(info);
        // }
    }
}
