import Singleton from "../Utils/Singleton";
import Events from "../signal/Events";
export default class EquipData  extends Singleton 
{
    /**戒指数据*/
    private static  _ringData:Object;
    /**签名钱数据*/
    private static  _signData:Object;
    private static  _callback:Function;
    private static  _args:Object;
    /**戒指URL地址*/
    private static  RING_URL:String = "Dic_ring_chs";
    /**洗练钱URL地址*/
    private static  SIGN_URL:String = "Dic_signcost_chs"
    //初始化
    constructor(){
        super();
        EquipData.init();
    }
    public static  init(callback:Function=null, args = null):void{
        this._ringData = null;
        this._signData = null;
        Events.getInstance().addListener('EventJsonDataLoaded',function(name,data){
            switch(name){
                case EquipData.RING_URL:{
                    this._ringData = data;
                    break;
                }
                case EquipData.SIGN_URL:{
                    this._signData = data;
                    break;
                }
            }
        },this,'ItemDataLoadListener');
    }
    
    //
    private static  onError(event:Event):void{
        
    }
    
    /**获取属性*/
    public static  getRingPro(type:string):Object{
        return this._ringData[type];
    }
    
    /**获取金钱*/
    public static  getSignMoney(color:number):Object{
        return this._signData[color]
    }
}

EquipData.getInstance();