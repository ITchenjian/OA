<template>
	<div>
		<!-- <div>
			<el-autocomplete
			  v-model="form.input2"
			  :fetch-suggestions="querySearchAsync"
			  placeholder=""
			  @select="handleSelect(e)"
			></el-autocomplete>
		</div> -->
		<form action="http://192.168.1.25:7367/oa/upload/uploadFiles.html" method="get" enctype="multipart/form-data">
			<input type="file" name="file_name" id="">
			<input type="text" name="text_name" id="">
			<input type="submit" value="ddf">
		</form>

		<el-button type="text" @click="dialogFormVisible = true">打开嵌套表单的 Dialog</el-button>
		
		<el-dialog title="收货地址" :visible.sync="dialogFormVisible" width="430px" @open="openDialog" @close="closeDialog">
		 	<el-form ref="form" label-position="right" :model="form" :rules="rules" :label-width="formLabelWidth" id="form">
		    	<el-form-item label="活动名称" prop="name">
		    		<el-col :span="18">
		      			<el-input v-model="form.name" auto-complete="off"></el-input>
		      		</el-col>
		    	</el-form-item>
		    	<el-form-item label="活动区域" prop="region">
		      		<el-select v-model="form.region" placeholder="请选择活动区域">
		        		<el-option label="区域一" value="shanghai"></el-option>
		        		<el-option label="区域二" value="beijing"></el-option>
		      		</el-select>
		    	</el-form-item>
				<el-form-item label="密码" prop="pass">
					<el-col :span="18">
    					<el-input type="password" v-model="form.pass" auto-complete="off"></el-input>
    				</el-col>
  				</el-form-item>
  				<el-form-item label="确认密码" prop="checkPass">
  					<el-col :span="18">
    					<el-input type="password" v-model="form.checkPass" auto-complete="off"></el-input>
    				</el-col>
  				</el-form-item>
  				<el-form-item label="邮箱" prop="email">
		    		<el-col :span="18">
		      			<el-input v-model="form.email" auto-complete="off"></el-input>
		      		</el-col>
		    	</el-form-item>

		    	<el-form-item label="验证码" prop="verifi">
		    		<el-col :span="18">
		      			<el-input v-model.number="form.verifi" auto-complete="off"></el-input>
		      		</el-col>
		      		<el-col :span="5" style="margin-left:6px;">
		      			<el-button style="padding:12px 15px;" size="" @click.prevent="">验证码</el-button>
		      		</el-col>
		    	</el-form-item>
				
				<el-form-item label="复合型">
		    		<el-col :span="18">
		      			<el-input v-model="form.input1" auto-complete="off">
		      				<template slot="append">m/s</template>
		      			</el-input>
		      		</el-col>
		    	</el-form-item>

				<el-form-item label="模糊查询">
		    		<el-col :span="18">
		      			<el-autocomplete
						  v-model="form.input2"
						  :fetch-suggestions="querySearchAsync"
						  placeholder=""
						  @select="handleSelect"
						></el-autocomplete>
		      		</el-col>
		    	</el-form-item>
		    	<!-- <el-form-item label="可输入sel">
		    		<el-select
					    v-model="value9"
					    multiple
					    filterable
					    remote
					    reserve-keyword
					    placeholder="请输入关键词"
					    :remote-method="remoteMethod"
					    :loading="loading">
					    <el-option
					      v-for="item in options4"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value">
					    </el-option>
					</el-select>
		    	</el-form-item> -->
				
				<el-form-item label="文件">
					<el-col :span="18">
						<el-input type="file" auto-complete="off"></el-input>
						<!-- <input type="file" name="" id="" class="el-input__inner"> -->
					</el-col>
				</el-form-item>
			</el-form>
		  	<div slot="footer" class="dialog-footer">
		    	<el-button @click="dialogFormVisible = false">取 消</el-button>
		    	<el-button type="primary" @click="submitForm('form')">确 定</el-button>
		 	</div>
			
		</el-dialog>
	</div>
