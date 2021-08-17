  
<template>
  <q-table
    class="my-sticky-header-column-table"
    virtual-scroll
    :pagination="pagination"
    :row-key="rowkey"
    :data="tableDataC"
    :columns="columns"
    :loading="loading"
    :selection=" showPart.indexOf('selection') !== -1 ?  (showPart.indexOf('selection-multiple') !== -1 ? 'multiple' : 'single')  : 'none'"
    :selected.sync="selected_tableC"
    flat
    bordered
    :separator="separator"
  >
    
    <template v-if="megeHeaderC.max_x !== 0" v-slot:header="props">
      <q-tr v-for="(item,index) in megeHeaderC.header" :key="index">
        <q-th v-if="index === 0" :auto-width="true" :rowSpan="megeHeaderC.max_x" >
          <div class="q-gutter-sm">
            <q-checkbox v-model="props.selected " />
          </div>
        </q-th>
        <q-th v-for="(itemS,indexS) in item" :key="indexS" :auto-width="true" 
          :colSpan=" itemS.hasChild === true ? ( itemS.y < megeHeaderC.max_y ? (item[indexS+1].y - itemS.y ) : 1 ) : 1 "
          :rowSpan=" itemS.hasChild === false ? (megeHeaderC.max_x - index) : 1 "
        >
          <div>{{itemS.label }}</div>
        </q-th>
        <q-th v-if="index === 0" :auto-width="true" :rowSpan="megeHeaderC.max_x" >
          操作
        </q-th>
      </q-tr>
      
    </template>
    <template v-if="megeInfo.StandardKey !== ''" v-slot:body="props">
      <q-tr :props="props">
        <q-td :auto-width="true" align = 'center'>
          <div class="q-gutter-sm">
            <q-checkbox v-model="props.selected " />
          </div>
        </q-td>
        <q-td :auto-width="true" :key="rowkey" :props="props">
          {{props.row[rowkey]}}
        </q-td>
        <q-td
          :auto-width="true"
          v-for="col in props.cols"
          :key="col.name"
          :props="props"
          v-if=" (props.row.spanCount !== 0) && (megeInfo.megeKeys.indexOf(col.name) !== -1) "
          :rowSpan=" megeInfo.megeKeys.indexOf(col.name) !== -1 ? props.row.spanCount : 1"
        >
          {{ col.value }}
        </q-td>
        <q-td
          :auto-width="true"
          v-for="col in props.cols"
          :key="col.name"
          :props="props"
          v-if=" (megeInfo.megeKeys.indexOf(col.name) === -1) && (col.name !== rowkey) "
        >
          <div v-if="col.name === 'Action'">
            <q-btn icon="edit" size="sm" color="primary" flat dense @click="cellEditFunc(props.row)" />
            <q-btn icon="delete" size="sm" color="negative" class="q-ml-sm" flat dense @click="cellDeleFunc(props.row)"/>
          </div>
          <span v-else>{{ col.value }}</span>
        </q-td>
        
      </q-tr>
    </template>
    <template v-slot:top>
      <div class="text-h6 text-indigo-8">{{title}}</div>
      <!-- <q-date
        v-model="date"
        minimal
      /> -->
      <q-space />
      <q-input style="width:400px;" size="sm" tabindex="0" class="example-cell" borderless dense debounce="300" v-model="filter" placeholder="Search">
        <template v-slot:append>
          <q-icon name="search"  @click="filter = ''" class="cursor-pointer"/>
        </template>
        <template v-slot:after>
          <q-btn label="添加" icon-right="add" size="sm" color="primary" @click="addAdminClickFunc"></q-btn>
          <q-btn
            size="sm"
            color="primary"
            icon-right="archive"
            label="导出csv"
            no-caps
            @click="exportTable"
          />
        </template>
      </q-input>
      <!-- <div class="fit row no-wrap justify-end items-end content-end example-container">{{ JSON.stringify(props.col) }}</div> -->
    </template>
    <template v-if="showPart.indexOf('action') !== -1" v-slot:body-cell-Action="props">
      <q-td :props="props">
        <q-btn icon="edit" size="sm" color="primary" flat dense @click="cellEditFunc(props.row)" />
        <q-btn icon="delete" size="sm" color="negative" class="q-ml-sm" flat dense @click="cellDeleFunc(props.row)"/>
      </q-td>
    </template>
    <template v-slot:bottom="scope">
      <xm-pagination style="width:100%;" :scope="scope">
        <template v-slot:leftslot="sourceData">
          <q-btn v-if="showPart.indexOf('selection') !== -1 &&　showPart.indexOf('batchDele') !== -1" :disable=" selected_tableC.length === 0 " label="批量删除" color="negative" icon-right="delete" size="sm"  @click="batchDeleFunc"></q-btn>
        </template>
      </xm-pagination>
    </template>
    <template v-slot:loading>
      <q-inner-loading showing color="primary" />
    </template>
  </q-table>
  
</template>

<script>
// import KtButton from "@/views/Core/KtButton"
// import { hasPermission } from '@/utils/index.js'

import { makeMergeDataFunc,makeHeaderMergeDataFunc } from "@/utils/tableColRowSpan";

