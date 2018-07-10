<template>
  	<div>
  		<div class="navsearch boxbgcolor">
	        <ul class="nav-tabs" role="tablist">
	            <li role="presentation" class="active"><a href="javascript:;">查询</a></li>
	        </ul>
	        
	        <div class="tab-content">
	            <div role="tabpanel" class="tab-pane active" id="sensorSearch">
	                <form action="#" method="get" class="form-inline">
	                    <div class="form-group">
	                        <label for="mag_name">用户名</label>
	                        <input class="form-control" id="mag_num" type="text" placeholder="" value="">
	                    </div>
	                    <button type="button" class="btn btn-primary" id="search_btn">查询</button>
	                    <button type="reset" class="btn btn-default">清空</button>
	                    <button type="button" class="btn btn-default" id="addarea" data-target="#addmagcardModal" data-toggle="modal" @click="handleEditorOrAdd('')">添加用户</button>
	                </form>
	            </div>
	        </div>
	    </div>
	    <div class="marginbox"></div>
	    <div class="navtable boxbgcolor clearfix">
	        <ul class="nav-tabs" role="tablist">
	            <li role="presentation" class="active"><a href="#sensorList" aria-controls="sensorList" role="tab" data-toggle="tab">列表</a></li>
	        </ul>
	        
	        <div class="tab-content">
	            <div role="tabpanel" class="tab-pane active" id="sensorList">
	                <table class="table">
	                    <thead>
	                        <tr>
	                            <td width="100">用户名</td>
	                            
	                            <td width="140">用户类型</td>
	                            <!-- <td width="140">手机号</td> -->
	                            <td width="100">邮箱</td>
	                            <td width="100">操作</td>
	                        </tr>
	                    </thead>
	                    <tbody id="tbody">
	                        <tr v-for="item in resultList.items">
                                <td>{{item.telephone}}</td>
                                <td>{{item.userType|userTypeFilter}}</td>
                                <td>{{item.email}}</td>
                                <td>
                                	<!-- <a title="" href="javascript:;" @click="dialogFormVisible = true"><span>编辑</span></a>&nbsp;&nbsp; -->
                                	<el-button @click="handleEditorOrAdd(item.userId)" type="text" size="medium">修改</el-button>
                                	<el-button type="text" size="medium" @click="handleDel(item.planId)">删除</el-button>
                                </td>
                            </tr>
	                    </tbody>
	                </table>
	            </div>
	        </div>

	        <div id="Pagination" class="pagination fr"></div>
	    </div>


		<el-dialog title="用户" :visible.sync="dialogFormVisible" width="500px" @open="openDialog" @close="closeDialog">
		 	<el-form ref="form" label-position="right" :model="form" :rules="rules" :label-width="formLabelWidth" id="form">
				<el-form-item label="用户类型" prop="userType">
					<el-col :span="18">
			      		<el-select v-model="form.userType">
			        		<el-option  v-for="item in form.typeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
			      		</el-select>
		      		</el-col>
		      	</el-form-item>

				<el-form-item label="用户名" prop="userName">
		    		<el-col :span="18">
		      			<el-input v-model="form.userName" auto-complete="off"></el-input>
		      		</el-col>
		    	</el-form-item>
				
				<el-form-item label="密码" prop="password">
					<el-col :span="18">
    					<el-input type="password" v-model="form.password" auto-complete="off"></el-input>
    				</el-col>
  				</el-form-item>
  				<el-form-item label="确认密码" prop="chkPassword">
  					<el-col :span="18">
    					<el-input type="password" v-model="form.chkPassword" auto-complete="off"></el-input>
    				</el-col>
  				</el-form-item>

		    	<!-- <el-form-item label="手机号" prop="telephone">
		    		<el-col :span="18">
		      			<el-input v-model="form.telephone" auto-complete="off"></el-input>
		      		</el-col>
		    	</el-form-item> -->

		    	<el-form-item label="邮箱" prop="email">
		    		<el-col :span="18">
		      			<el-input v-model="form.email" auto-complete="off"></el-input>
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
	import md5 from 'js-md5';
	export default {
		data(){
			var validatePass = (rule, value, callback) => {
				console.log(rule);
				if(rule.required){
					if (value === '') {
			          	callback(new Error('请输入密码'));
			        } else {
			          	if (this.form.chkPassword !== '') {
			            	this.$refs.form.validateField('chkPassword');
			          	}
			          	callback();
			        }
				}else{
					if (this.form.chkPassword !== '') {
		            	this.$refs.form.validateField('chkPassword');
		          	}
		          	callback();
				}
		        
		    };
		    var validateChkPass = (rule, value, callback) => {
		    	if(rule.required){
		    		if (value === '') {
			          	callback(new Error('请再次输入密码'));
			        } else if (value !== this.form.password) {
			          	callback(new Error('两次输入密码不一致!'));
			        } else {
			          	callback();
			        }
		    	}else{
		    		if (value !== this.form.password) {
			          	callback(new Error('两次输入密码不一致!'));
			        } else {
			          	callback();
			        }
		    	}
		        
		    };

			return{
				search:{
					pageNumber:"1",
					pageSize:"10",
					userName:''
				},
				resultList:{},
				// getEditorData:{},

				dialogFormVisible: false,
		        form: {
		        	userId:"",
		        	userName:"",
					telephone:"",
					password:"",
					chkPassword:"",
					email:"",
					userType:"",
					typeOptions:[
						{
							value:'1',
							label:'超级管理员'
						},{
							value:'2',
							label:'经理'
						},{
							value:'3',
							label:'组长'
						},{
							value:'4',
							label:'组员'
						}
					]
		        },
		        rules:{
		        	userName: [
			            { required: true, message: '请输入用户名', trigger: 'blur' }
			        ],
			        userType: [
			            { required: true, message: '请选择用户类型', trigger: 'blur' }
			        ],
		        	password: [
			            { required: true, validator: validatePass, trigger: 'blur' }
			        ],
			        chkPassword: [
			            { required: true, validator: validateChkPass, trigger: 'blur' }
			        ],
			        email: [
			            { required: true, message: '请输入邮箱地址', trigger: 'blur' },
      					{ type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
			        ]
		        },
		        formLabelWidth: '100px'
			}
		},
		methods:{
			tableList:function(pag,pageN){
				var _this=this;
				$.ajax({
					url:this.get_api_url(),
					async:true,
					cache:false,
					// timeout:2000,
					type:"post",
					dataType:"json",
					data: {
				    	params:'{"api_name":"queryUserList","params":{"pageNumber":"'+pageN+'","pageSize":"'+this.search.pageSize+'","username":"'+this.search.userName+'"}}'
				    },
					contentType:"application/x-www-form-urlencoded;charset=utf-8", 
					beforeSend:function(xhr){
						// parent.modal_loading("正在获取数据！");
					},
					success:function(data,status,xhr){
						// parent.modal_loading("");
						// jump_index(data);
						if(data.code!=100) return;

						//翻页
						if(pag){
							_this.page_curBase(data.result.rowsCount,data.result.pageSize,_this);
						}
						_this.resultList=data.result;
					},
					error: function (a, b, c) {
						// parent.modal_loading("error");
					 	console.log(c);
					 }
					 
				});
			},

			handleEditorOrAdd:function(id){
				// console.log(id)
				this.dialogFormVisible = true;
				
				if(id==""){
					this.form.userId="";
					this.rules.password[0].required=true;
					this.rules.chkPassword[0].required=true;
					return;
				}
				this.rules.password[0].required=false;
				this.rules.chkPassword[0].required=false;
				

				var _this=this;
				$.ajax({
					url:this.get_api_url(),
					async:true,
					cache:false,
					// timeout:2000,
					type:"post",
					dataType:"json",
					data: {
				    	params:'{"api_name":"beforeUpdateUser","params":{"userId":"'+id+'"}}'
				    },
					contentType:"application/x-www-form-urlencoded;charset=utf-8", 
					beforeSend:function(xhr){
						// parent.modal_loading("正在获取数据！");
					},
					success:function(data,status,xhr){
						// parent.modal_loading("");
						// jump_index(data);
						if(data.code!=100) return;
						var result=data.result;

						_this.form.userId=result.userId;
						_this.form.userName=result.telephone;
						_this.form.userType=String(result.userType);
						_this.form.email=result.email;
						
					},
					error: function (a, b, c) {
						// parent.modal_loading("error");
					 	console.log(c);
					 }
					 
				});
			},
			submitForm:function(formName){
				var _this=this;
				this.$refs[formName].validate(function(valid,noStri){
					console.log(valid,noStri);
					if(valid){
						_this.dialogFormVisible=false;

						$.ajax({
							url:_this.get_api_url(),
						  	type: 'POST',
						  	dataType:"json",
						  	data: {
						    	params:'{"api_name":"addUser","params":{"userId":"'+_this.form.userId+'","userType":"'+_this.form.userType+'","telephone":"'+_this.form.userName+'","password":"'+(Boolean(_this.form.password)?md5(md5(_this.form.password)+_this.form.userName):"")+'","email":"'+_this.form.email+'"}}'
						    },
						  	success:function(data,status,xhr){
						  		_this.tableList(true,_this.search.pageNumber);
						  	}
						});

					}else{
						_this.dialogFormVisible=true;
						// console.log(_this.form)
					}
				})
			},
			openDialog:function(){
				console.log("打开")
			},
			closeDialog:function(){
				this.$refs['form'].resetFields();
			},
			handleDel:function(id){
				var _this=this;
				
				this.$layer.confirm('您确定删除该条计划？', 
				{
				  btn: ['确定','取消'],
				  shade: true
				}, function(){
					_this.$layer.closeAll();
					$.ajax({
						url:_this.get_api_url(),
						type:"post",
						dataType:"json",
						data: {
					    	params:'{"api_name":"deletePlan","params":{"planId":"'+id+'"}}'
					    },
						success:function(data,status,xhr){
							_this.tableList(true,_this.search.pageNumber);
							
						}
						 
					});
				});

			}
		},
		mounted:function(){
			this.tableList(true,this.search.pageNumber);
			
		},
		filters:{
			userTypeFilter:function(val){
            	if(val==1){
					return "超级管理员";
				}else if(val==2){
					return "经理";
				}else if(val==3){
					return "组长";
				}else if(val==4){
					return "组员";
				}else{
					return "其他";
				}
            }
		}
	}
</script>

<style scoped>
	.el-select,.el-date-editor.el-input, .el-date-editor.el-input__inner{
		width: 270px;
	}
</style>