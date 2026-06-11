<template>
  <div class="space-y-6">
    <!-- Header Greeting and Tab Selector -->
    <div class="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl md:text-3xl font-heading font-black text-slate-800 tracking-tight">
          Halo, Yudha Pratama
        </h1>
        <p class="text-slate-500 mt-1 text-sm md:text-base">
          Selamat datang di <span class="text-primary font-bold">Wahana CRM Analytics</span>. Berikut rangkuman performa sales hari ini.
        </p>
      </div>

      <!-- Tabs Switcher -->
      <div class="bg-slate-100 p-1.5 rounded-xl self-start md:self-center">
        <el-radio-group v-model="activeTab" size="large" class="!flex gap-1">
          <el-radio-button label="Corporate" value="Corporate">
            <span class="px-2 font-heading font-bold text-xs uppercase tracking-wider">Corporate Segment</span>
          </el-radio-button>
          <el-radio-button label="TOP" value="TOP">
            <span class="px-2 font-heading font-bold text-xs uppercase tracking-wider">TOP Segment</span>
          </el-radio-button>
        </el-radio-group>
      </div>
    </div>

    <!-- Segment Badge Notification -->
    <div class="flex items-center gap-3 bg-amber-50 border border-amber-200/60 p-4 rounded-xl text-amber-800 text-xs md:text-sm">
      <el-icon class="text-amber-500 shrink-0" :size="20"><Warning /></el-icon>
      <div>
        <strong>Mode Demo Portofolio:</strong> Semua visualisasi di bawah memuat data tiruan (mock data) 100% anonymized untuk melindungi data operasional perusahaan.
      </div>
    </div>

    <!-- Section Title: Status Follow Up -->
    <div>
      <div class="flex items-center gap-2 mb-4">
        <div class="w-1.5 h-6 bg-primary rounded-full"></div>
        <h3 class="text-lg font-heading font-extrabold text-slate-800 tracking-tight">Status Follow Up (Sales Pipeline)</h3>
      </div>

      <!-- Pipeline Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div
          v-for="stage in pipelineStages"
          :key="stage.status"
          class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300 border-l-4 group cursor-pointer"
          :class="stage.borderColor"
        >
          <div class="flex items-center justify-between">
            <div class="p-2.5 rounded-xl transition-colors duration-200" :class="stage.iconBg">
              <el-icon :class="stage.iconColor" :size="24">
                <component :is="stage.icon" />
              </el-icon>
            </div>
            <span class="text-2xl font-black font-heading" :class="stage.textColor">
              {{ stage.count }}
            </span>
          </div>
          <div class="mt-4">
            <h4 class="text-sm font-bold text-slate-700 leading-tight group-hover:text-primary transition-colors">
              {{ stage.title }}
            </h4>
            <p class="text-xs text-slate-400 mt-1">
              {{ stage.desc }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Section Title: Total Data Counters -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div
        v-for="counter in dataCounters"
        :key="counter.label"
        class="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between group hover:border-primary/30 transition-all duration-300"
      >
        <div class="flex items-center gap-4">
          <div class="p-3 rounded-xl transition-colors" :class="counter.bg">
            <el-icon :class="counter.iconColor" :size="22">
              <component :is="counter.icon" />
            </el-icon>
          </div>
          <div>
            <p class="text-xs text-slate-400 font-bold uppercase tracking-wider">{{ counter.label }}</p>
            <p class="text-2xl font-black font-heading text-slate-800 mt-1">{{ counter.count }}</p>
          </div>
        </div>
        <router-link :to="counter.link" class="text-slate-400 hover:text-primary transition">
          <el-icon :size="18"><ArrowRight /></el-icon>
        </router-link>
      </div>
    </div>

    <!-- Incentives Section -->
    <div class="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
      <div class="flex items-center gap-2 mb-4">
        <div class="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
        <h3 class="text-lg font-heading font-extrabold text-slate-800 tracking-tight">Estimasi Bonus Insentif Anda</h3>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="p-5 rounded-2xl bg-gradient-to-br from-blue-50/50 to-indigo-50/50 border border-blue-100 flex items-start gap-4">
          <div class="p-3 bg-blue-500 text-white rounded-xl shadow-md shadow-blue-500/20">
            <el-icon :size="24"><Money /></el-icon>
          </div>
          <div>
            <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wide">Bonus Kiriman (Sudah Potong PPH)</h4>
            <p class="text-2xl font-black font-heading text-slate-800 mt-1">{{ currentIncentives.kiriman }}</p>
            <p class="text-[11px] text-slate-400 mt-1">Dihitung otomatis dari realisasi pengiriman corporate account.</p>
          </div>
        </div>
        <div class="p-5 rounded-2xl bg-gradient-to-br from-emerald-50/50 to-teal-50/50 border border-emerald-100 flex items-start gap-4">
          <div class="p-3 bg-emerald-500 text-white rounded-xl shadow-md shadow-emerald-500/20">
            <el-icon :size="24"><Wallet /></el-icon>
          </div>
          <div>
            <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wide">Bonus Trucking (Sudah Potong PPH)</h4>
            <p class="text-2xl font-black font-heading text-emerald-600 mt-1">{{ currentIncentives.trucking }}</p>
            <p class="text-[11px] text-slate-400 mt-1">Dihitung dari closing order penyewaan armada (FTL/LTL) bulanan.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Workspace -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Chart 1: Pencapaian Omset -->
      <div class="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div class="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
          <h4 class="text-base font-heading font-extrabold text-slate-800">
            Pencapaian Omset per Bulan (Juta Rp)
          </h4>
          <span class="text-xs text-slate-400 uppercase font-bold tracking-wider">{{ activeTab }}</span>
        </div>
        <vue-apex-charts
          type="bar"
          height="320"
          :options="omsetChartOptions"
          :series="omsetSeries"
        />
        <div class="flex items-center gap-2 mt-2 bg-slate-50 p-3 rounded-xl text-xs text-slate-500">
          <span class="w-2 h-2 rounded-full bg-amber-400"></span>
          <span>Membandingkan target omset penjualan dengan realisasi penagihan klien corporate.</span>
        </div>
      </div>

      <!-- Chart 2: Pencapaian Closing -->
      <div class="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div class="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
          <h4 class="text-base font-heading font-extrabold text-slate-800">
            Pencapaian Closing (Akuisisi Akun Baru)
          </h4>
          <span class="text-xs text-slate-400 uppercase font-bold tracking-wider">{{ activeTab }}</span>
        </div>
        <vue-apex-charts
          type="area"
          height="320"
          :options="closingChartOptions"
          :series="closingSeries"
        />
        <div class="flex items-center gap-2 mt-2 bg-slate-50 p-3 rounded-xl text-xs text-slate-500">
          <span class="w-2 h-2 rounded-full bg-amber-400"></span>
          <span>Jumlah akun customer baru yang berhasil tanda tangan kontrak kerjasama.</span>
        </div>
      </div>

      <!-- Chart 3: Performance Sales Reps -->
      <div class="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm lg:col-span-2">
        <div class="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
          <h4 class="text-base font-heading font-extrabold text-slate-800">
            Komparasi Performa Sales (Realisasi Omset & Closing)
          </h4>
          <span class="text-xs text-slate-400 uppercase font-bold tracking-wider">Internal Team</span>
        </div>
        <vue-apex-charts
          type="bar"
          height="300"
          :options="salesPerformanceChartOptions"
          :series="salesPerformanceSeries"
        />
      </div>
    </div>

    <!-- Active Tasks Summary -->
    <div class="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-2">
          <div class="w-1.5 h-6 bg-amber-500 rounded-full"></div>
          <h3 class="text-lg font-heading font-extrabold text-slate-800 tracking-tight">Daftar Task Menunggu Tindak Lanjut</h3>
        </div>
        <router-link
          to="/tasks"
          class="text-xs font-bold text-primary hover:underline uppercase tracking-wider flex items-center gap-1"
        >
          Lihat Semua Task <el-icon><ArrowRight /></el-icon>
        </router-link>
      </div>

      <!-- Task Lists Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          v-for="task in pendingTasks"
          :key="task.TASK_ID"
          class="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition flex flex-col justify-between"
        >
          <div>
            <div class="flex items-center justify-between gap-2">
              <el-tag
                :type="task.TASK_PRIORITY === 'Tinggi' || task.TASK_PRIORITY === 'Sangat Tinggi' ? 'danger' : 'warning'"
                size="small"
                effect="dark"
                class="!rounded-md"
              >
                {{ task.TASK_PRIORITY }}
              </el-tag>
              <span class="text-[10px] font-mono font-bold text-slate-400">{{ task.TASK_DUE_DATE }}</span>
            </div>
            <h4 class="font-bold text-sm text-slate-700 mt-2 line-clamp-1">
              {{ task.TASK_TITLE }}
            </h4>
            <p class="text-xs text-slate-400 mt-1 font-semibold flex items-center gap-1">
              <el-icon><OfficeBuilding /></el-icon> {{ task.TASK_COMPANY }}
            </p>
            <p class="text-xs text-slate-500 mt-2 line-clamp-2 italic bg-white p-2 rounded-lg border border-slate-100">
              "{{ task.TASK_NOTE }}"
            </p>
          </div>
          <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span class="text-[10px] text-slate-400 font-bold uppercase">{{ task.TASK_TYPE }}</span>
            <el-button type="primary" size="small" plain class="!rounded-lg" @click="$router.push('/tasks')">
              Proses
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  mockLeads,
  mockContacts,
  mockTasks,
  mockSalesReps,
  corporateAnalytics,
  topAnalytics
} from '../utils/mockData'

