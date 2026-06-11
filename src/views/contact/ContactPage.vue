<template>
  <div>
    <!-- pagination -->
    <title-dashboard show-button @click="onAddDialog"></title-dashboard>
    <el-form :model="filterData" :label-position="labelPosition()" label-width="150px">
      <div class="w-full grid md:grid-cols-2 grid-cols-1 gap-4 border rounded p-2 bg-gray-100">
        <div>
          <el-form-item label="Periode" prop="DATE_START">
            <el-date-range-input v-model:startDate="filterData.START_DATE" v-model:endDate="filterData.END_DATE"></el-date-range-input>
          </el-form-item>
          <el-form-item label="Leads" prop="LEADS_ID">
            <el-leads-input v-model="filterData.LEADS_ID" :user-id="filterData.USER_ID"></el-leads-input>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="Provinsi" prop="PROVINCE_ID">
            <el-province-input v-model="filterData.PROVINCE_ID"></el-province-input>
          </el-form-item>
          <el-form-item label="Kabupaten/Kota" prop="CITY_ID">
            <el-city-input v-model="filterData.CITY_ID" :province-id="filterData.PROVINCE_ID"></el-city-input>
          </el-form-item>
          <el-form-item label="Sales" prop="USER_ID" v-if="['ADM', 'SLSM'].includes(role)">
            <el-inferior-input v-model="filterData.USER_ID" :user-id="accountId" :group-id="groupValue" :role="role" @handle-change="handleFilterSales" @clear="resetFilter" />
          </el-form-item>
          <div class="w-full flex justify-end items-center">
            <el-button type="primary" @click="onFilterSearch">Filter</el-button>
          </div>
        </div>
      </div>
    </el-form>
    <SearchAndPaginate @search="onSearch" @paginate="onPaginate" />

    <div class="hidden md:block">
      <el-table v-loading="loading" :data="listData" stripe border header-cell-class-name="table-header">
        <el-table-column type="index" label="No" min-width="50"></el-table-column>
        <el-table-column prop="CONTACT_PIC_CREATE_BY" label="Nama Sales" min-width="200" show-overflow-tooltip sortable></el-table-column>

        <el-table-column prop="CONTACT_PIC_FIRST_NAME" label="Nama Lengkap" min-width="200" show-overflow-tooltip sortable>
          <template #default="{ row }">
            {{ `${row.CONTACT_PIC_FIRST_NAME} ${row.CONTACT_PIC_LAST_NAME || ''}` }}
          </template>
        </el-table-column>
        <el-table-column prop="CONTACT_PIC_LEADS_COMPANY_NAME" label="Perusahaan" min-width="200" show-overflow-tooltip sortable></el-table-column>
        <el-table-column prop="CONTACT_PIC_CITY_NAME" label="Domisili" min-width="200" show-overflow-tooltip sortable></el-table-column>
        <el-table-column prop="CONTACT_PIC_POSITION" label="Jabatan" min-width="200" show-overflow-tooltip sortable></el-table-column>
        <el-table-column prop="CONTACT_PIC_EMAIL" label="Email" min-width="200" show-overflow-tooltip sortable></el-table-column>
        <el-table-column prop="CONTACT_PIC_PHONE" label="Telepon" min-width="200" show-overflow-tooltip sortable></el-table-column>
        <el-table-column prop="CONTACT_PIC_CREATE_DATE" label="Dibuat" min-width="200" show-overflow-tooltip sortable>
          <template #default="{ row }">
            {{ `${dateFormatFull(row.CONTACT_PIC_CREATE_DATE)} by ${row.CONTACT_PIC_CREATE_BY}` }}
          </template>
        </el-table-column>
        <el-table-column prop="CONTACT_PIC_EDIT_DATE" label="Diubah" min-width="200" show-overflow-tooltip sortable>
          <template #default="{ row }">
            {{ `${dateFormatFull(row.CONTACT_PIC_EDIT_DATE)} by ${row.CONTACT_PIC_EDIT_BY}` }}
          </template>
        </el-table-column>
        <table-column-action
          show-view
          show-delete
          show-edit
          @click-view="onViewDialog"
          @click-delete="onDelete"
          @click-edit="onEditDialog"
        ></table-column-action>
      </el-table>
    </div>
    <div class="block md:hidden">
      <card-list :list="listData" is-rounded>
        <card-list-item prop="name" is-single-column>
          <template #default="{ row }">
            <div class="flex justify-between items-start mb-1">
              <h3 class="font-medium text-sm text-gray-700 truncate">
                {{ row.CONTACT_PIC_LEADS_COMPANY_NAME }}
              </h3>

              <el-dropdown trigger="click">
                <el-icon class="text-gray-400 cursor-pointer">
                  <More />
                </el-icon>

                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="onViewDialog(row)"> Detail </el-dropdown-item>
                    <el-dropdown-item @click="onEditDialog(row)"> Edit </el-dropdown-item>
                    <!-- <el-dropdown-item divided @click="">
                          <span class="text-red-500">Hapus</span>
                        </el-dropdown-item> -->
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>

            <p class="text-xs text-gray-400 mb-2">{{ row.CONTACT_PIC_CITY_NAME }}</p>
            <hr />
          </template>
        </card-list-item>
        <card-list-item label="Nama Lengkap" prop="CONTACT_PIC_FIRST_NAME">
          <template #default="{ row }">
            <div class="font-semibold text-gray-900">
              {{
                `${row.CONTACT_PIC_FIRST_NAME}
                            ${row.CONTACT_PIC_LAST_NAME || ''}`
              }}
            </div>
          </template>
        </card-list-item>
        <card-list-item label="Jabatan" prop="CONTACT_PIC_POSITION">
          <template #default="{ row }">
            <div>
              <div class="text-gray-800">
                {{ row.CONTACT_PIC_POSITION }}
              </div>
            </div>
          </template>
        </card-list-item>
        <card-list-item label="No.Handphone" is-single-column>
          <template #default="{ row }">
            <div class="text-gray-800">
              {{ row.CONTACT_PIC_PHONE }}
            </div>
          </template>
        </card-list-item>
        <card-list-item>
          <template #default="{ row }">
            <el-tag type="info" size="small"> {{ row.CONTACT_PIC_CREATE_BY }}</el-tag>
          </template>
        </card-list-item>
        <card-action-button show-delete @click-delete="onDelete"></card-action-button>
      </card-list>
    </div>
    <PaginationView :total="rowTotal" :page-size="pageSize" :current-page="pageIndex" @current-change="changePage" />
    <!-- dialog insert -->
    <el-dialog v-model="addDialog" top="10vh" :width="dialogWidth()" destroy-on-close>
      <template #header>
        <h1 class="border-b">Tambah Leads Kontak</h1>
      </template>
      <el-form :model="addData" ref="addForm" :label-position="labelPosition()" label-width="150px" class="grid md:grid-cols-2 grid-cols-1 gap-4">
        <div>
          <el-form-item prop="CONTACT_PIC_LEADS_ID" label="Leads/Company" :rules="[rule.requiredRule()]">
            <el-leads-input v-model="addData.CONTACT_PIC_LEADS_ID" :user-id="filterData.USER_ID"></el-leads-input>
          </el-form-item>
          <el-form-item label="Nama Depan" prop="CONTACT_PIC_FIRST_NAME" :rules="[rule.requiredRule()]">
            <el-input v-model="addData.CONTACT_PIC_FIRST_NAME" placeholder="Nama Depan"></el-input>
          </el-form-item>
          <el-form-item label="Nama Belakang" prop="CONTACT_PIC_LAST_NAME">
            <el-input v-model="addData.CONTACT_PIC_LAST_NAME" placeholder="Nama Belakang"></el-input>
          </el-form-item>
          <el-form-item label="Jabatan" prop="CONTACT_PIC_POSITION" :rules="[rule.requiredRule()]">
            <el-input v-model="addData.CONTACT_PIC_POSITION" placeholder="Jabatan"></el-input>
          </el-form-item>
          <el-form-item label="Email" prop="CONTACT_PIC_EMAIL" :rules="[rule.emailRule()]">
            <el-input v-model="addData.CONTACT_PIC_EMAIL" type="email" placeholder="Email"></el-input>
          </el-form-item>
          <el-form-item label="Phone" prop="CONTACT_PIC_PHONE" :rules="[rule.requiredRule()]">
            <el-phone-number-input v-model="addData.CONTACT_PIC_PHONE"></el-phone-number-input>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="Alamat" prop="CONTACT_PIC_ADDRESS" :rules="[rule.requiredRule()]">
            <el-input v-model="addData.CONTACT_PIC_ADDRESS" type="textarea" placeholder="Alamat"></el-input>
          </el-form-item>
          <el-form-item label="Provinsi" prop="CONTACT_PIC_PROVINCE_ID" :rules="[rule.requiredRule()]">
            <el-province-input v-model="addData.CONTACT_PIC_PROVINCE_ID"></el-province-input>
          </el-form-item>
          <el-form-item label="Kota" prop="CONTACT_PIC_CITY_ID" :rules="[rule.requiredRule()]">
            <el-city-input v-model="addData.CONTACT_PIC_CITY_ID" placeholder="Kota" :province-id="addData.CONTACT_PIC_PROVINCE_ID"></el-city-input>
          </el-form-item>
          <el-form-item label="Kode POS" prop="CONTACT_PIC_POSTAL_CODE" :rules="[rule.requiredRule()]">
            <el-input v-model="addData.CONTACT_PIC_POSTAL_CODE" placeholder="Kode POS"></el-input>
          </el-form-item>
          <el-form-item label="Sumber" prop="CONTACT_SOURCE">
            <el-input v-model="addData.CONTACT_SOURCE" placeholder="Sumber"></el-input>
          </el-form-item>
        </div>
      </el-form>
      <template #footer>
        <footer-button-dialog @save-click="onSaveAdd" @cancel-click="cancelAdd"></footer-button-dialog>
      </template>
    </el-dialog>
    <!-- dialog edit -->
    <el-dialog v-model="editDialog" top="10vh" :width="dialogWidth()" destroy-on-close>
      <template #header>
        <h1 class="border-b">Edit Leads Kontak</h1>
      </template>
      <el-form :model="editData" ref="editForm" :label-position="labelPosition()" label-width="150px" class="grid md:grid-cols-2 grid-cols-1 gap-4">
        <div>
          <el-form-item label="Nama Depan" prop="CONTACT_PIC_FIRST_NAME" :rules="[rule.requiredRule()]">
            <el-input v-model="editData.CONTACT_PIC_FIRST_NAME" placeholder="Nama Depan"></el-input>
          </el-form-item>
          <el-form-item label="Nama Belakang" prop="CONTACT_PIC_LAST_NAME">
            <el-input v-model="editData.CONTACT_PIC_LAST_NAME" placeholder="Nama Belakang"></el-input>
          </el-form-item>
          <el-form-item label="Jabatan" prop="CONTACT_PIC_POSITION" :rules="[rule.requiredRule()]">
            <el-input v-model="editData.CONTACT_PIC_POSITION" placeholder="Jabatan"></el-input>
          </el-form-item>
          <el-form-item label="Email" prop="CONTACT_PIC_EMAIL" :rules="[rule.emailRule()]">
            <el-input v-model="editData.CONTACT_PIC_EMAIL" type="email" placeholder="Email"></el-input>
          </el-form-item>
          <el-form-item label="Phone" prop="CONTACT_PIC_PHONE" :rules="[rule.requiredRule()]">
            <el-phone-number-input v-model="editData.CONTACT_PIC_PHONE"></el-phone-number-input>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="Alamat" prop="CONTACT_PIC_ADDRESS" :rules="[rule.requiredRule()]">
            <el-input v-model="editData.CONTACT_PIC_ADDRESS" type="textarea" placeholder="Alamat"></el-input>
          </el-form-item>
          <el-form-item label="Provinsi" prop="CONTACT_PIC_PROVINCE_ID" :rules="[rule.requiredRule()]">
            <el-province-input v-model="editData.CONTACT_PIC_PROVINCE_ID"></el-province-input>
          </el-form-item>
          <el-form-item label="Kota" prop="CONTACT_PIC_CITY_ID" :rules="[rule.requiredRule()]">
            <el-city-input v-model="editData.CONTACT_PIC_CITY_ID" placeholder="Kota" :province-id="editData.CONTACT_PIC_PROVINCE_ID"></el-city-input>
          </el-form-item>
          <el-form-item label="Kode POS" prop="CONTACT_PIC_POSTAL_CODE" :rules="[rule.requiredRule()]">
            <el-input v-model="editData.CONTACT_PIC_POSTAL_CODE" placeholder="Kode POS"></el-input>
          </el-form-item>
          <el-form-item label="Sumber" prop="CONTACT_SOURCE">
            <el-input v-model="editData.CONTACT_SOURCE" placeholder="Sumber"></el-input>
          </el-form-item>
        </div>
      </el-form>
      <template #footer>
        <footer-button-dialog @save-click="onSaveEdit" @cancel-click="cancelEdit"></footer-button-dialog>
      </template>
    </el-dialog>
    <!-- dialog view -->
    <el-dialog v-model="viewDialog" top="10vh" :width="dialogWidth()" destroy-on-close class="rounded-2xl overflow-hidden shadow-2xl">
      <template #header>
        <div class="flex items-center gap-2 pb-2 border-b border-gray-100">
          <div class="w-2 h-6 bg-blue-600 rounded-full"></div>
          <h1 class="text-lg font-black text-gray-800 tracking-tight">Detail Leads Kontak</h1>
        </div>
      </template>

      <div class="grid md:grid-cols-2 grid-cols-1 gap-6 p-1 text-gray-700">
        <div class="space-y-5 bg-blue-50/30 p-5 rounded-2xl border border-blue-100/50">
          <h4 class="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-500 mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            Identitas Kontak
          </h4>

          <div>
            <label class="text-[10px] text-gray-400 font-bold uppercase block mb-1">Nama Lengkap</label>
            <p class="text-sm font-extrabold text-gray-900 tracking-tight">
              {{ viewData.CONTACT_PIC_FIRST_NAME }} {{ viewData.CONTACT_PIC_LAST_NAME || '' }}
            </p>
          </div>

          <div>
            <label class="text-[10px] text-gray-400 font-bold uppercase block mb-1">Jabatan / Posisi</label>
            <div class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
              {{ viewData.CONTACT_PIC_POSITION || '-' }}
            </div>
          </div>

          <div class="pt-4 border-t border-blue-100/50 space-y-3">
            <div class="flex items-center justify-between">
              <div>
                <label class="text-[10px] text-gray-400 font-bold uppercase block mb-1">Email</label>
                <p class="text-sm font-medium text-blue-600 underline decoration-blue-200 decoration-2 underline-offset-4 cursor-pointer">
                  {{ viewData.CONTACT_PIC_EMAIL || '-' }}
                </p>
              </div>
            </div>
            <div>
              <label class="text-[10px] text-gray-400 font-bold uppercase block mb-1">No. Handphone</label>
              <p class="text-sm font-bold text-gray-800 flex items-center gap-1">
                {{ viewData.CONTACT_PIC_PHONE || '-' }}
              </p>
            </div>
          </div>
        </div>

        <div class="space-y-5 bg-gray-50/50 p-5 rounded-2xl border border-gray-100">
          <h4 class="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Lokasi & Referensi
          </h4>

          <div>
            <label class="text-[10px] text-gray-400 font-bold uppercase block mb-1">Alamat Lengkap</label>
            <p class="text-sm text-gray-700 leading-relaxed font-medium">
              {{ viewData.CONTACT_PIC_ADDRESS || '-' }}
            </p>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-[10px] text-gray-400 font-bold uppercase block mb-1">Daerah</label>
              <p class="text-sm font-bold text-gray-800 uppercase">
                {{ viewData.CONTACT_PIC_CITY_NAME }}
              </p>
            </div>
            <div>
              <label class="text-[10px] text-gray-400 font-bold uppercase block mb-1">Kode POS</label>
              <p class="text-sm font-mono font-bold text-gray-700 tracking-widest">
                {{ viewData.CONTACT_PIC_POSTAL_CODE || '-' }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end pt-2">
          <el-button @click="viewDialog = false" class="!rounded-xl !px-8 font-bold uppercase text-[11px] tracking-wider"> Tutup </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import API from '../../api/apiContact';
import HOOKS from '../../hooks/bundleOneOps';
import { dialogWidth, labelPosition } from '../../helper/appUtils';
import * as rule from '../../helper/rules';
import { dateFormatFull } from '../../helper/utils';
import { useRoute } from 'vue-router';
import { More } from '@element-plus/icons-vue';
import { useStore } from 'vuex';
import { computed } from 'vue';

const { listData, rowTotal, pageIndex, pageSize, getListData, changeIndex, loading, filterData, search, headers } = HOOKS.useListDataPaginate();
const { addData, addForm, addDialog, saveAdd, cancelAdd } = HOOKS.useAddOneData();
const { editData, editForm, editDialog, openEditDialog, saveEdit, cancelEdit } = HOOKS.useEditOneData();
const { deleteData } = HOOKS.useDeleteOneData();
const { viewData, viewDialog, openViewDialog } = HOOKS.useViewOneData();

const store = useStore();

const route = useRoute();
const role = computed(() => store.getters.userRole) || localStorage.getItem('role');
const groupValue = computed(() => store.getters.userGroup);

const accountId = computed(() => store.getters.accountId);
filterData.value.USER_ID = accountId.value || localStorage.getItem('id');
filterData.value.ROLE = role.value || localStorage.getItem('role');
filterData.value.GROUP_ID = groupValue.value || localStorage.getItem('group');

// // console.log(route.query);


if (route.query.since || route.query.START_DATE) {
  filterData.value.START_DATE = route.query.since;
  filterData.value.END_DATE = route.query.until;
}

if (route.query.ROLE) {
  filterData.value.ROLE = route.query.ROLE;
}

if (route.query.GROUP_ID) {
  filterData.value.GROUP_ID = route.query.GROUP_ID;
}

if (route.query.user_id || route.query.ID_USER) {
  filterData.value.USER_ID = route.query.user_id || route.query.ID_USER;
}

if (route.query.LEADS_ID) {
  filterData.value.LEADS_ID = route.query.LEADS_ID;
}

if (route.query.PROVINCE_ID) {
  filterData.value.PROVINCE_ID = route.query.PROVINCE_ID;
}

if (route.query.CITY_ID) {
  filterData.value.CITY_ID = route.query.CITY_ID;
}

function handleFilterSales(data) {
  filterData.value.USER_ID = data.USER_ID;
  filterData.value.ROLE = data.USER_ROLE;
  filterData.value.GROUP_ID = data.USER_GROUP_CODE;

  onFilterSearch();
}

// // console.log(filterData.value);


// DETAIL
function onViewDialog(row) {
  openViewDialog(row);
}

// DELETE
function onDelete(row) {
  deleteData(() => firstload(), API.apiContactDelete, { CONTACT_PIC_ID: String(row.CONTACT_PIC_ID) });
}

// EDIT
function onEditDialog(row) {
  openEditDialog(row);
}
function onSaveEdit() {
  saveEdit(() => firstload(), API.apiContactEdit, ['CONTACT_PIC_ID']);
}

// INSERT
function onAddDialog() {
  addDialog.value = true;
}
function onSaveAdd() {
  saveAdd(() => firstload(), API.apiContactInsert);
}

// PAGINATION
function doPaginate(index = 1, pSize) {
  getListData(API.apiContactPagination, index, pSize || pageSize.value, search.value, filterData.value);
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

function resetFilter() {
  filterData.value.USER_ID = accountId.value || localStorage.getItem('id');
  filterData.value.ROLE = role.value || localStorage.getItem('role');
  filterData.value.GROUP_ID = groupValue.value || localStorage.getItem('group');

  onFilterSearch();
}

function firstload() {
  doPaginate(pageIndex.value);
}

firstload();
</script>
<style scoped>
:deep(.el-dialog) {
  border-radius: 1.25rem !important;
}

:deep(.el-dialog__header) {
  margin-right: 0 !important;
  padding-bottom: 10px !important;
}
</style>
