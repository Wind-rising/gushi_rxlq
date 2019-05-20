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

import Singleton from './../Utils/Singleton';
import Signal from './Signal';

@ccclass
export default class Events extends Singleton {

    _signal:Signal =  new Signal();

    constructor(){
        super();
    }

    public addListener (eventName, listener, thisArg, tag?:string) {
        this._signal.add(eventName+"", listener, thisArg, tag);
    };

    public addListenerOnce (eventName, listener, thisArg, tag?:string) {
        this._signal.addOnce(eventName+"", listener, thisArg, tag);
    };

    public removeListener (eventName, listener, thisArg) {
        this._signal.remove(eventName+"", listener, thisArg);
    };

    public removeAll () {
        this._signal.removeAll();
    };

    public dispatch (eventName, params?) {
        if( this._signal ) {
            this._signal.dispatch(eventName+"", params);
        } else {
            cc.log("events.dispatch() fail, events._signal is null.  event=" + eventName);
        }
    };
    public removeByTag = function (tag) {
        //cc.log("remove by tag:" + tag)
        this._signal.removeByTag(tag);
    };
};
