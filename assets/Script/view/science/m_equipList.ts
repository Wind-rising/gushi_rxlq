
import Utils from "../../utils/Utils";
import ScienceViewData from "./data_ScienceViewData"
import Page_Content from "./m_Page_Content"
import PlayerListData from "../../data/PlayerListData"
import Events from "../../signal/Events"
export default class PlayerList{
    private content:cc.Node;
    private turn:cc.Node;
    public list = [];
    constructor(content:cc.Node,turn:cc.Node){
        this.content = content;
        this.turn = turn;
        this.start()
    }
    
    public start(){
        let obj2;
        let obj = new Page_Content({
            data:PlayerListData.getInstance().getPlayListData(ScienceViewData.playerList_NUM,ScienceViewData.playerList_PAGE),
            url:"Science/ballPlayerItem",
            content:this.content,
            componentName:"BallPlayerItem",
            callBack:()=>{
                obj2 = new Page_Content({
                    url:"Science/packageItem",
                    content:this.content,
                    componentName:"PackageItem",
                });
            }
        })
        this.list = [obj,obj2];
    }
    public addListener(){
        Events.getInstance().addListener("playerListDataRefresh",this.dataRefresh,this)
    }
    public removeListener(){
        Events.getInstance().removeListener("playerListDataRefresh",this.dataRefresh,this)
    }
    public dataRefresh(){
        for(let i = 0;i<this.list.length;i++){
            this.list[i].refresh(PlayerListData.getInstance().getPlayListData(ScienceViewData.playerList_NUM,ScienceViewData.playerList_PAGE));
        }
    }
}