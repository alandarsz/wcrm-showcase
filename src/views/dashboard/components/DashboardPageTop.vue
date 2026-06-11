<template>
  <div class="min-h-screen">
    <div>
      <div class="mt-6">
        <div class="w-full bg-slate-50 border border-slate-100 py-4 mb-6 rounded-2xl shadow-sm">
          <h4 class="text-sm font-bold text-slate-600 text-center uppercase tracking-[0.2em]">Status Follow Up TOP</h4>
        </div>
        <div class="flex flex-col gap-3 mb-4 md:flex-row md:items-center md:gap-3 md:flex-nowrap">
          <el-form :model="statusCountFilter" class="flex flex-col gap-2 w-full md:flex-row md:items-center md:gap-2 md:flex-nowrap">
            <el-form-item v-if="['ADM', 'SLSM'].includes(role)" prop="ID_USER" class="mb-0 md:w-[280px] shrink-0">
              <el-inferior-input
                v-model="statusCountFilter.user_id"
                :user-id="accountId"
                :group-id="groupValue"
                :role="role"
                @clear="onClearSalesFollowUp"
                @handle-change="handleFilterCount"
              />
            </el-form-item>
            <div class="hidden md:block md:ml-auto"></div>
            <el-form-item class="mb-0 shrink-0">
              <el-date-picker
                v-model="statusCountFilter.since"
                type="date"
                size="small"
                placeholder="Start Date"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                class="date-mini"
              />
            </el-form-item>
            <el-form-item class="mb-0 shrink-0">
              <el-date-picker
                v-model="statusCountFilter.until"
                type="date"
                size="small"
                placeholder="End Date"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                class="date-mini"
              />
            </el-form-item>
            <el-button type="primary" class="whitespace-nowrap shrink-0" @click="onApplyFilterStatus"> Filter </el-button>
          </el-form>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <router-link
            :to="{
              path: '/top-deals/follow-up-top',
              query: {
                ...statusCountFilter,
                status: 'TOP-PROSES',
              },
            }"
            class="block"
          >
            <div
              class="flex items-center justify-between p-4 bg-white rounded-xl shadow border-l-4 border-blue-500 cursor-pointer hover:bg-blue-50 transition"
            >
              <div class="flex items-center space-x-3">
                <div class="p-2 bg-blue-100 rounded-full">
                  <el-icon class="text-indigo-600" :size="24">
                    <Clock />
                  </el-icon>
                </div>
                <div>
                  <p class="text-sm font-semibold text-gray-700">Proses</p>
                  <p class="text-xs text-gray-500">Proses awal follow up</p>
                </div>
              </div>

              <div class="flex items-center space-x-3">
                <span class="text-lg font-semibold text-blue-600">
                  <template v-if="loadingGetFollowState">...</template>
                  <template v-else>{{ statusProses }}</template>
                </span>
                <el-icon class="text-blue-500" :size="20">
                  <ArrowRight />
                </el-icon>
              </div>
            </div>
          </router-link>

          <router-link
            :to="{
              path: '/top-deals/follow-up-top',
              query: {
                ...statusCountFilter,
                status: 'TOP-BELUM MINAT',
                // status_approval : 'null',
              },
            }"
            class="block"
          >
            <div
              class="flex items-center justify-between p-4 bg-white rounded-xl shadow border-l-4 border-orange-500 cursor-pointer hover:bg-orange-50 transition"
            >
              <div class="flex items-center space-x-3">
                <div class="p-2 bg-orange-100 rounded-full">
                  <el-icon class="text-orange-500" :size="24">
                    <CircleClose />
                  </el-icon>
                </div>
                <div>
                  <p class="text-sm font-semibold text-gray-700">Belum Minat</p>
                  <p class="text-xs text-gray-500">Proses tidak lanjut</p>
                </div>
              </div>

              <div class="flex items-center space-x-3">
                <span class="text-lg font-semibold text-orange-600">
                  <template v-if="loadingGetFollowState">...</template>
                  <template v-else>{{ statusBelumMinat }}</template>
                </span>
                <el-icon class="text-orange-500" :size="20">
                  <ArrowRight />
                </el-icon>
              </div>
            </div>
          </router-link>

          <router-link
            :to="{
              path: '/top-deals/follow-up-top',
              query: {
                ...statusCountFilter,
                status: 'TOP-PROSES LANJUT'
              },
            }"
            class="block sm:col-span-2"
          >
            <div
              class="w-full flex items-center justify-between p-4 bg-white rounded-xl shadow border-l-4 border-green-500 cursor-pointer hover:bg-green-50 transition sm:col-span-2"
            >
              <div class="flex items-center space-x-3">
                <div class="p-2 bg-green-100 rounded-full">
                  <el-icon class="text-green-500" :size="24">
                    <CircleCheck />
                  </el-icon>
                </div>
                <div>
                  <p class="text-sm font-semibold text-gray-700">Proses Lanjut</p>
                  <p class="text-xs text-gray-500">Pengajuan TOP Proses Lanjut</p>
                </div>
              </div>

              <div class="flex items-center space-x-3">
                <span class="text-lg font-semibold text-green-600">
                  <template v-if="loadingGetFollowState">...</template>
                  <template v-else>{{ StatusApproved }}</template>
                </span>
                <el-icon class="text-green-500" :size="20">
                  <ArrowRight />
                </el-icon>
              </div>
            </div>
          </router-link>
        </div>
      </div>
      <div class="w-full bg-slate-50 border border-slate-100 py-4 my-6 rounded-2xl shadow-sm">
        <h4 class="text-sm font-bold text-slate-600 text-center uppercase tracking-[0.2em]">Total Data</h4>
      </div>
      <div :class="['grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 mb-4', ['ADM', 'SLSM'].includes(role) ? 'lg:grid-cols-3' : 'lg:grid-cols-3']">
        <router-link
          :to="{
            path: '/top-deals/new-lead-top',
            query: statusCountFilter,
          }"
          class="block"
        >
          <div
            class="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border-l-4 border-indigo-500 cursor-pointer hover:bg-indigo-50 transition-all group"
          >
            <div class="flex items-center space-x-3">
              <div class="p-2.5 bg-indigo-100 rounded-full group-hover:bg-indigo-200 transition">
                <el-icon class="text-indigo-600" :size="22">
                  <Shop />
                </el-icon>
              </div>
              <div>
                <p class="text-sm font-bold text-gray-700">Total TOP Leads</p>
                <p class="text-[11px] text-gray-500">Aktivitas hari ini</p>
              </div>
            </div>
            <span class="text-xl font-bold text-indigo-600">
              <template v-if="loadingGetLeadState">...</template>
              <template v-else>{{ totalLeads }}</template>
            </span>
          </div>
        </router-link>

        <router-link
          :to="{
            path: '/contact-list',
            query: statusCountFilter,
          }"
          class="block"
        >
          <div
            class="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border-l-4 border-green-500 cursor-pointer hover:bg-green-50 transition-all group"
          >
            <div class="flex items-center space-x-3">
              <div class="p-2.5 bg-green-100 rounded-full group-hover:bg-green-200 transition">
                <el-icon class="text-green-600" :size="22">
                  <User />
                </el-icon>
              </div>
              <div>
                <p class="text-sm font-bold text-gray-700">Total Contact</p>
                <p class="text-[11px] text-gray-500">Update hari ini</p>
              </div>
            </div>
            <span class="text-xl font-bold text-green-600">
              <template v-if="loadingGetContactState">...</template>
              <template v-else>{{ totalContacts }}</template>
            </span>
          </div>
        </router-link>
        <router-link
          :to="{
            path: '/team',
          }"
          class="block"
          v-if="['ADM', 'SLSM'].includes(role)"
        >
          <div
            class="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border-l-4 border-blue-900 cursor-pointer hover:bg-blue-50 transition-all group"
          >
            <div class="flex items-center space-x-3">
              <div class="p-2.5 bg-blue-100 rounded-full group-hover:bg-blue-200 transition">
                <el-icon class="text-blue-600" :size="22">
                  <PriceTag />
                </el-icon>
              </div>
              <div>
                <p class="text-sm font-bold text-gray-700">Total Sales</p>
                <p class="text-[11px] text-gray-500">Total Sales yang aktif</p>
              </div>
            </div>
            <span class="text-xl font-bold text-blue-600">
              <template v-if="loadingGetSalesState">...</template>
              <template v-else>{{ salesCount }}</template>
            </span>
          </div>
        </router-link>
      </div>

      <div class="lg:col-span-2 bg-white p-2 rounded-xl">
        <div class="w-full bg-slate-50 border border-slate-100 py-4 my-6 rounded-2xl shadow-sm">
          <h4 class="text-sm font-bold text-slate-600 text-center uppercase tracking-[0.2em]">Pencapaian Akusisi</h4>
        </div>
        <div>
          <!-- closing per sales -->
          <div class="bg-white rounded-xl">
            <div class="flex flex-col gap-3 mb-4 md:flex-row md:items-center md:gap-3 md:flex-nowrap">
              <el-form :model="filterData" class="flex flex-col gap-2 w-full md:flex-row md:items-center md:gap-2 md:flex-nowrap">
                <el-form-item v-if="['ADM', 'SLSM'].includes(role)" prop="ID_USER" class="mb-0 md:w-[280px] shrink-0">
                  <el-inferior-input
                    v-model="filterData.ID_USER"
                    :user-id="accountId"
                    :group-id="groupValue"
                    :role="role"
                    @clear="onClearClosing"
                    @handle-change="handleFilterClosing"
                  />
                </el-form-item>
                <div class="hidden md:block md:ml-auto"></div>
                <el-form-item class="mb-0 shrink-0">
                  <el-date-picker
                    v-model="filterData.since"
                    type="date"
                    size="small"
                    placeholder="Start Date"
                    format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD"
                    class="date-mini"
                  />
                </el-form-item>
                <el-form-item class="mb-0 shrink-0">
                  <el-date-picker
                    v-model="filterData.until"
                    type="date"
                    size="small"
                    placeholder="End Date"
                    format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD"
                    class="date-mini"
                  />
                </el-form-item>
                <el-button type="primary" class="whitespace-nowrap shrink-0" @click="onApplyFilter"> Filter </el-button>
              </el-form>
            </div>
            <chart-loading v-if="loadingGetTargetPercentage" />
            <template v-else>
              <vue-apex-charts
                v-if="closingBySales"
                ref="closingChart"
                type="bar"
                height="350"
                :options="closingBySales.chartOptions"
                :series="closingBySales.series"
              />
            </template>
          </div>
        </div>

        <p class="mt-4 text-sm font-medium text-gray-500 flex items-center gap-2">
          <span class="w-1 h-4 bg-amber-400 rounded-full"></span>
          Visualisasi ini membandingkan realisasi pencapaian Closing terhadap target yang telah ditetapkan.
        </p>
      </div>

      <section class="grid grid-cols-1 gap-6 mb-4">
        <div class="lg:col-span-2 bg-white p-2 rounded-xl">
          <div class="w-full bg-slate-50 border border-slate-100 py-4 my-6 rounded-2xl shadow-sm">
            <h4 class="text-sm font-bold text-slate-600 text-center uppercase tracking-[0.2em]">Pencapaian Omset</h4>
          </div>
          <div class="flex flex-col gap-3 mb-4 md:flex-row md:items-center md:gap-3 md:flex-nowrap">
            <el-form :model="omsetFilter" class="flex flex-col gap-2 w-full md:flex-row md:items-center md:gap-2 md:flex-nowrap">
              <el-form-item v-if="['ADM', 'SLSM'].includes(role)" prop="ID_USER" class="mb-0 md:w-[280px] shrink-0">
                <el-inferior-input
                  v-model="omsetFilter.ID_USER"
                  :user-id="accountId"
                  :group-id="groupValue"
                  :role="role"
                  @clear="onClearOmset"
                  @handle-change="handleFilteromset"
                />
              </el-form-item>
              <div class="hidden md:block md:ml-auto"></div>
              <el-form-item class="mb-0 shrink-0">
                <el-date-picker
                  v-model="omsetFilter.since"
                  type="date"
                  size="small"
                  placeholder="Start Date"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  class="date-mini"
                />
              </el-form-item>
              <el-form-item class="mb-0 shrink-0">
                <el-date-picker
                  v-model="omsetFilter.until"
                  type="date"
                  size="small"
                  placeholder="End Date"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  class="date-mini"
                />
              </el-form-item>
              <el-button type="primary" class="whitespace-nowrap shrink-0" @click="onApplyFilterOMset"> Filter </el-button>
            </el-form>
          </div>
          <div>
            <div class="bg-white rounded-xl">
              <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                <h3 class="text-lg font-semibold text-gray-700">Omset per Periode</h3>
              </div>
              <chart-loading v-if="loadingGetOmzetPercentage" />

              <template v-else>
                <vue-apex-charts
                  v-if="dataOmsetBySales"
                  type="bar"
                  height="350"
                  :options="dataOmsetBySales.chartOptions"
                  :series="dataOmsetBySales.series"
                />
              </template>
            </div>
          </div>

          <p class="mt-4 text-sm font-medium text-gray-500 flex items-center gap-2">
            <span class="w-1 h-4 bg-amber-400 rounded-full"></span>
            Visualisasi ini membandingkan realisasi pencapaian Omset terhadap target yang telah ditetapkan.
          </p>
        </div>
      </section>

      <!-- insentif -->
      <div class="w-full bg-slate-50 border border-slate-100 py-4 my-6 rounded-2xl shadow-sm">
        <h4 class="text-sm font-bold text-slate-600 text-center uppercase tracking-[0.2em]">Insentif Anda</h4>
      </div>

      <div class="flex flex-col gap-3 mb-4 md:flex-row md:items-center md:gap-3 md:flex-nowrap">
        <el-form :model="insentifFilter" class="flex flex-col gap-2 w-full md:flex-row md:items-center md:gap-2 md:flex-nowrap">
          <el-form-item v-if="['ADM', 'SLSM'].includes(role)" prop="ID_USER" class="mb-0 md:w-[280px] shrink-0">
            <el-inferior-input
              v-model="insentifFilter.ID_USER"
              :user-id="accountId"
              :group-id="groupValue"
              :role="role"
              @clear="onClearSalesInsentif"
              @handle-change="handleInsentif"
            />
          </el-form-item>
          <div class="hidden md:block md:ml-auto"></div>
          <el-form-item class="mb-0 shrink-0">
            <el-date-picker
              v-model="insentifFilter.since"
              type="date"
              size="small"
              placeholder="Start Date"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              class="date-mini"
            />
          </el-form-item>
          <el-form-item class="mb-0 shrink-0">
            <el-date-picker
              v-model="insentifFilter.until"
              type="date"
              size="small"
              placeholder="End Date"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              class="date-mini"
            />
          </el-form-item>
          <el-button type="primary" class="whitespace-nowrap shrink-0" @click="onApplyFilterIntensif"> Filter </el-button>
        </el-form>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2 mb-4">
        <router-link
          :to="{
            path: '/report/insentif',
            query: insentifFilter,
          }"
          class="block"
        >
          <div class="p-4 bg-white rounded-xl shadow-sm border-l-4 border-blue-500 transition-all hover:shadow-md">
            <div class="flex items-start space-x-3">
              <div class="p-2.5 bg-blue-100 rounded-lg text-blue-600">
                <el-icon :size="24"><Money /></el-icon>
              </div>
              <div class="flex flex-col">
                <p class="text-xs font-bold text-gray-500 uppercase tracking-wide">Bonus Omset</p>
                <span class="text-xl font-extrabold text-gray-800 mt-1">
                  <template v-if="loadingInsentifState">...</template>
                  <template v-else>{{ bonusOmset }}</template>
                </span>
                <p class="text-[10px] text-gray-400 mt-1">Sudah Dipotong PPH</p>
              </div>
            </div>
          </div>
        </router-link>
        <router-link
          :to="{
            path: '/report/insentif-trucking',
            query: insentifFilter,
          }"
          class="block"
        >
          <div class="p-4 rounded-xl shadow-sm border-l-4 border-emerald-500 transition-all hover:shadow-md">
            <div class="flex items-start space-x-3">
              <div class="p-2.5 bg-emerald-100 rounded-lg text-emerald-600">
                <el-icon :size="24"><Wallet /></el-icon>
              </div>
              <div class="flex flex-col">
                <p class="text-xs font-bold text-emerald-700 uppercase tracking-wide">Bonus Akuisisi</p>
                <span class="text-2xl font-black text-emerald-600 mt-1">
                  <template v-if="loadingInsentifState">...</template>
                  <template v-else>{{ bonusAkusisi }}</template>
                </span>
                <p class="text-[10px] text-emerald-500 mt-1 font-medium">Sudah Dipotong PPH</p>
              </div>
            </div>
          </div>
        </router-link>
        <router-link
          :to="{
            path: '/report/insentif-trucking',
            query: insentifFilter,
          }"
          class="block"
        >
          <div class="p-4 rounded-xl shadow-sm border-l-4 border-yellow-500 transition-all hover:shadow-md">
            <div class="flex items-start space-x-3">
              <div class="p-2.5 bg-yellow-100 rounded-lg text-yellow-600">
                <el-icon :size="24"><WalletFilled /></el-icon>
              </div>
              <div class="flex flex-col">
                <p class="text-xs font-bold text-yellow-700 uppercase tracking-wide">Bonus Akuisisi Agen</p>
                <span class="text-2xl font-black text-yellow-600 mt-1">
                  <template v-if="loadingBonusAkusisiAgenTop">...</template>
                  <template v-else>{{ bonusAkusisiAgenTop }}</template>
                </span>
                <p class="text-[10px] text-yellow-500 mt-1 font-medium">Sudah Dipotong PPH</p>
              </div>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { dateFormatFull, convertRp } from '../../../helper/utils';
