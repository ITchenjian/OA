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
	                        <label for="mag_name">计划名称</label>
	                        <input class="form-control" id="mag_num" type="text" placeholder="" value="">
	                    </div>
	                    <button type="button" class="btn btn-primary" id="search_btn">查询</button>
	                    <button type="reset" class="btn btn-default">清空</button>
	                    <button type="button" class="btn btn-default" id="addarea" data-target="#addmagcardModal" data-toggle="modal" @click="handleEditorOrAdd('')">添加计划</button>
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
	                            <td width="100">计划名称</td>
	                            
	                            <td width="140">开始时间</td>
	                            <td width="140">结束时间</td>
	                            <td width="100">所属任务</td>
	                            <td width="100">计划说明</td>
	                            <td width="100">操作</td>
	                        </tr>
	                    </thead>
	                    <tbody id="tbody">
	                        <tr v-for="item in resultList.items">
                                <td>{{item.planName}}</td>
                                
                                <td>{{Boolean(item.planBeginDate)?item.planBeginDate:''}}</td>
                                <td>{{Boolean(item.planEndDate)?item.planEndDate:''}}</td>
                                <td>{{item.taskName}}</td>
                                <td>{{item.planDetail}}</td>
                                <td>
                                	<!-- <a title="" href="javascript:;" @click="dialogFormVisible = true"><span>编辑</span></a>&nbsp;&nbsp; -->

                                	<el-button @click="handleEditorOrAdd(item.planId)" type="text" size="medium">编辑</el-button>
									<el-button @click="handleResultLoad(item.planId)" type="text" size="medium">成果提交</el-button>
                                	<el-button type="text" size="medium" @click="handleDel(item.planId)">删除</el-button>
                                </td>
                            </tr>
	                    </tbody>
	                </table>
	            </div>
	        </div>

	        <div id="Pagination" class="pagination fr"></div>
	    </div>


		<el-dialog title="计划" :visible.sync="dialogFormVisible" width="500px" @open="openDialog" @close="closeDialog">
		 	<el-form ref="form" label-position="right" :model="form" :rules="rules" :label-width="formLabelWidth" id="form">
				<el-form-item label="所属任务" prop="taskId">
					<el-col :span="18">
			      		<el-select v-model="form.taskId">
			        		<el-option  v-for="item in form.taskOptions" :key="item.taskId" :label="item.taskName" :value="item.taskId"></el-option>
			      		</el-select>
		      		</el-col>
		      	</el-form-item>

		    	<el-form-item label="计划名称" prop="planName">
		    		<el-col :span="18">
		      			<el-input v-model="form.planName" auto-complete="off"></el-input>
		      		</el-col>
		    	</el-form-item>

		    	<el-form-item label="开始时间">
		    		<el-col :span="18">
		    			<el-date-picker v-model="form.planBeginDate" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
		      		</el-col>
		    	</el-form-item>
		    	<el-form-item label="结束时间">
		    		<el-col :span="18">
		      			<el-date-picker v-model="form.planEndDate" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
		      		</el-col>
		    	</el-form-item>

		    	<el-form-item label="计划说明">
		    		<el-col :span="18">
				    	<el-input type="textarea" v-model="form.planDetail"></el-input>
				    </el-col>
				</el-form-item>

			</el-form>
		  	<div slot="footer" class="dialog-footer">
		    	<el-button @click="dialogFormVisible = false">取 消</el-button>
		    	<el-button type="primary" @click="submitForm('form')">确 定</el-button>
		 	</div>
			
		</el-dialog>

		<el-dialog title="成果提交" :visible.sync="resultFormVisible" width="500px" @open="openDialog" @close="resultCloseDialog">
		 	<el-form ref="resultForm" label-position="right" :model="resultForm" :rules="resultRules" :label-width="formLabelWidth" id="form">

		    	<el-form-item label="成果名称" prop="resultsDocumentName">
		    		<el-col :span="18">
		      			<el-input v-model="resultForm.resultsDocumentName" auto-complete="off"></el-input>
		      		</el-col>
		    	</el-form-item>

		    	<el-form-item label="成果文件" prop="resultsDocumentUrl">
		    		<el-col :span="18">
		      			<el-input v-model.number="resultForm.resultsDocumentUrl" auto-complete="off"></el-input>
		      		</el-col>
		      		<el-col :span="5" style="margin-left:6px;">
		      			
		      			<el-button style="padding:12px 15px;" size="" @click.prevent="">上传</el-button>
		      		</el-col>
		    	</el-form-item>

		    	<el-form-item label="成果说明">
		    		<el-col :span="18">
				    	<el-input type="textarea" v-model="resultForm.resultsDocumentDetail"></el-input>
				    </el-col>
				</el-form-item>

			</el-form>
		  	<div slot="footer" class="dialog-footer">
		    	<el-button @click="resultFormVisible = false">取 消</el-button>
		    	<el-button type="primary" @click="submitForm('resultForm')">确 定</el-button>
		 	</div>
			
		</el-dialog>

  	</div>
</template>

