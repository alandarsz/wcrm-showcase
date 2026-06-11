<template>
  <div class="min-h-screen space-y-10">

    <!-- HEADER -->
    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <span class="material-symbols-rounded text-blue-600">dashboard</span>
          Sales Dashboard CRM
        </h1>
        <p class="text-gray-600 mt-1">
          Ringkasan performa penjualan, pipeline, dan aktivitas tim
        </p>
      </div>

      <div class="flex gap-3">
        <select class="border rounded-lg px-3 py-2 text-sm">
          <option>This Month</option>
          <option>Last Month</option>
          <option>This Quarter</option>
        </select>
        <button class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
          Export Report
        </button>
      </div>
    </div>

    <!-- STATS CARDS -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div
        v-for="stat in statsCards"
        :key="stat.title"
        class="bg-slate-100 rounded-xl p-3 border hover:shadow-md transition"
      >
        <div class="flex justify-between">
          <div>
            <p class="text-sm text-gray-500">{{ stat.title }}</p>
            <h3 class="text-3xl font-bold text-gray-800 mt-1">
              {{ stat.value }}
            </h3>
            <p
              v-if="stat.trend"
              class="mt-2 text-sm flex items-center gap-1"
              :class="stat.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'"
            >
              <span class="material-symbols-rounded text-base">
                {{ stat.trend.startsWith('+') ? 'trending_up' : 'trending_down' }}
              </span>
              {{ stat.trend }} vs last period
            </p>
          </div>

          <div :class="stat.color" class="p-2 rounded-xl text-white h-fit flex justify-center items-center">
            <span class="material-symbols-rounded text-2xl">
              {{ stat.icon }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- PIPELINE CONVERSION -->
    <div class="bg-white rounded-xl shadow-sm">
      <div class="flex justify-between items-center mb-4">
        <div>
          <h2 class="text-xl font-bold text-gray-800">Deal Pipeline Conversion</h2>
          <p class="text-sm text-gray-600">
            Rasio keberhasilan deal di setiap tahap pipeline
          </p>
        </div>
        <span class="bg-green-50 text-green-700 text-sm px-3 py-1 rounded-full">
          Avg Close Rate: <strong>38%</strong>
        </span>
      </div>

      <vue-apex-charts
        type="line"
        height="320"
        :options="pipelineOptions"
        :series="pipelineSeries"
      />
    </div>

    <!-- DEAL BY STAGE -->
    <div class="bg-white rounded-xl shadow-sm">
      <h2 class="text-xl font-bold text-gray-800 mb-1">Deal by Stage</h2>
      <p class="text-sm text-gray-600 mb-4">
        Distribusi deal berdasarkan tahap pipeline
      </p>

      <vue-apex-charts
        type="bar"
        height="320"
        :options="stageOptions"
        :series="stageSeries"
      />
    </div>

    <!-- DEAL WON + DEAL BY USER -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

      <!-- DEAL WON BY USER -->
      <div class="bg-white rounded-xl shadow-sm">
        <h2 class="text-xl font-bold text-gray-800 mb-1">
          Deal Won by User
        </h2>
        <p class="text-sm text-gray-600 mb-4">
          Ranking sales berdasarkan jumlah deal won
        </p>

        <div class="space-y-4">
          <div
            v-for="(user, index) in dealWonByUser"
            :key="user.name"
            class="flex items-center justify-between"
          >
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                {{ user.avatar }}
              </div>
              <div class="flex items-center gap-1">
                <span
                  v-if="index === 0"
                  class="material-symbols-rounded text-yellow-500"
                >
                  emoji_events
                </span>
                <span class="font-medium text-gray-700">{{ user.name }}</span>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <div class="w-32 h-2 bg-gray-200 rounded-full">
                <div
                  class="h-2 bg-blue-500 rounded-full"
                  :style="{ width: (user.deals / 45 * 100) + '%' }"
                ></div>
              </div>
              <span class="font-bold w-8 text-right">{{ user.deals }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- DEAL BY STAGE BY USER -->
      <div class="bg-white rounded-xl shadow-sm">
        <h2 class="text-xl font-bold text-gray-800 mb-1">
          Deal by Stage by User (Value)
        </h2>
        <p class="text-sm text-gray-600 mb-4">
          Total nilai deal per user dan tahap
        </p>

        <vue-apex-charts
          type="bar"
          height="320"
          :options="userStageOptions"
          :series="userStageSeries"
        />
      </div>
    </div>

    <!-- SALES PERFORMANCE -->
    <div class="bg-white rounded-xl shadow-sm">
      <h2 class="text-xl font-bold text-gray-800 mb-1">
        Sales Performance (Won Revenue)
      </h2>
      <p class="text-sm text-gray-600 mb-4">
        Performa revenue mingguan
      </p>

      <vue-apex-charts
        type="bar"
        height="300"
        :options="performanceOptions"
        :series="performanceSeries"
      />
    </div>

    <!-- TASK KPI -->
    <div class="bg-white rounded-xl shadow-sm">
      <h2 class="text-xl font-bold text-gray-800 mb-1">
        Tasks KPI by Status
      </h2>
      <p class="text-sm text-gray-600 mb-4">
        Distribusi status tugas per user
      </p>

      <vue-apex-charts
        type="bar"
        height="320"
        :options="tasksOptions"
        :series="tasksSeries"
      />
    </div>

  </div>
</template>

<script setup>
import VueApexCharts from 'vue3-apexcharts'

/* ------------------ STATS ------------------ */
const statsCards = [
  { title: 'Total Deals Won', value: '168', trend: '+12.5%', icon: 'check_circle', color: 'bg-green-500' },
  { title: 'Revenue (Won)', value: '$1.24M', trend: '+8.3%', icon: 'paid', color: 'bg-blue-500' },
  { title: 'Active Users', value: '24', icon: 'group', color: 'bg-purple-500' },
  { title: 'Conversion Rate', value: '32%', trend: '+3.2%', icon: 'percent', color: 'bg-orange-500' }
]

/* ------------------ DEAL WON ------------------ */
const dealWonByUser = [
  { name: 'John Doe', deals: 45, avatar: 'JD' },
  { name: 'Sarah Smith', deals: 38, avatar: 'SS' },
  { name: 'Mike Johnson', deals: 32, avatar: 'MJ' },
  { name: 'Emily Davis', deals: 28, avatar: 'ED' }
]

/* ------------------ PIPELINE ------------------ */
const pipelineSeries = [
  { name: 'Lead', data: [100, 100, 100, 100] },
  { name: 'Qualified', data: [75, 80, 78, 82] },
  { name: 'Proposal', data: [60, 65, 63, 68] },
  { name: 'Negotiation', data: [45, 50, 48, 52] },
  { name: 'Closed Won', data: [30, 35, 32, 38] }
]

const pipelineOptions = {
  chart: { toolbar: { show: false } },
  stroke: { curve: 'smooth', width: 3 },
  markers: { size: 4 },
  xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr'] },
  legend: { position: 'bottom' }
}

/* ------------------ DEAL BY STAGE ------------------ */
const stageSeries = [
  { name: 'Lead', data: [25, 22, 24, 23] },
  { name: 'Qualified', data: [20, 23, 21, 22] },
  { name: 'Proposal', data: [18, 19, 20, 18] },
  { name: 'Negotiation', data: [17, 16, 15, 17] },
  { name: 'Closed', data: [20, 20, 20, 20] }
]

const stageOptions = {
  chart: { stacked: true },
  plotOptions: { bar: { borderRadius: 6 } },
  xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr'] },
  legend: { position: 'bottom' }
}

/* ------------------ USER STAGE ------------------ */
const userStageSeries = [
  { name: 'Lead', data: [150, 120, 100, 90] },
  { name: 'Qualified', data: [230, 180, 150, 130] },
  { name: 'Proposal', data: [180, 150, 120, 100] },
  { name: 'Won', data: [200, 170, 140, 120] }
]

const userStageOptions = {
  chart: { stacked: true },
  plotOptions: { bar: { borderRadius: 6 } },
  xaxis: { categories: ['John', 'Sarah', 'Mike', 'Emily'] },
  legend: { position: 'bottom' }
}

/* ------------------ PERFORMANCE ------------------ */
const performanceSeries = [
  { name: 'Revenue', data: [45000, 52000, 48000, 61000, 58000, 67000] }
]

const performanceOptions = {
  chart: { toolbar: { show: false } },
  xaxis: { categories: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6'] },
  dataLabels: { enabled: false }
}

/* ------------------ TASK KPI ------------------ */
const tasksSeries = [
  { name: 'Completed', data: [45, 38, 32, 28] },
  { name: 'In Progress', data: [12, 10, 8, 7] },
  { name: 'Pending', data: [8, 6, 5, 4] },
  { name: 'Overdue', data: [3, 2, 1, 2] }
]

const tasksOptions = {
  chart: { stacked: true },
  plotOptions: { bar: { horizontal: true, borderRadius: 6 } },
  xaxis: { categories: ['John', 'Sarah', 'Mike', 'Emily'] },
  legend: { position: 'bottom' }
}
</script>

<style scoped>
.material-symbols-rounded {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
</style>
