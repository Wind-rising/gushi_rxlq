const {ccclass, property} = cc._decorator;

import Singleton from '../utils/Singleton';
import ManagerData from './ManagerData';
import HttpManager from '../utils/HttpManager';
import URLConfig from '../config/URLConfig';
import PlayerData from './PlayerData'


import CommandVo from './CommandVo'
@ccclass
export default class Package extends Singleton {
    private _data;
    private _newData:Array<any>;

    public async init():Promise<Object>{
        let args:Array<Object> = new Array();
        args.push({
            "n":URLConfig.ManagerItem,
            "i":{
                Mid:"",
            }
        })
        let vo:CommandVo = new CommandVo(URLConfig.Get_Data,args)
        let data = await HttpManager.getInstance().request(vo,null,this);
        this._data = data.data;
        console.log(this._data,"resresresresresresres")
        return this._data;
    }
    public getPackageData(){
        let res = this.init();
        console.log(res,"res");
    }
}