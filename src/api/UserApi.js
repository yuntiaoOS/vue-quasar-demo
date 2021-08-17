import _axios from '../axios/AxiosConfig'
import Vue from 'vue'

export function getUserRouter () {
  return _axios({
    url: '/data/asyncRouterDemo',
    method: 'get',
    responseType: 'text'
  })
}


export const getadminlist = (data) => {
  return _axios({
      url: '/data/responseJson',
      method: 'get',
      responseType: 'json',
      data
  })
}

export const captchaRefresh = (query) => {
  return _axios({
      url: '/captcha/refresh',
      method: 'get',
      responseType: 'json',
      params: query
  })
}
