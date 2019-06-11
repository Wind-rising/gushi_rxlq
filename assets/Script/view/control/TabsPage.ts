/**
 * 标签页切换控件
 * btnList标签列表，按钮类型
 * nodList标签所控制的页面列表
 * 对应关系根据数组索引，点btnList[0]按钮，显示nodList[0]节点
 */
const {ccclass, property} = cc._decorator;

@ccclass
export default class TabsPage extends cc.Component {

    @property([cc.Button])
    btnList: cc.Button[] = [];
    @property([cc.Node])
    nodList: cc.Node[] = [];

    private selectedIndex:number = 0;

    set index (value){
        this.selectedIndex = value;
    }

    onLoad () {
        if(this.btnList.length<=0){
            return;
        }
        for(let i = 0;i < this.btnList.length; i++){
            let btn:cc.Button = this.btnList[i];
            let clickEventHandler = new cc.Component.EventHandler();
            clickEventHandler.target = this.node;
            clickEventHandler.component = 'TabsPage';
            clickEventHandler.handler = 'onBtnSelected';
            clickEventHandler.customEventData = i.toString();
            btn.clickEvents.push(clickEventHandler);

            if(this.selectedIndex == i){
                btn.enabled = false;
                this.nodList.length>i && (this.nodList[i].active = true);
            }else{
                btn.enabled = true;
                this.nodList.length>i && (this.nodList[i].active = false);
            }
        }
    }

    /**
     * 标签页点击事件
     * @param e 
     * @param data 按钮索引值
     */
    onBtnSelected (e:cc.Event,data:string) {
        let index = parseInt(data);
        if(this.selectedIndex == index){
            return;
        }
        this.btnList[this.selectedIndex].enabled = true;
        this.nodList.length>this.selectedIndex && (this.nodList[this.selectedIndex].active = false);
        this.selectedIndex = index;
        this.btnList[this.selectedIndex].enabled = false;
        this.nodList.length>this.selectedIndex && (this.nodList[this.selectedIndex].active = true);
    }

    // update (dt) {}
}
