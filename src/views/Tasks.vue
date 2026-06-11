<template>
  <div class="space-y-6">
    <!-- Header Title and Add Action -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
      <div>
        <h1 class="text-xl md:text-2xl font-heading font-extrabold text-slate-800 tracking-tight">
          Kanban Task & Follow-up
        </h1>
        <p class="text-slate-500 mt-0.5 text-xs md:text-sm">
          Pantau aktivitas harian, follow-up prospek, negosiasi kontrak, dan integrasi teknis.
        </p>
      </div>
      <el-button type="primary" size="large" class="!rounded-xl !font-bold self-start sm:self-center" @click="dialogs.add = true">
        <el-icon class="mr-2"><Plus /></el-icon> Buat Task Baru
      </el-button>
    </div>

    <!-- Stats Counters Row -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- NEW/PENDING -->
      <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
        <div class="p-3 bg-amber-100 text-amber-600 rounded-xl">
          <el-icon :size="24"><Timer /></el-icon>
        </div>
        <div>
          <span class="text-xs text-slate-400 font-bold uppercase tracking-wide block">Task Baru (Pending)</span>
          <span class="text-2xl font-black font-heading text-slate-800 mt-1">{{ countPending }}</span>
        </div>
      </div>
      <!-- DELAYED -->
      <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
        <div class="p-3 bg-orange-100 text-orange-600 rounded-xl">
          <el-icon :size="24"><Warning /></el-icon>
        </div>
        <div>
          <span class="text-xs text-slate-400 font-bold uppercase tracking-wide block">Task Ditunda (Delayed)</span>
          <span class="text-2xl font-black font-heading text-slate-800 mt-1">{{ countDelayed }}</span>
        </div>
      </div>
      <!-- COMPLETE -->
      <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
        <div class="p-3 bg-green-100 text-green-600 rounded-xl">
          <el-icon :size="24"><Finished /></el-icon>
        </div>
        <div>
          <span class="text-xs text-slate-400 font-bold uppercase tracking-wide block">Task Selesai (Completed)</span>
          <span class="text-2xl font-black font-heading text-slate-800 mt-1">{{ countComplete }}</span>
        </div>
      </div>
    </div>

    <!-- Kanban Board Section -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      <!-- COLUMN 1: PENDING -->
      <div class="bg-slate-100 p-4 rounded-2xl border border-slate-200/60">
        <div class="flex items-center justify-between mb-4 px-2">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <h3 class="font-heading font-extrabold text-slate-700 text-sm md:text-base">Belum Diproses</h3>
          </div>
          <el-badge :value="tasksPending.length" type="warning" />
        </div>

        <div class="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          <div v-if="tasksPending.length === 0" class="text-center py-8 text-slate-400 text-xs italic bg-white/40 rounded-xl border border-dashed border-slate-200">
            Tidak ada task pending.
          </div>

          <div
            v-for="task in tasksPending"
            :key="task.TASK_ID"
            class="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-amber-400/50 transition-all duration-300 flex flex-col gap-3 group"
          >
            <div>
              <div class="flex items-center justify-between gap-2">
                <span :class="['px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide', priorityClass(task.TASK_PRIORITY)]">
                  {{ task.TASK_PRIORITY }}
                </span>
                <span class="text-[10px] text-slate-400 font-mono">{{ task.TASK_DUE_DATE }}</span>
              </div>
              <h4 class="font-bold text-slate-800 text-sm mt-2 leading-tight">
                {{ task.TASK_TITLE }}
              </h4>
              <p class="text-xs text-slate-500 font-semibold mt-1 flex items-center gap-1">
                <el-icon><OfficeBuilding /></el-icon> {{ task.TASK_COMPANY }}
              </p>
              <p class="text-xs text-slate-500 mt-2 bg-slate-50 p-2 rounded-lg border border-slate-100 italic">
                "{{ task.TASK_NOTE }}"
              </p>
            </div>

            <div class="h-[1px] bg-slate-100"></div>

            <div class="flex items-center justify-between">
              <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{{ task.TASK_TYPE }}</span>
              <div class="flex gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                <el-button type="warning" size="small" circle @click="moveStatus(task.TASK_ID, 'Ditunda')" title="Tunda">
                  <el-icon><Warning /></el-icon>
                </el-button>
                <el-button type="success" size="small" circle @click="moveStatus(task.TASK_ID, 'Selesai')" title="Selesaikan">
                  <el-icon><Check /></el-icon>
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- COLUMN 2: DELAYED -->
      <div class="bg-slate-100 p-4 rounded-2xl border border-slate-200/60">
        <div class="flex items-center justify-between mb-4 px-2">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
            <h3 class="font-heading font-extrabold text-slate-700 text-sm md:text-base">Ditunda / Hold</h3>
          </div>
          <el-badge :value="tasksDelayed.length" type="danger" />
        </div>

        <div class="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          <div v-if="tasksDelayed.length === 0" class="text-center py-8 text-slate-400 text-xs italic bg-white/40 rounded-xl border border-dashed border-slate-200">
            Tidak ada task ditunda.
          </div>

          <div
            v-for="task in tasksDelayed"
            :key="task.TASK_ID"
            class="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-orange-500/50 transition-all duration-300 flex flex-col gap-3 group"
          >
            <div>
              <div class="flex items-center justify-between gap-2">
                <span :class="['px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide', priorityClass(task.TASK_PRIORITY)]">
                  {{ task.TASK_PRIORITY }}
                </span>
                <span class="text-[10px] text-slate-400 font-mono">{{ task.TASK_DUE_DATE }}</span>
              </div>
              <h4 class="font-bold text-slate-800 text-sm mt-2 leading-tight">
                {{ task.TASK_TITLE }}
              </h4>
              <p class="text-xs text-slate-500 font-semibold mt-1 flex items-center gap-1">
                <el-icon><OfficeBuilding /></el-icon> {{ task.TASK_COMPANY }}
              </p>
              <p class="text-xs text-slate-500 mt-2 bg-slate-50 p-2 rounded-lg border border-slate-100 italic">
                "{{ task.TASK_NOTE }}"
              </p>
            </div>

            <div class="h-[1px] bg-slate-100"></div>

            <div class="flex items-center justify-between">
              <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{{ task.TASK_TYPE }}</span>
              <div class="flex gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                <el-button type="primary" size="small" circle @click="moveStatus(task.TASK_ID, 'Pending')" title="Aktifkan Lagi">
                  <el-icon><Refresh /></el-icon>
                </el-button>
                <el-button type="success" size="small" circle @click="moveStatus(task.TASK_ID, 'Selesai')" title="Selesaikan">
                  <el-icon><Check /></el-icon>
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- COLUMN 3: COMPLETE -->
      <div class="bg-slate-100 p-4 rounded-2xl border border-slate-200/60">
        <div class="flex items-center justify-between mb-4 px-2">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-green-500"></span>
            <h3 class="font-heading font-extrabold text-slate-700 text-sm md:text-base">Selesai</h3>
          </div>
          <el-badge :value="tasksComplete.length" type="success" />
        </div>

        <div class="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          <div v-if="tasksComplete.length === 0" class="text-center py-8 text-slate-400 text-xs italic bg-white/40 rounded-xl border border-dashed border-slate-200">
            Belum ada task selesai.
          </div>

          <div
            v-for="task in tasksComplete"
            :key="task.TASK_ID"
            class="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-green-500/50 transition-all duration-300 flex flex-col gap-3 group"
          >
            <div>
              <div class="flex items-center justify-between gap-2">
                <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-slate-100 text-slate-400 line-through">
                  {{ task.TASK_PRIORITY }}
                </span>
                <span class="text-[10px] text-slate-400 font-mono">{{ task.TASK_DUE_DATE }}</span>
              </div>
              <h4 class="font-bold text-slate-500 line-through text-sm mt-2 leading-tight">
                {{ task.TASK_TITLE }}
              </h4>
              <p class="text-xs text-slate-400 font-semibold mt-1 flex items-center gap-1">
                <el-icon><OfficeBuilding /></el-icon> {{ task.TASK_COMPANY }}
              </p>
              <p class="text-xs text-slate-400 mt-2 bg-slate-50 p-2 rounded-lg border border-slate-100 italic line-through">
                "{{ task.TASK_NOTE }}"
              </p>
            </div>

            <div class="h-[1px] bg-slate-100"></div>

            <div class="flex items-center justify-between">
              <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{{ task.TASK_TYPE }}</span>
              <div class="flex gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                <el-button type="info" size="small" circle @click="moveStatus(task.TASK_ID, 'Pending')" title="Buka Kembali">
                  <el-icon><Refresh /></el-icon>
                </el-button>
                <el-button type="danger" size="small" circle @click="handleDelete(task.TASK_ID)" title="Hapus Permanen">
                  <el-icon><Delete /></el-icon>
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- DIALOG: ADD TASK -->
    <el-dialog v-model="dialogs.add" title="Buat Task Baru" width="500px">
      <el-form :model="formModel" ref="formRef" :rules="formRules" label-position="top">
        <el-form-item label="Judul Aktivitas / Task" prop="TASK_TITLE">
          <el-input v-model="formModel.TASK_TITLE" placeholder="Contoh: Kirim PKS Revisi ke Client" />
        </el-form-item>
        <el-form-item label="Nama Perusahaan Client" prop="TASK_COMPANY">
          <el-input v-model="formModel.TASK_COMPANY" placeholder="Contoh: PT ABC Logistics" />
        </el-form-item>
        <div class="grid grid-cols-2 gap-4">
          <el-form-item label="Tipe Task" prop="TASK_TYPE">
            <el-select v-model="formModel.TASK_TYPE" placeholder="Pilih Tipe" class="w-full">
              <el-option label="Call / Telepon" value="Call" />
              <el-option label="Meeting / Kunjungan" value="Meeting" />
              <el-option label="Kirim Proposal" value="Proposal" />
              <el-option label="Teknis / Integrasi" value="Teknis" />
              <el-option label="Tanda Tangan Kontrak" value="Kontrak" />
            </el-select>
          </el-form-item>
          <el-form-item label="Prioritas" prop="TASK_PRIORITY">
            <el-select v-model="formModel.TASK_PRIORITY" placeholder="Pilih Prioritas" class="w-full">
              <el-option label="Rendah" value="Rendah" />
              <el-option label="Sedang" value="Sedang" />
              <el-option label="Tinggi" value="Tinggi" />
              <el-option label="Sangat Tinggi" value="Sangat Tinggi" />
            </el-select>
          </el-form-item>
        </div>
        <el-form-item label="Tenggat Waktu (Due Date)" prop="TASK_DUE_DATE">
          <el-date-picker
            v-model="formModel.TASK_DUE_DATE"
            type="date"
            placeholder="Pilih Tanggal"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            class="!w-full"
          />
        </el-form-item>
        <el-form-item label="Catatan Tambahan (Notes)" prop="TASK_NOTE">
          <el-input v-model="formModel.TASK_NOTE" type="textarea" placeholder="Detail deskripsi dari task..." />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="flex justify-end gap-2">
          <el-button @click="dialogs.add = false" class="!rounded-xl">Batal</el-button>
          <el-button type="primary" @click="saveAdd" class="!rounded-xl !px-6">Simpan Task</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { mockTasks } from '../utils/mockData'

