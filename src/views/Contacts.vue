<template>
  <div class="space-y-6">
    <!-- Header Title and Add Action -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
      <div>
        <h1 class="text-xl md:text-2xl font-heading font-extrabold text-slate-800 tracking-tight">
          Daftar Customer / Contacts
        </h1>
        <p class="text-slate-500 mt-0.5 text-xs md:text-sm">
          Kelola database Point of Contact (PIC) dari prospek corporate maupun TOP client.
        </p>
      </div>
      <el-button type="primary" size="large" class="!rounded-xl !font-bold self-start sm:self-center" @click="handleOpenAdd">
        <el-icon class="mr-2"><Plus /></el-icon> Tambah Kontak PIC
      </el-button>
    </div>

    <!-- Filter Form Panel -->
    <div class="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
      <div class="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
        <el-icon class="text-primary" :size="18"><Filter /></el-icon>
        <span class="text-sm font-heading font-extrabold text-slate-800">Panel Pencarian & Filter</span>
      </div>

      <el-form :model="filters" label-position="top">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- Filter: Provinsi -->
          <el-form-item label="Provinsi">
            <el-select v-model="filters.province" placeholder="Semua Provinsi" clearable @change="handleProvinceChange" class="w-full">
              <el-option
                v-for="prov in mockProvinces"
                :key="prov.value"
                :label="prov.label"
                :value="prov.value"
              />
            </el-select>
          </el-form-item>

          <!-- Filter: Kota (Dependent) -->
          <el-form-item label="Kabupaten/Kota">
            <el-select
              v-model="filters.city"
              placeholder="Pilih Kota"
              clearable
              :disabled="!filters.province"
              class="w-full"
            >
              <el-option
                v-for="city in filteredCities"
                :key="city.value"
                :label="city.label"
                :value="city.value"
              />
            </el-select>
          </el-form-item>

          <!-- Filter: Sales Rep -->
          <el-form-item label="Sales Penanggung Jawab">
            <el-select v-model="filters.salesRep" placeholder="Semua Sales" clearable class="w-full">
              <el-option
                v-for="sales in mockSalesReps"
                :key="sales.id"
                :label="sales.name"
                :value="sales.name"
              />
            </el-select>
          </el-form-item>

          <!-- Global Text Search -->
          <el-form-item label="Kata Kunci Search">
            <el-input
              v-model="filters.search"
              placeholder="Nama, perusahaan, email..."
              clearable
              @input="applyFilters"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
          </el-form-item>
        </div>

        <div class="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-100">
          <el-button @click="resetFilters" class="!rounded-lg">Reset Filter</el-button>
          <el-button type="primary" @click="applyFilters" class="!rounded-lg !px-6">Terapkan Filter</el-button>
        </div>
      </el-form>
    </div>

    <!-- Data Display Wrapper -->
    <div class="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      <!-- Desktop Table View -->
      <div class="hidden md:block">
        <el-table
          :data="pagedContacts"
          stripe
          border
          style="width: 100%"
          header-cell-class-name="!bg-slate-50 !text-slate-800 !font-bold"
        >
          <el-table-column type="index" label="No" width="60" align="center" />
          <el-table-column prop="CONTACT_PIC_FIRST_NAME" label="Nama PIC" min-width="160">
            <template #default="{ row }">
              <span class="font-bold text-slate-800">
                {{ row.CONTACT_PIC_FIRST_NAME }} {{ row.CONTACT_PIC_LAST_NAME }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="CONTACT_PIC_LEADS_COMPANY_NAME" label="Perusahaan" min-width="180" />
          <el-table-column prop="CONTACT_PIC_POSITION" label="Jabatan" min-width="140" />
          <el-table-column prop="CONTACT_PIC_CITY_NAME" label="Domisili / Kota" min-width="140" />
          <el-table-column prop="CONTACT_PIC_EMAIL" label="Email" min-width="180" />
          <el-table-column prop="CONTACT_PIC_PHONE" label="No. Telepon" min-width="140" />
          <el-table-column prop="CONTACT_PIC_CREATE_BY" label="Sales PIC" min-width="140">
            <template #default="{ row }">
              <el-tag size="small" class="!rounded-md">{{ row.CONTACT_PIC_CREATE_BY }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="Aksi" width="160" align="center" fixed="right">
            <template #default="{ row }">
              <div class="flex justify-center gap-1">
                <el-button type="info" size="small" circle @click="handleOpenView(row)" title="Detail">
                  <el-icon><View /></el-icon>
                </el-button>
                <el-button type="primary" size="small" circle @click="handleOpenEdit(row)" title="Edit">
                  <el-icon><Edit /></el-icon>
                </el-button>
                <el-button type="danger" size="small" circle @click="handleDelete(row)" title="Hapus">
                  <el-icon><Delete /></el-icon>
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- Mobile List/Card View -->
      <div class="block md:hidden p-4 space-y-4">
        <div
          v-for="row in pagedContacts"
          :key="row.CONTACT_PIC_ID"
          class="p-4 rounded-xl border border-slate-150 bg-slate-50/50 flex flex-col gap-3"
        >
          <div class="flex items-start justify-between">
            <div>
              <h4 class="font-extrabold text-slate-800 text-sm">
                {{ row.CONTACT_PIC_FIRST_NAME }} {{ row.CONTACT_PIC_LAST_NAME }}
              </h4>
              <p class="text-[11px] text-slate-400 mt-0.5">{{ row.CONTACT_PIC_LEADS_COMPANY_NAME }}</p>
            </div>
            <!-- Actions Dropdown -->
            <el-dropdown trigger="click">
              <span class="cursor-pointer p-1 text-slate-400 hover:text-slate-600">
                <el-icon><MoreFilled /></el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="handleOpenView(row)"><el-icon><View /></el-icon> Detail</el-dropdown-item>
                  <el-dropdown-item @click="handleOpenEdit(row)"><el-icon><Edit /></el-icon> Edit</el-dropdown-item>
                  <el-dropdown-item divided @click="handleDelete(row)" class="!text-red-500"><el-icon><Delete /></el-icon> Hapus</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>

          <div class="h-[1px] bg-slate-200"></div>

          <div class="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span class="text-slate-400 font-medium">Jabatan</span>
              <p class="text-slate-700 font-semibold mt-0.5">{{ row.CONTACT_PIC_POSITION }}</p>
            </div>
            <div>
              <span class="text-slate-400 font-medium">Domisili</span>
              <p class="text-slate-700 font-semibold mt-0.5">{{ row.CONTACT_PIC_CITY_NAME }}</p>
            </div>
            <div class="col-span-2">
              <span class="text-slate-400 font-medium">Email / Telepon</span>
              <p class="text-slate-700 font-mono mt-0.5">{{ row.CONTACT_PIC_EMAIL }}</p>
              <p class="text-slate-500 font-mono mt-0.5">{{ row.CONTACT_PIC_PHONE }}</p>
            </div>
          </div>

          <div class="mt-1 flex justify-between items-center">
            <span class="text-[10px] text-slate-400">Owner: <strong>{{ row.CONTACT_PIC_CREATE_BY }}</strong></span>
            <el-tag size="small" type="info" class="!rounded-md">{{ row.CONTACT_SOURCE }}</el-tag>
          </div>
        </div>
      </div>

      <!-- Pagination Block -->
      <div class="p-4 border-t border-slate-100 flex justify-between items-center flex-wrap gap-3">
        <span class="text-xs text-slate-500">
          Menampilkan {{ pagedContacts.length }} dari {{ filteredContacts.length }} PIC
        </span>
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[5, 10, 20]"
          layout="sizes, prev, pager, next"
          :total="filteredContacts.length"
          class="!m-0"
        />
      </div>
    </div>

    <!-- DIALOG: VIEW DETAIL -->
    <el-dialog v-model="dialogs.view" title="Detail PIC Leads" width="550px">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-700" v-if="selectedRow">
        <!-- Identity Card -->
        <div class="space-y-4 bg-primary/5 p-5 rounded-2xl border border-primary/10">
          <h4 class="text-[10px] font-bold uppercase tracking-[0.2em] text-primary flex items-center">
            <el-icon class="mr-2"><User /></el-icon> Identitas PIC
          </h4>
          <div>
            <label class="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Nama Lengkap</label>
            <p class="text-sm font-extrabold text-slate-800">
              {{ selectedRow.CONTACT_PIC_FIRST_NAME }} {{ selectedRow.CONTACT_PIC_LAST_NAME }}
            </p>
          </div>
          <div>
            <label class="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Jabatan / Posisi</label>
            <div class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
              {{ selectedRow.CONTACT_PIC_POSITION }}
            </div>
          </div>
          <div class="pt-3 border-t border-primary/10 space-y-2">
            <div>
              <label class="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Email</label>
              <p class="text-xs font-mono font-bold text-primary underline truncate">{{ selectedRow.CONTACT_PIC_EMAIL }}</p>
            </div>
            <div>
              <label class="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">No. Handphone</label>
              <p class="text-xs font-mono font-bold text-slate-700">{{ selectedRow.CONTACT_PIC_PHONE }}</p>
            </div>
          </div>
        </div>

        <!-- Location Card -->
        <div class="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-100">
          <h4 class="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 flex items-center">
            <el-icon class="mr-2"><Location /></el-icon> Lokasi & Referensi
          </h4>
          <div>
            <label class="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Perusahaan</label>
            <p class="text-sm font-bold text-slate-800">{{ selectedRow.CONTACT_PIC_LEADS_COMPANY_NAME }}</p>
          </div>
          <div>
            <label class="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Alamat Kantor</label>
            <p class="text-xs text-slate-600 leading-relaxed">{{ selectedRow.CONTACT_PIC_ADDRESS }}</p>
          </div>
          <div class="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
            <div>
              <label class="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Daerah</label>
              <p class="text-xs font-bold text-slate-800">{{ selectedRow.CONTACT_PIC_CITY_NAME }}</p>
            </div>
            <div>
              <label class="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Kode POS</label>
              <p class="text-xs font-mono font-bold text-slate-700">{{ selectedRow.CONTACT_PIC_POSTAL_CODE }}</p>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button @click="dialogs.view = false" class="!rounded-xl !px-6 font-bold uppercase text-[11px]">Tutup</el-button>
      </template>
    </el-dialog>

    <!-- DIALOG: ADD PIC -->
    <el-dialog v-model="dialogs.add" title="Tambah Leads Kontak PIC" width="650px">
      <el-form :model="formModel" ref="addFormRef" :rules="formRules" label-position="top">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <el-form-item label="Perusahaan / Lead" prop="CONTACT_PIC_LEADS_COMPANY_NAME">
            <el-input v-model="formModel.CONTACT_PIC_LEADS_COMPANY_NAME" placeholder="Contoh: PT ABC Cargo" />
          </el-form-item>
          <el-form-item label="Jabatan PIC" prop="CONTACT_PIC_POSITION">
            <el-input v-model="formModel.CONTACT_PIC_POSITION" placeholder="Contoh: Logistics Officer" />
          </el-form-item>
          <el-form-item label="Nama Depan" prop="CONTACT_PIC_FIRST_NAME">
            <el-input v-model="formModel.CONTACT_PIC_FIRST_NAME" placeholder="Nama Depan" />
          </el-form-item>
          <el-form-item label="Nama Belakang" prop="CONTACT_PIC_LAST_NAME">
            <el-input v-model="formModel.CONTACT_PIC_LAST_NAME" placeholder="Nama Belakang" />
          </el-form-item>
          <el-form-item label="Email" prop="CONTACT_PIC_EMAIL">
            <el-input v-model="formModel.CONTACT_PIC_EMAIL" placeholder="pic@email.com" />
          </el-form-item>
          <el-form-item label="No. Telepon" prop="CONTACT_PIC_PHONE">
            <el-input v-model="formModel.CONTACT_PIC_PHONE" placeholder="Contoh: +62 812-345-678" />
          </el-form-item>
          <el-form-item label="Alamat Kantor" prop="CONTACT_PIC_ADDRESS" class="col-span-2">
            <el-input v-model="formModel.CONTACT_PIC_ADDRESS" type="textarea" placeholder="Alamat lengkap perusahaan..." />
          </el-form-item>
          <el-form-item label="Provinsi" prop="CONTACT_PIC_PROVINCE_ID">
            <el-select v-model="formModel.CONTACT_PIC_PROVINCE_ID" placeholder="Pilih Provinsi" class="w-full" @change="handleFormProvinceChange">
              <el-option v-for="p in mockProvinces" :key="p.value" :label="p.label" :value="p.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="Kabupaten/Kota" prop="CONTACT_PIC_CITY_ID">
            <el-select v-model="formModel.CONTACT_PIC_CITY_ID" placeholder="Pilih Kota" class="w-full" :disabled="!formModel.CONTACT_PIC_PROVINCE_ID">
              <el-option v-for="c in formCities" :key="c.value" :label="c.label" :value="c.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="Kode POS" prop="CONTACT_PIC_POSTAL_CODE">
            <el-input v-model="formModel.CONTACT_PIC_POSTAL_CODE" placeholder="Kode POS" />
          </el-form-item>
          <el-form-item label="Sumber Kontak" prop="CONTACT_SOURCE">
            <el-input v-model="formModel.CONTACT_SOURCE" placeholder="Contoh: LinkedIn, Cold Calling" />
          </el-form-item>
        </div>
      </el-form>
      <template #footer>
        <div class="flex justify-end gap-2">
          <el-button @click="dialogs.add = false" class="!rounded-xl">Batal</el-button>
          <el-button type="primary" @click="saveAdd" class="!rounded-xl !px-6">Simpan</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- DIALOG: EDIT PIC -->
    <el-dialog v-model="dialogs.edit" title="Edit Leads Kontak PIC" width="650px">
      <el-form :model="formModel" ref="editFormRef" :rules="formRules" label-position="top">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <el-form-item label="Perusahaan / Lead" prop="CONTACT_PIC_LEADS_COMPANY_NAME">
            <el-input v-model="formModel.CONTACT_PIC_LEADS_COMPANY_NAME" placeholder="Contoh: PT ABC Cargo" />
          </el-form-item>
          <el-form-item label="Jabatan PIC" prop="CONTACT_PIC_POSITION">
            <el-input v-model="formModel.CONTACT_PIC_POSITION" placeholder="Contoh: Logistics Officer" />
          </el-form-item>
          <el-form-item label="Nama Depan" prop="CONTACT_PIC_FIRST_NAME">
            <el-input v-model="formModel.CONTACT_PIC_FIRST_NAME" placeholder="Nama Depan" />
          </el-form-item>
          <el-form-item label="Nama Belakang" prop="CONTACT_PIC_LAST_NAME">
            <el-input v-model="formModel.CONTACT_PIC_LAST_NAME" placeholder="Nama Belakang" />
          </el-form-item>
          <el-form-item label="Email" prop="CONTACT_PIC_EMAIL">
            <el-input v-model="formModel.CONTACT_PIC_EMAIL" placeholder="pic@email.com" />
          </el-form-item>
          <el-form-item label="No. Telepon" prop="CONTACT_PIC_PHONE">
            <el-input v-model="formModel.CONTACT_PIC_PHONE" placeholder="Contoh: +62 812-345-678" />
          </el-form-item>
          <el-form-item label="Alamat Kantor" prop="CONTACT_PIC_ADDRESS" class="col-span-2">
            <el-input v-model="formModel.CONTACT_PIC_ADDRESS" type="textarea" placeholder="Alamat lengkap..." />
          </el-form-item>
          <el-form-item label="Provinsi" prop="CONTACT_PIC_PROVINCE_ID">
            <el-select v-model="formModel.CONTACT_PIC_PROVINCE_ID" placeholder="Pilih Provinsi" class="w-full" @change="handleFormProvinceChange">
              <el-option v-for="p in mockProvinces" :key="p.value" :label="p.label" :value="p.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="Kabupaten/Kota" prop="CONTACT_PIC_CITY_ID">
            <el-select v-model="formModel.CONTACT_PIC_CITY_ID" placeholder="Pilih Kota" class="w-full" :disabled="!formModel.CONTACT_PIC_PROVINCE_ID">
              <el-option v-for="c in formCities" :key="c.value" :label="c.label" :value="c.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="Kode POS" prop="CONTACT_PIC_POSTAL_CODE">
            <el-input v-model="formModel.CONTACT_PIC_POSTAL_CODE" placeholder="Kode POS" />
          </el-form-item>
          <el-form-item label="Sumber Kontak" prop="CONTACT_SOURCE">
            <el-input v-model="formModel.CONTACT_SOURCE" placeholder="Contoh: LinkedIn, Cold Calling" />
          </el-form-item>
        </div>
      </el-form>
      <template #footer>
        <div class="flex justify-end gap-2">
          <el-button @click="dialogs.edit = false" class="!rounded-xl">Batal</el-button>
          <el-button type="primary" @click="saveEdit" class="!rounded-xl !px-6">Simpan Perubahan</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import {
  mockContacts,
  mockProvinces,
  mockCities,
  mockSalesReps
} from '../utils/mockData'

// Reactive state for database
const contactsDb = ref([...mockContacts])

// Pagination & Query states
const currentPage = ref(1)
const pageSize = ref(10)
const filters = reactive({
  province: '',
  city: '',
  salesRep: '',
  search: ''
})

// Dialog states
const dialogs = reactive({
  view: false,
  add: false,
  edit: false
})

const selectedRow = ref(null)
const addFormRef = ref(null)
const editFormRef = ref(null)

const formModel = ref({
  CONTACT_PIC_ID: '',
  CONTACT_PIC_FIRST_NAME: '',
  CONTACT_PIC_LAST_NAME: '',
  CONTACT_PIC_LEADS_COMPANY_NAME: '',
  CONTACT_PIC_POSITION: '',
  CONTACT_PIC_CITY_NAME: '',
  CONTACT_PIC_PROVINCE_ID: '',
  CONTACT_PIC_CITY_ID: '',
  CONTACT_PIC_EMAIL: '',
  CONTACT_PIC_PHONE: '',
  CONTACT_PIC_ADDRESS: '',
  CONTACT_PIC_POSTAL_CODE: '',
  CONTACT_SOURCE: ''
})

const formRules = {
  CONTACT_PIC_FIRST_NAME: [{ required: true, message: 'Nama depan wajib diisi', trigger: 'blur' }],
  CONTACT_PIC_LEADS_COMPANY_NAME: [{ required: true, message: 'Perusahaan wajib diisi', trigger: 'blur' }],
  CONTACT_PIC_POSITION: [{ required: true, message: 'Jabatan wajib diisi', trigger: 'blur' }],
  CONTACT_PIC_EMAIL: [
    { required: true, message: 'Email wajib diisi', trigger: 'blur' },
    { type: 'email', message: 'Format email tidak valid', trigger: 'blur' }
  ],
  CONTACT_PIC_PHONE: [{ required: true, message: 'No. telepon wajib diisi', trigger: 'blur' }],
  CONTACT_PIC_PROVINCE_ID: [{ required: true, message: 'Provinsi wajib diisi', trigger: 'change' }],
  CONTACT_PIC_CITY_ID: [{ required: true, message: 'Kota wajib diisi', trigger: 'change' }]
}

// Dependent City selectors
const filteredCities = computed(() => {
  if (!filters.province) return []
  return mockCities[filters.province] || []
})

const formCities = computed(() => {
  if (!formModel.value.CONTACT_PIC_PROVINCE_ID) return []
  return mockCities[formModel.value.CONTACT_PIC_PROVINCE_ID] || []
})

function handleProvinceChange() {
  filters.city = ''
}

function handleFormProvinceChange() {
  formModel.value.CONTACT_PIC_CITY_ID = ''
}

// Filter logic (computes list of match results)
const filteredContacts = computed(() => {
  return contactsDb.value.filter(item => {
    // 1. Province Filter
    if (filters.province && item.CONTACT_PIC_PROVINCE_ID !== filters.province) {
      return false
    }
    // 2. City Filter
    if (filters.city && item.CONTACT_PIC_CITY_ID !== filters.city) {
      return false
    }
    // 3. Sales Rep Filter
    if (filters.salesRep && item.CONTACT_PIC_CREATE_BY !== filters.salesRep) {
      return false
    }
    // 4. Text Search Filter (name, company, email, phone)
    if (filters.search) {
      const q = filters.search.toLowerCase()
      const fullName = `${item.CONTACT_PIC_FIRST_NAME} ${item.CONTACT_PIC_LAST_NAME || ''}`.toLowerCase()
      const comp = item.CONTACT_PIC_LEADS_COMPANY_NAME.toLowerCase()
      const email = item.CONTACT_PIC_EMAIL.toLowerCase()
      const phone = item.CONTACT_PIC_PHONE.toLowerCase()

      if (!fullName.includes(q) && !comp.includes(q) && !email.includes(q) && !phone.includes(q)) {
        return false
      }
    }
    return true
  })
})

const pagedContacts = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredContacts.value.slice(start, end)
})

