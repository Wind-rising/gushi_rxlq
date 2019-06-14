

/**
 * 选择服务器
 * 服务器列表从cdn中获取 地址为SERVER_CONFIG
 * 
 */

const {ccclass, property} = cc._decorator;

import Utility from "../../utils/Utility";
import ManagerData from "../../data/ManagerData";
import ListViewCtrl from "../control/ListViewCtrl";
import AppConfig from "../../config/AppConfig";
import HttpManager from "../../utils/HttpManager";
import MainControllor from "../../controllor/MainControllor";

@ccclass
export default class SelectedServer extends cc.Component {
    // LIFE-CYCLE CALLBACKS:
    private scr_servers:cc.Node = null;
    private lbl_name:cc.Label = null;
    private lbl_state:cc.Label = null;
    private lbl_desc:cc.Label = null;
    private btn_confirm:cc.Button = null;

    private selectData:Object = null;

    private SERVER_CONFIG = 'http://192.168.2.155:800/rxnba/config/servers.json'
    /**
     * 
     */
    onLoad () {
        this.scr_servers = this.node.getChildByName('scr_servers');
        this.lbl_name = this.node.getChildByName('lbl_name').getComponent(cc.Label);
        this.lbl_state = this.node.getChildByName('lbl_state').getComponent(cc.Label);
        this.lbl_desc = this.node.getChildByName('lbl_desc').getComponent(cc.Label);
        this.btn_confirm = this.node.getChildByName('btn_confirm').getComponent(cc.Button);
        this.node.getChildByName('btn_confirm').getComponent(cc.Button).clickEvents.push(
            Utility.bindBtnEvent(this.node,'SelectedServer','onConfirm')
        );
    }

    start () {
        cc.loader.load(this.SERVER_CONFIG,(err, data)=>{
            if(err){
                Utility.showConfirm('服务器列表获取失败,请重新获取',()=>{
                    this.start();
                },{showCancel:false,title:'错误'});
                return;
            }
            data['servers'].unshift({
                "name":"默认QA服务",
                "state":"正常",
                "desc":"读取代码配置的服务器地址",
                "httpRoot":AppConfig.httpRoot,
                "lang":AppConfig.lang,
                "plant":AppConfig.plant,
                "version":AppConfig.version,
                "serverid":AppConfig.serverid,
                "isDebug":AppConfig.isDebug
            });
            /** 服务器列表 */
            this.scr_servers.off('initCell');
            this.scr_servers.on('initCell',(cell,idx)=>{
                if(data['servers'].length>idx){
                    cell.getChildByName('lbl_name').getComponent(cc.Label).string = data['servers'][idx]['name'];
                    cell.getChildByName('lbl_state').getComponent(cc.Label).string = data['servers'][idx]['state'];
                }
            });
            
            this.scr_servers.on('selectedCell',(cell,idx)=>{
                if(data['servers'].length>idx){
                    this.selectData = data['servers'][idx];
                    this.lbl_name.string = this.selectData['name'];
                    this.lbl_state.string = this.selectData['state'];
                    this.lbl_desc.string = this.selectData['desc'];
                }
            });
            
            this.scr_servers.getComponent(ListViewCtrl).addItem(data['servers'].length);
            this.scr_servers.getComponent(ListViewCtrl).onCellSelected(0);//默认选中第0个
        });
    }

    /**
     * 确认选择服务器
     * @param e 
     */
    onConfirm(e:cc.Event){
        if(!this.selectData){
            Utility.fadeErrorInfo('请选择服务器列表');
            return;
        }
        AppConfig.httpRoot = this.selectData['httpRoot'];
        AppConfig.lang = this.selectData['lang'];
        AppConfig.plant = this.selectData['plant'];
        AppConfig.version = this.selectData['version'];
        AppConfig.serverid = this.selectData['serverid'];
        AppConfig.isDebug = this.selectData['isDebug'];

        
        this.startLogin();
    }

    startLogin () {
        HttpManager.getInstance().request({uname:MainControllor.getInstance().userName,s:"14"},function(response){
            if(response.res){
                cc.log('登录信息返回'+response);
                this.node.active = false;
                AppConfig.snsInfo = response['data']['snsinfo'];
                ManagerData.getInstance().refresh();
            }else{
                Utility.alert('登录失败！ errorcode = ' + response.code,null,{showCancel:false});
            }
        },this,'GET','login');
    }
}
