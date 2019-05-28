import ItemData from "../../data/ItemData";
import ManagerData from "../../data/ManagerData";
import PlayerUtil from "../../utils/PlayerUtil";
import IconManager from "../../config/IconManager";
import Utils from "../../utils/Utils";

/**
 * 球员信息
 */
const {ccclass, property} = cc._decorator;

@ccclass
export default class PlayerInfo extends cc.Component {
    /** 球员背景图片 */
    @property([cc.SpriteFrame])
    public iconBgFrame:cc.SpriteFrame[] = [];
    /** 球员位置 得分后卫 控球后卫 小前锋 大前锋 中锋 */
    @property([cc.SpriteFrame])
    public positionFrame:cc.SpriteFrame[] = [];
    /** 球员位置缩写 SG PG SG PF C */
    @property([cc.SpriteFrame])
    public positionAbridgeFrame:cc.SpriteFrame[] = [];

    /** 球员背景图（根据配置） */
    @property(cc.Sprite)
    public frameBg:cc.Sprite = null;

    /** 球员位置 */
    @property(cc.Sprite)
    public img_position:cc.Sprite = null;

    /** 球员位置缩写 */
    @property(cc.Sprite)
    public img_position_abridge:cc.Sprite = null;

    /** 球员名称 */
    @property(cc.RichText)
    public lbl_name:cc.RichText = null;

    /** 战力  kpi值 */
    @property(cc.Label)
    public lbl_kpi:cc.Label = null;

    /** 体力条 */
    @property(cc.ProgressBar)
    public prg_spirit:cc.ProgressBar = null;

    /** 球员头像 */
    @property(cc.Sprite)
    public img_icon:cc.Sprite = null;

    /** 开除按钮 */
    @property(cc.Button)
    public btn_del:cc.Button = null;

    //关联的数据
    public data:Object;
    //原始数据
    public srcData:Object;
    //索引
    public index:number;


    /** 初始化数据 */
    onLoad () {
        this.frameBg = this.getComponent(cc.Sprite);
        this.img_icon = this.node.getChildByName('img_icon').getComponent(cc.Sprite);
        this.img_position = this.node.getChildByName('img_position').getComponent(cc.Sprite);
        this.img_position_abridge = this.node.getChildByName('img_position_abridge').getComponent(cc.Sprite);
        this.lbl_name = this.node.getChildByName('lbl_name').getComponent(cc.RichText);
        this.lbl_kpi = this.node.getChildByName('lbl_kpi').getComponent(cc.Label);
        this.prg_spirit = this.node.getChildByName('prg_spirit').getComponent(cc.ProgressBar);
        this.btn_del = this.node.getChildByName('btn_del').getComponent(cc.Button);

        this.init();
    }

    start () {

    }

    init (){
        this.frameBg.spriteFrame = this.iconBgFrame[0];
        this.img_icon.spriteFrame = null;
        this.img_position.spriteFrame = null;
        this.img_position.spriteFrame = null;
        this.img_position_abridge.spriteFrame = null;
        this.lbl_name.string = '';
        this.lbl_kpi.string = '';
        this.prg_spirit.progress = 0;
        this.btn_del.node.active = false;

        this.index = 0;
    }

    format (data:Object, teamInfo:Object, section:number=0,primitive:boolean = false) {

        this.srcData = data;

        var pid:string = (data ? data['Pid'] : "");

        if(pid){
            var info:Object = ItemData.getPlayerInfo(pid);
            if(info){
                this.data = info;
                if(info){
                    this.lbl_name.string = "<font color='"+ItemData.getCardColor(info['CardLevel'])+"'>"+info['ShowName']+"</font>";
                }
                this.frameBg.spriteFrame = this.iconBgFrame[parseInt(info['CardLevel'])];

                this.btn_del.node.active = false;
                
                // if($item.storeTxt)
                // {
                //     var storeDic = ManagerData.getInstance().storeDic;
                //     if(parseInt(storeDic[pid]) == 1)
                //     {
                //         //$item.storeTxt.visible = true;
                //     }
                // }
                
                var id:string = pid;
                if(!id || id == "000000000000000000000000"){
                    id = pid;
                }
                var kp:number = PlayerUtil.getKPByTid(id);
                if(primitive)
                {
                    this.lbl_kpi.string = info['Kp'];
                }
                else
                {
                    this.lbl_kpi.string = (kp!=0?kp:info['Kp'])+'';
                }

                let pos = Math.max(info['Position'], 1)-1;
                this.img_position_abridge.spriteFrame = this.positionAbridgeFrame[pos]
                this.img_position.spriteFrame = this.positionFrame[pos]
                
                
                var url:string = IconManager.preURL+IconManager.PLAYER_PER+info['HeadStyle']
                cc.loader.loadRes(url,cc.SpriteFrame,(err,spriteFrame)=>{
                    if(err){
                        Utils.fadeErrorInfo(err.message);
                        return;
                    }
                    this.img_icon.spriteFrame = spriteFrame;
                });
            }

            var stamina:number = Utils.getStamina(pid, teamInfo, section);
            this.prg_spirit.progress = stamina/100;
        }else{
            this.srcData = null;
            data = null;
            this.init();
        }
    }

    // update (dt) {}
}