import { useStore } from 'vuex';
import { computed, ref, onMounted, watch, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import API from '../../../api/apiCount';
import HOOKS from '../../addOneRedirect../../../hooks/bundleOneOps';
import VueApexCharts from 'vue3-apexcharts';
import MenuSummary from './MenuSummary.vue';
import LiveLocationOverview from './LiveLocationOverview.vue';
import {
  User,
  Clock,
  CircleClose,
  Warning,
  CircleCheck,
  PriceTag,
  Shop,
  WalletFilled,
  Search,
  ArrowRight,
  CircleCloseFilled,
  Money,
  Wallet,
} from '@element-plus/icons-vue';
import { data } from 'autoprefixer';

const store = useStore();
const router = useRouter();
const username = computed(() => store.getters.userName);
const accountId = localStorage.getItem('id');
const liveLocationOverviewDialog = ref(false);
const activeName = ref('Corporate');
const liveLocationOverviewKey = ref(0);
const role = computed(() => store.getters.userRole) || localStorage.getItem('role');
const groupValue = computed(() => store.getters.userGroup) || localStorage.getItem('group');
const showNotifTask = ref(false);

const { filterData, changeIndex } = HOOKS.useListDataPaginate();
const { filterData: statusCountFilter } = HOOKS.useListDataPaginate();
const { filterData: omsetFilter } = HOOKS.useListDataPaginate();
const { filterData: insentifFilter } = HOOKS.useListDataPaginate();
const [leadState, getLeadState, loadingGetLeadState] = HOOKS.useGetDataById();
const [salesState, getSalesState, loadingGetSalesState] = HOOKS.useGetDataById();
const [contactState, getContactState, loadingGetContactState] = HOOKS.useGetDataById();
const [taskState, getTaskState, loadingGetTaskState] = HOOKS.useGetDataById();
const [notifTaskState, getNotifTaskState, loadingGetNotifTaskState] = HOOKS.useGetDataById();
const [followState, getFollowState, loadingGetFollowState] = HOOKS.useGetDataById();
const [targetPercentage, getTargetPercentage, loadingGetTargetPercentage] = HOOKS.useGetData();
const [omzetPercentage, getOmzetPercentage, loadingGetOmzetPercentage] = HOOKS.useGetData();
const [insentifState, getInsentifState, loadingInsentifState] = HOOKS.useGetDataById();
const [bonusAkusisiTopState, getbonusAkusisiAgenTop, loadingBonusAkusisiAgenTop] = HOOKS.useGetDataById();

// getOmzetPercentage(() => API.getTargetOmzetPercentageTop({
//   USER_ID: omsetFilter.value.ID_USER || accountId,
//   SINCE: "2024-01-01",
//   UNTIL: "2026-02-05",
// }), true, true)
statusCountFilter.value.GROUP_ID = groupValue.value || localStorage.getItem('group');
statusCountFilter.value.ROLE = role.value || localStorage.getItem('role');
omsetFilter.value.ROLE = role.value || localStorage.getItem('role');
filterData.value.ROLE = role.value || localStorage.getItem('role');
omsetFilter.value.GROUP_ID = groupValue.value || localStorage.getItem('group');
filterData.value.GROUP_ID = groupValue.value || localStorage.getItem('group');

// filter sales
function handleFilterCount(data) {
  statusCountFilter.value.user_id = data.USER_ID;
  statusCountFilter.value.GROUP_ID = data.USER_GROUP_CODE;
  statusCountFilter.value.ROLE = data.USER_ROLE;
  statusCountFilter.value.sales_id = data.USER_ID;
  onApplyFilterStatus();
}

function handleFilterClosing(data) {
  filterData.value.ID_USER = data.USER_ID;
  filterData.value.ROLE = data.USER_ROLE;
  filterData.value.GROUP_ID = data.USER_GROUP_CODE;
  onApplyFilter();
}

function handleFilteromset(data) {
  omsetFilter.value.ID_USER = data.USER_ID;
  omsetFilter.value.ROLE = data.USER_ROLE;
  omsetFilter.value.GROUP_ID = data.USER_GROUP_CODE;
  onApplyFilterOMset();
}

function handleInsentif(data) {
  insentifFilter.value.ID_USER = data.USER_ID;
  insentifFilter.value.role = data.USER_ROLE;
  insentifFilter.value.grup = data.USER_GROUP_CODE;
  onApplyFilterIntensif();
}

// apply filter
function onApplyFilter() {
  getTargetPercentage(
    () =>
      API.getTargetSalesPercentageTop({
        USER_ID: filterData.value.ID_USER || accountId,
        ROLE: filterData.value.ROLE ?? role.value,
        GROUP_ID: filterData.value.GROUP_ID,
        SINCE: filterData.value.since,
        UNTIL: filterData.value.until,
      }),
    true,
    true,
  );
}
function onApplyFilterStatus() {
  getFollowState(
    () =>
      API.totalFollowUpTop({
        user_id: statusCountFilter.value.user_id ?? accountId,
        since: statusCountFilter.value.since,
        until: statusCountFilter.value.until,
        GROUP_ID: statusCountFilter.value.GROUP_ID,
        ROLE: statusCountFilter.value.ROLE,
      }),
    true,
    true,
    (data) => {
      // // console.log('CALLBACK DATA', data);
    },
  );

  getLeadState(
    () =>
      API.topLeadsCount({
        sales_id: statusCountFilter.value.user_id ?? accountId,
        since: statusCountFilter.value.since,
        until: statusCountFilter.value.until,
        group_id: statusCountFilter.value.GROUP_ID,
        role: statusCountFilter.value.ROLE,
      }),
    true,
    true,
    (data) => {
      // // console.log('CALLBACK DATA', data);
    },
  );

  getContactState(
    () =>
      API.getCountContacts({
        user_id: statusCountFilter.value.user_id ?? accountId,
        role: statusCountFilter.value.ROLE,
        group_id: statusCountFilter.value.GROUP_ID,
        since: statusCountFilter.value.since,
        until: statusCountFilter.value.until,
      }),
    true,
    true,
    (data) => {
      // // console.log('CALLBACK DATA', data);
    },
  );

  getTaskState(
    () =>
      API.getCountTask({
        user_id: statusCountFilter.value.user_id ?? accountId,
        role: statusCountFilter.value.ROLE,
        group_id: statusCountFilter.value.GROUP_ID,
        since: statusCountFilter.value.since,
        until: statusCountFilter.value.until,
      }),
    true,
    true,
    (data) => {
      // // console.log('CALLBACK DATA', data);
    },
  );
}
function onApplyFilterOMset() {
  getOmzetPercentage(
    () =>
      API.getTargetOmzetPercentageTop({
        USER_ID: omsetFilter.value.ID_USER || accountId,
        ROLE: omsetFilter.value.ROLE,
        GROUP_ID: omsetFilter.value.GROUP_ID,
        SINCE: omsetFilter.value.since,
        UNTIL: omsetFilter.value.until,
      }),
    true,
    true,
  );
}
function onApplyFilterIntensif() {
  getInsentifState(
    () =>
      API.insentifTopDashBoard({
        id: insentifFilter.value.ID_USER || accountId,
        since: insentifFilter.value.since,
        until: insentifFilter.value.until,
        role: insentifFilter.value.role || role.value,
        grup: insentifFilter.value.grup || groupValue.value,
      }),
    true,
    true,
    (data) => {
      // // console.log('CALLBACK DATA', data);
    },
  ),
    getbonusAkusisiAgenTop(
      () =>
        API.bonusAkusisiAgenTop({
          id: insentifFilter.value.ID_USER || accountId,
          since: insentifFilter.value.since,
          until: insentifFilter.value.until,
          role: insentifFilter.value.role || role.value,
          grup: insentifFilter.value.grup || groupValue.value,
        }),
      true,
      true,
      (data) => {
        // // console.log('CALLBACK DATA', data);
      },
    );
}
function formatYYYYMMDD(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
const date = new Date();
const firstDayOfThisMonth = new Date(date.getFullYear(), date.getMonth(), 1);
const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
const oneWeekAgo = new Date();
oneWeekAgo.setDate(date.getDate() - 7);

filterData.value.until = date.toISOString().split('T')[0];
statusCountFilter.value.until = date.toISOString().split('T')[0];
omsetFilter.value.until = date.toISOString().split('T')[0];
filterData.value.since = formatYYYYMMDD(firstDayOfThisMonth);
statusCountFilter.value.since = oneWeekAgo.toISOString().split('T')[0];
omsetFilter.value.since = formatYYYYMMDD(firstDayOfThisMonth);
insentifFilter.value.since = formatYYYYMMDD(firstDayOfThisMonth);
insentifFilter.value.until = date.toISOString().split('T')[0];

onMounted(() => {
  getLeadState(API.topLeadsCount, {
    sales_id: statusCountFilter.value.ID_USER ?? accountId,
    since: statusCountFilter.value.since,
    until: statusCountFilter.value.until,
    group_id: statusCountFilter.value.GROUP_ID,
    role: statusCountFilter.value.ROLE,
  });
  getContactState(API.getCountContacts, {
    user_id: statusCountFilter.value.ID_USER ?? accountId,
    role: statusCountFilter.value.ROLE,
    group_id: statusCountFilter.value.GROUP_ID,
    since: statusCountFilter.value.since,
    until: statusCountFilter.value.until,
  });
  getTaskState(API.getCountTask, {
    user_id: statusCountFilter.value.ID_USER ?? accountId,
    role: statusCountFilter.value.ROLE,
    group_id: statusCountFilter.value.GROUP_ID,
    since: statusCountFilter.value.since,
    until: statusCountFilter.value.until,
  });
  getSalesState(API.salesCount, {
    user_id: accountId,
    role: role.value,
    group_id: groupValue.value,
  });

  getFollowState(API.totalFollowUpTop, {
    user_id: statusCountFilter.value.ID_USER ?? accountId,
    since: statusCountFilter.value.since,
    until: statusCountFilter.value.until,
    GROUP_ID: statusCountFilter.value.GROUP_ID,
    ROLE: statusCountFilter.value.ROLE,
  });
  getTargetPercentage(() =>
    API.getTargetSalesPercentageTop({
      USER_ID: filterData.value.ID_USER || accountId,
      ROLE: filterData.value.ROLE,
      GROUP_ID: filterData.value.GROUP_ID,
      SINCE: filterData.value.since,
      UNTIL: filterData.value.until,
    }),
  );

  getOmzetPercentage(() =>
    API.getTargetOmzetPercentageTop({
      USER_ID: omsetFilter.value.ID_USER || accountId,
      ROLE: omsetFilter.value.ROLE,
      GROUP_ID: omsetFilter.value.GROUP_ID,
      SINCE: omsetFilter.value.since,
      UNTIL: omsetFilter.value.until,
    }),
  );

  getInsentifState(() =>
    API.insentifTopDashBoard({
      id: insentifFilter.value.ID_USER || accountId,
      role: insentifFilter.value.role || role.value,
      grup: insentifFilter.value.grup || groupValue.value,
      since: insentifFilter.value.since,
      until: insentifFilter.value.until,
    }),
  );

  getbonusAkusisiAgenTop(() =>
    API.bonusAkusisiAgenTop({
      user_id: insentifFilter.value.ID_USER || accountId,
      since: insentifFilter.value.since,
      until: insentifFilter.value.until,
      role: insentifFilter.value.role || role.value,
      grup: insentifFilter.value.grup || groupValue.value,
    }),
  );

  getNotifTaskState(() =>
    API.getNotifTask({
      sales_id: accountId,
    }),
  );
});

const totalLeads = computed(() => {
  return leadState.value?.body?.[0]?.LEADS_COUNT ?? 0;
});
const totalContacts = computed(() => {
  return contactState.value?.body?.[0]?.LEADS_COUNT ?? 0;
});
const totalTasks = computed(() => {
  return taskState.value?.body?.[0]?.TASK_COUNT ?? 0;
});
const totalTasksPending = computed(() => {
  return taskState.value?.body?.[0]?.baru ?? 0;
});
const totalTasksDitunda = computed(() => {
  return taskState.value?.body?.[0]?.ditunda ?? 0;
});
const totalTasksComplete = computed(() => {
  return taskState.value?.body?.[0]?.selesai ?? 0;
});
const salesCount = computed(() => {
  return salesState.value?.body?.[0]?.count ?? 0;
});
const statusProses = computed(() => {
  return followState.value?.body?.find((item) => item.Status_FollowUp === 'TOP_PROSES')?.LEADS_COUNT ?? 0;
});
const statusBelumMinat = computed(() => {
  return followState.value?.body?.find((item) => item.Status_FollowUp === 'TOP_BELUM_MINAT')?.LEADS_COUNT ?? 0;
});
// const statusBelumDiajukan = computed(() => {
//   return followState.value?.body?.find((item) => item.Status_FollowUp === 'BelumDiajukan')?.LEADS_COUNT ?? 0;
// });
// const statusNew = computed(() => {
//   return followState.value?.body?.find((item) => item.Status_FollowUp === 'LEADS-PROPOSAL HARGA')?.LEADS_COUNT ?? 0;
// });
// const statusReject = computed(() => {
//   return followState.value?.body?.find((item) => item.Status_FollowUp === 'Rejected')?.LEADS_COUNT ?? 0;
// });
// const StatusWaiting = computed(() => {
//   return followState.value?.body?.find((item) => item.Status_FollowUp === 'Waiting')?.LEADS_COUNT ?? 0;
// });
const StatusApproved = computed(() => {
  return followState.value?.body?.find((item) => item.Status_FollowUp === 'TOP_PROSES_LANJUT')?.LEADS_COUNT ?? 0;
});

const bonusAkusisiAgenTop = computed(() => {
  const val = bonusAkusisiTopState.value?.body?.[0]?.feesales ?? 0;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(val);
});
const bonusOmset = computed(() => {
  const val = insentifState.value?.body?.[0]?.bonusomset ?? 0;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(val);
});

const bonusAkusisi = computed(() => {
  const val = insentifState.value?.body?.[0]?.bonusakuisisi ?? 0;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(val);
});

const notifTask = computed(() => {
  return notifTaskState.value?.body ?? [];
});

// CHART omset dan closing

//omset
const dataOmsetBySales = computed(() => ({
  series: [
    {
      name: 'Realisasi Omset',
      data: omzetPercentage.value.map((v) => Math.floor(Number(v.count))),
    },
    {
      name: 'Target Omset',
      data: omzetPercentage.value.map((v) => Math.floor(Number(v.target))),
    },
  ],

  chartOptions: {
    colors: ['#10B981', '#F59E0B'],
    chart: {
      height: 350,
      type: 'bar',
      stacked: false, // 🔥 wajib
      toolbar: { show: true },
    },

    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '24px', // 🔥 bar tetap kecil walau cuma 1 data
        borderRadius: 4,
        borderRadiusApplication: 'end',
      },
    },

    dataLabels: {
      enabled: false,
    },

    stroke: {
      show: true,
      width: 1,
      colors: ['transparent'],
    },

    xaxis: {
      categories: omzetPercentage.value.map((v) => v.bulan),
      tickPlacement: 'between', // bikin jarak antar bar rapi
      title: {
        text: 'Bulan',
      },
    },

    yaxis: {
      title: {
        text: 'Omset (Rupiah)',
      },
      labels: {
        formatter: (val) => convertRp(val),
      },
    },

    tooltip: {
      y: {
        // formatter: (val) => `Rp ${new convertRp(val)}`,
        formatter: function (val, opts) {
          const percent = omzetPercentage.value[opts.dataPointIndex].percent;
          if (opts.seriesIndex === 0) {
            return `${convertRp(val)} (${Number.parseInt(percent)}%)`;
          }
          return convertRp(val);
        },
      },
    },

    legend: {
      position: 'bottom',
    },
  },
}));

