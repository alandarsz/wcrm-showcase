<template>
  <div class="p-3">
    <title-dashboard show-button btn-text="Tambah Anggota" @click="addDialog = true" />

    <el-form :model="filterData" label-position="left" label-width="150px" class="mb-4">
      <div class="w-full grid grid-cols-1 md:grid-cols-2 my-2 rounded border p-2 bg-gray-100">
        <el-form-item label="Group" prop="group_search">
          <el-select-v2
            v-model="filterData.group_search"
            :options="groups"
            placeholder="Pilih Group"
            class="w-full"
            filterable
          ></el-select-v2>
        </el-form-item>
        <div class="w-full flex justify-end items-center">
          <el-button type="primary" @click="onFilterSearch">Filter</el-button>
        </div>
      </div>
    </el-form>

    <SearchAndPaginate @search="onSearch" @paginate="onPaginate" />

    <div v-loading="loading">

      <!-- table -->
      <div class="hidden md:block">
        <el-table :data="listData" :default-sort="{ prop: 'joinDate', order: 'descending' }" stripe border header-cell-class-name="table-header" style="width: 100%">
          <el-table-column type="index" label="#" width="60" />
          <el-table-column prop="id" label="Kode" min-width="120" sortable />
          <el-table-column prop="name" label="Nama" min-width="200" sortable>
            <template #default="{ row }">
              <p>{{ row.nik }} : {{ row.name }}</p>
            </template>
          </el-table-column>

          <el-table-column label="Email" min-width="180" show-overflow-tooltip sortable>
            <template #default="{ row }">
              {{ row.attribute?.membership?.email || '-' }}
            </template>
          </el-table-column>
          <el-table-column label="Peran" width="200" sortable>
            <template #default="{ row }">
              {{ row.peran || '-' }}
            </template>
          </el-table-column>
          <el-table-column label="Group" width="300" sortable>
            <template #default="{ row }">
              {{ row.grup || '-'}}
            </template>
          </el-table-column>
          <el-table-column prop="status" label="Status" width="100" align="center" sortable>
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.status?.name)" size="small">{{ row.status?.name }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="joinDate" label="Tanggal Bergabung" width="200" sortable>
            <template #default="{ row }">
              {{ dateFormatFull(row.joinDate) || '-' }}
            </template>
          </el-table-column>

          <table-column-action show-view show-edit @click-view="onViewDialog" @click-edit="onEditDialog" />
        </el-table>
      </div>

      <!-- MOBILE VIEW -->
      <div class="block md:hidden">
        <div v-if="!listData || listData.length === 0" class="text-center py-8 text-gray-500">Tidak ada data anggota.</div>
        <div v-else class="space-y-4">
          <el-card v-for="(row, index) in listData" :key="index" class="mobile-member-card" :body-style="{ padding: '16px' }" shadow="hover">
            <div class="flex justify-between items-start mb-3">
              <div>
                <h3 class="text-sm font-bold text-gray-800 leading-tight mb-1">{{ row.name || '-' }}</h3>
                <div class="text-xs text-gray-500 font-medium">
                  {{ row.CodeJb }}
                </div>
              </div>
              <el-tag :type="getStatusType(row.status?.name)" size="small" effect="light">
                {{ row.status?.name || 'Unknown' }}
              </el-tag>
            </div>
            <hr class="-mt-2 mb-2" />

            <div class="grid grid-cols-2 gap-y-2 gap-x-4 text-sm mb-4">
              <div>
                <div class="text-xs text-gray-400 uppercase tracking-wider">NIK</div>
                <div class="font-medium text-gray-700">{{ row.nik || '-' }}</div>
              </div>

              <div>
                <div class="text-xs text-gray-400 uppercase tracking-wider">Code</div>
                <div class="font-medium text-gray-700 truncate">
                  {{ row.id || '-' }}
                </div>
              </div>

              <div class="col-span-2">
                <div class="text-xs text-gray-400 uppercase tracking-wider">Peran</div>
                <div class="font-medium text-gray-700 break-all">
                  {{ row.peran || '-' }}
                </div>
              </div>

              <div class="col-span-2">
                <div class="text-xs text-gray-400 uppercase tracking-wider">Group</div>
                <div class="font-medium text-gray-700 break-all">
                 {{row.grup || '-'}}
                </div>
              </div>
            </div>
            <div class="flex gap-3 pt-3 mt-2">
              <el-button class="flex-1" type="primary" size="small" @click="onEditDialog(row)">
                <el-icon class="mr-1"><Edit /></el-icon> Ubah
              </el-button>
              <el-button class="flex-1" type="info" size="small" @click="onViewDialog(row)">
                <el-icon class="mr-1"><View /></el-icon> Detail
              </el-button>
            </div>
          </el-card>
        </div>
      </div>
    </div>

    <!-- komponen pagination atau buat gonta ganti halaman -->
    <PaginationView :total="rowTotal" :page-size="pageSize" :current-page="pageIndex" @current-change="changePage" />

    <!-- ADD MEMBER DIALOG -->
    <el-dialog v-model="addDialog" title="Pendaftaran Anggota Team" :width="dialogWidth()" :close-on-click-modal="false" class="responsive-dialog">
      <el-form ref="addForm" :model="addData" :rules="formRules" label-position="top">
        <el-row :gutter="16">
          <el-col :span="12" :xs="24">
            <el-form-item label="Nama Lengkap" prop="name">
              <el-input v-model="addData.name" placeholder="Nama Lengkap" />
            </el-form-item>
          </el-col>
          <el-col :span="12" :xs="24">
            <el-form-item label="NIK" prop="nik">
              <div style="display: flex; gap: 8px">
                <el-input v-model="addData.nik" placeholder="NIK (8 digit)" style="flex: 1" />
                <el-button type="primary" :icon="Search" @click="lookupNik" :loading="lookupLoading" />
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12" :xs="24">
            <el-form-item label="Jabatan">
              <el-input v-model="addData.pos" disabled placeholder="Terisi otomatis dari NIK" />
            </el-form-item>
          </el-col>
          <el-col :span="12" :xs="24">
            <el-form-item label="Peran" prop="role">
              <el-select v-model="addData.role" placeholder="Pilih Peran" style="width: 100%" filterable>
                <el-option v-for="item in roleOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="Hub Lokasi Kerja" prop="hubs">
          <el-select v-model="addData.hubs" placeholder="Pilih atau Ketik Hub" style="width: 100%" filterable allow-create default-first-option>
            <el-option v-for="(hub, index) in hubLocation.body" :key="index" :label="hub.label" :value="hub.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="Group" prop="group_value" v-if="addData.role != 'ADM'">
          <el-select-v2
            v-model="addData.group_value"
            :options="groups"
            placeholder="Pilih Group"
            class="w-full"
            @change="updateValue"
            filterable
          ></el-select-v2>
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model="addData.email" type="email" placeholder="email@domain.com" />
        </el-form-item>
        <el-form-item label="Handphone" prop="phone">
          <el-phone-number-input v-model="addData.phone" />
        </el-form-item>
      </el-form>
      <template #footer>
        <footer-button-dialog @save-click="onSaveAdd" @cancel-click="cancelAdd" :loading="submitting" />
      </template>
    </el-dialog>

    <!-- EDIT MEMBER DIALOG -->
    <el-dialog v-model="editDialog" title="Ubah Data Anggota Team" :width="dialogWidth()" :close-on-click-modal="false" class="responsive-dialog">
      <el-form ref="editForm" :model="editData" :rules="formRules" label-position="top">
        <el-row :gutter="16">
          <el-col :span="12" :xs="24">
            <el-form-item label="Nama Lengkap" prop="name">
              <el-input v-model="editData.name" placeholder="Nama Lengkap" />
            </el-form-item>
          </el-col>
          <el-col :span="12" :xs="24">
            <el-form-item label="NIK" prop="nik">
              <el-input v-model="editData.nik" placeholder="NIK (8 digit)" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12" :xs="24">
            <el-form-item label="Jabatan">
              <el-input v-model="editData.pos" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12" :xs="24">
            <el-form-item label="Peran" prop="role">
              <el-select v-model="editData.role" placeholder="Pilih Peran" style="width: 100%" filterable>
                <el-option v-for="item in roleOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="Hub Lokasi Kerja" prop="hubs">
          <el-select v-model="editData.hubs" placeholder="Pilih Hub" style="width: 100%" filterable>
            <el-option v-for="(hub, index) in hubLocation.body" :key="index" :label="hub.label" :value="hub.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="Group" prop="group_value">
          <el-select-v2
            v-model="editData.group_value"
            :options="groups"
            placeholder="Pilih Group"
            class="w-full"
            @change="updateValue"
            filterable
          ></el-select-v2>
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model="editData.email" type="email" placeholder="email@domain.com" />
        </el-form-item>
        <el-form-item label="Handphone" prop="phone">
          <el-phone-number-input v-model="editData.phone" />
        </el-form-item>
      </el-form>
      <template #footer>
        <footer-button-dialog @save-click="onSaveEdit" @cancel-click="cancelEdit" :loading="submitting" />
      </template>
    </el-dialog>

    <!-- VIEW MEMBER DIALOG -->
    <el-dialog v-model="viewDialog" title="Detail Anggota Team" :width="dialogWidth()" class="responsive-dialog">
      <el-form :model="viewData" label-position="top">
        <el-row :gutter="16">
          <el-col :span="12" :xs="24">
            <el-form-item label="Nama Lengkap">
              <el-input v-model="viewData.nama" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12" :xs="24">
            <el-form-item label="NIK">
              <el-input v-model="viewData.nik" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12" :xs="24">
            <el-form-item label="Jabatan">
              <el-input :model-value="viewData.jabatan" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12" :xs="24">
            <el-form-item label="Peran">
              <el-input :model-value="viewData.peran || viewData.role || '-'" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="Hub Lokasi Kerja">
          <el-input v-model="viewData.hubs" disabled />
        </el-form-item>
        <el-form-item label="Email">
          <el-input v-model="viewData.email" disabled />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="viewDialog = false">Tutup</el-button>
      </template>
    </el-dialog>

    <!-- SUCCESS DIALOG -->
    <el-dialog v-model="showSuccess" title="Pendaftaran Berhasil" width="400px">
      <div style="text-align: center; padding: 20px">
        <div style="font-size: 64px; margin-bottom: 20px">✅</div>
        <p style="margin-bottom: 16px">Anggota team berhasil didaftarkan!</p>
        <div style="background: #f5f5f5; padding: 16px; border-radius: 8px; text-align: left">
          <p><strong>Nama:</strong> {{ successData.nama }}</p>
          <p><strong>Email:</strong> {{ successData.email }}</p>
          <p><strong>Kode:</strong> {{ successData.kode }}</p>
        </div>
      </div>
      <template #footer>
        <el-button type="primary" @click="showSuccess = false">Tutup</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import HOOKS from '@/hooks/bundleOneOps';
