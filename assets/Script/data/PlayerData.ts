import Singleton from '../utils/Singleton';
import Events from '../signal/Events';


const {ccclass, property} = cc._decorator;
@ccclass
export default class PlayerListData extends Singleton{
    private _data:Object;
    private URL:string = "Dic_player_chs";

    constructor(){
        super();
        this.init();
    }
    public init():void{
        Events.getInstance().addListener('EventJsonDataLoaded',function(name,data){
            if(name == this.URL){
                this._data = data;
            }
        },this);
    }
    public getPlayerInfo(pid:string){
        return this._data[pid];
    }
}

PlayerListData.getInstance();