// closing
const closingBySales = computed(() => {
  return {
    series: [
      {
        name: 'Closing',
        data: targetPercentage.value.map((v) => Math.floor(Number(v.count))),
      },
      {
        name: 'Target Closing',
        data: targetPercentage.value.map((v) => Math.floor(Number(v.target))),
      },
    ],

    chartOptions: {
      // 🔥 TAMBAHKAN WARNA DI SINI
      // Index 0 untuk seri pertama (Closing), Index 1 untuk seri kedua (Target)
      colors: ['#10B981', '#F59E0B'],

      chart: {
        type: 'bar',
        height: 350,
        stacked: false,
        toolbar: { show: true },
      },

      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '24px',
          borderRadius: 4,
          borderRadiusApplication: 'end',
          dataLabels: {
            position: 'center',
          },
        },
      },

      dataLabels: {
        enabled: true,
        offsetY: -6,
        style: {
          fontSize: '12px',
          fontWeight: 600,
          // Agar teks label otomatis kontras dengan warna bar
          colors: ['#fff'],
        },
      },

      stroke: {
        show: true,
        width: 1,
        colors: ['transparent'],
      },

      xaxis: {
        categories: targetPercentage.value.map((v) => v.bulan),
        tickPlacement: 'between',
        title: {
          text: 'Periode',
        },
      },

      yaxis: {
        title: {
          text: 'Jumlah Closing',
        },
      },

      tooltip: {
        y: {
          formatter: function (val, opts) {
            const percent = targetPercentage.value[opts.dataPointIndex].percent;
            if (opts.seriesIndex === 0) {
              return `${val} (${Number.parseInt(percent)}%)`;
            }
            return val;
          },
        },
      },

      legend: {
        position: 'bottom',
      },
    },
  };
});

