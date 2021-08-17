import Vue from 'vue'
import VueRouter from 'vue-router'

import constantRoutes from './constantRoutes'

import LoadingBar from '../components/LoadingBar/LoadingBar'
import store from '@/store/index'
import { addTagView, setTagView } from '../components/TagView/TagViewUtils'
import { setBreadcrumbs } from '../components/Breadcrumbs/BreadcrumbsUtils'
import { Notify,Dialog  } from 'quasar'


import { getUserRouter } from '@/api/UserApi'
import { handleJsonRouterToAsyncRouter } from './permissionUtils'
import asyncRoutes from './asyncRoutes'


import { getToken } from "@/utils/auth";



Vue.use(VueRouter)

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */
// 解决路由守卫重定向时报错
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}
// 重置路由方法
export function resetRouter () {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}

// 定义创建路由方法，方便重置路由时调用
const createRouter = () => new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes: constantRoutes
})

const router = createRouter()





const whiteList = ["/login", "/auth-redirect", "/bind", "/register"];



const negativeNotify = {
  message: '未知错误',
  type: 'negative',
  position: 'top',
  timeout: 1500
}
router.beforeEach(async (to, from, next) => {
  // 成功登录后处理 TAGVIEW 和 面包屑
  handleTagViewAndBreadcrumbsAndKeepAlive(to)
  // 模拟获取 token
  const token = getToken()
  // 存在 token 说明已经登录
  if (token) {
    // 登录过就不能访问登录界面
    if (to.path === '/login') {
      next({ path: '/' })
    }else{

      if (store().state.user.roles.length === 0) {
        // 判断当前用户是否已拉取完user_info信息
        store().dispatch("user/GetInfo").then(res => {
          // 拉取user_info
          const roles = res.roles;
          store().dispatch("permission/GenerateRoutes", { roles }).then(accessRoutes => {
            // 根据roles权限生成可访问的路由表
            accessRoutes.map(ele=>{
              router.addRoute(ele)
            })
            // router.addRoute(...accessRoutes)
            // console.log('----------router.addRoute(...accessRoutes)-----------------',accessRoutes,router.getRoutes())
            // router.addRoutes(accessRoutes); // 动态添加可访问路由表
            next({ ...to, replace: true }); // hack方法 确保addRoutes已完成
          });
        }).catch(err => {
          store().dispatch("user/LogOut").then(() => {
            // Message.error(err);
            negativeNotify.message = err
            Notify.create(negativeNotify)
            next({ path: "/" });
          });
    
        });

      } else {
        next();
      }

      
      // next(); // hack方法 确保addRoutes已完成

    }
    // console.log('--------store-------------',store())
    // // 存在用户权限，并且路由不为空则放行
    // if (store().state.skin.routes.length) {
    //   next()
    // } else {
    //   // 不存在用户权限时，从后台获取用户对应的路由
    //   const userRouterRespouse = await getUserRouter()

    //   console.log('-----------userRouterRespouse--------------', userRouterRespouse)

    //   // 将从后台获取的路由转换为 vue-router 可用形式
    //   const userRouter = handleJsonRouterToAsyncRouter(userRouterRespouse.data)

    //   // 在路由的末尾处添加 404 界面
    //   userRouter.push(view404)

    //   // 将后台请求到的路由加入到主布局路由中
    //   asyncRoutes[0].children = userRouter

    //   console.log('-----------userRouter--------------', userRouter)
    //   // 将路由设置到 store 中
    //   store().commit('skin/SET_ROLES', asyncRoutes)
    //   console.log('-------------store().roles----------------',store().state)
    //   // 如果提示 addRoutes 已弃用，使用扩展运算符完成该操作
    //   router.addRoute(...asyncRoutes)
    //   // router.addRoutes(asyncRoutes)

    //   // 如果 addRoutes 并未完成，路由守卫会再执行一次
    //   next({ ...to, replace: true })
    // }
  } else {
    // 如果要前往不需要授权的路由，则放行
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next();
    } else {
      next(`/login?redirect=${to.fullPath}`); // 否则全部重定向到登录页
    }
  }
})

router.afterEach(() => {
  // 使用多个 stop() 来保证 LoadingBar 在动态添加路由后正确关闭
  LoadingBar.stop()
  LoadingBar.stop()
})

export default router

/**
 * 处理 tagView 和 面包屑
 * @param to
 */
function handleTagViewAndBreadcrumbsAndKeepAlive (to) {
  if (to.name != null) {
    document.title = to.meta.title + Vue.prototype.$title
    LoadingBar.start()
    // 判断要添加的 to 是否是公共路由
    for (let i = 0; i < constantRoutes.length; i++) {
      if (constantRoutes[i].path === to.path) {
        return
      }
    }
    // 判断是否为刷新操作，如果是刷新操作则从 sessionStorage 获取保存的 tagView 信息
    let tagViewOnSS = []
    JSON.parse(window.sessionStorage.getItem('tagView')) === null ? window.sessionStorage.setItem('tagView', '[]') : tagViewOnSS = JSON.parse(window.sessionStorage.getItem('tagView'))
    if (store().state.skin.tagView.length === 0 && tagViewOnSS.length !== 0) {
      setTagView(tagViewOnSS)
      store().commit('skin/SET_KEEPALIVE_LIST', tagViewOnSS)
    } else {
      addTagView(to)
    }
    setBreadcrumbs(to.matched, to.query)
    handleKeepAlive(to)
  }
}

/**
 * 处理多余的 layout : router-view，让当前组件保持在第一层 index : router-view 之下
 * 这个方法无法过滤用来做嵌套路由的按需加载的 <layout>
 * @param to
 */
function handleKeepAlive (to) {
  if (to.matched && to.matched.length > 2) {
    for (let i = 0; i < to.matched.length; i++) {
      const element = to.matched[i]
      if (element.components.default.name === 'Layout') {
        to.matched.splice(i, 1)
        handleKeepAlive(to)
      }
    }
  }
}

/**
 * 这个方法可以过滤用来做嵌套路由的按需加载的 <layout>
 * @param to
 */
// async function handleKeepAlive (to) {
//   if (to.matched && to.matched.length > 2) {
//     for (let i = 0; i < to.matched.length; i++) {
//       const element = to.matched[i]
//       if (element.components.default.name === 'Layout') {
//         to.matched.splice(i, 1)
//         await handleKeepAlive(to)
//       }
//       if (typeof element.components.default === 'function') {
//         await element.components.default()
//         await handleKeepAlive(to)
//       }
//     }
//   }
// }











// export default function (/* { store, ssrContext } */) {
//   const Router = new VueRouter({
//     scrollBehavior: () => ({ x: 0, y: 0 }),
//     constantRoutes,

//     // Leave these as they are and change in quasar.conf.js instead!
//     // quasar.conf.js -> build -> vueRouterMode
//     // quasar.conf.js -> build -> publicPath
//     mode: process.env.VUE_ROUTER_MODE,
//     base: process.env.VUE_ROUTER_BASE
//   })

//   return Router
// }
