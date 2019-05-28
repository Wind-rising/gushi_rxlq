

const {ccclass, property} = cc._decorator;
import Utils from "../../utils/Utils";
import CountController from "../../controllor/CountController";
import URLConfig from "../../config/URLConfig";
import UIConfig from "../../config/UIConfig";
import PlayerNode from "./PlayerNode";
import BallNode from "./BallNode";
import PlayerSide from "../../data/type/PlayerSide";
@ccclass
export default class CompetitionMap extends cc.Component {

    /** 背景图 */
    @property(cc.Sprite)
    private mapBg:cc.Sprite = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        //需要先预加载，然后再进来直接显示出来
        cc.loader.loadRes('image/map/map_1',cc.SpriteFrame,(err,spriteFrame)=>{
            if(err){
                Utils.fadeErrorInfo(err.message);
                return;
            }
            this.mapBg.spriteFrame = spriteFrame;
        });
    }

    onDestroy () {

    }

    start () {

    }

    // update (dt) {}
}
