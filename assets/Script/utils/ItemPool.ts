export default class ItemPool
{
    public static _itemMap:Object = new Object();

    public static putItem(item){
        if(item){
            this._itemMap[item.sComponent._data.Uuid] = item;
        }
    }
    public static getItem(Uuid){
        return this._itemMap[Uuid];
    }
}