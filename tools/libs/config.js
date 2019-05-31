/**
 * 合并所有配置表
 */

var fs = require('fs-extra');
var base_config = require('./../config/base_config');


var config = {};
for( var name in base_config ) {
    config[name] = base_config[name];
}

//使用方便，定义几个全局的变量
global.MD5_PATH = config["paths"]["md5_path"];
global.PROJECT_PATH = config["paths"]["project_path"];
global.RESOURCE_PATH= config["paths"]["resource_path"];

fs.mkdirsSync(PROJECT_PATH);
fs.mkdirsSync(MD5_PATH);

global.config = config;

function formatData( data ) {    
    var _formatData = function(d, k) {         
        var t = typeof d[k];
        switch( t ) {
            case "string":
                d[k] = d[k].replace( /\{version\}/ig, args.version );
                d[k] = d[k].replace( /\{lang\}/ig, args.lang );
                break;
            case "number":
            case "boolean":
            case "function":
                break;
            default:
                formatData(d[k]);
                break;
        }
    };
    for( var p in data ) {
        if( data[p] instanceof Array ) {
            data[p].forEach( function(d, idx){
                _formatData(data[p], idx);
            } )
        } else {         
            _formatData(data, p);
        }
    }
};

var files = fs.readdirSync('./config');
files.forEach(function(file){
    if(file!="base_config.js" && file.indexOf("_config.js")!=-1 ) {
        var data = require("../config/" + file );
        config[ file.replace("_config.js", "" ) ] = data;
    }
});

formatData(config);
