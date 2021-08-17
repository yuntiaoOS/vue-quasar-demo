<template>
  <div>
    <q-page class="q-pa-sm">
      <q-card>
        <q-card-section>
          <div class="text-h6 text-indigo-8">菜单管理</div>
          <div class="fit row no-wrap justify-end items-end content-end example-container">
            <q-input style="width:300px;" size="sm" tabindex="0" class="example-cell" borderless dense debounce="300" v-model="filter" placeholder="Search">
              <template v-slot:append>
                <q-icon name="search"  @click="filter = ''" class="cursor-pointer"/>
              </template>
              <template v-slot:after>
                <q-btn label="添加" icon-right="add" size="sm" class="bg-indigo-8 text-capitalize text-white" @click="addMenuFunc"></q-btn>
              </template>
            </q-input>
          </div>
        </q-card-section>

        <q-separator></q-separator>
        <q-card-section class="q-pa-none">
          <!-- <simple-hierarchy :columns_props="columns_props" :data_props="menuList"></simple-hierarchy> -->
          <custom-hierarchy :columns_props="columns_props":data_props="menuList" @edit="editMenuFunc" @dele="deleMenuFunc"></custom-hierarchy>
        </q-card-section>
      </q-card>
    </q-page>

    <q-dialog v-model="prompt" persistent>
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">{{title}}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form
            @submit="onSubmit"
            @reset="onReset"
            class="q-gutter-md"
          >
            <q-input
              filled
              v-model="dataForm.parentName"
              label="上级菜单"
              hint="点击选择"
              readonly  
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Please type something']"
            >
              <q-popup-edit ref="q_popup_edit_parentId" v-model="dataForm.parentId" content-class="bg-white text-dark">
                <q-tree
                    :nodes="popupTreeData"
                    node-key="id"
                    label-key="name"
                    children-key="children"
                    selected-color="primary"
                    :selected.sync="dataForm.parentId"
                    default-expand-all
                    @update:selected="updateSelectedFunc"
                  />
              </q-popup-edit>
            </q-input>

            <div class="fit row  justify-start items-start content-start">
              <span>菜单类型：</span> 
              <q-option-group
              v-model="dataForm.menuType"
              :options="typeOption"
              color="primary"
              inline
              size="xs"
              dense
            >
            </q-option-group>
            </div>

            <q-input
              v-if="dataForm.type !== 5"
              filled
              v-model="dataForm.icon"
              label="菜单图标"
              hint=""
              lazy-rules
              readonly
              :rules="[ val => val !== undefined || 'Please type something']"
            >
              <q-popup-edit ref="q_popup_edit_icon" v-model="dataForm.icon" content-class="bg-white text-dark">
                <q-tabs
                  v-model="tab"
                  dense
                  align="left"
                  :breakpoint="0"
                  class="text-grey"
                  active-color="primary"
                  indicator-color="primary"
                  narrow-indicator
                >
                  <q-tab name="material Icons" label="material design 图标集"/>
                  <q-tab name="fontawesome-v5" label="fontawesome-v5 图标集"/>
                  <q-tab name="bootstrap Icons" label="bootstrap Icons 图标集"/>
                </q-tabs>
                <q-tab-panels v-model="tab" animated style="overflow-y:visible">

                  <q-tab-panel name="material Icons" id="mdtext"  style="min-height:500px;"></q-tab-panel>

                  <q-tab-panel name="fontawesome-v5" id="fatext"   style="min-height:500px;"></q-tab-panel>

                  <q-tab-panel name="bootstrap Icons" id="bstext"   style="min-height:500px;"></q-tab-panel>

                </q-tab-panels>
              </q-popup-edit>
            </q-input>

            <div class="row justify-between">
              <div class="col-6">
                <q-input
                  class="q-pr-sm"
                  filled
                  v-model="dataForm.name"
                  :label="['目录', '菜单', '按钮'][parseInt(dataForm.menuType)] + '名称 *'"
                  hint="尽量保持唯一"
                  lazy-rules
                  :rules="[ val => val && val.length > 0 || 'Please type something']"
                />
              </div>
              <div class="col-6">
                <q-input
                  class="q-pl-sm"
                  filled
                  v-model="dataForm.orderNum"
                  type="number"
                  label="显示排序"
                  hint="左侧菜单显示排序"
                  lazy-rules
                  :rules="[ val => val !== undefined  || 'Please type something']"
                />
              </div>
            </div>
            
            <div class="fit row  justify-start items-start content-start">
              <span>是否外链：</span> 
              <q-option-group
                v-model="dataForm.isFrame"
                :options="[{ label: '是', value: '0' },{ label: '否', value: '1' }]"
                color="primary"
                inline
                size="xs"
                dense
              >
              </q-option-group>
            </div>
            
            <div class="row justify-between">
              <div class="col-6">
                <q-input
                  class="q-pr-sm"
                  v-if="dataForm.type !== 5"
                  filled
                  v-model="dataForm.web_path"
                  label="路由地址"
                  hint="页面路径为 /Sys/User, 此处填写 User。"
                  lazy-rules
                  :rules="[ val => val !== undefined || '路由地址不能为空']"
                />
              </div>
              <div class="col-6">
                <q-input
                  class="q-pl-sm"
                  v-if="dataForm.type !== 5"
                  filled
                  v-model="dataForm.component_path"
                  label="组件路径"
                  hint="页面路径为 /Sys/User, 此处填写 /Sys/User。"
                  lazy-rules
                  :rules="[ val => val !== undefined || '组件路径不能为空']"
                />
              </div>
            </div>
            
            <div class="row justify-between">
              <div class="col-6">
                <q-input
                  class="q-pr-sm"
                  v-if="dataForm.type !== 5"
                  filled
                  v-model="dataForm.interface_path"
                  label="接口路径"
                  hint="请输入后端接口路径"
                  lazy-rules
                  :rules="[ val => val !== undefined || 'Please type something']"
                />
              </div>
              <div class="col-6">
                <q-select class="q-pl-sm" filled v-model="dataForm.interface_method" option-value="dictValue" option-label="dictLabel" :options="interfaceMethodOptions" label="请求方法" />
              </div>
            </div>
            
            <q-input
              v-if="dataForm.type !== 5"
              filled
              v-model="dataForm.perms"
              label="权限标识"
              hint="如: sys:user:add, sys:user:edit, sys:user:dele"
              lazy-rules
              :rules="[ val => val !== undefined || 'Please type something']"
            />

            <div class="row">
              <div class="col-md-6">
                <div class="fit row  justify-start items-start content-start">
                  <span>显示状态：</span> 
                  <q-option-group
                    v-model="dataForm.visible"
                    :options="[{ label: '是', value: '0' },{ label: '否', value: '1' }]"
                    color="primary"
                    inline
                    size="xs"
                    dense
                  >
                  </q-option-group>
                </div>
              </div>
              <div class="col-md-6 ">
                <div class="fit row  justify-start items-start content-start">
                  <span>菜单状态：</span> 
                  <q-option-group
                    v-model="dataForm.status"
                    :options="[{ label: '是', value: '0' },{ label: '否', value: '1' }]"
                    color="primary"
                    inline
                    size="xs"
                    dense
                  >
                  </q-option-group>
                </div>
              </div>
            </div>
            
            <div class="fit row  justify-start items-start content-start">
              <span>是否缓存：</span> 
              <q-option-group
                v-model="dataForm.isCache"
                :options="[{ label: '是', value: '0' },{ label: '否', value: '1' }]"
                color="primary"
                inline
                size="xs"
                dense
              >
              </q-option-group>
            </div>

            
              
            <div align="right">
              <q-btn label="取消" type="reset" color="primary" v-close-popup flat class="q-ml-xs" />
              <q-btn label="确定" type="submit" color="primary"/>
            </div>
          </q-form>
        </q-card-section>

        <!-- <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Add address" v-close-popup />
        </q-card-actions> -->
      </q-card>
    </q-dialog>
  </div>
    
</template>

<script>
import { addMenu, delMenu, getMenu, listMenu, updateMenu } from "@/api/permission/menu";
import clipboard from '@/utils/clipboard'
import { copyToClipboard } from 'quasar'
import * as materialIconsSet from '@quasar/extras/material-icons'
import * as fontawesomeSet from '@quasar/extras/fontawesome-v5'
import * as bootstrapIconsSet from '@quasar/extras/bootstrap-icons'

