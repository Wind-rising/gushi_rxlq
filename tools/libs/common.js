/**
 * 运行所有脚本前现需要执行args.js config.js两个文件
 */
require("./args.js");
require("./config.js");

var fs = require('fs-extra');
var execSync = require('child_process').execSync;
var execFileSync = require('child_process').execFileSync;
var spawnSync = require('child_process').spawnSync;
var UglifyJS = require("uglify-js");
var DOMParser = require('xmldom').DOMParser;

var ENCODING = process.platform == "win32" ? 'cp936' : "utf-8";
var execParam = {
    encoding: 'binary',
    timeout: 3600000,
    maxBuffer: 200 * 1024,
    killSignal: 'SIGTERM',
    stdio: [process.stdin, process.stdout, process.stderr],
    cwd: null,
    env: null
};
/**
 * 执行系统命令行
 * @param {string} cmdStr 命令
 */
function exec(cmdStr, workDir) {
    console.log(cmdStr);
    execParam.cwd = workDir || null;
    var err = false, stderr, stdout;
    try {
        stdout = execSync(cmdStr, execParam);
    } catch (ex) {
        stderr = ex;
        console.log("err:", stderr);
    }
}
exports.exec = exec;

/**
 * 执行命令行
 * @param {string} cmdStr 命令
 */
function spawn(cmdStr, workDir) {
    console.log(cmdStr);
    execParam.cwd = workDir || null;
    var err = false, stderr, stdout;
    try {
        var params = cmdStr.split(/[\s]+/ig);
        var cmd = params.shift();
        stdout = spawnSync(cmd, params, execParam);
    } catch (ex) {
        stderr = ex;
        console.log("err:", stderr);
    }
}
exports.spawn = spawn;

/** 加载json格式的文件 */
function loadJson(path) {
    if (fs.existsSync(path)) {
        var cont = null;
        if( path.indexOf(".gz")!=-1 ) {
            cont = GzipUtil.gunzip(path).toString();
        } else {
            cont = fs.readFileSync(path, "utf-8");
        }
        try {
            return JSON.parse(cont);
        }catch(e) {
            console.log("read json fail:" + path);
            throw e;
        }
    }
    return null;
}
exports.loadJson = loadJson;

/** 读取文本 */
function loadText(path) {
    if (fs.existsSync(path)) {
        return fs.readFileSync(path, "utf-8");
    }
    return "";
}
exports.loadText = loadText;

function execFile(path, workDir, args) {
    console.log("exec file:" + path);
    execParam.cwd = workDir || null;
    var err = false, stderr, stdout;
    try {
        stdout = execFileSync(path, args||[], execParam);
    } catch (ex) {
        err = true;
        stderr = ex;
        console.log("err:", stderr);
    }
}
exports.execFile = execFile;

/**
 * 命令行执行java程序
 * @param {string} javaCmd 执行的java命令
 */
function execJava(javaCmd) {
    exec("java -classpath javalib " + javaCmd);
}
exports.execJava = execJava;

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
exports.NodeType = NodeType;

var DOMParser = require('xmldom').DOMParser;
var XMLSerializer = require('xmldom').XMLSerializer;

/**
 * 
 * @param {string} path 
 * @return {Document}
 */
function loadXml(path) {
    return new DOMParser().parseFromString(fs.readFileSync(path, "utf-8"));
}
exports.loadXml = loadXml;
function saveXml(xml, path) {
    fs.writeFileSync( path, new XMLSerializer().serializeToString(xml).replace( /\/>/ig, " />" ), "utf-8" );
}
exports.saveXml = saveXml;

//中文转unicode编码
function toUnicode(s){
    return s.replace(/([\u4E00-\u9FA5]|[\uFE30-\uFFA0])/g,function(newStr){
        return "\\u" + newStr.charCodeAt(0).toString(16);
    });
}
exports.toUnicode = toUnicode;

/**
* xml2 json
*/
function xml2obj (path, addIdx) {
    var dom = new DOMParser().parseFromString(fs.readFileSync(path, "utf-8"));
    var obj =  node2obj(dom.documentElement, path, addIdx);
    //剥掉最外层
    // if( obj instanceof Object){
    //     console.log("Only keep  "+Object.keys(obj)[0]);
    //     obj = obj[Object.keys(obj)[0]];
    // }
    return obj;
}
exports.xml2obj = xml2obj;

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
exports.node2obj = node2obj;

function isDirectory(path) {
    if ( !fs.existsSync(path) ) {
        return false;
    }
    return fs.statSync(path).isDirectory();
}
exports.isDirectory = isDirectory;

/**
 * 读取所有子目录中的文件，非目录的调用 handleFile()
 * @param {string} path 路径
 * @param {Function} handleFile 回调函数
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
exports.readFiles = readFiles;

/**
 * 删除空白目录
 * @param {string} path 路径
 */
function removeEmptyFolder(path) {
    if ( !fs.existsSync(path) ) {
        return;
    }
    if (!fs.statSync(path).isDirectory()) {
        return;
    }
    if (path[path.length - 1] != "/") {
        path += "/";
    }
    var files = fs.readdirSync(path);
    if( files.length==0 ) {
        fs.removeSync(path);
        return ;
    }
    files.forEach(function (file, index) {
        removeEmptyFolder(path + file);
    });
    //删除完子目录再次检测
    files = fs.readdirSync(path);
    if( files.length==0 ) {
        fs.removeSync(path);
    }
}

exports.removeEmptyFolder = removeEmptyFolder;

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
exports.getFileType = getFileType;

function formatStr(text, data) {   
    var matchArr = text.match(/\{\w+\}/ig);
    if( matchArr ) {
        for( var i=0; i<matchArr.length; i++ ) {
            var val = data[matchArr[i].substring(1, matchArr[i].length-1)];
            if( val!=undefined ) {
                text = text.replace( matchArr[i], val);
            }
        }
    }
    return text;
}
exports.formatStr = formatStr;
