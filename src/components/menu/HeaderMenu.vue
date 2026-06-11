<template>
  <div class="header-nav bg-white border-b border-gray-100">
    <div class="w-full h-16 flex items-center justify-between">
      <div class="w-full md:flex items-center hidden">
        <img src="/logo.png" alt="" class="w-10 h-10 rounded object-cover mr-2" />
        <p>WAHANA CRM</p>
      </div>
      <div class="md:hidden">
        <img src="/logo.png" alt="" class="w-10 h-10 rounded object-cover mr-2" />
      </div>
      <div class="flex items-center space-x-2">
        <el-popover placement="bottom-end" :width="220" trigger="click" popper-class="user-popover-card" :hide-after="100">
          <template #reference>
            <el-tag type="success">
              <div class="w-full flex items-center justify-center space-x-2 cursor-pointer">
                <el-icon class="text-black">
                  <user />
                </el-icon>
                <p class="md:text-sm text-xs font-semibold text-gray-700 tracking-wide">{{ userName }}</p>
              </div>
            </el-tag>
          </template>

          <div class="py-2 w-52">
            <el-tag class="cursor-pointer" type="success">
              <span class="md:text-sm text-xs text-gray-500 tracking-wider">{{ jabatan }}</span>
            </el-tag>
            <h4 class="my-2 text-xs font-semibold uppercase text-gray-500 border-b pb-2">Pengaturan Akun</h4>
            <div class="space-y-1">
              <div @click="onUpdatePass" class="flex items-center space-x-2 py-2 cursor-pointer hover:bg-gray-50 transition duration-150 rounded">
                <el-icon :size="16" class="text-yellow-600">
                  <Lock />
                </el-icon>
                <span class="text-sm font-medium text-gray-700">Ubah Password</span>
              </div>
            </div>
          </div>
        </el-popover>
        <el-popconfirm
          confirm-button-text="Ya"
          cancel-button-text="Batal"
          :icon="InfoFilled"
          icon-color="#FF3838"
          title="Apakah Anda yakin ingin logout?"
          @confirm="logout"
        >
          <template #reference>
            <el-tag class="cursor-pointer" type="danger">Logout</el-tag>
          </template>
        </el-popconfirm>
      </div>
    </div>
  </div>
  <el-dialog v-model="addDialog" top="10vh" :width="dialogWidth()">
    <template #header>
      <h1 class="border-b pb-5">Ubah User Password</h1>
    </template>
    <el-form :model="addData" :label-position="labelPosition()" label-width="160px" ref="addForm" :rules="rule">
      <el-form-item label="Password Lama" prop="USER_PASSWORD_OLD">
        <el-input v-model="addData.USER_PASSWORD_OLD" placeholder="Password Lama" type="password" :prefix-icon="Lock"></el-input>
      </el-form-item>
      <el-form-item label="Password Baru" prop="USER_PASSWORD">
        <el-input
          v-model="addData.USER_PASSWORD"
          placeholder="Password Baru"
          type="password"
          :prefix-icon="Lock"
          :disabled="!addData.USER_PASSWORD_OLD"
        ></el-input>
      </el-form-item>
      <el-form-item label="Ulangi Password Baru" prop="USER_PASSWORD_CHECK">
        <el-input
          v-model="addData.USER_PASSWORD_CHECK"
          placeholder="Ulangi Password Baru"
          type="password"
          :prefix-icon="Lock"
          :disabled="!addData.USER_PASSWORD_OLD"
        ></el-input>
        <div class="pt-2" v-if="addData.USER_PASSWORD?.length > 3 || addData.USER_PASSWORD_CHECK?.length > 3">
          <el-tag type="danger" class="p-2" v-if="addData.USER_PASSWORD != addData.USER_PASSWORD_CHECK">
            <el-icon>
              <InfoFilled />
            </el-icon>
            <span class="pb-2">Tidak Cocok</span></el-tag
          >
          <el-tag type="success" class="p-2" v-else>
            <el-icon>
              <CircleCheck />
            </el-icon>
            <span class="pb-2">Cocok</span></el-tag
          >
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <section class="space-x-2">
        <button
          class="px-4 py-2 bg-[#0d8e92] text-white text-sm rounded"
          @click="onSaveAdd"
          :disabled="addData.USER_PASSWORD != addData.USER_PASSWORD_CHECK"
        >
          Simpan
        </button>
        <button class="px-4 py-2 bg-[#fd5256] text-white text-sm rounded" @click="cancelAdd">Batal</button>
      </section>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { loading } from '../../helper/utils';
import { labelPosition, dialogWidth } from '../../helper/appUtils';
import { ElMessage, ElMessageBox } from 'element-plus';
import HOOKS from '../../hooks/bundleOneOps';
import Cookies from 'js-cookie';
import { Lock, InfoFilled, CircleCheck, User } from '@element-plus/icons-vue';
import API from '../../api/apiUser';

const store = useStore();
const route = useRoute();
const router = useRouter();
const title = computed(() => store.getters.currentMenuName);
const userName = computed(() => store.getters.userName);
const codeAccount = computed(()=> store.getters.accountCode)
const jabatan = computed(() => store.getters.jabatanLabel);
const { addData, addForm, addDialog, saveAdd, cancelAdd } = HOOKS.useAddOneData();

function logout() {
  loading();
  Cookies.remove('ACCESS');
  localStorage.clear();
  sessionStorage.clear();
  if (!Cookies.get('ACCESS')) {
    setTimeout(() => {
      store.commit('setLogout');
      loading().close();
      globalThis.location.href = '/login';
    }, 2000);
  }
}

function onUpdatePass() {
  addDialog.value = true;
}

const onSaveAdd = async () => {
  if (!addForm.value) return;

  await addForm.value.validate(async (valid) => {
    if (!valid) return;

    await ElMessageBox.confirm('Apakah anda yakin ingin mengubah password?', 'Konfirmasi', {
      type: 'warning',
      confirmButtonText: 'Ya',
      cancelButtonText: 'Batal',
    });

    loading.value = true;

    await API.changePassword({
      login: String(codeAccount.value),
      passo: addData.value.USER_PASSWORD_OLD,
      passn1: addData.value.USER_PASSWORD,
      passn2: addData.value.USER_PASSWORD_CHECK,
    });

    ElMessage.success('Password berhasil diubah. Silakan login kembali.');

    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.clear();
    
    addDialog.value = false;

    router.push('/login');

    loading.value = false;
  });
};
const rule = {
  USER_PASSWORD_OLD: [{ required: true, message: 'Password lama wajib diisi', trigger: 'blur' }],
  USER_PASSWORD: [
    { required: true, message: 'Password baru wajib diisi', trigger: 'blur' },
    { min: 4, message: 'Minimal 4 karakter', trigger: 'blur' },
  ],
  USER_PASSWORD_CHECK: [{ required: true, message: 'Ulangi password wajib diisi', trigger: 'blur' }],
};
</script>
