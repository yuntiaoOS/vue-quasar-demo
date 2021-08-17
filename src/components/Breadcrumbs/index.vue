<template>

    <q-breadcrumbs class="flex items-center" active-color="none" style="transform: translateX(10px);">
      <transition-group name="breadcrumb">
        <template v-for="(v,i) in levelList">
          <q-breadcrumbs-el v-if="v.title" class="items-center" style="vertical-align: middle"
             :label="v.title"
             :icon="v.icon === '' ? undefined : v.icon"
             :key="i+v.title">
            <template slot="default">
              <div v-if="levelList.length !== i+1" style="margin:0px 8px 0px 8px">
                /
              </div>
            </template>
          </q-breadcrumbs-el>
        </template>
      </transition-group>
    </q-breadcrumbs>
</template>

<script>
export default {
  name: 'Breadcrumbs',
  data () {
    return {
      levelList: null
    }
  },
  watch: {
    $route(route) {
      // if you go to the redirect page, do not update the breadcrumbs
      if (route.path.startsWith("/redirect/")) {
        return;
      }
      this.getBreadcrumb();
    }
  },
  created() {
    this.getBreadcrumb();
  },
  methods: {
    getBreadcrumb() {
      // only show routes with meta.title
      const matched = this.$route.matched.filter(item => item.meta && item.meta.title);
      const first = matched[0];

      if (!this.isDashboard(first)) {
        // matched = [{ path: '/index', meta: { title: '首页' }}].concat(matched)
      }

      this.levelList = matched.filter(item => item.meta && item.meta.title && item.meta.breadcrumb !== false);
    },
    isDashboard(route) {
      const name = route && route.name;
      if (!name) {
        return false;
      }
      return name.trim() === "首页";
    },
    handleLink(item) {
      const { redirect, path } = item;
      if (redirect) {
        this.$router.push(redirect);
        return;
      }
      this.$router.push(path);
    }
  }
}
</script>
