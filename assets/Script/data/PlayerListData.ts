const {ccclass, property} = cc._decorator;

import Singleton from '../utils/Singleton';
import ManagerData from './ManagerData';
import HttpManager from '../utils/HttpManager';
import URLConfig from '../config/URLConfig';
import PlayerData from './PlayerData'


import CommandVo from './CommandVo'
@ccclass
export default class PlayerListData extends Singleton {
    private _data;
    private _newData:Array<any>;

    public async initPlayList():Promise<Object>{
        let playerList:Array<Object> = ManagerData.getInstance().Project;
        let args:Array<Object> = new Array();
        for(let i = 0;i<playerList.length;i++){
            args.push({
                "n":URLConfig.ManagerPlayer,
                "i":{
                    Mid:"",
                    Tid:playerList[i].Tid
                }
            })
        }
        let vo:CommandVo = new CommandVo(URLConfig.Get_Data,args)

        let data = await HttpManager.getInstance().request(vo,null,this);
        console.log(data)
        this._data = data.data;
        return this._data;
    }
    public getPlayListData(num,index){
        let originalData = this._data.slice(num*index,num*(index+1));
        for(let i = 0;i<originalData.length;i++){
            if(!originalData[i].srcData){
                originalData[i].srcData = PlayerData.getInstance().getPlayerInfo(originalData[i].Pid);
            }
        }
        return originalData;
    }
}