import { ref, reactive, onMounted, computed } from 'vue';
import { Search, Edit, View } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import * as rule from '@/helper/rules';
import { dialogWidth } from '../../helper/appUtils';
import API from '../../api/apiUser';
import { useStore } from 'vuex'
import {dateFormatFull} from '../../helper/utils';

const { paginationUser, insertUser, editUser, getInfoNik, getListRole } = API;
const { listData, rowTotal, pageIndex, pageSize, getListData, changeIndex, loading, filterData, search, headers } = HOOKS.useListDataPaginate();
const { addData, addForm, addDialog, saveAdd, cancelAdd } = HOOKS.useAddOneData();
const { editData, editForm, editDialog, openEditDialog: openEditDialogHook, saveEdit2, cancelEdit } = HOOKS.useEditOneData();
const { viewData, viewDialog, openViewDialog } = HOOKS.useViewOneData();
const [hubLocation, GetHubLocation, loadingHubLocation] = HOOKS.useGetData();
GetHubLocation(() => API.getHub());

const store = useStore();
const groups = ref([]);
const submitting = ref(false);
const lookupLoading = ref(false);
const roleOptions = ref([]);
const showSuccess = ref(false);
const successData = reactive({
  nama: '',
  email: '',
  kode: '',
});
const accountId = computed(() => store.getters.accountId) || localStorage.getItem('id');
const ownerId = computed(() => store.getters.ownerId);
const role = computed(() => store.getters.role) ;
const groupValue = computed(() => store.getters.userGroup);
filterData.value.ownerId = ownerId.value || localStorage.getItem('ownerId');
filterData.value.ROLE = role.value || localStorage.getItem('role');
filterData.value.GROUP_ID = groupValue.value || localStorage.getItem('group');

