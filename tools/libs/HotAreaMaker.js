
var fs = require('fs-extra');
var common = require("./common");
var images = require("images");
var getPixels = require("get-pixels")
var md5Checker = require("./MD5Checker").create(MD5_PATH + "hotarea_md5.json");

function make(fromDir, dataCfg, keyPrefix, blockWidth, blockHeight, percent, saveImg) {    
    // console.log(fromDir)
    if(!blockWidth) {
        blockWidth = 20;
    }
    if(!blockHeight) {
        blockHeight = 20;
    }
    if(!percent) {
        percent = 0.2;
    }
    // var dataCfg = common.loadJson(dataPath) || {};
    dataCfg["blockWidth"] = blockWidth;
    dataCfg["blockHeight"] = blockHeight;
    var pathList = [];
    var pixelsMap = {};
    var needSave = false;
    var checkPixels = function(){
        pathList.forEach( function(path, idx){
            var key = keyPrefix || "";
            if( path==fromDir ) {
                key += path.split("/").pop();
            } else {
                key += path.replace(fromDir, "");
            }
            var changed = md5Checker.isChange(path);
            if(!dataCfg[key]) {
                changed = true;
            }
            if(!changed){
                return ;
            }
            var img = images(path);
            var width = img.width();
            var height = img.height();
            console.log("[HotAreaMaker]" + path + ":" + width + "," + height, key);
            var cw = Math.ceil( width/blockWidth ) + 1;
            var ch = Math.ceil( height/blockHeight ) + 1;
            var totalArea = blockWidth * blockHeight;
            var pixels = pixelsMap[path];
            var areaArr = [];
            var hotAreaImg = saveImg ? img : null;
            for( var x=0; x<cw; x++ ) {
                var polyDatas = [];
                areaArr.push(polyDatas);
                var startX = x * blockWidth;
                for( var y=0; y<ch; y++ ) {
                    var startY = y * blockHeight;
                    var colorCount = 0;
                    for( var m=startX, ex=startX + blockWidth; m<ex; m++ ) {
                        if( m>=width) {
                            colorCount += (ex-m)*blockWidth*percent;
                            break;
                        }
                        for( var n=startY, ey=startY + blockHeight; n<ey; n++ ) {
                            if( n>=height) {
                                colorCount += (ey-n)*percent;
                                break;
                            }
                            if (pixels.get(m, n, 3) > 0 ){
                                colorCount++;
                            }
                        }
                    }
                    var fill = colorCount/totalArea>percent ? 1 : 0;
                	polyDatas[ch - 1 -y] = fill;
                    if(fill==1 && saveImg) {
                        var block = images(blockWidth, blockHeight);
                        block.fill(255,0,0,100);
                        hotAreaImg.draw(block, startX, startY);
                    }
                }
            }
            dataCfg[key] = areaArr;
            if( saveImg ) {
                hotAreaImg.save(path.replace(".jpg", ".png").replace(".png", "_poly.png"));
            }
            needSave = true;
        });
        // if(needSave) {
        //     console.log("[HotAreaMaker]save to:" + dataPath);
        //     fs.writeFileSync(dataPath, JSON.stringify(dataCfg), "utf-8");
        // }
    }
    common.readFiles(fromDir, function(path){
        var infos = common.getFileType(path);
        if( infos.type!="png" && infos.type!="jpg") {
            return ;
        }
        if( !/^[a-zA-Z0-9_\-]+$/.test(infos.name) ) {
            return ;
        }  
        fs.removeSync(path.replace(".jpg", ".png").replace(".png", "_poly.png"));
        pathList.push(path);
    });
    if(pathList.length==0) {
        nextQueue();
        return ;
    }
    var count = 0;
    pathList.forEach( function(path) {
        getPixels(path, function (err, pixels) {            
            if( err ) {
                console.log(err);
            }
            pixelsMap[path] = pixels;
            count ++;
            if( count == pathList.length ) {
                checkPixels();
                nextQueue();
            }
        });        
    });
}

var makerQueue = [];
var working = 0;
var _onFinish;
function processQueue() {
    if( makerQueue.length==0 ) {
        if(_onFinish) {
            _onFinish();
        }
        return ;
    }
    while( working<1 ) {
        working++;
        make.apply(this,makerQueue.shift());
    }
}
function nextQueue() {
    working--;
    md5Checker.save();
    processQueue();
}
exports.setFinishCallback = function( cb ) {
    _onFinish = cb;
}
/**
 * 生成不规则图形的可点击热区，按照指定的象素值对图片进行区域划分，
 * 当有象素值的点超过区域面积一定百分比则为有效区域。
 * 有效区域值表示为1，无效区域值表示为0。生成的二维数组存放到json文件中
 * 
 * @param {string} fromDir 图片目录/路径
 * @param {string} dataCfg 数据
 * @param {string} keyPrefix 数据对应的key前缀，默认key=相对于fromDir下的文件路径
 * @param {number} blockWidth 区域宽,默认20
 * @param {number} blockHeight 区域高,默认20
 * @param {number} percent 验证百分比（1-100）,默认0.2
 */
exports.create = function(fromDir, dataCfg, keyPrefix, blockWidth, blockHeight, percent, saveImg) {
    makerQueue.push(arguments);
    processQueue();
}