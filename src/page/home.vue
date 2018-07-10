<template>
  	<div>
  		<!-- <el-breadcrumb separator="/">
		  	<el-breadcrumb-item :to="{ path: '/main' }">任务</el-breadcrumb-item>
		  	<el-breadcrumb-item>任务</el-breadcrumb-item>
		  	<el-breadcrumb-item :to="{path:'/main/sensor/sentemp'}">活动管理</el-breadcrumb-item>
		</el-breadcrumb> -->
		<ul class="nav-tabs" role="tablist">
            <li role="presentation" class="active"><a href="#sensorList" aria-controls="sensorList" role="tab" data-toggle="tab" id="scenName">项目</a></li>
        </ul>
        
        <div class="tab-content">
            <div role="tabpanel" class="tab-pane active" id="sensorList">
                <div class="lbox">
                   <ul>
                       <li id="scenTypeList">
                            <div v-for="item in proData" class="pro-box sen-warm" style="background-color:#1eb0ec;">
                                <!-- <p class="img-tag"><img src="../assets/images/scenblank.png" height="50" width="60" alt=""></p>
                                <p class="status">{{item.projectState}}</p>
                                <p class="type">{{item.projectName}}</p> -->
                                <div class="icon-tag fl">
                                	<img src="../assets/images/user.png" height="60" width="60" alt="">
                                </div>
                                <div class="pro-content fr">
                                	<h3>{{item.projectName}}</h3>
                                	<p>{{item.projectDetail}}</p>
                                </div>
                                <div class="pro-edit" @click="handleEditorOrAdd(item.projectId)">编辑</div>
                            </div>
                            
                       </li>
                   </ul>
               </div>
            </div>
            <div class="add-del">
                <button type="button" class="setsensor" id="" @click="handleEditorOrAdd('')">添加项目</button>
            </div>
        </div>


		<el-dialog title="项目" :visible.sync="dialogFormVisible" width="500px" @open="openDialog" @close="closeDialog">
		 	<el-form ref="form" label-position="right" :model="form" :rules="rules" :label-width="formLabelWidth" id="form">
		    	<el-form-item label="项目名称" prop="projectName">
		    		<el-col :span="18">
		      			<el-input v-model="form.projectName" auto-complete="off"></el-input>
		      		</el-col>
		    	</el-form-item>
				
				<el-form-item label="相关人员" prop="members">
					<el-col :span="18">
			      		<el-select v-model="form.members" multiple collapse-tags>
			        		<el-option  v-for="item in form.memberOptions" :key="item.userId" :label="item.telephone" :value="item.userId"></el-option>
			      		</el-select>

		      		</el-col>
		      	</el-form-item>

		    	<el-form-item label="项目说明">
		    		<el-col :span="18">
				    	<el-input type="textarea" v-model="form.projectDetail"></el-input>
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
	export default{
		data(){
			return{
				userId:"1",
				search:{
					
				},
				proData:[],
				dialogFormVisible: false,
		        form: {
		        	memberOptions:[],
		        	members:["c9f3f8fc18f247ec9170dd43fe908c50"],
		        	projectId:"",
					projectName:"",
					projectDetail:""
		        },
		        rules:{
		        	projectName: [
			            { required: true, message: '请输入任务名称', trigger: 'blur' },
			            { min: 3, max: 18, message: '长度在 3 到 18 个字符', trigger: 'blur' }
			        ]
		        },
		        formLabelWidth: '100px'
			}
		},
		methods:{
			proList:function(){
				var _this=this;
				$.ajax({
					url:this.get_api_url(),
					async:true,
					cache:false,
					// timeout:2000,
					type:"post",
					dataType:"json",
					data: {
				    	params:'{"api_name":"queryProject","params":{"userId":"'+this.userId+'"}}'
				    },
					contentType:"application/x-www-form-urlencoded;charset=utf-8", 
					beforeSend:function(xhr){
						// parent.modal_loading("正在获取数据！");
					},
					success:function(data,status,xhr){
						// parent.modal_loading("");
						// jump_index(data);
						if(data.code!=100) return;
						_this.proData=data.result;
					},
					error: function (a, b, c) {
						// parent.modal_loading("error");
					 	console.log(c);
					 }
					 
				});
			},
			handleEditorOrAdd:function(id){
				console.log(id)
				this.dialogFormVisible = true;
				
				if(id=="") return this.form.projectId="";

				var _this=this;
				$.ajax({
					url:this.get_api_url(),
					async:true,
					cache:false,
					// timeout:2000,
					type:"post",
					dataType:"json",
					data: {
				    	params:'{"api_name":"beforeUpdateProject","params":{"projectId":"'+id+'","userId":"'+this.userId+'"}}'
				    },
					contentType:"application/x-www-form-urlencoded;charset=utf-8", 
					beforeSend:function(xhr){
						// parent.modal_loading("正在获取数据！");
					},
					success:function(data,status,xhr){
						// parent.modal_loading("");
						// jump_index(data);
						if(data.code!=100) return;
						var result=data.result.project;
						var menberResult=data.result.userIdList;
						
						_this.form.projectId=result.projectId;
						_this.form.projectName=result.projectName;
						_this.form.members=menberResult;
						_this.form.projectDetail=result.projectDetail;
						
					},
					error: function (a, b, c) {
						// parent.modal_loading("error");
					 	console.log(c);
					 }
					 
				});
			},

			getmembers:function(){
				var _this=this;
				$.ajax({
					url:this.get_api_url(),
					type: 'POST',
					dataType:"json",
					data: {
				    	params:'{"api_name":"queryUserListProject","params":{"userId":"'+this.userId+'"}}'
				    },
					success:function(data,status,xhr){
						// parent.modal_loading("");
						// jump_index(data);
						if(data.code!=100) return;
						_this.form.memberOptions=data.result;
					}
					 
				});
			},

			submitForm:function(formName){
				console.log(this.form.members)
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
						    	params:'{"api_name":"addProject","params":{"projectId":"'+_this.form.projectId+'","projectName":"'+_this.form.projectName+'","userStr":"'+_this.form.members+'","projectDetail":"'+_this.form.projectDetail+'","userId":"'+_this.userId+'"}}'
						    },
						  	success:function(data,status,xhr){
						  		_this.proList();
						  	}
						});

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
		},
		mounted:function(){
			this.userId=sessionStorage.getItem("user_id");
			this.proList();
			this.getmembers();
		}
	}