const tasksDb = ref([...mockTasks])

const dialogs = reactive({
  add: false
})
const formRef = ref(null)

const formModel = ref({
  TASK_TITLE: '',
  TASK_COMPANY: '',
  TASK_TYPE: '',
  TASK_PRIORITY: '',
  TASK_DUE_DATE: '',
  TASK_NOTE: ''
})

const formRules = {
  TASK_TITLE: [{ required: true, message: 'Judul task wajib diisi', trigger: 'blur' }],
  TASK_COMPANY: [{ required: true, message: 'Nama perusahaan wajib diisi', trigger: 'blur' }],
  TASK_TYPE: [{ required: true, message: 'Tipe task wajib dipilih', trigger: 'change' }],
  TASK_PRIORITY: [{ required: true, message: 'Prioritas wajib dipilih', trigger: 'change' }],
  TASK_DUE_DATE: [{ required: true, message: 'Tanggal wajib diisi', trigger: 'change' }]
}

// Columns Filter
const tasksPending = computed(() => tasksDb.value.filter(t => t.TASK_STATUS === 'Pending'))
const tasksDelayed = computed(() => tasksDb.value.filter(t => t.TASK_STATUS === 'Ditunda'))
const tasksComplete = computed(() => tasksDb.value.filter(t => t.TASK_STATUS === 'Selesai'))

