// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

//import Singleton from './Singleton';
import XUtil from './XUtil';
import URLConfig from '../config/URLConfig';
import HttpManager from './HttpManager';
import ManagerData from '../data/ManagerData';
import ItemData from '../data/ItemData';

@ccclass
export default class PlayerUtil {

    static kpiInfo:Object = null;
    static myKpiInfo:object = null;

    constructor(){
    };

    /**
     * 获取大属性值-适用于单个数据包情形
     * */
    public static getBigPro(key:string, data:Object):number{
        var num:number;
        switch(key){
            case "attack":
                num =  (Number(data['JumpShot'])+Number(data['ThreePoints']))/2
                break;
            case "defend":
                num =(Number(data['Rejection'])+Number(data['Steals']))/2
                break;
            case "skill":
                num = (Number(data['Pass'])+Number(data['Dribble']))/2
                break;
            case "strength":
                num = (Number(data['Dunk'])+Number(data['Rebound']))/2
                break;
            case "body":
                num = (Number(data['Speed'])+Number(data['Stamina']))/2
                break;
            default:
                num = Number(data[key]);
                break;
        }
        return num;
    };
		
    /**获取属性字符串*/
    public static getNumStr(num:number):string{
        if(num >=0){
            return "+"+num;
        }
        return num+"";
    }
		
    /**
     * 获取属性差值属性集合
     * */
    public static getMinus(data:Object, data2:Object):Object{
        var obj:Object = XUtil.cloneObject(data);
        for(var i in obj){
            obj[i] -= Number(data2[i]);
        }
        return obj;
    }
		
    /**
     * 生成一个全属性属性合集,包括等级提升，装备
     * */
    public static getTotalProObject(data:Object):Object{
        var totalPro:Object = new Object();
        totalPro['JumpShot'] = 0;
        totalPro['ThreePoints'] = 0;
        totalPro['Rejection'] = 0;
        totalPro['Steals'] = 0;
        totalPro['Pass'] = 0;
        totalPro['Dribble'] = 0;
        totalPro['Dunk'] = 0;
        totalPro['Rebound'] = 0;
        totalPro['Speed'] = 0;
        totalPro['Stamina'] = 0;
        var per:number = this.getLvPro(data['Level']);
        var basicProTotal:Object = this.addObject(data['basicData'], data['PptPy']);
        for(var i in totalPro){
            //基础属性
            if(data['basicData']){
                totalPro[i] += Number(data['basicData'][i]);
            }
            //培养属性
            if(data['PptPy']){
                totalPro[i] += Number(data['PptPy'][i]);
            }
            //装备属性
            if(data['proList']){
                for(var j in data['proList']){
                    totalPro[i] += parseInt(data['proList'][j][i]);
                }
            }
            //等级提升-需要合并培养
            totalPro[i] += Number(basicProTotal[i])*per;
        }
        return totalPro
    }

    /**
     * 计算最总属性公式-静态
     * @param basicV 基础属性
     * @param growV 成长值
     * @param lv 强化等级
     * */
    public static getTotalPro1(basicV:number, growV:number, lv:number):number{
        return basicV+growV*Math.max(0,(lv-1));
    }
		
    /**
     * 获取综合属性
     * @param key，属性名
     * @param data,数据源
     * @type 属性类型 1为所有属性，2为基础属性，
     * */
    public static getTotalPro(key:string, data:Object, type:number=1):number{
        var totalPro:Object = new Object();
        totalPro['JumpShot'] = 0;
        totalPro['ThreePoints'] = 0;
        totalPro['Rejection'] = 0;
        totalPro['Steals'] = 0;
        totalPro['Pass'] = 0;
        totalPro['Dribble'] = 0;
        totalPro['Dunk'] = 0;
        totalPro['Rebound'] = 0;
        totalPro['Speed'] = 0;
        totalPro['Stamina'] = 0;
        for(var i in totalPro){
            //基础属性
            if(data['basicData']){
                totalPro[i] += parseFloat(data['basicData'][i]);
            }
            //培养属性
            if(data['PptPy']){
                totalPro[i] += Number(data['PptPy'][i]);
            }
        }
        return this.getBigPro(key, totalPro);
    }
		
    /***/
    public static getLvPro(lv:number):number{
        var num:number = (lv-1)*0.35;
        /*switch(lv){
            case 1:
                num = 0
                break;
            case 2:
                num =0.02
                break;
            case 3:
                num = 0.03
                break;
            case 4:
                num =0.06
                break;
            case 5:
                num = 0.09
                break;
            case 6:
                num = 0.12
                break;
            case 7:
                num = 0.17
                break;
            case 8:
                num = 0.22
                break;
            case 9:
                num = 0.25;
                break;
        }*/
        return num;
    }
		