const activeTab = ref('Corporate')

// Pipeline counts based on segments
const pipelineStages = computed(() => {
  const isCorp = activeTab.value === 'Corporate'
  const mult = isCorp ? 1 : 2 // Multiply counts for TOP segment for variation

  return [
    {
      title: 'Perkenalan & Analisa',
      status: 'PERKENALAN',
      count: 2 * mult,
      desc: 'Analisa awal kebutuhan logistik klien',
      borderColor: 'border-l-blue-500',
      textColor: 'text-blue-600',
      icon: 'Search',
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-500'
    },
    {
      title: 'Proposal Harga',
      status: 'PROPOSAL',
      count: 2 * mult,
      desc: 'Penawaran tarif diskon volume cargo',
      borderColor: 'border-l-purple-500',
      textColor: 'text-purple-600',
      icon: 'Document',
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-500'
    },
    {
      title: 'Negosiasi',
      status: 'NEGOSIASI',
      count: 1 * mult,
      desc: 'Negosiasi skema SLA & TOP pembayaran',
      borderColor: 'border-l-orange-500',
      textColor: 'text-orange-600',
      icon: 'ChatLineRound',
      iconBg: 'bg-orange-50',
      iconColor: 'text-orange-500'
    },
    {
      title: 'Teknis / Integrasi API',
      status: 'TEKNIS',
      count: 1 * mult,
      desc: 'Persiapan operasional & testing API resi',
      borderColor: 'border-l-indigo-500',
      textColor: 'text-indigo-600',
      icon: 'Setting',
      iconBg: 'bg-indigo-50',
      iconColor: 'text-indigo-500'
    },
    {
      title: 'TTD Kontrak',
      status: 'KONTRAK',
      count: 1 * mult,
      desc: 'Finalisasi administrasi hukum & PKS',
      borderColor: 'border-l-green-500',
      textColor: 'text-green-600',
      icon: 'DocumentChecked',
      iconBg: 'bg-green-50',
      iconColor: 'text-green-500'
    }
  ]
})

