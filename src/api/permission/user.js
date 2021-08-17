import request from "@/axios/AxiosConfig";
import { praseStrEmpty } from "@/utils/ruoyi";

// 查询用户列表
export function listUser(query) {
  return request({
    url: "/admin/permission/user/",
    method: "get",
    params: query
  });
}

// 查询用户详细
export function getUser(userId) {
  return request({
    url: "/admin/permission/user/details/?userId=" + praseStrEmpty(userId),
    method: "get"
  });
}

// 新增用户
export function addUser(data) {
  return request({
    url: "/admin/permission/user/",
    method: "post",
    data: data
  });
}

// 修改用户
export function updateUser(data) {
  return request({
    url: "/admin/permission/user/" + data.id + "/",
    method: "put",
    data: data
  });
}

// 删除用户
export function delUser(userId) {
  return request({
    url: "/admin/permission/user/" + userId + "/",
    method: "delete"
  });
}

// 导出用户
export function exportUser(query) {
  return request({
    url: "/admin/permission/user/export/",
    method: "get",
    params: query
  });
}

// 用户密码重置
export function resetUserPwd(userId, password) {
  const data = {
    userId,
    password
  };
  return request({
    url: "/admin/permission/user/resetPwd/",
    method: "put",
    data: data
  });
}

// 用户状态修改
export function changeUserStatus(userId, status) {
  const data = {
    userId,
    status
  };
  return request({
    url: "/admin/permission/user/changeStatus/",
    method: "put",
    data: data
  });
}

// 查询用户个人信息
export function getUserProfile() {
  return request({
    url: "/admin/permission/user/profile/",
    method: "get"
  });
}

// 修改用户个人信息
export function updateUserProfile(data) {
  return request({
    url: "/admin/permission/user/profile/",
    method: "put",
    data: data
  });
}

// 用户密码重置
export function updateUserPwd(oldPassword, newPassword) {
  const data = {
    oldPassword,
    newPassword
  };
  return request({
    url: "/admin/permission/user/profile/updatePwd/",
    method: "put",
    data: data
  });
}

// 用户头像上传
export function uploadAvatar(data) {
  return request({
    url: "/admin/permission/user/profile/avatar/",
    method: "put",
    data: data
  });
}

// 下载用户导入模板
export function importTemplate() {
  return request({
    url: "/admin/permission/user/importTemplate/",
    method: "get"
  });
}

// 用户导入
export function importsUser(data) {
  return request({
    url: "/admin/permission/user/importTemplate/",
    method: "post",
    data: data
  });
}
