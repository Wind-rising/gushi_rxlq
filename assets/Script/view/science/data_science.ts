export default class data_science{
    //UI模块
    // public static 
    /*
        1.当前选中球员装备数据
        2.球员列表页索引
        3.装备列表页索引
        4.当前装备索引
        5.当前球员索引
    */
    //一页球员列表个数
    public static playerListNum = 10;
    //球员列表页索引
    public static playerListPageIndex = 0;
    //当前球员索引
    public static player_id = -1;
    //当前装备
    public static selectPlayer = null;
    //一页装备列表个数
    public static equipListNum = 5;
    //装备列表页索引
    public static equipListPageIndex = 0;
    //当前装备索引
    public static equipIndex = -1;
    //当前装备
    public static selectEquip = null;
    //当前选中球员装备数据
    public static playerEquip;
    //功能索引
    public static index = 0;
    //装备最大升级等级
    public static EQUIP_MAX_LV = 80;

    //事件监听
    public static EventChange = "CHANGE";
}