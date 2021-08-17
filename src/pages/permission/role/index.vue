<template>
  <base-content>
    <div class="row base-card-shadow" style="margin: 8px;background-color: white">
      <div class="col-md-8 col-sm-8 col-xs-12">
        <q-table
          class="my-sticky-virtscroll-table"
          virtual-scroll
          :pagination="pagination"
          row-key="name"
          title=""
          :data="tableData"
          :columns="columns"
          :loading="loading"
          flat
          bordered
        >
          <template v-slot:loading>
            <q-inner-loading showing color="primary" />
          </template>
        </q-table>
      </div>
      <div class="col-md-4 col-sm-4 col-xs-12 q-pl-md" style="border-right: 0px solid rgba(0,0,0,0.12)">
          <div class="flex justify-between align-center items-center" style="font-size: 1.32rem;margin: 15px;">
            <span class="text-weight-bold">基础路由</span>
            <q-btn color="primary" icon="add" label="新增角色" @click="addRolesFunc"/>
          </div>
          <q-separator/>
          <div style="margin: 0 0 0 20px">
            <q-scroll-area ref="scrollArea" style="height: calc(95vh - 200px);" :thumb-style="thumbStyleOfMenu">
            <q-tree
              :nodes="baseRouter.baseR"
              node-key="name"
              default-expand-all
              tick-strategy="leaf"
              :ticked.sync="baseRouter.selected"
            >
              <template v-slot:default-header="prop" >
                <!-- <q-checkbox v-model="rolesSelect" :val="prop.node.name"/> -->
                <div class="row items-center" style="width: 100%">
                  <q-icon :name="prop.node.meta.icon || 'share'" class="q-mr-sm" />
                  <div >{{ prop.node.meta.title }}</div>
                </div>
              </template>
            </q-tree>
            </q-scroll-area>
          </div>
          <q-separator/>
          
          <div align="left" class="q-pt-md">
            <q-btn label="取消" color="primary" flat class="q-ml-xs" @click="onResetEditRoles" />
            <q-btn label="确定" color="primary" @click="onSubmitUpdata"/>
          </div>
      </div>
      
    </div>
    <q-dialog v-model="prompt" persistent>
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">新增</div>
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
              v-model="dataForm.name"
              :label="'名称 *'"
              hint="尽量保持唯一"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Please type something']"
            />

            <q-select v-model="dataForm.department" :options="departmentOptions" label="部门" />

            <q-input
              v-model="dataForm.marks"
              :label="'备注'"
              hint="备注说明"
              autogrow
            />

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
  </base-content>
</template>

<script>
import BaseContent from '@/components/BaseContent/BaseContent'
// eslint-disable-next-line no-unused-vars
import { asyncRoutesChildren } from '@/router/asyncRoutes'
import deepClone from '@/utils/CloneUtils'
import { getUserRouter } from '@/api/UserApi'
// eslint-disable-next-line no-unused-vars
import { handleAsyncRouterToJson, handleBaseRouterToRolesRouter } from '@/router/permissionUtils'

