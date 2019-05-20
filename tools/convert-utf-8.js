/**
 * 把csv xml json生成游戏内可用的json结构
 */
var fs = require('fs-extra');
var csv=require('csvtojson');
var iconv=require('iconv-lite');
var Buffer = require('buffer').Buffer;
var zlib = require('zlib');
var DOMParser = require('xmldom').DOMParser;

var debug = true;

/**
* 循环遍历文件
*/
function readFiles(path, handleFile) {
    if ( !fs.existsSync(path) ) {
        return;
    }
    if (!fs.statSync(path).isDirectory()) {
        handleFile(path);
        return;
    }
    var files = fs.readdirSync(path);
    if (path[path.length - 1] != "/") {
        path += "/";
    }
    files.forEach(function (file, index) {
        if( file[0]=="." ) {
            return ;
        }
        var tmpPath = path + file;
        if(!fs.existsSync(tmpPath)) {
            return ;
        }
        if (fs.statSync(tmpPath).isDirectory()) { // recurse
            readFiles(tmpPath, handleFile);
        } else {
            handleFile(tmpPath);
        }
    });
}

/**
* 获取文件类型
*/
function getFileType(filePath) {
    filePath = filePath.replace(/[\\]+/ig, "/");
    var file = filePath.split("/").pop();
    var arr = file.split(".");
    var type = arr.pop();
    return {
        name: arr.join("."),
        type: type.toLowerCase()
    }
}

//中文转unicode编码
function toUnicode(s){
    return s.replace(/([\u4E00-\u9FA5]|[\uFE30-\uFFA0])/g,function(newStr){
        return "\\u" + newStr.charCodeAt(0).toString(16);
    });
}
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

var NodeType = {
    ELEMENT_NODE: 1,
    ATTRIBUTE_NODE: 2,
    TEXT_NODE: 3,
    CDATA_SECTION_NODE: 4,
    ENTITY_REFERENCE_NODE: 5,
    ENTITY_NODE: 6,
    PROCESSING_INSTRUCTION_NODE: 7,
    COMMENT_NODE: 8,
    DOCUMENT_NODE: 9,
    DOCUMENT_TYPE_NODE: 10,
    DOCUMENT_FRAGMENT_NODE: 11,
    NOTATION_NODE: 12
};
/**
 * xml节点转json
 * @param {Document} doc
 * @param {Element} element 
 */
function node2obj(element, file, addIdx) {
    var obj = {};
    var attrLen = element.attributes.length;
    for (var j = 0; j < attrLen; j++) {
        var attr = element.attributes[j];
        obj[attr.name] = attr.nodeValue;
    }
    
    var nodes = element.childNodes;//element.getElementsByTagName("*");
    var children = [];
    for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].nodeType==NodeType.ELEMENT_NODE) {
            children.push(nodes[i]);
        }
    }
    var len = children.length;
    if (len == 0) {
        //cdata        
        for (var i = 0; i < nodes.length; i++) {
            switch (nodes[i].nodeType) {
                case NodeType.CDATA_SECTION_NODE:
                    obj.innerText = nodes[i].nodeValue;
                    break;
                case NodeType.TEXT_NODE:
                    if (nodes[i].nodeValue.trim()) {
                        obj.innerText = nodes[i].nodeValue;
                    }
                    break;
            }
        }
        return obj;
    }    
    for (var i = 0; i < len; i++) {
        
        var node = children[i];
        var tag = node.localName;
        if (!obj[tag]) {
            obj[tag] = [];
        }
        if(addIdx) {
            obj["_index"] = i;
        }

        if (obj[tag] instanceof Array) {
            obj[tag].push(node2obj(node, file, addIdx));
        } else {
            console.log("[!!!warning!!!]属性名称号节点名称重复：" + tag + "#" + file)
        }
    }
    return obj;
}
/**
* xml2 json
*/
function xml2obj (path, addIdx) {
    var dom = new DOMParser().parseFromString(fs.readFileSync(path, "utf-8"));
    var obj =  node2obj(dom.documentElement, path, addIdx);
    //剥掉最外层
    if( obj instanceof Object){
        console.log("Only keep  "+Object.keys(obj)[0]);
        obj = obj[Object.keys(obj)[0]];
    }
    return obj;
}

