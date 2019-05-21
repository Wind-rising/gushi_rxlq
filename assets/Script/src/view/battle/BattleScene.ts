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

import Trancelate from "../../utils/Trancelate";
import Utils from "../../utils/Utils";
import Events from "../../signal/Events";
import ManagerLvData from "../../data/ManagerLvData";
import ErrMsg from "../../data/ErrMsg";
import ItemData from "../../data/ItemData";

@ccclass
export default class NewClass extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

        /** 测试，为了能正常进入游戏加载配置表 */
        ManagerLvData.getInstance().init();
        ErrMsg.getInstance().init();
        ItemData.init();
        cc.loader.loadRes('data/JsonList',(err, data)=>{
            if(!err){
                let urls = [];
                for(let i = 0;i<data.json.length;i++){
                    urls.push('data/'+data.json[i].split('.')[0]);
                }
                //加载资源，显示进度条
                cc.loader.loadResArray(urls,(completedCount, totalCount, item)=>{
                }, (error, resource)=>{
                    if(!error){
                        let len = resource.length;
                        for(let i = 0;i<len;i++){
                            if(resource[i].json){
                                Events.getInstance().dispatch('EventJsonDataLoaded',[resource[i].name,resource[i].json]);
                            }
                        }
                    }else{
                        Utils.alert('配置文件加载失败,请重试！',this.start,{title:'提示',showCancel:false});
                    }
                });
            }
        });
    }

    start () {

    };

    // update (dt) {}

    buttonTest(){
        //var url = cc.url.raw("resources/test/battledata.bin");
        var url = cc.url.raw('resources/test/match_unzip.bin')
        cc.loader.load({ url: url, type: "binary", }, function (err, data) {
            var jsonData = Trancelate.getInstance().ConverData(data);
            // //战斗数据
            cc.log(JSON.stringify(jsonData));
        });
    }

    btnTest1(){
        cc.director.loadScene('MainScene');
    }
}
