<template>
    <div class="min-h-screen flex items-center justify-center">
      <div class="w-full max-w-md bg-white rounded-xl p-8">
        <div class="flex flex-col items-center mb-6">
          <div class="w-14 h-14 mb-2 flex items-center justify-center rounded-xl">
            <img src="https://swbprod.stage.wahana.com/img/logo-wax.png" alt="logo" class="h-14" />
          </div>
  
          <h1 class="text-xl font-semibold text-gray-800">Aktivasi Akun</h1>
          <p class="text-sm text-gray-500 mt-1 text-center">Masukkan data akun untuk Aktivasi</p>
        </div>
        <!-- from data -->
        <el-form ref="formRef" :model="form" :rules="rules" label-position="top" class="space-y-4" @submit.prevent="onSubmit">
          <el-form-item label="Organisasi" prop="organization">
            <el-select v-model="form.organization" placeholder="Pilih Organisasi" class="w-full">
              <el-option v-for="org in organizations" :key="org.value" :label="org.label" :value="org.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="Login" prop="login">
            <el-input v-model="form.login" placeholder="Username" clearable>
              <template #prefix>
                <el-icon><User /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="Email" prop="email">
            <el-input v-model="form.email" type="email" placeholder="email@company.com" clearable>
              <template #prefix>
                <el-icon><Message /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-button type="primary" class="w-full" size="large" :loading="loading" native-type="submit" :disabled="!isFormValid">
            Verifikasi Data
          </el-button>
        </el-form>
        <!-- verifikasi akun -->
        <el-dialog v-model="verified" title="Verifikasi Akun" :width="dialogWidth()" :close-on-click-modal="false" :close-on-press-escape="false">
          <el-table :data="verifyTableData" border style="width: 100%" :show-header="false">
            <el-table-column>
              <template #default="{ row }">
                <div class="text-gray-400 text-sm">{{ row.label }}</div>
                <div class="font-medium">{{ row.value }}</div>
              </template>
            </el-table-column>
          </el-table>
          <div class="mt-4 text-sm text-gray-600">Silakan lanjutkan jika informasi sudah sesuai.</div>
          <template #footer>
            <el-button type="danger" plain @click="onCancelResetPassword"> Batal </el-button>
            <el-button type="primary" @click="onConfirmActivate"> Aktivasi </el-button>
          </template>
        </el-dialog>
        <!-- konfirmasi berhasil -->
        <el-dialog v-model="activateDialog" title="Aktivasi Password Selesai" :width="dialogWidth()" :close-on-click-modal="false" :close-on-press-escape="false">
          <div class="space-y-3 text-sm text-gray-600">
            <p>Activasi berhasil dilakukan.</p>
            <p>Email aktivasi telah dikirimkan ke:</p>
  
            <p class="text-emerald-600 font-semibold text-lg">
              {{ vData.email }}
            </p>
            <p>Silakan ikuti langkah yang disampaikan pada email tersebut untuk mengakses akun anda.</p>
          </div>
          <template #footer>
            <el-button type="primary" class="w-full" @click="goToLogin"> Login </el-button>
          </template>
        </el-dialog>
        
        <div class="my-6 text-center text-sm">
          <router-link to="/login" class="text-blue-600 hover:underline"> ← Kembali ke Login </router-link>
        </div>
      </div>
      <div class="absolute bottom-4 text-xs text-gray-400">
        <el-footer class="text-center pb-5">
          <div class="flex items-center tracking-wider flex-col text-gray-400 font-light space-y-2">
            <p class="text-sm">Version {{ AppVersion }}</p>
            <p class="text-xs">&copy; {{ new Date().getFullYear() }} Wahana Express</p>
          </div>
        </el-footer>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, reactive, onMounted, computed } from 'vue';
  import API from '../../api/apiUser';
  import { useRouter } from 'vue-router';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { dialogWidth, labelPosition } from '../../helper/appUtils';
  import { User, Message } from '@element-plus/icons-vue';
  import type { FormInstance, FormRules } from 'element-plus';
