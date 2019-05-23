import Utils from "../../utils/Utils";

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
export default class NewClass extends cc.Component {

    @property(cc.Sprite)
    mapBg:cc.Sprite = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        //需要先预加载，然后再进来直接显示出来
        cc.loader.loadRes('image/map/1',cc.SpriteFrame,(err,spriteFrame)=>{
            if(err){
                Utils.fadeErrorInfo(err.message);
                return;
            }
            this.mapBg.spriteFrame = spriteFrame;
        });
    }

    start () {

    }

    // update (dt) {}
}
