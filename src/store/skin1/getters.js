/*
export function someGetter (state) {
}
*/
export function someGetter (state) {
  return {
    getRole: state.role,
    getRoutes: state.routes,
    getTagView: state.tagView ,
    getBreadcrumbs: state.breadcrumbs ,
    getKeepAliveList: state.keepAliveList 
  }
}