import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
    name: "TreeTable",
    components: {
      Treeselect,
      // SimpleHierarchy: () => import('@/components/tree-table/SimpleHierarchy'),
      CustomHierarchy: () => import('@/components/tree-table/CustomHierarchy'),
      // SvgIcon: () => import('@/components/SvgIcon'),
    },
    data () {
      return {
        interfaceMethodOptions: [],
        columns_props:[
            {
                name: 'name',
                required: true,
                label: '菜单名称',
                align: 'left',
                field: 'name',
                // (optional) tell QHierarchy you want this column sortable
                sortable: true,
                // If you want different sorting icon
                filterable: true
            },
            {
                name: 'icon',
                label: '图标',
                sortable: true,
                field: 'icon',
                align: 'left',
                filterable: false
            },
            {
                name: 'orderNum',
                label: '排序',
                sortable: true,
                field: 'orderNum',
                align: 'left',
                filterable: false
            },
            {
                name: 'menuType',
                label: '菜单类型',
                sortable: true,
                field: 'menuType',
                align: 'left',
                filterable: false
            },
            {
                name: 'perms',
                label: '权限标识',
                sortable: true,
                field: 'perms',
                align: 'left',
                filterable: false
            },
            {
                name: 'component_path',
                label: '组件路径',
                sortable: true,
                field: 'component_path',
                align: 'left',
                filterable: false
            },
            {
                name: 'status',
                label: '状态',
                sortable: true,
                field: 'status',
                align: 'left',
                filterable: false
            },
            {
                name: 'update_datetime',
                label: '更新时间',
                sortable: true,
                field: 'update_datetime',
                align: 'left',
                filterable: false
            },
            {
                name: 'create_datetime',
                label: '创建时间',
                sortable: true,
                field: 'create_datetime',
                align: 'left',
                filterable: false
            },
            {
                name: '',
                label: '操作',
                sortable: true,
                field: '',
                align: 'center',
                filterable: false
            }
        ],
        // 遮罩层
        loading: true,
        // 查询参数
        queryParams: {
          name: undefined,
          visible: undefined,
          pageNum: "all"
        },
        // 菜单表格树数据
        menuList: [],
        // 菜单树选项
        menuOptions: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 显示状态数据字典
        visibleOptions: [],
        // 菜单状态数据字典
        statusOptions: [],
        interfaceMethodOptions: [],
        tab: 'material Icons',
        timer1: {},
        timer2: {},
        timer3: {},
        materialIcons_key: [],
        fontawesome_key: [],
        bootstrapIcons_key: [],
        content: '',
        prompt:false,
        filter:'',
        treeDataSelected:'',
        popupeditshow:false,
        popupTreeData:[
          {
            parentName: 'Relax Hotel',
            parentId:0,
            children: [
              {
                parentName: 'Food',
                parentId:34,
                icon: 'restaurant_menu'
              },
              {
                parentName: 'Room service',
                parentId:31,
                icon: 'room_service'
              },
              {
                parentName: 'Room view',
                parentId:32,
                icon: 'photo'
              }
            ]
          },
          {
            parentName: 'eeeeee Hotel',
            parentId:1,
            children: [
              {
                parentName: 'eee Food',
                parentId:14,
                icon: 'restaurant_menu'
              },
              {
                parentName: 'eeee service',
                parentId:11,
                icon: 'room_service'
              },
              {
                parentName: 'eeeee  view',
                parentId:12,
                icon: 'photo'
              }
            ]
          }
        ],
        typeOption:[{ label: '目录', value: '0' }, { label: '菜单', value: '1' }, { label: '按钮', value: '2' } ],
        dataForm : {
          id: 0,
          menuType: 1,
          name: '',
          parentId: 0,
          parentName: '',
          url: '',
          perms: '',
          orderNum: 0,
          icon: '',
          isFrame:false,
          web_path:'',
          component_path:'',
          interface_method:'',
          visible:'',
          status:'',
          isCache:''
        },
        menuresponse : {
          "code":200,"data":[{"id":1,"create_datetime":"2021-02-27 07:41:28","update_datetime":"2021-02-27 07:50:00","creator_name":"admin","parentId":0,"dept_belong_id":"1","menuType":"0","icon":"system","name":"系统管理","orderNum":1,"isFrame":"1","web_path":"/system","component_path":"","interface_path":"","interface_method":"GET","perms":null,"status":"1","visible":"1","isCache":"1"},{"id":2,"create_datetime":"2021-02-27 07:51:14","update_datetime":"2021-02-27 07:51:14","creator_name":"admin","parentId":0,"dept_belong_id":"1","menuType":"0","icon":"peoples","name":"权限管理","orderNum":2,"isFrame":"1","web_path":"/permission","component_path":"","interface_path":"","interface_method":"GET","perms":null,"status":"1","visible":"1","isCache":"1"},{"id":3,"create_datetime":"2021-02-27 07:54:38","update_datetime":"2021-03-16 14:50:55","creator_name":"admin","parentId":1,"dept_belong_id":"1","menuType":"1","icon":"dict","name":"字典管理","orderNum":1,"isFrame":"1","web_path":"dict","component_path":"vadmin/system/dict/index","interface_path":"","interface_method":"GET","perms":"","status":"1","visible":"1","isCache":"1"},{"id":4,"create_datetime":"2021-02-27 08:06:51","update_datetime":"2021-03-26 00:48:34","creator_name":"admin","parentId":1,"dept_belong_id":"1","menuType":"1","icon":"edit","name":"参数管理","orderNum":2,"isFrame":"1","web_path":"config","component_path":"vadmin/system/config/index","interface_path":"","interface_method":"GET","perms":"","status":"1","visible":"1","isCache":"1"},{"id":5,"create_datetime":"2021-02-27 08:25:37","update_datetime":"2021-03-26 00:49:19","creator_name":"admin","parentId":2,"dept_belong_id":"1","menuType":"1","icon":"post","name":"岗位管理","orderNum":1,"isFrame":"1","web_path":"post","component_path":"vadmin/permission/post/index","interface_path":"","interface_method":"GET","perms":"","status":"1","visible":"1","isCache":"1"},{"id":6,"create_datetime":"2021-02-27 08:26:48","update_datetime":"2021-03-26 00:49:25","creator_name":"admin","parentId":2,"dept_belong_id":"1","menuType":"1","icon":"tree","name":"部门管理","orderNum":2,"isFrame":"1","web_path":"dept","component_path":"vadmin/permission/dept/index","interface_path":"","interface_method":"GET","perms":"","status":"1","visible":"1","isCache":"1"},{"id":7,"create_datetime":"2021-02-27 08:28:20","update_datetime":"2021-03-26 00:49:31","creator_name":"admin","parentId":2,"dept_belong_id":"1","menuType":"1","icon":"tree-table","name":"菜单管理","orderNum":3,"isFrame":"1","web_path":"menu","component_path":"vadmin/permission/menu/index","interface_path":"","interface_method":"GET","perms":"","status":"1","visible":"1","isCache":"0"},{"id":8,"create_datetime":"2021-02-27 08:29:30","update_datetime":"2021-03-26 00:49:37","creator_name":"admin","parentId":2,"dept_belong_id":"1","menuType":"1","icon":"peoples","name":"角色管理","orderNum":4,"isFrame":"1","web_path":"role","component_path":"vadmin/permission/role/index","interface_path":"","interface_method":"GET","perms":"","status":"1","visible":"1","isCache":"1"},{"id":9,"create_datetime":"2021-02-27 08:30:14","update_datetime":"2021-03-26 00:49:42","creator_name":"admin","parentId":2,"dept_belong_id":"1","menuType":"1","icon":"user","name":"用户管理","orderNum":5,"isFrame":"1","web_path":"user","component_path":"vadmin/permission/user/index","interface_path":"","interface_method":"GET","perms":"","status":"1","visible":"1","isCache":"1"},{"id":10,"create_datetime":"2021-02-27 08:36:04","update_datetime":"2021-03-26 00:51:15","creator_name":"admin","parentId":0,"dept_belong_id":"1","menuType":"0","icon":"guide","name":"dvAdmin官网","orderNum":9,"isFrame":"0","web_path":"https://django-vue-admin.com","component_path":"","interface_path":null,"interface_method":"GET","perms":null,"status":"1","visible":"1","isCache":"1"},{"id":11,"create_datetime":"2021-02-27 16:17:36","update_datetime":"2021-03-26 00:48:40","creator_name":"admin","parentId":1,"dept_belong_id":"1","menuType":"1","icon":"job","name":"文件管理","orderNum":3,"isFrame":"1","web_path":"savefile","component_path":"vadmin/system/savefile/index","interface_path":"","interface_method":"GET","perms":"","status":"1","visible":"1","isCache":"1"},{"id":13,"create_datetime":"2021-03-03 14:18:52","update_datetime":"2021-03-03 14:41:08","creator_name":"admin","parentId":9,"dept_belong_id":"1","menuType":"2","icon":null,"name":"用户新增","orderNum":1,"isFrame":"1","web_path":null,"component_path":null,"interface_path":"/admin/permission/user/","interface_method":"POST","perms":"permission:user:post","status":"1","visible":"1","isCache":"1"},{"id":14,"create_datetime":"2021-03-03 14:43:34","update_datetime":"2021-03-03 14:43:34","creator_name":"admin","parentId":9,"dept_belong_id":"1","menuType":"2","icon":null,"name":"用户修改","orderNum":2,"isFrame":"1","web_path":null,"component_path":null,"interface_path":"/admin/permission/user/{id}/","interface_method":"PUT","perms":"permission:user:{id}:put","status":"1","visible":"1","isCache":"1"},{"id":15,"create_datetime":"2021-03-03 14:44:58","update_datetime":"2021-03-03 14:44:58","creator_name":"admin","parentId":9,"dept_belong_id":"1","menuType":"2","icon":null,"name":"用户删除","orderNum":3,"isFrame":"1","web_path":"","component_path":null,"interface_path":"/admin/permission/user/{id}/","interface_method":"DELETE","perms":"permission:user:{id}:delete","status":"1","visible":"1","isCache":"1"},{"id":16,"create_datetime":"2021-03-03 14:45:50","update_datetime":"2021-03-03 14:45:50","creator_name":"admin","parentId":9,"dept_belong_id":"1","menuType":"2","icon":null,"name":"用户导出","orderNum":4,"isFrame":"1","web_path":null,"component_path":null,"interface_path":"/admin/permission/user/export/","interface_method":"GET","perms":"permission:user:export:get","status":"1","visible":"1","isCache":"1"},{"id":17,"create_datetime":"2021-03-03 14:51:14","update_datetime":"2021-03-03 14:51:14","creator_name":"admin","parentId":9,"dept_belong_id":"1","menuType":"2","icon":null,"name":"用户导入","orderNum":5,"isFrame":"1","web_path":null,"component_path":null,"interface_path":"/admin/permission/user/import/","interface_method":"POST","perms":"permission:user:import:post","status":"1","visible":"1","isCache":"1"},{"id":18,"create_datetime":"2021-03-03 14:51:51","update_datetime":"2021-03-03 14:51:51","creator_name":"admin","parentId":9,"dept_belong_id":"1","menuType":"2","icon":null,"name":"重置密码","orderNum":6,"isFrame":"1","web_path":null,"component_path":null,"interface_path":"/admin/permission/user/resetPwd/","interface_method":"PUT","perms":"permission:user:resetpwd:put","status":"1","visible":"1","isCache":"1"},{"id":19,"create_datetime":"2021-03-03 14:53:47","update_datetime":"2021-03-03 14:53:47","creator_name":"admin","parentId":8,"dept_belong_id":"1","menuType":"2","icon":null,"name":"角色新增","orderNum":1,"isFrame":"1","web_path":null,"component_path":null,"interface_path":"/admin/permission/role/","interface_method":"POST","perms":"permission:role:post","status":"1","visible":"1","isCache":"1"},{"id":20,"create_datetime":"2021-03-03 14:54:28","update_datetime":"2021-03-03 14:54:28","creator_name":"admin","parentId":8,"dept_belong_id":"1","menuType":"2","icon":null,"name":"角色修改","orderNum":2,"isFrame":"1","web_path":null,"component_path":null,"interface_path":"/admin/permission/role/{id}/","interface_method":"PUT","perms":"permission:role:{id}:put","status":"1","visible":"1","isCache":"1"},{"id":21,"create_datetime":"2021-03-03 14:58:00","update_datetime":"2021-03-03 14:58:00","creator_name":"admin","parentId":8,"dept_belong_id":"1","menuType":"2","icon":null,"name":"删除角色","orderNum":3,"isFrame":"1","web_path":null,"component_path":null,"interface_path":"/admin/permission/role/{id}/","interface_method":"DELETE","perms":"permission:role:{id}:delete","status":"1","visible":"1","isCache":"1"},{"id":22,"create_datetime":"2021-03-03 14:58:28","update_datetime":"2021-03-03 14:58:28","creator_name":"admin","parentId":8,"dept_belong_id":"1","menuType":"2","icon":null,"name":"角色导出","orderNum":4,"isFrame":"1","web_path":null,"component_path":null,"interface_path":"/admin/permission/role/export/","interface_method":"GET","perms":"permission:role:export:get","status":"1","visible":"1","isCache":"1"},{"id":23,"create_datetime":"2021-03-03 15:00:41","update_datetime":"2021-03-03 15:00:41","creator_name":"admin","parentId":7,"dept_belong_id":"1","menuType":"2","icon":null,"name":"菜单新增","orderNum":1,"isFrame":"1","web_path":null,"component_path":null,"interface_path":"/admin/permission/menus/","interface_method":"POST","perms":"permission:menus:post","status":"1","visible":"1","isCache":"1"},{"id":24,"create_datetime":"2021-03-03 15:01:03","update_datetime":"2021-03-03 15:01:03","creator_name":"admin","parentId":7,"dept_belong_id":"1","menuType":"2","icon":null,"name":"菜单修改","orderNum":2,"isFrame":"1","web_path":null,"component_path":null,"interface_path":"/admin/permission/menus/{id}/","interface_method":"PUT","perms":"permission:menus:{id}:put","status":"1","visible":"1","isCache":"1"},{"id":25,"create_datetime":"2021-03-03 15:02:56","update_datetime":"2021-03-03 15:02:56","creator_name":"admin","parentId":7,"dept_belong_id":"1","menuType":"2","icon":null,"name":"菜单删除","orderNum":3,"isFrame":"1","web_path":null,"component_path":null,"interface_path":"/admin/permission/menus/{id}/","interface_method":"DELETE","perms":"permission:menus:{id}:delete","status":"1","visible":"1","isCache":"1"},{"id":26,"create_datetime":"2021-03-03 15:04:35","update_datetime":"2021-03-03 15:04:35","creator_name":"admin","parentId":6,"dept_belong_id":"1","menuType":"2","icon":null,"name":"部门新增","orderNum":1,"isFrame":"1","web_path":null,"component_path":null,"interface_path":"/admin/permission/dept/","interface_method":"POST","perms":"permission:dept:post","status":"1","visible":"1","isCache":"1"},{"id":27,"create_datetime":"2021-03-03 15:04:56","update_datetime":"2021-03-03 15:04:56","creator_name":"admin","parentId":6,"dept_belong_id":"1","menuType":"2","icon":null,"name":"部门修改","orderNum":2,"isFrame":"1","web_path":null,"component_path":null,"interface_path":"/admin/permission/dept/{id}/","interface_method":"PUT","perms":"permission:dept:{id}:put","status":"1","visible":"1","isCache":"1"},{"id":28,"create_datetime":"2021-03-03 15:05:39","update_datetime":"2021-03-03 15:05:39","creator_name":"admin","parentId":6,"dept_belong_id":"1","menuType":"2","icon":null,"name":"部门删除","orderNum":3,"isFrame":"1","web_path":null,"component_path":null,"interface_path":"/admin/permission/dept/{id}/","interface_method":"DELETE","perms":"permission:dept:{id}:delete","status":"1","visible":"1","isCache":"1"},{"id":29,"create_datetime":"2021-03-03 15:06:50","update_datetime":"2021-03-03 15:06:50","creator_name":"admin","parentId":5,"dept_belong_id":"1","menuType":"2","icon":null,"name":"岗位新增","orderNum":1,"isFrame":"1","web_path":null,"component_path":null,"interface_path":"/admin/permission/post/","interface_method":"POST","perms":"permission:post:post","status":"1","visible":"1","isCache":"1"},{"id":30,"create_datetime":"2021-03-03 15:07:36","update_datetime":"2021-03-03 15:07:36","creator_name":"admin","parentId":5,"dept_belong_id":"1","menuType":"2","icon":null,"name":"岗位修改","orderNum":2,"isFrame":"1","web_path":null,"component_path":null,"interface_path":"/admin/permission/post/{id}/","interface_method":"PUT","perms":"permission:post:{id}:put","status":"1","visible":"1","isCache":"1"},{"id":31,"create_datetime":"2021-03-03 15:08:10","update_datetime":"2021-03-03 15:08:10","creator_name":"admin","parentId":5,"dept_belong_id":"1","menuType":"2","icon":null,"name":"岗位删除","orderNum":3,"isFrame":"1","web_path":null,"component_path":null,"interface_path":"/admin/permission/post/{id}/","interface_method":"DELETE","perms":"permission:post:{id}:delete","status":"1","visible":"1","isCache":"1"},{"id":32,"create_datetime":"2021-03-03 15:09:02","update_datetime":"2021-03-03 15:09:02","creator_name":"admin","parentId":5,"dept_belong_id":"1","menuType":"2","icon":null,"name":"岗位导出","orderNum":4,"isFrame":"1","web_path":null,"component_path":null,"interface_path":"/admin/permission/post/export/","interface_method":"GET","perms":"permission:post:export:get","status":"1","visible":"1","isCache":"1"},{"id":33,"create_datetime":"2021-03-03 15:11:37","update_datetime":"2021-03-03 15:11:37","creator_name":"admin","parentId":3,"dept_belong_id":"1","menuType":"2","icon":null,"name":"字典新增","orderNum":1,"isFrame":"1","web_path":null,"component_path":null,"interface_path":"/admin/system/dict/type/","interface_method":"POST","perms":"system:dict:type:post","status":"1","visible":"1","isCache":"1"},{"id":34,"create_datetime":"2021-03-03 15:12:47","update_datetime":"2021-03-03 15:12:47","creator_name":"admin","parentId":3,"dept_belong_id":"1","menuType":"2","icon":null,"name":"字典修改","orderNum":2,"isFrame":"1","web_path":null,"component_path":null,"interface_path":"/admin/system/dict/type/{id}/","interface_method":"PUT","perms":"system:dict:type:{id}:put","status":"1","visible":"1","isCache":"1"},{"id":35,"create_datetime":"2021-03-03 15:13:40","update_datetime":"2021-03-03 15:13:40","creator_name":"admin","parentId":3,"dept_belong_id":"1","menuType":"2","icon":null,"name":"字典删除","orderNum":3,"isFrame":"1","web_path":null,"component_path":null,"interface_path":"/admin/system/dict/type/{id}/","interface_method":"DELETE","perms":"system:dict:type:{id}:delete","status":"1","visible":"1","isCache":"1"},{"id":36,"create_datetime":"2021-03-03 15:15:12","update_datetime":"2021-03-03 15:15:12","creator_name":"admin","parentId":3,"dept_belong_id":"1","menuType":"2","icon":null,"name":"字典导出","orderNum":4,"isFrame":"1","web_path":null,"component_path":null,"interface_path":"/admin/system/dict/type/export/","interface_method":"GET","perms":"system:dict:type:export:get","status":"1","visible":"1","isCache":"1"},{"id":37,"create_datetime":"2021-03-03 15:16:20","update_datetime":"2021-03-03 15:16:54","creator_name":"admin","parentId":3,"dept_belong_id":"1","menuType":"2","icon":null,"name":"清理缓存","orderNum":5,"isFrame":"1","web_path":null,"component_path":null,"interface_path":"/admin/system/dict/type/clearCache/","interface_method":"DELETE","perms":"system:dict:type:clearcache:delete","status":"1","visible":"1","isCache":"1"},{"id":38,"create_datetime":"2021-03-03 15:17:54","update_datetime":"2021-03-03 15:17:54","creator_name":"admin","parentId":4,"dept_belong_id":"1","menuType":"2","icon":null,"name":"参数新增","orderNum":1,"isFrame":"1","web_path":null,"component_path":null,"interface_path":"/admin/system/config/","interface_method":"POST","perms":"system:config:post","status":"1","visible":"1","isCache":"1"},{"id":39,"create_datetime":"2021-03-03 15:18:37","update_datetime":"2021-03-03 15:18:37","creator_name":"admin","parentId":4,"dept_belong_id":"1","menuType":"2","icon":null,"name":"参数修改","orderNum":2,"isFrame":"1","web_path":null,"component_path":null,"interface_path":"/admin/system/config/{id}/","interface_method":"PUT","perms":"system:config:{id}:put","status":"1","visible":"1","isCache":"1"},{"id":40,"create_datetime":"2021-03-03 15:19:05","update_datetime":"2021-03-03 15:19:05","creator_name":"admin","parentId":4,"dept_belong_id":"1","menuType":"2","icon":null,"name":"参数删除","orderNum":3,"isFrame":"1","web_path":null,"component_path":null,"interface_path":"/admin/system/config/{id}/","interface_method":"DELETE","perms":"system:config:{id}:delete","status":"1","visible":"1","isCache":"1"},{"id":41,"create_datetime":"2021-03-03 15:19:49","update_datetime":"2021-03-03 15:19:49","creator_name":"admin","parentId":4,"dept_belong_id":"1","menuType":"2","icon":null,"name":"参数导出","orderNum":4,"isFrame":"1","web_path":null,"component_path":null,"interface_path":"/admin/system/config/export/","interface_method":"GET","perms":"system:config:export:get","status":"1","visible":"1","isCache":"1"},{"id":42,"create_datetime":"2021-03-03 15:21:20","update_datetime":"2021-03-03 15:21:20","creator_name":"admin","parentId":4,"dept_belong_id":"1","menuType":"2","icon":null,"name":"清理缓存","orderNum":5,"isFrame":"1","web_path":null,"component_path":null,"interface_path":"/admin/system/config/clearCache/","interface_method":"DELETE","perms":"system:config:clearcache:delete","status":"1","visible":"1","isCache":"1"},{"id":43,"create_datetime":"2021-03-03 15:22:48","update_datetime":"2021-03-03 15:22:48","creator_name":"admin","parentId":11,"dept_belong_id":"1","menuType":"2","icon":null,"name":"文件上传","orderNum":1,"isFrame":"1","web_path":null,"component_path":null,"interface_path":"/admin/system/savefile/","interface_method":"POST","perms":"system:savefile:post","status":"1","visible":"1","isCache":"1"},{"id":44,"create_datetime":"2021-03-03 15:23:58","update_datetime":"2021-03-03 15:23:58","creator_name":"admin","parentId":11,"dept_belong_id":"1","menuType":"2","icon":null,"name":"文件删除","orderNum":2,"isFrame":"1","web_path":null,"component_path":null,"interface_path":"/admin/system/savefile/{id}/","interface_method":"DELETE","perms":"system:savefile:{id}:delete","status":"1","visible":"1","isCache":"1"},{"id":45,"create_datetime":"2021-03-03 15:25:15","update_datetime":"2021-03-03 15:25:15","creator_name":"admin","parentId":11,"dept_belong_id":"1","menuType":"2","icon":null,"name":"清理废弃文件","orderNum":3,"isFrame":"1","web_path":null,"component_path":null,"interface_path":"/admin/system/clearsavefile/","interface_method":"POST","perms":"system:clearsavefile:post","status":"1","visible":"1","isCache":"1"},{"id":46,"create_datetime":"2021-03-03 15:27:19","update_datetime":"2021-03-03 15:28:30","creator_name":"admin","parentId":11,"dept_belong_id":"1","menuType":"2","icon":null,"name":"文件下载","orderNum":4,"isFrame":"1","web_path":null,"component_path":null,"interface_path":null,"interface_method":"GET","perms":"system:clearsavefile:download:post","status":"1","visible":"1","isCache":"1"},{"id":47,"create_datetime":"2021-03-07 14:32:06","update_datetime":"2021-03-26 00:48:49","creator_name":"admin","parentId":1,"dept_belong_id":"1","menuType":"1","icon":"message","name":"通知公告","orderNum":4,"isFrame":"1","web_path":"message","component_path":"vadmin/system/message/index","interface_path":"","interface_method":"GET","perms":"","status":"1","visible":"1","isCache":"1"},{"id":48,"create_datetime":"2021-03-07 14:35:06","update_datetime":"2021-03-07 14:35:06","creator_name":"admin","parentId":47,"dept_belong_id":"1","menuType":"2","icon":null,"name":"发布公告","orderNum":1,"isFrame":"1","web_path":null,"component_path":null,"interface_path":"/admin/system/message/","interface_method":"POST","perms":"system:message:post","status":"1","visible":"1","isCache":"1"},{"id":49,"create_datetime":"2021-03-07 14:36:47","update_datetime":"2021-03-08 13:04:32","creator_name":"admin","parentId":47,"dept_belong_id":"1","menuType":"2","icon":null,"name":"修改公告","orderNum":2,"isFrame":"1","web_path":null,"component_path":null,"interface_path":"/admin/system/message/{id}/","interface_method":"PUT","perms":"system:message:{id}:put","status":"1","visible":"1","isCache":"1"},{"id":50,"create_datetime":"2021-03-07 14:37:52","update_datetime":"2021-03-08 13:04:58","creator_name":"admin","parentId":47,"dept_belong_id":"1","menuType":"2","icon":null,"name":"删除公告","orderNum":3,"isFrame":"1","web_path":null,"component_path":null,"interface_path":"/admin/permission/menu/{id}/","interface_method":"DELETE","perms":"permission:menu:{id}:delete","status":"1","visible":"1","isCache":"1"},{"id":51,"create_datetime":"2021-03-07 14:42:37","update_datetime":"2021-03-07 14:42:37","creator_name":"admin","parentId":47,"dept_belong_id":"1","menuType":"2","icon":null,"name":"公告导出","orderNum":4,"isFrame":"1","web_path":null,"component_path":null,"interface_path":"/admin/system/message/export/","interface_method":"GET","perms":"system:message:export:get","status":"1","visible":"1","isCache":"1"},{"id":52,"create_datetime":"2021-03-09 17:18:14","update_datetime":"2021-03-09 17:19:13","creator_name":"admin","parentId":3,"dept_belong_id":"1","menuType":"2","icon":null,"name":"字典查询","orderNum":0,"isFrame":"1","web_path":null,"component_path":null,"interface_path":"/admin/system/dict/type/","interface_method":"GET","perms":"system:dict:type:get","status":"1","visible":"1","isCache":"1"},{"id":53,"create_datetime":"2021-03-09 17:19:33","update_datetime":"2021-03-09 17:19:46","creator_name":"admin","parentId":4,"dept_belong_id":"1","menuType":"2","icon":null,"name":"参数查询","orderNum":0,"isFrame":"1","web_path":null,"component_path":null,"interface_path":"/admin/system/config/","interface_method":"GET","perms":"system:config:get","status":"1","visible":"1","isCache":"1"},{"id":54,"create_datetime":"2021-03-09 17:20:02","update_datetime":"2021-03-09 17:20:14","creator_name":"admin","parentId":11,"dept_belong_id":"1","menuType":"2","icon":null,"name":"文件查询","orderNum":0,"isFrame":"1","web_path":null,"component_path":null,"interface_path":"/admin/system/savefile/","interface_method":"GET","perms":"system:savefile:get","status":"1","visible":"1","isCache":"1"},{"id":55,"create_datetime":"2021-03-09 17:20:36","update_datetime":"2021-03-09 17:20:44","creator_name":"admin","parentId":47,"dept_belong_id":"1","menuType":"2","icon":null,"name":"公告查询","orderNum":0,"isFrame":"1","web_path":null,"component_path":null,"interface_path":"/admin/system/message/","interface_method":"GET","perms":"system:message:get","status":"1","visible":"1","isCache":"1"},{"id":56,"create_datetime":"2021-03-09 17:21:06","update_datetime":"2021-03-09 17:21:06","creator_name":"admin","parentId":5,"dept_belong_id":"1","menuType":"2","icon":null,"name":"岗位查询","orderNum":0,"isFrame":"1","web_path":null,"component_path":null,"interface_path":"/admin/permission/post/","interface_method":"GET","perms":"permission:post:get","status":"1","visible":"1","isCache":"1"},{"id":57,"create_datetime":"2021-03-09 17:21:29","update_datetime":"2021-03-09 17:21:29","creator_name":"admin","parentId":6,"dept_belong_id":"1","menuType":"2","icon":null,"name":"部门查询","orderNum":0,"isFrame":"1","web_path":null,"component_path":null,"interface_path":"/admin/permission/dept/","interface_method":"GET","perms":"permission:dept:get","status":"1","visible":"1","isCache":"1"},{"id":58,"create_datetime":"2021-03-09 17:21:47","update_datetime":"2021-03-09 17:21:56","creator_name":"admin","parentId":7,"dept_belong_id":"1","menuType":"2","icon":null,"name":"菜单查询","orderNum":0,"isFrame":"1","web_path":null,"component_path":null,"interface_path":"/admin/permission/menus/","interface_method":"GET","perms":"permission:menus:get","status":"1","visible":"1","isCache":"1"},{"id":59,"create_datetime":"2021-03-09 17:22:20","update_datetime":"2021-03-09 17:22:20","creator_name":"admin","parentId":8,"dept_belong_id":"1","menuType":"2","icon":null,"name":"角色查询","orderNum":0,"isFrame":"1","web_path":"","component_path":null,"interface_path":"/admin/permission/role/","interface_method":"GET","perms":"permission:role:get","status":"1","visible":"1","isCache":"1"},{"id":60,"create_datetime":"2021-03-09 17:22:38","update_datetime":"2021-03-09 17:22:38","creator_name":"admin","parentId":9,"dept_belong_id":"1","menuType":"2","icon":null,"name":"用户查询","orderNum":0,"isFrame":"1","web_path":null,"component_path":null,"interface_path":"/admin/permission/user/","interface_method":"GET","perms":"permission:user:get","status":"1","visible":"1","isCache":"1"},{"id":61,"create_datetime":"2021-03-16 13:34:04","update_datetime":"2021-03-21 11:34:17","creator_name":"admin","parentId":1,"dept_belong_id":"1","menuType":"0","icon":"log","name":"日志管理","orderNum":5,"isFrame":"1","web_path":"log","component_path":"ParentView","interface_path":null,"interface_method":"GET","perms":null,"status":"1","visible":"1","isCache":"1"},{"id":62,"create_datetime":"2021-03-16 13:36:00","update_datetime":"2021-03-16 15:09:30","creator_name":"admin","parentId":61,"dept_belong_id":"1","menuType":"1","icon":"logininfor","name":"登录日志","orderNum":1,"isFrame":"1","web_path":"logininfor","component_path":"vadmin/monitor/logininfor/index","interface_path":"","interface_method":"GET","perms":"","status":"1","visible":"1","isCache":"1"},{"id":63,"create_datetime":"2021-03-16 14:28:10","update_datetime":"2021-03-16 15:09:38","creator_name":"admin","parentId":61,"dept_belong_id":"1","menuType":"1","icon":"log","name":"操作日志","orderNum":2,"isFrame":"1","web_path":"operlog","component_path":"vadmin/monitor/operlog/index","interface_path":"","interface_method":"GET","perms":"","status":"1","visible":"1","isCache":"1"},{"id":64,"create_datetime":"2021-03-16 14:31:01","update_datetime":"2021-03-16 14:31:27","creator_name":"admin","parentId":62,"dept_belong_id":"1","menuType":"2","icon":null,"name":"登录日志查询","orderNum":1,"isFrame":"1","web_path":null,"component_path":null,"interface_path":"/admin/system/logininfor/","interface_method":"GET","perms":"admin:system:logininfor:get","status":"1","visible":"1","isCache":"1"},{"id":65,"create_datetime":"2021-03-16 14:31:44","update_datetime":"2021-03-16 14:31:44","creator_name":"admin","parentId":63,"dept_belong_id":"1","menuType":"2","icon":null,"name":"操作日志查询","orderNum":1,"isFrame":"1","web_path":null,"component_path":null,"interface_path":"/admin/system/operlog/","interface_method":"GET","perms":"admin:system:operlog:get","status":"1","visible":"1","isCache":"1"},{"id":66,"create_datetime":"2021-03-16 14:33:05","update_datetime":"2021-03-26 00:47:50","creator_name":"admin","parentId":0,"dept_belong_id":"1","menuType":"0","icon":"monitor","name":"系统监控","orderNum":3,"isFrame":"1","web_path":"/monitor","component_path":null,"interface_path":null,"interface_method":"GET","perms":null,"status":"1","visible":"1","isCache":"1"},{"id":70,"create_datetime":"2021-03-16 14:45:51","update_datetime":"2021-03-26 00:49:56","creator_name":"admin","parentId":66,"dept_belong_id":"1","menuType":"1","icon":"job","name":"定时任务","orderNum":2,"isFrame":"1","web_path":"celery","component_path":"vadmin/monitor/celery/index","interface_path":"","interface_method":"GET","perms":null,"status":"1","visible":"1","isCache":"1"},{"id":71,"create_datetime":"2021-03-16 14:59:53","update_datetime":"2021-03-16 15:04:11","creator_name":"admin","parentId":70,"dept_belong_id":"1","menuType":"2","icon":null,"name":"任务查询","orderNum":1,"isFrame":"1","web_path":null,"component_path":null,"interface_path":"/admin/monitor/celery/","interface_method":"GET","perms":"admin:monitor:celery:get","status":"1","visible":"1","isCache":"1"},{"id":72,"create_datetime":"2021-03-16 15:00:21","update_datetime":"2021-03-16 15:04:06","creator_name":"admin","parentId":70,"dept_belong_id":"1","menuType":"2","icon":null,"name":"任务新增","orderNum":2,"isFrame":"1","web_path":null,"component_path":null,"interface_path":"/admin/monitor/celery/","interface_method":"POST","perms":"admin:monitor:celery:post","status":"1","visible":"1","isCache":"1"},{"id":73,"create_datetime":"2021-03-16 15:00:45","update_datetime":"2021-03-16 15:04:00","creator_name":"admin","parentId":70,"dept_belong_id":"1","menuType":"2","icon":null,"name":"任务修改","orderNum":3,"isFrame":"1","web_path":null,"component_path":null,"interface_path":"/admin/monitor/celery/{id}/","interface_method":"PUT","perms":"admin:monitor:celery:{id}:put","status":"1","visible":"1","isCache":"1"},{"id":74,"create_datetime":"2021-03-16 15:01:19","update_datetime":"2021-03-16 15:03:54","creator_name":"admin","parentId":70,"dept_belong_id":"1","menuType":"2","icon":null,"name":"任务删除","orderNum":4,"isFrame":"1","web_path":null,"component_path":null,"interface_path":"/admin/monitor/celery/{id}/","interface_method":"DELETE","perms":"admin:monitor:celery:{id}:delete","status":"1","visible":"1","isCache":"1"},{"id":75,"create_datetime":"2021-03-16 15:03:35","update_datetime":"2021-03-16 15:07:03","creator_name":"admin","parentId":70,"dept_belong_id":"1","menuType":"2","icon":null,"name":"任务单次执行","orderNum":6,"isFrame":"1","web_path":null,"component_path":null,"interface_path":"/admin/monitor/celery/run/","interface_method":"PUT","perms":"admin:monitor:celery:run:put","status":"1","visible":"1","isCache":"1"},{"id":76,"create_datetime":"2021-03-16 15:07:45","update_datetime":"2021-03-16 15:08:09","creator_name":"admin","parentId":70,"dept_belong_id":"1","menuType":"2","icon":null,"name":"任务导出","orderNum":5,"isFrame":"1","web_path":null,"component_path":null,"interface_path":"/admin/monitor/celery/export/","interface_method":"GET","perms":"admin:monitor:celery:export:get","status":"1","visible":"1","isCache":"1"},{"id":77,"create_datetime":"2021-03-16 15:08:46","update_datetime":"2021-03-16 15:09:09","creator_name":"admin","parentId":62,"dept_belong_id":"1","menuType":"2","icon":null,"name":"登录日志导出","orderNum":2,"isFrame":"1","web_path":null,"component_path":null,"interface_path":"/admin/system/logininfor/export/","interface_method":"GET","perms":"admin:system:logininfor:export:get","status":"1","visible":"1","isCache":"1"},{"id":78,"create_datetime":"2021-03-16 15:09:59","update_datetime":"2021-03-16 15:09:59","creator_name":"admin","parentId":63,"dept_belong_id":"1","menuType":"2","icon":null,"name":"操作日志导出","orderNum":2,"isFrame":"1","web_path":null,"component_path":null,"interface_path":"/admin/system/operlog/export/","interface_method":"GET","perms":"admin:system:operlog:export:get","status":"1","visible":"1","isCache":"1"},{"id":79,"create_datetime":"2021-03-16 15:11:05","update_datetime":"2021-03-26 00:27:17","creator_name":"admin","parentId":61,"dept_belong_id":"1","menuType":"1","icon":"job","name":"定时日志","orderNum":3,"isFrame":"1","web_path":"celerylog","component_path":"vadmin/monitor/celery/celerylog/index","interface_path":null,"interface_method":"GET","perms":null,"status":"1","visible":"1","isCache":"1"},{"id":80,"create_datetime":"2021-03-16 15:12:19","update_datetime":"2021-03-16 15:16:29","creator_name":"admin","parentId":79,"dept_belong_id":"1","menuType":"2","icon":null,"name":"定时日志查询","orderNum":1,"isFrame":"1","web_path":null,"component_path":null,"interface_path":"/admin/monitor/celerylog/","interface_method":"GET","perms":"admin:monitor:celerylog:get","status":"1","visible":"1","isCache":"1"},{"id":81,"create_datetime":"2021-03-16 15:12:51","update_datetime":"2021-03-16 15:16:34","creator_name":"admin","parentId":79,"dept_belong_id":"1","menuType":"2","icon":null,"name":"定时日志导出","orderNum":2,"isFrame":"1","web_path":null,"component_path":null,"interface_path":"/admin/monitor/celerylog/export/","interface_method":"GET","perms":"admin:monitor:celerylog:export:get","status":"1","visible":"1","isCache":"1"},{"id":82,"create_datetime":"2021-03-16 15:15:21","update_datetime":"2021-03-26 00:47:37","creator_name":"admin","parentId":0,"dept_belong_id":"1","menuType":"0","icon":"tool","name":"系统工具","orderNum":4,"isFrame":"1","web_path":"/tool","component_path":null,"interface_path":null,"interface_method":"GET","perms":null,"status":"1","visible":"1","isCache":"1"},{"id":83,"create_datetime":"2021-03-16 15:16:10","update_datetime":"2021-03-26 00:50:12","creator_name":"admin","parentId":82,"dept_belong_id":"1","menuType":"1","icon":"build","name":"表单构建","orderNum":1,"isFrame":"1","web_path":"build","component_path":"vadmin/tool/build/index","interface_path":null,"interface_method":"GET","perms":null,"status":"1","visible":"1","isCache":"1"},{"id":84,"create_datetime":"2021-03-16 15:17:23","update_datetime":"2021-03-16 15:19:24","creator_name":"admin","parentId":82,"dept_belong_id":"1","menuType":"1","icon":"swagger","name":"系统接口","orderNum":2,"isFrame":"1","web_path":"swagger","component_path":"vadmin/tool/swagger/index","interface_path":"/admin/docs/","interface_method":"GET","perms":"admin:docs:get","status":"1","visible":"1","isCache":"1"},{"id":85,"create_datetime":"2021-03-21 11:37:06","update_datetime":"2021-03-21 11:37:06","creator_name":"admin","parentId":63,"dept_belong_id":"1","menuType":"2","icon":null,"name":"操作日志批量删除","orderNum":3,"isFrame":"1","web_path":null,"component_path":null,"interface_path":"/admin/system/operation_log/{id}/","interface_method":"DELETE","perms":"admin:system:operation_log:{id}:delete","status":"1","visible":"1","isCache":"1"},{"id":86,"create_datetime":"2021-03-21 11:39:07","update_datetime":"2021-03-21 11:39:07","creator_name":"admin","parentId":63,"dept_belong_id":"1","menuType":"2","icon":null,"name":"操作日志清空","orderNum":4,"isFrame":"1","web_path":null,"component_path":null,"interface_path":"/admin/system/operation_log/clean/","interface_method":"DELETE","perms":"admin:system:operation_log:clean:delete","status":"1","visible":"1","isCache":"1"},{"id":87,"create_datetime":"2021-03-21 23:32:44","update_datetime":"2021-03-21 23:32:44","creator_name":"admin","parentId":62,"dept_belong_id":"1","menuType":"2","icon":null,"name":"登录日志批量删除","orderNum":3,"isFrame":"1","web_path":null,"component_path":null,"interface_path":"/admin/system/logininfor/{id}/","interface_method":"DELETE","perms":"admin:system:logininfor:{id}:delete","status":"1","visible":"1","isCache":"1"},{"id":88,"create_datetime":"2021-03-21 23:33:30","update_datetime":"2021-03-21 23:33:30","creator_name":"admin","parentId":62,"dept_belong_id":"1","menuType":"2","icon":null,"name":"登录日志清空","orderNum":4,"isFrame":"1","web_path":null,"component_path":null,"interface_path":"/admin/system/logininfor/clean/","interface_method":"DELETE","perms":"admin:system:logininfor:clean:delete","status":"1","visible":"1","isCache":"1"},{"id":90,"create_datetime":"2021-03-26 00:43:14","update_datetime":"2021-03-26 00:44:00","creator_name":"admin","parentId":79,"dept_belong_id":"8","menuType":"2","icon":null,"name":"定时日志批量删除","orderNum":3,"isFrame":"1","web_path":null,"component_path":null,"interface_path":"/admin/system/celery_log/{id}/","interface_method":"DELETE","perms":"admin:system:celery_log:{id}:delete","status":"1","visible":"1","isCache":"1"},{"id":91,"create_datetime":"2021-03-26 00:44:36","update_datetime":"2021-03-26 00:44:36","creator_name":"admin","parentId":79,"dept_belong_id":"8","menuType":"2","icon":null,"name":"定时日志清空","orderNum":4,"isFrame":"1","web_path":null,"component_path":null,"interface_path":"/admin/system/celery_log/clean/","interface_method":"DELETE","perms":"admin:system:celery_log:clean:delete","status":"1","visible":"1","isCache":"1"},{"id":92,"create_datetime":"2021-04-27 23:44:54","update_datetime":"2021-04-27 23:49:59","creator_name":"admin","parentId":66,"dept_belong_id":"1","menuType":"1","icon":"server","name":"服务监控","orderNum":3,"isFrame":"1","web_path":"/monitor/server","component_path":"vadmin/monitor/server/index","interface_path":null,"interface_method":"GET","perms":null,"status":"1","visible":"1","isCache":"1"},{"id":93,"create_datetime":"2021-04-27 23:49:28","update_datetime":"2021-04-27 23:57:46","creator_name":"admin","parentId":92,"dept_belong_id":"1","menuType":"2","icon":null,"name":"服务监控查询","orderNum":1,"isFrame":"1","web_path":null,"component_path":null,"interface_path":"/admin/monitor/server/","interface_method":"GET","perms":"admin:monitor:server:get","status":"1","visible":"1","isCache":"1"},{"id":94,"create_datetime":"2021-04-27 23:58:13","update_datetime":"2021-04-27 23:58:44","creator_name":"admin","parentId":92,"dept_belong_id":"1","menuType":"2","icon":null,"name":"修改服务器信息","orderNum":2,"isFrame":"1","web_path":null,"component_path":null,"interface_path":"/admin/monitor/server/{id}/","interface_method":"PUT","perms":"admin:monitor:server:{id}:put","status":"1","visible":"1","isCache":"1"},{"id":95,"create_datetime":"2021-04-27 23:59:07","update_datetime":"2021-04-27 23:59:29","creator_name":"admin","parentId":92,"dept_belong_id":"1","menuType":"2","icon":null,"name":"修改监控信息","orderNum":3,"isFrame":"1","web_path":null,"component_path":null,"interface_path":"/admin/monitor/monitor/enabled/","interface_method":"GET","perms":"admin:monitor:monitor:enabled:get","status":"1","visible":"1","isCache":"1"},{"id":96,"create_datetime":"2021-04-27 23:59:48","update_datetime":"2021-04-28 00:01:15","creator_name":"admin","parentId":92,"dept_belong_id":"1","menuType":"2","icon":null,"name":"清空监控记录","orderNum":4,"isFrame":"1","web_path":null,"component_path":null,"interface_path":"/admin/monitor/monitor/clean/","interface_method":"GET","perms":"admin:monitor:monitor:clean:get","status":"1","visible":"1","isCache":"1"},{"id":97,"create_datetime":"2021-05-02 18:58:06","update_datetime":"2021-05-02 19:12:06","creator_name":"admin","parentId":0,"dept_belong_id":"1","menuType":"0","icon":"dashboard","name":"首页","orderNum":0,"isFrame":"1","web_path":"/index","component_path":"Layout/index","interface_path":null,"interface_method":"GET","perms":null,"status":"1","visible":"1","isCache":"1"}],"msg":"success","status":"success"}
      }
    },
    watch: {
      tab (n, o) {
        if (n === 'material Icons') {
          this.initMaterial()
        }
        if (n === 'fontawesome-v5') {
          this.initFontawesome()
        }
        if (n === 'bootstrap Icons') {
          this.initBootstrapIcons()
        }
      }
    },
    beforeDestroy () {
      window.copyIcon = null
      window.copyBootstrapIcons = null
      clearTimeout(this.timer3)
      clearTimeout(this.timer2)
      clearTimeout(this.timer1)

    },
    created(){
      this.getList();
      window.copyIcon = this.copy
      // window.copyBootstrapIcons = this.bootstrapIconsClickFunc
      this.getDicts("sys_show_hide").then(response => {
        this.visibleOptions = response.data;
      }).catch(()=>{
        const response = {"code":200,"data":[{"dictLabel":"显示","dictValue":"1","is_default":true},{"dictLabel":"隐藏","dictValue":"0","is_default":false}],"msg":"success","status":"success"}
        this.visibleOptions = response.data;
      });

      this.getDicts("sys_normal_disable").then(response => {
        this.statusOptions = response.data;
      }).catch(()=>{
        const response = {"code":200,"data":[{"dictLabel":"正常","dictValue":"1","is_default":true},{"dictLabel":"停用",    "dictValue":"0","is_default":false}],"msg":"success","status":"success"}
        this.statusOptions = response.data;
      });

      this.getDicts("sys_menu_type").then(response => {
        this.menuTypeOptions = response.data;
      }).catch(()=>{
        const response = {"code":200,"data":[{"dictLabel":"目录","dictValue":"0","is_default":true},{"dictLabel":"菜单","dictValue":"1","is_default":false},{"dictLabel":"按钮","dictValue":"2","is_default":false}],"msg":"success","status":"success"}
        this.menuTypeOptions = response.data;
      });

      this.getDicts("sys_interface_method").then(response => {
        this.interfaceMethodOptions = response.data;
      }).catch(()=>{
        const response = {"code":200,"data":[{"dictLabel":"GET","dictValue":"GET","is_default":true},{"dictLabel":"POST","dictValue":"POST","is_default":false},{"dictLabel":"PUT","dictValue":"PUT","is_default":false},{"dictLabel":"PATCH","dictValue":"PATCH","is_default":false},{"dictLabel":"DELETE","dictValue":"DELETE","is_default":false}],"msg":"success","status":"success"}
        this.interfaceMethodOptions = response.data;
      });
    },
    mounted(){
      this.initMaterial()
      // this.initFontawesome()
    },
    methods: {
      /** 转换菜单数据结构 */
      normalizer(node) {
        if (node.children && !node.children.length) {
          delete node.children;
        }
        return {
          id: node.id,
          label: node.name,
          children: node.children
        };
      },
      /** 查询菜单下拉树结构 */
      getTreeselect() {
        listMenu({ pageNum: "all" }).then(response => {
          this.menuOptions = [];
          const menu = { id: 0, name: "主类目", children: [] };
          menu.children = this.handleTree(response.data, "id");
          this.menuOptions.push(menu);
        }).catch(()=>{
         
          this.menuOptions = [];
          const menu = { id: 0, name: "主类目", children: [] };
          menu.children = this.handleTree( this.menuresponse.data, "id");
          this.menuOptions.push(menu);
          this.popupTreeData = Object.assign([],this.menuOptions)
        });
      },
      deleMenuFunc(data){
        const row = Object.assign({},data.val) 
        console.log('----------deleMenuFunc----------------',row)
      },
      addMenuFunc(){
        this.onReset()
        this.getTreeselect();
        this.prompt = true;
        this.title = "添加菜单";
      },
      editMenuFunc(data){
        const row = Object.assign({},data.val) 
        this.onReset()
        this.getTreeselect();
        // getMenu(row.id).then(response => {
          this.dataForm = row //response.data;
          this.prompt = true;
          this.title = "修改菜单";
        // });
        console.log('----------editMenuFunc----------------',row)
      },
      /** 查询菜单列表 */
      getList() {
        this.loading = true;
        listMenu(this.queryParams).then(response => {
          this.menuList = this.handleTree(response.data, "id");
          this.loading = false;
        }).catch(()=>{
          
          this.menuList = this.handleTree(this.menuresponse.data, "id");
          console.log('-------this.menuList--------------',this.menuList)
          this.loading = false;
        });
      },
      // bootstrapIcons 图标集合初始化
      initBootstrapIcons () {
        // 获取图标 bootstrapIcons 下划线格式命名集合
        // console.log('========bootstrapIconsSet==========',bootstrapIconsSet)
        for (const i in bootstrapIconsSet) {
          var reg=/\d/
          if (!reg.test(i)) {//有数字的不要
            this.bootstrapIcons_key.push(this.toLowerLine(i))
          }
          
          // console.log('----------const i in bootstrapIconsSet----------------------',i)
        }
        this.$nextTick(() => {
          this.RenderBootstrapIcons(0)
        })
      },
      bootstrapIconsClickFunc(name){
        // window.copyIcon(name)
        this.dataForm.icon = name
        this.$refs.q_popup_edit_icon.hide()
      },
      RenderBootstrapIcons (i) {
        if (i >= 1236) {
          cancelAnimationFrame(this.timer3)
        } else {
          // console.log('========bootstrapIcons_key==========',this.bootstrapIcons_key)
          const fragment = document.createDocumentFragment()
          for (let j = i; j < i + 1236; j++) {
            const li = document.createElement('li')
            // li.innerText = this.bootstrapIcons_key[j]
            // console.log('--------------this.bootstrapIcons_key[j]---------------',this.bootstrapIcons_key,this.bootstrapIcons_key[j])
            li.setAttribute('class', 'myIcon ' + this.bootstrapIcons_key[j] + ' q-icon notranslate')
            li.setAttribute('onclick', 'window.copyIcon(' + "'" + this.bootstrapIcons_key[j] + "'" + ')')
            if (li !== undefined && li !== null && fragment !== undefined && fragment !== null) {
              fragment.appendChild(li)
            }
            
          }
          i += 1236
          if (fragment !== undefined && fragment !== null && document.getElementById('bstext') !== undefined && document.getElementById('bstext') !== null) {
            document.getElementById('bstext').appendChild(fragment)
          }
          this.timer3 = requestAnimationFrame(() => {
            this.RenderBootstrapIcons(i)
          })
        }
      },
      // materialIcons 图标集合初始化
      initMaterial () {
        console.log('========initMaterial==========',materialIconsSet)
        // 获取图标 materialIcons 下划线格式命名集合
        for (const i in materialIconsSet) {
          this.materialIcons_key.push(this.toLowerLine(i))
        }
        this.$nextTick(() => {
          this.RenderMDIcon(0)
        })
      },
      RenderMDIcon (i) {
        if (i >= 1317) {
          cancelAnimationFrame(this.timer1)
        } else {
          const fragment = document.createDocumentFragment()
          for (let j = i; j < i + 1317; j++) {
            const li = document.createElement('li')
            li.innerText = this.materialIcons_key[j]
            // console.log('--------------this.materialIcons_key[j]---------------',j)
            li.setAttribute('class', 'myIcon material-icons q-icon notranslate')
            li.setAttribute('onclick', 'window.copyIcon(' + "'" + this.materialIcons_key[j] + "'" + ')')
            if (li !== undefined && li !== null && fragment !== undefined && fragment !== null) {
              fragment.appendChild(li)
            }
            
          }
          i += 1317
          if (fragment !== undefined && fragment !== null && document.getElementById('mdtext') !== undefined && document.getElementById('mdtext') !== null) {
            document.getElementById('mdtext').appendChild(fragment)
          }
          this.timer1 = requestAnimationFrame(() => {
            this.RenderMDIcon(i)
          })
        }
      },
      // fontawesome图标集合初始化
      initFontawesome () {
        // 获取图标 fontawesomeSet 下划线格式命名集合
        for (const i in fontawesomeSet) {
          this.fontawesome_key.push(this.toLowerLine(i))
        }
        this.$nextTick(() => {
          this.RenderFAIcon(0)
        })
      },
      RenderFAIcon (i) {
        if (i > 1601) {
          cancelAnimationFrame(this.timer2)
        } else {
          const fragment = document.createDocumentFragment()
          for (let j = i; j < 1601; j++) {
            const li = document.createElement('li')
            li.setAttribute('class', 'myIcon ' + this.fontawesome_key[j] + ' q-icon notranslate')
            li.setAttribute('onclick', 'window.copyIcon(' + "'" + this.fontawesome_key[j] + "'" + ')')
            if (li !== undefined && li !== null) {
              fragment.appendChild(li)
            }
          }
          if (fragment !== undefined && fragment !== null) {
            document.getElementById('fatext').appendChild(fragment)
          }
          this.timer2 = requestAnimationFrame(() => {
            this.RenderFAIcon(i + 1601)
          })
        }
      },
      // 驼峰转下划线
      toLowerLine (str) {
        if (str.substr(0, 3) === 'mat') {
          let t = str.replace(/([A-Z]|\d+)/g, (a, l) => `_${l.toLowerCase()}`).substring(4)
          switch (t) {
            case 'crop_32':
              t = 'crop_3_2'
              break
            case 'crop_169':
              t = 'crop_16_9'
              break
            case 'crop_54':
              t = 'crop_5_4'
              break
            case 'crop_75':
              t = 'crop_7_5'
              break
            default:
              break
          }
          return t
        }
        if (str.substr(0, 2) === 'fa') {
          let t = str.replace(/([A-Z])/g, (a, l) => `-${l.toLowerCase()}`).replace(/-/, ' fa-')
          switch (t) {
            case 'fab500px':
              t = 'fab fa-500px'
              break
            case 'fas fa-stopwatch20':
              t = 'fas fa-stopwatch-20'
              break
            case 'fab fa-font-awesome-logo-full':
              t = 'fas fa-stopwatch-20'
              break
            case 'far fa-font-awesome-logo-full':
              t = 'fas fa-stopwatch-20'
              break
            default:
              break
          }
          return t
        }
        if (str.substr(0, 2) === 'bi') {
          let t = str.replace(/([A-Z])/g, (a, l) => `-${l.toLowerCase()}`).replace(/-/, ' bi-')
          switch (t) {
            default:
              break
          }
          return t
        }
      },
      // 复制成功
      copy (e) {
        this.dataForm.icon = e
        this.$refs.q_popup_edit_icon.hide()
        // copyToClipboard(e).then(() => {
        //   console.log('------------copyToClipboard----------------',e)
        //   this.$q.notify({
        //     message: '成功复制到剪切板',
        //     color: 'green',
        //     position: 'top',
        //     timeout: 1500
        //   })
        // }).catch(() => {
        //   // 不支持复制
        //   this.$q.notify({
        //     message: '复制到剪切板失败',
        //     color: 'warming',
        //     position: 'top',
        //     timeout: 1500
        //   })
        // })
      },
      handleClipboard(text, event) {
        clipboard(text, event)
        this.dataForm.icon = val
      },
      filterMenuName(menuOptions,id,nameArray){
        menuOptions.map(ele=>{
          if (ele.id === id) {
            nameArray.push(ele.name)
          }else{
            if (ele.hasOwnProperty('children')) {
              this.filterMenuName(ele.children,id,nameArray)
            } else {
              if (ele.id === id) {
                nameArray.push(ele.name)
              }
            }
          }
          
        })
        
      },
      updateSelectedFunc(target){
        let nameArray = []
        this.filterMenuName(this.popupTreeData,target,nameArray)
        if (nameArray.length > 0) {
          this.dataForm.parentName = nameArray[0]
        }else{
          this.dataForm.parentName = ''
        }
        if (this.$refs.q_popup_edit_parentId) {
          this.$refs.q_popup_edit_parentId.hide()
        }

        
      },
      onSubmit(){
        console.log('----------submitClickFunc---------------',this.dataForm)
        this.prompt = false
      },
      onReset(){
        this.dataForm = {
          id: 0,
          menuType: 1,
          name: '',
          parentId: 0,
          parentName: '',
          url: '',
          perms: '',
          orderNum: 0,
          icon: '',
          isFrame:false,
          web_path:'',
          component_path:'',
          interface_method:'',
          visible:'',
          status:'',
          isCache:''
        }
      }
    },



}
</script>

<style lang="sass">
$tabbar-height: 250px
.q-pa-none
  height: calc(100vh - #{$tabbar-height})

  
</style>
<style lang="scss">
  .myIcon {
    padding: 15px;
    font-size: 35px;
    color: #363F45;
    cursor: pointer;
  }
  .myIcon:hover {
    background: #EDECEC;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
  }
</style>
