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
export default class Alert extends cc.Component {

    @property(cc.Label)
    lbl_title: cc.Label = null;

    @property(cc.RichText)
    lbl_content: cc.RichText = null;

    @property(cc.Button)
    btn_ok: cc.Label = null;

    @property(cc.Button)
    btn_cancel: cc.Label = null;

    showCancel:boolean = false;

    onOk:Function = null;
    onCancel:Function = null;
    // use this for initialization

    onLoad () {
        cc.game.addPersistRootNode(this.node);
        this.node.active = false;
    };

    onEnable(){
        if(this.showCancel){
            this.btn_ok.node.x = 0;
            this.btn_cancel.node.active = false;
        }else{
            this.btn_ok.node.x = -135;
            this.btn_cancel.node.active = true;
        }
    };
    
    onBtnOK(event)
    {
        if(this.onOk){
            this.onOk();
        }
        this.node.active = false;
    };

    onBtnCancel(event)
    {
        if(this.onCancel){
            this.onCancel();
        }
        this.node.active = false;
    };

    onDestory()
    {
        this.onOk = null;
        this.onCancel = null;
    };
    
    show(text:string, onOk:Function = null, args:Object = {})
    {
        args = args || {};
        this.lbl_content.string = text || '';
        this.onOk = onOk || null;
        this.showCancel = args['showCancel'] || false;
        this.lbl_title.string = args['title'] || '';
        
        this.onCancel = args['onCancel'] || null;
        this.node.active = true;
    };

    /**
     * 提示框，没有操作
     */
    public alert(content:string,title:string){
        this.lbl_content.string = content;
        this.onOk = null;
        this.showCancel = false;
        this.lbl_title.string = title;
        
        this.onCancel = null;
        this.node.active = true;
    }

    /**
     * 确认框，有确认取消按钮
     */
    public confirm(text:string, onOk:Function = null, args:Object){
        args = args || {};
        this.lbl_content.string = text || '';
        this.onOk = onOk || null;
        this.showCancel = args['showCancel'] || false;
        this.lbl_title.string = args['title'] || '';
        
        this.onCancel = args['onCancel'] || null;
        this.node.active = true;
    }

}
