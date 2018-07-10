<template>
    <div id="app">
        <!-- <img src="./assets/logo.png"> -->
        <router-view/>
    </div>
</template>

<script>
    import './assets/lib/bootstrap.min.js'
    import './assets/lib/jquery.pagination.js'
    import 'babel-polyfill'
    
    export default {
        name: 'App',
        mounted(){
            jQuery.support.cors = true;//支持跨域
            
        }
    }
</script>

<style>
    
    @import './assets/lib/bootstrap.css';
    @import './assets/css/reset.css';

    @import './assets/css/base.css';
    @import './assets/css/pagination.css';

    @import './assets/css/ele-reset.css';

</style>