function applyFilters() {
  currentPage.value = 1
}

function resetFilters() {
  filters.province = ''
  filters.city = ''
  filters.salesRep = ''
  filters.search = ''
  currentPage.value = 1
  ElMessage({ message: 'Filter dibersihkan', type: 'info', duration: 1500 })
}

// Dialog Actions
function handleOpenView(row) {
  selectedRow.value = row
  dialogs.view = true
}

function handleOpenAdd() {
  formModel.value = {
    CONTACT_PIC_ID: '',
    CONTACT_PIC_FIRST_NAME: '',
    CONTACT_PIC_LAST_NAME: '',
    CONTACT_PIC_LEADS_COMPANY_NAME: '',
    CONTACT_PIC_POSITION: '',
    CONTACT_PIC_CITY_NAME: '',
    CONTACT_PIC_PROVINCE_ID: '',
    CONTACT_PIC_CITY_ID: '',
    CONTACT_PIC_EMAIL: '',
    CONTACT_PIC_PHONE: '',
    CONTACT_PIC_ADDRESS: '',
    CONTACT_PIC_POSTAL_CODE: '',
    CONTACT_SOURCE: 'LinkedIn Showcase'
  }
  dialogs.add = true
}

function saveAdd() {
  addFormRef.value.validate((valid) => {
    if (valid) {
      // Find City Label
      const pCities = mockCities[formModel.value.CONTACT_PIC_PROVINCE_ID]
      const foundCity = pCities.find(c => c.value === formModel.value.CONTACT_PIC_CITY_ID)
      formModel.value.CONTACT_PIC_CITY_NAME = foundCity ? foundCity.label : ''

      const newContact = {
        ...formModel.value,
        CONTACT_PIC_ID: `C00${contactsDb.value.length + 1}`,
        CONTACT_PIC_CREATE_DATE: new Date().toISOString(),
        CONTACT_PIC_CREATE_BY: 'Yudha Pratama',
        CONTACT_PIC_EDIT_DATE: new Date().toISOString(),
        CONTACT_PIC_EDIT_BY: 'Yudha Pratama'
      }

      contactsDb.value.unshift(newContact)
      dialogs.add = false
      ElMessage({ message: 'Kontak PIC berhasil ditambahkan', type: 'success' })
    }
  })
}

