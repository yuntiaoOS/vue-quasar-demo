
export default {
  namespaced: true,
  state: {
    modelSelectMap: {}
  },
  getters: {
    getModelSelect(state) {
      return state.modelSelectMap;
    }
  },
  mutations: {
    setModelSelectMap(state, modelSelectMap) {
      state.modelSelectMap = { ...state.modelSelectMap, ...modelSelectMap };
    }
  },
  actions: {
    // 从后台获取需要 select 选择数据
    // modelName : 模型 name
    // labelName : 后端接口返回时，配置下拉选择时显示的名字字段，如：name/title/nickName
    // listApi : 查询列表的api
    async getModelSelect({ commit, state }, paramsMap) {
      const modelName = paramsMap["modelName"];
      const labelName = paramsMap["labelName"];
      const listApi = paramsMap["listApi"];
      const params = paramsMap["params"];
      const reset = paramsMap["reset"];
      if (!reset && state.modelSelectMap[modelName]) {
        return state.modelSelectMap[modelName];
      } else {
        const res = await listApi({ pageNum: "all", ...params });
        if (res.code === 200) {
          const modelSelectMap = {};
          const dict = [];
          res.data && res.data.map(item => {
            dict.push({
              label: item[labelName],
              value: item.id,
              id: item.id,
              parentId: item.parentId
            });
          });
          modelSelectMap[modelName] = dict;
          commit("setModelSelectMap", modelSelectMap);
          return state.modelSelectMap[modelName];
        }
      }
    }
  }
}