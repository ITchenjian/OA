<template>
	
    <div class="con-header">
        <div class="logo fl">OA系统</div>
        <div class="out fr" @click="logout">退出</div>
    </div>
    
</template>
<script>
	export default {
		name:"headercus",
		data:function(){
			return{
				
			}
		},
		methods:{
			logout:function(){
				this.$router.push("/")
			}
		}
    }
</script>
<style scoped>
	.con-header{
		height:80px;
		width:100%;
		background: #fff url(../../assets/images/logo.png) no-repeat 26px center;
		
	}
	.con-header .logo{
		padding-left: 72px;
		line-height: 80px;
		font-size:24px;
		color:#222;
	}
	.con-header .out{
		cursor: pointer;
		padding:0 20px 0 26px;
		line-height: 80px;
		font-size:16px;
		background: url(../../assets/images/out.png) no-repeat left center;
	}
</style>