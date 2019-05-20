import HttpManager from "../../utils/HttpManager";
import ManagerData from "../../data/ManagerData";
import Utils from "../../utils/Utils";
import Events from "../../signal/Events";
import ManagerLvData from "../../data/ManagerLvData";
import ErrMsg from "../../data/ErrMsg";

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
export default class LoginScene extends cc.Component {

    @property(cc.ProgressBar)
    bar_current: cc.ProgressBar = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.bar_current = this.node.getChildByName("bar_current").getComponent(cc.ProgressBar);
        this.bar_current.progress = 0;
    }

    start () {

        cc.loader.loadRes('data/JsonList',(err, data)=>{
            if(!err){
                let urls = [];
                for(let i = 0;i<data.json.length;i++){
                    urls.push('data/'+data.json[i].split('.')[0]);
                }
                //加载资源，显示进度条
                cc.loader.loadResArray(urls,(completedCount, totalCount, item)=>{
                    this.bar_current.progress = Math.ceil(completedCount/totalCount);
                }, (error, resource)=>{
                    if(!error){
                        let len = resource.length;
                        for(let i = 0;i<len;i++){
                            if(resource[i].json){
                                Events.getInstance().dispatch('EventJsonDataLoaded',[resource[i].name,resource[i].json]);
                            }
                        }
                        //加载完配置表，开始登录
                        this.startLogin();
                    }else{
                        Utils.alert('配置文件加载失败,请重试！',this.start,{title:'提示',showCancel:false});
                    }
                });
            }
        });
    };

    /**
     * 登录游戏，需要走sdk登录流程
     */
    startLogin(){

        HttpManager.getInstance().request({uname:"test",s:"14"},function(response){
            if(response.res){
                ManagerData.getInstance().refresh();
            }else{
                Utils.alert('登录失败！ errorcode = ' + response.code,null,{showCancel:false});
            }
        },this,'GET','login');
    };

    // update (dt) {}
}
