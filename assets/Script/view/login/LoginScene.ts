/**
 * 登录场景主逻辑
 */
const {ccclass, property} = cc._decorator;
import ManagerData from "../../data/ManagerData";
import Events from "../../signal/Events";
import HttpManager from "../../utils/HttpManager";
import Utility from "../../utils/Utility";
import AppConfig from "../../config/AppConfig";
import SelectedServer from "./SelectedServer";
import MainControllor from "../../controllor/MainControllor";
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
        MainControllor.getInstance().userName = this.edt_account.string;
        this.node.getChildByName('lay_server_list').active = true;

        this.node.getChildByName('login_view').active = false;
    };

    // update (dt) {}
}
