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

import SignalBinding from './SignalBinding';


function validateListener(listener, fnName) {
    if (typeof listener !== 'function') {
        cc.log(fnName);
        throw new Error( 'listener is a required param of {fn}() and should be a Function.'.replace('{fn}', fnName)+(typeof listener) );
    }
}

@ccclass
export default class Signal {

    public active :boolean = true;

    private _bindings: Object = null;

    /**
     * 构造函数
     */
    constructor(){
        this._bindings = {};
    };

    private _registerListener (eventType:string, listener:Function, isOnce:boolean, listenerContext:Object, tag?:string) {

        var prevIndex = this._indexOfListener(eventType, listener, listenerContext),
            binding:SignalBinding;

        if (prevIndex !== -1) {
            binding = this._bindings[eventType][prevIndex];
            if (binding.isOnce() !== isOnce) {
                throw new Error('You cannot add'+ (isOnce? '' : 'Once') +'() then add'+ (!isOnce? '' : 'Once') +'() the same listener without removing the relationship first.');
            }
        } else {
            binding = new SignalBinding(listener, isOnce, listenerContext, tag);
            //this._addBinding(binding);
            if( !this._bindings[eventType] ) {
                this._bindings[eventType] = [];
            }
            this._bindings[eventType].push(binding);
        }

        return binding;
    };
    private _indexOfListener (eventType:string, listener:Function, context:Object) {
        var bindings = this._bindings[eventType];
        if( bindings ) {
            var n = bindings.length,cur;
            while (n--) {
                cur = bindings[n];
                if (cur._listener === listener && cur.context === context) {
                    return n;
                }
            }
        }
        return -1;
    };

    public has (eventType:string, listener:Function, context:Object):boolean {
        return this._indexOfListener(eventType, listener, context) !== -1;
    };

    public add (eventType:string, listener:Function, listenerContext:Object, tag:string) {
        validateListener(listener, 'add');
        return this._registerListener(eventType, listener, false, listenerContext, tag);
    };

    public addOnce (eventType:string, listener:Function, listenerContext:Function, tag:string) {
        validateListener(listener, 'addOnce');
        return this._registerListener(eventType, listener, true, listenerContext, tag);
    };

    public remove (eventType:string, listener:Function, context:Object) {
        validateListener(listener, 'remove');

        var i = this._indexOfListener(eventType, listener, context);
        if (i !== -1) {
            this._bindings[eventType][i]._destroy(); //no reason to a SignalBinding exist if it isn't attached to a signal
            this._bindings[eventType].splice(i, 1);
        }
        return listener;
    };

    public removeByTag (tag:string) {
        for( var eventType in this._bindings ) {
            var list = this._bindings[eventType];
            for( var i=list.length-1; i>=0; i-- ) {
                if( list[i].tag==tag) {
                    list[i]._destroy(); //no reason to a SignalBinding exist if it isn't attached to a signal
                    list.splice(i, 1);
                }
            }
        }
    };

    public removeAll ():void {
        for( var eventType in this._bindings ) {
            var list = this._bindings[eventType];
            var n = list.length;
            while (n--) {
                list[n]._destroy();
            }
            list.length = 0;
            delete this._bindings[eventType];
        }
    };

    public dispatch (eventType:string, params:Array<any>=[]) {
        if (! this.active) {
            return;
        }
        var bindings = this._bindings[eventType];
        if( !bindings||bindings.length==0) {
            return ;
        }
        bindings = bindings.slice(0);
        var aliveList = [];
        //cc.log("dispatch:" + eventType)
        for( var i=0; i<bindings.length; i++ ) {
            bindings[i].execute(params);

            if( !this.active ) {
                //在事件中被删除
                return ;
            }
            if( bindings[i] ) {
                if (bindings[i].isOnce()) {
                    bindings[i]._destroy();
                } else {
                    aliveList.push(bindings[i]);
                }
            }
        }
        this._bindings[eventType] = aliveList;
        bindings.length = 0;
    };
    public dispose ():void {
        this.removeAll();
        delete this._bindings;
    }
}
