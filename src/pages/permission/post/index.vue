<template>
  <div>
    <q-page class="q-pa-sm">
      <q-card flat bordered>
        <q-card-section class="q-pa-none">
          
          <xm-table 
            :pagination="pagination" 
            :tableData="tableData" 
            :columns="columns"
            :loading="loading_table"
            @edit="cellEditFunc"
            @dele="deleEditFunc"
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
              v-model="dataForm.postName"
              :label="'岗位名称 *'"
              hint="尽量保持唯一"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Please type something']"
            />

            <q-input
              v-model="dataForm.postCode"
              :label="'岗位编码 *'"
              hint="请输入编码名称"
              lazy-rules
              :rules="[ val => val && val.length > 5 || '6位以上任意字符组合']"
            >
            </q-input>

            <q-input
              v-model="dataForm.postSort"
              type="number"
              label="岗位顺序"
              hint="请输入岗位顺序"
              lazy-rules
              :rules="[ val => val !== undefined  || 'Please type something']"
            />
              
            <div class="fit row  justify-start items-start content-start">
              <span>岗位状态：</span> 
              <q-option-group
                v-model="dataForm.status"
                :options="[{ label: '正常', value: '0' },{ label: '停用', value: '1' }]"
                color="primary"
                inline
                size="xs"
                dense
              >
              </q-option-group>
            </div>

            <q-input
              v-model="dataForm.remark"
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
  </div>
    
</template>

<script>
import { listPost, getPost, delPost, addPost, updatePost, exportPost } from "@/api/permission/post";
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
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          postCode: undefined,
          postName: undefined,
          status: undefined
        },
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
          { name: 'id', required: true, label: '岗位编号', align: 'center', field: row => row.id, format: val => `${val}` },
          { name: 'postCode', required: true, align: 'left', label: '岗位编码', field: row => row.postCode, format: val => `${val}`, sortable: true },
          { name: 'postName', align: 'left', label: '岗位名称', field: row => row.postName , sortable: false},
          { name: 'postSort', align: 'left', label: '岗位排序', field: row => row.postSort, sortable: true },
          { name: 'status', align: 'left', label: '状态', field: row => row.status, sortable: true },
          { name: 'create_datetime', align: 'left', label: '创建时间', field: row => row.create_datetime },
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
          postCode: null,
          postName: null,
          postSort: null,
          status: null,
          create_datetime: null
        },
        postresponse:{"code":200,"data":{"count":4,"next":null,"previous":null,"results":[{"id":1,"create_datetime":"2021-02-27 07:16:10","update_datetime":"2021-02-27 07:16:10","creator_name":"admin","dept_belong_id":"1","postName":"董事长","postCode":"ceo","postSort":1,"status":"1","remark":null},{"id":2,"create_datetime":"2021-02-27 07:16:28","update_datetime":"2021-02-27 07:16:28","creator_name":"admin","dept_belong_id":"1","postName":"项目经理","postCode":"ce","postSort":2,"status":"1","remark":null},{"id":3,"create_datetime":"2021-02-27 07:16:39","update_datetime":"2021-02-27 07:16:39","creator_name":"admin","dept_belong_id":"1","postName":"人力资源","postCode":"hr","postSort":3,"status":"1","remark":null},{"id":4,"create_datetime":"2021-02-27 07:16:51","update_datetime":"2021-02-27 07:16:51","creator_name":"admin","dept_belong_id":"1","postName":"普通员工","postCode":"user","postSort":4,"status":"1","remark":null}]},"msg":"success","status":"success"}
        
      }
    },
    created(){
      this.getList();
      this.getDicts("sys_normal_disable").then(response => {
        this.statusOptions = response.data;
      });
    },
    methods: {
      cellEditFunc(props){
        this.isEdit = true
        this.prompt = true
        console.log('------------cellEditFunc---props-------------',props)
        this.dataForm = Object.assign(this.dataForm,props.val)
      },
      deleEditFunc(props){
        console.log('------------deleEditFunc---props-------------',props.val)
      },
      batchDeleFunc(data){
        console.log('------batchDeleFunc----selected_table-----------',data.val)
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
      getList: function() {
        
        this.loading_table = true
        listPost(this.queryParams).then(response => {
          if (response.data.getadminlist.code === 2000) {
            
            let res_data = response.data.getadminlist.data
            _this.tableData.splice(0, _this.tableData.length, ...res_data)
            
          }
          _this.loading_table = false
        }).catch(() => {
          this.tableData = this.postresponse.data.results;
          this.total = this.postresponse.data.count;
          this.loading_table = false;
        })
      },
      onSubmit(){
        console.log('----------submitClickFunc---------------',this.dataForm)
        this.prompt = false
      },
      onReset(){
        this.dataForm = {
          id: 0,
          postCode: null,
          postName: null,
          postSort: null,
          status: null,
          create_datetime: null
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