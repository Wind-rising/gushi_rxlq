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
import Utils from "../utils/Utils";
import Events from "../signal/Events";
import EventConst from "../data/EventConst";
import Trancelate from "../utils/Trancelate";
import LoadingFullScreen from "../view/public/LoadingFullScreen";
import ItemData from "../data/ItemData";
import CountPlayerType from "../data/CountPlayerType";
@ccclass
export default class CountController extends Singleton {
    /**
     * 加载进度
     */
    loadingProgress:number = 0;
    /**
     * 资源缓存
     */
    resourceMap:Object;

    /**
     * 战斗数据 暂时保存就可以了
     */
    _data:Object = null;

    /**
     * 初始化比赛 在CompetitionView页面显示的时候被调用
     */
    init(){}

    /**----------------------------------------------------*/
    /** 比赛数据获取 */
    get data ():Object {
        return this._data;
    }
    /** ---------------------------------------------------- */

    /**
     * 开始播放比赛记录
     */
    public showReplay(matchId:string,matchType:string){
        //加载进度设置为0 先开始加载比赛数据
        this.loadingProgress = 0;
        this.getCompetionData(matchId,matchType);
    }
    /**
     * 加载球场数据
     */
    public getCompetionData(matchId:string,matchType:string):void
    {
        this._data = null;
        //HttpManager.getInstance().sendRequest(CountController.getMatchURL(matchType,matchId),this.binaryGameDataHandler,this,'arraybuffer');
        
        //测试加载
        let url = cc.url.raw('resources/test/match_unzip.bin')
        cc.loader.load({ url: url, type: "binary", }, function (err, data) {
            //  let jsonData = Trancelate.getInstance().ConverData(data);
            //战斗数据
            //cc.log(JSON.stringify(jsonData));
            CountController.getInstance().binaryGameDataHandler(data)
        });

    }

    /**静态方法，获取比赛录像地址*/
    public static getMatchURL(matchType: string, matchId: string): string{
        //http://dev.lanqiu.the9.com/test/match.php?matchid=20130805520898cb7e46c7d35700000e&matchtype=1
        return AppConfig.httpRoot+"match.php?matchid="+matchId+"&matchtype="+matchType
    }

    /**
     * 解析数据
     */
    private binaryGameDataHandler(data):void
    {	
        /** 模拟加载进度，加载完战报，模拟完成20% */
        this.loadingProgress = 20;
        //将数据解析成json格式
        this._data = Trancelate.getInstance().ConverData(data);
        
        this.loadRes(this._data);
    }

    /**
     * 预加载资源
     */
    public loadRes(matchData:Object){
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
        matchData['mapId'] = 1;//暂时只用一张图片替代下
        resArray.push(UIConfig.countMap + matchData['mapId'] + ".jpg");
        /** 比赛结束页面 */
        resArray.push(UIConfig.countEnd);
        /** 比赛场景 */
        resArray.push(UIConfig.CompetitionView);
        /** 球 */
        resArray.push(UIConfig.countBall);
        /** 球员 */
        resArray.push(UIConfig.countPlayer);
        /** 动画资源 */

        var competitionViewName = UIConfig.getAssetName(UIConfig.CompetitionView);
        cc.loader.loadResArray(resArray,(completedCount, totalCount, item) => {
            this.loadingProgress = 20+80*completedCount/totalCount;
        }, ((error, resource) => {
            //TODO: 是否需要把加载的资源保存下来，用的时候能更方便点
            LoadingFullScreen.fadeOut();
            this.resourceMap = {};
            //将加载的资源保存下来
            for(let i = 0;i < resource.length;i++){
                this.resourceMap[resource[i].name] = resource[i];
            }
            /** 如果比赛界面加载成功，显示出来，否则 需要将加载的资源缓存清掉 */
            if(this.resourceMap[competitionViewName]){
                var dialog = cc.instantiate(this.resourceMap[competitionViewName]);
                dialog.position = cc.Vec2.ZERO;
                dialog.parent = cc.director.getScene();
            }else{
                this.resourceMap = null;
            }
        }));
    }

    /** 根据名字获取预加载的prefab实例 */
    getPrefabInstance(url:string):any{
        let prefabName = UIConfig.getAssetName(url);
        if(!this.resourceMap || !this.resourceMap[prefabName]){
            cc.error('Can not find prefab url = ' + url);
            return null;
        }
        return this.resourceMap[prefabName];
    }
}
