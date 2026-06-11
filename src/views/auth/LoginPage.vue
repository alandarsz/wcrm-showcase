<template>
  <el-container class="bg-gray-50">
    <div class="hidden md:block">
      <el-header></el-header>
    </div>

    <el-main class="h-full flex items-center justify-center px-4">
      <div class="flex w-full max-w-6xl bg-white overflow-hidden">
        <div class="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
          <div class="text-center mb-3">
            <div class="mt-4 uppercase text-[#001BB7] tracking-widest mb-3 text-2xl font-bold">
              {{ appName }}
            </div>
            <div class="inline-block p-4 rounded-full bg-[#001BB7]">
              <img src="/logo.png" class="w-10 h-auto" />
            </div>
          </div>

          <!-- <h2 class="text-center mb-8 text-3xl tracking-wide font-extrabold text-[#2a324a]">Sign In</h2> -->
          <div class="w-[200px] mx-auto uppercase text-white mb-2 rounded-md bg-[#001BB7] tracking-widest text-center text-sm font-bold">
            wcrm V{{ AppVersion }}
          </div>
          <div class="uppercase text-[#001BB7] tracking-widest text-center text-md mb-5 font-bold">Wahana Customer Relationship Management</div>

          <el-form :model="userData" :rules="loginRules" label-position="top" ref="form" @submit.prevent="login">
            <el-form-item prop="username" label="Username">
              <el-input v-model="userData.username" placeholder="Username" :prefix-icon="User" size="large" />
            </el-form-item>

            <el-form-item prop="password" label="Password">
              <el-input v-model="userData.password" placeholder="Password" type="password" :prefix-icon="Lock" size="large" show-password />
            </el-form-item>

            <el-form-item class="mt-8">
              <el-button
                type="primary"
                native-type="submit"
                class="w-full h-10 text-lg font-semibold"
                :style="{ backgroundColor: '#001BB7', borderColor: '#001BB7' }"
              >
                LOGIN
              </el-button>
            </el-form-item>
            <div class="w-full mt-3 grid grid-cols-2 gap-3">
              <router-link to="/forgot-password" class="w-full">
                <el-button
                  type="default"
                  class="w-full h-9 font-semibold text-blue-700 border-blue-700 hover:text-yellow-600 hover:border-yellow-600"
                  plain
                >
                  Lupa Password ?
                </el-button>
              </router-link>

              <router-link to="/activate-account" class="w-full">
                <el-button
                  type="default"
                  class="w-full h-9 font-semibold text-blue-700 border-blue-700 hover:text-yellow-600 hover:border-yellow-600"
                  plain
                >
                  Aktivasi
                </el-button>
              </router-link>
            </div>
          </el-form>
        </div>

        <div class="hidden lg:flex lg:w-1/2 bg-white items-center justify-center">
          <img src="/whn3.png" alt="Wahana CRM Illustration" class="max-h-[80vh] object-contain" />
        </div>
      </div>
    </el-main>

    <el-footer class="text-center pb-5 hidden md:block">
      <div class="flex items-center tracking-wider flex-col text-gray-400 font-light space-y-2">
        <p class="text-sm">Version {{ AppVersion }}</p>
        <p class="text-xs">&copy; {{ new Date().getFullYear() }} Wahana Express</p>
      </div>
    </el-footer>
  </el-container>
</template>

<script setup>
import { computed, ref } from 'vue';
import { isValElForm, messageInfo, saveTokenToCookie } from '../../helper/utils';
import { User, Lock } from '@element-plus/icons-vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { login as loginRules } from '../../rules/UserRules';
import { catchError } from '../../helper/catchResp';
import { postAuthLogin, checkStatusUserSWB, drpChekLogisticRole, getJabatan } from '../../api-swb/apiAuth';
import { apiMenu } from '../../api-swb/apiMenu';
import { initializeGlobalStateForLogInUser, initializeGlobalState } from '../../helper/appUtils';
import jwt_decode from 'jwt-decode';
import {version} from '../../../package.json'


const appName = computed(() => import.meta.env.VITE_APP_NAME);
const AppVersion = computed(() => version);
const userData = ref({});
const form = ref(null);
const store = useStore();
const router = useRouter();

