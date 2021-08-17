import Layout from "@/pages/Index";
/**
 * 公共路由
 */
const constantRoutes = [
  {
    path: "/redirect",
    component: Layout,
    hidden: true,
    children: [
      {
        path: "/redirect/:path(.*)",
        component: () => import("@/pages/redirect")
      }
    ]
  },
  {
    path: "/login",
    component: () => import("@/pages/login/Login.vue"),
    hidden: true
  },
  {
    path: "/404",
    component: () => import("@/pages/error/404"),
    hidden: true
  },
  {
    path: "/401",
    component: () => import("@/pages/error/401"),
    hidden: true
  },
  {
    path: "",
    meta: { title: '首页', icon: 'dashboard', noCache: true, affix: true },
    component: Layout,
    redirect: "/index",
    hidden: true,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/pages/home/Home'),
  //       name: '首页',
  //       meta: { title: '首页', icon: 'dashboard', noCache: true, affix: true }
  //     }
  //   ]
  }
]

export default constantRoutes
