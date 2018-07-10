/*
* @Author: Administrator
* @Date:   2017-06-19 16:42:48
* @Last Modified by:   Administrator
* @Last Modified time: 2018-05-08 11:01:54
*/

// 'use strict';
var href=window.location.href;
var protocol=window.location.protocol;
var host=window.location.host;
var port=window.location.port;
var url=protocol+"//"+host+"/parking/";

// var url = "http://192.168.1.25:7397/parking/";
// var url = "http://120.78.173.166:7397/parking/";
// var url = "http://192.168.1.25:7397/parking/";
// var url = "http://192.168.1.25:7390/parking/";
// var url = "http://120.78.173.166:7390/parking/";
// var url = "http://192.168.1.25:7390/parking/";
var url = "http://120.78.173.166:7397/parking/";

export function get_api_url(api_name){
    return url+"web/web_interface.html";
}

function get_api_urle(api_name){
    return url+"web/bj_web_interface.html";
}

function get_api_urlo(api_name){
    return url+"web/netty_interface.html";
}

function get_api_urly(api_name){
    return url+"web/netty_interface.html";
}

function get_api_bkg(api_name){
    return url+"web/uploadBackgroundImage.html";
}

function get_api_set(api_name){
    return url+"web/addDevType.html";
}

//跳转index
function jump_index(data){
    if(data.code==130){
        window.parent.location.href="../../index.html";
        return;
    }
}

function jump_main(data){
    if(data.code==130){
        window.parent.location.href="./index.html";
        return;
    }
}
