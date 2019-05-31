var common = require("./common");
var fs = require("fs-extra");
var images = require("images");
var getPixels = require("get-pixels");

/**
 * 检测是否支持png压缩。
 */
var isSupportPngquant = false;
if (process.platform == "win32") {
    isSupportPngquant = fs.existsSync("../pngquant/pngquant.exe");
} else {
    isSupportPngquant = fs.existsSync("/usr/local/bin/pngquant");
}

/**
 * png图片压缩，压缩后质量会有一定降低，但体积可以大大减少
 * @param {string} imgPath 压缩的png图片路径
 * @param {string} quality 压缩的质量范围，默认 10-90
 */
function pngquant(imgPath, quality) {
    if(true){
        return;
    }
    if (!isSupportPngquant) {
        return;
    }
    if(fs.statSync(imgPath).size < 10240 ) {
        console.log("图片小于10K，不处理压缩："+imgPath);
        return ;
    }
    var cmd = "pngquant";
    if (process.platform == "win32") {
        cmd = "\"pngquant\\pngquant\"";
    }
    if (!quality) {
        quality = "10-90";
    }
    cmd += " -f --ext .png --force --quality " + quality + " --speed 1 " + imgPath;
    //cmd += " -f --ext .png --force --strip --quality " + quality + " --speed 1 " + imgPath;
    common.exec(cmd);
}
/**
 * 获取图片非透明区域的矩形
 * @param {string} imgPath 
 * @param {Function} cb 
 */
function getColorRect(imgPath, cb) {
    getPixels(imgPath, function (err, pixels) {
        if (err) {
            console.log(err);
            cb(null, null);
            return;
        }
        // 获取图像的宽度和高度
        var trimAlpah = 0;
        var width = pixels.shape[0];
        var height = pixels.shape[1];
        var isTransparent = true;
        var rect = {
            x: 0,
            y: 0,
            width: width,
            height: height
        }
        // 扫描图片
        var minY = 0;
        for (var i = 0; i < height; i++) {
            isTransparent = true;
            for (var j = 0; j < width; j++) {// 行扫描
                var dip = pixels.get(j, i, 3);

                if (dip > trimAlpah) {
                    isTransparent = false;
                    break;
                }
            }
            if (isTransparent) {
                minY = i + 1;
            } else {
                break;
            }
        }
        if (minY == height) {
            //全图透明
            cb();
            return ;
        }
        var maxY = height - 1;

        for (var i = height - 1; i >= minY; i--) {
            isTransparent = true;
            for (var j = 0; j < width; j++) {// 行扫描
                var dip = pixels.get(j, i, 3);
                if (dip > trimAlpah) {
                    isTransparent = false;
                    break;
                }
            }
            if (isTransparent) {
                maxY = i - 1;
            } else {
                break;
            }
        }

        var minX = 0;
        for (var i = 0; i < width; i++) {
            isTransparent = true;
            for (var j = minY; j <= maxY; j++) {// 列扫描
                var dip = pixels.get(i, j, 3);
                if (dip > trimAlpah) {
                    isTransparent = false;
                    break;
                }
            }
            if (isTransparent) {
                minX = i + 1;
            } else {
                break;
            }
        }
        var maxX = width - 1;
        for (var i = width - 1; i >= minX; i--) {
            isTransparent = true;
            for (var j = minY; j <= maxY; j++) {// 列扫描
                var dip = pixels.get(i, j, 3);
                if (dip > trimAlpah) {
                    isTransparent = false;
                    break;
                }
            }
            if (isTransparent) {
                maxX = i - 1;
            } else {
                break;
            }
        }

        rect.x = minX;
        rect.width = maxX - minX + 1;
        rect.y = minY;
        rect.height = maxY - minY + 1;

        if (rect.width != width && (rect.width - width) % 2 != 0) {
            if (rect.x > 0) {
                rect.x--;
            }
            rect.width++;
        }
        if (rect.height != height && (rect.height - height) % 2 != 0) {
            if (rect.y > 0) {
                rect.y--;
            }
            rect.height++;
        }
        cb(rect, imgPath);
    });
}