export default {
  name: 'AsyncRouter',
  components: { BaseContent },
  data () {
    return {
      departmentOptions:[
        'Google', 'Facebook', 'Twitter', 'Apple', 'Oracle'
      ],
      prompt:false,
      loading:false,
      tableData:[
                  {name: 'Frozen Yogurt1',calories: 159,fat: 6.0,carbs: 24,protein: 4.0,sodium: 87,calcium: '14%',iron: '1%'},
                  {name: 'Frozen Yogurt2',calories: 159,fat: 6.0,carbs: 24,protein: 4.0,sodium: 87,calcium: '14%',iron: '1%'},
                  {name: 'Frozen Yogurt3',calories: 159,fat: 6.0,carbs: 24,protein: 4.0,sodium: 87,calcium: '14%',iron: '1%'},
                  {name: 'Frozen Yogurt4',calories: 159,fat: 6.0,carbs: 24,protein: 4.0,sodium: 87,calcium: '14%',iron: '1%'},
                  {name: 'Frozen Yogurt5',calories: 159,fat: 6.0,carbs: 24,protein: 4.0,sodium: 87,calcium: '14%',iron: '1%'},
                  {name: 'Frozen Yogurt6',calories: 159,fat: 6.0,carbs: 24,protein: 4.0,sodium: 87,calcium: '14%',iron: '1%'},
                  {name: 'Frozen Yogurt7',calories: 159,fat: 6.0,carbs: 24,protein: 4.0,sodium: 87,calcium: '14%',iron: '1%'},
                  {name: 'Frozen Yogurt8',calories: 159,fat: 6.0,carbs: 24,protein: 4.0,sodium: 87,calcium: '14%',iron: '1%'},
                  {name: 'Frozen Yogurt9',calories: 159,fat: 6.0,carbs: 24,protein: 4.0,sodium: 87,calcium: '14%',iron: '1%'},
                  {name: 'Frozen Yogurt11',calories: 159,fat: 6.0,carbs: 24,protein: 4.0,sodium: 87,calcium: '14%',iron: '1%'},
                  {name: 'Frozen Yogurt12',calories: 159,fat: 6.0,carbs: 24,protein: 4.0,sodium: 87,calcium: '14%',iron: '1%'},
                  {name: 'Frozen Yogurt13',calories: 159,fat: 6.0,carbs: 24,protein: 4.0,sodium: 87,calcium: '14%',iron: '1%'},
                  {name: 'Frozen Yogurt14',calories: 159,fat: 6.0,carbs: 24,protein: 4.0,sodium: 87,calcium: '14%',iron: '1%'},
                  {name: 'Frozen Yogurt15',calories: 159,fat: 6.0,carbs: 24,protein: 4.0,sodium: 87,calcium: '14%',iron: '1%'},
                  {name: 'Frozen Yogurt16',calories: 159,fat: 6.0,carbs: 24,protein: 4.0,sodium: 87,calcium: '14%',iron: '1%'},
                  {name: 'Frozen Yogurt17',calories: 159,fat: 6.0,carbs: 24,protein: 4.0,sodium: 87,calcium: '14%',iron: '1%'},
                  {name: 'Frozen Yogurt18',calories: 159,fat: 6.0,carbs: 24,protein: 4.0,sodium: 87,calcium: '14%',iron: '1%'},
                  {name: 'Frozen Yogurt19',calories: 159,fat: 6.0,carbs: 24,protein: 4.0,sodium: 87,calcium: '14%',iron: '1%'},
                  {name: 'Frozen Yogurt21',calories: 159,fat: 6.0,carbs: 24,protein: 4.0,sodium: 87,calcium: '14%',iron: '1%'},
                  {name: 'Frozen Yogurt22',calories: 159,fat: 6.0,carbs: 24,protein: 4.0,sodium: 87,calcium: '14%',iron: '1%'},
                  {name: 'Frozen Yogurt23',calories: 159,fat: 6.0,carbs: 24,protein: 4.0,sodium: 87,calcium: '14%',iron: '1%'},
                  {name: 'Frozen Yogurt24',calories: 159,fat: 6.0,carbs: 24,protein: 4.0,sodium: 87,calcium: '14%',iron: '1%'},
                  {name: 'Frozen Yogurt25',calories: 159,fat: 6.0,carbs: 24,protein: 4.0,sodium: 87,calcium: '14%',iron: '1%'},
                  {name: 'Frozen Yogurt26',calories: 159,fat: 6.0,carbs: 24,protein: 4.0,sodium: 87,calcium: '14%',iron: '1%'},
                  {name: 'Frozen Yogurt27',calories: 159,fat: 6.0,carbs: 24,protein: 4.0,sodium: 87,calcium: '14%',iron: '1%'},
                  {name: 'Frozen Yogurt28',calories: 159,fat: 6.0,carbs: 24,protein: 4.0,sodium: 87,calcium: '14%',iron: '1%'},
                  {name: 'Frozen Yogurt29',calories: 159,fat: 6.0,carbs: 24,protein: 4.0,sodium: 87,calcium: '14%',iron: '1%'},
                  {name: 'Frozen Yogurt31',calories: 159,fat: 6.0,carbs: 24,protein: 4.0,sodium: 87,calcium: '14%',iron: '1%'},
                  {name: 'Frozen Yogurt32',calories: 159,fat: 6.0,carbs: 24,protein: 4.0,sodium: 87,calcium: '14%',iron: '1%'},
                  {name: 'Frozen Yogurt33',calories: 159,fat: 6.0,carbs: 24,protein: 4.0,sodium: 87,calcium: '14%',iron: '1%'},
                  {name: 'Frozen Yogurt34',calories: 159,fat: 6.0,carbs: 24,protein: 4.0,sodium: 87,calcium: '14%',iron: '1%'},
                  {name: 'Frozen Yogurt35',calories: 159,fat: 6.0,carbs: 24,protein: 4.0,sodium: 87,calcium: '14%',iron: '1%'},
                  {name: 'Frozen Yogurt36',calories: 159,fat: 6.0,carbs: 24,protein: 4.0,sodium: 87,calcium: '14%',iron: '1%'},
                  {name: 'Frozen Yogurt37',calories: 159,fat: 6.0,carbs: 24,protein: 4.0,sodium: 87,calcium: '14%',iron: '1%'},
                  {name: 'Frozen Yogurt38',calories: 159,fat: 6.0,carbs: 24,protein: 4.0,sodium: 87,calcium: '14%',iron: '1%'},
                  {name: 'Frozen Yogurt39',calories: 159,fat: 6.0,carbs: 24,protein: 4.0,sodium: 87,calcium: '14%',iron: '1%'},
                  {name: 'Frozen Yogurt41',calories: 159,fat: 6.0,carbs: 24,protein: 4.0,sodium: 87,calcium: '14%',iron: '1%'},
                ],
      pagination: {
        sortBy: 'desc',
        descending: false,
        page: 2,
        rowsPerPage: 3
        // rowsNumber: xx if getting data from a server
      },
      dataForm:{
        name:'',
        department:'',
        marks:'',
        roles:[]
      },
      columns: [
        {
          name: 'index',
          label: '#',
          field: 'index'
        },
        {
          name: 'name',
          required: true,
          label: 'Dessert (100g serving)',
          align: 'left',
          field: row => row.name,
          format: val => `${val}`,
          sortable: true
        },
        { name: 'calories', align: 'center', label: 'Calories', field: 'calories', sortable: true },
        { name: 'fat', label: 'Fat (g)', field: 'fat', sortable: true },
        { name: 'carbs', label: 'Carbs (g)', field: 'carbs' },
        { name: 'protein', label: 'Protein (g)', field: 'protein' },
        { name: 'sodium', label: 'Sodium (mg)', field: 'sodium' },
        { name: 'calcium', label: 'Calcium (%)', field: 'calcium', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) },
        { name: 'iron', label: 'Iron (%)', field: 'iron', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) }
      ],
      thumbStyleOfMenu: {
          borderRadius: '5px',
          backgroundColor: 'rgba(144,147,153,0.9)',
          padding: '10px;',
          margin: '10px;',
          width: '3px'
        },
      rolesSelect: [],
      roles: '',
      // 基础路由数据
      baseRouter: {
        baseR: [],
        selected: [],
        ticked: []
      },
      // 角色路由数据
      rolesRouter: {
        baseR: [],
        selected: [],
        ticked: []
      },
      rolesRouterData: ''
    }
  },
  mounted () {
    this.getUserR()
    // 在控制台输出当前 asyncRoutes 转 json 的结果
    // handleAsyncRouterToJson(deepClone(asyncRoutesChildren)).then(res => {
    //   console.log(JSON.stringify(res))
    // })
  },
  watch: {
    rolesSelect (n, o) {
      // 每次选项改变时，都更新一次 RolesRouter
      this.rolesRouter.baseR = handleBaseRouterToRolesRouter(deepClone(this.baseRouter.baseR), n)
      // 显示 RolesRouter 的数据
      this.rolesRouterData = JSON.stringify(this.rolesRouter.baseR)
    },
    'rolesRouter.baseR': {
      handler (n) {
        // 每次 RolesRouter 的数据改变就改变文本框中的值
        this.rolesRouter.baseR = n
        this.rolesRouterData = JSON.stringify(this.rolesRouter.baseR)
      },
      deep: true
    }
  },
  methods: {
    onResetEditRoles(){
      this.baseRouter.selected = []
      this.baseRouter.ticked = []
    },
    onSubmitUpdata(){
      console.log('---------onSubmitUpdata-----------',this.baseRouter)
    },
    onReset(){
      this.dataForm = {
        name:'',
        department:'',
        marks:'',
        roles:[]
      }
    },
    onSubmit(){
      console.log('-------onSubmit----this.dataForm--------',this.dataForm)
    },
    addRolesFunc(){
      this.onReset()
      this.prompt = true
      
    },
    /**
     * 模拟从后端请求权限路由
     */
    getUserR () {
      getUserRouter().then(res => {
        this.baseRouter.baseR = res.data
      }).catch(error => {
        console.log(error)
      })
    },
    handleSelect (e) {
      this.rolesRouter.selected = e.meta
    },
    handleReset () {
      this.rolesRouter = {
        baseR: [],
        selected: [],
        ticked: []
      }
    }
  }
}
</script>
<style lang="sass">
$tabbar-height: 110px
.my-sticky-virtscroll-table
  /* height or max-height is important */
  height: calc(100vh - #{$tabbar-height})
  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th /* bg color is important for th; just specify one */
    background-color: #fff

  thead tr th
    position: sticky
    z-index: 1
  /* this will be the loading indicator */
  thead tr:last-child th
    /* height of all previous header rows */
    top: 48px
  thead tr:first-child th
    top: 0
</style>