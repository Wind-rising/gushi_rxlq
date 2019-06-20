import BagData from "./BagData";
import switch_page from "../public/switch_page";
import Events from "../../signal/Events";
import Utility from "../../utils/Utility";
import BagItem from "./BagItem";
import Alert from "../public/Alert";
import ErrMsg from "../../data/ErrMsg";
import ManagerData from "../../data/ManagerData";

const {ccclass,property} = cc._decorator;

//背包UI系统
@ccclass
export default class Bag extends cc.Component{
    //导航-头集合
    @property([cc.Node])
    private nav_head:Array<cc.Node> = [];
    //导航-切换内容
    @property(cc.Node)
    private nav_content:cc.Node = null;
    //页面-页数
    @property(cc.Node)
    private page_num:cc.Node = null;
    //页面-上一页
    @property(cc.Node)
    private page_prev:cc.Node = null;
    //页面-下一页
    @property(cc.Node)
    private page_next:cc.Node = null; 
    //按钮-关闭页面
    @property(cc.Button)
    private btn_close:cc.Button = null;
    //按钮-扩展
    @property(cc.Button)
    private btn_expansion:cc.Button = null;
    //按钮-整理
    @property(cc.Button)
    private btn_arrange:cc.Button = null;
    //容器-物品介绍
    @property(cc.Node)
    private ctnr_goods:cc.Node = null;
    //容器-物品操作
    @property(cc.Node)
    private ctnr_operation:cc.Node = null;
    //容器-物品信息
    @property(cc.Node)//物品信息模块
    private ctnr_info:cc.Node = null;

    //一页背包个数
    private BASIC_BAG_NUM = 36;
    //背包扩充-球票参数
    private BASIC_EXTEND_POINT = 10;
    //背包扩充-个数
    private EXTEND_NUM = 6;
    //预制体脚本-导航头
    private prefab_script_nav_head = "BagSwitchHead"
    //当前背包物体对象
    private _srcItems = null;
    //切换对象
    private _pageCom = null;
    //背包展示类型列表
    public exceptTypeList = null;
    //背包展示ID列表
    public exceptIdLIst = null;

   
}