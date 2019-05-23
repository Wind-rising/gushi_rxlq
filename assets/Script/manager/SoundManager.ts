import Utils from "../utils/Utils";

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

@ccclass
export default class SoundManager {

    private static channelObj:Object = new Object();
    /**声音池*/
    private static soundMap:Object = new Object();
    /**播放中的列表*/
    private static playingObj:Object = new Object();
    /**锁定列表*/
    private static lockObj:Object = new Object();
    /***/
    private static repeatObj:Object = new Object();
    
    /**停止所有声音*/
    public static stopAll():void
    {
        // for (var i in this.channelObj)
        // {
        //     if(this.channelObj[i]){
        //         this.channelObj[i].stop()
        //         this.channelObj[i].removeEventListener(Event.SOUND_COMPLETE,onSoundComplete)
        //     }
        //     this.playingObj[i] = false
        // }
        
    }
    /**
     * 播放
     * public function play(id:String,v:Number=1,startTime:Number=0,loop:Number=0,lock:Boolean=true):void
     *播放库中的一个ID (已注册过的) 
        *@param id 库中的声音类名-
        *@param v 音量
        *@param startTime 起始时间
        *@param loop 循环次数.0为不循环
        *@param lock 锁定:为true时,该id声音直到上次播放结束才可以继续播放
        * @param delay 播放间隔 
        */
    public static play(id:string, v:Number=1, startTime:Number=0, loop:Number=0, lock:Boolean=true, delay:Number = -1):void
    {
        // if(this.musicOff && delay < 0){
        //     return;
        // }
        // if (!this.playingObj[id] || !this.lockObj[id])
        // {
        //     var sound:Sound =getSound(id);
        //     if(sound){
        //         this.playingObj[id] = true;
        //         this.lockObj[id]=lock
        //         if(delay < 0){
        //             this.channelObj[id] = sound.play(startTime, loop);
        //         }else{
        //             this.channelObj[id] = sound.play(startTime);
        //             this.repeatObj[this.channelObj[id]] = {v:v, loop:loop - 1, delay:delay, lock:lock, startTime:startTime, id:id};
        //         }
        //         if(this.channelObj[id]){
        //             this.channelObj[id].addEventListener(Event.SOUND_COMPLETE,onSoundComplete)
        //         }
        //     }
        // }
        // this.setVolume(id,this.musicOff?0:1)
    }
    
    /***/
    private static onSoundComplete(e:Event):void
    {
        // var channel:SoundChannel=e.target as SoundChannel;
        // channel.removeEventListener(Event.SOUND_COMPLETE,onSoundComplete)
        // if(this.repeatObj[channel]){
        //     var info:Object =  this.repeatObj[channel];
        //     info['loop'] --;
        //     if(info['loop'] > 0){
        //         TimerCommand.registerTimeCommand(play, [info.id, info.v, info.startTime, info.loop, info.lock, info.delay], info.delay, 1);
        //     }
        // }
        // for (var i in this.channelObj)
        // {
        //     if (channel == this.channelObj[i])
        //     {
        //         this.playingObj[i] = false;
        //         this.lockObj[i] = false;
        //         return
        //     }
        // }
    }
    
    /**
     * 暂停
     * @param id
     * @param isPause true/false 暂停/继续
     * */
    public static pause(id:string, isPause:boolean):void
    {
        // if(isPause){
        //     this.channelObj[id].stop()
        //     this.playingObj[id] = false
        // }else{
        //     this.channelObj[id] = this.soundMap[id].play(this.channelObj[id].position),
        //     this.playingObj[id] = true
        // }
    }
    
    /**
     * 停止
     * @param id
     */
    public static stop(id:string):void
    {
        // if(this.channelObj[id]){
        //     this.channelObj[id].removeEventListener(Event.SOUND_COMPLETE,onSoundComplete)
        //     this.channelObj[id].stop();
        // }
        // this.playingObj[id]=false
    }
    
    /**
     * 设置音量
     * @param id 
     * @param v 音量数值,0-1
     */ 
    private static setVolume(id:string, v:number):void
    {
        // if(this.channelObj[id]){
        //     v > 1 && (v = 1);
        //     v < 0 && (v = 0);
        //     var st = this.channelObj[id].soundTransform;
        //     st.volume = v;
        //     this.channelObj[id].soundTransform = st;
        // }
    }
    
    /**根据类型获取声音*/
    private static getSound(id:string){
        // if(!this.soundMap[id]){
        //     var soundClass = LibManager.getInstance().getClass(id);
        //     if(soundClass){
        //         this.soundMap[id] = new soundClass();
        //     }else{
        //         //throw new Error("没有找到声音类：", soundClass);
        //         Utils.fadeErrorInfo("没有找到声音类：" + soundClass);
        //     }
        // }
        // return this.soundMap[id];
    }
    
    /**加入声音库*/
    public static addSound(id:String, url:String, callback:Function=null):void{
        // var s:Sound = new Sound();
        // soundMap[id] = s;
        // s.addEventListener(Event.COMPLETE, onComplete);
        // s.addEventListener(IOErrorEvent.IO_ERROR, onIOError);
        // s.load(new URLRequest(url));
        
        // function onComplete(event:Event):void{
        //     if(callback != null)
        //     {
        //         callback();
        //     }
        // }
        
        // function onIOError(event:Event):void{
        // }
    }
    
    /***/
    // public static set musicOff(b:boolean){
    //     LocalShareObject.set("musicOff", b);
    //     var v = (LocalShareObject.get("musicOff")?0:1)
    //     for(var i in this.channelObj){
    //         this.setVolume(i, v);
    //     }
    // }
    
    /***/
    // public static get musicOff():boolean{
    //     return LocalShareObject.get("musicOff");
    // }
}
