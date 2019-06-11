/**
 * http请求管理
 */
const {ccclass, property} = cc._decorator;
import AppConfig from "../config/AppConfig";
import Utility from "../utils/Utility";
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
    private srvArgs;
    private action;
    /**
     * 
     * @param srvArgs 请求参数  JSON || String
     * @param callback 回调
     * @param context 回调this指针
     * @param method GET || POST
     * @param action 调用服务器接口
     */
    public request(srvArgs,callback?:Function,context?:Object,method:string='GET',action:string='interface'){//(url,method,obj,callback){
        this.srvArgs = srvArgs;
        this.action = action;
        /** 公共参数，所有协议都需要带的部分 */
        let headObj = {
            //"Content-Type":"application/json;charset=utf-8"
        };

        let url = this.requestUrl(srvArgs,action);
        /**
         * 发送请求
         */
        let data = this.sendRequest(url,callback,context,'',method,headObj);
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



    public sendRequest (url:string
        , callback?:Function
        , context?:Object
        , responseType:XMLHttpRequestResponseType =''
        ,method:string = 'GET'
        , headObj:Object = {})
    {
            Utility.showLoading();
            var xhr = cc.loader.getXMLHttpRequest();
            /*
             "arraybuffer",
            * "blob",
            * "document",
            * "json", and
            * "text".
            */
            xhr.responseType = responseType;
            //请求进度
            // xhr.onprogress = function(ev){
            //     cc.log('loaded/total = '+ev.loaded+'/'+ev.total)
            // }
            /** 加载完成 */
            let _this = this;
            xhr.onreadystatechange = function(){
                if (this.readyState == 4){
                    Utility.hideLoading();
                    if(this.status >= 200 && this.status < 400){
                        let response;
                        switch(this.responseType){
                            case 'arraybuffer':
                                response = this.response;
                                break;
                            case "json":
                                response = this.response;
                                break;
                            default:
                                try{
                                    response = JSON.parse(this.responseText);
                                }catch (error){
                                    Utility.alert('返回数据格式错误，this.responseText = ' + this.responseText);
                                }
                                break;
    
                        }
                        
                        if(callback){
                            if(context){
                                callback.apply(context, [response]);
                            }else{
                                callback(response);
                            }
                        }else{
                        }
                    }else{
                        //http请求出错
                        Utility.showConfirm('服务器未响应，请重试',function(){
                            //重试
                            HttpManager.getInstance().sendRequest(url,callback,context,responseType,method,headObj)
                        },{
                            onCancel:function(){
                                if(callback){
                                    if(context){
                                        callback.apply(context, [{res:false,status:this.status}]);
                                    }else{
                                        callback({res:false,status:this.status});
                                    }
                                }
                            }
                        });
                    }
                };
                xhr.timeout = 60000;
                // var param = Object.assign({}, srvArgs);
                // delete param.name;
                // let url = _this.requestUrl(_this.srvArgs,_this.action);
                
                // cc.log('request url = ' + url);
                // xhr.open(method, url, true);
                // for(let key in headObj){
                //     xhr.setRequestHeader(key,headObj[key]);
                // }
            };
            xhr.timeout = 5000;
            // var param = Object.assign({}, srvArgs);
            // delete param.name;
    
            cc.log('request url = ' + url);
    
            xhr.open(method, url, true);
            for(let key in headObj){
                xhr.setRequestHeader(key,headObj[key]);
            }
            //发送请求
            // xhr.send(JSON.stringify(param));
            xhr.send();
           
    }
}
