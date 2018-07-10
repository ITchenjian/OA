/*
* @Author: Administrator
* @Date:   2017-10-11 09:14:10
* @Last Modified by:   Administrator
* @Last Modified time: 2018-05-03 15:52:37
*/
jQuery.support.cors = true;//支持跨域
/*表单验证*/
var form_data={};
var msg={
	error:"用户名或密码错误",
	empty:"用户名或密码为空"
};
$("#login").click(function(event) {
	logins();
});

document.onkeydown = function(e){
    var ev = document.all ? window.event : e;
    if(ev.keyCode==13) {
        logins();
     }
}    


function logins() {
    form_data.name=$("#username").val().trim();
    form_data.psd=$("#password").val().trim();
    if(form_data.name==""||form_data.psd==""){
        $("#tips").text(msg.empty)
    }else{
        // console.log(form_data);
        // return window.location.href="./main.html";
        $.ajax({
            url:get_api_url(),
            
            async:true,
            cache:false,
            // timeout:2000,
            type:"post",
            dataType:"json",
            data: {
                // params:'{"api_name":"web_login","params":{"username":"'+form_data.name+'","password":"'+form_data.psd+'"}}'
                params:'{"api_name":"web_login","params":{"username":"'+form_data.name+'","password":"'+hex_md5(hex_md5(form_data.psd)+form_data.name)+'"}}'
            },
            contentType:"application/x-www-form-urlencoded;charset=utf-8", 
            success:function(data,status,xhr){
                console.log(data);
                if(data.code==100){
                    console.log(data);
                    sessionStorage.setItem("user_id",data.result.userId);
                    sessionStorage.setItem("userName",data.result.userName);
                    sessionStorage.setItem("userType",data.result.userType);
                    
                    location.href="./main.html"
                }else{
                    $("#tips").text(data.msg)
                }
             
            },
            error: function (a, b, c) {
                alert("网络错误！");
                console.log(c);
             }
             
        });

    }
}
