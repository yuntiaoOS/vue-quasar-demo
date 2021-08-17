<template>
  <div>
    <q-page class="q-pa-sm">
      <q-card flat bordered>
        <q-card-section class="q-pa-none">
          
          <xm-table 
            :pagination="pagination" 
            :tableData="tableData" 
            :columns="columns"
            :megeHeader="megeHeader"
            :megeInfo="{StandardKey:'username',megeKeys:['username','sex','realname']}"
            @edit="cellEditFunc"
            @add="addAdminClickFunc"
            @batchDele="batchDeleFunc"
            >
            
          </xm-table>
        </q-card-section>
      </q-card>
    </q-page>

    <q-dialog v-model="prompt" persistent>
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">{{ isEdit? '编辑': '新增'}}</div>
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
              v-model="dataForm.username"
              :label="'用户名 *'"
              hint="尽量保持唯一"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Please type something']"
            />

            <q-input
              v-model="dataForm.password"
              :type="isPwd ? 'password' : 'text'"
              :label="'密码 *'"
              hint="6位以上任意字符组合"
              lazy-rules
              :rules="[ val => val && val.length > 5 || '6位以上任意字符组合']"
            >
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>

            <q-input
              v-model="dataForm.realname"
              :label="'姓名 *'"
              hint="真实姓名"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Please type something']"
            />
              
            <q-input
              v-model="dataForm.email"
              type="email"
              :label="'邮箱'"
              hint=""
              lazy-rules
              :rules="[ val => val !== undefined || 'Please type something']"
            />

            <q-input
              v-model="dataForm.phone"
              type="tel"
              :label="'手机'"
              hint=""
              mask="###########"
              lazy-rules
              :rules="[ val => val !== undefined || 'Please type something']"
            />

            <q-select v-model="dataForm.department" :options="departmentOptions" label="部门" />

            <q-input
              v-model="dataForm.marks"
              :label="'备注'"
              hint="备注说明"
              autogrow
            />

            <q-select v-if="isEdit" v-model="dataForm.role" :options="roleOptions" label="角色" />

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
import { getadminlist } from "@/api/UserApi"
import { exportFile } from 'quasar'
import { makeMergeDataFunc } from "@/utils/tableColRowSpan";
function wrapCsvValue (val, formatFn) {
  let formatted = formatFn !== void 0
    ? formatFn(val)
    : val

  formatted = formatted === void 0 || formatted === null
    ? ''
    : String(formatted)

  formatted = formatted.split('"').join('""')
  /**
   * Excel accepts \n and \r in strings, but some other CSV parsers do not
   * Uncomment the next two lines to escape new lines
   */
  // .split('\n').join('\\n')
  // .split('\r').join('\\r')

  return `"${formatted}"`
}
export default {
    name: "TreeTable",
    components: {
      XmPagination: ()=> import ("@/components/XmPagination/XmPagination"),
      XmDropdown: ()=> import ("@/components/XmDropdown/XmDropdown"),
      XmTable: ()=> import ("@/components/XmTable/XmTable"),
    },
    data () {
      return {
        date:'2019/02/01',
        isPwd: true,
        isEdit:false,
        loading_table:false,
        selected_table:[],
        megeHeader:[],
        tableData:[
                    { 
                      id: 0,
                      username: '',
                      password: '',
                      realname: '',
                      phone: '',
                      email: '',
                      department: '',
                      role: '',
                      marks: '',
                    }
                  ],
        pagination: {
          sortBy: 'desc',
          descending: false,
          page: 0,
          rowsPerPage: 20,
          // rowsNumber: 100// rowsNumber: xx if getting data from a server
        },
        roleOptions:[],
        columns: [
          { name: 'id', required: true, label: '#', align: 'center', field: row => row.id, format: val => `${val}` },
          { name: 'username', required: true, align: 'left', label: 'username', field: row => row.username, format: val => `${val}`, sortable: true },
          { name: 'sex', align: 'left', label: 'sex', field: row => row.sex === 0 ? '女' : '男', sortable: false, 
            filterModel:'' , filterModelOptions:[{label: '女',value: '0'} ,{label: '男',value: '1'},{label: '全部',value: ''}],
          },
          { name: 'realname', align: 'left', label: 'realname', field: row => row.realname, sortable: true },
          { name: 'phone', align: 'left', label: 'phone', field: row => row.phone, sortable: true },
          { name: 'email', align: 'left', label: 'email', field: row => row.email },
          { name: 'department', align: 'left', label: 'department', field: row => row.department },
          { name: 'marks', align: 'left', label: 'marks', field: row => row.marks },
          // { name: 'calcium', label: 'Calcium (%)', field: 'calcium', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) },
          // { name: 'iron', label: 'Iron (%)', field: 'iron', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) }
          {name: 'Action', label: '操作', field: 'Action', sortable: false, align: 'center'}
        ],

        prompt:false,
        filter:'',
        departmentOptions:[
          'Google', 'Facebook', 'Twitter', 'Apple', 'Oracle'
        ],
        dataForm : {
          id: 0,
          username: '',
          password: '',
          realname: '',
          phone: '',
          email: '',
          department: '',
          role: '',
          marks: '',
        }
      }
    },
    created(){

    },
    mounted(){
      this.getadminlistFunc()
    },
    methods: {
      cellEditFunc(props){
        this.isEdit = true
        this.prompt = true
        console.log('------------cellEditFunc---props-------------',props)
        this.dataForm = Object.assign(this.dataForm,props.val)
      },
      batchDeleFunc(){
        console.log('------batchDeleFunc----selected_table-----------',this.selected_table)
      },
      exportTable () {
        // naive encoding to csv format
        const content = [ this.columns.map(col => wrapCsvValue(col.label)) ].concat(
          this.tableData.map(row => this.columns.map(col => wrapCsvValue(
            typeof col.field === 'function'
              ? col.field(row)
              : row[col.field === void 0 ? col.name : col.field],
            col.format
          )).join(','))
        ).join('\r\n')

        const status = exportFile(
          'table-export.csv',
          content,
          'text/csv'
        )

        if (status !== true) {
          this.$q.notify({
            message: 'Browser denied file download...',
            color: 'negative',
            icon: 'warning'
          })
        }
      },
      getSelectedString(){
        return this.selected_table.length === 0 ? '' : `${this.selected_table.length} record${this.selected_table.length > 1 ? 's' : ''} selected of ${this.tableData.length}`
      },
      addAdminClickFunc(){
        this.prompt = true
      },
      getadminlistFunc: function() {
        let params = {
          name:'fnkjadn',
          id:1111
        }
        let _this = this
        this.loading_table = true
        getadminlist(params).then(response => {
          if (response.data.getadminlist.code === 2000) {
            
            let res_data = response.data.getadminlist.data
            _this.tableData.splice(0, _this.tableData.length, ...res_data)
            _this.megeHeader = response.data.headerKeys
            console.log('--getadminlistFunc------response-------------',_this.megeHeader)
            
          }
          _this.loading_table = false
        }).catch(() => {

        })
      },
      onSubmit(){
        console.log('----------submitClickFunc---------------',this.dataForm)
        this.prompt = false
      },
      onReset(){
        this.dataForm = {
          id: 0,
          username: '',
          password: '',
          realname: '',
          phone: '',
          email: '',
          department: '',
          role: '',
          marks: '',
        }
      }
    },



}
</script>

<style scoped lang="scss">
thead th {
  text-align: center;
  border-left-width: 1px;
  border-bottom-width: 1px;
}
// thead th {
//   background-color: #1976d2 !important;
// }

</style>
<style scoped lang="sass">

</style>