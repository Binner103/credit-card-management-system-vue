import Vue from 'vue'
import VueRouter from 'vue-router'
//引入Login组件
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import UserList from '../components/admin/UserList.vue'
import CardList from '../components/admin/CardList.vue'

Vue.use(VueRouter)

  const routes = [
    {
      path:"/",
      redirect:"/login"
    },
    {
      path:"/Login",
      component: Login
    },
    {
      path:"/home",
      component:Home,
      redirect:"/welcome",
      children:[
        {path:"/welcome",component:Welcome,},//重定向到Welcome
        {path:"/user",component:UserList,}, //重定向到UserList
        {path:"/sport",component:CardList,}, //重定向到CardList
      ]
    },
  ]

const router = new VueRouter({
  routes
})

// 导航监视
router.beforeEach((to,from,next)=>{
  // to 即将进入的路由
  // from 即将离开的路由
  // next 是否通行 next(url) if:next() 继续访问 to路由
  if(to.path=='/login') return next();
  // 获取user
  const userFlag = window.sessionStorage.getItem("user");
  if(!userFlag) return next('/login');  //无值，返回登录页
  next();
})

export default router
