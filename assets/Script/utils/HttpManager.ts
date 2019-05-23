import Utils from "./Utils";
import AppConfig from "../config/AppConfig";

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
export default class HttpManager extends cc.Component {

    public static jsonErrorMessage:string = 'json 解析错误：';
    public static ioErrorMessage:string = '网络io错误，请检查网络连接!';
    public static securityErrorMessage:string = '安全问题，请检查crossdomain.xml';

    /**IO错误码*/
    public static IO_ERR_CODE:string = "-1000";
    /**安全错误嘛*/
    public static SECURITY_ERR_CODE:string = "-1001"
    /**JSON错误码*/
    public static JSON_ERR_CODE:string  ="-1002"


    private static _instance:HttpManager = null;

    public static getInstance(){

        return HttpManager._instance;
    }

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        HttpManager._instance = this;
    }

    start () {
    }

    
    // update (dt) {}

    /**
     * 
     * @param srvArgs 请求参数  JSON || String
     * @param callback 回调
     * @param context 回调this指针
     * @param method GET || POST
     * @param action 调用服务器接口
     */
    public request(srvArgs,callback,context:Object,method:string='GET',action:string='interface'){//(url,method,obj,callback){
        /** 公共参数，所有协议都需要带的部分 */
        let headObj = {
            //"Content-Type":"application/json;charset=utf-8"
        };

        var xhr = cc.loader.getXMLHttpRequest();
        xhr.onreadystatechange = function(){
            if (this.readyState == 4){
                //events.dispatch(EventConst.EVENT_HIDE_LOADING);
                if(this.status >= 200 && this.status < 400){
                    //cc.log('this.responseText = ' + this.responseText);
                    let response;
                    try{
                        response = JSON.parse(this.responseText);
                    }catch (error){
                        Utils.alert('返回数据格式错误',function(){
                            //that.requestList.unshift(requestObj);是否需要重试
                        });
                    }
                    if(callback){
                        //callback(response);
                        callback.apply(context, [response]);
                    }
                }else{
                    //错误处理  何时重置状态
                    Utils.alert('服务器未响应，请重试',function(){
                        //如果重试次数过多 怎么处理
                        //重试的部分插入到开头部分
                        //that.requestList.unshift(requestObj);
                    });
                }
            }
        };
        xhr.timeout = 5000;
        // var param = Object.assign({}, srvArgs);
        // delete param.name;
        let url = this.requestUrl(srvArgs,action);
        
        cc.log('request url = ' + url);
        xhr.open(method, url, true);
        for(let key in headObj){
            xhr.setRequestHeader(key,headObj[key]);
        }
        //发送请求
        // xhr.send(JSON.stringify(param));
        xhr.send();
    };

    /**
     *根据参数拼出完整url 
    * @param paraObj
    */		
    private requestUrl(paraObj:Object,action:string):string
    {
        var rd = Math.random().toString()
        var qs = "d=" + JSON.stringify(paraObj) + "&snsinfo=" + escape(AppConfig.snsInfo)+"&rd=" + rd + "&DEBUGBYIP="+AppConfig.isDebug 
        return AppConfig.httpRoot + action + '.php?' +qs
    };
}