</script>

<style scoped>
	.lbox{
		overflow-y:auto;
		overflow-x:hidden;
		min-height:516px;
		max-height:650px;
	}
	.lbox ul li{
		width: 1504px;
		margin:0 auto;
	}

	@media screen and (max-width: 1500px) {
	    .lbox ul li{	
			width: 1130px;
			margin:0 auto;
		}
	}

	.lbox ul li .pro-box{
		position: relative;
		width: 360px;
		height:100px;
		margin:16px 8px;
		background-color: #1eb0ec;
		border-radius: 5px;
		display: inline-block;
	}
	.lbox ul li .pro-box .pro-edit{
		display: none;
	}
	.lbox ul li .pro-box:hover .pro-edit{
		position: absolute;
		top:0;
		right:0;
		padding: 4px;
		color:#fff;
		cursor:pointer;
		display: block;
		background: #00BCD4;
	}
	.lbox ul li .pro-box .icon-tag{
		padding:0 10px;
		line-height: 100px;	
	}
	.lbox ul li .pro-box .pro-content{
		width: 260px;
		padding:16px 0 8px;
		color:#fff;
		text-align: center;
	}
	.lbox ul li .pro-box .pro-content h3{
		font-size: 16px;
	}

	.lbox ul li .pro-box .pro-content p{
		text-align: left;
		font-size: 14px;
	}

	.add-del{
		margin-top:60px;
		text-align: center;
	}
	.setsensor{
		width:302px;
		height:52px;
		border:1px solid #299ceb;
		border-radius:6px;
		font-size: 15px;
		color: #299ceb;
		background: #fff;
	}

	.el-select,.el-date-editor.el-input, .el-date-editor.el-input__inner{
		width: 270px;
	}
</style>