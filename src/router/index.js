import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '@/views/login'
import home from '@/views/home'
import welcome from '@/components/welcome'
import users from '@/components/users'

Vue.use(VueRouter)

const routes = [{
  path: '/',
  redirect: '/login'
}, {
  path: '/login',
  name: 'login',
  component: login
}, {
  path: '/home',
  name: 'home',
  component: home,
  redirect: '/welcome',
  children: [{
    path: '/welcome',
    component: welcome
  }, {
    path: '/users',
    component: users
  }]
}]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径跳转而来
  // next 放行函数
  if (to.path == "/login") {
    return next()
  } else {
    const token = window.sessionStorage.getItem("token")
    if (!token) {
      return next("/login")
    } else {
      return next()
    }
  }
})

export default router