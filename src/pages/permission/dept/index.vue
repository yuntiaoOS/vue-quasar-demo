<template>
  <div>
    <q-page class="q-pa-sm">
      <q-card>
        <q-card-section>
          <div class="text-h6 text-indigo-8">部门管理</div>
          <div class="fit row no-wrap justify-end items-end content-end example-container">
            <q-input style="width:300px;" size="sm" tabindex="0" class="example-cell" borderless dense debounce="300" v-model="filter" placeholder="Search">
              <template v-slot:append>
                <q-icon name="search"  @click="filter = ''" class="cursor-pointer"/>
              </template>
              <template v-slot:after>
                <q-btn label="添加" icon-right="add" size="sm" class="bg-indigo-8 text-capitalize text-white" @click="handleAdd"></q-btn>
              </template>
            </q-input>
          </div>
        </q-card-section>

        <q-separator></q-separator>
        <q-card-section class="q-pa-none">
          <!-- <simple-hierarchy :columns_props="columns_props" :data_props="menuList"></simple-hierarchy> -->
          <dept-hierarchy :columns_props="columns_props":data_props="deptList" @edit="handleUpdate" @dele="handleDelete"></dept-hierarchy>
        </q-card-section>
      </q-card>
    </q-page>

    <q-dialog v-model="open" persistent>
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
              v-model="form.parentName"
              label="上级菜单"
              hint="点击选择"
              readonly  
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Please type something']"
            >
              <q-popup-edit ref="q_popup_edit_parentId" v-model="form.parentId" content-class="bg-white text-dark">
                <q-tree
                    :nodes="popupTreeData"
                    node-key="id"
                    label-key="deptName"
                    children-key="children"
                    selected-color="primary"
                    :selected.sync="form.parentId"
                    default-expand-all
                    @update:selected="updateSelectedFunc"
                  />
              </q-popup-edit>
            </q-input>

           

            <div class="row justify-between">
              <div class="col-6">
                <q-input
                  class="q-pr-sm"
                  filled
                  v-model="form.deptName"
                  label="部门名称 *"
                  hint="尽量保持唯一"
                  lazy-rules
                  :rules="[ val => val && val.length > 0 || 'Please type something']"
                />
              </div>
              <div class="col-6">
                <q-input
                  class="q-pl-sm"
                  filled
                  v-model="form.orderNum"
                  type="number"
                  label="显示排序"
                  hint="左侧菜单显示排序"
                  lazy-rules
                  :rules="[ val => val !== undefined  || 'Please type something']"
                />
              </div>
            </div>
            
            <div class="row justify-between">
              <div class="col-6">
                <q-input
                  class="q-pr-sm"
                  filled
                  v-model="form.leader"
                  label="负责人"
                  hint="请输入负责人"
                  lazy-rules
                  :rules="[ val => val !== undefined || '负责人不能为空']"
                />
              </div>
              <div class="col-6">
                <q-input
                  class="q-pl-sm"
                  filled
                  v-model="form.phone"
                  label="联系电话"
                  hint="请输入联系电话"
                  lazy-rules
                  :rules="[ val => val !== undefined || '联系电话格式错误']"
                />
              </div>
            </div>
            
            <div class="row justify-between">
              <div class="col-6">
                <q-input
                  class="q-pr-sm"
                  filled
                  v-model="form.email"
                  label="邮箱"
                  hint="请输入邮箱"
                  lazy-rules
                  :rules="[ val => val !== undefined || '邮箱格式错误']"
                />
              </div>
              <div class="col-6">
                <div class="fit row  justify-start items-start content-start">
                  <span>部门状态：</span> 
                  <q-option-group
                    v-model="form.status"
                    :options="[{ label: '正常', value: '0' },{ label: '停用', value: '1' }]"
                    color="primary"
                    inline
                    size="xs"
                    dense
                  >
                  </q-option-group>
                </div>
              </div>
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
import { getDept, delDept, addDept, updateDept, listDeptExcludeChild, listDept } from "@/api/permission/dept";

