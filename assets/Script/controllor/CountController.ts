/**
 * 
 * 比赛控制类
 * 功能部分移到BattleScene.ts里面去，否则太麻烦了
 * 
 */
const {ccclass, property} = cc._decorator;
import Singleton from "../Utils/Singleton";
import HttpManager from "../utils/HttpManager";
import MatchConfig from "../config/MatchConfig";
import AppConfig from "../config/AppConfig";
import UIConfig from "../config/UIConfig";
@ccclass
export default class CountController extends Singleton {
    /**
     * 战斗数据 暂时保存就可以了
     */
    _data:Object = null;

    /**
     * 加载球场数据
     */
    public getData(callback:Function,context:Object):void
    {
        this._data = null;
        // _loader = new URLLoader();
        // _loader.dataFormat = URLLoaderDataFormat.BINARY;
        // _loader.addEventListener(Event.COMPLETE, binaryGameDataHandler);
        // _loader.addEventListener(IOErrorEvent.IO_ERROR, gameDataError);
        
        //trace(MatchConfig.MatchId)
        //MatchConfig.MatchId = AppConfig.imgRoot + "assets/chs/match/data.bin";
        //http://s14.app1101073807.qqopenapp.com/pengyou/match.php?(体验服)
        //MatchConfig.MatchId = "http://s24.app1101073807.qqopenapp.com/pengyou/match.php?matchid=2014040953453a157260e0f03f00038a&matchtype=1";
        //MatchConfig.MatchId = "http://s30.app1101073807.qqopenapp.com/pengyou/match.php?matchid=20140429535fa4a57260e0425000050e&matchtype=7";
        //MatchConfig.MatchId = "http://dev.lanqiu.the9.com/test/match.php?matchid=20140614539c38aa7e46c79b1100006c&matchtype=1";
        // trace("MatchConfig.MatchId = "+MatchConfig.MatchId);
        // _loader.load(new URLRequest(MatchConfig.MatchId));
        
        //HttpManager.getInstance().request(this.getMatchURL(1,20130805520898cb7e46c7d35700000e),this.binaryGameDataHandler,this,'GET','match');
        
        //测试加载
        let url = cc.url.raw('resources/test/match_unzip.bin')
        cc.loader.load({ url: url, type: "binary", }, function (err, data) {
            //  let jsonData = Trancelate.getInstance().ConverData(data);
            // //战斗数据
            //cc.log(JSON.stringify(jsonData));
            callback.apply(context,[data]);
        });

    }

    /**
     * 预加载资源
     */
    public loadRes(matchData:Object,callback:Function,context:Object){
        /** 需要加载的资源 */
        let resArray = [];

        if(matchData['mapId'] <= 0 ||matchData['mapId'] > 30)
        {
            matchData['mapId'] = 23;
        }
        
        if(matchData['matchType']>= 4 && matchData['matchType'] <= 8)
        {
            matchData['mapId'] = parseInt(matchData['homeLogo']);
            
            if(matchData['mapId'] == 44)
            {
                matchData['mapId'] = 29;
            }
        }
        
        if(matchData['matchType'] == 2)
        {
            matchData['mapId'] = 100;
        }
        /** 比赛地图 */
        resArray.push(UIConfig.countMap + matchData['mapId'] + ".jpg");

        // 页面全部挂在场景下面，只需要加载场景就好了
        /** 比赛结束页面 */
        resArray.push(UIConfig.countEnd);
        /** 动画 */
    }
}
