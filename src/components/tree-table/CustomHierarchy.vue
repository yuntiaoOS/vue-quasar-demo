<template>
    <span>
      <q-hierarchy id="test" :columns="columns" :data="data" >
          <template v-slot:body="props">
            <td data-th="Name">
              <div v-bind:style="props.setPadding(props.item)"
                   :class="props.iconName(props.item)!='done'?'q-pl-lg':''">
                <q-btn @click="props.toggle(props.item)" v-if="props.iconName(props.item)!='done'"
                       :icon="props.iconName(props.item)" flat
                       dense>
                </q-btn>
                <span class="q-ml-sm">{{props.item.name}}</span>
              </div>
            </td>
            <td class="text-left">{{props.item.icon}}</td>
            <td class="text-left">{{props.item.orderNum}}</td>
            <td class="text-left">{{props.item.menuType}}</td>
            <td class="text-left">{{props.item.perms}}</td>
            <td class="text-left">{{props.item.component_path}}</td>
            <td class="text-left">{{props.item.status}}</td>
            <td class="text-left">{{props.item.update_datetime}}</td>
            <td class="text-left">{{props.item.create_datetime}}</td>
            <td class="text-center">
                <q-btn icon="edit" size="sm" color="primary" flat dense @click="cellEditFunc(props.item)" />
                <q-btn icon="delete" size="sm" color="negative" class="q-ml-sm" flat dense @click="cellDeleFunc(props.item)"/>
            </td>
          </template>
        </q-hierarchy>
    </span>
</template>

<script>
    export default {
        name: "CustomHierarchy",
        components:{
            qHierarchy : ()=> import('@/components/QHierarchy/QHierarchy')
        },
        props: {
                columns_props: { 
                    type: Array,
                    required:true,
                    default: ()=> []
                },
               
                data_props: { 
                    type: Array,
                    required:true,
                    default: ()=> []
                },
            },
        watch:{
            columns_props: {
                handler: function(val, oldVal) {
                    this.columns = Object.assign([],val) ;
                },
                deep: true,
                immediate: true
            },
            data_props: {
                handler: function(val, oldVal) {
                    this.data = Object.assign([],val);
                },
                deep: true,
                immediate: true
            },
        },
        data() {
            return {
                columns: [],
                data: [],
            }
        },
        methods:{
            cellEditFunc: function(row){
                this.$emit('edit', {val: row  })
            },
            cellDeleFunc: function(row){
                this.$emit('dele', {val: row  })
            },
        }

    }
</script>

<style scoped>

</style>
