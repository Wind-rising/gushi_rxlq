

export default class SignalBinding {

    'use strict';

    public active : boolean = true;

    public params : Array<any> = null;

    public tag : String = null;

    //private 
    private _listener : Function = null;
    private _isOnce :Boolean = false;
    private context : Object = null;
    /**
     * 
     * @param listener 
     * @param isOnce 
     * @param listenerContext 
     * @param tag 
     */
    constructor(listener:Function, isOnce:boolean, listenerContext:Object, tag:String){
        
        this._listener = listener;

        this._isOnce = isOnce;

        this.context = listenerContext;
        
        this.tag = tag;
    };
    public execute (paramsArr:Array<any>) {
        var handlerReturn, params;
        if (this.active && !!this._listener) {
            params = this.params? (paramsArr?this.params.concat(paramsArr):this.params) : paramsArr;
            handlerReturn = this._listener.apply(this.context, params);
        }
        return handlerReturn;
    };
    /**
     * 
     */
    public isOnce ():Boolean {
        return this._isOnce;
    };

    public getListener () {
        return this._listener;
    };

    public _destroy ():void {
        delete this._listener;
        delete this.context;
    }
}
