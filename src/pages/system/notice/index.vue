<template>
  <div>
    <q-page class="q-pa-sm">
      <q-card>
        <q-card-section>
          <div class="text-h6 text-indigo-8">机构管理</div>
          <div class="fit row no-wrap justify-end items-end content-end example-container">
            <q-input style="width:300px;" size="sm" tabindex="0" class="example-cell" borderless dense debounce="300" v-model="filter" placeholder="Search">
              <template v-slot:append>
                <q-icon name="search"  @click="filter = ''" class="cursor-pointer"/>
              </template>
              <template v-slot:after>
                <q-btn label="添加" icon-right="add" size="sm" class="bg-indigo-8 text-capitalize text-white" @click="prompt = true"></q-btn>
              </template>
            </q-input>
          </div>
        </q-card-section>

        <q-separator></q-separator>
        <q-card-section class="q-pa-none">
          <q-table
            class="my-sticky-virtscroll-table"
            virtual-scroll
            :pagination="pagination"
            row-key="name"
            title=""
            :data="tableData"
            :columns="columns"
            :loading="loading"
          >
            <template v-slot:loading>
              <q-inner-loading showing color="primary" />
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </q-page>

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
            
            <q-option-group
              v-model="dataForm.type"
              :options="typeOption"
              color="primary"
              inline
              size="xs"
              dense
            >
            </q-option-group>

            <q-input
              filled
              v-model="dataForm.name"
              :label="['目录', '菜单', '按钮'][dataForm.type] + '名称 *'"
              hint="尽量保持唯一"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Please type something']"
            />

            <q-input
              filled
              v-model="dataForm.parentName"
              label="上级菜单"
              hint="点击选择"
              readonly  
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Please type something']"
            >
              <q-menu
                anchor="top right"
                self="top left"
              >
                <q-tree
                  :nodes="popupTreeData"
                  node-key="parentId"
                  label-key="parentName"
                  selected-color="primary"
                  :selected.sync="dataForm.parentId"
                  default-expand-all
                  @update:selected="updateSelectedFunc"
                />
              </q-menu>
            </q-input>

            <q-input
              v-if="dataForm.type !== 0"
              filled
              v-model="dataForm.perms"
              label="授权标识"
              hint="如: sys:user:add, sys:user:edit, sys:user:dele"
              lazy-rules
              :rules="[ val => val !== undefined || 'Please type something']"
            />

            <q-input
              v-if="dataForm.type === 1"
              filled
              v-model="dataForm.url"
              label="菜单路由"
              hint="URL格式：常规业务开发的功能URL，如用户管理，Views目录下页面路径为 /Sys/User, 此处填写 /Sys/User。"
              lazy-rules
              :rules="[ val => val !== undefined || 'Please type something']"
            />

            <q-input
              v-if="dataForm.type !== 2"
              filled
              v-model="dataForm.icon"
              label="菜单图标"
              hint=""
              lazy-rules
              readonly
              :rules="[ val => val !== undefined || 'Please type something']"
            >
              <q-menu
                anchor="top left"
                self="top right"
                fit
              >
                <div style="min-width: 350px"></div>
                <!-- <div class="text-purple q-gutter-md" v-for="item of svgIcons" :key="item" @click="handleClipboard(item,$event)">
                
                  <svg-icon style="width: 100%;height: 100%;" :icon-class="item" class-name="disabled" />
                  <q-icon size="100px" name="img:@/icons/svg/404.svg" />
                </div> -->
              </q-menu>
            </q-input>
              
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
export default {
    name: "TreeTable",
    components: {
      
    },
    data () {
      return {
        loading:false,
        tableData:[
                    {name: 'Frozen Yogurt',calories: 159,fat: 6.0,carbs: 24,protein: 4.0,sodium: 87,calcium: '14%',iron: '1%'},
                    {name: 'Frozen Yogurt',calories: 159,fat: 6.0,carbs: 24,protein: 4.0,sodium: 87,calcium: '14%',iron: '1%'},
                    {name: 'Frozen Yogurt',calories: 159,fat: 6.0,carbs: 24,protein: 4.0,sodium: 87,calcium: '14%',iron: '1%'},
                    {name: 'Frozen Yogurt',calories: 159,fat: 6.0,carbs: 24,protein: 4.0,sodium: 87,calcium: '14%',iron: '1%'},
                    {name: 'Frozen Yogurt',calories: 159,fat: 6.0,carbs: 24,protein: 4.0,sodium: 87,calcium: '14%',iron: '1%'},
                    {name: 'Frozen Yogurt',calories: 159,fat: 6.0,carbs: 24,protein: 4.0,sodium: 87,calcium: '14%',iron: '1%'},
                    {name: 'Frozen Yogurt',calories: 159,fat: 6.0,carbs: 24,protein: 4.0,sodium: 87,calcium: '14%',iron: '1%'},
                    {name: 'Frozen Yogurt',calories: 159,fat: 6.0,carbs: 24,protein: 4.0,sodium: 87,calcium: '14%',iron: '1%'},
                    {name: 'Frozen Yogurt',calories: 159,fat: 6.0,carbs: 24,protein: 4.0,sodium: 87,calcium: '14%',iron: '1%'},
                    {name: 'Frozen Yogurt',calories: 159,fat: 6.0,carbs: 24,protein: 4.0,sodium: 87,calcium: '14%',iron: '1%'},
                    {name: 'Frozen Yogurt',calories: 159,fat: 6.0,carbs: 24,protein: 4.0,sodium: 87,calcium: '14%',iron: '1%'},
                    {name: 'Frozen Yogurt',calories: 159,fat: 6.0,carbs: 24,protein: 4.0,sodium: 87,calcium: '14%',iron: '1%'},
                    {name: 'Frozen Yogurt',calories: 159,fat: 6.0,carbs: 24,protein: 4.0,sodium: 87,calcium: '14%',iron: '1%'},
                    {name: 'Frozen Yogurt',calories: 159,fat: 6.0,carbs: 24,protein: 4.0,sodium: 87,calcium: '14%',iron: '1%'},
                    {name: 'Frozen Yogurt',calories: 159,fat: 6.0,carbs: 24,protein: 4.0,sodium: 87,calcium: '14%',iron: '1%'},
                    {name: 'Frozen Yogurt',calories: 159,fat: 6.0,carbs: 24,protein: 4.0,sodium: 87,calcium: '14%',iron: '1%'},
                    {name: 'Frozen Yogurt',calories: 159,fat: 6.0,carbs: 24,protein: 4.0,sodium: 87,calcium: '14%',iron: '1%'},
                    {name: 'Frozen Yogurt',calories: 159,fat: 6.0,carbs: 24,protein: 4.0,sodium: 87,calcium: '14%',iron: '1%'},
                    {name: 'Frozen Yogurt',calories: 159,fat: 6.0,carbs: 24,protein: 4.0,sodium: 87,calcium: '14%',iron: '1%'},
                    {name: 'Frozen Yogurt',calories: 159,fat: 6.0,carbs: 24,protein: 4.0,sodium: 87,calcium: '14%',iron: '1%'},
                    {name: 'Frozen Yogurt',calories: 159,fat: 6.0,carbs: 24,protein: 4.0,sodium: 87,calcium: '14%',iron: '1%'},
                    {name: 'Frozen Yogurt',calories: 159,fat: 6.0,carbs: 24,protein: 4.0,sodium: 87,calcium: '14%',iron: '1%'},
                    {name: 'Frozen Yogurt',calories: 159,fat: 6.0,carbs: 24,protein: 4.0,sodium: 87,calcium: '14%',iron: '1%'},
                    {name: 'Frozen Yogurt',calories: 159,fat: 6.0,carbs: 24,protein: 4.0,sodium: 87,calcium: '14%',iron: '1%'},
                    {name: 'Frozen Yogurt',calories: 159,fat: 6.0,carbs: 24,protein: 4.0,sodium: 87,calcium: '14%',iron: '1%'},
                    {name: 'Frozen Yogurt',calories: 159,fat: 6.0,carbs: 24,protein: 4.0,sodium: 87,calcium: '14%',iron: '1%'},
                    {name: 'Frozen Yogurt',calories: 159,fat: 6.0,carbs: 24,protein: 4.0,sodium: 87,calcium: '14%',iron: '1%'},
                    {name: 'Frozen Yogurt',calories: 159,fat: 6.0,carbs: 24,protein: 4.0,sodium: 87,calcium: '14%',iron: '1%'},
                    {name: 'Frozen Yogurt',calories: 159,fat: 6.0,carbs: 24,protein: 4.0,sodium: 87,calcium: '14%',iron: '1%'},
                    {name: 'Frozen Yogurt',calories: 159,fat: 6.0,carbs: 24,protein: 4.0,sodium: 87,calcium: '14%',iron: '1%'},
                    {name: 'Frozen Yogurt',calories: 159,fat: 6.0,carbs: 24,protein: 4.0,sodium: 87,calcium: '14%',iron: '1%'},
                    {name: 'Frozen Yogurt',calories: 159,fat: 6.0,carbs: 24,protein: 4.0,sodium: 87,calcium: '14%',iron: '1%'},
                    {name: 'Frozen Yogurt',calories: 159,fat: 6.0,carbs: 24,protein: 4.0,sodium: 87,calcium: '14%',iron: '1%'},
                    {name: 'Frozen Yogurt',calories: 159,fat: 6.0,carbs: 24,protein: 4.0,sodium: 87,calcium: '14%',iron: '1%'},
                    {name: 'Frozen Yogurt',calories: 159,fat: 6.0,carbs: 24,protein: 4.0,sodium: 87,calcium: '14%',iron: '1%'},
                    {name: 'Frozen Yogurt',calories: 159,fat: 6.0,carbs: 24,protein: 4.0,sodium: 87,calcium: '14%',iron: '1%'},
                    {name: 'Frozen Yogurt',calories: 159,fat: 6.0,carbs: 24,protein: 4.0,sodium: 87,calcium: '14%',iron: '1%'},
                    {name: 'Frozen Yogurt',calories: 159,fat: 6.0,carbs: 24,protein: 4.0,sodium: 87,calcium: '14%',iron: '1%'},
                    {name: 'Frozen Yogurt',calories: 159,fat: 6.0,carbs: 24,protein: 4.0,sodium: 87,calcium: '14%',iron: '1%'},
                    {name: 'Frozen Yogurt',calories: 159,fat: 6.0,carbs: 24,protein: 4.0,sodium: 87,calcium: '14%',iron: '1%'},
                    {name: 'Frozen Yogurt',calories: 159,fat: 6.0,carbs: 24,protein: 4.0,sodium: 87,calcium: '14%',iron: '1%'},
                    {name: 'Frozen Yogurt',calories: 159,fat: 6.0,carbs: 24,protein: 4.0,sodium: 87,calcium: '14%',iron: '1%'},
                  ],
        pagination: {
          sortBy: 'desc',
          descending: false,
          page: 2,
          rowsPerPage: 3
          // rowsNumber: xx if getting data from a server
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
        typeOption:[{ label: '目录', value: 0 }, { label: '菜单', value: 1 }, { label: '按钮', value: 2 } ],
        dataForm : {
          id: 0,
          type: 1,
          name: '',
          parentId: 0,
          parentName: '',
          url: '',
          perms: '',
          orderNum: 0,
          icon: '',
          iconList: []
        }
      }
    },
    created(){

    },
    mounted(){
    },
    methods: {
      handleClipboard(text, event) {
        clipboard(text, event)
        this.dataForm.icon = val
      },
      filterMenuName(menuOptions,id,nameArray){
        menuOptions.map(ele=>{
          if (ele.parentId === id) {
            nameArray.push(ele.parentName)
          }else{
            if (ele.hasOwnProperty('children')) {
              this.filterMenuName(ele.children,id,nameArray)
            } else {
              if (ele.parentId === id) {
                nameArray.push(ele.parentName)
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
        console.log('----------updateSelectedFunc---------------',this.dataForm,target,nameArray)

        
      },
      onSubmit(){
        console.log('----------submitClickFunc---------------',this.dataForm)
        this.prompt = false
      },
      onReset(){
        this.dataForm = {
          id: 0,
          type: 1,
          name: '',
          parentId: 0,
          parentName: '',
          url: '',
          perms: '',
          orderNum: 0,
          icon: '',
          iconList: []
        }
      }
    },



}
</script>

<style scoped lang="scss">
</style>
<style lang="sass">
$tabbar-height: 210px
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