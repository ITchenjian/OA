<template>
  	<div>
  		<div class="navsearch boxbgcolor">
	        <ul class="nav-tabs" role="tablist">
	            <li role="presentation" class=""><router-link to="/main/hall/halltemp" id="halltemplate">轨迹平面图</router-link></li>
	            <li role="presentation" class="active"><a href="javascript:;">磁卡管理</a></li>     
	        </ul>
	        
	        <div class="tab-content">
	            <div role="tabpanel" class="tab-pane active" id="sensorSearch">
	                <form action="#" method="get" class="form-inline">
	                    <div class="form-group">
	                        <label for="mag_name">磁卡编号</label>
	                        <input class="form-control" id="mag_num" type="text" placeholder="" value="">
	                    </div>
	                    <button type="button" class="btn btn-primary" id="search_btn">查询</button>
	                    <button type="reset" class="btn btn-default">清空</button>
	                    <button type="button" class="btn btn-default" id="addarea" data-target="#addmagcardModal" data-toggle="modal" @click="handleEditorOrAdd('')">添加磁卡</button>
	                </form>
	            </div>
	        </div>
	    </div>
	    <div class="marginbox"></div>
	    <div class="navtable boxbgcolor clearfix">
	        <ul class="nav-tabs" role="tablist">
	            <li role="presentation" class="active"><a href="#sensorList" aria-controls="sensorList" role="tab" data-toggle="tab">传感器列表</a></li>
	        </ul>
	        
	        <div class="tab-content">
	            <div role="tabpanel" class="tab-pane active" id="sensorList">
	                <table class="table">
	                    <thead>
	                        <tr>
	                            <td width="100">磁卡编号</td>
	                            <td width="80">姓名</td>
	                            <td width="80">性别</td>
	                            <td width="100">职位</td>
	                            <td width="100">所属行业</td>
	                            <td width="140">公司名</td>
	                            
	                            <td width="140">登记时间</td>
	                            <td width="100">操作</td>
	                        </tr>
	                    </thead>
	                    <tbody id="tbody">
	                        <tr v-for="item in resultList.items">
                                <td>{{item.cardNumber}}</td>
                                <td>{{item.name}}</td>
                                <td>{{item.sex==1?'女':'男'}}</td>
                                <td>{{Boolean(item.position)?item.position:''}}</td>
                                <td>{{Boolean(item.industry)?item.industry:''}}</td>
                                <td>{{Boolean(item.company)?item.company:''}}</td>
                                <td>{{Boolean(item.createdDate)?item.createdDate:''}}</td>
                                <td>
                                	<a title="" href="#" data-target="#addmagcardModal" data-toggle="modal" @click="handleEditorOrAdd(item.cardNumberId)"><span>编辑</span></a>&nbsp;&nbsp;
                                	<a title="" href="javascript:;" @click="handleDel(item.cardNumberId)" class=""><span>删除</span></a>
                                </td>
                            </tr>
	                    </tbody>
	                </table>
	            </div>
	        </div>

	        <div id="Pagination" class="pagination fr"></div>
	    </div>


		<!-- 添加、编辑磁卡 -->
	    <div class="modal fade" id="addmagcardModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
	        <div class="modal-dialog modal-middle" role="document">
	            <div class="modal-content">
	                <div class="modal-header">
	                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
	                    <h4 class="modal-title">添加/编辑磁卡</h4>
	                </div>
	                <form class="form-horizontal" action="#" method="#" id="addmag_form">
	                    <div class="modal-body">
	                        <div class="form-group">
	                            <label for="" class="lab col-sm-3 control-label">编号</label>
	                            <div class="e-input col-sm-7">
	                                <input type="text" class="form-control" id="magnum" placeholder="" maxlength="6" v-model="getEditorData.cardNumber">
	                                <div class="form_tip Validform_checktip" id="v_magnum">
	                                    
	                                </div>
	                            </div>
	                        </div>
	                        <div class="form-group">
	                            <label for="" class="lab col-sm-3 control-label">卡号1</label>
	                            <div class="e-input col-sm-7">
	                                <input type="text" class="form-control" id="magnum1" placeholder="" maxlength="20" v-model="getEditorData.cardNumber1">
	                                <div class="form_tip Validform_checktip" id="v_magnum">
	                                    
	                                </div>
	                            </div>
	                        </div>
	                        <div class="form-group">
	                            <label for="" class="lab col-sm-3 control-label">卡号2</label>
	                            <div class="e-input col-sm-7">
	                                <input type="text" class="form-control" id="magnum2" placeholder="" maxlength="20" v-model="getEditorData.cardNumber2">
	                                <div class="form_tip Validform_checktip" id="v_magnum">
	                                    
	                                </div>
	                            </div>
	                        </div>
	                        <div class="form-group">
	                            <label for="" class="lab col-sm-3 control-label">姓名</label>
	                            <div class="e-input col-sm-7">
	                                <input type="text" class="form-control" id="magname" placeholder="" maxlength="10" v-model="getEditorData.name">
	                                <input type="hidden" class="form-control" id="mag_id" placeholder="" v-model="getEditorData.cardNumberId">
	                                <div class="form_tip Validform_checktip">
	                                </div>

	                            </div>
	                        </div>
	                        <div class="form-group">
	                            <label for="" class="lab col-sm-3 control-label">性别</label>
	                            <div class="e-input col-sm-7">
	                                <select name="" class="form-control" id="sex" v-model="getEditorData.sex">
	                                    <option value="0">男</option>
	                                    <option value="1">女</option>
	                                </select>
	                                <div class="form_tip Validform_checktip" id="v_magnum">
	                                    
	                                </div>
	                            </div>
	                        </div>
	                        <div class="form-group">
	                            <label for="" class="lab col-sm-3 control-label">职位</label>
	                            <div class="e-input col-sm-7">
	                                <input type="text" class="form-control" id="position" placeholder="" maxlength="10" v-model="getEditorData.position">
	                                <div class="form_tip Validform_checktip">
	                                </div>

	                            </div>
	                        </div>
	                        <div class="form-group">
	                            <label for="" class="lab col-sm-3 control-label">行业</label>
	                            <div class="e-input col-sm-7">
	                                <input type="text" class="form-control" id="industry" placeholder="" maxlength="10" v-model="getEditorData.industry">
	                                <div class="form_tip Validform_checktip">
	                                </div>

	                            </div>
	                        </div>
	                        <div class="form-group" style="display:none;">
	                            <label for="" class="lab col-sm-3 control-label">手机号</label>
	                            <div class="e-input col-sm-7">
	                                <input type="text" class="form-control" id="mag_phone" placeholder="" v-model="getEditorData.phone">
	                                <div class="form_tip Validform_checktip" id="v_magphone">
	                                    
	                                </div>
	                            </div>
	                        </div>
	                        <div class="form-group">
	                            <label for="" class="lab col-sm-3 control-label">公司名称</label>
	                            <div class="e-input col-sm-7">
	                                <input type="text" class="form-control" id="mag_company" placeholder="" v-model="getEditorData.company">
	                                <div class="form_tip Validform_checktip" id="v_magphone">
	                                    
	                                </div>
	                            </div>
	                        </div>
	                        <div class="form-group">
	                            <label for="" class="lab col-sm-3 control-label">公司地址</label>
	                            <div class="e-input col-sm-7">
	                                <input type="text" class="form-control" id="mag_address" placeholder="" v-model="getEditorData.address">
	                                <div class="form_tip Validform_checktip" id="v_magphone">
	                                    
	                                </div>
	                            </div>
	                        </div>
	                    </div>
	                    <div class="modal-footer">
	                        <button type="button" class="btn btn-primary" id="add_true">确认</button>
	                        <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
	                        
	                    </div>
	                </form>
	            </div>
	        </div>
	    </div>

  	</div>
