
const LEVEL = cc.Enum({IMAGE:0,CCNODE:1})
const {ccclass,property} = cc._decorator;

@ccclass    
export default class switch_content extends cc.Component{
    public show(){
        this.node.active = true;
    }
    public close(){
        this.node.active = false;
    }
}