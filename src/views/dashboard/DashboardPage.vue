<template>
  <div class="min-h-screen">
    <div class="m-2">
      <div class="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
        <div class="w-full">
          <h1 class="text-2xl md:text-3xl font-bold text-gray-800">Halo, {{ username }}</h1>

          <p class="text-base md:text-xl text-gray-600 mt-1">
            Selamat datang di
            <span class="text-blue-900 font-semibold">Wahana CRM</span>
          </p>

          <!-- Tabs -->
          <div class="mt-4">
            <el-tabs v-model="activeName" class="w-full" @tab-click="handleClick">
              <el-tab-pane label="Corporate" name="Corporate" />
              <el-tab-pane label="TOP" name="TOP" />
            </el-tabs>
          </div>
        </div>
      </div>
    </div>
    <div v-show="activeName === 'Corporate'">
      <div class="mt-6">
        <div class="w-full bg-slate-50 border border-slate-100 py-4 mb-6 rounded-2xl shadow-sm">
          <h4 class="text-sm font-bold text-slate-600 text-center uppercase tracking-[0.2em]">Status Follow Up</h4>
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

        <!-- STATUS FOLLOW UP CARDS - Dynamic Loop -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <template v-for="(item, index) in followState?.body" :key="index">
            <div
              @click="toStatusPage(item.Status_FollowUp)"
              :class="['group relative bg-white rounded-xl border cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5', index === (followState?.body?.length - 1) && followState?.body?.length % 2 !== 0 ? 'sm:col-span-2' : '']"
              :style="{ borderColor: setIconColorV2(index) + '30' }"
            >
              <!-- Color accent left bar -->
              <div class="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl transition-all duration-300 group-hover:w-1.5" :style="{ backgroundColor: setIconColorV2(index) }"></div>

              <div class="flex items-center justify-between p-4 pl-5">
                <!-- Icon + Label -->
                <div class="flex items-center space-x-3">
                  <div
                    class="w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 flex-shrink-0"
                    :style="{ backgroundColor: setIconColorV2(index) + '18', color: setIconColorV2(index) }"
                  >
                    <el-icon :size="22"><component :is="setIconV2(index)" /></el-icon>
                  </div>
                  <div>
                    <p class="text-sm font-bold text-gray-800 leading-tight">{{ setStatusWord(item.Status_FollowUp) }}</p>
                    <p class="text-xs text-gray-400 mt-0.5">{{ setStatusSubWord(item.Status_FollowUp) }}</p>
                  </div>
                </div>

                <!-- Count + Arrow -->
                <div class="flex items-center space-x-2 flex-shrink-0">
                  <template v-if="loadingGetFollowState">
                    <div class="w-8 h-8 bg-gray-100 rounded-lg animate-pulse"></div>
                  </template>
                  <template v-else>
                    <span class="text-2xl font-black tabular-nums" :style="{ color: setIconColorV2(index) }">
                      {{ item.LEADS_COUNT }}
                    </span>
                  </template>
                  <el-icon class="text-gray-300 group-hover:text-gray-500 transition-colors"><ArrowRight /></el-icon>
                </div>
              </div>
            </div>
          </template>

          <!-- Empty state -->
          <div v-if="!loadingGetFollowState && !followState?.body?.length" class="sm:col-span-2 text-center py-12 text-gray-400">
            <el-icon :size="40" class="mb-2"><Finished /></el-icon>
            <p class="text-sm">Tidak ada data follow-up</p>
          </div>
        </div>
        </div>
      <div class="w-full bg-slate-50 border border-slate-100 py-4 my-6 rounded-2xl shadow-sm">
        <h4 class="text-sm font-bold text-slate-600 text-center uppercase tracking-[0.2em]">Total Data</h4>
      </div>
      <div :class="['grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 mb-4', ['ADM', 'SLSM'].includes(role) ? 'lg:grid-cols-4' : 'lg:grid-cols-3']">
        <router-link
          :to="{
            path: '/corporate-deals/new-lead',
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
                  <PriceTag />
                </el-icon>
              </div>
              <div>
                <p class="text-sm font-bold text-gray-700">Total Leads</p>
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
            path: '/input-task',
            query: statusCountFilter,
          }"
          class="block"
        >
          <div
            class="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border-l-4 border-yellow-500 cursor-pointer hover:bg-yellow-50 transition-all group"
          >
            <div class="flex items-center space-x-3">
              <div class="p-2.5 bg-yellow-100 rounded-full group-hover:bg-yellow-200 transition">
                <el-icon class="text-yellow-600" :size="22">
                  <Tickets />
                </el-icon>
              </div>
              <div>
                <p class="text-sm font-bold text-gray-700">Total Task</p>
                <p class="text-[11px] text-gray-500">Prioritas tinjauan</p>
              </div>
            </div>
            <span class="text-xl font-bold text-yellow-600">
              <template v-if="loadingGetTaskState">...</template>
              <template v-else>{{ totalTasks }}</template>
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

      <!--TASK-->
      <div class="bg-white p-2 rounded-xl">
        <div name="task-summary" label="Task Anda">
          <div class="w-full bg-slate-50 border border-slate-100 py-4 my-6 rounded-2xl shadow-sm">
            <h4 class="text-sm font-bold text-slate-600 text-center uppercase tracking-[0.2em]">Task Anda</h4>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- baru -->
            <div class="flex items-center space-x-3 border rounded-lg p-4">
              <div class="p-2 bg-yellow-100 rounded-full">
                <el-icon class="text-yellow-600" :size="24">
                  <Timer />
                </el-icon>
              </div>

              <div class="flex-1">
                <p class="font-medium text-gray-700">Task Baru</p>
                <p class="text-xs text-gray-500">Menunggu tindak lanjut</p>
              </div>

              <span class="text-lg font-semibold text-yellow-600">
                <template v-if="loadingGetTaskState">...</template>
                <template v-else>{{ totalTasksPending }}</template>
              </span>
            </div>

            <!-- DITUNDA -->
            <div class="flex items-center space-x-3 border rounded-lg p-4">
              <div class="p-2 bg-orange-100 rounded-full">
                <el-icon class="text-orange-600" :size="24">
                  <Warning />
                </el-icon>
              </div>

              <div class="flex-1">
                <p class="font-medium text-gray-700">Task Ditunda</p>
                <p class="text-xs text-gray-500">Menunggu waktu selanjutnya</p>
              </div>

              <span class="text-lg font-semibold text-orange-600">
                <template v-if="loadingGetTaskState">...</template>
                <template v-else>{{ totalTasksDitunda }}</template>
              </span>
            </div>

            <!-- SELESAI -->
            <div class="flex items-center space-x-3 border rounded-lg p-4">
              <div class="p-2 bg-green-100 rounded-full">
                <el-icon class="text-green-600" :size="24">
                  <Finished />
                </el-icon>
              </div>

              <div class="flex-1">
                <p class="font-medium text-gray-700">Task Selesai</p>
                <p class="text-xs text-gray-500">Task yang sudah dituntaskan</p>
              </div>

              <span class="text-lg font-semibold text-green-600">
                <template v-if="loadingGetTaskState">...</template>
                <template v-else>{{ totalTasksComplete }}</template>
              </span>
            </div>
          </div>

          <router-link
            to="/input-task"
            class="block w-full mt-6 py-2 text-sm font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition text-center"
          >
            Lihat Detail Task
          </router-link>
        </div>
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

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 mb-4">
        <router-link
          :to="{
            path: '/report/insentif',
            query: insentifFilter,
          }"
          class="block"
        >
          <div class="p-4 bg-white rounded-xl shadow-sm border border-slate-100 hover:border-blue-200 transition-all hover:shadow-lg hover:shadow-blue-50/50">
            <div class="flex items-start space-x-3">
              <div class="p-2.5 bg-blue-50 rounded-xl text-blue-600">
                <el-icon :size="24"><Money /></el-icon>
              </div>
              <div class="flex flex-col">
                <p class="text-xs font-bold text-gray-500 uppercase tracking-wide">Bonus Kiriman</p>
                <span class="text-xl font-extrabold text-gray-800 mt-1">
                  <template v-if="loadingInsentifState">...</template>
                  <template v-else>{{ totalInsentifKiriman }}</template>
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
                <p class="text-xs font-bold text-emerald-700 uppercase tracking-wide">Bonus Trucking</p>
                <span class="text-2xl font-black text-emerald-600 mt-1">
                  <template v-if="loadingInsentifTruckingState">...</template>
                  <template v-else>{{ totalInsentifTrucking }}</template>
                </span>
                <p class="text-[10px] text-emerald-500 mt-1 font-medium">Sudah Dipotong PPH</p>
              </div>
            </div>
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
            <h4 class="text-sm font-bold text-slate-600 text-center uppercase tracking-[0.2em]">Peformance Sales</h4>
          </div>
          <div class="flex flex-col gap-3 mb-4 md:flex-row md:items-center md:gap-3 md:flex-nowrap">
            <el-form :model="omsetFilter" class="flex flex-col gap-2 w-full md:flex-row md:items-center md:gap-2 md:flex-nowrap">
              <el-form-item v-if="['ADM', 'SLSM'].includes(role)" prop="ID_USER" class="mb-0 md:w-[280px] shrink-0">
                <el-inferior-input
                  v-model="omsetFilter.ID_USER"
                  :user-id="accountId"
                  :group-id="groupValue"
                  :role="role"
                  @clear="onClearPerformanceOmset"
                  @handle-change="handleFilterPerformanceOmset"
                />
              </el-form-item>
              <div class="hidden md:block md:ml-auto"></div>
              <el-form-item class="mb-0 shrink-0">
                <el-date-picker
                  v-model="performanceFilter.since"
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
                  v-model="performanceFilter.until"
                  type="date"
                  size="small"
                  placeholder="End Date"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  class="date-mini"
                />
              </el-form-item>
              <el-button type="primary" class="whitespace-nowrap shrink-0" @click="onApplyFilterPeformanceOmset"> Filter </el-button>
            </el-form>
          </div>
          <div>
            <div class="bg-white rounded-xl">
              <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                <h3 class="text-lg font-semibold text-gray-700">Omset per Periode</h3>
              </div>
              <chart-loading v-if="loadingGetPerformanceCorp" />

              <template v-else>
                <vue-apex-charts
                  v-if="performanceOmset"
                  type="bar"
                  height="350"
                  :options="performanceOmset.chartOptions"
                  :series="performanceOmset.series"
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

            <section class="grid grid-cols-1 gap-6 mb-4">
        <div class="lg:col-span-2 bg-white p-2 rounded-xl">
          <div class="w-full bg-slate-50 border border-slate-100 py-4 my-6 rounded-2xl shadow-sm">
            <h4 class="text-sm font-bold text-slate-600 text-center uppercase tracking-[0.2em]">Peformance Sales Closing</h4>
          </div>
          <div class="flex flex-col gap-3 mb-4 md:flex-row md:items-center md:gap-3 md:flex-nowrap">
            <el-form :model="omsetFilter" class="flex flex-col gap-2 w-full md:flex-row md:items-center md:gap-2 md:flex-nowrap">
              <el-form-item v-if="['ADM', 'SLSM'].includes(role)" prop="ID_USER" class="mb-0 md:w-[280px] shrink-0">
                <el-inferior-input
                  v-model="omsetFilter.ID_USER"
                  :user-id="accountId"
                  :group-id="groupValue"
                  :role="role"
                  @clear="onClearPerformanceClosing"
                  @handle-change="handleFilterPerformanceClosing"
                />
              </el-form-item>
              <div class="hidden md:block md:ml-auto"></div>
              <el-form-item class="mb-0 shrink-0">
                <el-date-picker
                  v-model="performanceClosingFilter.since"
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
                  v-model="performanceClosingFilter.until"
                  type="date"
                  size="small"
                  placeholder="End Date"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  class="date-mini"
                />
              </el-form-item>
              <el-button type="primary" class="whitespace-nowrap shrink-0" @click="onApplyFilterPerformanceClosing"> Filter </el-button>
            </el-form>
          </div>
          <div>
            <div class="bg-white rounded-xl">
              <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                <h3 class="text-lg font-semibold text-gray-700">Closing per Periode</h3>
              </div>
              <chart-loading v-if="loadingGetPerformanceCorpClosing" />

              <template v-else>
                <vue-apex-charts
                  v-if="performanceClosing"
                  type="bar"
                  height="350"
                  :options="performanceClosing.chartOptions"
                  :series="performanceClosing.series"
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
    </div>
    <keep-alive>
      <dashboard-page-top v-if="activeName === 'TOP'" />
    </keep-alive>
    <div>
      <div class="w-full bg-slate-50 border border-slate-100 py-4 my-6 rounded-2xl shadow-sm">
        <h4 class="text-sm font-bold text-slate-600 text-center uppercase tracking-[0.2em]">Live Location Overview</h4>
      </div>
      <div class="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 rounded-2xl transition-colors">
        <div class="mb-3 text-blue-500">
          <el-icon class="mb-3 text-slate-500" :size="28">
            <Location />
          </el-icon>
        </div>

        <span class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Tracking System</span>

        <el-button
          type="primary"
          class="w-full md:w-64 !bg-blue-600 !border-none !rounded-lg py-5 text-sm font-medium hover:!bg-blue-700 active:!bg-blue-800 transition-all"
          @click="
            () => {
              liveLocationOverviewDialog = true;
              liveLocationOverviewKey++;
            }
          "
        >
          Live Location Overview
        </el-button>

        <p class="mt-3 text-xs text-slate-400">Klik untuk melihat history live location</p>
      </div>
    </div>

    <div>
      <div class="w-full bg-slate-50 border border-slate-100 py-4 my-6 rounded-2xl shadow-sm">
        <h4 class="text-sm font-bold text-slate-600 text-center uppercase tracking-[0.2em]">Menu</h4>
      </div>
      <menu-summary></menu-summary>
    </div>

    <el-dialog v-model="liveLocationOverviewDialog" fullscreen destroy-on-close>
      <div>
        <live-location-overview :key="liveLocationOverviewKey"></live-location-overview>
      </div>
    </el-dialog>
    <!-- pengingat task -->
    <el-dialog
      v-model="showNotifTask"
      title="Tugas Hari Ini"
      width="500px"
      align-center
      class="mekari-dialog overflow-hidden rounded-xl border-none shadow-none"
    >
      <template #header>
        <div class="flex items-center gap-2 border-b border-slate-100 pb-4">
          <div class="w-1.5 h-4 bg-amber-400 rounded-full"></div>
          <h1 class="text-[11px] font-black text-[#001D3D] uppercase tracking-[0.2em]">Tugas Hari Ini</h1>
        </div>
      </template>

      <div class="relative h-16 mb-2">
        <img src="/notif-task.png" class="absolute left-1/2 -translate-x-1/2 -bottom-6 w-[150px] z-0 pointer-events-none opacity-90" />
      </div>

      <div class="relative z-10 max-h-[45vh] overflow-y-auto pr-2 custom-scroll">
        <div
          v-for="(item, i) in notifTask"
          :key="i"
          class="p-4 mb-3 rounded-xl border-l-4 border-l-amber-400 bg-slate-50 border border-slate-100 shadow-sm"
        >
          <div class="flex justify-between items-start gap-2 mb-3">
            <div class="text-[14px] font-black text-blue-900 leading-tight uppercase italic flex items-center gap-2">
              <el-icon :size="14"><OfficeBuilding /></el-icon>
              {{ item.customer }}
            </div>
            <el-tag
              :type="item.status === 'Completed' ? 'success' : 'warning'"
              size="small"
              class="!font-black !text-[9px] !rounded uppercase tracking-widest border-none"
              :color="item.status === 'Completed' ? '#ecfdf5' : '#fffbeb'"
            >
              {{ item.status }}
            </el-tag>
          </div>

          <div class="space-y-1.5 ml-5">
            <div class="flex items-start gap-2">
              <span class="text-[10px] font-black text-slate-400 uppercase tracking-wider w-16">Agenda</span>
              <span class="text-[10px] font-black text-sm flex-1">: {{ item.agenda }}</span>
            </div>

            <div class="flex items-start gap-2">
              <span class="text-[10px] font-black text-slate-400 uppercase tracking-wider w-16">Tanggal</span>
              <span class="text-[10px] font-black text-sm flex-1">: {{ item.waktu }}</span>
            </div>

            <div class="flex items-start gap-2">
              <span class="text-[10px] font-black text-slate-400 uppercase tracking-wider w-16">Jam</span>
              <span class="text-[10px] font-black text-sm flex-1">: {{ item.jam }} WIB</span>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end pt-2 border-t border-slate-50">
          <el-button
            type="primary"
            @click="showNotifTask = false"
            class="!bg-blue-750 !border-none !font-black !text-[10px] uppercase !px-8 !rounded shadow-md hover:!bg-blue-900 transition-all"
          >
            Mengerti
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { dateFormatFull, convertRp } from '../../helper/utils';
import { useStore } from 'vuex';
import { computed, ref, onMounted, watch, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import API from '../../api/apiCount';
import HOOKS from '../../hooks/bundleOneOps';
import VueApexCharts from 'vue3-apexcharts';
import MenuSummary from './components/MenuSummary.vue';
import DashboardPageTop from './components/DashboardPageTop.vue';
import LiveLocationOverview from './components/LiveLocationOverview.vue';
import {
  ChatLineRound,
  Search,
  Warning,
  Finished,
  User,
  Tickets,
  Timer,
  PriceTag,
  Document,
  Setting,
  DocumentChecked,
  ArrowRight,
  Location,
  Money,
  OfficeBuilding,
  Discount,
} from '@element-plus/icons-vue';

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

const handleClick = (tab, event) => {
  activeName.value = tab.paneName;
};

// ─── Follow-Up Status Card Helpers ───────────────────────────────────────────
const FOLLOW_COLORS = ['#3b82f6', '#8b5cf6', '#f97316', '#14b8a6', '#22c55e'];
const FOLLOW_ICONS  = [Search, Document, Setting, DocumentChecked, Finished];
const STATUS_META = {
  'LEADS-PERKENALAN DAN ANALISA KEBUTUHAN': { label: 'Perkenalan & Analisa', sub: 'Kebutuhan awal klien' },
  'LEADS-PROPOSAL HARGA': { label: 'Proposal Harga', sub: 'Penawaran ke klien' },
  'LEADS-NEGOSIASI': { label: 'Negosiasi', sub: 'Penyesuaian kesepakatan' },
  'LEADS-TEKNIS': { label: 'Teknis', sub: 'Persiapan & implementasi' },
  'LEADS-TTD KONTRAK': { label: 'TTD Kontrak', sub: 'Finalisasi kerja sama' },
};

function setIconColorV2(index) {
  return FOLLOW_COLORS[index % FOLLOW_COLORS.length];
}
function setIconV2(index) {
  return FOLLOW_ICONS[index % FOLLOW_ICONS.length];
}
function setStatusWord(status) {
  return STATUS_META[status]?.label ?? status;
}
function setStatusSubWord(status) {
  return STATUS_META[status]?.sub ?? '';
}
function toStatusPage(status) {
  router.push({
    path: '/corporate-deals/follow-up',
    query: { ...statusCountFilter.value, status },
  });
}

const { filterData, changeIndex } = HOOKS.useListDataPaginate();
const { filterData: statusCountFilter } = HOOKS.useListDataPaginate();
const { filterData: omsetFilter } = HOOKS.useListDataPaginate();
const { filterData: performanceFilter } = HOOKS.useListDataPaginate();
const { filterData: insentifFilter } = HOOKS.useListDataPaginate();
const { filterData: performanceClosingFilter } = HOOKS.useListDataPaginate();
const [leadState, getLeadState, loadingGetLeadState] = HOOKS.useGetDataById();
const [salesState, getSalesState, loadingGetSalesState] = HOOKS.useGetDataById();
const [contactState, getContactState, loadingGetContactState] = HOOKS.useGetDataById();
const [taskState, getTaskState, loadingGetTaskState] = HOOKS.useGetDataById();
const [notifTaskState, getNotifTaskState, loadingGetNotifTaskState] = HOOKS.useGetDataById();
const [followState, getFollowState, loadingGetFollowState] = HOOKS.useGetDataById();
const [targetPercentage, getTargetPercentage, loadingGetTargetPercentage] = HOOKS.useGetData();
const [omzetPercentage, getOmzetPercentage, loadingGetOmzetPercentage] = HOOKS.useGetData();
const [performanceCorp, getPerformanceCorp, loadingGetPerformanceCorp] = HOOKS.useGetData();
const [performanceCorpClosing, getPerformanceCorpClosing, loadingGetPerformanceCorpClosing] = HOOKS.useGetData();
const [insentifState, getInsentifState, loadingInsentifState] = HOOKS.useGetDataById();
const [insentifTruckingState, getInsentifTruckingState, loadingInsentifTruckingState] = HOOKS.useGetDataById();

// getOmzetPercentage(() => API.getTargetOmzetPercentage({
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
performanceFilter.value.GROUP_ID = groupValue.value || localStorage.getItem('group');
performanceFilter.value.ROLE = role.value || localStorage.getItem('role');
performanceClosingFilter.value.GROUP_ID = groupValue.value || localStorage.getItem('group');
performanceClosingFilter.value.ROLE = role.value || localStorage.getItem('role');

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

function handleFilterPerformanceOmset(data) {
  performanceFilter.value.ID_USER = data.USER_ID;
  performanceFilter.value.ROLE = data.USER_ROLE;
  performanceFilter.value.GROUP_ID = data.USER_GROUP_CODE;
  onApplyFilterPeformanceOmset();
}

function handleInsentif(data) {
  insentifFilter.value.ID_USER = data.USER_ID;
  insentifFilter.value.role = data.USER_ROLE;
  insentifFilter.value.grup = data.USER_GROUP_CODE;
  onApplyFilterIntensif();
}

function handleFilterPerformanceClosing(data) {
  performanceClosingFilter.value.ID_USER = data.USER_ID;
  performanceClosingFilter.value.ROLE = data.USER_ROLE;
  performanceClosingFilter.value.GROUP_ID = data.USER_GROUP_CODE;
  onApplyFilterPerformanceClosing();
}

// apply filter
function onApplyFilter() {
  getTargetPercentage(
    () =>
      API.getTargetSalesPercentage({
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
      API.getCountFollowUp({
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
      API.getCountLeads({
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
      API.getTargetOmzetPercentage({
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

function onApplyFilterPeformanceOmset() {
  getPerformanceCorp(
    () =>
      API.getPerformanceCorpTim({
        USER_ID: performanceFilter.value.ID_USER || accountId,
        ROLE: performanceFilter.value.ROLE,
        GROUP_ID: performanceFilter.value.GROUP_ID,
        SINCE: performanceFilter.value.since,
        UNTIL: performanceFilter.value.until,
      }),
    true,
    true,
  );
}

function onApplyFilterPerformanceClosing() {
  getPerformanceCorpClosing(
    () =>
      API.getPerformanceCorpTimClos({
        USER_ID: performanceClosingFilter.value.ID_USER || accountId,
        ROLE: performanceClosingFilter.value.ROLE,
        GROUP_ID: performanceClosingFilter.value.GROUP_ID,
        SINCE: performanceClosingFilter.value.since,
        UNTIL: performanceClosingFilter.value.until,
      }),
    true,
    true,
  );
}

function onApplyFilterIntensif() {
  getInsentifState(
    () =>
      API.getIncentiveSales({
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
    getInsentifTruckingState(
      () =>
        API.getDataInsentifTrucking({
          user_id: insentifFilter.value.ID_USER || accountId,
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
performanceFilter.value.since = formatYYYYMMDD(firstDayOfThisMonth);
performanceFilter.value.until = date.toISOString().split('T')[0];
performanceClosingFilter.value.since = formatYYYYMMDD(firstDayOfThisMonth);
performanceClosingFilter.value.until = date.toISOString().split('T')[0];

onMounted(() => {
  getLeadState(API.getCountLeads, {
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
  getFollowState(API.getCountFollowUp, {
    user_id: statusCountFilter.value.ID_USER ?? accountId,
    since: statusCountFilter.value.since,
    until: statusCountFilter.value.until,
    GROUP_ID: statusCountFilter.value.GROUP_ID,
    ROLE: statusCountFilter.value.ROLE,
  });
  getTargetPercentage(() =>
    API.getTargetSalesPercentage({
      USER_ID: filterData.value.ID_USER || accountId,
      ROLE: filterData.value.ROLE,
      GROUP_ID: filterData.value.GROUP_ID,
      SINCE: filterData.value.since,
      UNTIL: filterData.value.until,
    }),
  );

  getOmzetPercentage(() =>
    API.getTargetOmzetPercentage({
      USER_ID: omsetFilter.value.ID_USER || accountId,
      ROLE: omsetFilter.value.ROLE,
      GROUP_ID: omsetFilter.value.GROUP_ID,
      SINCE: omsetFilter.value.since,
      UNTIL: omsetFilter.value.until,
    }),
  );

  getPerformanceCorp(() =>
    API.getPerformanceCorpTim({
      USER_ID: performanceFilter.value.ID_USER || accountId,
      ROLE: performanceFilter.value.ROLE,
      GROUP_ID: performanceFilter.value.GROUP_ID,
      SINCE: performanceFilter.value.since,
      UNTIL: performanceFilter.value.until,
    }),
  );

  getPerformanceCorpClosing(() =>
    API.getPerformanceCorpTimClos({
      USER_ID: performanceClosingFilter.value.ID_USER || accountId,
      ROLE: performanceClosingFilter.value.ROLE,
      GROUP_ID: performanceClosingFilter.value.GROUP_ID,
      SINCE: performanceClosingFilter.value.since,
      UNTIL: performanceClosingFilter.value.until,
    }),
  );

  getInsentifState(() =>
    API.getIncentiveSales({
      id: insentifFilter.value.ID_USER || accountId,
      role: insentifFilter.value.ROLE ,
      grup: insentifFilter.value.GROUP_ID ,
      since: insentifFilter.value.since,
      until: insentifFilter.value.until,
    }),
  );

  getInsentifTruckingState(() =>
    API.getDataInsentifTrucking({
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
const totalFollowUpPerkenalan = computed(() => {
  return followState.value?.body?.find((item) => item.Status_FollowUp === 'LEADS-PERKENALAN DAN ANALISA KEBUTUHAN')?.LEADS_COUNT ?? 0;
});
const totalFollowUpProposal = computed(() => {
  return followState.value?.body?.find((item) => item.Status_FollowUp === 'LEADS-PROPOSAL HARGA')?.LEADS_COUNT ?? 0;
});
const totalFollowUpNegosiasi = computed(() => {
  return followState.value?.body?.find((item) => item.Status_FollowUp === 'LEADS-NEGOSIASI')?.LEADS_COUNT ?? 0;
});
const totalFollowUpTeknis = computed(() => {
  return followState.value?.body?.find((item) => item.Status_FollowUp === 'LEADS-TEKNIS')?.LEADS_COUNT ?? 0;
});
const totalFollowUpKontrak = computed(() => {
  return followState.value?.body?.find((item) => item.Status_FollowUp === 'LEADS-TTD KONTRAK')?.LEADS_COUNT ?? 0;
});

const totalInsentifTrucking = computed(() => {
  const val = insentifTruckingState.value?.body?.[0]?.NominalInsentif ?? 0;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(val);
});
const totalInsentifKiriman = computed(() => {
  const val = insentifState.value?.body?.[0]?.totalInsentifPersen ?? 0;
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

//peformance omset
const performanceOmset = computed(() => ({
  series: [
    {
      name: 'Realisasi Omset',
      data: performanceCorp.value.map((v) => Math.floor(Number(v.omset))),
    },
    {
      name: 'Target Omset',
      data: performanceCorp.value.map((v) => Math.floor(Number(v.targetomset))),
    },
  ],

  chartOptions: {
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
      categories: performanceCorp.value.map((v) => v.namasales),
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
          const percent = performanceCorp.value[opts.dataPointIndex].percent;
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
        enabled: true, // 🔥 tampilkan nilai
        offsetY: -6,
        style: {
          fontSize: '12px',
          fontWeight: 600,
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
        labels: {
          // formatter: (val) => val,
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

// performance closing
const performanceClosing = computed(() => ({
  series: [
    {
      name: 'Realisasi Closing',
      data: performanceCorpClosing.value.map((v) => Math.floor(Number(v.closing))),
    },
    {
      name: 'Target Closing',
      data: performanceCorpClosing.value.map((v) => Math.floor(Number(v.targetclosing))),
    },
  ],

  chartOptions: {
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
      categories: performanceCorpClosing.value.map((v) => v.namasales),
      tickPlacement: 'between', // bikin jarak antar bar rapi
      title: {
        text: 'Sales',
      },
    },

    yaxis: {
      title: {
        text: 'Closing',
      },
      labels: {
        formatter: (val) => convertRp(val),
      },
    },

      tooltip: {
        y: {
          formatter: function (val, opts) {
            const percent = performanceCorpClosing.value[opts.dataPointIndex].percent;
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
}));

// clear filter

function onClearClosing() {
  getTargetPercentage(
    () =>
      API.getTargetSalesPercentage({
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
      API.getTargetOmzetPercentage({
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

function onClearPerformanceOmset() {
  getPerformanceCorp(
    () =>
      API.getPerformanceCorpTim({
        USER_ID: accountId,
        ROLE: (performanceFilter.value.ROLE = role.value || localStorage.getItem('role')),
        GROUP_ID: (performanceFilter.value.GROUP_ID = groupValue.value || localStorage.getItem('group')),
        SINCE: performanceFilter.value.since,
        UNTIL: performanceFilter.value.until,
      }),
    true,
    true,
    (data) => {
      // // console.log('CALLBACK DATA', data);
    },
  );
}

function onClearPerformanceClosing() {
  getPerformanceCorpClosing(
    () =>
      API.getPerformanceCorpTimClos({
        USER_ID: accountId,
        ROLE: (performanceClosingFilter.value.ROLE = role.value || localStorage.getItem('role')),
        GROUP_ID: (performanceClosingFilter.value.GROUP_ID = groupValue.value || localStorage.getItem('group')),
        SINCE: performanceClosingFilter.value.since,
        UNTIL: performanceClosingFilter.value.until,
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
      API.getCountFollowUp({
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
      API.getCountLeads({
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
      API.getIncentiveSales({
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
    getInsentifTruckingState(
      () =>
        API.getDataInsentifTrucking({
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
