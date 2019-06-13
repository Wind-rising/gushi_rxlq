import ManagerData from "../../data/ManagerData";
import Events from "../../signal/Events";
import HttpManager from "../../utils/HttpManager";
import Utility from "../../utils/Utility";
import AppConfig from "../../config/AppConfig";

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

    @property(cc.EditBox)
    edt_account: cc.EditBox = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.bar_current = this.node.getChildByName("bar_current").getComponent(cc.ProgressBar);
        this.bar_current.progress = 0;

        this.node.getChildByName('login_view').active = false;
        this.node.getChildByName('lay_server_list').active = false;

        /** 测试账号 */
        this.edt_account.string = 'test';
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
                        //this.startLogin();
                        this.node.getChildByName('login_view').active = true;
                    }else{
                        Utility.alert('配置文件加载失败,请重试！',this.start,{title:'提示',showCancel:false});
                    }
                });
            }
        });
    };

    /**
     * 登录游戏，需要走sdk登录流程
     */
    startLogin(){
        if(!this.edt_account.string || this.edt_account.string.length<=0){
            Utility.fadeErrorInfo('请输入账号，比如 test')
            return;
        }
        HttpManager.getInstance().request({uname:this.edt_account.string,s:"14"},function(response){
            if(response.res){
                cc.log('登录信息返回'+response);
                AppConfig.snsInfo = response['data']['snsinfo'];

                this.node.getChildByName('login_view').active = false;
                // 显示服务器列表
                this.node.getChildByName('lay_server_list').active = true;
            }else{
                Utility.alert('登录失败！ errorcode = ' + response.code,null,{showCancel:false});
            }
        },this,'GET','login');
    };

    // update (dt) {}
}
