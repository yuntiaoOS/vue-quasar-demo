import request from "@/axios/AxiosConfig";

// 查询字典数据列表
export function listData(query) {
  return request({
    url: "/admin/system/dict/data/",
    method: "get",
    params: query
  });
}

// 查询字典数据详细
export function getData(dictCode) {
  return request({
    url: "/admin/system/dict/data/" + dictCode + "/",
    method: "get"
  });
}

// 根据字典类型查询字典数据信息
export function getDicts(dictType) {
  return request({
    url: "/admin/system/dict/get/type/" + dictType + "/?status=1",
    method: "get"
  });
}

// 新增字典数据
export function addData(data) {
  return request({
    url: "/admin/system/dict/data" + "/",
    method: "post",
    data: data
  });
}

// 修改字典数据
export function updateData(data) {
  return request({
    url: "/admin/system/dict/data/" + data.id + "/",
    method: "put",
    data: data
  });
}

// 删除字典数据
export function delData(dictCode) {
  return request({
    url: "/admin/system/dict/data/" + dictCode + "/",
    method: "delete"
  });
}

// 导出字典数据
export function exportData(query) {
  return request({
    url: "/admin/system/dict/data/export/",
    method: "get",
    params: query
  });
}
