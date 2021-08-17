  
<template>
  
    <span class="el-dropdown-link" slot="reference">
      {{title}}<i class="fas fa-sort-down q-ml-xs"></i>
      <q-menu  >
        <q-option-group
          class="q-pa-sm text-caption"
          size="18px"
          v-model="selectvalues"
          :options="options"
          color="primary"
          @input="selectedFunc"
        />
      </q-menu>
    </span>
  
</template>

<script>
// import KtButton from "@/views/Core/KtButton"
// import { hasPermission } from '@/utils/index.js'

export default {
    // components:{KtButton},
    props: {
      width: {  // 按钮显示图标
        type: String,
        default: '200'
      },
      elradiogroupStyle:{  // 按钮显示图标
        type: String,
        default: ''
      },
      title: {  // 按钮显示图标
        type: String,
        required:true,
        default: ''
      },
      isSystem: { // 按钮显示图标
        type: Boolean,
        default: ()=> false
      },
      disabled: {  // 按钮是否禁用
        type: Boolean,
        default: ()=> false
      },
      options: { 
        type: Array,
        required:true,
        default: []
      },
      perms: {  // 按钮权限标识，外部使用者传入
        type: String,
        default: null
      }
    },
    filters: {
    // statusEndChangeTypeFilter(status) {
    //   const statusMap = {
    //     1: 'info',
    //     2: 'success',
    //     3: 'danger'
    //   }
    //   return statusMap[status]
    // },

  },
  watch:{
    // options:{
    //   handler(newValue, oldValue) {
    //     alert('vvvvvvvvvv')
    //     this.$forceUpdate()
    //   },
    //   deep: true
    // }
  },
  
  data() {
    return {
      selectvalues: ''
      // selectvalues: []
      
    };
  },
  methods: {
    hasPerms(perms) {
      // 根据权限标识和外部指示状态进行权限判断
      // console.log('xmdropdown',perms,this.isSystem,this.disabled,hasPermission(perms,this.isSystem) && !this.disabled)
      return  true//hasPermission(perms,this.isSystem) && !this.disabled
    },
    selectedFunc: function (val) {
      // 按钮操作处理函数
      this.$emit('change', { val: val })
    }, 

  },
  
  mounted() {

  }
};
</script>

<style scoped lang="scss">
.el-dropdown-link {
  cursor: pointer;
  color: #000;
}
.el-icon-arrow-down {
  font-size: 12px;
}
</style>