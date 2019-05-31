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

import ItemData from './data/ItemData'
import MainControllor from './controllor/MainControllor';
import ManagerLvData from './data/ManagerLvData';
import ErrMsg from './data/ErrMsg';
import CountSkillType from './data/CountSkillType';

function urlParse(){
    var params = {};
    if(window.location == null){
        return params;
    }
    var name,value; 
    var str=window.location.href; //取得整个地址栏
    var num=str.indexOf("?") 
    str=str.substr(num+1); //取得所有参数   stringvar.substr(start [, length ]

    var arr=str.split("&"); //各个参数放到数组里
    for(var i=0;i < arr.length;i++){ 
        num=arr[i].indexOf("="); 
        if(num>0){ 
            name=arr[i].substring(0,num);
            value=arr[i].substr(num+1);
            params[name]=value;
        } 
    }
    return params;
}

@ccclass
export default class app extends cc.Component {

    // LIFE-CYCLE CALLBACKS:
    //@property(MainControllor)
    private mainControllor: MainControllor = null;

    onLoad () {
        cc.game.addPersistRootNode(this.node);
    }

    start () {
        this.mainControllor = new MainControllor();
    }

    update (dt) {
        this.mainControllor.update(dt);
    }
}