var fromDir = "../../doc/config/csv/";
var toDir = "./../assets/resources/data/";
var fileList = [];
readFiles( fromDir, function(path){
    var infos = getFileType(path);
    console.log(path);
    if (infos.type == "csv") {//csv转成jaon格式
        var toFile = toDir + path.replace(fromDir,"").split(".").shift();
        var arrtemp = toFile.split("/");
        arrtemp.pop();
        //create dir if not find
        var newDir = arrtemp.join("/");
        if (!fs.existsSync(newDir)) {
            fs.mkdirsSync(newDir);
        }
        toFile = newDir + "/Dic_" + infos.name + "_chs";
        fileList.push("Dic_" + infos.name + "_chs.json");
        csv({delimiter: ';'})
        .fromString(iconv.decode(fs.readFileSync(path),'gbk'))
        .then((jsonObj)=>{
            var str = JSON.stringify(convertArr2Obj(jsonObj));
            fs.writeFileSync(toFile+".json", toUnicode(str), "utf-8");
            const gzip = zlib.createGzip();
            const deflate = zlib.createDeflate();
            const inp = fs.createReadStream(toFile+".json");
            const out = fs.createWriteStream(toFile+".jpg");
            inp.pipe(deflate).pipe(out);
        });
    }
    else if (infos.type == "json") {//json格式直接复制过去，然后压缩
        var toFile = toDir + path.replace(fromDir,"").split(".").shift();
        var arrtemp = toFile.split("/");
        arrtemp.pop();
        //create dir if not find
        var newDir = arrtemp.join("/");
        if (!fs.existsSync(newDir)) {
            fs.mkdirsSync(newDir);
        }
        toFile = newDir + "/Dic_" + infos.name + "_chs";

        var str = iconv.decode(fs.readFileSync(path),'gbk');
        fs.writeFileSync(toFile+".json", toUnicode(str), "utf-8");
        fileList.push("Dic_" + infos.name + "_chs.json");
        // const gzip = zlib.createGzip();
        // const deflate = zlib.createDeflate();
        // const inp = fs.createReadStream(toFile+".json");
        // const out = fs.createWriteStream(toFile+".jpg");
        // inp.pipe(deflate).pipe(out);
    }else if(infos.type == "xml"){
        var toFile = toDir + path.replace(fromDir,"").split(".").shift();
        var arrtemp = toFile.split("/");
        arrtemp.pop();
        //create dir if not find
        var newDir = arrtemp.join("/");
        if (!fs.existsSync(newDir)) {
            fs.mkdirsSync(newDir);
        }
        toFile = newDir + "/Dic_" + infos.name + "_chs";
        var str = JSON.stringify(xml2obj(path));
        fs.writeFileSync(toFile+".json", toUnicode(str), "utf-8");
        fileList.push("Dic_" + infos.name + "_chs.json");
        // const gzip = zlib.createGzip();
        // const deflate = zlib.createDeflate();
        // const inp = fs.createReadStream(toFile+".json");
        // const out = fs.createWriteStream(toFile+".jpg");
        // inp.pipe(deflate).pipe(out);
    }
});
fs.writeFileSync(toDir+"JsonList.json", JSON.stringify(fileList), "utf-8");

//压缩
// var fs = require('fs');
// var zlib = require('zlib');

// var gzip = zlib.createGzip();
// var deflate = zlib.createDeflate();

// var inFile = fs.createReadStream('./extra/fileForCompress.txt');
// var out = fs.createWriteStream('./extra/fileForCompress.txt.gz');

// inFile.pipe(gzip).pipe(out);
// inFile.pipe(deflate).pipe(out);

//解压
// var fs = require('fs');
// var zlib = require('zlib');

// var gunzip = zlib.createGunzip();
// var inflate = zlib.createInflate();

// var inFile = fs.createReadStream('./extra/fileForCompress.txt.gz');
// var outFile = fs.createWriteStream('./extra/fileForCompress1.txt');

// inFile.pipe(gunzip).pipe(outFile);
// inFile.pipe(inflate).pipe(outFile);

