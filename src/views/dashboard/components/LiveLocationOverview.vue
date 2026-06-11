<template>
  <div>
    <el-form :model="filterData" ref="filterForm" :label-position="labelPosition()" label-width="150px">
      <div class="w-full grid md:grid-cols-2 grid-cols-1 gap-4 p-2 border rounded bg-gray-200 mt-4">
        <div>
          <el-form-item label="Periode" prop="START_DATE">
            <el-date-range-input v-model:startDate="filterData.START_DATE" v-model:endDate="filterData.END_DATE"></el-date-range-input>
          </el-form-item>
        </div>
        <div>
          <el-form-item v-if="['ADM', 'SLSM'].includes(role)" class="mb-0 shrink-0">
            <el-inferior-input
              v-model="filterData.USER_ID"
              :user-id="accountId"
              :group-id="groupValue"
              :role="role"
              @clear="resetFilter"
              @handle-change="handleFilter"
            />
          </el-form-item>
          <div class="w-full flex justify-end items-center">
            <el-button type="primary" @click="onFilterSearch">Filter</el-button>
          </div>
        </div>
      </div>
    </el-form>
    <div>
      <el-alert type="error" v-if="data?.body?.length < 1">Data tidak ditemukan</el-alert>
    </div>
    <div v-loading="loading">
      <leaflet-mark-overview :location-data="data?.body || []"></leaflet-mark-overview>
    </div>
  </div>
</template>
<script setup>
import { apiGetLiveLocationOverviewById } from '../../../api/apiLiveLocation';
import HOOKS from '../../../hooks/bundleOneOps';
import { useStore } from 'vuex';
import { computed, ref } from 'vue';
import { labelPosition } from '../../../helper/appUtils';
import { isValElForm } from '../../../helper/utils';

const filterForm = ref(null);
const filterData = ref({});
const date = new Date();
const endDate = new Date(date);
const startDate = new Date(date);
startDate.setDate(startDate.getDate() - 0);
const store = useStore();
const accountId = computed(() => store.getters.accountId || localStorage.getItem('id'));
const [data, getData, loading] = HOOKS.useGetData();
const role = computed(() => store.getters.userRole) || localStorage.getItem('role');
const groupValue = computed(() => store.getters.userGroup);
filterData.value.USER_ID = accountId.value || localStorage.getItem('id');
filterData.value.ROLE = role.value;
filterData.value.GROUP_ID = groupValue.value || localStorage.getItem('group');
filterData.value.START_DATE = startDate.toISOString().split('T')[0];
filterData.value.END_DATE = endDate.toISOString().split('T')[0];

// // console.log(filterData.value);
function handleFilter(data) {
  filterData.value.USER_ID = data.USER_ID;
  filterData.value.ROLE = data.USER_ROLE;
  filterData.value.GROUP_ID = data.USER_GROUP_CODE;
  filterData.value.START_DATE = startDate.toISOString().split('T')[0];
  filterData.value.END_DATE = endDate.toISOString().split('T')[0];

  // // console.log(filterData.value);
  firstLoad();
}

function firstLoad() {
  const payload = {
    ...filterData.value,
  };

  getData(() => apiGetLiveLocationOverviewById(payload), true, true);
}

async function onFilterSearch() {
  const resultVal = await isValElForm(filterForm.value);
  if (!resultVal) return;
  firstLoad();
}

//reset filter
function resetFilter() {
  filterData.value.USER_ID = accountId.value || localStorage.getItem('id');
  filterData.value.ROLE = role.value;
  filterData.value.GROUP_ID = groupValue.value;
  applyFilter();
}

firstLoad();
</script>
