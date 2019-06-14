/**
 * 全局公用方法，集合，全部使用静态方法，
 * 方便调用，不涉及游戏逻辑，只做算法相关
 */
const {ccclass, property} = cc._decorator;

import URLConfig from "../config/URLConfig";
import HttpManager from "./HttpManager";
import ManagerData from "../data/ManagerData";
import ItemData from "../data/ItemData";
import { promises } from "fs";

@ccclass
export default class Utility extends cc.Component {
    
    public static showDialog(name:String,args:{
        pos?:cc.Vec2,
        parent?:cc.Node,
        callBack?:Function,
        context?:Object
    } = {}):void 
    {
        this.showLoading();
        cc.loader.loadRes("prefabs/"+name, cc.Prefab, (error, prefab)=>{
            this.hideLoading();
            if (error) {
                cc.error(error);
                cc.error('未找到 ' + "prefabs/"+name)
                return;
            }
            let dialog = cc.instantiate(prefab);
            dialog.position = args.pos || {x:cc.winSize.width/2,y:cc.winSize.height/2};
            dialog.parent = args.parent || cc.director.getScene();
            //TODO: 处理参数

            if(args.callBack){
                if(args.context){
                    args.callBack.apply(args.context);
                }else{
                    args.callBack();
                }
            }
        });
    };
    
    /**
     * 此方法不再使用，用showAlert 和 showConfirm 替代
     * @param String content 
     * @param String title
     * @param function onOk
     * @param function onCancel
     */
    public static alert (content:String,onOk?:Function,args?:any):void {
        this.showConfirm(content,onOk,args);
    };
    /**
     * 提示框
     * @param content 提示内容
     * @param title 提示标题
     */
    public static showAlert (content:string,title:string = ''){
        this.showConfirm(content,null,{title:title});
    }
    /**
     * 确认框
     * @param content 确认内容
     * @param onOk 确认按钮回调
     * @param args {
     *              showCancel:boolean=false是否显示取消
     *              title:string='' 标题
     *              onCancel:Function=null  点取消按钮的回调
     *              }
     */
    public static showConfirm (content:String,onOk?:Function,args?:{
        showCancel?:boolean,
        title?:string,
        onCancel?:Function
    }){
        //cc.find('alert').getComponent("Alert").confirm(content,onOk,args);
        let alert = cc.find('alert');
        if(alert){
            alert.getComponent("Alert").confirm(content,onOk,args);
        }else{
            cc.loader.loadRes("prefabs/common/alert", cc.Prefab, function (error, prefab) {
                if (error) {
                    cc.error(error);
                    cc.error('未找到 ' + "prefabs/common/alert")
                    return;
                }
                let alert:cc.Node = cc.instantiate(prefab);
                alert.zIndex = 1000;
                alert.parent = args['parent']||cc.director.getScene();
                //处理参数
                alert.getComponent("Alert").confirm(content,onOk,args);
            });
        }
    }

    /**
     * 
     * @param content 显示loading转圈圈的效果 屏蔽点击
     */
    public static showLoading (content:string = ''):void {
        let loading = cc.find('loading');
        if(loading){
            loading.getComponent("Loading").show(content);
        }else{
            cc.loader.loadRes("prefabs/common/loading", cc.Prefab, function (error, prefab) {
                if (error) {
                    cc.error(error);
                    cc.error('未找到 ' + "prefabs/common/loading")
                    return;
                }
                let dialog:cc.Node = cc.instantiate(prefab);
                dialog.zIndex = 1001;
                dialog.parent = cc.director.getScene();
                //处理参数
                dialog.getComponent("Loading").show(content);
            });
        }
    };
    public static hideLoading ():void{
        let loading = cc.find('loading');
        if(loading){
            loading.getComponent("Loading").hide();
        }
        
    };

