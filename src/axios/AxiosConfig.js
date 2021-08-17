import Axios from 'axios'
import Vue from 'vue'
import { Notify,Dialog  } from 'quasar'
import qs from 'qs'
import { getToken ,removeToken} from "@/utils/auth";
import errorCode from "@/utils/errorCode";
import router from '@/router'
/**
 * axios 初始化
 */
 process.env.VUE_APP_BASE_API = process.env.NODE_ENV === 'development'? 'http://192.168.2.80:8000':'http://192.168.2.80:8000'
const axios = Axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // 请求基地址
  timeout: 100// 15000 // 超时时间
})

// 请求拦截器
axios.interceptors.request.use(
  config => {
    const token = sessionStorage.getItem('access_token')
    config.headers.Authorization = 'Bearer ' + token
    const isToken = (config.headers || {}).isToken === false;
    if (getToken() && !isToken) {
      config.headers["Authorization"] = "Bearer " + getToken(); // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    // config.headers.sg_cn = 'Bearerfasdfs ' + token
    //设置请求头
    //内容类型：如果是post请求必须指定这个属性
    config.headers['Content-Type'] = "application/json;charset=utf-8"

    // config.headers['Referrer-Policy'] = "no-referrer"
    // config.headers['Content-Security-Policy'] = "default-src 'none'; script-src 'self'; img-src 'self'; style-src 'self'; connect-src 'self';"
    // config.headers['X-Frame-Options'] =  "DENY"
    // config.headers['X-XSS-Protection'] = "1; mode = block"
    // config.headers['Feature-Policy'] = "accelerometer 'none'; ambient-light-sensor 'none'; autoplay 'none'; camera 'none'; encrypted-media 'none'; fullscreen 'self'; geolocation 'none'; gyroscope 'none'; magnetometer 'none'; microphone 'none'; midi 'none'; payment 'none'; picture-in-picture 'none'; speaker 'none'; sync-xhr 'none'; usb 'none'; vr 'none';"
    // if (config.type) {
    //   switch (config.type) {
    //     case 'FORM-DATA':
    //       config.transformRequest = [data => { return 'args=' + JSON.stringify(data) }]
    //       break
    //     case 'FORM':
    //       config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    //       config.data = qs.stringify(config.data)
    //       break
    //     default:
    //       break
    //   }
    // }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
axios.interceptors.response.use(
  res => {
    const negativeNotify = {
      message: '未知错误',
      type: 'negative',
      position: 'top',
      timeout: 100//1500
    }
    const code = res.data.code || 200;
    // 获取错误信息
    const msg = errorCode[code] || res.data.msg || errorCode["default"];
    if (code === 401) {
      // MessageBox.confirm("登录状态已过期，您可以继续留在该页面，或者重新登录", "系统提示", {
      //   confirmButtonText: "重新登录",
      //   cancelButtonText: "取消",
      //   type: "warning"
      // }
      // ).then(() => {
      //   location.href = "/index";
      // });
      Dialog.create({
        title: '系统提示',
        message: '登录状态已过期，您可以继续留在该页面，或者重新登录',
        cancel: '取消',
        ok : '重新登录',
        persistent: true
      }).onOk(() => {
        // console.log('>>>> OK')
        // removeToken()
        // router.push({ path: '/login' })
        
        location.href = "/#/index";
      }).onOk(() => {
        // console.log('>>>> second OK catcher')
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
    } else if (code === 500) {
      negativeNotify.message = msg
      Notify.create(negativeNotify)
      return Promise.reject(new Error(msg));
    } else if (code !== 200) {
      // Notification.error({
      //   title: msg
      // });
      negativeNotify.message = msg
      Notify.create(negativeNotify)
      return Promise.reject("error");
    } else {
      return res.data;
    }
  },
  error => {
    const defaultNotify = {
      message: '未知错误',
      icon: 'warning',
      color: 'warning',
      position: 'top',
      timeout: 1500
    }
    if (error.code === 'ECONNABORTED' || error.message.indexOf('timeout') !== -1 || error.message === 'Network Error') {
      defaultNotify.message = '网络异常'
      Notify.create(defaultNotify)
      return Promise.reject(error)
    }
    switch (error.response.status) {
      case 403:
        defaultNotify.message = '拒绝访问(403)'
        Notify.create(defaultNotify)
        break
      case 404:
        defaultNotify.message = '资源不存在(404)'
        Notify.create(defaultNotify)
        break
      case 408:
        defaultNotify.message = '请求超时(404)'
        Notify.create(defaultNotify)
        break
      case 500:
        defaultNotify.message = '服务器错误(500)'
        Notify.create(defaultNotify)
        break
      case 501:
        defaultNotify.message = '服务未实现(501)'
        Notify.create(defaultNotify)
        break
      case 502:
        defaultNotify.message = '网络错误(502)'
        Notify.create(defaultNotify)
        break
      case 503:
        defaultNotify.message = '服务不可用(503)'
        Notify.create(defaultNotify)
        break
      case 504:
        defaultNotify.message = '网络超时(504)'
        Notify.create(defaultNotify)
        break
      case 505:
        defaultNotify.message = 'HTTP版本不受支持(505)'
        Notify.create(defaultNotify)
        break
      default:
        break
    }
    return Promise.reject(error)
  }
)

export default axios
