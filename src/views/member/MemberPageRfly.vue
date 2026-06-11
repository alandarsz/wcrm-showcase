<template>
  <div class="p-4 flex flex-col items-center">
    <div class="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      
      <div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h1 class="text-xl font-bold text-gray-800 flex items-center gap-2">
            <span class="material-symbols-rounded text-blue-600">groups</span>
            Daftar Anggota Tim
          </h1>
          <p class="text-sm text-gray-500">Kelola pendaftaran dan data anggota tim anda</p>
        </div>
        <div class="flex gap-2 w-full md:w-auto">
          <el-input 
            v-model="searchQuery" 
            placeholder="Cari Nama / Email / NIK" 
            class="w-full md:w-64"
            prefix-icon="Search"
            clearable
          />
          <el-button type="primary" @click="openDialog('add')">
            <el-icon class="mr-1"><Plus /></el-icon> Tambah Anggota
          </el-button>
        </div>
      </div>

      <el-table :data="filteredMembers" style="width: 100%" v-loading="loading" stripe border>
        <el-table-column prop="name" label="Nama Lengkap" min-width="150" sortable />
        <el-table-column prop="nik" label="NIK" width="140" />
        <el-table-column prop="role" label="Peran" width="120">
          <template #default="scope">
            <el-tag :type="getRoleTag(scope.row.role)">{{ scope.row.role }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="locationRelation" label="Hubungan Lokasi" min-width="140" />
        <el-table-column prop="email" label="Email / Login" min-width="180" />
        <el-table-column prop="phone" label="Handphone" width="130" />
        <el-table-column prop="status" label="Status" width="100">
          <template #default="scope">
            <el-switch
              v-model="scope.row.status"
              active-value="Active"
              inactive-value="Inactive"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="handleStatusChange(scope.row)"
            />
          </template>
        </el-table-column>
        
        <el-table-column label="Aksi" width="100" fixed="right" align="center">
          <template #default="scope">
            <el-tooltip content="Edit Data" placement="top">
              <el-button type="primary" circle size="small" @click="openDialog('edit', scope.row)">
                <el-icon><Edit /></el-icon>
              </el-button>
            </el-tooltip>
            <el-tooltip content="Hapus" placement="top">
              <el-button type="danger" circle size="small" @click="deleteMember(scope.row.id)">
                <el-icon><Delete /></el-icon>
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog 
        v-model="dialogVisible" 
        :title="isEditMode ? 'Edit Anggota Tim' : 'Pendaftaran Anggota Baru'" 
        width="500px"
        :before-close="handleClose"
      >
        <el-form :model="form" :rules="rules" ref="memberForm" label-position="top">
          
          <el-form-item label="Nama Lengkap" prop="name">
            <el-input v-model="form.name" placeholder="Masukkan Nama Lengkap" />
          </el-form-item>

          <div class="grid grid-cols-2 gap-4">
            <el-form-item label="NIK" prop="nik">
              <el-input v-model="form.nik" placeholder="16 Digit NIK" maxlength="16" show-word-limit />
            </el-form-item>
            <el-form-item label="No. Handphone" prop="phone">
              <el-input v-model="form.phone" placeholder="08..." type="tel" />
            </el-form-item>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <el-form-item label="Peran" prop="role">
              <el-select v-model="form.role" placeholder="Pilih Peran" class="w-full">
                <el-option label="Admin" value="Admin" />
                <el-option label="Staff" value="Staff" />
                <el-option label="Supervisor" value="Supervisor" />
                <el-option label="Manager" value="Manager" />
              </el-select>
            </el-form-item>

            <el-form-item label="Hubungan Lokasi Kerja" prop="locationRelation">
              <el-select v-model="form.locationRelation" placeholder="Pilih Lokasi" class="w-full">
                <el-option label="Pusat (Head Office)" value="Pusat" />
                <el-option label="Cabang Jakarta" value="Cabang Jakarta" />
                <el-option label="Cabang Surabaya" value="Cabang Surabaya" />
                <el-option label="Remote / WFH" value="Remote" />
              </el-select>
            </el-form-item>
          </div>

          <el-form-item label="Email (Untuk Login)" prop="email">
            <el-input v-model="form.email" placeholder="nama@perusahaan.com" type="email" />
          </el-form-item>

        </el-form>

        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">Batal</el-button>
            <el-button type="primary" @click="submitForm">
              {{ isEditMode ? 'Simpan Perubahan' : 'Daftarkan Anggota' }}
            </el-button>
          </span>
        </template>
      </el-dialog>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Plus, Search, Edit, Delete } from '@element-plus/icons-vue';

// --- STATE ---
const loading = ref(false);
const dialogVisible = ref(false);
const isEditMode = ref(false);
const searchQuery = ref('');
const memberForm = ref(null);

// Data Form
const form = reactive({
  id: null,
  name: '',
  nik: '',
  role: '',
  locationRelation: '',
  email: '',
  phone: '',
  status: 'Active' // Default status
});

