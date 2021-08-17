<template>
  <q-scroll-area :visible="false" class="fit" :thumb-style="thumbStyleOfMenu">
   <div>
    <!-- 动态菜单 -->
    <q-list>
      <base-menu-item
        :my-router="menuList"
        :init-level="0"
        :bg-color="bgColor"
        :duration="300"
        :bg-color-level="1"/>
    </q-list>

    <!-- 底部说明 -->
    <bottom-link/>

   </div>
  </q-scroll-area>
</template>

<script>
import BaseMenuItem from './BaseMenuItem'
import BottomLink from './BottomLink'
export default {
  name: 'base-menu',
  components: { BaseMenuItem, BottomLink },
  data () {
    return {
      menuList: this.$store.state.permission.sidebarRouters,// this.$store.state.skin.routes[0].children,
      bgColor: 'bg-white',
      thumbStyleOfMenu: {
          borderRadius: '5px',
          backgroundColor: 'rgba(144,147,153,0.9)',
          padding: '10px;',
          margin: '10px;',
          width: '3px'
        }
    }
  },
}
</script>