// import Treeselect from "@riophae/vue-treeselect";
// import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
    name: "TreeTable",
    components: {
      // Treeselect,
      // SimpleHierarchy: () => import('@/components/tree-table/SimpleHierarchy'),
      DeptHierarchy: () => import('@/components/tree-table/DeptHierarchy'),
      // SvgIcon: () => import('@/components/SvgIcon'),
    },
    data () {
      return {
        
        columns_props:[
            {
                name: 'deptName',
                required: true,
                label: '部门名称',
                align: 'left',
                field: 'deptName',
                // (optional) tell QHierarchy you want this column sortable
                sortable: true,
                // If you want different sorting icon
                filterable: true
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
          deptName: undefined,
          status: undefined,
          pageNum: "all"
        },
        // 菜单表格树数据
        deptList: [],
        // 菜单树选项
        deptOptions: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 显示状态数据字典
        visibleOptions: [],
        // 菜单状态数据字典
        statusOptions: [],
        filter:'',
        treeDataSelected:'',
        popupeditshow:false,
        popupTreeData:[],
        typeOption:[{ label: '目录', value: '0' }, { label: '菜单', value: '1' }, { label: '按钮', value: '2' } ],
        form : {
          create_datetime: undefined,
          creator_name: undefined,
          deptName: undefined,
          dept_belong_id: undefined,
          email: undefined,
          id: undefined,
          orderNum: undefined,
          leader: undefined,
          owner: undefined,
          parentId: undefined,
          parentName: undefined,
          phone: undefined,
          status: undefined,
          update_datetime: undefined
        },
        deptresponse : {
            "code": 200,
            "data": [
                {
                    "id": 2,
                    "create_datetime": "2021-02-27 07:25:09",
                    "update_datetime": "2021-02-27 07:25:09",
                    "creator_name": "admin",
                    "parentId": 1,
                    "dept_belong_id": "2",
                    "deptName": "北京总公司",
                    "orderNum": 1,
                    "owner": null,
                    "phone": null,
                    "email": null,
                    "status": "1"
                },
                {
                    "id": 3,
                    "create_datetime": "2021-02-27 07:25:25",
                    "update_datetime": "2021-02-27 07:26:14",
                    "creator_name": "admin",
                    "parentId": 1,
                    "dept_belong_id": "3",
                    "deptName": "上海分公司",
                    "orderNum": 2,
                    "owner": null,
                    "phone": null,
                    "email": null,
                    "status": "1"
                },
                {
                    "id": 4,
                    "create_datetime": "2021-02-27 07:25:38",
                    "update_datetime": "2021-02-27 07:26:01",
                    "creator_name": "admin",
                    "parentId": 1,
                    "dept_belong_id": "4",
                    "deptName": "杭州分公司",
                    "orderNum": 4,
                    "owner": null,
                    "phone": null,
                    "email": null,
                    "status": "1"
                },
                {
                    "id": 5,
                    "create_datetime": "2021-02-27 07:25:54",
                    "update_datetime": "2021-02-27 07:28:15",
                    "creator_name": "admin",
                    "parentId": 1,
                    "dept_belong_id": "5",
                    "deptName": "深圳分公司",
                    "orderNum": 3,
                    "owner": null,
                    "phone": null,
                    "email": null,
                    "status": "0"
                },
                {
                    "id": 6,
                    "create_datetime": "2021-02-27 07:26:37",
                    "update_datetime": "2021-02-27 07:26:37",
                    "creator_name": "admin",
                    "parentId": 2,
                    "dept_belong_id": "6",
                    "deptName": "研发部门",
                    "orderNum": 1,
                    "owner": null,
                    "phone": null,
                    "email": null,
                    "status": "1"
                },
                {
                    "id": 7,
                    "create_datetime": "2021-02-27 07:26:47",
                    "update_datetime": "2021-02-27 07:26:47",
                    "creator_name": "admin",
                    "parentId": 2,
                    "dept_belong_id": "7",
                    "deptName": "市场部门",
                    "orderNum": 2,
                    "owner": null,
                    "phone": null,
                    "email": null,
                    "status": "1"
                },
                {
                    "id": 8,
                    "create_datetime": "2021-02-27 07:26:57",
                    "update_datetime": "2021-02-27 07:26:57",
                    "creator_name": "admin",
                    "parentId": 2,
                    "dept_belong_id": "8",
                    "deptName": "测试部门",
                    "orderNum": 3,
                    "owner": null,
                    "phone": null,
                    "email": null,
                    "status": "1"
                },
                {
                    "id": 9,
                    "create_datetime": "2021-02-27 07:27:06",
                    "update_datetime": "2021-02-27 07:27:06",
                    "creator_name": "admin",
                    "parentId": 2,
                    "dept_belong_id": "9",
                    "deptName": "财务部门",
                    "orderNum": 4,
                    "owner": null,
                    "phone": null,
                    "email": null,
                    "status": "1"
                },
                {
                    "id": 10,
                    "create_datetime": "2021-02-27 07:27:15",
                    "update_datetime": "2021-02-27 07:27:15",
                    "creator_name": "admin",
                    "parentId": 2,
                    "dept_belong_id": "10",
                    "deptName": "运维部门",
                    "orderNum": 5,
                    "owner": null,
                    "phone": null,
                    "email": null,
                    "status": "1"
                },
                {
                    "id": 11,
                    "create_datetime": "2021-02-27 07:27:24",
                    "update_datetime": "2021-02-27 07:27:24",
                    "creator_name": "admin",
                    "parentId": 3,
                    "dept_belong_id": "11",
                    "deptName": "市场部门",
                    "orderNum": 1,
                    "owner": null,
                    "phone": null,
                    "email": null,
                    "status": "1"
                },
                {
                    "id": 12,
                    "create_datetime": "2021-02-27 07:27:34",
                    "update_datetime": "2021-02-27 07:27:34",
                    "creator_name": "admin",
                    "parentId": 3,
                    "dept_belong_id": "12",
                    "deptName": "财务部门",
                    "orderNum": 2,
                    "owner": null,
                    "phone": null,
                    "email": null,
                    "status": "1"
                },
                {
                    "id": 13,
                    "create_datetime": "2021-02-27 07:27:47",
                    "update_datetime": "2021-02-27 07:28:20",
                    "creator_name": "admin",
                    "parentId": 5,
                    "dept_belong_id": "13",
                    "deptName": "市场部门",
                    "orderNum": 1,
                    "owner": null,
                    "phone": null,
                    "email": null,
                    "status": "0"
                },
                {
                    "id": 14,
                    "create_datetime": "2021-02-27 07:27:53",
                    "update_datetime": "2021-02-27 07:28:23",
                    "creator_name": "admin",
                    "parentId": 5,
                    "dept_belong_id": "14",
                    "deptName": "财务部门",
                    "orderNum": 2,
                    "owner": null,
                    "phone": null,
                    "email": null,
                    "status": "0"
                },
                {
                    "id": 15,
                    "create_datetime": "2021-02-27 07:28:03",
                    "update_datetime": "2021-02-27 07:28:03",
                    "creator_name": "admin",
                    "parentId": 4,
                    "dept_belong_id": "15",
                    "deptName": "市场部门",
                    "orderNum": 1,
                    "owner": null,
                    "phone": null,
                    "email": null,
                    "status": "1"
                },
                {
                    "id": 16,
                    "create_datetime": "2021-02-27 07:28:10",
                    "update_datetime": "2021-02-27 07:28:10",
                    "creator_name": "admin",
                    "parentId": 4,
                    "dept_belong_id": "16",
                    "deptName": "财务部门",
                    "orderNum": 2,
                    "owner": null,
                    "phone": null,
                    "email": null,
                    "status": "1"
                },
                {
                    "id": 1,
                    "create_datetime": "2021-02-27 15:18:39",
                    "update_datetime": "2021-02-27 07:26:20",
                    "creator_name": "admin",
                    "parentId": 0,
                    "dept_belong_id": "1",
                    "deptName": "XX创新科技",
                    "orderNum": 1,
                    "owner": null,
                    "phone": "15888888888",
                    "email": "cxkj@qq.com",
                    "status": "1"
                }
            ],
            "msg": "success",
            "status": "success"
        }}
    },
    watch: {
      
    },
    
    created(){
      this.getList();
      this.getDicts("sys_normal_disable").then(response => {
        this.statusOptions = response.data;
      }).catch(()=>{
        const response = {"code":200,"data":[{"dictLabel":"正常","dictValue":"1","is_default":true},{"dictLabel":"停用","dictValue":"0","is_default":false}],"msg":"success","status":"success"}
        this.statusOptions = response.data;
      });
    },
    mounted(){
      
    },
    methods: {
      filterMenuName(menuOptions,id,nameArray){
        menuOptions.map(ele=>{
          if (ele.id === id) {
            nameArray.push(ele.deptName)
          }else{
            if (ele.hasOwnProperty('children')) {
              this.filterMenuName(ele.children,id,nameArray)
            } else {
              if (ele.id === id) {
                nameArray.push(ele.deptName)
              }
            }
          }
          
        })
        
      },
      updateSelectedFunc(target){
        let nameArray = []
        this.filterMenuName(this.popupTreeData,target,nameArray)
        if (nameArray.length > 0) {
          this.form.parentName = nameArray[0]
        }else{
          this.form.parentName = ''
        }
        if (this.$refs.q_popup_edit_parentId) {
          this.$refs.q_popup_edit_parentId.hide()
        }
        
      },
      /** 查询部门列表 */
      getList() {
        this.loading = true;
        listDept(this.queryParams).then(response => {
          this.deptList = this.handleTree(response.data, "id");
          this.loading = false;
        }).catch(()=>{
          
          this.deptList = this.handleTree(this.deptresponse.data, "id");
          console.log('-------this.deptList--------------',this.deptList)
          this.loading = false;
        });
      },
      // 字典状态字典翻译
      statusFormat(row, column) {
        return this.selectDictLabel(this.statusOptions, row.status);
      },
     
      /** 新增按钮操作 */
      handleAdd() {
        this.onReset();
        
        // this.form = {"parentId": null}
        
        
        this.open = true;
        this.title = "添加部门";
        listDept({ pageNum: "all" }).then(response => {
          this.deptOptions = this.handleTree(response.data, "id");
        }).catch(()=>{
         
          this.deptOptions = [];
          this.deptOptions = this.handleTree( this.deptresponse.data, "id");
          this.popupTreeData = Object.assign([],this.deptOptions)
        });
      },
      /** 修改按钮操作 */
      handleUpdate(data) {
        const row = Object.assign({},data.val) 
        this.onReset();
        // getDept(row.id).then(response => {
          this.form =  row// response.data;
          this.open = true;
          this.title = "修改部门";
        // });
        listDeptExcludeChild(row.id).then(response => {
          this.deptOptions = this.handleTree(response.data, "id");
        }).catch(()=>{
         
          this.deptOptions = [];
          this.deptOptions = this.handleTree( this.deptresponse.data, "id");
          this.popupTreeData = Object.assign([],this.deptOptions)
          console.log('-------------popupTreeData-----------------------',this.popupTreeData)
        });
      },
      /** 删除按钮操作 */
      handleDelete(data) {
        const row = Object.assign({},data.val) 
        Dialog.create({
          title: '警告',
          message: '是否确认删除名称为"' + row.deptName + '"的数据项?',
          cancel: '取消',
          ok : '确定',
          persistent: true
        }).onOk(() => {
          // console.log('>>>> OK')
          // removeToken()
          // router.push({ path: '/login' })
          
          return delDept(row.id);
        }).onOk(() => {
          // console.log('>>>> second OK catcher')
        }).onCancel(() => {
          // console.log('>>>> Cancel')
        }).onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        });
        
      },
      onSubmit(){
        console.log('----------submitClickFunc---------------',this.form)
        const cloneData = JSON.parse(JSON.stringify(this.form));
        if (cloneData.parentId === 0) {
          delete cloneData["parentId"];
        }
        if (this.form.id !== undefined) {
          updateDept(cloneData).then(response => {
            this.msgSuccess("修改成功");
            this.open = false;
            this.getList();
          });
        } else {
          addDept(cloneData).then(response => {
            this.msgSuccess("新增成功");
            this.open = false;
            this.getList();
          });
        }
        
        this.open = false
      },
      onReset(){
        this.form = {
          create_datetime: undefined,
          creator_name: undefined,
          deptName: undefined,
          dept_belong_id: undefined,
          email: undefined,
          id: undefined,
          leader: undefined,
          orderNum: undefined,
          owner: undefined,
          parentId: null,
          parentName: undefined,
          phone: undefined,
          status: undefined,
          update_datetime: undefined
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
