import Events from "../../signal/Events"
export default class switch_page{
    private prevButton:cc.Button;
    private nextButton:cc.Button;
    private showUI:cc.Label;
    private changeEvent;
    private _max;
    private pageNum;
    constructor(prevButton,nextButton,showUI,changeEvent,pageNum,max = null){
        this.prevButton = prevButton.getComponent(cc.Button);
        this.nextButton = nextButton.getComponent(cc.Button);
        this.showUI = showUI.getComponent(cc.Label);
        this.changeEvent = changeEvent;
        this.pageNum = pageNum;
        max&&(this._max = Math.ceil(max/this.pageNum['main'][this.pageNum['pageCount']]));
        this.start();
    }
    public set max(value){
        this._max = Math.ceil(value/this.pageNum['main'][this.pageNum['pageCount']]);
        this.onShow(false)
    }
    public get max(){
        return this._max;
    }
    private start(){
        this.prevButton.node.on('click', this.onPrev, this);
        this.nextButton.node.on('click', this.onNext, this);
        this.onShow(false)
    }
    private onPrev(){
        let n = this.pageNum['main'][this.pageNum['pageNum']];
        if(--n<0){
            n = 0;
            return;
        }
        this.pageNum['main'][this.pageNum['pageNum']] = n;
        this.onShow();
    }
    private onNext(){
        let n = this.pageNum['main'][this.pageNum['pageNum']];
        if(++n>this.max - 1){
            n = this.max - 1;
            return;
        }
        this.pageNum['main'][this.pageNum['pageNum']] = n;
        this.onShow();
    }
    private onShow(isFresh = true){
        if(this.max){
            isFresh&&Events.getInstance().dispatch(this.changeEvent);
            this.showUI.string = `${this.pageNum['main'][this.pageNum['pageNum']] + 1}/${this.max}`;
        }else{
            this.showUI.string = '';
        }
    }
}