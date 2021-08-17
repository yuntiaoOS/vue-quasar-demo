import constantRoutes  from "@/router/constantRoutes";
import { getRouters } from "@/api/menu";
import Layout from "@/pages/Index";
import ParentView from "@/components/ParentView";
import { handleTree } from "@/utils/ruoyi";

export default {
  namespaced: true,
  state: {
    routes: [],
    addRoutes: [],
    sidebarRouters: []
  },
  getters: {
    
  },
  mutations: {
    SET_ROUTES: (state, routes) => {
      state.addRoutes = routes;
      state.routes = constantRoutes.concat(routes);
    },
    SET_SIDEBAR_ROUTERS: (state, routers) => {
      state.sidebarRouters = constantRoutes.concat(routers);
    }
  },
  actions: {
    // 生成路由
    GenerateRoutes({ commit }) {
      return new Promise(resolve => {
        // 向后端请求路由数据
        // getRouters().then(res => {
          const res = {"code":200,"data":[{"id":1,"name":"System","path":"/system","orderNum":1,"hidden":false,"redirect":"/system","component":"Layout","meta":{"title":"系统管理","icon":"dashboard","noCache":false},"parentId":null},{"id":2,"name":"Permission","path":"/permission","orderNum":2,"hidden":false,"redirect":"/permission","component":"Layout","meta":{"title":"权限管理","icon":"dashboard","noCache":false},"parentId":null},{"id":3,"name":"Dict","path":"dict","orderNum":1,"hidden":false,"redirect":"dict","component":"system/dict/index","meta":{"title":"字典管理","icon":"dashboard","noCache":false},"parentId":1},{"id":4,"name":"Config","path":"config","orderNum":2,"hidden":false,"redirect":"config","component":"system/config/index","meta":{"title":"参数管理","icon":"dashboard","noCache":false},"parentId":1},{"id":5,"name":"Post","path":"post","orderNum":1,"hidden":false,"redirect":"post","component":"permission/post/index","meta":{"title":"岗位管理","icon":"dashboard","noCache":false},"parentId":2},{"id":6,"name":"Dept","path":"dept","orderNum":2,"hidden":false,"redirect":"dept","component":"permission/dept/index","meta":{"title":"部门管理","icon":"dashboard","noCache":false},"parentId":2},{"id":7,"name":"Menu","path":"menu","orderNum":3,"hidden":false,"redirect":"menu","component":"permission/menu/index","meta":{"title":"菜单管理","icon":"dashboard","noCache":false},"parentId":2},{"id":8,"name":"Role","path":"role","orderNum":4,"hidden":false,"redirect":"role","component":"permission/role/index","meta":{"title":"角色管理","icon":"dashboard","noCache":false},"parentId":2},{"id":9,"name":"User","path":"user","orderNum":5,"hidden":false,"redirect":"user","component":"permission/user/index","meta":{"title":"用户管理","icon":"dashboard","noCache":false},"parentId":2},{"id":10,"name":"Django-vue-admin.com","path":"https://django-vue-admin.com","orderNum":9,"hidden":false,"redirect":"noRedirect","component":"Layout","meta":{"title":"dvAdmin官网","icon":"dashboard","noCache":false},"parentId":null},{"id":11,"name":"Savefile","path":"savefile","orderNum":3,"hidden":false,"redirect":"savefile","component":"system/savefile/index","meta":{"title":"文件管理","icon":"dashboard","noCache":false},"parentId":1},{"id":47,"name":"Message","path":"message","orderNum":4,"hidden":false,"redirect":"message","component":"system/message/index","meta":{"title":"通知公告","icon":"dashboard","noCache":false},"parentId":1},{"id":61,"name":"Log","path":"log","orderNum":5,"hidden":false,"redirect":"log","component":"ParentView","meta":{"title":"日志管理","icon":"dashboard","noCache":false},"parentId":1},{"id":62,"name":"Logininfor","path":"logininfor","orderNum":1,"hidden":false,"redirect":"logininfor","component":"monitor/logininfor/index","meta":{"title":"登录日志","icon":"dashboard","noCache":false},"parentId":61},{"id":63,"name":"Operlog","path":"operlog","orderNum":2,"hidden":false,"redirect":"operlog","component":"monitor/operlog/index","meta":{"title":"操作日志","icon":"dashboard","noCache":false},"parentId":61},{"id":66,"name":"Monitor","path":"/monitor","orderNum":3,"hidden":false,"redirect":"/monitor","component":"Layout","meta":{"title":"系统监控","icon":"dashboard","noCache":false},"parentId":null},{"id":70,"name":"Celery","path":"celery","orderNum":2,"hidden":false,"redirect":"celery","component":"monitor/celery/index","meta":{"title":"定时任务","icon":"dashboard","noCache":false},"parentId":66},{"id":79,"name":"Celerylog","path":"celerylog","orderNum":3,"hidden":false,"redirect":"celerylog","component":"monitor/celery/celerylog/index","meta":{"title":"定时日志","icon":"dashboard","noCache":false},"parentId":61},{"id":82,"name":"Tool","path":"/tool","orderNum":4,"hidden":false,"redirect":"/tool","component":"Layout","meta":{"title":"系统工具","icon":"dashboard","noCache":false},"parentId":null},{"id":83,"name":"Build","path":"build","orderNum":1,"hidden":false,"redirect":"build","component":"tool/build/index","meta":{"title":"表单构建","icon":"dashboard","noCache":false},"parentId":82},{"id":84,"name":"Swagger","path":"swagger","orderNum":2,"hidden":false,"redirect":"swagger","component":"tool/swagger/index","meta":{"title":"系统接口","icon":"dashboard","noCache":false},"parentId":82},{"id":92,"name":"Server","path":"/monitor/server","orderNum":3,"hidden":false,"redirect":"/monitor/server","component":"monitor/server/index","meta":{"title":"服务监控","icon":"dashboard","noCache":false},"parentId":66}
                        ,{"id":97,"name":"Index","path":"/index","orderNum":0,"hidden":false,"redirect":"/index","component":"Layout/index","meta":{"title":"首页","icon":"dashboard","noCache":false},"parentId":null}],"msg":"success","status":"success"}
          const data = handleTree(res.data, "id");
          // console.log('------------handleTree---------------------',data)
          const sdata = JSON.parse(JSON.stringify(data));
          const rdata = JSON.parse(JSON.stringify(data));
          const sidebarRoutes = filterAsyncRouter(sdata);
          const rewriteRoutes = filterAsyncRouter(rdata, false, true);
          // console.log('------------rewriteRoutes---------------------',rewriteRoutes,sidebarRoutes)
          rewriteRoutes.push({ path: "*", redirect: "/404", hidden: true });
          commit("SET_ROUTES", rewriteRoutes);
          commit("SET_SIDEBAR_ROUTERS", sidebarRoutes);
          resolve(rewriteRoutes);
        // });
      });
    }
  }
}


// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap, lastRouter = false, type = false) {
  return asyncRouterMap.filter(route => {
    if (type && route.children) {
      route.children = filterChildren(route.children);
    }
    if (route.component) {
      // console.log('---------------route.component-----------------------',route.component)
      // Layout ParentView 组件特殊处理
      if (route.component === "Layout") {
        route.component = Layout;
      } else if (route.component === "ParentView") {
        route.component = ParentView;
      } else if (typeof route.component === "string" && route.component === "Layout/index" && !route.children) { // 首页定制
        route.meta.affix = true;
        route.children = [
          {
            path: "index",
            component: 'home/Home',
            name: route.name,
            meta: route.meta
          }
        ];
        route.path = "/";
        route.name = "";
        route.hidden = true
        route.redirect = "/index";
        route.alwaysShow = false;
        route.component = Layout;
      } else {
        route.component = loadView(route.component);
      }
    }
    if (route.children !== null && route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children, route, type);
      if (route.children.length === 1 && route.children[0].path === "index") {
        route.alwaysShow = false;
      } else {
        route.alwaysShow = true;
      }
    } else {
      delete route["children"];
      delete route["redirect"];
    }
    return true;
  });
}

function filterChildren(childrenMap, lastRouter = false) {
  var children = [];
  childrenMap.forEach((el, index) => {
    if (el.children && el.children.length) {
      if (el.component === "ParentView") {
        el.children.forEach(c => {
          c.path = el.path + "/" + c.path;
          if (c.children && c.children.length) {
            children = children.concat(filterChildren(c.children, c));
            return;
          }
          children.push(c);
        });
        return;
      }
    }
    if (lastRouter) {
      el.path = lastRouter.path + "/" + el.path;
    }
    children = children.concat(el);
  });
  return children;
}

export const loadView = (view) => { // 路由懒加载
  return () => import(`@/pages/${view}`)
  // return (resolve) => require([`@/pages/${view}`], resolve);
};