onMounted(() => {
  loadGroups();
});

const loadGroups = async () => {
  try {
    const res = await API.getSalesGroup();

    groups.value = res.data.data.body.map((item) => ({
      value: item.value,
      label: item.label,
    }));
  } catch (err) {
    console.error(err);
  }
};

function updateValue(value) {
  groups.value.filter((list) => {
    if (list.value == value) {
      if (addDialog.value) addData.value.group_label = list.label;
      if (editDialog.value) editData.value.group_label = list.label;
      // you can add new set here
    }
  });
}

// RESPONSIVE DIALOG WIDTH LOGIC


onMounted(() => {
  doPaginate(pageIndex.value);
  fetchRoles();
});
function doPaginate(index = 1, pSize) {
  filterData.value.userId = accountId
  getListData(paginationUser, index, pSize || pageSize.value, search.value, filterData.value);
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

async function fetchRoles() {
  try {
    const response = await getListRole();

    if (response.data && response.data.code === 0) {
      const result = response.data;
      const foundData = result.data?.body || result.body || [];

      if (Array.isArray(foundData) && foundData.length > 0) {
        const head = result.data?.head || result.head || [];

        roleOptions.value = foundData
          .map((item, idx) => {
            let label = '';
            let value = '';

            // 1. Array of Arrays (Standard SAS Query)
            if (Array.isArray(item)) {
              const findIdx = (keywords) => head.findIndex((h) => keywords.some((k) => String(h).toUpperCase().includes(k)));
              const lIdx = findIdx(['ROLE_NAME', 'NAME', 'LABEL', 'PERAN', 'DISPLAY']);
              const vIdx = findIdx(['ROLE_ID', 'ID', 'CODE', 'VALUE', 'KEY']);

              label = String(item[lIdx !== -1 ? lIdx : item.length > 1 ? 1 : 0] || '');
              value = String(item[vIdx !== -1 ? vIdx : 0] || label);
            }
            // 2. Array of Objects
            else if (typeof item === 'object' && item !== null) {
              const keys = Object.keys(item);
              const findK = (keywords) => keys.find((k) => keywords.some((kw) => k.toUpperCase().includes(kw)));

              const lKey = findK(['ROLE_NAME', 'NAME', 'LABEL', 'PERAN', 'DISPLAY']);
              const vKey = findK(['ROLE_ID', 'ID', 'CODE', 'VALUE', 'KEY']);

              label = String(item[lKey] || item.ROLE_NAME || item.NAME || item.peran || item.role || item.name || '');
              value = String(item[vKey] || item.ROLE_ID || item.ID || item.role_id || item.id || label);
            }
            // 3. Primitives
            else {
              label = String(item);
              value = String(item);
            }

            return {
              label: label.trim(),
              value: value.trim(),
            };
          })
          .filter((r) => r.label && r.value);
      } else {
        console.warn('⚠️ API returned empty data or invalid structure for roles.');
        roleOptions.value = [];
      }
    } else {
      console.error(' API Error or Success Code != 0', response.data?.message);
      roleOptions.value = [];
    }
  } catch (error) {
    console.error(' Exception during role fetch:', error);
    roleOptions.value = [];
  }
}
// Form rules
const formRules = {
  name: [rule.requiredRule('Nama wajib diisi')],
  nik: [rule.requiredRule('NIK wajib diisi')],
  pos: [rule.requiredRule('Jabatan wajib dipilih')],
  role: [rule.requiredRule('Peran wajib dipilih')],
  hubs: [rule.requiredRule('Hub wajib dipilih')],
  email: [rule.requiredRule('Email wajib diisi'), rule.emailRule()],
  phone: [rule.requiredRule('Handphone wajib diisi')],
  group_value: [rule.requiredRule('Group wajib dipilih')],
};

// Methods
function getStatusType(status) {
  switch (status?.toLowerCase()) {
    case 'new':
      return 'primary';
    case 'active':
      return 'success';
    case 'inactive':
      return 'danger';
    default:
      return 'info';
  }
}

// NIK Lookup Function
async function lookupNik() {
  if (!addData.value.nik || addData.value.nik.length < 5) {
    ElMessage.warning('Masukkan NIK terlebih dahulu');
    return;
  }

  lookupLoading.value = true;

  try {
    const response = await getInfoNik({ nik: addData.value.nik });
    const result = response?.data;

  //  // console.log('🔍 NIK Lookup Response:', result); // Debugging log

    if (result) {
      // PENCARIAN SANGAT AMAT MENDALAM: Scan seluruh response tree
      const searchData = result.data || result;

      const foundName = findValueDeep(searchData, ['FULLNAME', 'NAME', 'NAMA', 'PIC_NAME']);
      const foundPos = findValueDeep(searchData, ['JABATANCODE', 'POS', 'JABATAN', 'POSITION', 'PIC_POS']);
      const foundHub = findValueDeep(searchData, ['HUBLOKASIKERJA', 'HUB', 'LOKASI', 'BRANCH', 'STATION']);
      const foundEmail = findValueDeep(searchData, ['EMAIL', 'MAIL', 'PIC_EMAIL', 'ADDRESS_EMAIL']);
      const foundRole = findValueDeep(searchData, ['ROLE', 'PERAN', 'ROLE_ID', 'ROLEID', 'ROLE_NAME', 'ROLENAME', 'HAK_AKSES']);

      // DISCOVERY KHUSUS UNTUK HP (Paling Prioritas)
      const foundPhone = findValueDeep(searchData, ['HANDPHONE', 'HP', 'PHONE', 'TELP', 'MOBILE', 'CELL', 'WHATSAPP', 'WA_NUMBER', 'PIC_PHONE']);

      if (foundName || foundPos || foundPhone || foundRole) {
        if (foundName) addData.value.name = String(foundName);
        if (foundPos) addData.value.pos = String(foundPos);
        if (foundHub) addData.value.hubs = String(foundHub);
        if (foundEmail) addData.value.email = String(foundEmail);

        // AUTO-FILL ROLE (PERAN)
        if (foundRole) {
          const match = roleOptions.value.find(
            (r) =>
              String(r.value).toUpperCase() === String(foundRole).toUpperCase() || String(r.label).toUpperCase() === String(foundRole).toUpperCase(),
          );
          if (match) {
            addData.value.role = match.value;
          } else {
            addData.value.role = String(foundRole);
          }
        }

        // AUTO-FILL HP DENGAN SANITIZASI TOTAL
        if (foundPhone) {
          const ph = String(foundPhone).replace(/[^\d+]/g, '');
          addData.value.phone = ph;
        }

        setTimeout(() => {
          if (addForm.value) addForm.value.clearValidate();
        }, 200);

        ElMessage.success('Data NIK berhasil ditemukan & diisi otomatis!');
      } else {
        ElMessage.info('Data NIK ditemukan namun profil (Nama/HP) belum lengkap.');
      }
    } else {
      ElMessage.info('Data NIK tidak ditemukan.');
    }
  } catch (err) {
    console.error('🔥 Supreme Error during deep NIK lookup:', err);
    ElMessage.error('Gagal memproses data NIK.');
  } finally {
    lookupLoading.value = false;
  }
}

function findValueDeep(obj, targetKeys) {
  if (!obj || typeof obj !== 'object') return null;
  const targets = targetKeys.map((k) => k.toUpperCase());
  const keys = Object.keys(obj);

  // Exact Match Loop
  for (const t of targets) {
    const exactKey = keys.find((k) => k.toUpperCase() === t);
    if (exactKey && obj[exactKey] !== null && obj[exactKey] !== undefined && obj[exactKey] !== '') {
      const val = obj[exactKey];
      return Array.isArray(val) ? val[0] : val;
    }
  }

  // Partial Match Loop
  for (const t of targets) {
    const partialKey = keys.find((k) => k.toUpperCase().includes(t));
    if (partialKey && obj[partialKey] !== null && obj[partialKey] !== undefined && obj[partialKey] !== '') {
      const val = obj[partialKey];
      return Array.isArray(val) ? val[0] : val;
    }
  }

  // Recursive Loop
  if (Array.isArray(obj)) {
    for (const item of obj) {
      const result = findValueDeep(item, targetKeys);
      if (result !== null) return result;
    }
  } else {
    for (const key in obj) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        const result = findValueDeep(obj[key], targetKeys);
        if (result !== null) return result;
      }
    }
  }
  return null;
}