// clear filter

function onClearClosing() {
  getTargetPercentage(
    () =>
      API.getTargetSalesPercentageTop({
        USER_ID: accountId || localStorage.getItem('id'),
        ROLE: (filterData.value.ROLE = role.value || localStorage.getItem('role')),
        GROUP_ID: (filterData.value.GROUP_ID = groupValue.value || localStorage.getItem('group')),
        SINCE: filterData.value.since,
        UNTIL: filterData.value.until,
      }),
    true,
    true,
    (data) => {
      // // console.log('CALLBACK DATA', data);
    },
  );
}
function onClearOmset() {
  getOmzetPercentage(
    () =>
      API.getTargetOmzetPercentageTop({
        USER_ID: accountId,
        ROLE: (omsetFilter.value.ROLE = role.value || localStorage.getItem('role')),
        GROUP_ID: (omsetFilter.value.GROUP_ID = groupValue.value || localStorage.getItem('group')),
        SINCE: omsetFilter.value.since,
        UNTIL: omsetFilter.value.until,
      }),
    true,
    true,
    (data) => {
      // // console.log('CALLBACK DATA', data);
    },
  );
}

function onClearSalesFollowUp() {
  getFollowState(
    () =>
      API.totalFollowUpTop({
        user_id: accountId,
        ROLE: (statusCountFilter.value.ROLE = role.value || localStorage.getItem('role')),
        GROUP_ID: (statusCountFilter.value.GROUP_ID = groupValue.value || localStorage.getItem('group')),
        since: statusCountFilter.value.since,
        until: statusCountFilter.value.until,
      }),
    true,
    true,
    (data) => {
      // // console.log('CALLBACK DATA', data);
    },
  );

  getContactState(
    () =>
      API.getCountContacts({
        user_id: accountId,
        role: statusCountFilter.value.ROLE,
        group_id: statusCountFilter.value.GROUP_ID,
        since: statusCountFilter.value.since,
        until: statusCountFilter.value.until,
      }),
    true,
    true,
    (data) => {
      // // console.log('CALLBACK DATA', data);
    },
  );

  getLeadState(
    () =>
      API.topLeadsCount({
        sales_id: statusCountFilter.value.accountId,
        since: statusCountFilter.value.since,
        until: statusCountFilter.value.until,
        group_id: statusCountFilter.value.GROUP_ID,
        role: statusCountFilter.value.ROLE,
      }),
    true,
    true,
    (data) => {
      // // console.log('CALLBACK DATA', data);
    },
  );

  getTaskState(
    () =>
      API.getCountTask({
        user_id: statusCountFilter.value.accountId,
        role: statusCountFilter.value.ROLE,
        group_id: statusCountFilter.value.GROUP_ID,
        since: statusCountFilter.value.since,
        until: statusCountFilter.value.until,
      }),
    true,
    true,
    (data) => {
      // // console.log('CALLBACK DATA', data);
    },
  );
}