    /** 屏幕飘子索引 */
    private static fadeLabelIndex:number = 0;
    private static fadeNode:cc.Node = new cc.Node();
    /**
     * 显示屏幕飘字
     * @param content 提示文本
     * @param pos 出现的位置
     * @param color 颜色
     */
    public static fadeInfo (content:string,pos?:cc.Vec2,color:cc.Color = cc.Color.WHITE){
        if(!this.fadeNode.parent){
            this.fadeNode.position = new cc.Vec2(cc.winSize.width*0.5,cc.winSize.height*0.5);
            this.fadeNode.parent = cc.director.getScene();
            cc.game.addPersistRootNode(this.fadeNode);
        }
        /** 创建RichText节点 */
        let lblNode = new cc.Node();
        lblNode.zIndex = 1002;
        lblNode.addComponent<cc.RichText>(cc.RichText);
        let lbl = lblNode.getComponent(cc.RichText);
        lbl.fontSize = 28;
        lbl.string = cc.js.formatStr('<color=%s>%s</c>',color.toCSS('#rrggbb'),content);
        
        /** 分两种情况，如果给了坐标值，就按照坐标值显示，否则就在屏幕中间 */
        if(pos){
            lblNode.position = pos;
            lblNode.parent = cc.director.getScene();
        }else{
            this.fadeLabelIndex++;
            for(let i = 0;i<this.fadeNode.childrenCount;i++){
                this.fadeNode.children[i].y = this.fadeNode.children[i].y + 35;
            }
            lblNode.position = cc.Vec2.ZERO;
            lblNode.parent = this.fadeNode;
        }
        /** 动画： 渐隐 飘动 移除 */
        lblNode.runAction(cc.sequence(cc.fadeIn(0.8)
            , cc.delayTime(2.5)
            ,cc.spawn(cc.fadeOut(1),cc.moveBy(1,0,100))
            ,cc.removeSelf()
            , cc.callFunc(function(){
                this.fadeLabelIndex--;
        },this)));
    }

    /**
     * 飘字提示错误信息
     * @param [string]message 文本内容
     * @param [cc.postion]location 坐标（可选）
     */
    public static fadeErrorInfo (message:string, location?:cc.Vec2) {
        Utility.fadeInfo(message, location, cc.color(255, 50, 0));
    };

    
    /** 游戏逻辑相关，不应该在这里做-------------------------------------------------------- */
    /** 获取分享信息 */
    public static getFeed():void{
        let srvArgs = {action:URLConfig.Get_Data,
            args:[{n:URLConfig.ManagerFeed, i:{}}]};
        HttpManager.getInstance().request(srvArgs,onGetFeed,this);

        function onGetFeed(data:Object):void{
            if(data['res']){
                let feedInfo:Object= data['data'][0].Last;
                if(feedInfo && feedInfo['code']){
                    this.share(feedInfo['code'], feedInfo["var"]);
                }
            }
        }
    };
    /**分享*/
    public static share(feedCode:String, feedVar:Object, type:number = 1):void{
        //todo sth
    };
   /** 游戏逻辑相关，不应该在这里做-------------------------------------------------------- */

    /**
     * 点击绑定事件
     * @param [any]target 目标节点
     * @param [string]component 目标组件名
     * @param [string]handler 响应事件函数名
     * @param [string]param 响应式事件携带参数
     */
    public static bindBtnEvent(target:any,component:string = "",handler:string="",param?){
        let clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = target; //这个 node 节点是你的事件处理代码组件所属的节点，这里就是Button2
        clickEventHandler.component = component;//这个是脚本文件名
        clickEventHandler.handler = handler; //回调函名称
        param&&(clickEventHandler.customEventData = param); //用户数据
        return clickEventHandler;
    }




    public static async insertPrefab(name:String,parent?:cc.Node):Promise<void> {
        return new Promise((resolve,reject)=>{
            cc.loader.loadRes("prefabs/"+name, cc.Prefab, (error, prefab)=>{
                this.hideLoading();
                if (error) {
                    cc.error(error);
                    cc.error('未找到 ' + "prefabs/"+name)
                    return;
                }
                let dialog = cc.instantiate(prefab);
                parent&&(dialog.parent = parent);
                resolve(dialog);
            });
        })
    };

    public  static loadUrlSprite(url,parent){
        cc.loader.loadRes(url, cc.SpriteFrame, function (err, spriteFrame) {
            let sprite = parent.addComponent(cc.Sprite);
            sprite.spriteFrame = spriteFrame;
        });
    }


    //判断数据类型
    public static judgeDataType(data){
        let type = typeof data;
        if(type != "object"){
            return type
        }else{
            if(!data){
                return null;
            }
            if(data.constructor == Array ){
                return "array"
            }else{
                return "object"
            }
        }
    }
    //判断对象类型