function handleOpenEdit(row) {
  selectedRow.value = row
  formModel.value = JSON.parse(JSON.stringify(row))
  dialogs.edit = true
}

function saveEdit() {
  editFormRef.value.validate((valid) => {
    if (valid) {
      // Find City Label
      const pCities = mockCities[formModel.value.CONTACT_PIC_PROVINCE_ID]
      const foundCity = pCities.find(c => c.value === formModel.value.CONTACT_PIC_CITY_ID)
      formModel.value.CONTACT_PIC_CITY_NAME = foundCity ? foundCity.label : ''

      formModel.value.CONTACT_PIC_EDIT_DATE = new Date().toISOString()
      formModel.value.CONTACT_PIC_EDIT_BY = 'Yudha Pratama'

      const index = contactsDb.value.findIndex(item => item.CONTACT_PIC_ID === formModel.value.CONTACT_PIC_ID)
      if (index !== -1) {
        contactsDb.value[index] = { ...formModel.value }
      }

      dialogs.edit = false
      ElMessage({ message: 'Kontak PIC berhasil diubah', type: 'success' })
    }
  })
}

function handleDelete(row) {
  ElMessageBox.confirm(
    `Apakah Anda yakin ingin menghapus PIC "${row.CONTACT_PIC_FIRST_NAME} ${row.CONTACT_PIC_LAST_NAME || ''}" dari list?`,
    'Konfirmasi Hapus',
    {
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal',
      type: 'warning',
      confirmButtonClass: '!bg-red-500 !border-red-500 hover:!bg-red-600',
      buttonSize: 'default'
    }
  ).then(() => {
    contactsDb.value = contactsDb.value.filter(item => item.CONTACT_PIC_ID !== row.CONTACT_PIC_ID)
    ElMessage({ message: 'Kontak PIC berhasil dihapus', type: 'success' })
  }).catch(() => {})
}
</script>

<style scoped>
:deep(.el-table th) {
  font-weight: 700 !important;
}
</style>
