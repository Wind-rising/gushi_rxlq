const {ccclass, property} = cc._decorator;

import Singleton from '../utils/Singleton';
import ManagerData from './ManagerData';
import HttpManager from '../utils/HttpManager';
import URLConfig from '../config/URLConfig';
import ItemData from './ItemData'


import CommandVo from './CommandVo'
@ccclass
export default class PlayerListData extends Singleton {
    private _data;
    private _newData:Array<any>;

    public async init():Promise<Object>{
        let playerList:Array<Object> = ManagerData.getInstance().Project;
        let args:Array<Object> = new Array();
        for(let i = 0;i<playerList.length;i++){
            args.push({
                "n":URLConfig.ManagerPlayer,
                "i":{
                    Mid:"",
                    Tid:playerList[i]['Tid']
                }
            })
        }
        let vo:CommandVo = new CommandVo(URLConfig.Get_Data,args)
        let data = await HttpManager.getInstance().request(vo,null,this);
        this._data = [];
        for(let i = 0;i<10;i++){
            for(let j = 0;j<data['data'].length;j++){
                this._data.push(data['data'][j])
            }
        }
        return this._data;
    }
    public async getPlayListData(index,num){
        if(!this._data){
            await this.init();
        }
        let originalData = this._data.slice(num*index,num*(index+1));
        for(let i = 0;i<originalData.length;i++){
            if(!originalData[i].srcData){
                originalData[i].srcData = ItemData.getInstance().getPlayerInfo(originalData[i].Pid);
            }
        }
        return originalData;
    }
    public async getDataLength(){
        if(!this._data){
            await this.init();
        }
        return this._data.length;
    }
}