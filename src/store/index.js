import Vue from 'vue'
import Vuex from 'vuex'

// import skin from './skin'
import skin from './modules/skin'
import user from './modules/user'
import tagsView from './modules/tagsView'
import permission from './modules/permission'
import modelSelect from './modules/modelSelect'
import app from './modules/app'
import settings from './modules/settings'


Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      skin,
      user,
      permission,
      tagsView,
      modelSelect,
      app,
      settings
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: false
  })

  // if (process.env.DEV && module.hot) {
  //   module.hot.accept(['./skin'], () => {
  //     const newShowcase = require('./skin').default
  //     Store.hotUpdate({ modules: { skin: newShowcase } })
  //   })
  // }


  return Store
}
