
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

import URLConfig from "../config/URLConfig";
import HttpManager from "./HttpManager";

@ccclass
export default class Utils {
    public static showDialog(name:String,pos?:cc.Vec2,parent?:cc.Node):void {
        cc.loader.loadRes("prefabs/"+name, cc.Prefab, function (error, prefab) {
            if (error) {
                cc.error(error);
                cc.error('未找到 ' + "prefabs/"+name)
                return;
            }
            var dialog = cc.instantiate(prefab);
            dialog.position = pos || {x:cc.winSize.width/2,y:cc.winSize.height/2};
            dialog.parent = parent||cc.director.getScene();
            //处理参数
        });
    };
    /**
     * 此方法不再使用，
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
    public static showConfirm (content:String,onOk?:Function,args:Object = {}){
        //cc.find('alert').getComponent("Alert").confirm(content,onOk,args);
        var alert = cc.find('alert');
        if(alert){
            alert.getComponent("Alert").confirm(content,onOk,args);
        }else{
            cc.loader.loadRes("prefabs/common/alert", cc.Prefab, function (error, prefab) {
                if (error) {
                    cc.error(error);
                    cc.error('未找到 ' + "prefabs/common/alert")
                    return;
                }
                var alert = cc.instantiate(prefab);
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
        var loading = cc.find('loading');
        if(loading){
            loading.getComponent("Loading").show(content);
        }else{
            cc.loader.loadRes("prefabs/common/loading", cc.Prefab, function (error, prefab) {
                if (error) {
                    cc.error(error);
                    cc.error('未找到 ' + "prefabs/common/loading")
                    return;
                }
                var dialog = cc.instantiate(prefab);
                dialog.parent = cc.director.getScene();
                //处理参数
                dialog.getComponent("Loading").show(content);
            });
        }
    };
    public static hideLoading ():void{
        var loading = cc.find('loading');
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
        Utils.fadeInfo(message, location, cc.color(255, 50, 0));
    };

    /** 获取分享信息 */
    public static getFeed():void{
        let srvArgs = {action:URLConfig.Get_Data,
            args:[{n:URLConfig.ManagerFeed, i:{}}]};
        HttpManager.getInstance().request(srvArgs,onGetFeed,this);

        function onGetFeed(data:Object):void{
            if(data['res']){
                var feedInfo:Object= data['data'][0].Last;
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
    /**
     * 点击绑定事件
     * @param [any]target 目标节点
     * @param [string]component 目标组件名
     * @param [string]handler 响应事件函数名
     * @param [string]param 响应式事件携带参数
     */
    public static bindBtnEvent(target:any,component:string = "",handler:string="",param="22"){
        console.log(component,handler)
        let clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = target; //这个 node 节点是你的事件处理代码组件所属的节点，这里就是Button2
        clickEventHandler.component = component;//这个是脚本文件名
        clickEventHandler.handler = handler; //回调函名称
        console.log(clickEventHandler.customEventData,"bbbb")
        param&&(clickEventHandler.customEventData = param); //用户数据
        console.log(clickEventHandler)
        console.log(clickEventHandler.customEventData,"aaaa")
        return clickEventHandler;
    }
}