// Rules Validasi
const rules = {
  name: [{ required: true, message: 'Nama wajib diisi', trigger: 'blur' }],
  nik: [
    { required: true, message: 'NIK wajib diisi', trigger: 'blur' },
    { min: 16, max: 16, message: 'NIK harus 16 digit', trigger: 'blur' }
  ],
  role: [{ required: true, message: 'Peran wajib dipilih', trigger: 'change' }],
  locationRelation: [{ required: true, message: 'Lokasi wajib dipilih', trigger: 'change' }],
  email: [
    { required: true, message: 'Email wajib diisi', trigger: 'blur' },
    { type: 'email', message: 'Format email salah', trigger: 'blur' }
  ],
  phone: [{ required: true, message: 'No HP wajib diisi', trigger: 'blur' }],
};

// Dummy Data Awal (Simulasi Database)
const members = ref([
  {
    id: 1,
    name: 'Budi Santoso',
    nik: '3201123456789001',
    role: 'Manager',
    locationRelation: 'Pusat',
    email: 'budi@wahana.com',
    phone: '08123456789',
    status: 'Active'
  },
  {
    id: 2,
    name: 'Siti Aminah',
    nik: '3202123456789002',
    role: 'Staff',
    locationRelation: 'Cabang Jakarta',
    email: 'siti@wahana.com',
    phone: '08567891234',
    status: 'Active'
  }
]);

// --- COMPUTED ---
// Filter pencarian
const filteredMembers = computed(() => {
  if (!searchQuery.value) return members.value;
  const q = searchQuery.value.toLowerCase();
  return members.value.filter(m => 
    m.name.toLowerCase().includes(q) || 
    m.email.toLowerCase().includes(q) ||
    m.nik.includes(q)
  );
});

// Helper Warna Tag Role
const getRoleTag = (role) => {
  switch(role) {
    case 'Manager': return 'danger';
    case 'Supervisor': return 'warning';
    case 'Admin': return 'success';
    default: return ''; // Blue for staff
  }
};

// --- METHODS ---

// Buka Dialog (Add / Edit)
const openDialog = (type, data = null) => {
  isEditMode.value = type === 'edit';
  dialogVisible.value = true;

  if (type === 'edit' && data) {
    // Isi form dengan data yang diedit (Copy object agar tidak reaktif langsung)
    Object.assign(form, { ...data });
  } else {
    // Reset form untuk data baru
    resetForm();
  }
};

const resetForm = () => {
  Object.assign(form, {
    id: null,
    name: '',
    nik: '',
    role: '',
    locationRelation: '',
    email: '',
    phone: '',
    status: 'Active'
  });
  if (memberForm.value) memberForm.value.resetFields();
};

// Submit (Simpan / Update)
const submitForm = async () => {
  if (!memberForm.value) return;
  
  await memberForm.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      
      // Simulasi delay server
      setTimeout(() => {
        if (isEditMode.value) {
          // UPDATE DATA
          const index = members.value.findIndex(m => m.id === form.id);
          if (index !== -1) {
            members.value[index] = { ...form };
            ElMessage.success('Data anggota berhasil diperbarui');
          }
        } else {
          // INSERT DATA BARU
          const newMember = {
            ...form,
            id: Date.now(), // Generate ID Unik
            status: 'Active'
          };
          members.value.unshift(newMember); // Tambah ke paling atas
          
          // TAMPILKAN INFO LOGIN SESUAI REQUEST
          ElMessageBox.alert(
            `<strong>Anggota Berhasil Terdaftar!</strong><br/><br/>
             Nama: ${newMember.name}<br/>
             Email (Login): ${newMember.email}<br/>
             Password Default: 123456 (Contoh)`,
            'Pendaftaran Sukses',
            {
              confirmButtonText: 'OK',
              dangerouslyUseHTMLString: true,
              type: 'success'
            }
          );
        }

        loading.value = false;
        dialogVisible.value = false;
      }, 500);
    }
  });
};

// Hapus Data
const deleteMember = (id) => {
  ElMessageBox.confirm(
    'Apakah anda yakin ingin menghapus anggota ini?',
    'Peringatan',
    {
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal',
      type: 'warning',
    }
  ).then(() => {
    members.value = members.value.filter(m => m.id !== id);
    ElMessage.success('Anggota berhasil dihapus');
  });
};

// Tutup Dialog Konfirmasi
const handleClose = (done) => {
  if (form.name) {
    ElMessageBox.confirm('Data belum disimpan. Yakin ingin menutup?')
      .then(() => { done(); })
      .catch(() => {});
  } else {
    done();
  }
};

const handleStatusChange = (row) => {
  ElMessage.info(`Status ${row.name} diubah menjadi ${row.status}`);
};

</script>

<style scoped>
/* Tambahan styling jika perlu */
</style>