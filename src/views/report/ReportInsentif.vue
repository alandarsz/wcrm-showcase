<template>
  <div class="bg-[#ffffff] flex flex-col items-center">
    <div class="w-full p-2">
      <div class="flex items-center justify-between mb-3">
        <h1 class="text-lg font-semibold">Report Bonus Kiriman</h1>
        <!-- filter -->
      </div>
      <el-form :model="filterData" :label-position="labelPosition()" label-width="150px">
        <div class="w-full grid grid-cols-1 md:grid-cols-2 my-2 rounded border p-2 bg-gray-100">
          <el-form-item label="Periode">
            <el-date-range-input v-model:startDate="filterData.since" v-model:endDate="filterData.until">
              <template #button>
                <div class="w-full flex md:justify-end justify-start items-center">
                  <el-button type="primary" size="small" class="w-full md:w-auto" @click="firstload"> Filter </el-button>
                </div>
              </template></el-date-range-input
            >
          </el-form-item>
          <div class="relative w-full">
            <div class="absolute bottom-0 right-0 hidden md:block">
              <el-button type="primary" class="w-full md:w-auto" @click="firstload"> Filter </el-button>
              <el-button type="danger" class="w-full md:w-auto" @click="$router.push({ name: 'print-insentif', query: filterData })">
                Print PDF
              </el-button>
            </div>
          </div>
        </div>
      </el-form>
      <div class="flex flex-col sm:flex-row sm:items-center gap-3 mb-5 w-full">
        <el-form :model="filterData" class="flex flex-col sm:flex-row sm:items-end gap-2 w-full md:w-auto">
          <el-form-item prop="USER_ID" v-if="['ADM', 'SLSM'].includes(role)" class="mb-0 md:w-[280px]">
            <el-inferior-input v-model="filterData.id" :user-id="accountId" :group-id="groupValue" :role="role" @handle-change="handleFilterSales" @clear="resetFilter" />
          </el-form-item>
        </el-form>
      </div>

      <div v-loading="loadingGetReport">
        <div v-if="Object.values(groupedData).length">
          <div v-for="(item, idx) in Object.values(groupedData)" :key="idx">
            <hr />
            <p class="my-5">{{ Object.keys(groupedData)[idx] }}</p>
            <el-table
              v-loading="loadingGetReport || loadingPerTable[idx]"
              :data="item.pages[currentPage[idx] - 1].items"
              stripe
              border
              show-summary
              :summary-method="getSummaries"
              header-cell-class-name="table-header"
            >
              <el-table-column type="index" label="No" min-width="50"></el-table-column>
              <el-table-column 
                v-for="(data, index) in tableHeader"
                :prop="data"
                :label="data"
                :key="index"
                min-width="200"
                :formatter="formatRupiah"
                sortable
              ></el-table-column>
              <!-- <table-column-action show-view></table-column-action> -->
            </el-table>
            <PaginationView
              :total="item.totalSummary.total_row"
              :page-size="10"
              :current-page="currentPage[idx]"
              @current-change="
                (pgIndex) => {
                  setLoadingTable(idx);
                  currentPage[idx] = pgIndex;
                }
              "
            />
            <div class="w-full flex justify-end items-start">
              <div class="w-full mb-5 border rounded-lg overflow-hidden text-sm">
                <div
                  v-for="(row, index) in [
                    { label: 'Total', value: item.totalSummary.total_nominal_insentif },
                    { label: `Discount (${item.totalSummary.disper}%)`, value: item.totalSummary.discount },
                    { label: 'Claim', value: item.totalSummary.claim },
                    {
                      label: 'Grand Total',
                      value: item.totalSummary.total_nominal_insentif - item.totalSummary.discount,
                    },
                    {
                      label: `Bonus (${item.totalSummary.insenper}%)`,
                      value: Math.round(
                        ((item.totalSummary.total_nominal_insentif ?? 0) - (item.totalSummary.discount ?? 0)) *
                          (Number(String(item.totalSummary.insenper ?? 0).replace('%', '')) / 100),
                      ),
                    },
                  ]"
                  :key="index"
                  class="grid grid-cols-2 px-4 py-2 even:bg-gray-100"
                >
                  <div class="font-medium text-gray-700">
                    {{ row.label }}
                  </div>
                  <div class="text-right font-semibold text-gray-900">
                    {{ convertToTreeDigit(row.value) }}
                  </div>

                  <!-- <pre>{{ item  }}</pre>  -->
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-center text-gray-400 py-6">Tidak ada data</div>
      </div>                
    </div>  
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { labelPosition } from '../../helper/appUtils';
// import API function sesuai kebutuhan untuk hit ke backend
import API from '../../api/apiReport';
import { useStore } from 'vuex';
// import hooks buat insert, edit, pagination, dll
import HOOKS from '../../hooks/bundleOneOps';
import { useRoute, useRouter } from 'vue-router';
import { convertToTreeDigit } from '../../helper/utils';

