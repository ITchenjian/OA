<template>
    <div class="aside">
        <UserCustom></UserCustom>
        
        <div class="all" id="accordion">
			<el-menu
			class="el-menu-vertical-demo"
			@open="handleOpen"
			@close="handleClose"
			background-color="#26354b"
			text-color="#fff"
			active-text-color="#fff"
			:default-active="defaultActive"
			unique-opened
			router
			>
				<el-menu-item index="/main">项目管理</el-menu-item>
				<el-submenu :index="String(index)" :key="index" v-for="(item,index) in sidearr">
					<template slot="title">
					  	<img :src="item.src" height="26" width="26" alt="">
					  	<span style="padding-left:15px;">{{item.title}}</span>
					</template>
					<el-menu-item :index="sub.link" :route="{path:sub.link,query:{typeCode:sub.typeCode}}" :key="subindex" v-for="(sub,subindex) in item.subtitle">{{sub.title}}</el-menu-item>
					
				</el-submenu>
			</el-menu>

        </div>
        <!-- <div class="dislpayArrow">
            <a class="pngfix" href="javascript:void(0);" title="收放侧边栏" onclick="displaynavbar(this)"></a>
        </div> -->
    </div>
</template>
<script>
	import UserCustom from './userCustom.vue'

	export default {
		name:"sidecus",
		data:function(){
			return{
				sidearr:[
	                {
	                    tagClass:"sensoricon",
	                    title:"用户管理",
	                    src:"./static/images/sensor.png",
	                    subtitle:[{
	                        title:"用户列表",
	                        link:"/main/user/user"
	                    }]
	                },{
	                    tagClass:"sensoricon",
	                    title:"任务管理",
	                    src:"./static/images/sensor.png",
	                    subtitle:[{
	                        title:"任务列表",
	                        link:"/main/task/task"
	                    }]
	                },{
	                    tagClass:"sensoricon",
	                    title:"计划管理",
	                    src:"./static/images/sensor.png",
	                    subtitle:[{
	                        title:"计划列表",
	                        link:"/main/plan/plan"
	                    }]
	                },{
	                    tagClass:"sensoricon",
	                    title:"延期管理",
	                    src:"./static/images/sensor.png",
	                    subtitle:[{
	                        title:"延期列表",
	                        link:"/main/delay/delay"
	                    }]
	                },{
	                    tagClass:"sensoricon",
	                    title:"成果管理",
	                    src:"./static/images/sensor.png",
	                    subtitle:[{
	                        title:"成果列表",
	                        link:"/main/result/result"
	                    }]
	                },{
	                    tagClass:"logicon",
	                    title:"示例模块",
	                    src:"./static/images/log.png",
	                    subtitle:[{
	                        title:"表单验证",
	                        link:"/main/sample/validat"
	                    }]
	                }
	            ],
	            qwerqwre:"-1"
			}
		},
		components:{
	        UserCustom
	    },
		methods:{
			addClassFun:function(index){
	            this.qwerqwre=index
	        },
	        handleOpen:function(key, keyPath) {
		        console.log(key, keyPath);
		    },
		    handleClose:function(key, keyPath) {
		        console.log(key, keyPath);
		   	}
		},
		computed: {
			defaultActive: function(){
				return this.$route.path.replace('"/main/sensor/sentemp"', '');
			}
		}
    }
</script>
<style scoped>
	.aside {
		min-height: 870px;
		background: #26354b;
	}
</style>

<style>
	
	.all .el-menu{
		border-right:0;
	}
	
	.all .el-menu-item {
		background: #182230 !important;
	}

	.all .el-menu-item.is-active{
		background: #3aa5ef !important;
	}
	.all .el-submenu__title{
		padding-left:15px !important;
	}
</style>