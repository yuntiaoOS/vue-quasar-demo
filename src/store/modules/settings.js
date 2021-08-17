// import defaultSettings from "@/settings";
// const { sideTheme, showSettings, tagsView, fixedHeader, sidebarLogo } = defaultSettings;
export default {
  namespaced: true,
  state: {
    theme: '#1890ff',
    sideTheme: '"theme-dark"',
    showSettings: false,
    tagsView: true,
    fixedHeader: false,
    sidebarLogo: true
  },
  getters: {
    
  },
  mutations: {
    CHANGE_SETTING: (state, { key, value }) => {
      // eslint-disable-next-line no-prototype-builtins
      if (state.hasOwnProperty(key)) {
        state[key] = value;
      }
    }
  },
  actions: {
    changeSetting({ commit }, data) {
      commit("CHANGE_SETTING", data);
    }
  }
}