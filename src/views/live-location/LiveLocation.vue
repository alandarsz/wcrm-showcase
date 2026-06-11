<template>
  <div class="live-location-page">
    <title-dashboard></title-dashboard>
    <!-- ================= MAP SECTION ================= -->
    <div>
      <el-form :model="addData" ref="addForm">
        <div class="leaflet-wrapper">
          <leaflet-mark
            v-model:lat="addData.LIVE_LOCATION_LATITUDE"
            v-model:long="addData.LIVE_LOCATION_LONGITUDE"
            v-model:address="addData.LIVE_LOCATION_ADDRESS"
            v-model:polyline="liveState.LIVE_LOCATION_STATE_LAST_COORDS"
            :readonly="liveState.LIVE_LOCATION_STATE_LAST_STATUS !== 'CHECK_IN'"
          />
        </div>

        <!-- ACTION BUTTON -->
        <div class="md:flex justify-between items-center md:space-x-2" v-loading="loadingGetLiveState">
          <!-- ================= STATUS ================= -->
          <el-alert class="mt-4" :title="statusText" :type="statusType" show-icon :closable="false" />
          <el-button
            v-if="liveState.LIVE_LOCATION_STATE_STATUS === 'CHECK_IN'"
            type="primary"
            size="large"
            @click="onCheckIn"
            :loading="loadingCheck"
          >
            Mulai Live Location (Check In)
          </el-button>

          <el-button
            v-if="
              (liveState.LIVE_LOCATION_STATE_STATUS === 'CHECK_OUT' || liveState.LIVE_LOCATION_STATE_LAST_STATUS === 'TRACKING') &&
              (liveState.LIVE_LOCATION_STATE_LAST_STATUS === 'TRACKING' || liveState.LIVE_LOCATION_STATE_LAST_STATUS === 'CHECK_IN')
            "
            type="danger"
            size="large"
            @click="onConfirmCheckout"
            block
            :loading="loadingCheck"
          >
            Akhiri Live Location (Check Out)
          </el-button>
        </div>
      </el-form>
    </div>

    <!-- ================= HISTORY ================= -->
    <div class="mt-6">
      <title-dashboard title="Riwayat"></title-dashboard>
      <el-form :model="filterData" :label-position="labelPosition()" label-width="150px">
        <div class="w-full grid md:grid-cols-2 grid-cols-1 gap-4 border rounded p-2 bg-gray-100">
          <div>
            <el-form-item label="Periode" prop="DATE_START">
              <el-date-range-input v-model:startDate="filterData.START_DATE" v-model:endDate="filterData.END_DATE"></el-date-range-input>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="Sales" prop="USER_ID" v-if="['ADM', 'SLSM'].includes(role)">
              <el-inferior-input
                v-model="filterData.USER_ID"
                :user-id="accountId"
                :group-id="groupValue"
                :role="role"
                @handle-change="handleFilterSales"
                @clear="resetFilter"
              />
            </el-form-item>
            <div class="w-full flex justify-end items-center">
              <el-button type="primary" @click="onFilterSearch">Filter</el-button>
            </div>
          </div>
        </div>
      </el-form>
      <SearchAndPaginate @search="onSearch" @paginate="onPaginate" />
      <div class="min-h-[250px]" v-loading="loading">
        <cards-history :locations="listData" v-if="!loading" />
      </div>
      <PaginationView :total="rowTotal" :page-size="pageSize" :current-page="pageIndex" @current-change="changePage" />
    </div>
    <el-dialog
      v-model="addDialog"
      title="Checkout Live Location"
      :width="dialogWidth()"
      class="responsive-dialog"
      :before-close="onCancelConfirmCheckout"
      destroy-on-close
    >
      <el-form :model="addData" ref="addForm" :label-position="labelPosition()" label-width="150px">
        <el-form-item
          label="Lampiran Foto"
          prop="liveLocationPhoto"
          :rules="[{ required: true, message: 'Wajib melampirkan foto dengan customer/klien!', trigger: 'blur' }]"
        >
          <upload-file-with-camera v-model="addData.liveLocationPhoto"></upload-file-with-camera>
        </el-form-item>
      </el-form>
      <template #footer>
        <footer-button-dialog :disable-save="loadingCheck" @save-click="onCheckOut" @cancel-click="cancelAdd"></footer-button-dialog>
      </template>
    </el-dialog>
    <allow-location-check></allow-location-check>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue';