const findArrayRecursive = (obj) => {
  if (Array.isArray(obj) && obj.length > 0) return obj;
  if (!obj || typeof obj !== 'object') return null;
  const priorityKeys = ['body', 'data', 'list', 'rows', 'roles'];
  for (const key of priorityKeys) {
    if (obj[key] && Array.isArray(obj[key]) && obj[key].length > 0) return obj[key];
  }
  for (const key in obj) {
    if (typeof obj[key] === 'object') {
      const found = findArrayRecursive(obj[key]);
      if (found) return found;
    }
  }
  return null;
};
async function onSaveAdd() {
  saveAdd(() => doPaginate, insertUser);
  doPaginate(pageIndex.value);
}

function onViewDialog(row) {
  // EXACT PATH berdasarkan struktur API yang terlihat di console
  // Jabatan: attribute.employment.position.name (code: B115A)
  // Peran: attribute.drp.logistic.roles[0] (value: KUR)

  const mappedData = {
    nama: row.name || row.nama || '-',
    nik: row.nik || '-',
    jabatan: row.CodeJb,
    role: row.peran || '-',
    group_value: row.attribute?.group?.value || row.group_value || '',
    group_label: row.attribute?.group?.label || row.group_label || '',
    hubs: row.attribute?.drp?.logistic?.hubs?.[0] || row.hubs || '-',
    email: row.attribute?.membership?.email || row.email || '-',
  };
  openViewDialog(mappedData);
}