// Data counters
const dataCounters = computed(() => {
  const isCorp = activeTab.value === 'Corporate'
  return [
    { label: 'Total Leads', count: isCorp ? mockLeads.length : 12, icon: 'PriceTag', bg: 'bg-indigo-50', iconColor: 'text-indigo-600', link: '/contacts' },
    { label: 'Total Contact', count: isCorp ? mockContacts.length : 15, icon: 'User', bg: 'bg-green-50', iconColor: 'text-green-600', link: '/contacts' },
    { label: 'Total Task', count: isCorp ? mockTasks.length : 8, icon: 'Tickets', bg: 'bg-amber-50', iconColor: 'text-amber-600', link: '/tasks' },
    { label: 'Sales Aktif', count: mockSalesReps.length, icon: 'Connection', bg: 'bg-blue-50', iconColor: 'text-blue-600', link: '/dashboard' }
  ]
})

// Incentives tracking
const currentIncentives = computed(() => {
  return activeTab.value === 'Corporate' ? corporateAnalytics.insentif : topAnalytics.insentif
})

// Pending tasks list
const pendingTasks = computed(() => {
  return mockTasks.filter(t => t.TASK_STATUS !== 'Selesai').slice(0, 3)
})

// Chart 1 Options and Series (Omset per Bulan)
const omsetChartOptions = computed(() => {
  const currentData = activeTab.value === 'Corporate' ? corporateAnalytics : topAnalytics
  return {
    chart: {
      type: 'bar',
      toolbar: { show: false },
      fontFamily: 'Inter, sans-serif'
    },
    colors: ['#cbd5e1', '#2951b2'], // gray-300 and primary blue
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '50%',
        borderRadius: 5
      }
    },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 2, colors: ['transparent'] },
    xaxis: {
      categories: currentData.omset.months,
      labels: { style: { colors: '#64748b', fontWeight: 500 } }
    },
    yaxis: {
      labels: {
        formatter: (val) => `Rp ${val}M`,
        style: { colors: '#64748b' }
      }
    },
    fill: { opacity: 1 },
    tooltip: {
      y: { formatter: (val) => `Rp ${val} Juta` }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      fontFamily: 'Inter, sans-serif',
      labels: { colors: '#475569' }
    }
  }
})

