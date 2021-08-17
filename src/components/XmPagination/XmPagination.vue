<template>
  <div class="row items-center">
    <slot name="leftslot" v-bind:sourceData="scope" ></slot>
    <q-space />
    <!-- <span class="q-field q-mx-sm">{{'共 ' + scope.pagesNumber  + ' 页'}}</span> -->
    <q-select borderless emit-value map-options v-model="scope.pagination.rowsPerPage " :options="[{label: '10条/页',value: 10} ,{label: '20条/页',value: 20},{label: '50条/页',value: 50},{label: '100条/页',value: 100},{label: '200条/页',value: 200},{label: '500条/页',value: 500},{label: '1000条/页',value: 1000}]" />
    <q-pagination
      v-model="scope.pagination.page"
      :max="scope.pagesNumber"
      input
    />
    <!-- <q-btn
      v-if="scope.pagesNumber > 2"
      icon="first_page"
      color="grey-8"
      round
      denses
      flat
      :disable="scope.isFirstPage"
      @click="scope.firstPage"
    />

    <q-btn
      icon="chevron_left"
      color="grey-8"
      round
      dense
      flat
      :disable="scope.isFirstPage"
      @click="scope.prevPage"
    />

    <q-btn
      icon="chevron_right"
      color="grey-8"
      round
      dense
      flat
      :disable="scope.isLastPage"
      @click="scope.nextPage"
    />

    <q-btn
      v-if="scope.pagesNumber > 2"
      icon="last_page"
      color="grey-8"
      round
      dense
      flat
      :disable="scope.isLastPage"
      @click="scope.lastPage"
    /> -->
  </div>
</template>

<script>

export default {
  name: 'XmPagination',
  props: ['scope'],
  data: function (){
    return{
      
    }
  }
}
</script>
