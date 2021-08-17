import Vue from 'vue'

import "@/assets/icons"; // icon
// 浏览器 title
Vue.prototype.$title = ' | Vue Quasar'

// 侧边栏风格
Vue.prototype.$SildeBar = 'hHh lpR fFf' // 风格二：lHh lpR fFf

Vue.prototype.$Maximumcallstack = 0

// 请求超时时间
Vue.prototype.$timeOut = 8000

// 组件最大缓存数
Vue.prototype.$Max_KeepAlive = 10

process.env.VUE_APP_BASE_API = process.env.NODE_ENV === 'development'? 'http://192.168.2.80:8000':'http://192.168.2.80:8000'


// 前往 public 文件夹的路径
Vue.prototype.$PUBLIC_PATH = process.env.VUE_APP_BASE_API

import {
  addDateRange,
  download,
  handleTree,
  parseTime,
  resetForm,
  selectDictLabel,
  selectDictDefault,
  selectDictLabels
} from "@/utils/ruoyi";

import { getDicts } from "@/api/system/dict/data";
import { getConfigKey } from "@/api/system/config";

Vue.prototype.getDicts = getDicts;
Vue.prototype.getConfigKey = getConfigKey;
Vue.prototype.addDateRange = addDateRange;
Vue.prototype.download = download;
Vue.prototype.handleTree = handleTree;
Vue.prototype.parseTime = parseTime;
Vue.prototype.resetForm = resetForm;
Vue.prototype.selectDictLabel = selectDictLabel;
Vue.prototype.selectDictDefault = selectDictDefault;
Vue.prototype.selectDictLabels = selectDictLabels;


import { Notify,Dialog  } from 'quasar'

Vue.prototype.msgSuccess = function(msg) {
  const negativeNotify = {
    message: 'success',
    type: 'positive',
    position: 'top',
    timeout: 1500
  }
  negativeNotify.message = msg
  Notify.create(negativeNotify)
};

Vue.prototype.msgError = function(msg) {
  const negativeNotify = {
    message: 'error',
    type: 'negative',
    position: 'top',
    timeout: 1500
  }
  negativeNotify.message = msg
  Notify.create(negativeNotify)
};

Vue.prototype.msgWarning = function(msg) {
  const negativeNotify = {
    message: 'warning',
    type: 'warning',
    position: 'top',
    timeout: 1500
  }
  negativeNotify.message = msg
  Notify.create(negativeNotify)
};

Vue.prototype.msgInfo = function(msg) {
  const negativeNotify = {
    message: '',
    type: 'info',
    position: 'top',
    timeout: 1500
  }
  negativeNotify.message = msg
  Notify.create(negativeNotify)
};