import Utility from "../../utils/Utility";


const {ccclass, property} = cc._decorator;

@ccclass
export default class strengthView extends cc.Component {
    @property(cc.Button)
    private btn_close:cc.Button = null;
    @property(cc.Node)
    private cont_bag:cc.Node = null;
    @property(cc.Button)
    private btn_prev:cc.Button = null;
    @property(cc.Button)
    private btn_next:cc.Button = null;
    @property(cc.Label)
    private lbl_pageNum:cc.Label = null;
    
    start(){
        this.addListener();
        this.init();
    }
    onDestroy(){
        this.removeListener();
    }
    private addListener(){

    } 
    private removeListener(){
        
    } 
    private init(){
        this.btn_close.clickEvents.push(
            Utility.bindBtnEvent(this.node,"strengthView","onClose")
        );
    }
    private onClose(){
        this.node.destroy();
    }
    
}