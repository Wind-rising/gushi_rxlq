
var common = require("./common");
var crypto = require("crypto");
var fs = require("fs-extra");

/**
 * @param {string} md5Path md5数据保存路径
 * @param {string} ignorePath 不处理的path部分
 */
function MD5Checker(md5Path, ignorePath) {
    this.md5Path = md5Path;
    this.md5List = common.loadJson(md5Path) || {};
    this.ignorePath = ignorePath;
}

/**
 * 获取文件md5值,文件不存在，则返回false
 * @param {string} filePath 文件路径
 */
MD5Checker.fileMd5 = function (filePath) {
    if (fs.existsSync(filePath)) {
        var fileData = fs.readFileSync(filePath);
        var md5 = crypto.createHash("md5");
        md5.update(fileData);
        return md5.digest("hex");
    }
    return false;
}
MD5Checker.strMd5 = function( str ) {
    if( str ) {
        var md5 = crypto.createHash("md5");
        md5.update(str);
        return md5.digest("hex");
    }
    return false;
};
MD5Checker.create = function(md5Path, ignorePath){
    return new MD5Checker(md5Path, ignorePath);
}

MD5Checker.prototype.isChange = function (path,update) {
    update = update != false;
    var md5 = "";
    if( common.isDirectory(path) ) {
        common.readFiles( path, function(filePath){
            md5 += MD5Checker.fileMd5(filePath) + "|";
        });
        md5 = MD5Checker.strMd5(md5);
    } else {
        md5 = MD5Checker.fileMd5(path);
    }
    var key = path;
    if (this.ignorePath) {
        key = path.replace(new RegExp(this.ignorePath, "ig"), "");
    }
    if (!this.md5List[key] || this.md5List[key] != md5) {
        console.log("md5:", this.md5List[key], md5, key)
        if(update){
            this.md5List[key] = md5;
        }
        return true;
    }
    return false;
};
MD5Checker.prototype.save = function() {
    fs.writeFileSync(this.md5Path, JSON.stringify(this.md5List), "utf-8");
}
module.exports = MD5Checker;