<script>
	import '../../assets/lib/jquery.form.js'
	export default {
		data(){
			return{
				userId:'',
				search:{
					pageNumber:"1",
					pageSize:"10",
					taskId:"",
					taskName:"",
					planId:"",
					planName:"",
					planBeginDate:"",
					planEndDate:""
				},
				resultList:{},
				// getEditorData:{},

				dialogFormVisible: false,
		        form: {
		        	taskOptions:[],
		        	taskId:"",
					planId:"",
					planName:"",
					planBeginDate:"",
					planEndDate:"",
					planDetail:""
		        },
		        rules:{
		        	planName: [
			            { required: true, message: '请输入任务名称', trigger: 'blur' },
			            { min: 3, max: 18, message: '长度在 3 到 18 个字符', trigger: 'blur' }
			        ],
			        taskId: [
            			{ required: true, message: '请选择项目编号', trigger: 'change' }
          			]
		        },
		        formLabelWidth: '100px',

		        resultFormVisible:false,
		        resultForm: {
					planId:"",
					resultsDocumentName:"",
					resultsDocumentUrl:"",
					resultsDocumentDetail:""
					
		        },
		        resultRules:{
		        	resultsDocumentName: [
			            { required: true, message: '请输入成果名称', trigger: 'blur' },
			            { min: 3, max: 18, message: '长度在 3 到 18 个字符', trigger: 'blur' }
			        ],
			        resultsDocumentUrl: [
            			{ required: true, message: '请上传文件', trigger: 'blur' }
          			]
		        }
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
				    	params:'{"api_name":"queryPlanList","params":{"pageNumber":"'+pageN+'","pageSize":"'+this.search.pageSize+'","taskId":"'+this.search.taskId+'","planName":"'+this.search.planName+'","planBeiginDate":"'+this.search.planBeginDate+'","planEndDate":"'+this.search.planEndDate+'","userId":"'+this.userId+'"}}'
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
				console.log(id)
				this.dialogFormVisible = true;
				
				if(id=="") return this.form.planId="";

				var _this=this;
				$.ajax({
					url:this.get_api_url(),
					async:true,
					cache:false,
					// timeout:2000,
					type:"post",
					dataType:"json",
					data: {
				    	params:'{"api_name":"beforeUpdatePlan","params":{"planId":"'+id+'","userId":"'+this.userId+'"}}'
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

						
						_this.form.taskId=result.taskId;
						_this.form.planId=result.planId;
						_this.form.planName=result.planName;
						_this.form.planBeginDate=result.planBeginDate;
						_this.form.planEndDate=result.planEndDate;
						_this.form.planDetail=result.planDetail;
						
					},
					error: function (a, b, c) {
						// parent.modal_loading("error");
					 	console.log(c);
					 }
					 
				});
			},
			getTask:function(){
				var _this=this;
				$.ajax({
					url:this.get_api_url(),
					type: 'POST',
					dataType:"json",
					data: {
				    	params:'{"api_name":"beforeAddPlan","params":{"userId":"'+this.userId+'"}}'
				    },
					success:function(data,status,xhr){
						// parent.modal_loading("");
						// jump_index(data);
						if(data.code!=100) return;
						_this.form.taskOptions=data.result;
					}
					 
				});
			},
			submitForm:function(formName){
				var _this=this;
				if(formName=="resultForm"){
					this.$refs[formName].validate(function(valid,noStri){
						console.log(valid,noStri);
						if(valid){
							_this.resultFormVisible=false;

							$.ajax({
								url:_this.get_api_url(),
							  	type: 'POST',
							  	dataType:"json",
							  	data: {
							    	params:'{"api_name":"addPlan","params":{"planId":"'+_this.form.planId+'","planName":"'+_this.form.planName+'","planBeiginDate":"'+_this.form.planBeginDate+'","planEndDate":"'+_this.form.planEndDate+'","planDetail":"'+_this.form.planDetail+'","taskId":"'+_this.form.taskId+'","userId":"'+_this.userId+'"}}'
							    },
							  	success:function(data,status,xhr){
							  		_this.tableList(true,_this.search.pageNumber);
							  	}
							});

						}else{
							_this.resultFormVisible=true;
						}
					})
				}else{
					this.$refs[formName].validate(function(valid,noStri){
						console.log(valid,noStri);
						if(valid){
							_this.dialogFormVisible=false;

							$.ajax({
								url:_this.get_api_url(),
							  	type: 'POST',
							  	dataType:"json",
							  	data: {
							    	params:'{"api_name":"addPlan","params":{"planId":"'+_this.form.planId+'","planName":"'+_this.form.planName+'","planBeiginDate":"'+_this.form.planBeginDate+'","planEndDate":"'+_this.form.planEndDate+'","planDetail":"'+_this.form.planDetail+'","taskId":"'+_this.form.taskId+'","userId":"'+_this.userId+'"}}'
							    },
							  	success:function(data,status,xhr){
							  		_this.tableList(true,_this.search.pageNumber);
							  	}
							});

						}else{
							_this.dialogFormVisible=true;
							console.log(_this.form)
						}
					})
				}
			},

			handleResultLoad:function(id){
				this.resultFormVisible = true;
			},
			openDialog:function(){
				console.log("打开")
			},
			closeDialog:function(){
				this.$refs['form'].resetFields();
			},
			resultCloseDialog:function(){
				this.$refs['resultForm'].resetFields();
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
			this.userId=sessionStorage.getItem("user_id");
			this.tableList(true,this.search.pageNumber);
			this.getTask();
		}
	}
</script>

<style scoped>
	.el-select,.el-date-editor.el-input, .el-date-editor.el-input__inner{
		width: 270px;
	}
</style>
<style>
	.upload-demo .el-upload__input {
	    display: none !important;
	}
</style>