</template>
<script>
	export default {
		name:"",
		data:function(){
			var validatePass = (rule, value, callback) => {
		        if (value === '') {
		          	callback(new Error('请输入密码'));
		        } else {
		          	if (this.form.checkPass !== '') {
		            	this.$refs.form.validateField('checkPass');
		          	}
		          	callback();
		        }
		    };
		    var validatePass2 = (rule, value, callback) => {
		        if (value === '') {
		          	callback(new Error('请再次输入密码'));
		        } else if (value !== this.form.pass) {
		          	callback(new Error('两次输入密码不一致!'));
		        } else {
		          	callback();
		        }
		    };

		    var verifiCode = (rule, value, callback) => {
		        if (value === '') {
		          	callback(new Error('请输入验证码'));
		        } else {
		        	this.getVerifi(callback)
		          	
		        }
		    };

			return{
		        dialogFormVisible: false,
		        form: {
		          	name: '',
		          	region: '',
		          	date1: '',
		          	date2: '',
		          	delivery: false,
		          	type: [],
		          	resource: '',
		          	desc: '',
		          	pass:'',
		          	checkPass:'',
		          	email:'',
		          	verifi:'',

		          	input1:'',
		          	input2:'',
		          	input3:''
		        },
		        rules:{
		        	name: [
			            { required: true, message: '请输入活动名称', trigger: 'blur' },
			            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
			        ],
			        region: [
            			{ required: true, message: '请选择活动区域', trigger: 'change' }
          			],
          			pass: [
			            { required: true, validator: validatePass, trigger: 'blur' }
			        ],
			        checkPass: [
			            { required: true, validator: validatePass2, trigger: 'blur' }
			        ],
			        email: [
			            { required: true, message: '请输入邮箱地址', trigger: 'blur' },
      					{ type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
			        ],
			        verifi:[
			            // { required: true, message: '请输入验证码', trigger: 'blur' },
      					{ type: 'number', validator:verifiCode, trigger: ['blur'] }
			        ]
		        },
		        formLabelWidth: '100px'
			}
		},
		methods:{
			getVerifi:function(callback){
				$.ajax({
					url:this.get_api_urle(),
					async:false,
					cache:false,
					// timeout:2000,
					type:"post",
					dataType:"json",
					data: {
				    	params:'{"api_name":"getListCard","params":{"page_num":"0","page_limit":"0","mag_num":""}}'
				    },
					contentType:"application/x-www-form-urlencoded;charset=utf-8", 
					beforeSend:function(xhr){
						// parent.modal_loading("正在获取数据！");
					},
					success:function(data,status,xhr){
						// parent.modal_loading("");
						// jump_index(data);
						if(data.code!=100) return;
						callback();
					},
					error: function (a, b, c) {
						// parent.modal_loading("error");
					 	console.log(c);
					}
					 
				});
			},
			querySearchAsync:function(queryString, callback){
				var _this=this;
				$.ajax({
					url:this.get_api_urle(),
					async:false,
					cache:false,
					// timeout:2000,
					type:"post",
					dataType:"json",
					data: {
				    	params:'{"api_name":"getListCard","params":{"page_num":"0","page_limit":"0","mag_num":"'+queryString+'"}}'
				    },
					contentType:"application/x-www-form-urlencoded;charset=utf-8", 
					beforeSend:function(xhr){
						// parent.modal_loading("正在获取数据！");
					},
					success:function(data,status,xhr){
						// parent.modal_loading("");
						// jump_index(data);
						if(data.code!=100) return;
						for(var i of data.result.items){
							// i.value=i.cardNumber;
							i.value=i.name;
						}
						callback(data.result.items)
					},
					error: function (a, b, c) {
						// parent.modal_loading("error");
					 	console.log(c);
					}
					 
				});
			},
			handleSelect:function(item){
				console.log(item);
			},	
			submitForm:function(formName){
				var _this=this;
				this.$refs[formName].validate(function(valid,noStri){
					console.log(valid,noStri);
					if(valid){
						_this.dialogFormVisible=false;

					}else{
						_this.dialogFormVisible=true;
						console.log(_this.form)
					}
				})
			},
			openDialog:function(){
				console.log("打开")
			},
			closeDialog:function(){
				this.$refs['form'].resetFields();
			}
		}
    }
</script>
<style scoped>
	.el-autocomplete{
		width:217px;
	}
</style>