const omsetSeries = computed(() => {
  const currentData = activeTab.value === 'Corporate' ? corporateAnalytics : topAnalytics
  return [
    { name: 'Target Omset', data: currentData.omset.target },
    { name: 'Realisasi Omset', data: currentData.omset.realization }
  ]
})

// Chart 2 Options and Series (Closing Deals)
const closingChartOptions = computed(() => {
  const currentData = activeTab.value === 'Corporate' ? corporateAnalytics : topAnalytics
  return {
    chart: {
      type: 'area',
      toolbar: { show: false },
      fontFamily: 'Inter, sans-serif'
    },
    colors: ['#e2e8f0', '#10b981'], // slate-200 and emerald-500
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 3 },
    xaxis: {
      categories: currentData.closing.months,
      labels: { style: { colors: '#64748b', fontWeight: 500 } }
    },
    yaxis: {
      labels: { style: { colors: '#64748b' } }
    },
    tooltip: {
      y: { formatter: (val) => `${val} Akun Klien` }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      labels: { colors: '#475569' }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [0, 100]
      }
    }
  }
})

const closingSeries = computed(() => {
  const currentData = activeTab.value === 'Corporate' ? corporateAnalytics : topAnalytics
  return [
    { name: 'Target Closing', data: currentData.closing.target },
    { name: 'Realisasi Closing', data: currentData.closing.realization }
  ]
})

// Chart 3 Options and Series (Sales performance comparison)
const salesPerformanceChartOptions = computed(() => {
  const currentData = activeTab.value === 'Corporate' ? corporateAnalytics : topAnalytics
  return {
    chart: {
      type: 'bar',
      toolbar: { show: false },
      fontFamily: 'Inter, sans-serif'
    },
    colors: ['#2951b2', '#f59e0b'], // primary blue and amber-500
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '60%',
        borderRadius: 4
      }
    },
    dataLabels: {
      enabled: true,
      textAnchor: 'start',
      style: { colors: ['#fff'] },
      formatter: function (val, opt) {
        if (opt.seriesIndex === 0) {
          return `Rp ${val}M`
        }
        return `${val} Deals`
      },
      offsetX: 0
    },
    xaxis: {
      categories: currentData.salesPerformance.names,
      labels: { style: { colors: '#64748b' } }
    },
    yaxis: {
      labels: { style: { colors: '#475569', fontWeight: 600 } }
    },
    tooltip: {
      shared: true,
      intersect: false
    },
    legend: {
      position: 'top',
      horizontalAlign: 'center',
      labels: { colors: '#475569' }
    }
  }
})

const salesPerformanceSeries = computed(() => {
  const currentData = activeTab.value === 'Corporate' ? corporateAnalytics : topAnalytics
  return [
    { name: 'Total Omset', data: currentData.salesPerformance.omset },
    { name: 'Total Closing', data: currentData.salesPerformance.closing }
  ]
})
</script>

<style scoped>
:deep(.el-radio-button__inner) {
  border-radius: 0.5rem !important;
  border: none !important;
  background-color: transparent !important;
  color: #64748b !important;
  transition: all 0.2s;
}

:deep(.el-radio-button__orig-radio:checked + .el-radio-button__inner) {
  background-color: #2951b2 !important;
  color: #ffffff !important;
  box-shadow: 0 4px 6px -1px rgba(41, 81, 178, 0.2), 0 2px 4px -2px rgba(41, 81, 178, 0.2) !important;
}

:deep(.el-radio-group) {
  border: none !important;
}
</style>
