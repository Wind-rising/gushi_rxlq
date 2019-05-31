
var fs = require('fs-extra');

/**
 * 参数解析
 */
global.DEV = true;

var argv = process.argv.splice(2);
var args = {
	platform:"dev",//平台
    lang:"zh",//语言
    varsion:'1.0.0',//版本号
};
for(var i=0; i<argv.length; i++) {
    var key = argv[i].replace(/\-/ig, "");
    var val = argv[i+1];
    if(!val || val[0]=="-") {
        val = "";
        continue;
    } else {
        i++;
    }
    
    args[key] = val;
}

for (var k in args) {
	console.log("args." + k +"="+args[k]);
}
global.args = args;