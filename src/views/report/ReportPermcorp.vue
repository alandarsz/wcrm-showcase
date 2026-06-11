<template>
  <div class="bg-[#ffffff] flex flex-col items-center">
    <div class="w-full p-2">
      <div class="flex items-center justify-between mb-3">
        <h1 class="text-lg font-semibold">Report Performance Sales</h1>
        <!-- filter -->
      </div>
      <el-form :model="filterData" :label-position="labelPosition()" label-width="150px">
        <div class="w-full grid grid-cols-1 md:grid-cols-2 my-2 rounded border p-2 bg-gray-100">
          <el-form-item label="Periode">
            <el-date-range-input v-model:startDate="filterData.SINCE" v-model:endDate="filterData.UNTIL">
              <template #button>
                <div class="w-full flex md:justify-end justify-start items-center">
                  <el-button type="primary" size="small" class="w-full md:w-auto" @click="applyFilter"> Filter </el-button>
                </div>
              </template></el-date-range-input
            >
          </el-form-item>
          <div class="relative w-full">
            <div class="absolute bottom-0 right-0 hidden md:block">
              <el-button type="primary" class="w-full md:w-auto" @click="applyFilter"> Filter </el-button>
            </div>
          </div>
        </div>
      </el-form>
      <div class="flex flex-col sm:flex-row sm:items-center gap-3 mb-5 w-full">
        <el-form :model="filterData" class="flex flex-col sm:flex-row sm:items-end gap-2 w-full md:w-auto">
          <el-form-item prop="USER_ID" v-if="['ADM', 'SLSM'].includes(role)" class="mb-0 md:w-[300px]">
            <el-inferior-input
              v-model="filterData.id"
              :user-id="accountId"
              :group-id="groupValue"
              :role="role"
              @handle-change="handleFilterSales"
              ref="inferriorSelect"

              @clear="resetFilter"
            />
          </el-form-item>
        </el-form>
      </div>

      <!-- DESKTOP -->
      <div>
        <div>
          <el-table v-loading="loading" :data="listData" stripe border>
            <el-table-column type="index" label="No" min-width="60" />
            <el-table-column prop="namasales" label="Nama Sales" min-width="250" sortable>
              <template #default="{ row }"> 
                 <!-- {{ row }} -->
                   
                <el-button type="text" @click="onClickSales(row)">{{ row.namasales }}</el-button>
               </template>
            </el-table-column>

            <el-table-column prop="omset" label="Omset" min-width="250">
              <template #default="{ row }"> {{ formatRupiah(row.omset) }}</template>
            </el-table-column>
            <el-table-column prop="targetomset" label="Target Omset" min-width="250">
              <template #default="{ row }"> {{ formatRupiah(row.targetomset) }}</template>
            </el-table-column>
            <el-table-column prop="closing" label="Closing" min-width="100" />
            <el-table-column prop="targetclosing" label="Target Closing" min-width="150" />
            <el-table-column prop="percentOmset" label="Pencapaian Omset (%)" min-width="200" />
            <el-table-column prop="percentClosing" label="Pencapaian Closing (%)" min-width="200" />


            <!-- <el-table-column prop="nik" label="NIK" min-width="250" /> -->
            <!-- 
            <el-table-column prop="TanggalInvoiceDibuat" label="Tanggal Invoice Dibuat" min-width="180" />
            <el-table-column prop="NominalInvoice" label="Nominal Ongkir" min-width="120">
              <template #default="{ row }"> {{ formatRupiah(row.NominalInvoice) }}</template>
            </el-table-column>
            <el-table-column prop="PPH" label="PPH" min-width="80">
              <template #default="{ row }"> {{ formatRupiah(row.PPH) }}</template>
            </el-table-column>
            <el-table-column label="Insentif(%)" min-width="120">
              <template #default="{ row }"> {{ row.persen }}% </template>
            </el-table-column>
            <el-table-column prop="NominalInsentif" label="Insentif" min-width="120">
              <template #default="{ row }"> {{ formatRupiah(row.NominalInsentif) }}</template>
            </el-table-column> -->

            <!-- <table-column-action show-view @click-view="onViewDialog" /> -->
          </el-table>
        </div>
      </div>
      <!-- pagination -->

      <PaginationView :total="rowTotal" :page-size="pageSize" :current-page="pageIndex" @current-change="changePage" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue';
