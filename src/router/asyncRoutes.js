// import layout from '../components/Layout/Layout'

/**
 * 需要授权访问的路由
 */
const asyncRoutesChildren = [
]

const asyncRoutes = [
  {
    path: '/',
    name: 'index',
    redirect: '/',
    component: () => import('@/pages/Index'),
    children: asyncRoutesChildren
  }
]

export default asyncRoutes

export { asyncRoutesChildren }