import {version} from '../../../package.json'
  
  const router = useRouter();
  const loading = ref(false);
  const verified = ref(false);
  const AppVersion = computed(() => version);
  const organizations = ref<any[]>([]);
  const activateDialog = ref(false);
  const rules: FormRules = {
    organization: [{ required: true, message: 'Organisasi wajib dipilih', trigger: 'change' }],
    login: [{ required: true, message: 'Username wajib diisi', trigger: 'blur' }],
    email: [
      { required: true, message: 'Email wajib diisi', trigger: 'blur' },
      {
        type: 'email',
        message: 'Format email tidak valid',
        trigger: ['blur', 'change'],
      },
    ],
  };
  const isFormValid = computed(() => {
    return (
      !!form.organization &&
      !!form.login &&
      !!form.email &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
    )
  })
  
  const goToLogin = () => {
    activateDialog.value = false;
    router.push('/login');
  };
  
  const form = reactive({
    organization: '',
    login: '',
    email: '',
    mobile: '',
  });
  const vData = reactive({
    partnerCode: '',
    partnerName: '',
    code: '',
    name: '',
    email: '',
    mobile: '',
  });
  
  onMounted(() => {
    loadOrganizations();
  });
  
  const verifyTableData = computed(() => [
    {
      label: 'Rekanan',
      value: vData.partnerName || '-',
    },
    {
      label: 'ID Rekanan',
      value: `${vData.code || '-'} ${vData.name || ''}`,
    },
    {
      label: 'Email',
      value: vData.email || '-',
    },
    {
      label: 'Telegram',
      value: vData.mobile || '-',
    },
  ]);
  
  const loadOrganizations = async () => {
    loading.value = true;
    try {
      const res = await API.accountPartners();
  
      organizations.value = (res?.data?.data?.partners || []).map((org: any) => ({
        label: org.label,
        value: org.value,
      }));
    } catch (err: any) {
      ElMessage.error(err.response?.data?.message || err.message || 'Gagal memuat organisasi');
    } finally {
      loading.value = false;
    }
  };
  
  const verifyAccount = async () => {
    loading.value = true;
    try {
      const res = await API.verifyAccountPartners({
        partner: form.organization,
        partnerId: form.login,
        email: form.email,
        mobile: form.mobile,
      });
  
      Object.assign(vData, res?.data?.data || {});
      verified.value = true;
  
      ElMessage.success('Verifikasi akun berhasil');
    } catch (err: any) {
      verified.value = false;
      ElMessage.error(err.response?.data?.message || err.message || 'Verifikasi gagal');
    } finally {
      loading.value = false;
    }
  };
  
//   const resetPassword = async () => {
//     loading.value = true;
//     try {
//       await API.resetPassword({
//         partner: vData.partnerCode,
//         partnerId: vData.code,
//         email: vData.email,
//         mobile: vData.mobile,
//       });
  
//       ElMessage.success('Reset password berhasil, silakan cek email');
//       activateDialog.value = true;
//     } catch (err: any) {
//       ElMessage.error(err.response?.data?.message || err.message || 'Reset password gagal');
//     } finally {
//       loading.value = false;
//     }
//   };

const onActivate = async () => {
    loading.value = true;
    try {
      await API.accountActivate({
        partner: vData.partnerCode,
        partnerId: vData.code,
        email: vData.email,
        mobile: vData.mobile,
      });

      ElMessage.success('Aktivasi akun berhasil, silakan cek email');
      activateDialog.value = true;
    } catch (err: any) {
      ElMessage.error(err.response?.data?.message || err.message || 'Aktivasi akun gagal');
    } finally {
      loading.value = false;
    }
}


  
  const onSubmit = async () => {
      await ElMessageBox.confirm('Pastikan semua data sudah benar', 'Konfirmasi', {
        confirmButtonText: 'Lanjutkan',
        cancelButtonText: 'Batal',
        type: 'warning',
      });
      await verifyAccount();
  };
  
  const onConfirmActivate = async () => {
    await onActivate();
  };
  </script>
  