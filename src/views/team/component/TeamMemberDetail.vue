<template>
  <div class="space-y-6">
    <!-- Status & ID Section -->
    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="text-sm text-gray-500">Id</label>
        <p class="font-medium text-gray-800">{{ member?.kode || '-' }}</p>
      </div>
      <div>
        <label class="text-sm text-gray-500">Status</label>
        <el-select 
          v-model="localStatus" 
          size="small" 
          class="w-full"
          @change="updateStatus"
          :loading="statusUpdating"
        >
          <el-option label="New" value="New" />
          <el-option label="Active" value="Active" />
          <el-option label="Inactive" value="Inactive" />
        </el-select>
      </div>
    </div>

    <!-- Activation Link -->
    <div>
      <label class="text-sm text-gray-500">Link Aktivasi</label>
      <div class="flex items-center gap-2 mt-1">
        <a 
          :href="activationLink" 
          target="_blank" 
          class="text-primary hover:underline text-sm break-all"
        >
          {{ activationLink }}
        </a>
        <el-button type="primary" text size="small" @click="copyLink">
          <el-icon class="mr-1"><CopyDocument /></el-icon>
          COPY
        </el-button>
      </div>
    </div>

    <!-- Basic Info -->
    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="text-sm text-gray-500">Nama Lengkap</label>
        <p class="font-medium text-gray-800">{{ member?.nama || '-' }}</p>
      </div>
      <div>
        <label class="text-sm text-gray-500">NIK</label>
        <p class="font-medium text-gray-800">{{ member?.nik || '-' }}</p>
      </div>
    </div>

    <!-- Jabatan -->
    <div class="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50 rounded-r">
      <label class="text-sm text-gray-500">Jabatan</label>
      <p class="font-medium text-gray-800">{{ getJabatanLabel(member?.jabatan) }}</p>
    </div>

    <!-- Peran -->
    <div class="flex items-center justify-between py-2 border-b">
      <div>
        <label class="text-sm text-gray-500">Peran</label>
        <p class="font-medium text-gray-800">{{ getPeranLabel(member?.role) }}</p>
      </div>
      <el-button type="danger" text size="small" circle>
        <el-icon><Close /></el-icon>
      </el-button>
    </div>

    <!-- Hub Lokasi -->
    <div class="flex items-center justify-between py-2 border-b">
      <div>
        <label class="text-sm text-gray-500">Hub Lokasi Kerja</label>
        <p class="font-medium text-gray-800">{{ member?.hubs || '-' }}</p>
      </div>
      <el-button type="danger" text size="small" circle>
        <el-icon><Close /></el-icon>
      </el-button>
    </div>

    <!-- Contact -->
    <div>
      <label class="text-sm text-gray-500">Email</label>
      <p class="font-medium text-gray-800">{{ member?.email || '-' }}</p>
      <p class="text-xs text-gray-400 mt-1">Alamat email akan digunakan untuk verifikasi login</p>
    </div>

    <div>
      <label class="text-sm text-gray-500">Handphone</label>
      <p class="font-medium text-gray-800">{{ member?.handphone || member?.phone || '-' }}</p>
      <p class="text-xs text-gray-400 mt-1">Nomor telpon atau whatsapp yang bisa dihubungi</p>
    </div>

    <!-- Actions -->
    <div class="flex justify-end gap-2 pt-4 border-t">
      <el-button @click="$emit('close')">Tutup</el-button>
      <el-button type="primary" @click="$emit('edit')">UBAH</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { CopyDocument, Close } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { editUser } from '../../../api/apiUser';

const props = defineProps({
  member: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(['edit', 'close', 'refresh']);

const localStatus = ref(props.member?.status || 'New');
const statusUpdating = ref(false);

// Watch untuk update localStatus saat member berubah
watch(() => props.member, (newMember) => {
  if (newMember?.status) {
    localStatus.value = newMember.status;
  }
}, { immediate: true, deep: true });

const activationLink = computed(() => {
  return `https://saas.ds2.pideltaro.com/app/dcaf/#/Activate/SAWAX/${props.member?.kode || ''}`;
});

// 🔥 UPDATE STATUS langsung ke database saat dropdown berubah
async function updateStatus(newStatus) {
  if (!props.member?.id) {
    ElMessage.error('ID anggota tidak valid');
    return;
  }

  statusUpdating.value = true;
  
  try {
    // Kirim semua data member dengan status baru
    // Sesuaikan format data dengan yang diharapkan editUser
    const dataToUpdate = {
      ...props.member,
      status: newStatus
    };
    
    await editUser(dataToUpdate);
    
    ElMessage.success(`Status berhasil diubah menjadi "${newStatus}"`);
    emit('refresh'); // Trigger refresh data di parent
  } catch (err) {
    console.error('Gagal update status:', err);
    ElMessage.error('Gagal mengubah status. Silakan coba lagi.');
    // Rollback ke status sebelumnya
    localStatus.value = props.member?.status || 'New';
  } finally {
    statusUpdating.value = false;
  }
}

function getJabatanLabel(code) {
  const jabatanMap = {
    'LB01': 'LB01: PELAKSANA SUPIR LINTAS BORONGAN',
    'LH01': 'LH01: LINE HAUL DRIVER',
    'IT03': 'IT03: IT STAFF',
    'HR01': 'HR01: HR STAFF',
    'OPS01': 'OPS01: OPERATIONAL STAFF',
  };
  return jabatanMap[code] || code || '-';
}

function getPeranLabel(code) {
  const peranMap = {
    'LHL': 'Line Haul',
    'DRV': 'Driver',
    'ADM': 'Admin',
    'SPV': 'Supervisor',
    'MGR': 'Manager',
  };
  return peranMap[code] || code || '-';
}

async function copyLink() {
  try {
    await navigator.clipboard.writeText(activationLink.value);
    ElMessage.success('Link aktivasi berhasil disalin!');
  } catch (err) {
    ElMessage.error('Gagal menyalin link');
  }
}
</script>

