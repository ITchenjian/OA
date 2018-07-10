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
	                        <label for="mag_name">延期名称</label>
	                        <input class="form-control" id="mag_num" type="text" placeholder="" value="">
	                    </div>
	                    <button type="button" class="btn btn-primary" id="search_btn">查询</button>
	                    <button type="reset" class="btn btn-default">清空</button>
	                    <button type="button" class="btn btn-default" id="addarea" data-target="#addmagcardModal" data-toggle="modal" @click="handleEditorOrAdd('')">添加延期</button>
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
	                            <td width="100">延期名称</td>
	                            
	                            <td width="140">延期时间</td>
	                            
	                            <td width="100">所属计划</td>
	                            <td width="80">状态</td>
	                            <td width="140">延期说明</td>
	                            <td width="100">操作</td>
	                        </tr>
	                    </thead>
	                    <tbody id="tbody">
	                        <tr v-for="item in resultList.items">
                                <td>{{item.delayApplyName}}</td>
                                
                                <td>{{Boolean(item.delayApplyDate)?item.delayApplyDate:''}}</td>
                                <td>{{Boolean(item.planName)?item.planName:''}}</td>
                                <td>{{item.delayApplyState==1?"已通过":"未通过"}}</td>
                                <td>{{item.delayApplyDetail}}</td>
                                <td>
                                	<!-- <el-button @click="handleEditorOrAdd(item.delayApplyId)" type="text" size="medium">编辑</el-button> -->
									<el-button style="color:#8e8d8d;" v-if="item.delayApplyState==1" type="text" size="medium">审核</el-button>

                                	<el-button v-else @click="handleCheck(item.delayApplyId)" type="text" size="medium">审核</el-button>
                                	<el-button type="text" size="medium" @click="handleDel(item.delayApplyId)">删除</el-button>
                                </td>
                            </tr>
	                    </tbody>
	                </table>
	            </div>
	        </div>

	        <div id="Pagination" class="pagination fr"></div>
	    </div>


		<el-dialog title="延期" :visible.sync="dialogFormVisible" width="500px" @open="openDialog" @close="closeDialog">
		 	<el-form ref="form" label-position="right" :model="form" :rules="rules" :label-width="formLabelWidth" id="form">
				<el-form-item label="所属计划" prop="planId">
					<el-col :span="18">
			      		<el-select v-model="form.planId">
			        		<el-option  v-for="item in form.planOptions" :key="item.planId" :label="item.planName" :value="item.planId"></el-option>
			      		</el-select>
		      		</el-col>
		      	</el-form-item>

		    	<el-form-item label="延期名称" prop="planName">
		    		<el-col :span="18">
		      			<el-input v-model="form.delayName" auto-complete="off"></el-input>
		      		</el-col>
		    	</el-form-item>

		    	<el-form-item label="延期时间">
		    		<el-col :span="18">
		    			<el-date-picker v-model="form.delayDate" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
		      		</el-col>
		    	</el-form-item>

		    	<el-form-item label="延期说明">
		    		<el-col :span="18">
				    	<el-input type="textarea" v-model="form.delayDetail"></el-input>
				    </el-col>
				</el-form-item>

			</el-form>
		  	<div slot="footer" class="dialog-footer">
		    	<el-button @click="dialogFormVisible = false">取 消</el-button>
		    	<el-button type="primary" @click="submitForm('form')">确 定</el-button>
		 	</div>
			
		</el-dialog>
		
		<el-dialog title="延期审核" :visible.sync="checkFormVisible" width="450px" @close="chkCloseDialog">
		 	<el-form label-position="right" :model="checkForm" :label-width="formLabelWidth" id="checkForm">
				<el-form-item label="是否通过" prop="planId">
					<el-col :span="18">
			      		<el-radio v-model="checkForm.radio" label="1">是</el-radio>
  						<el-radio v-model="checkForm.radio" label="0">否</el-radio>
		      		</el-col>
		      	</el-form-item>

			</el-form>
		  	<div slot="footer" class="dialog-footer">
		    	<el-button @click="checkFormVisible = false">取 消</el-button>
		    	<el-button type="primary" @click="chkSubmitForm()">确 定</el-button>
		 	</div>
			
		</el-dialog>

  	</div>
