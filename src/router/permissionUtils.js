import store from '@/store'
import Layout from '@/components/Layout/Layout'


export default function constructionRouters (router, t) {
  t = router.filter(item => {
    // 如果 roles 没有被设置，则所有人均可访问
    if (!item.meta.roles || item.meta.roles.length === 0) return true
    return item.meta.roles.indexOf(store().state.skin.role) !== -1
  })
  for (const item of t) {
    if (item.children) {
      item.children = constructionRouters(item.children)
    }
  }
  return t
}

export function handleComponent (component) {
  // 路由懒加载
  console.log('------------handleComponent---------------',component)
  // return (resolve) => require([`@/${component}`], resolve)
  return () => import('@/pages' + component)
  // return () => import('@/pages/home/Home')
}


export function handleJsonRouterToAsyncRouter(jsonRouter, t){
  t = jsonRouter.map(item => {
    if (item.component === 'Layout') {
      item.component = Layout
    } else {
      // 组件懒加载
      // const routerItem = { item: () => import('@/' + item.component) }
      item.component = handleComponent(item.component)
    }
    return item
  })
  for (const item of t) {
    if (item.children) {
      item.children = handleJsonRouterToAsyncRouter(item.children)
    }
  }
  return t
}



/**
 * 将 vue 路由转换为 json 字符串
 * 将 asyncRouters 的 roles 初始化为空，同时处理 Component 的懒加载：
 * component: () => import('../views/home/Home') 转换为 component: 'views/home/Home'
 * @param asyncRouters
 * @returns {Promise<void>} 处理后的 asyncRouters JSON 字符串
 */
export async function handleAsyncRouterToJson (asyncRouters) {
  // 先把路由树中的每个节点的 roles 重置为 []，即每个人都可以访问
  for (const item of asyncRouters) {
    item.meta.roles = []
    if (item.children) {
      await handleAsyncRouterToJson(item.children)
    }
    // 当遍历到 *（404）路由时，说明遍历完成，接着去处理 Component 的懒加载
    if (item.path === '*') {
      return await handleAsyncRouterComponentToJson(asyncRouters)
    }
  }
}

/**
 * 处理 Component 的懒加载
 * component: () => import('../views/home/Home') 转换为 component: 'views/home/Home'
 * @param asyncRouters
 * @returns {Promise<void>}
 */
export async function handleAsyncRouterComponentToJson (asyncRouters) {
  for (const item of asyncRouters) {
    // 如果 component 是懒加载，则执行它
    if (typeof item.component === 'function') {
      const c = await item.component()
      // 使用正则表达式将地址中的 src 替换
      item.component = c.default.__file.replace(/src\//, '')
    } else if (item.component) {
      item.component = item.component.name
    }
    if (item.children) {
      await handleAsyncRouterComponentToJson(item.children)
    }
    // 当遍历到 * （404）路由时，说明遍历完成
    if (item.path === '*') {
      // 去除 404 路由，在新增路由时自动添加
      asyncRouters.pop()
      return asyncRouters
    }
  }
}

/**
 * 用于添加新角色和对应的路由
 * 使用 selectedRouter 过滤 baseRouter 中的路由，得到新的角色路由（广度优先）
 * @param baseRouter 基础路由
 * @param selectedRouter：Array  被选中的路由标识
 * @param t 暂存变量
 * @returns {Promise<void>} 处理后的 asyncRouters JSON 字符串
 */
export function handleBaseRouterToRolesRouter (baseRouter, selectedRouter, t) {
  t = baseRouter.filter(item => {
    return selectedRouter.some(s => {
      return s === item.name
    })
  })
  for (const item of t) {
    if (item.children) {
      item.children = handleBaseRouterToRolesRouter(item.children, selectedRouter)
    }
  }
  return t
}
