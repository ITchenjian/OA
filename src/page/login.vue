<template>
  	<div class="loginbody">
        <div class="systemlogo"></div>
        <form action="#" method="post">            
            <div class="loginbox clearfix">
                <div class="input">
                    <h1>物联网应用账户登录</h1>
                    <div class="form_tip" id="tips">
                        
                    </div>
                    <ul>
                        <li class="logins">
                            <input autofocus="autofocus" class="loginuser" id="username" name="" v-model="loginForm.username"/>
                        </li>
                        <li class="form_tip" id=""></li>
                        <li class="logins loginpsd">
                            <input class="loginpwd" id="password" name="password" v-model="loginForm.password"/>

                        </li>
                        <li class="reset clearfix dn">
                            <div class="fl backpsd">
                                <a href="./code.html">找回密码</a>
                            </div>
                            <div class="fr register">
                                <a href="./register.html">新用户注册</a>
                            </div>
                        </li>
                        <li class="form_tip" id=""></li>
                        <li>
                            <button type="button" class="btnlogin" id="login" name="#" @click="submitForm" @keyup="handleKeydown($event)">登&nbsp;&nbsp;录</button>
                        </li>
                    </ul>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
	import md5 from 'js-md5';
	// import {mapActions, mapState} from 'vuex'

	export default {
	    data(){
			return {
				loginForm: {
					username: '',
					password: '',
				},
				msg:{
					error:"用户名或密码错误",
					empty:"用户名或密码为空"
				}
			}
		},
		mounted(){
			console.log(md5);
			
		},
		computed: {
			
		},
		methods: {
			submitForm(){
				var _this=this;
				if(this.loginForm.username==""||this.loginForm.password==""){
			        $("#tips").text(this.msg.empty);

			    }else{
			        $.ajax({
			            url:this.get_api_url(),
			            
			            async:true,
			            cache:false,
			            // timeout:2000,
			            type:"post",
			            dataType:"json",
			            data: {
			                params:'{"api_name":"login","params":{"username":"'+this.loginForm.username+'","password":"'+md5(md5(this.loginForm.password)+this.loginForm.username)+'"}}'
			            },
			            contentType:"application/x-www-form-urlencoded;charset=utf-8", 
			            success:function(data,status,xhr){
			                console.log(data);
			                if(data.code==100){
			                    console.log(data);
			                    sessionStorage.setItem("user_id",data.result.userId);
			                    sessionStorage.setItem("userName",data.result.userName);
			                    sessionStorage.setItem("userType",data.result.userType);
			                    _this.$router.push('main');
			                    
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
			},
			handleKeydown:function(ev){
				 alert('你按回车键了');  
				if(ev.keyCode == 13){  
                    this.submitForm()
                }
			}
		},
		watch: {
			
		}
	}
</script>

<style scoped>
	@import '../assets/css/login.css';
	
</style>