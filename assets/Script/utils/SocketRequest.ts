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
export default class NewClass extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    // update (dt) {}
}

// /**
//  * 处理socket请求
//  */
// cc.Class({
//     extends: cc.Component,
//     properties: {
//         _webSocket:null,
//     },
//     onLoad () {
//         this._webSocket = new WebSocket(AppConfig.ChatAdress);
//         this._webSocket.onopen = function (event) {
//             this.requestCallback(0);
//         }.bind(this);
//         this._webSocket.onmessage = function(event){
//             this.requestCallback(1,event.data);
//         }.bind(this);
//         this._webSocket.onerror = function(event){
//             this.requestCallback(2);
//         }.bind(this);
//         this._webSocket.onclose = function(event){
//             this.requestCallback(3);
//         }.bind(this);
//     },
//     start () {},
//     update (dt) {},
//     send: function(msg) {
//         this._webSocket.send(msg);
//     },
//     requestCallback(code,data){
//         switch(code){
//             case 0:
//             {
//                 cc.log('websocket open');
//                 break;
//             }
//             case 1:
//             {
//                 let reader = new FileReader();
//                 reader.readAsArrayBuffer(data);
//                 reader.onload = () => {
//                     this.decode(new Uint8Array(reader.result));
//                 }
//                 break;
//             }
//         }
//     },
//     /**
//      * 解析收到的协议
//      * @param {*} buffer 
//      */
//     decode(buffer) {
//     },
//     /**
//      * 外部调用，发送协议
//      * @param {*} msg 
//      */
//     sendPacket(msg) {
//     }
// });
