
/**
 * 常规赛数据包
 */
const {ccclass, property} = cc._decorator;
import Singleton from "../Utils/Singleton";
import Utility from "../utils/Utility";
import Events from "../signal/Events";
@ccclass
export default class RegularSeasonData extends Singleton {

    /**赛季数据*/
    private _data:Array<Object>;
    /**队伍数据*/
    private _teamData:Object;
    /**阵型数据*/
    private _solutionData:Object;
    /**数据地址*/
    private SEASON_URL:String = "Dic_regularseason_chs";
    /**队伍地址*/
    private TEAM_URL:String = "Dic_regular_team_chs";
    /**阵型地址*/
    private SOLUTION_URL:String = "Dic_regularteamsolution_chs";
    //最大关卡数
    public MAX_RID:number = 240;

    constructor(){
        super();
        this.init();
    }
    public init():void{
        Events.getInstance().addListener('EventJsonDataLoaded',function(name,data){
            if(name == this.SEASON_URL){
                this._data = [];
                for(let key in data){
					this._data.push(data[key]);
				}
            }else if(name == this.TEAM_URL){
                this._teamData = new Object();
				for(let i in data){
					if(!this._teamData[data[i]['Group']]){
						this._teamData[data[i]['Group']] = new Array();
					}
					this._teamData[data[i]['Group']].push(data[i])
				}
            }else if(name == this.SOLUTION_URL){
                this._solutionData = data;
            }
        },this);
    }
    
    /**获取赛季列表*/
    public getSeasonList():Array<Object>{
        return this._data
    }
    
    /**
     * 获取赛季数据 如获取第一赛季列表RegularSeasonData.getRegularMatchList(1)
     * @param sid 如1
     * */
    public getRegularMatchList(sid:number):Array<Object>{
        let arr:Array<Object> = new Array<Object>();
        let src:Array<Object> = this._teamData[sid];
        if(src){
            for(let i:number=0; i<src.length; i++){
                arr[i] = src[i];
            }
        }else{
            Utility.fadeErrorInfo("获取赛季数据错误");
        }
        return arr;
    }
    /**
     * 获取球队信息
     * @param Rid
     * */
    public getTeamInfo(Rid:string):Object{
        return this._solutionData[Rid];
    }
}

RegularSeasonData.getInstance();