    /**生成装备属性数据*/
    public static createProObj(item, playerData:Object):Object{
        var obj:Object = new Object();
        var info:Object = ItemData.getEquipInfo(item.vo.Equip.Type+String(item.vo.Equip.Pair));
        if(info){
            obj[this.getProName(info['Attr_1_Name'])] = this.getTotalPro1(info['Attr_1_Num'], info['Grow'], item.vo.Equip.Lvl);
            obj[this.getProName(info['Attr_2_Name'])] = this.getTotalPro1(info['Attr_2_Num'], info['Grow'], item.vo.Equip.Lvl);
        }
        var holeInfo:Object = item.vo.Equip.Hole;
        var tempPro:Object;
        var holePro:Object = new Object();
        var srcData:Object = playerData ? playerData['basicData'] :new Object();
        for(var i in holeInfo){
            info = ItemData.getHoleInfo(holeInfo[i]);
            if(info){
                tempPro = new Object();
                var proStr:String = info['Desc'];
                var proArr:Array<string> = proStr.split("+");
                var proNameStr:String = this.getProName(proArr[0]);
                if(proNameStr){//需要拆分
                    var proNameArr:Array<string> = proNameStr.split("_");
                    for(var j=0; j<proNameArr.length; j++){
                        if(String(proArr[1]).indexOf("%") != -1){//百分比增长--百分比提升公式：（基础属性*(1+升级）+培养）*装备百分比
                            var totalBasicPro:number = (1+this.getLvPro(playerData['Level']))*srcData[proNameArr[j]]+playerData['PptPy'][proNameArr[j]];
                            tempPro[proNameArr[j]] = Number(totalBasicPro * parseInt(proArr[1])/100)
                            //tempPro[proNameArr[j]] = int(srcData[proNameArr[j]] * parseInt(proArr[1])/100)
                        }else{
                            tempPro[proNameArr[j]] = proArr[1];
                        }
                    }
                }
                //合并属性
                holePro = this.addObject(holePro, tempPro);
            }
        }
        //合并总属性
        obj = this.addObject(holePro, obj);
        return obj;
    }
		
    /**
     * 合并2个属性集 
     * @param obj1 属性集1
     * @param obj2 属性集2
     * */
    public static addObject(obj1:Object, obj2:Object):Object{
        obj1 || (obj1 = new Object());
        obj2 || (obj2 = new Object());
        var result:Object = new Object;
        for(var i in obj1){
            result[i] = Number(obj1[i]);
        }
        for(i in obj2){
            if(result[i]){
                result[i] += parseInt(obj2[i]);
            }else{
                result[i] = parseInt(obj2[i]);
            }
        }
        return result;
    };
		
		
    //
    private static getProName(type:String):string{
        var name:string="";
        switch(type){
            case "中投":
            case "中投属性":
                name = "JumpShot"
                break;
            case "三分":
            case "三分属性":
                name = "ThreePoints"
                break;
            case "封盖":
            case "封盖属性":
                name = "Rejection"
                break;
            case "抢断":
            case "抢断属性":
                name = "Steals"
                break;
            case "传球":
            case "传球属性":
                name = "Pass"
                break;
            case "控球":
            case "控球属性":
                name = "Dribble"
                break;
            case "扣篮":
            case "扣篮属性":
                name = "Dunk"
                break;
            case "篮板":
            case "篮板属性":
                name = "Rebound"
                break;
            case "速度":
            case "速度属性":
                name = "Speed"
                break;
            case "体能":
            case "体能属性":
                name = "Stamina"
                break;
            case "进攻":
            case "进攻属性":
                name = "JumpShot_ThreePoints";
                break;
            case "防守":
            case "防守属性":
                name = "Rejection_Steals"
                break;
            case "技术":
            case "技术属性":
                name = "Pass_Dribble"
                break;
            case "力量":
            case "力量属性":
                name = "Dunk_Rebound"
                break;
            case "身体":
            case "身体属性":
                name = "Speed_Stamina"
                break;
            case "全属性":
                name = "JumpShot_ThreePoints_Rejection_Steals_Pass_Dribble_Dunk_Rebound_Speed_Stamina";
                break;
        }
        return name;
    }
		
    /**获取球员KP*/
    public static getKP(callback:Function, forceUpdate:boolean=true):void{
        if(!forceUpdate && this.kpiInfo){
            if(callback != null){
                callback();
            }
            return;
        }

        let args  = [{n:URLConfig.PlayerKp, i:{}}];
        HttpManager.getInstance().request({args:args,action:URLConfig.Get_Data},onGetKp,this);
        
        function onGetKp(data:Object):void{
            if(data['res']){
                var list = ManagerData.getInstance().Project;
                var storeDic = ManagerData.getInstance().storeDic;
                
                this.kpiInfo = data['data'][0].List;
                this.myKpiInfo = XUtil.cloneObject(this.kpiInfo);
                for(var i=0; i<list.length; i++){
                    list[i]['Kp'] = (this.kpiInfo[list[i]['Tid']]?this.kpiInfo[list[i]['Tid']].Kp:0)
                }
                
                for(var Tid in this.kpiInfo) 
                {
                    storeDic[Tid] = this.kpiInfo[Tid].trusteeship;
                }
                
                
            }
            if(callback != null){
                callback();
            }
        }
    }
		
    /**根据球员TID获取kp值*/
    public static getKPByTid(tid:string):number{
        if(this.kpiInfo){
            return parseInt(this.kpiInfo[tid]?this.kpiInfo[tid].Kp:0);
        }
        return 0;
    }
    
    /**
     * 加入kp值
     * */
    public static addKP(info:Object):void{
        if(this.kpiInfo){
            for(var i in info){
                this.kpiInfo[i] = info[i];
            }
        }
    }
    
    //显示特效
    // public static showEffect(item:DisplayObject):void{
    //     var effect:MovieClip = XFacade.getInstance().getUI("EquipShineEffectUI");
    //     var disc:DisplayObjectContainer = item.parent;
    //     if(disc){
    //         disc.addChild(effect);
    //         effect.x = item.x;
    //         effect.y = item.y;
    //         effect.addEventListener(Event.ENTER_FRAME, onEF);
    //         effect.gotoAndPlay(1);
    //     }
        
    //     function onEF(event:Event):void{
    //         var mc:MovieClip = event.currentTarget as MovieClip;
    //         if(mc.currentFrame == mc.totalFrames){
    //             mc.removeEventListener(Event.ENTER_FRAME, onEF);
    //             if(mc.parent){
    //                 mc.parent.removeChild(mc);
    //             }
    //         }
    //     }
    // }
}