function onClearSalesInsentif() {
  getInsentifState(
    () =>
      API.insentifTopDashBoard({
        id: accountId,
        role: (insentifFilter.value.role = role.value),
        grup: (insentifFilter.value.grup = groupValue.value),
        since: insentifFilter.value.since,
        until: insentifFilter.value.until,
      }),
    true,
    true,
    (data) => {
      // // console.log('CALLBACK DATA', data);
    },
  ),
    getbonusAkusisiAgenTop(
      () =>
        API.bonusAkusisiAgenTop({
          user_id: accountId,
          since: insentifFilter.value.since,
          until: insentifFilter.value.until,
          role: (insentifFilter.value.role = role.value),
          grup: (insentifFilter.value.grup = groupValue.value),
        }),
      true,
      true,
      (data) => {
        // // console.log('CALLBACK DATA', data);
      },
    );
}
//pengingat task hari ini
watchEffect(() => {
  const list = notifTask.value;
  const session = accountId;

  if (!session || !list?.length) return;

  const shownKey = `notif_shown_${session}`;
  const lastShown = sessionStorage.getItem(shownKey);

  const now = Date.now();
  const oneHour = 60 * 60 * 1000;

  // kalau belum pernah tampil ATAU sudah lewat 1 jam
  if (!lastShown || now - Number(lastShown) > oneHour) {
    showNotifTask.value = true;
    sessionStorage.setItem(shownKey, now.toString());
  }
});
</script>

<style>
.graph {
  max-height: 400px;
}

.date-mini.el-input {
  max-width: 120px !important;
  min-height: 35px !important;
}

@media (max-width: 640px) {
  .date-mini.el-input {
    min-width: 100% !important;
  }
}

.date-mini .el-input__wrapper {
  padding: 0 6px !important;
}
.custom-scroll::-webkit-scrollbar {
  width: 4px;
}
.custom-scroll::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}

:deep(.el-dialog) {
  border: 1px solid #f1f5f9 !important;
  box-shadow: none !important;
  border-radius: 16px !important;
}

:deep(.el-dialog__header) {
  padding: 20px 24px 0px 24px !important;
}

:deep(.el-dialog__body) {
  padding: 20px 24px 24px 24px !important;
}

.antialiased {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif !important;
}
</style>
