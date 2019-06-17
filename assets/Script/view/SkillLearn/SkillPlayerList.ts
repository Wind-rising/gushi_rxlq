import Utility from "../../utils/Utility";
import SkillLearnModel from "./SkillLearnModel";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SkillPlayerList extends cc.Component {
    @property(cc.Label)
    public lbl_pos:cc.Label = null;
    @property(cc.RichText)
    public rtxt_MName:cc.RichText = null;
    @property(cc.Label)
    public lbl_trainPoint:cc.Label = null;
    @property(cc.Node)
    public node_effect:cc.Node = null;
    @property(cc.Button)
    public node_bg:cc.Button = null;
    public data;

    start(){
        this.getComponent(cc.Button).clickEvents.push(
            Utility.bindBtnEvent(this.node,'SkillPlayerList','onClick')
        )
    }
    public init(data){
        this.data = data;
    }
    public onClick(){
        SkillLearnModel.selectPlayer = this.node;
    }
}