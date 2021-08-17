import request from "@/axios/AxiosConfig";

// 获取路由
export const getRouters = () => {
  return request({
    url: "/admin/getRouters/",
    method: "get"
  });
};