function onEditDialog(row) {
  // EXACT PATH berdasarkan struktur API
  const positionObj = row.attribute?.employment?.position;
  const jabatanCode = positionObj?.code || '';
  const jabatanName = positionObj?.name || '';
  const jabatanDisplay = jabatanCode ? `${jabatanCode}: ${jabatanName}` : jabatanName || '';

  const rolesArray = row.attribute?.drp?.logistic?.roles;
  const peranValue = Array.isArray(rolesArray) && rolesArray.length > 0 ? rolesArray[0] : '';
  // // console.log(row.attribute?.drp?.logistic?.roles + '<< ini peran value');

  const mappedData = {
    id: row.id,
    name: row.name || row.nama || '',
    nik: row.nik || '',
    pos: jabatanDisplay,
    role: peranValue,
    group_value: row.attribute?.group?.value || row.group_value || '',
    group_label: row.attribute?.group?.label || row.group_label || '',
    hubs: row.attribute?.drp?.logistic?.hubs?.[0] || row.hubs || '',
    email: row.attribute?.membership?.email || row.email || '',
    phone: row.attribute?.membership?.phone || row.handphone || row.phone || '',
  };
  // // console.log(row.attribute.group.value);
  openEditDialogHook(mappedData);
}
async function onSaveEdit() {
  submitting.value = true;
  const payload = {
    name: editData.value.name,
    nik: editData.value.nik,
    pos: editData.value.pos || '',
    role: {
      value: editData.value.role,
    },
    group: {
      value: editData.value.group_value,
      label: editData.value.group_label,
    },
    hubs: editData.value.hubs,
    email: editData.value.email,
    phone: editData.value.phone,
  };

  try {
    await editUser(editData.value.id, payload);
    ElMessage({
      type: 'success',
      message: 'Data anggota berhasil diperbarui',
      duration: 2000,
    });
    editDialog.value = false;
    doPaginate(pageIndex.value);
  } catch (error) {
    ElMessage({
      type: 'error',
      message: error?.response?.data?.message || 'Gagal memperbarui data anggota',
      duration: 3000,
    });
  } finally {
    submitting.value = false;
  }
}
</script>

<style scoped>
.responsive-dialog {
  max-width: 100vw;
}
@media (max-width: 768px) {
  .responsive-dialog :deep(.el-dialog__body) {
    padding: 10px 15px;
  }
}
</style>
