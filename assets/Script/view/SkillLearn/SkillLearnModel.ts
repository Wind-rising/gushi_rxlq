
import Utility from "../../utils/Utility";
import Events from "../../signal/Events";

export default class SkillLearnModel{

    public static EventSelect = "SkillLearnModelselect";
    public static EventSkillItemClick = "SkillLearnModelSkillItemClick";

    //球员列表信息
    public static playerListData;
    //球员item对象
    public static playerItemArr = [];
    //预制体-球员item
    public static PlayerItemPrefabUrl = 'Skill/SkillPlayerItem';
    //脚本-球员item
    public static PlayerItemScript = 'SkillPlayerList';
    //预制体-技能item
    public static SkillItemPrefabUrl = 'Skill/SkillItem';
    //脚本-技能item
    public static SkillItemScript = 'SkillItem';
    //当前选中球员
    public static currentPlayer = "";
    //当前选中球员tid
    public static currentTid;
    //当前选中球员对象
    public static _selectPlayer;
    //技能数据
    public static playerSkillMap = {};
    //当前技能信息
    public static skillItems = [];
    //按钮个数
    public static BTN_NUM = 5;
    //技能背包
    public static skillBag =null;
    // //技能一行个数
    // public static SKILL_NUM = 8;
    //技能一行数
    // public static SKILL_LINE = 3;
    //球员技能列表长度
    public static _skillMap = {};
    public static get selectPlayer(){
        return this._selectPlayer;
    }
    public static set selectPlayer(val){
        if(SkillLearnModel._selectPlayer != val){
            SkillLearnModel._selectPlayer = val;
            if(SkillLearnModel._selectPlayer){
                Events.getInstance().dispatch(SkillLearnModel.EventSelect)
            }
        }
    }

    //球员item加载
    public static async createBagItem({data = null,parent = null,...options}){
        let prefab = await Utility.insertPrefab(SkillLearnModel.PlayerItemPrefabUrl);
        prefab.sComponent = prefab.getComponent(SkillLearnModel.PlayerItemScript);
        prefab.sComponent.init&&prefab.sComponent.init(data)
        if(parent)
            prefab.parent = parent;
        return prefab;
    }
    //技能item加载
    public static async createSkillItem({data = null,parent = null,...options}){
        let prefab = await Utility.insertPrefab(SkillLearnModel.SkillItemPrefabUrl);
        prefab.sComponent = prefab.getComponent(SkillLearnModel.SkillItemScript);
        prefab.sComponent.create&&prefab.sComponent.create({
            "info":data,
            "index":options.index
        })
        if(parent)
            prefab.parent = parent;
        return prefab;
    }
}