import HOOKS from '../../hooks/bundleOneOps';
import API from '../../api/apiLiveLocation';
import { useStore } from 'vuex';
import { getAddress } from '../../helper/utils';
import { useRoute } from 'vue-router';
import { labelPosition, dialogWidth } from '../../helper/appUtils';

import CardsHistory from './components/CardsHistory.vue';

const { addData, addForm, addDialog, saveAdd, cancelAdd } = HOOKS.useAddOneData();
const [liveState, getLiveState, loadingGetLiveState] = HOOKS.useGetData();
const { listData, rowTotal, pageIndex, pageSize, getListData, changeIndex, loading, filterData, search, headers } = HOOKS.useListDataPaginate();

const store = useStore();
const route = useRoute();
const accountId = computed(() => store.getters.accountId);
const role = computed(() => store.getters.userRole) || localStorage.getItem('role');
const groupValue = computed(() => store.getters.userGroup) || localStorage.getItem('group');
const date = new Date();
const endDate = new Date(date);
const startDate = new Date(date);
filterData.value.END_DATE = endDate.toISOString().split('T')[0];
startDate.setDate(startDate.getDate() - 7);
filterData.value.START_DATE = startDate.toISOString().split('T')[0];

filterData.value.SUPERIOR_USER_ID = accountId.value || localStorage.getItem('id');
filterData.value.USER_ID = accountId.value || localStorage.getItem('id');
filterData.value.ROLE = role.value || localStorage.getItem('role');
filterData.value.GROUP_ID = groupValue.value || localStorage.getItem('group');
const loadingCheck = ref(false);
let trackingInterval;

if (route.query.USER_ID) {
  filterData.value.USER_ID = route.query.USER_ID;
}

if (route.query.START_DATE) {
  filterData.value.START_DATE = route.query.START_DATE;
  filterData.value.END_DATE = route.query.END_DATE;
}

function handleFilterSales(data) {
  filterData.value.USER_ID = data.USER_ID;
  filterData.value.ROLE = data.USER_ROLE;
  filterData.value.GROUP_ID = data.USER_GROUP_CODE;
  onFilterSearch();
  // // console.log(data );
  // // console.log(filterData.value)
}

/* ================= STATUS TEXT ================= */

const statusText = computed(() => {
  if (liveState.value.LIVE_LOCATION_STATE_STATUS === 'CHECK_IN') return 'Belum melakukan Check In';
  if (liveState.value.LIVE_LOCATION_STATE_STATUS === 'CHECK_OUT' && liveState.value.LIVE_LOCATION_STATE_LAST_STATUS === 'TRACKING')
    return 'Live Location sedang berjalan';
  return 'Live Location telah dilakukan';
});

const statusType = computed(() => {
  if (liveState.value.LIVE_LOCATION_STATE_STATUS === 'TRACKING') return 'success';
  if (liveState.value.LIVE_LOCATION_STATE_STATUS === 'CHECK_OUT') return 'info';
  return 'warning';
});

/* ================= GPS ================= */

function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition((pos) => resolve(pos.coords), reject, { enableHighAccuracy: true });
  });
}

/* ================= ACTIONS ================= */

function onGetLiveState() {
  getLiveState(API.apiGetLiveLocationState, true, true, (data) => {
    if (
      (data.LIVE_LOCATION_STATE_STATUS == 'CHECK_OUT' && data.LIVE_LOCATION_STATE_LAST_STATUS == 'TRACKING') ||
      (data.LIVE_LOCATION_STATE_STATUS == 'TRACKING' && data.LIVE_LOCATION_STATE_LAST_STATUS == 'CHECK_IN')
    ) {
      startLiveTracking();
    }

    if (data.LIVE_LOCATION_STATE_LAST_STATUS === 'CHECK_OUT' && data.LIVE_LOCATION_STATE_STATUS === 'CHECK_IN') {
      stopLiveTracking();
    }
  });
}

async function onSetAddressDisplay(coords) {
  const address = await getAddress(coords);
  addData.value.LIVE_LOCATION_ADDRESS = address?.[0]?.display_name;
}

