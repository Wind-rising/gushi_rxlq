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
export default class AppConfig {

    /** 语言 */
    public static lang:string = 'zh';
    /**http服务器地址 */
    public static httpRoot:string = 'http://flash.lanqiu.thinkygame.com:8080/test/';
    /** 平台 */
    public static plant:string = 'test';
    /** 当前版本 */
    public static version:string = '1.0.0';
    /**服务器ID*/
    public static serverid:number = 1;
    /**平台配置地址*/
    public static platConfigURL:string = '';
    /**平台配置地址*/
    public static lan_ConfigURL:string = '';
    /**cookie信息*/
    public static snsInfo: string = '';
    /** 是否是debug模式 Debug模式登录根据ip绑定 不需登录信息*/
    public static isDebug:number = 0;

    /**事件-常量-系共同初始化完成*/
    public static SYS_INIT:string = "sys_init";
    /**事件-常量-显示消息*/
    public static SHOW_MSG:string = "show_msg"; 
    /**事件-系统级错误*/
    public static SYS_ERR:string = "sys_err";
    /**事件-总进度-伪造*/
    public static SYS_PRO:string = "sys_pro"
    /**事件-显示LOADER*/
    public static SHOW_LOADER:string = "show_loader";
    /**事件-隐藏LOADER*/
    public static HIDE_LOADER:string = "hide_loader";
}
