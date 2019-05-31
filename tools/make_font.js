var fs = require('fs-extra');
var common = require("./libs/common.js");
var SpriteSheetMaker = require("./libs/SpriteSheetMaker");
var ImageUtil = require('./libs/ImageUtil');

var md5Checker = require("./libs/MD5Checker").create(MD5_PATH + "font_md5.json");

var pathCfg = config["make_font"];
var fromDir = RESOURCE_PATH + pathCfg["from"];
var toDir = PROJECT_PATH + pathCfg["to"];
var listTpl = common.loadText(pathCfg["template_list"]);
var itemTpl = common.loadText(pathCfg["template_item"]);
fs.mkdirsSync(toDir);

md5Checker.ignorePath = fromDir;//不处理主目录

var files = fs.readdirSync(fromDir);
files.forEach(function(path){
    if(!fs.statSync(fromDir+path).isDirectory()){
        console.log(fromDir+path+' 不是文件目录，格式不对,请参照其他字体目录结构');
        return;
    }

    var change = !fs.existsSync(toDir + path + ".fnt") || !fs.existsSync(toDir + path+".png");
    common.readFiles( fromDir+path, function( p ) {
        var reg = pathCfg.patten ? new RegExp(pathCfg.patten, "ig") : null;
        if( reg && !reg.test(p) ) {
            return ;
        }
        change = md5Checker.isChange(p) || change;
    }); 

    if (change){
        SpriteSheetMaker.create(fromDir+path, toDir+path+".fnt", toDir + path+".png", listTpl, itemTpl, {trim:false, keyPrefix:2, patten:pathCfg.patten} );
        ImageUtil.pngquant(toDir+path+".png");
    }
});

md5Checker.save();