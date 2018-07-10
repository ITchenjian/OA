<template>
  	<div>
  		<div class="user">
	        <h2><img src="../../assets/images/user.png" height="60" width="60" alt=""></h2>
	        <p>admin</p>
	        <p>管理员</p>
	    </div>
	    <div class="userline"></div>
  	</div>
</template>

<script>
	export default{
		name:"userCustom",
		data:function(){
			return{
				
			}
		},
		methods:{
			
		},
		mounted:function(){

		}
	}

</script>

<style scoped>
	.user{
		padding:36px 20px 20px;
		color:#fff;
		font-size:15px;
	}
	.user p{
		padding:2px 6px;
	}
	.userline{
		height:3px;
		border-bottom:1px solid #384f70;
		background: #0f151d;
	}
</style>