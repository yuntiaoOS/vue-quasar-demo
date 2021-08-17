import { getInfo, login, logout } from "@/api/login";
import { getToken, removeToken, setToken } from "@/utils/auth";
export default {
  namespaced: true,
  state: {
    token: getToken(),
    name: "",
    avatar: "",
    roles: [],
    permissions: [],
    unread_msg_count: 0
  },
  getters: {
    confirmAuth(s) {
      return (v) => s.auth.some((au) => au.action === v);
    },
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_NAME: (state, name) => {
      state.name = name;
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar;
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles;
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions;
    },
    SET_UNREAD_MSG_COUNT: (state, unread_msg_count) => {
      state.unread_msg_count = unread_msg_count;
    }
  },
  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim();
      const password = userInfo.password;
      const code = userInfo.code;
      const uuid = userInfo.uuid;

      return new Promise((resolve, reject) => {
        // login(username, password, code, uuid).then(res => {
          const res = {"code":200,"data":{"token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6ImFkbWluIiwic2Vzc2lvbl9pZCI6IjQ3YjFiMGNmLTllOGQtNDlhMy1hZDgxLWRiNDNhODc4YjIzMyIsImV4cCI6MTYyODkxMTU1OCwib3JpZ19pYXQiOjE2Mjg4MjUxNTh9.2Xrr7Mr06iUzpxnbUSHvVzgEJMbKan4Xph1m5wvw5ok"},"msg":"success","status":"success"}
          setToken(res.data.token);
          console.log('--------getToken()-------------',getToken())
          commit("SET_TOKEN", res.data.token);
          resolve();
        // }).catch(error => {
        //   reject(error);
        // });
      });
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        // getInfo(state.token).then(res => {
          const res = {"code":200,"data":{"permissions":["*:*:*"],"roles":["admin"],"user":{"id":1,"create_datetime":"2021-02-27 06:20:09","update_datetime":"2021-08-13 11:25:58","creator_name":"admin","admin":true,"deptId":1,"unread_msg_count":0,"last_login":"2021-08-13T11:25:58.215037","first_name":"","last_name":"","is_staff":true,"is_active":true,"description":null,"modifier":null,"dept_belong_id":"1","username":"admin","email":"admin@qq.com","mobile":null,"avatar":null,"name":"管理员","gender":"2","remark":"1","user_type":2,"dept":{"id":1,"description":"","modifier":"admin","dept_belong_id":"1","update_datetime":"2021-02-27T07:26:20.518695","create_datetime":"2021-02-27T15:18:39","deptName":"XX创新科技","orderNum":1,"owner":null,"phone":"15888888888","email":"cxkj@qq.com","status":"1","creator":1,"parentId":null},"post":[{"id":1,"description":"","modifier":"admin","dept_belong_id":"1","update_datetime":"2021-02-27T07:16:10.725970","create_datetime":"2021-02-27T07:16:10.726016","postName":"董事长","postCode":"ceo","postSort":1,"status":"1","remark":null,"creator":1}],"role":[{"id":1,"description":"","modifier":"admin","dept_belong_id":"1","update_datetime":"2021-07-13T19:50:16.468462","create_datetime":"2021-02-27T08:48:08.064911","roleName":"超级管理员","roleKey":"admin","roleSort":1,"status":"1","admin":true,"dataScope":"2","remark":null,"creator":1,"dept":[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],"menu":[1,2,3,4,5,6,7,8,9,10,11,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,70,71,72,73,74,75,76,77,78,79,80,81,82,83,85,86,87,88,90,91,97]}]}},"msg":"success","status":"success"}
          const user = res.data.user;
          const avatar = user.avatar ? process.env.VUE_APP_BASE_API + user.avatar : require("@/assets/images/profile.jpg");
          if (res.data.roles && res.data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            commit("SET_ROLES", res.data.roles);
            commit("SET_PERMISSIONS", res.data.permissions);
          } else {
            commit("SET_ROLES", ["ROLE_DEFAULT"]);
          }
          commit("SET_NAME", user.name);
          commit("SET_UNREAD_MSG_COUNT", user.unread_msg_count);
          commit("SET_AVATAR", avatar);
          resolve(res.data);
        // }).catch(error => {
        //   reject(error);
        // });
      });
    },

    // 退出系统
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit("SET_TOKEN", "");
          commit("SET_ROLES", []);
          commit("SET_PERMISSIONS", []);
          removeToken();
          resolve();
        }).catch(error => {
          reject(error);
        });
      });
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit("SET_TOKEN", "");
        removeToken();
        resolve();
      });
    }
  
  },
};
