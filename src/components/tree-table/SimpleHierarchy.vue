<template>
    <span>
      <q-hierarchy :columns="columns" :data="data"></q-hierarchy>
    </span>
</template>

<script>
    export default {
        name: "SimpleHierarchy",
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
        }
    }
</script>

<style scoped>

</style>
