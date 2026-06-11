<template>
  <div class="paginate" v-if="total">
    <el-pagination
      layout="prev, pager, next"
      :total="parseInt(total)"
      :page-size="pageSize"
      @current-change="changePage"
      :current-page="currentPage"
      background
      :hide-on-single-page="false"
      :pager-count="5"
    ></el-pagination>
  </div>
  <div v-if="total" class="text-right paginate-info">
    Menampilkan {{ (currentPage - 1) * pageSize + 1 }} sampai {{ ((currentPage * pageSize) > total) ? total : currentPage * pageSize }} dari {{ total }} ({{Math.ceil(total/pageSize)}} Halaman)
  </div>
</template>

<script setup>
// defineProps({
//   total: {
//     type: Number,
//     required: true,
//   },
//   pageSize: {
//     type: Number,
//     required: true,
//   },
//   currentPage: {
//     type: Number,
//     required: true,
//   },
// });
defineProps(['total', 'pageSize', 'currentPage']);
function changePage(current) {  
  emit('current-change', current);
}
const emit = defineEmits(['current-change']);
</script>

<style lang="scss" scoped>
.paginate {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}
.paginate-info{
  font-size: 14px;
}
</style>