const { addData, addForm, addDialog, saveAdd, cancelAdd } = HOOKS.useAddOneData();
// const { listData, rowTotal, pageIndex, pageSize, getListData, changeIndex, loading, filterData, search, headers } = HOOKS.useListDataPaginate();
const { viewData, viewDialog, openViewDialog } = HOOKS.useViewOneData();
const [listreport, getReport, loadingGetReport] = HOOKS.useGetData();

const route = useRoute();
const store = useStore();
const router = useRouter();

const selectedCustomer = ref(null);
const loadingPerTable = ref([]);
const currentPage = ref({});

function setLoadingTable(idx) {
  loadingPerTable.value[idx] = true;
  setTimeout(() => {
    loadingPerTable.value[idx] = false;
  }, 200);
}

const accountId = computed(() => store.getters.accountId);
const role = computed(() => store.getters.userRole) || localStorage.getItem('role');
const groupValue = computed(() => store.getters.userGroup) || localStorage.getItem('group');
const date = new Date();

const endDate = new Date(date);
const startDate = new Date(date);
const filterData = ref({});

filterData.value.until = endDate.toISOString().split('T')[0];
startDate.setDate(startDate.getDate() - 7);
filterData.value.since = startDate.toISOString().split('T')[0];
filterData.value.id = accountId.value || localStorage.getItem('id');
filterData.value.role = store.getters.role || localStorage.getItem('role');
filterData.value.group_id = store.getters.groupId || localStorage.getItem('group');

if (route.query.id || route.query.ID_USER) {
  filterData.value.id = route.query.id || route.query.ID_USER;
}

if (route.query.role) {
  filterData.value.role = route.query.role;
}

if (route.query.grup || route.query.group_id) {
  filterData.value.group_id = route.query.grup || route.query.group_id;
}

if (route.query.since) {
  filterData.value.since = route.query.since;
  filterData.value.until = route.query.until;
}

function handleFilterSales(data) {
  filterData.value.id = data.USER_ID;
  filterData.value.role = data.USER_ROLE;
  filterData.value.group_id = data.USER_GROUP_CODE;
  firstload();
}

//reset filter
function resetFilter() {
  filterData.value.id = accountId.value || localStorage.getItem('id');
  filterData.value.role = role.value;
  filterData.value.group_id = groupValue.value;
  firstload();
}