    /** 游戏内数据相关公共方法 */
    /**
     * 计算综合能力,eg:Utils.getKPI(data.data[1].Period)
     * @param teamList，球员列表,数据格式为四节整容中的Period
     * @return KPI
     * */
    public static getKPI(teamList:Array<Array<Object>>):Number{
        if(ManagerData.getInstance().KPI){
            return ManagerData.getInstance().KPI;
        }
        //
        let kp:number = 0;
        for(let i in teamList){
            kp += calulateKP(teamList[i], parseInt(i));
        }
        return Math.floor(kp/4);
        
        let info:Object;
        function calulateKP(list:Array<Object>, section:number):number{
            let tempKP:number = 0;
            let pid:string;
            for(let i=0; i<list.length; i++){
                pid = list[i]?list[i]['Pid']:""
                info = ItemData.getInstance().getItemInfo(pid);
                if(info){
                    tempKP += (info['Kp'] * Utility.getStamina(pid, teamList, section)/100)
                }
            }
            return tempKP;
        }
    }

    /**
     * 体力计算公式，复杂
     * @param pid 球员PID
     * @param teamList 球员阵型列表
     * @section 节数
     * @return 体力值
     * */
    public static getStamina(pid:string, teamList:Object,  section:number):number{
        let s:number;
        let pInfo:Object = ItemData.getInstance().getItemInfo(pid);
        let section0:boolean
        let section1:boolean;
        let section2:boolean;
        switch(section){
            case 0:
                s = 100;
                break;
            case 1:
                if(checkPid(pid, teamList[0])){
                    s = 100 - 30 + 0.012 * pInfo['Stamina'];
                }else{
                    s = 100;
                }
                break;
            case 2:
                section0 = checkPid(pid, teamList[0]);
                section1 = checkPid(pid, teamList[1]);
                if(!section0 && !section1){//新加入球员
                    s = 100;
                }else if(section0 && !section1){//第一节加入，第二节休息
                    s = 100 - 30 + 0.012 * pInfo['Stamina']//第一节剩余体力
                    s += (100-s)* 0.4;//第二节休息体力恢复
                }else if(!section0 && section1){//第一节休息，第二节加入
                    s = 100 - 30 + 0.012 * pInfo['Stamina'];
                }else{//连上3场
                    s = 100 - (30 - 0.012 * pInfo['Stamina'])*2;
                }
                break;
            case 3:
                section0 = checkPid(pid, teamList[0]);
                section1 = checkPid(pid, teamList[1]);
                section2 = checkPid(pid, teamList[2]);
                //穷举
                if(!section0 && !section1 && !section2){//新上场
                    s = 100;
                }else if(!section0 && section1 && !section2){//第二节上场
                    s = 100 - 30 + 0.012 * pInfo['Stamina']//第二节剩余体力
                    s += (100-s)* 0.4;//第三节休息体力恢复
                }else if(!section0 && section1 && section2){//第二三节上场，即连上3长
                    s = 100 - (30 - 0.012 * pInfo['Stamina'])*2;
                }else if(!section0 && !section1 && section2){//只第三节上场
                    s = 100 - 30 + 0.012 * pInfo['Stamina'];
                }else if(section0 && section1 && section2){//连上四场,最低值
                    s = 40;
                }else if(section0 && !section1 && section2){//第一三节上场
                    s = 100 - 30 + 0.012 * pInfo['Stamina']//第一节剩余体力
                    s += (100-s)* 0.4;//第二节休息体力恢复
                    s -= 30 + 0.012 * pInfo['Stamina']//第三节剩余体力
                }else if(section0 && !section1 && !section2){//第一节上场
                    s = 100 - 30 + 0.012 * pInfo['Stamina']//第一节剩余体力
                    s += (100-s)* 0.4;//第二节
                    s += (100-s)* 0.4;//第三节
                }else if(section0 && section1 && !section2){//第一二节上场
                    s = 100 - (30 - 0.012 * pInfo['Stamina'])*2//第一,二节剩余体力
                    s += (100-s)* 0.4;//第三节回复体力
                }
                break;
        }
        return Math.max(s, 40);
        
        /**检测是否在某个列表中*/
        function checkPid(pid:String, list:Array<Object>):boolean{
            let playerInfo:Object;
            for(let i=0; i<list.length; i++){
                playerInfo = list[i];
                if(playerInfo && playerInfo['Pid'] == pid){
                    return true;
                }
            }
            return false;
        }
    }

    public static checkMVP(tid:string){
        let list = ManagerData.getInstance().Period;
        for(let i = 0;i<list.length;i++){
            for(let j = 0;j<list[i].length;j++){
                if(list[i][j].Tid == tid){
                    return true;
                }
            }
        }
        return false;
    }
}
