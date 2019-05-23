import Events from "../../signal/Events";
import AppConfig from "../../config/AppConfig";
import MatchControllor from "../../controllor/MatchControllor";
import MatchType from "../../data/type/MatchType";

/**
 * 主场景逻辑处理函数
 */
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        Events.getInstance().dispatch(AppConfig.SYS_INIT);
    }

    // update (dt) {}

    /**
     * 进入比赛测试
     */
    testEnterMatch () {
        MatchControllor.getInstance().startMatch(MatchType.NORMAL_MATCH, '-1');
    }
}