// Function untuk split array jadi per N data
function groupByCustomerWithPagination(data = [], pageSize = 10) {
  const grouped = {};

  for (const item of data) {
    const customer = item.customer || 'UNKNOWN';

    if (!grouped[customer]) {
      grouped[customer] = {
        rawItems: [],
        totalSummary: {
          total_insentif_hasil: 0,
          total_nominal_insentif: 0,
          total_pph: 0,
          total_row: 0,
          nominal_ongkir: 0,
          discount: 0,
          claim: 0,
          disper: 0,
          insenper: 0,
        },
        pages: [],
      };
    }

    grouped[customer].rawItems.push(item);

    // 🔹 hitung total summary semua data customer
    //     Nominal Ongkir
    // Discount
    // Claim
    // Nominal Dihitung Insentif
    // Insentif %
    // total_insentif_hasil

    grouped[customer].totalSummary.total_insentif_hasil += Number(item.total_insentif_hasil || 0);
    grouped[customer].totalSummary.nominal_ongkir += Number(item['Nominal Ongkir'] || 0);
    // grouped[customer].totalSummary.discount += Number(item['Discount'] || 0);
    grouped[customer].totalSummary.discount += Number(item.nominalDiscount || 0);
    grouped[customer].totalSummary.claim += Number(item['Claim'] || 0);
    grouped[customer].totalSummary.total_nominal_insentif += Number(item['Nominal Dihitung Insentif'] || 0);
    grouped[customer].totalSummary.total_pph += Number(item.PPH || 0);
    grouped[customer].totalSummary.total_row += 1;
    grouped[customer].totalSummary.disper = Number(item['Discount'] || 0);
    grouped[customer].totalSummary.insenper = Number(item['Insentif %'] || 0);
  }

  // 🔹 split per customer
  Object.keys(grouped).forEach((customer) => {
    const items = grouped[customer].rawItems;

    for (let i = 0; i < items.length; i += pageSize) {
      const chunk = items.slice(i, i + pageSize);

      const pageSummary = chunk.reduce(
        (acc, item) => {
          acc.total_insentif_hasil += Number(item.total_insentif_hasil || 0);
          acc.nominal_ongkir += Number(item['Nominal Ongkir'] || 0);
          // acc.discount += Number(item['Discount'] || 0);
          acc.discount = Number(item.nominalDiscount || 0);
          acc.claim += Number(item['Claim'] || 0);
          acc.total_nominal_insentif += Number(item['Nominal Dihitung Insentif'] || 0);
          acc.total_pph += Number(item.PPH || 0);
          acc.total_row += 1;
          return acc;
        },
        {
          total_insentif_hasil: 0,
          total_nominal_insentif: 0,
          discount: 0,
          claim: 0,
          nominal_ongkir: 0,
          total_pph: 0,
          total_row: 0,
        },
      );

      grouped[customer].pages.push({
        items: chunk,
        summary: pageSummary,
      });
    }

    delete grouped[customer].rawItems; // bersihkan supaya lebih clean
  });

  // // console.log(grouped);

  return grouped;
}

// // console.log(filterData.value);

//get data
// function doPaginate(index = 1, pSize) {
//   getListData(API.getDataInsentif, index, pSize || pageSize.value, search.value, filterData.value);
// }

// function changePage(index) {
//   changeIndex(() => doPaginate(index), index);
// }

// function onPaginate(pageSize) {
//   changeIndex(() => doPaginate(1, pageSize), 1, pageSize);
// }

// function onFilterSearch() {
//   changeIndex(() => doPaginate(), pageIndex.value, null, filterData.value);
// }

const groupedData = ref({});
const tableHeader = ref([]);

function firstload() {
  // doPaginate(pageIndex.value);
  router.push({ name: route.name, query: filterData.value });
  getReport(
    () => API.getDataInsentifForReport(filterData.value),
    true,
    true,
    (v) => {
      groupedData.value = groupByCustomerWithPagination(v?.body, 10);
      currentPage.value = Object.keys(groupedData.value).map(() => 1);
      tableHeader.value = [];
      v?.head.forEach((item) => {
        if (
          item !== 'Discount' &&
          item != 'Claim' &&
          item != 'total_insentif_hasil' &&
          item !== 'Insentif %' &&
          item !== 'termuda' &&
          item !== 'nominalDiscount'
        ) {
          tableHeader.value.push(item);
        }
      });
    },
  );
}

const getSummaries = ({ columns, data }) => {
  if (!Array.isArray(data)) return [];

  const sums = [];

  const numericColumns = ['Nominal Ongkir', 'PPH', 'Nominal Dihitung Insentif', 'total_insentif_hasil'];

  columns.forEach((column, index) => {
    if (index === 0) {
      sums[index] = 'TOTAL';
      return;
    }

    if (!numericColumns.includes(column.property)) {
      sums[index] = '';
      return;
    }

    const total = data.reduce((sum, row) => {
      let value = row?.[column.property];

      if (typeof value === 'string') {
        value = value.replace(/[^\d-]/g, '');
      }

      value = Number(value);
      return isNaN(value) ? sum : sum + value;
    }, 0);

    sums[index] = `Rp ${total.toLocaleString('id-ID')}`;
  });

  return sums;
};

const formatRupiah = (row, column, cellValue) => {
  if (cellValue === null || cellValue === undefined) return '';

  // hanya format jika number
  if (typeof cellValue === 'number') {
    return new Intl.NumberFormat('id-ID').format(cellValue);
  }

  return cellValue;
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