</template>

<script>
	export default {
		data(){
			return{
				search:{
					pageNumber:"1",
					pageSize:"10",
					magName:"",
					magNum:""
				},
				resultList:{},
				getEditorData:{}
			}
		},
		methods:{
			tableList:function(pag,pageN){
				var _this=this;
				$.ajax({
					url:this.get_api_urle(),
					async:true,
					cache:false,
					// timeout:2000,
					type:"post",
					dataType:"json",
					data: {
				    	params:'{"api_name":"getListCard","params":{"page_num":"'+pageN+'","page_limit":"'+this.search.pageSize+'","mag_name":"'+this.search.magName+'","mag_num":"'+this.search.magNum+'"}}'
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
			handleEditorOrAdd:function(magId){
				if(magId=="") return this.getEditorData={};
				var _this=this;
				$.ajax({
					url:this.get_api_urle(),
					async:true,
					cache:false,
					// timeout:2000,
					type:"post",
					dataType:"json",
					data: {
				    	params:'{"api_name":"getBeforeModificationCard","params":{"card_number_id":"'+magId+'"}}'
				    },
					contentType:"application/x-www-form-urlencoded;charset=utf-8", 
					beforeSend:function(xhr){
						// parent.modal_loading("正在获取数据！");
					},
					success:function(data,status,xhr){
						// parent.modal_loading("");
						// jump_index(data);
						if(data.code!=100) return;
						_this.getEditorData=data.result;
						/*$("#mag_id").val(result.cardNumberId);

						$("#magnum").val(result.cardNumber);
						$("#magnum1").val(result.cardNumber1);
						$("#magnum2").val(result.cardNumber2);
						$("#magname").val(result.name);
						$("#sex").val(result.sex);
						$("#position").val(result.position);
						$("#industry").val(result.industry);
						$("#mag_phone").val(result.phone);
						$("#mag_company").val(result.company);
						$("#mag_address").val(result.address);*/
					},
					error: function (a, b, c) {
						// parent.modal_loading("error");
					 	console.log(c);
					 }
					 
				});
			},
			handleDel:function(magId){
				var _this=this;
				
				this.$layer.confirm('您确定删除该磁卡？', 
				{
				  btn: ['确定','取消'],
				  shade: true
				}, function(){
					_this.$layer.closeAll();
					$.ajax({
						url:_this.get_api_urle(),
						async:true,
						cache:false,
						// timeout:2000,
						type:"post",
						dataType:"json",
						data: {
					    	params:'{"api_name":"deleteCard","params":{"card_number_id":"'+magId+'"}}'
					    },
						contentType:"application/x-www-form-urlencoded;charset=utf-8", 
						beforeSend:function(xhr){
							// parent.modal_loading("正在获取数据！");
							
						},
						success:function(data,status,xhr){
							_this.tableList(true,_this.search.pageNumber);
							
						},
						error: function (a, b, c) {
							// parent.modal_loading("error");
						 	console.log(c);
						 }
						 
					});
				});

			}
		},
		mounted:function(){
			this.tableList(true,this.search.pageNumber)
		}
	}
</script>

<style scoped>
	
</style>