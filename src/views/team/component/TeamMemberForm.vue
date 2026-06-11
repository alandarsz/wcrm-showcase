<template>
  <div class="p-4">
    <el-form 
      ref="formRef" 
      :model="formData" 
      :rules="rules" 
      label-position="top"
    >
      <!-- Row 1: Nama + NIK -->
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="Nama Lengkap" prop="nama">
            <el-input v-model="formData.nama" placeholder="Nama Lengkap" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="NIK" prop="nik">
            <el-input v-model="formData.nik" placeholder="NIK (8 digit)" />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- Row 2: Jabatan + Peran -->
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="Jabatan" prop="jabatan">
            <el-select v-model="formData.jabatan" placeholder="Pilih Jabatan" style="width: 100%">
              <el-option label="LB01: PELAKSANA SUPIR LINTAS BORONGAN" value="LB01" />
              <el-option label="LH01: LINE HAUL DRIVER" value="LH01" />
              <el-option label="IT03: IT STAFF" value="IT03" />
              <el-option label="HR01: HR STAFF" value="HR01" />
              <el-option label="OPS01: OPERATIONAL STAFF" value="OPS01" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Peran" prop="peran">
            <el-select v-model="formData.peran" placeholder="Pilih Peran" style="width: 100%">
              <el-option label="Line Haul" value="LHL" />
              <el-option label="Driver" value="DRV" />
              <el-option label="Admin" value="ADM" />
              <el-option label="Supervisor" value="SPV" />
              <el-option label="Manager" value="MGR" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- Row 3: Hub -->
      <el-form-item label="Hub Lokasi Kerja" prop="hubs">
        <el-select v-model="formData.hubs" placeholder="Pilih Hub" style="width: 100%" filterable>
          <el-option label="323 - Jakarta Pusat" value="323" />
          <el-option label="770 - Bandung" value="770" />
          <el-option label="G14 - Surabaya" value="G14" />
          <el-option label="S01 - Semarang" value="S01" />
          <el-option label="S32 - Yogyakarta" value="S32" />
          <el-option label="S70 - Medan" value="S70" />
          <el-option label="S71 - Palembang" value="S71" />
          <el-option label="W1088 - IT HUB" value="W1088" />
        </el-select>
      </el-form-item>

      <!-- Row 4: Email -->
      <el-form-item label="Email" prop="email">
        <el-input v-model="formData.email" type="email" placeholder="email@domain.com" />
      </el-form-item>

      <!-- Row 5: Handphone -->
      <el-form-item label="Handphone" prop="handphone">
        <el-input v-model="formData.handphone" placeholder="08xxxxxxxxxx" />
      </el-form-item>

      <!-- Buttons -->
      <div style="display: flex; justify-content: flex-end; gap: 8px; margin-top: 16px; border-top: 1px solid #eee; padding-top: 16px;">
        <el-button @click="handleCancel">Batal</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">
          {{ mode === 'add' ? 'DAFTARKAN' : 'UBAH' }}
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue';
import { ElMessage } from 'element-plus';

const props = defineProps({
  mode: {
    type: String,
    default: 'add',
  },
  initialData: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(['submit', 'cancel']);

const formRef = ref(null);
const submitting = ref(false);

const formData = reactive({
  nama: '',
  nik: '',
  jabatan: '',
  peran: '',
  hubs: '',
  email: '',
  handphone: '',
});

const rules = {
  nama: [{ required: true, message: 'Nama Lengkap wajib diisi', trigger: 'blur' }],
  nik: [{ required: true, message: 'NIK wajib diisi', trigger: 'blur' }],
  jabatan: [{ required: true, message: 'Jabatan wajib dipilih', trigger: 'change' }],
  peran: [{ required: true, message: 'Peran wajib dipilih', trigger: 'change' }],
  hubs: [{ required: true, message: 'Hub Lokasi Kerja wajib dipilih', trigger: 'change' }],
  email: [
    { required: true, message: 'Email wajib diisi', trigger: 'blur' },
    { type: 'email', message: 'Format email tidak valid', trigger: 'blur' },
  ],
  handphone: [{ required: true, message: 'Nomor Handphone wajib diisi', trigger: 'blur' }],
};

// Watch for initial data in edit mode
watch(() => props.initialData, (newData) => {
  if (newData && Object.keys(newData).length > 0) {
    formData.nama = newData.nama || newData.name || '';
    formData.nik = newData.nik || '';
    formData.jabatan = newData.jabatan || newData.pos || '';
    formData.peran = newData.peran || newData.role || '';
    formData.hubs = newData.hubs || '';
    formData.email = newData.email || '';
    formData.handphone = newData.handphone || newData.phone || '';
  }
}, { immediate: true });

function handleCancel() {
  emit('cancel');
}

async function handleSubmit() {
  if (!formRef.value) {
    console.error('Form ref is null');
    return;
  }
  
  try {
    await formRef.value.validate();
    submitting.value = true;
    
    const payload = {
      nama: formData.nama,
      nik: formData.nik,
      jabatan: formData.jabatan,
      role: formData.peran,
      hubs: formData.hubs,
      email: formData.email,
      handphone: formData.handphone,
      status: 'New',
      kode: `WAX${Date.now().toString().slice(-5)}`,
    };
    
    emit('submit', payload);
  } catch (err) {
    console.warn('Form validation failed:', err);
    ElMessage.warning('Mohon lengkapi semua field yang wajib diisi');
  } finally {
    submitting.value = false;
  }
}

onMounted(() => {
  if (props.mode === 'edit' && props.initialData) {
    Object.keys(props.initialData).forEach(key => {
      if (formData.hasOwnProperty(key)) {
        formData[key] = props.initialData[key];
      }
    });
  }
});
</script>
