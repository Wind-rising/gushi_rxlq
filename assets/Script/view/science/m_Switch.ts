
import Events from "../../signal/Events"
export default class Switch_module{

    private switch_name:string = "";
    private switch_head:Array<cc.Node> = [];
    private switch_body:Array<cc.Node> = [];

    constructor({switch_name,switch_head,switch_body}){
        switch_name&&(this.switch_name = switch_name );
        switch_head&&(this.switch_head = switch_head );
        switch_body&&(this.switch_body = switch_body );

        this.start();
    }
    private start(){
        this.switch_bind();
        this.onClick(0);
    }
    //绑定切换按钮
    private switch_bind(){
        for(let i = 0;i<this.switch_head.length;i++){
            let obj = this.switch_head[i].getComponent(cc.Button).node;

            obj.on("click",()=>{
                this.onClick(i)
            },this)
        }
    }
    //切换
    private onClick(i){
        if(this.switch_head[i].getComponent("prefab_Switch_head").state == 1){return}
        Events.getInstance().dispatch(this.switch_name+i);
        this.onSwitch(i);
    }
    private onSwitch(index){
        for(let i = 0;i<this.switch_head.length;i++){
            if(i == index){
                this.switch_head[i].getComponent("prefab_Switch_head").active_on();
                this.switch_body[i].active = true;
            }else{
                this.switch_head[i].getComponent("prefab_Switch_head").active_off();
                this.switch_body[i].active = false;
            }
        }
    }
}