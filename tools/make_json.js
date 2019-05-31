/**
 * 把csv xml json生成游戏内可用的json结构
 */
var fs = require('fs-extra');
var csv=require('csvtojson');
var iconv=require('iconv-lite');
var zlib = require('zlib');
var common = require('./libs/common');

var md5Checker = require("./libs/MD5Checker").create(MD5_PATH + "json_md5.json");

/**
* 数组转成对象，并且key为pid，如果找不到pid，就用数组的第一个作为key
*/
function convertArr2Obj(arr,pid){
    pid = pid||"Pid";
    //Object.prototype.toString.call(arr) === “[object Array]”
    //arr.constructor.name==='Array'
    //Array.isArray(fr.arr)
    if (arr instanceof Array) {
        var ret = {};
        for (var i = arr.length - 1; i >= 0; i--) {
            if (arr[i][pid]) {
                ret[arr[i][pid]] = arr[i];
            }else{
                ret[arr[i][Object.keys(arr[i])[0]]] = arr[i];
            }
        }
        return ret;
    }
    return arr;
}



var pathCfg = config["make_json"];
var fromDir = RESOURCE_PATH + pathCfg["from"];
var toDir = PROJECT_PATH + pathCfg["to"];
var zlibCompress = false;//pathCfg['zlib'];

md5Checker.ignorePath = fromDir;//不处理主目录


var fileList = [];
common.readFiles( fromDir, function(path){
    var infos = common.getFileType(path);
    var toFile = toDir + path.replace(fromDir,"").split(".").shift();
    var arrtemp = toFile.split("/");
    arrtemp.pop();
    //create dir if not find
    var newDir = arrtemp.join("/");
    if (!fs.existsSync(newDir)) {
        fs.mkdirsSync(newDir);
    }
    toFile = newDir + "/Dic_" + infos.name + "_chs";
    
    if(zlibCompress){
        fileList.push("Dic_" + infos.name + "_chs.jpg");
        var change = !fs.existsSync(toFile+".jpg") || md5Checker.isChange(path);
        if(!change){
            return;
        }
    }else{
        fileList.push("Dic_" + infos.name + "_chs.json");
        var change = !fs.existsSync(toFile+".json") || md5Checker.isChange(path);
        if(!change){
            return;
        }
    }
    console.log('Create json file  '+toFile);
    if (infos.type == "csv") {//csv转成jaon格式
        csv({delimiter: ';'})
        .fromString(iconv.decode(fs.readFileSync(path),'gbk'))
        .then((jsonObj)=>{
            var str = JSON.stringify(convertArr2Obj(jsonObj));
            fs.writeFileSync(toFile+".json", common.toUnicode(str), "utf-8");
        });
    }
    else if (infos.type == "json") {//json格式直接复制过去，然后压缩
        var str = iconv.decode(fs.readFileSync(path),'gbk');
        fs.writeFileSync(toFile+".json", common.toUnicode(str), "utf-8");
    }else if(infos.type == "xml"){
        var str = JSON.stringify(common.xml2obj(path));
        fs.writeFileSync(toFile+".json", common.toUnicode(str), "utf-8");
    }
    if(zlibCompress){
        const deflate = zlib.createDeflate();
        const inp = fs.createReadStream(toFile+".json");
        const out = fs.createWriteStream(toFile+".jpg");
        inp.pipe(deflate).pipe(out);
        //有时间再处理
        // inp.on('end',function(){
        //     fs.removeSync(toFile+".json");
        // });
    }
});

//写入文件列表
fs.writeFileSync(toDir+"JsonList.json", JSON.stringify(fileList), "utf-8");

md5Checker.save();