/**
 * 创建缩略图
 * @param {string} srcFile 源图片路径
 * @param {string} dstFile 输出图片路径
 * @param {number} thumbSize 缩略图大小（取宽和高中最大的值匹配，另一个值等比例缩放）
 * @param {boolean} fit2n 默认true.  true。缩略图与原图比例会调整到可以被2整除的值。
 */
function createThumb(srcFile, dstFile, thumbSize, fit2n) {
    var img = images(srcFile);
    var size = img.size();
    var scale = 1;
    if (size.width > size.height) {
        scale = size.width / thumbSize;
    } else {
        scale = size.height / thumbSize;
    }
    if (fit2n != false) {
        scale -= Math.round(scale) % 2;
    }
    size.width = size.width / scale;
    size.height = size.height / scale;
    img.resize(size.width, size.height);
    img.save(dstFile, images.TYPE_PNG);

    pngquant(dstFile);
}
function toPng( srcFile, dstFile ) {
    var img = images(srcFile);
    img.save(dstFile, images.TYPE_PNG);
}
/**
 * 切图
 * @param {string} imgPath 图片路径
 * @param {number} tileWidth 切片的宽度
 * @param {number} tileHeight 切片的高度
 * @param {string} toDir 切片后图片保存的目录
 * @param {string} format 切片保存的文件格式, 默认为 {x}_{y}.png, {x}{y}会自动替换相应tile坐标
 * @param {boolean} isCocos 左下角0，0
 */
function splitMap(imgPath, tileWidth, tileHeight, toDir, format, isCocos) {
    console.log("[SplitMap]" + imgPath);
    if (!format) {
        format = "{x}_{y}.png";
    }
    var img = images(imgPath);

    var imgWidth = img.width();
    var imgHeight = img.height();
    
    var ycount = 0;
    var xcount = 0;
    var w2 = tileWidth;
    for (var x = 0; x < imgWidth; x += w2) {
        if (x + w2 > imgWidth) {
            w2 = imgWidth - x;
        }

        ycount = 0;
        var h2 = tileHeight;
        for (var y = 0; y < imgHeight; y += h2) {
            if (y + h2 > imgHeight) {
                h2 = imgHeight - y;
            }
            var newImg = images.copyFromImage(img, x, isCocos ? imgHeight-h2-y : y, w2, h2);
            var dstFile = toDir + "/" + format.replace("{x}", xcount).replace("{y}", ycount);
            newImg.save(dstFile);
            pngquant(dstFile);
            ycount++;
        }
        xcount++;
    }
}

/**
 * 
 * @param {string[]} imgPaths 图片路径数组，图片按照0-n叠加
 * @param {boolean} resize true:将1-n的图片尺寸重置为第0张一样的大小。
 */
function composite( imgPaths, outFile, resize ) {
    if(imgPaths.length==0) {
        return ;
    }
    var source = null;
    if( resize ) {
        source = images(imgPaths[0]);
        for(var i=1; i<imgPaths.length; i++) {
            var img = images(imgPaths[i]);
            img.resize(source.width(), source.height());
            source.draw(img, 0, 0);
        }
    } else {
        var w = 0, h=0;

        for( var i=0; i<imgPaths.length; i++) {
            var img = images(imgPaths[i]);
            w = Math.max(w, img.width());
            h = Math.max(h, img.height());
        }
        source = images(w, h);
        for(var i=0; i<imgPaths.length; i++) {
            var img = images(imgPaths[i]);
            source.draw(img, 0, 0);
        }
    }
    source.save(outFile);
}


exports.createThumb = createThumb;
exports.splitMap = splitMap;
exports.pngquant = pngquant;
exports.getColorRect = getColorRect;
exports.composite = composite;
exports.toPng = toPng;