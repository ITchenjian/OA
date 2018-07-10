<template>
	<!-- <div class="board">
		<Headercus></Headercus>
		<div class="main">
			<Sidecus></Sidecus>
			<div class="content" id="content">
                <router-view></router-view>
            </div>
		</div>
	</div> -->
	<el-container>
  		<el-aside width="225px">
  			<Sidecus></Sidecus>
  		</el-aside>
  		<el-container>
    		<el-header>
    			<Headercus></Headercus>
    		</el-header>
    		<el-main>
    			<router-view></router-view>
    		</el-main>
  		</el-container>
	</el-container>
</template>
<script>
	import Headercus from './commons/header.vue';
	import Sidecus from './commons/side.vue';

	export default {
		name:"maincus",
		data:function(){
			return{
				sss:"good"
			}
		},
		methods:{
			
		},
		components:{
	        Headercus,
	        Sidecus
	    }
    }

</script>
<style scoped>
	.el-aside{
		background: #26354b;
	}
	.el-header{
		padding:0;
		height:auto !important;
	}
	.el-main{
		padding:16px;
	}
</style>