import { Search, FullScreen, CirclePlusFilled, More } from '@element-plus/icons-vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { dialogWidth, labelPosition } from '../../helper/appUtils';
// import API function sesuai kebutuhan untuk hit ke backend
import API from '../../api/apiReport';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
// import hooks buat insert, edit, pagination, dll
import HOOKS from '../../hooks/bundleOneOps';

const { addData, addForm, addDialog, saveAdd, cancelAdd } = HOOKS.useAddOneData();
const { listData, rowTotal, pageIndex, pageSize, getListData, changeIndex, loading, filterData, search, headers } = HOOKS.useListDataPaginate();
const { viewData, viewDialog, openViewDialog } = HOOKS.useViewOneData();

const store = useStore();
const accountId = computed(() => store.getters.accountId);
const route = useRoute();
const role = computed(() => store.getters.userRole) || localStorage.getItem('role');
const groupValue = computed(() => store.getters.userGroup) || localStorage.getItem('group');
filterData.value.USER_ID = accountId.value || localStorage.getItem('id');
const date = new Date();

const endDate = new Date(date);
const startDate = new Date(date);

const inferriorSelect = ref(null);

filterData.value.UNTIL = endDate.toISOString().split('T')[0];
startDate.setDate(startDate.getDate() - 7);
filterData.value.SINCE = startDate.toISOString().split('T')[0];

filterData.value.ROLE = role.value || localStorage.getItem('role');
filterData.value.GROUP_ID = groupValue.value || localStorage.getItem('group');

const onClickSales = (row) => {
filterData.value.id = row.sid; 
inferriorSelect.value.updateValue(Number(row.sid)); // panggil method updateValue() pada komponen ElInferiorInput
// inferriorSelect.value.setByID(); // panggil method setByID() pada komponen ElInferiorInput
  handleFilterSales({
    USER_ID: row.sid,
    USER_ROLE: row.role, // sesuaikan nama fieldnya
    USER_GROUP_CODE: row.group_id // sesuaikan nama fieldnya
  });
};

function handleFilterSales(data) {
  filterData.value.USER_ID = data.USER_ID;
  filterData.value.ROLE = data.USER_ROLE;
  filterData.value.GROUP_ID = data.USER_GROUP_CODE;
  filterData.value.SINCE;
  filterData.value.UNTIL;
  applyFilter();
  // // console.log(data );
  // // console.log(filterData.value)
}

// // console.log(route.query);

if (route.query.user_id || route.query.ID_USER) {
  filterData.value.id = route.query.user_id || route.query.ID_USER;
}

if (route.query.ROLE) {
  filterData.value.ROLE = route.query.role;
}
if (route.query.since) {
  filterData.value.SINCE = route.query.since;
  filterData.value.UNTIL = route.query.until;
}
if (route.query.group) {
  filterData.value.GROUP_ID = route.query.group;
}

// // console.log(filterData.value);

function applyFilter() {
  filterData.value.SINCE;
  filterData.value.UNTIL;
  filterData.value.ROLE;
  filterData.value.GROUP_ID;
  filterData.value.USER_ID;
  changePage(1);
}

function resetFilter() {
  filterData.value.USER_ID = accountId.value || localStorage.getItem('id');
  filterData.value.ROLE = role.value || localStorage.getItem('role');
  filterData.value.GROUP_ID = groupValue.value  || localStorage.getItem('group');
  applyFilter();
}

const q = ref('');

//get data
function doPaginate(index = 1, pSize) {
  getListData(API.getReportPermCorp, index, pSize || pageSize.value, search.value, filterData.value);
}

function changePage(index = 1) {
  changeIndex(() => doPaginate(index), index);
}

function firstload() {
  applyFilter();
}

const formatRupiah = (value) => {
  if (value == null) return '-';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value);
};

firstload();
</script>

<style scoped>
.el-input .el-input__inner {
  border-radius: 14px;
  width: 12px;
}
.el-card {
  border-radius: 14px;
}
.el-dropdown-link {
  cursor: pointer;
}

.el-tag {
  padding: 1px 4px;
  font-size: 11px;
}

.none {
  display: none;
}

/* Menambahkan styling scrollbar tipis agar tetap rapi */
.scrollbar-thin::-webkit-scrollbar {
  width: 4px;
}
.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #e5e7eb;
  border-radius: 20px;
}
</style>