</template>

<script>
	export default {
		data(){
			return{
				userId:'',
				search:{
					pageNumber:"1",
					pageSize:"10",
					delayName:"",
					beginDate:"",
					endDate:""
				},
				resultList:{},
				// getEditorData:{},

				dialogFormVisible: false,
		        form: {
		        	planOptions:[],
					planId:"",
					delayId:"",
					delayName:"",
					delayDate:"",
					delayDetail:""
		        },
		        rules:{
		        	delayName: [
			            { required: true, message: '请输入任务名称', trigger: 'blur' },
			            { min: 3, max: 18, message: '长度在 3 到 18 个字符', trigger: 'blur' }
			        ],
			        planId: [
            			{ required: true, message: '请选择项目编号', trigger: 'change' }
          			]
		        },
		        formLabelWidth: '100px',
		        checkFormVisible: false,
		        checkForm: {
		        	delayId:'',
		        	radio:'1'
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
				    	params:'{"api_name":"queryDelayApplyList","params":{"pageNumber":"'+pageN+'","pageSize":"'+this.search.pageSize+'","delayApplyName":"'+this.search.delayName+'","beiginDate":"'+this.search.beginDate+'","endDate":"'+this.search.endDate+'","userId":"'+this.userId+'"}}'
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
				    	params:'{"api_name":"beforeUpdateDelayApply","params":{"delayApplyId":"'+id+'","userId":"'+this.userId+'"}}'
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

						
						_this.form.planId=result.planId;
						_this.form.delayId=result.delayApplyId;
						_this.form.delayName=result.delayApplyName;
						_this.form.delayDate=result.delayApplyDate;
						_this.form.delayDetail=result.delayApplyDetail;
						
					},
					error: function (a, b, c) {
						// parent.modal_loading("error");
					 	console.log(c);
					 }
					 
				});
			},
			getPlan:function(){
				var _this=this;
				$.ajax({
					url:this.get_api_url(),
					type: 'POST',
					dataType:"json",
					data: {
				    	params:'{"api_name":"beforeAddDelayApply","params":{"userId":"'+this.userId+'"}}'
				    },
					success:function(data,status,xhr){
						// parent.modal_loading("");
						// jump_index(data);
						if(data.code!=100) return;
						_this.form.planOptions=data.result;
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
						    	params:'{"api_name":"addDelayApply","params":{"delayApplyId":"'+_this.form.delayId+'","delayApplyName":"'+_this.form.delayName+'","delayApplyDetail":"'+_this.form.delayDetail+'","delayApplyDate":"'+_this.form.delayDate+'","planId":"'+_this.form.planId+'","userId":"'+_this.userId+'"}}'
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
			},
			openDialog:function(){
				console.log("打开")
			},
			closeDialog:function(){
				this.$refs['form'].resetFields();
			},
			handleCheck:function(id){
				this.checkFormVisible=true;
				this.checkForm.delayId=id;
			},
			chkSubmitForm:function(){
				this.checkFormVisible=false;
				var _this=this;
				$.ajax({
					url:_this.get_api_url(),
				  	type: 'POST',
				  	dataType:"json",
				  	data: {
				    	params:'{"api_name":"toExamine","params":{"delayApplyId":"'+_this.checkForm.delayId+'","delayApplyState":"'+_this.checkForm.radio+'","userId":"'+_this.userId+'"}}'
				    },
				  	success:function(data,status,xhr){
				  		_this.tableList(true,_this.search.pageNumber);
				  	}
				});
			},
			chkCloseDialog:function(){
				this.checkForm.radio='1';
			},
			handleDel:function(id){
				var _this=this;
				
				this.$layer.confirm('您确定删除该条延期？', 
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
					    	params:'{"api_name":"deleteDelayApply","params":{"delayApplyId":"'+id+'"}}'
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
			this.getPlan();
		}
	}
</script>

<style scoped>
	.el-select,.el-date-editor.el-input, .el-date-editor.el-input__inner{
		width: 270px;
	}
</style>