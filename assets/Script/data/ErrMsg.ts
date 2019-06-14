import Events from "../signal/Events";
import HttpManager from "../utils/HttpManager";
import Singleton from "../Utils/Singleton";

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
export default class ErrMsg extends Singleton{

    _data:Object = null;

    private URL:string = "Dic_dic_code_chs";

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    constructor(){
        super();
        this.init();
    }

    public init(){
        Events.getInstance().addListener('EventJsonDataLoaded',function(name,data){
            if(name == this.URL){
                this._data = {};
                for(let i in data){
                    let arr1 = i.split(',');
                    let arr2;
                    let arr3;
                    for(let j in data[i]){
                        arr2 = j.split(',');
                        arr3 = data[i][j].split(',');
                    }
                    this._data[arr1[0]] = {};
                    for(let j = 0;j<arr2.length;j++){
                        this._data[arr1[0]][arr2[j]] = arr3[j];
                    }
                }
            }
        },this);
    }
    /**获取错误信息*/
    public getErr(errorCode:string):string{
        cc.log("errorCode = "+errorCode);
        switch(errorCode){
            case HttpManager.IO_ERR_CODE:
                return HttpManager.ioErrorMessage;
            case HttpManager.SECURITY_ERR_CODE:
                return HttpManager.securityErrorMessage;
            case HttpManager.JSON_ERR_CODE:
                return HttpManager.jsonErrorMessage;
        }
        var obj:Object = this._data[errorCode];
        if(obj){
            var msg:string = obj['Msg'];
            msg = msg.replace("${PointName}", "球票")
            //把所有OK干掉
            if(msg == "ok"){
                msg = "";
            }
            else if(errorCode == "9998")
            {
                msg = "9998";
            }
            return msg
        }
        return '未知错误';
    }
    // update (dt) {}
}
ErrMsg.getInstance();
