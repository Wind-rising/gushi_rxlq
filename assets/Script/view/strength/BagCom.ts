
const {ccclass, property} = cc._decorator;

@ccclass
export default class SkillBag{
    private cont_bag:cc.Node = null;
    private btn_prev:cc.Button = null;
    private btn_next:cc.Button = null;
    private lbl_pageNum:cc.Label = null; 
    constructor(cont_bag,btn_prev,btn_next,lbl_pageNum){
        this.cont_bag = cont_bag;
        this.btn_prev = btn_prev;
        this.btn_next = btn_next;
        this.lbl_pageNum = lbl_pageNum;
    }

}