let fs = require('fs-extra');
let file = "mailcode.json"
fs.createFile(file, function(e){
	fs.outputFile(file, getData(), function(err) {
	  	console.log(err) // => null 
	  fs.readFile(file, 'utf8', function(err, data) {
	    console.log(data) // => hello! 
	  })
	})
})
let outType = "";
let subType = "";
function getData(){
	let data = subCreate();
	let outData = null;
	for(let i = 0;i<100;i++){
		let sub = null;
		switch(judgeType(data)){
			case "number":
			case "string":
				sub = dataAdd(data,i);
			break;
			case "object":
				if(subType=='A'){
					sub = data;
				}else{
					sub = {};
					for(let j in data){
						if(j == "RewardVar"){
							sub[j] = data[j]
						}else{
							sub[j] =  dataAdd(data[j],i);
						}
					}
				}
			break;
		}
		if(outType == "A"){
			outData||(outData = []);
			outData.push(sub);
		}else{
			outData||(outData = {});
			outData[i+""] = sub;
		}
	}
	return JSON.stringify(outData);
}
function dataAdd(data,i){
	switch(judgeType(data)){
		case "number":
		case "string":
			return data + i;
		break;
		case "object":
			return data;
		break;
	}
}
function judgeType(data){
	return typeof data;
}
function subCreate(){
	return {
		"Title":"Title"
	}
}
// 