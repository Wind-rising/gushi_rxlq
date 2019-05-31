
var fs = require('fs-extra');
var common = require("./common");
var ImageUtil = require("./ImageUtil");
var images = require("images");
var MaxRectsBinPack = require("./MaxRectsBinPack");
        
/**
 * 合图
 * @param {string} fromDir 小图片目录
 * @param {string} configPath 合图配置文件路径
 * @param {string} imagePath 合图图片文件路径
 * @param {string} configTpl 合图配置文件模板
 * @param {string} frameTpl 合图每个小图配置模板
 * @param {Object} params  { trim:去掉透明区域,默认true, 
 *                           scale:缩放, 
 *                           padding:图片间隔,默认为1, 
 *                           keyPrefix:合图中每张图的key前缀（0只保留图片名，1保留目录[默认], 2字体，只保留文件名中的最后一个字符，其他值直接加到key前面）,
 *                           sliceFrame:减少图片帧数
 *                           sliceFrameExclude:不处理减帧的正则
 *                           rotated:旋转图片,默认false,
 *                           patten:过滤正确文件名的正则表达式,
 *                           del:删除源目录，默认false
 *                           pngquant:是否使用pngquant压缩图片，默认true
 *                           method:默认-1，会全部遍历一次找到最小面积的处理
 *                                  BEST_AREA_FIT = 2; ///< -BAF: Positions the Rectangle into the smallest free Rectangle into which it fits.
                                    BEST_LONG_SIDE_FIT = 1; ///< -BLSF: Positions the Rectangle against the long side of a free Rectangle into which it fits the best.
                                    BEST_SHORT_SIDE_FIT = 0; ///< -BSSF: Positions the Rectangle against the short side of a free Rectangle into which it fits the best.
                                    BOTTOM_LEFT_RULE = 3; ///< -BL: Does the Tetris placement.
                                    CONTRACT_POINT_RULE = 4; ///< -CP: Choosest the placement where the Rectangle touches other Rectangles as much as possible.
 *                          }
 */        
