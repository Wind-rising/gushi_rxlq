import Utility from "../../utils/Utility";

/**
 * 滚动条控件,直接挂在scrollview节点上
 * 
 * 目前只支持垂直滚动，水平滚动的以后再添加支持
 * 
 * 使用的时候需要指定一个默认的节点模板，如果scrollview下面有节点，会默认用第一个作为模板
 * 
 * 节点如果带有Button组件，则会在选中的时候把Button设置为interactable = false
 * 如果节点下挂了子节点 名字为img_selected 则会把这张图片作为选中标识符
 */
const {ccclass, property} = cc._decorator;

@ccclass
export default class ListViewCtrl extends cc.Component {
    @property(cc.Node) // 子节点模板 author.y必须是0.5
    itemTemplate:cc.Node = null;
    
    @property //间距
    private spacing:number = 0; // space between each item

    /** 实际生成的cell数量 */
    private spawnCount:number = 0; // how many items we actually spawn
    /** 数据总数量 */
    private totalCount:number = 0; // how many items we need for the whole list
    /** 高度 */
    private bufferZone:number = 0; // when item is away from bufferZone, we relocate it

    /** 刷新时间 */
    private updateInterval:number = 0;
    private lastContentPosY:number = 0;
    private updateTimer:number = 0;
    private cellListObj:Object[] = null;//[{item:cc.Node,idx:number}]
    private content:cc.Node = null;
    
    // use this for initialization
    onLoad () {
        let scrollview = this.getComponent(cc.ScrollView);
        this.content = scrollview.content;
        this.cellListObj = []; // array to store spawned items
        this.updateTimer = 0;
        this.updateInterval = 0.4;
        this.lastContentPosY = 0; // use this variable to detect if we are scrolling up or down

        /** 这里可能会报错 ，不错错误处理了 方便查找错误，如果报错，说明ScrollView没有初始节点 */
        if(!this.itemTemplate){
            this.itemTemplate = this.content.children[0];
        }
        this.content.removeAllChildren();
        this.spawnCount = Math.ceil(this.node.height/this.itemTemplate.height)+2;//上下各预留一个
        this.bufferZone = this.node.height-this.itemTemplate.height;//可视区间

        this.initialize();
    };

    initialize () {
        this.content.height = this.totalCount * (this.itemTemplate.height + this.spacing) + this.spacing; // get total content height
        for (let i = 0; i < this.spawnCount; ++i) { // spawn items, we only need to do this once
            let item = cc.instantiate(this.itemTemplate);

            this.content.addChild(item);
            item.setPosition(0, -item.height * (0.5 + i) - this.spacing * (i + 1));

            this.node.emit('initCell',item,i);
            this.cellListObj.push({item:item,idx:i});
            this.bindItemClickEvent(item,i);
        }
    };

    bindItemClickEvent (item:cc.Node,idx:number) {
        item.on('touchend', function () {
            this.onCellSelected(idx);
        }, this);
    }

    /**
     * 点击事件，可以从外部触发用于初始化
     * @param item 点击的cell
     * @param idx 对应数据的索引
     */
    onCellSelected (idx:number){
        for(let i = 0;i<this.cellListObj.length;i++){
            let item = this.cellListObj[i]['item'];
            let selected = (idx == this.cellListObj[i]['idx']);
            /** 如果是按钮的话用按钮 */
            let btn = item.getComponent(cc.Button);
            btn && (btn.interactable = selected);
            /** 默认选中标识 img_selected */
            let img_selected = item.getChildByName('img_selected');
            img_selected && (img_selected.active = selected);
            if(idx == this.cellListObj[i]['idx']){
                this.node.emit('selectedCell', item, idx);
            }
        }
    }

    getPositionInView (item) { // get item position in scrollview's node space
        let worldPos = item.parent.convertToWorldSpaceAR(item.position);
        let viewPos = this.node.convertToNodeSpaceAR(worldPos);
        return viewPos;
    };

    update(dt) {
        this.updateTimer += dt;
        if (this.updateTimer < this.updateInterval) return; // we don't need to do the math every frame
        this.updateTimer = 0;
        this.refreshItems();
    };

    /**
     * 刷新显示的item
     */
    refreshItems () {
        let items = this.cellListObj;
        let buffer = this.bufferZone;
        let isDown = this.content.y < this.lastContentPosY; // scrolling direction
        let offset = (this.itemTemplate.height + this.spacing) * items.length;
        for (let i = 0; i < items.length; ++i) {
            let viewPos = this.getPositionInView(items[i]['item']);
            if (isDown) {
                // if away from buffer zone and not reaching top of content
                if (viewPos.y < -buffer && items[i]['item'].y + offset < 0) {
                    items[i]['item'].y = items[i]['item'].y + offset;
                    let idx = items[i]['idx'] - items.length;
                    items[i]['idx'] = idx;
                    this.node.emit('initCell',items[i]['item'],idx);
                }
            } else {
                // if away from buffer zone and not reaching bottom of content
                if (viewPos.y > buffer && items[i]['item'].y - offset > -this.content.height) {
                    items[i]['item'].y = items[i]['item'].y - offset;
                    let idx = items[i]['idx'] + items.length;
                    items[i]['idx'] = idx;
                    this.node.emit('initCell',items[i]['item'],idx);
                }
            }
        }
        // update lastContentPosY
        this.lastContentPosY = this.content.y;
    }

    /**
     * 添加节点
     * @param count 添加的数量 默认为1
     */
    addItem(count:number = 1) {
        this.setItemCount(this.totalCount+count);
    };

    /**
     * 设置节点数量
     */
    setItemCount(count:number = 0) {
        this.content.height = count * (this.itemTemplate.height + this.spacing) + this.spacing; // get total content height
        this.totalCount = count;
        
        for(let i = 0;i<this.cellListObj.length;i++){
            let active = (this.totalCount>i);
            this.cellListObj[i]['item'].active = active;
            if(active){
                this.node.emit('initCell',this.cellListObj[i]['item'],this.cellListObj[i]['idx']);
            }
        }
        this.moveBottomItemToTop();
    }

    /**
     * 删除一个节点
     */
    removeItem() {

        this.content.height = (this.totalCount - 1) * (this.itemTemplate.height + this.spacing) + this.spacing; // get total content height
        this.totalCount = this.totalCount - 1;

        this.moveBottomItemToTop();
    };

    moveBottomItemToTop () {
        let offset = (this.itemTemplate.height + this.spacing) * this.cellListObj.length;
        let length = this.cellListObj.length;
        let cell = this.getItemAtBottom();

        // whether need to move to top
        if (cell['item'].y + offset < 0) {
            cell['item'].y = cell['item'].y + offset;

            let idx = cell['idx'] - length;
            cell['idx'] = idx;
            this.node.emit('initCell',cell['item'],idx);
        }
    };

    getItemAtBottom () {
        let cell = this.cellListObj[0];
        for (let i = 1; i < this.cellListObj.length; ++i) {
            if (cell['item'].y > this.cellListObj[i]['item'].y) {
                cell = this.cellListObj[i];
            }
        }
        return cell;
    }
}
