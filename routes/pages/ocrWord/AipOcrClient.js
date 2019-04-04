'use strict';
const AipOcrClient = require("baidu-aip-sdk").ocr;
const HttpClient = require("baidu-aip-sdk").HttpClient;
const fs = require('fs');
const APP_ID = "15938069";
const API_KEY = "uzvDViPD8rNFEXahg3U1T8mw";
const SECRET_KEY = "Y9ZNcDretq1ow0SSmfHVhWwQEs1Urdvl";

// 新建一个对象，建议只保存一个对象调用服务接口
const client = new AipOcrClient(APP_ID, API_KEY, SECRET_KEY);

function Index(req, res, next) {
   
    res.render("index",{title:"examindex"},function (err, html) {
        res.write(html);
    }); 
    console.log('start read file');
    const image = fs.readFileSync("public/images/tech.png").toString("base64");
    console.log('end read file');
  
  
    // 如果有可选参数
    var options = {};
    options["language_type"] = "CHN_ENG";
    options["detect_direction"] = "true";
    options["detect_language"] = "true";
    options["probability"] = "true";

    // 1、调用通用文字识别, 图片参数为本地图片
    client.generalBasic(image,options).then(function(result) {
        console.log(JSON.stringify(result));
        res.write(`<script>result(${JSON.stringify(result)})</script>`);
        res.end()
    }).catch(function(err) {
        // 如果发生网络错误
        console.error(err);
    });

    
    

    
    // // 调用通用文字识别, 图片参数为远程url图片
    // client.generalBasicUrl("http://aip.bdstatic.com/portal/dist/1554204548119/ai_images/technology/ocr-general/general/tech-general-original-scanned.png",options).then(function(result) {
    //     console.log(JSON.stringify(result));
    //     res.write(`<script>result(${JSON.stringify(result)})</script>`);
    //     res.end()
    // }).catch(function(err) {
    //     // 如果发生网络错误
    //     console.log(err);
    // });
}

module.exports = Index;