function SpriteSheetMaker(fromDir, configPath, imagePath, configTpl, frameTpl, params) {
    params = params || {};
    this._fromDir = fromDir;
    this._configPath = configPath;
    this._imgPath = imagePath;
    this._CONFIG_TPL = configTpl;
    this._FRAME_TPL = frameTpl;
    this._keyPrefix = params.keyPrefix==undefined ? 1 : params.keyPrefix;
    this._trim = params.trim!=false;
    this._padding = params.padding || 1;
    this._rotated = params.rotated==true;
    this._patten = params.patten;
    this._sliceFrame = params.sliceFrame;
    this._sliceFrameExclude = params.sliceFrameExclude
    this._pngquant = params.pngquant!=false;
    this._del = params.del;
    this._method = params.method==undefined ? -1 : params.method;
}
SpriteSheetMaker.prototype.make = function(){
    if( !fs.existsSync(this._fromDir) ) {
        console.log("folder not exists:" + this._fromDir);
        return ;
    }

    var sumArea = 0;
    var rectList = [];
    var imgMap = {};
    var padding = this._padding * 2;
    var files = [];

    var that = this;
    var folderFiles = {};
    common.readFiles( this._fromDir, function( path ) {
        var infos = common.getFileType(path);        
        if(infos.type=="png"||infos.type=="jpg") {
            var reg = that._patten ? new RegExp(that._patten, "ig") :null;
            var arr = path.split("/");
            var file = arr.pop();
            if( reg && !reg.test(file)) {
                return;
            }
            var folder = arr.join("/");
            var img = images(path);
            var size = img.size();
            if(!folderFiles[folder]) {
                folderFiles[folder] = [];
            }
            folderFiles[folder].push(path);
            rectList.push({
                x:0,y:0,
                width:size.width+padding, 
                height:size.height+padding,
                offsetX:0,
                offsetY:0,
                offsetY2:0,
                path:path,
                colorRect:{
                    x:0, y:0, width:size.width, height:size.height
                }
            });

            imgMap[path] = img;
            imgMap[path+"_ori"] = img;
            sumArea += size.width * size.height;  
            files.push(path);
        }
    });

    //减帧，保留N帧以内
    if( this._sliceFrame ) {
        var tmpFiles = [];
        var tmpRects = [];
        var exclude = this._sliceFrameExclude ? new RegExp(this._sliceFrameExclude, "ig") : null;
        for( var folder in folderFiles ) {
            var list = folderFiles[folder];
            var range = Math.ceil( list.length / this._sliceFrame );//每一个rang范围内的帧只保留一张
            if( exclude && exclude.test(folder) ) {
                range = 1;
            }
            var i=0;
            for(; i<list.length; i+=range) {
                var path = list[i];
                tmpFiles.push(path);
                var idx = files.indexOf(path);
                tmpRects.push(rectList[idx]);
            }
            //最后一帧必须保留
            var path = list[list.length-1];
            if( tmpFiles[tmpFiles.length-1]!=path ) {
                tmpFiles.push(path);
                var idx = files.indexOf(path);
                tmpRects.push(rectList[idx]);
            }
        }
        files = tmpFiles;
        rectList = tmpRects;
    }
    //去除透明区
    if( this._trim ) {
        var count = 0;
        files.forEach( function(path){
            ImageUtil.getColorRect(path, function(colorRect, imgPath){
                if(colorRect ){
                    var img = images(imgPath);
                    var size = img.size();
                    var newImg = images.copyFromImage(img, colorRect.x, colorRect.y, colorRect.width, colorRect.height);
                    
                    var rect = null;
                    for( var i=0; i<rectList.length; i++ ) {
                        if( rectList[i].path == imgPath ) {
                            rect = rectList[i];
                            break;
                        }
                    }
                    sumArea -= (rect.width-padding)*(rect.height-padding);
                    rect.width = colorRect.width+padding;
                    rect.height = colorRect.height+padding;
                    rect.offsetX = colorRect.width*0.5+colorRect.x - size.width*0.5;
                    rect.offsetY = colorRect.height*0.5+colorRect.y - size.height*0.5;
                    rect.offsetY2 = -rect.offsetY;
                    rect.colorRect = colorRect;
                    imgMap[imgPath] = newImg;
                    sumArea += colorRect.width * colorRect.height;
                } 
                count++;
                if(count==files.length) {
                    that._gen(rectList, imgMap, sumArea);
                }
            });
        } )
    } else {
        setTimeout(function () {
            this._gen(rectList, imgMap, sumArea);
        }.bind(this),100);
    }
}
SpriteSheetMaker.prototype._getMaxRects = function(fitw, fith, rectList, method, num) {
    var flag = 1;
    var found = false;
    //多次尝试，直到范围可以放下所有图片
    var maxRects = new MaxRectsBinPack(fitw, fith, this._rotated);
    while( true ) {
        found = true;
        maxRects.init(fitw, fith, this._rotated);
        for(var i=0 ;i<rectList.length; i++) {
            var rect = rectList[i];
            rect = maxRects.insert(rect.width, rect.height, method);
            if( rect.width==0 || rect.height==0 ) {
                found = false;
                break;
            }
        }
        
        if( found ) {
            break;
        }
        if( flag==1 ) {
            fitw = Math.pow(2, num++);
            flag = 2;
        } else {
            flag = 1;
            fith = Math.pow(2, num);
        }
    }
    var w=0;
    var h=0;
    maxRects.init(fitw, fith, this._rotated);
    for(var i=0 ;i<rectList.length; i++) {
        var rect = rectList[i];
        var newRect = maxRects.insert(rect.width, rect.height, method);
        newRect.path = rect.path;
        newRect.offsetX = rect.offsetX;
        newRect.offsetY = rect.offsetY;
        newRect.offsetY2 = rect.offsetY2;
        newRect.colorRect = rect.colorRect;
        w = Math.max(w, newRect.x+newRect.width);
        h = Math.max(h, newRect.y+newRect.height);
    }
    maxRects.maxWidth = w;
    maxRects.maxHeight = h;
    return maxRects;
}
SpriteSheetMaker.prototype._gen = function(rectList, imgMap, sumArea) {
    var num = Math.floor(Math.sqrt(sumArea));
    num = num.toString( 2 ).length;
    var fitw = Math.pow(2, num);
    var fith = Math.pow(2, num);
    var maxRects = null;
    if(this._method!=-1) {
        maxRects = this._getMaxRects(fitw, fith, rectList, this._method, num);
    } else {
        for( var i=0; i<4; i++) {            
            var tmp = this._getMaxRects(fitw, fith, rectList, i, num);
            if(!maxRects) {
                maxRects = tmp;
            } else {
                if( maxRects.maxWidth * maxRects.maxHeight > tmp.maxWidth*tmp.maxHeight ) {
                    maxRects = tmp;
                }
            }
        }
    }
    if(maxRects.usedRectangles.length==0) {
        console.log("nothing to composite");
        return ;
    }
    this._out(maxRects.maxWidth, maxRects.maxHeight, maxRects, imgMap);
}
SpriteSheetMaker.prototype._out = function(w,h, maxRects, imgMap) {
    console.log(this._imgPath, w,h)
    var imgOut = images(w, h);

    var maxHeight = 0;
    var frames = "";
    var len = maxRects.usedRectangles.length;
    for (var i = 0; i < len; i++) {
        var rect = maxRects.usedRectangles[i];
        var img = imgMap[rect.path];
        var size = img.size();
        
        
        maxHeight = Math.max(maxHeight, size.height);
        var rectW = rect.width - this._padding*2;
        var rectH = rect.height - this._padding*2;
        var rotated = false;
        if(rectW!=rectH && rectW==size.height &&rectH==size.width) {
            //旋转90度
            rotated = true;
        }
        var oriImg = imgMap[rect.path + "_ori"];
        var pathArr = rect.path.replace(/[\\]+/ig, "/").replace(/[\/]+/ig, "/").split("/");        
        var cfg = {
            frameX:rect.x+this._padding, 
            frameY:rect.y+this._padding, 
            frameWidth: rect.width-this._padding*2, 
            frameHeight: rect.height-this._padding*2,
            offsetX: rect.offsetX,
            offsetY: rect.offsetY,
            offsetY2: rect.offsetY2,
            colorRectX: rect.colorRect.x,
            colorRectY: rect.colorRect.y,
            colorRectWidth: rect.colorRect.width,
            colorRectHeight: rect.colorRect.height,
            width:oriImg.width(),
            height:oriImg.height(),
            rotated: rotated,
            frameName:pathArr[pathArr.length-1]
        }
        switch(this._keyPrefix) {
            case 0:
                break;
            case 1:
                cfg.frameName = rect.path.replace(this._fromDir, "");
                break;
            case 2://生成font字体文件
                var name = cfg.frameName.split(".").shift();
                cfg.frameName = name.charAt(name.length-1);
                cfg.charCode = cfg.frameName.charCodeAt(0);
                break;    
            default:
                cfg.frameName = this._keyPrefix + cfg.frameName;
                break;        
        }
        cfg.frameNameNoDot = cfg.frameName.replace(/\./ig, "_");
        frames += common.formatStr(this._FRAME_TPL, cfg) + "\n";
        imgOut.draw(img, rect.x + this._padding, rect.y + this._padding);
    }
    var texConfig = common.formatStr(this._CONFIG_TPL, {
        maxHeight:maxHeight,
        padding:this._padding,
        count:len,
        textureName: this._imgPath.split("/").pop(),
        name:common.getFileType(this._imgPath).name,
        frames:frames,
        width:w,
        height:h
    });
    fs.writeFileSync(this._configPath, texConfig, "utf-8");
    imgOut.save(this._imgPath);
    ImageUtil.pngquant(this._imgPath);
    if( this._del ) {
        fs.removeSync(this._fromDir);
    }
    for(var p in imgMap) {
        delete imgMap[p];
    }
    nextQueue();
};