const login = async () => {
  const resultVal = await isValElForm(form.value);
  if (!resultVal) return;

  catchError(async () => {
    let logisticRoleInfo;
    let jabatan;
    let jabatanInfo;
    let menuList = []; // Default array kosong (Safety)
    let menu;

    // 1. Hit Login API
    const response = await postAuthLogin(userData.value);
    const { data, status } = response;
    const statusCode = status;

    if (statusCode === 200 && data.code === 0) {
      const { token } = data.data;
      const user = await jwt_decode(token);

      // Data Static Left Menu (KOL/Dashboard Legacy)
      const leftMenu = [
        {
          MENU_HEADER_CODE: 'DASHBOARD',
          MENU_HEADER_NAME: 'Dashboard',
          MENU_HEADER_PICTURE:
            '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-house-fill" viewBox="0 0 16 16"><path fill-rule="evenodd" d="m8 3.293 6 6V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293l6-6zm5-.793V6l-2-2V2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5z"/><path fill-rule="evenodd" d="M7.293 1.5a1 1 0 0 1 1.414 0l6.647 6.646a.5.5 0 0 1-.708.708L8 2.207 1.354 8.854a.5.5 0 1 1-.708-.708L7.293 1.5z"/></svg>',
          MENU_HEADER_PATH: 'dashboard',
          MENU_HEADER_HAS_CHILDREN: false,
        },
        {
          MENU_HEADER_CODE: 'KOL',
          MENU_HEADER_NAME: 'KOL',
          MENU_HEADER_PICTURE:
            '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-people-fill" viewBox="0 0 16 16"><path d="M13 7c1.105 0 2-.672 2-1.5S14.105 4 13 4s-2 .672-2 1.5.895 1.5 2 1.5zM3 7c1.105 0 2-.672 2-1.5S4.105 4 3 4 1 4.672 1 5.5 1.895 7 3 7zm10 1c-1.657 0-3 1.12-3 2.5V12h6v-1.5c0-1.38-1.343-2.5-3-2.5zM3 8C1.343 8 0 9.12 0 10.5V12h6v-1.5C6 9.12 4.657 8 3 8z"/></svg>',
          MENU_HEADER_PATH: 'kol',
          MENU_HEADER_HAS_CHILDREN: true,
          childrenMenu: [
            {
              MENU_HEADER_CODE: 'KOL',
              MENU_DETAIL_NAME: 'KOL List',
              MENU_DETAIL_PICTURE: null,
              MENU_DETAIL_HAVE_DETAIL: false,
              MENU_DETAIL_PATH: 'kol-list',
            },
            {
              MENU_HEADER_CODE: 'KOL',
              MENU_DETAIL_NAME: 'KOL Contents',
              MENU_DETAIL_PICTURE: null,
              MENU_DETAIL_HAVE_DETAIL: false,
              MENU_DETAIL_PATH: 'kol-contents',
            },
          ],
        },
      ];

      // initialize pertama kali untuk set auth axios, karena beberapa endpoint setelahnya membutuhkan auth
      initializeGlobalStateForLogInUser(token, user);

      // 2. Simpan Token & Data Awal
      await saveTokenToCookie(token);
      localStorage.setItem('leftMenu', JSON.stringify(leftMenu));
      localStorage.setItem('aud', user.aud);
      localStorage.setItem('code', user.code);
      localStorage.setItem('exp', user.exp);
      localStorage.setItem('iat', user.iat);
      localStorage.setItem('id', user.id);
      localStorage.setItem('iss', user.iss);
      localStorage.setItem('name', user.name);
      localStorage.setItem('session', user.session);
      localStorage.setItem('type', user.type);
      localStorage.setItem('typer', user.typer);

      // 3. Cek Status User
      const statusUser = await checkStatusUserSWB(user.code);
      if (statusUser && statusUser?.data?.code !== 0) {
        messageInfo(statusUser.data.status + ': ' + statusUser.data.message, 'error');
        return;
      } else {
        const statusCodeUser = statusUser.data.data.body.shift();
        const statusCodeNotAllow = ['2', '4', '5'];
        if (statusCodeNotAllow.includes(statusCodeUser.statusCode)) {
          messageInfo(`Status Akun anda ${statusCodeUser.statusName}, silahkan hubungi admin (HRD)`, 'error');
          return;
        }
      }

      // 4. Cek Role & Jabatan
      const logisticRole = await drpChekLogisticRole(user.code);
      if (logisticRole && logisticRole.data.code == 0) {
        logisticRoleInfo = logisticRole.data?.data?.body[0];
      }

      if (logisticRoleInfo) {
        jabatan = await getJabatan(logisticRoleInfo?.accountId);
      }
      if (jabatan && jabatan?.data?.code == 0) {
        jabatanInfo = jabatan.data?.data?.body[0];
      }

      // 5. Hit API Menu (Logika Inti)
      if (logisticRoleInfo) {
        menu = await apiMenu(logisticRoleInfo.accountId);
      }

      // Safety Check: Pastikan menu ada isinya sebelum assign
      if (menu && menu.data) {
        menuList = menu.data.data;
      }

      // 6. Finalisasi & Redirect
      localStorage.setItem('menuList', JSON.stringify(menuList));

      // Setup Global State (Dipanggil terakhir setelah menuList siap)
      initializeGlobalState(logisticRoleInfo, jabatanInfo, menuList);

      messageInfo(data.message, 'success');
      router.push('/');
    } else {
      messageInfo(data.message || 'Login failed', 'error');
    }
  });
};
</script>
