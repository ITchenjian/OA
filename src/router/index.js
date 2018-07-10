import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/page/login.vue'
import Main from '@/page/main.vue'

import Home from '../page/home.vue'


import Task from '../page/task/task.vue'
import Plan from '../page/plan/plan.vue'
import Delay from '../page/delay/delay.vue'
import Result from '../page/result/result.vue'
import User from '../page/user/user.vue'



import Validat from '../page/sample/validat.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },{
        path: '/main',
        name:'Main',
        component:Main,
        children:[{
            path: '/',
            name:'Home',
            component:Home
        },{
            path: '/main/user/user',
            name:'User',
            component:User
        },{
            path: '/main/task/task',
            name:'Task',
            component:Task
        },{
            path: '/main/plan/plan',
            name:'Plan',
            component:Plan
        },{
            path: '/main/delay/delay',
            name:'Delay',
            component:Delay
        },{
            path: '/main/result/result',
            name:'Result',
            component:Result
        },{
            path: '/main/sample/validat',
            name:'Validat',
            component:Validat
        }]
    }
  ]
})