// module.exports = SpriteSheetMaker;
var _onFinish = null;
exports.setFinishCallback = function( cb ) {
    _onFinish = cb;
}
var makerQueue = [];
var working = 0;
function processQueue() {
    if( makerQueue.length==0 ) {
        if(_onFinish) {
            _onFinish();
        }
        return ;
    }
    while( working<1 ) {
        working++;
        makerQueue.shift().make();
    }
}
function nextQueue() {
    working--;
    processQueue();
}
/**
 * 合图
 * @param {string} fromDir 小图片目录
 * @param {string} configPath 合图配置文件路径
 * @param {string} imagePath 合图图片文件路径
 * @param {string} configTpl 合图配置文件模板
 * @param {string} frameTpl 合图每个小图配置模板
 * @param {Object} params  { trim:去掉透明区域,默认true, 
 *                           scale:缩放, 
 *                           padding:图片间隔,默认为1, 
 *                           keyPrefix:合图中每张图的key前缀（0只保留图片名，1保留目录[默认], 2字体，只保留文件名中的最后一个字符，其他值直接加到key前面）,
 *                           sliceFrame:减少图片帧数
 *                           rotated:旋转图片,默认false,
 *                           patten:过滤正确文件名的正则表达式
 *                           method:默认-1，会全部遍历一次找到最小面积的处理
 *                                  BEST_AREA_FIT = 2; ///< -BAF: Positions the Rectangle into the smallest free Rectangle into which it fits.
                                    BEST_LONG_SIDE_FIT = 1; ///< -BLSF: Positions the Rectangle against the long side of a free Rectangle into which it fits the best.
                                    BEST_SHORT_SIDE_FIT = 0; ///< -BSSF: Positions the Rectangle against the short side of a free Rectangle into which it fits the best.
                                    BOTTOM_LEFT_RULE = 3; ///< -BL: Does the Tetris placement.
                                    CONTRACT_POINT_RULE = 4; ///< -CP: Choosest the placement where the Rectangle touches other Rectangles as much as possible.
 *                          }
 */
exports.create = function(fromDir, configPath, imagePath, configTpl, frameTpl, params) {
    var maker = new SpriteSheetMaker(fromDir, configPath, imagePath, configTpl, frameTpl, params);
    makerQueue.push(maker);
    processQueue();
};