export default {
    components:{
      XmPagination: ()=> import ("@/components/XmPagination/XmPagination"),
    },
    props: {
      width: {  // 按钮显示图标
        type: String,
        default: '200'
      },
      showPart: { 
        type: Array,
        default: ()=> ['batchDele','selection','selection-multiple','selection-single','action']
      },
      pagination:{  // 按钮显示图标
        type: Object,
        default: ()=> {
          return {
            sortBy: 'desc',
            descending: false,
            page: 0,
            rowsPerPage: 20,}
          }
      },
      rowkey:{  // 按钮显示图标
        type: String,
        default: ()=>'id'
      },
      title: {  // 按钮显示图标
        type: String,
        default: ()=>''
      },
      tableData:{ 
        type: Array,
        required:true,
        default: ()=> []
      },
      columns:{ 
        type: Array,
        required:true,
        default: ()=> []
      },
      loading: { // 按钮显示图标
        type: Boolean,
        default: ()=> false
      },
      megeInfo:{
        type: Object,
        default: ()=> {
          return {
            StandardKey:'',
            megeKeys:['']
          }
          
        }
      },
      megeHeader:{
        type: Array,
        default: ()=> []
      },
      selected_table: { 
        type: Array,
        default: ()=> []
      },
      disabled: {  // 按钮是否禁用
        type: Boolean,
        default: ()=> false
      },
      separator: {  // 按钮权限标识，外部使用者传入
        type: String,
        default: ()=> "cell" //horizontal, vertical, cell, none
      },
      perms: {  // 按钮权限标识，外部使用者传入
        type: String,
        default: ()=> null
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
    tableData:{
      handler(newValue, oldValue) {
        let dataCopy = Object.assign([],JSON.parse(JSON.stringify(newValue))) 
        let resData = makeMergeDataFunc(dataCopy,this.megeInfo.StandardKey)
        this.tableDataC = Object.assign([],resData)
        console.log('--------tableDataC---------',this.tableDataC)
      },
      deep: true
    },
    megeHeader:{
      handler(newValue, oldValue) {
        let dataCopy = Object.assign([],JSON.parse(JSON.stringify(newValue))) 

        let multiHeader0 = []
        let header0 = []
        let x = 0
        let y = 0
        makeHeaderMergeDataFunc(newValue,multiHeader0,header0,x,y)
        x = Math.max(...header0.map(ele=>{return ele.x}))
        y = Math.max(...header0.map(ele=>{return ele.y}))
        let mHeader = []
        for (let index = 0; index < x; index++) {
          mHeader.push([])
        }
        header0.map(ele=>{
          mHeader = mHeader.map((eleM,indexM)=>{
            if (indexM === ele.x - 1) {
              eleM.push(ele)
            }
            return eleM
          })
          return ele
        })
        this.megeHeaderC.header = Object.assign([],mHeader)
        this.megeHeaderC.max_x = x
        this.megeHeaderC.max_y = y
        console.log('--------megeHeaderC---------',header0,mHeader)
        
      },
      deep: true
    },
    selected_table:{
      handler(newValue, oldValue) {
        let dataCopy = Object.assign([],JSON.parse(JSON.stringify(newValue))) 
        this.selected_tableC = Object.assign([],dataCopy)
        console.log('--------tableDataC---------',this.selected_tableC)
      },
      deep: true
    },
  },
  
  data() {
    return {
      tableDataC:[],
      selected_tableC:[],
      megeHeaderC:{
        header:[],
        max_x:0,
        max_y:0,
      },
      filter:''
    };
  },
  mounted() {

  },
  methods: {
    cellEditFunc: function(row){
      this.$emit('edit', {val: row  })
    },
    cellDeleFunc: function(row){
      this.$emit('dele', {val: row  })
    },
    exportTable: function () {
      // 按钮操作处理函数
      this.$emit('export', {  })
    }, 
    addAdminClickFunc: function () {
      // 按钮操作处理函数
      this.$emit('add', {  })
    }, 
    batchDeleFunc: function (val) {
      // 按钮操作处理函数
      this.$emit('batchDele', { val: this.selected_tableC })
    }, 

  },
  
};
</script>
<style lang="scss" scoped>
// ::v-deep .q-table tbody td
// .my-sticky-header-column-table thead tr:nth-child(2) th:first-child ,
// .my-sticky-header-column-table thead tr:last-child th:first-child
// {
//     border-left: 1px solid rgba(0,0,0,0.12) ;
// }
</style>
<style scoped lang="sass">
$tabbar-height: 100px
.my-sticky-header-column-table
  /* height or max-height is important */
  height: calc(100vh - #{$tabbar-height})
  .q-table__top,
  .q-table__bottom,
  thead tr th /* bg color is important for th; just specify one */
    background-color: #fff

  thead tr th
    position: sticky
    z-index: 2
  /* this will be the loading indicator */
  thead tr:last-child th
    /* height of all previous header rows */
    top: 96px
    
  thead tr:first-child th
    top: 0
  thead tr:nth-child(2) th
    top: 48px
 

  // th:last-child
  //   background-color: #fff
  //   position: sticky
  //   right: 0
  //   z-index: 2
  // td:last-child
  //   background-color: #fff
  //   position: sticky
  //   right: 0
  //   z-index: 1

.my-sticky-header-column-table thead tr:nth-child(2) th:first-child ,
.my-sticky-header-column-table thead tr:last-child th:first-child
  border-left: 1px solid rgba(0,0,0,0.12)
::v-deep .q-virtual-scroll__content td 
  border-bottom: 1px solid rgba(0,0,0,0.12)
</style>