async function onCheckIn() {
  loadingCheck.value = true;
  const coords = await getCurrentLocation();

  addData.value.LIVE_LOCATION_LATITUDE = coords.latitude;
  addData.value.LIVE_LOCATION_LONGITUDE = coords.longitude;
  addData.value.LIVE_LOCATION_CHECK_STAGE = 'CHECK_IN';
  addData.value.LIVE_LOCATION_CHECK_DATETIME = new Date().toISOString();
  addData.value.LIVE_LOCATION_REMARKS = 'Check in live location';
  await onSetAddressDisplay(coords);

  saveAdd((res) => {
    onGetLiveState();
    startLiveTracking();
    loadingCheck.value = false;
  }, API.apiLiveLocationInsertUpdate);
}

function startLiveTracking() {
  if (trackingInterval) return;
  trackingInterval = setInterval(async () => {
    const coords = await getCurrentLocation();

    addData.value.LIVE_LOCATION_LATITUDE = coords.latitude;
    addData.value.LIVE_LOCATION_LONGITUDE = coords.longitude;
    addData.value.LIVE_LOCATION_CHECK_STAGE = 'TRACKING';
    addData.value.LIVE_LOCATION_CHECK_DATETIME = new Date().toISOString();
    addData.value.LIVE_LOCATION_REMARKS = 'Tracking live location';

    await onSetAddressDisplay(coords);

    saveAdd(() => onGetLiveState(), API.apiLiveLocationInsertUpdate);
  }, 15000);
}

function continueLiveLocation() {
  startLiveTracking();
}

async function stopLiveTracking() {
  if (!trackingInterval) return;
  clearInterval(trackingInterval);
  trackingInterval = null;
}

async function onConfirmCheckout() {
  addDialog.value = true;
  await stopLiveTracking();
}

async function onCancelConfirmCheckout() {
  continueLiveLocation();
}

async function onCheckOut() {
  loadingCheck.value = true;
  await stopLiveTracking();

  const coords = await getCurrentLocation();

  addData.value.LIVE_LOCATION_LATITUDE = coords.latitude;
  addData.value.LIVE_LOCATION_LONGITUDE = coords.longitude;
  addData.value.LIVE_LOCATION_CHECK_STAGE = 'CHECK_OUT';
  addData.value.LIVE_LOCATION_CHECK_DATETIME = new Date().toISOString();
  addData.value.LIVE_LOCATION_REMARKS = 'Check out live location';

  await onSetAddressDisplay(coords);

  saveAdd((res) => {
    onGetLiveState();
    firstload();
    loadingCheck.value = false;
  }, API.apiLiveLocationInsertUpdate);
}

// PAGINATION
function doPaginate(index = 1, pSize) {
  getListData(API.apiGetLiveLocationForPagination, index, pSize || pageSize.value, search.value, filterData.value);
}

function onFilterSearch() {
  changeIndex(() => doPaginate(), pageIndex.value, null, filterData.value);
}

function onSearch(textSearch) {
  search.value = textSearch;
  changePage();
}

function onPaginate(pageSize) {
  changeIndex(() => doPaginate(1, pageSize), 1, pageSize);
}

function changePage(index = 1) {
  changeIndex(() => doPaginate(index), index);
}

function firstload() {
  doPaginate(pageIndex.value);
}

onGetLiveState();

function resetFilter() {
  filterData.value.USER_ID = null;
  filterData.value.ROLE = role.value;
  filterData.value.GROUP_ID = groupValue.value;
  onFilterSearch();
}

/* ================= CLEANUP ================= */

onUnmounted(() => {
  stopLiveTracking();
});
firstload();
</script>

<style scoped>
.live-location-page {
  padding: 12px;
}

.map-wrapper {
  height: 60vh;
  border-radius: 12px;
}

.map {
  height: 100%;
  width: 100%;
}

.map-action {
  bottom: 12px;
  left: 12px;
  right: 12px;
}
/* container utama map */
.leaflet-wrapper {
  position: relative;
  z-index: 1;
}

/* canvas / tiles map */
.leaflet-container {
  z-index: 1 !important;
}

/* layer-layer leaflet */
.leaflet-pane,
.leaflet-tile-pane,
.leaflet-overlay-pane,
.leaflet-shadow-pane,
.leaflet-marker-pane,
.leaflet-tooltip-pane,
.leaflet-popup-pane {
  z-index: 1 !important;
}
</style>
