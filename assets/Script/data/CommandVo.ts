export default class CommandVo{
    public action:String;
    public args:Object;
    constructor(action:String = "",args:Object = null){
        this.action = action;
        this.args = args;
    }
}