// Counts
const countPending = computed(() => tasksPending.value.length)
const countDelayed = computed(() => tasksDelayed.value.length)
const countComplete = computed(() => tasksComplete.value.length)

// Style priority tag helper
function priorityClass(priority) {
  switch (priority) {
    case 'Sangat Tinggi':
      return 'bg-red-100 text-red-700 border border-red-200'
    case 'Tinggi':
      return 'bg-orange-100 text-orange-700 border border-orange-200'
    case 'Sedang':
      return 'bg-blue-100 text-blue-700 border border-blue-200'
    default:
      return 'bg-slate-100 text-slate-600 border border-slate-200'
  }
}

// Transition status
function moveStatus(id, newStatus) {
  const task = tasksDb.value.find(t => t.TASK_ID === id)
  if (task) {
    task.TASK_STATUS = newStatus
    ElMessage({
      message: `Status task diubah ke "${newStatus}"`,
      type: 'success',
      duration: 1500
    })
  }
}

// Save Add
function saveAdd() {
  formRef.value.validate((valid) => {
    if (valid) {
      const newTask = {
        ...formModel.value,
        TASK_ID: `T00${tasksDb.value.length + 1}`,
        TASK_STATUS: 'Pending',
        TASK_OWNER: 'Yudha Pratama'
      }

      tasksDb.value.unshift(newTask)
      dialogs.add = false
      ElMessage({ message: 'Task baru berhasil dibuat', type: 'success' })
    }
  })
}

// Delete
function handleDelete(id) {
  ElMessageBox.confirm(
    'Apakah Anda yakin ingin menghapus task ini secara permanen?',
    'Konfirmasi Hapus Task',
    {
      confirmButtonText: 'Hapus',
      cancelButtonText: 'Batal',
      type: 'warning',
      confirmButtonClass: '!bg-red-500 !border-red-500 hover:!bg-red-600'
    }
  ).then(() => {
    tasksDb.value = tasksDb.value.filter(t => t.TASK_ID !== id)
    ElMessage({ message: 'Task dihapus permanen', type: 'success' })
  }).catch(() => {})
}
</script>

<style scoped>
/* Custom scrollbar for columns */
::-webkit-scrollbar {
  width: 4px;
}
</style>
