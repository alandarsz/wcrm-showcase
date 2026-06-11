<template>
    <div>
      <!-- <title-dashboard show-button @click="onAddDialog"></title-dashboard> -->
      <div class="flex items-center justify-between mb-3">
        <h1 class="text-lg font-semibold">Input Harga Publish</h1>
        <!-- filter -->
        <div class="flex items-center gap-2 ml-auto">
          <el-button type="primary" @click="onAddDialog">
            <el-icon class="m-1"><CirclePlusFilled /></el-icon> Tambah
          </el-button>
        </div>
      </div>
      <el-form :model="filterData" :label-position="labelPosition()" label-width="150px">
        <div class="w-full bg-gray-100 rounded mb-2 p-2 grid md:grid-cols-2 gap-3">
          <el-form-item label="Periode" prop="DATE_START">
            <el-date-range-input v-model:startDate="filterData.DATE_START" v-model:endDate="filterData.DATE_END"></el-date-range-input>
          </el-form-item>
          <div class="w-full flex justify-end md:col-span-2">
            <el-button type="primary" @click="onFilterSearch">Filter</el-button>
          </div>
        </div>
      </el-form>
      <SearchAndPaginate @search="onSearch" @paginate="onPaginate" />
      <el-table v-loading="loading" :data="listData" stripe border header-cell-class-name="table-header">
        <el-table-column type="index" label="No" min-width="60" />
        <el-table-column prop="id" label="Id" min-width="140" show-overflow-tooltip sortable/>
        <el-table-column prop="Wilayah" label="Wilayah" min-width="220" show-overflow-tooltip sortable/>
        <el-table-column label="Harga Express" min-width="200" show-overflow-tooltip sortable>
          <template #default="{ row }">
            <el-button type="primary" tag="a" size="small"  :href="baseUrl + row.Harga_Express" download> Download </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="Harga Cargo"  label="Harga Cargo" min-width="160" show-overflow-tooltip sortable>
          <template #default="{ row }">
            <el-button type="primary" tag="a" size="small" :href="baseUrl + row.Harga_Cargo" download> Download </el-button>
          </template>
        </el-table-column>
  
        <table-column-action show-edit @click-edit="onEditDialog" />
      </el-table>
      <PaginationView :total="rowTotal" :page-size="pageSize" :current-page="pageIndex" @current-change="changePage" />
      <!-- dialog insert -->
      <el-dialog v-model="addDialog" title="Tambah Data Pengiriman" :width="dialogWidth()" destroy-on-close>
        <el-form :model="addData" ref="addForm" label-width="160px" :label-position="labelPosition()" class="mt-2">
          <!-- Wilayah -->
          <el-form-item label="Wilayah" :rules="[rule.requiredRule()]" disabled>
            <el-select v-model="addData.P_WILAYAH" placeholder="Pilih Wilayah" class="w-full" clearable>
              <el-option label="Bandung" value="BANDUNG" />
              <el-option label="Jabodetabek" value="JABODETABEK" />
              <el-option label="Semarang" value="SEMARANG" />
              <el-option label="Solo" value="SOLO" />
              <el-option label="Surabaya" value="SURABAYA" />
              <el-option label="Yogyakarta" value="YOGYAKARTA" />
            </el-select>
          </el-form-item>
  
          <!-- Upload Express -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
            <el-form-item label="Harga Express" :rules="[rule.requiredRule()]">
              <upload-file-with-camera show-upload-only v-model="addData.P_FILE_EXPRESS" :accept="['application/pdf']">
                <el-icon class="text-3xl"><UploadFilled /></el-icon>
                <div class="text-gray-500 text-sm mt-2">Drop file atau klik untuk upload</div>
              </upload-file-with-camera>
            </el-form-item>
  
            <!-- Upload Cargo -->
            <el-form-item label="Harga Cargo" :rules="[rule.requiredRule()]">
              <upload-file-with-camera show-upload-only v-model="addData.P_FILE_CARGO" :accept="['application/pdf']">
                <el-icon class="text-3xl"><UploadFilled /></el-icon>
              </upload-file-with-camera>
            </el-form-item>
          </div>
        </el-form>
  
        <template #footer>
          <div class="flex justify-end gap-3">
            <el-button @click="addDialog = false"> Batal </el-button>
  
            <el-button type="primary" @click="onSaveAdd"> Simpan </el-button>
          </div>
        </template>
      </el-dialog>
          <!-- dialog edit -->
          <el-dialog v-model="editDialog" title="Tambah Data Pengiriman" :width="dialogWidth()" destroy-on-close>
        <el-form :model="editData" ref="editForm" label-width="160px" :label-position="labelPosition()" class="mt-2">
          <!-- Wilayah -->
          <el-form-item label="Wilayah" :rules="[rule.requiredRule()]">
            <el-select v-model="editData.P_WILAYAH" placeholder="Pilih Wilayah" class="w-full" clearable>
              <el-option label="Bandung" value="BANDUNG" />
              <el-option label="Jabodetabek" value="JABODETABEK" />
              <el-option label="Semarang" value="SEMARANG" />
              <el-option label="Solo" value="SOLO" />
              <el-option label="Surabaya" value="SURABAYA" />
              <el-option label="Yogyakarta" value="YOGYAKARTA" />
            </el-select>
          </el-form-item>
  
          <!-- Upload Express -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
            <el-form-item label="Harga Express" :rules="[rule.requiredRule()]">
              <upload-file-with-camera v-model="editData.P_FILE_EXPRESS" show-upload-only :preview-url-edit="editData.Harga_Express" :accept="['application/pdf']">
                <el-icon class="text-3xl"><UploadFilled /></el-icon>
                <div class="text-gray-500 text-sm mt-2">Drop file atau klik untuk upload</div>
              </upload-file-with-camera>
            </el-form-item>
  
            <!-- Upload Cargo -->
            <el-form-item label="Harga Cargo" :rules="[rule.requiredRule()]">
              <upload-file-with-camera show-upload-only v-model="editData.P_FILE_CARGO" :preview-url-edit="editData.Harga_Cargo" :accept="['application/pdf']">
                <el-icon class="text-3xl"><UploadFilled /></el-icon>
              </upload-file-with-camera>
            </el-form-item>
          </div>
        </el-form>
  
        <template #footer>
          <footer-button-dialog @save-click="onSaveEdit" @cancel-click="cancelEdit"></footer-button-dialog>
        </template>
      </el-dialog>
    </div>
  </template>
  <script setup>
  // import API, HOOKS untuk kebutuhan pagination
  import API from '../../api/apiDeals';
  import HOOKS from '../../hooks/bundleOneOps';
  import { useRoute } from 'vue-router';
  import { dialogWidth, labelPosition } from '../../helper/appUtils';
  import * as rule from '../../helper/rules';
  import { CirclePlusFilled, UploadFilled } from '@element-plus/icons-vue';
  
  const route = useRoute();
  
  const baseUrl = import.meta.env.MODE == 'production' ? import.meta.env.VITE_API_URL_PROD : import.meta.env.VITE_API_URL_DEV;
  
  // declare variable dari hooks
  const { listData, rowTotal, pageIndex, pageSize, getListData, changeIndex, loading, filterData, search, headers } = HOOKS.useListDataPaginate();
  // HOOKS Untuk nambah data
  const { addData, addForm, addDialog, saveAdd, cancelAdd } = HOOKS.useAddOneData();
  // HOOKS untuk edit data
  const { editData, editForm, editDialog, openEditDialog,saveEdit2, saveEdit, cancelEdit } = HOOKS.useEditOneData();
  
  // Gunakan variabel dari hooks untuk insert data
  function onAddDialog() {
    addDialog.value = true;
  }
  
  const onSaveAdd = () => {
    // // console.log(addData.value);
  
    saveAdd(() => firstload(), API.apiDealsHargaPublishInsert);
  };
  
  // EDIT
  function onEditDialog(row) {
      // // console.log(row);
      
   const data = {
      id: row.id,
      P_WILAYAH: row.Wilayah,
      P_FILE_EXPRESS: row.Harga_Express,
      P_FILE_CARGO: row.Harga_Cargo,
      ...row
    }
    openEditDialog(data);
  }
  function onSaveEdit() {
  saveEdit2(
    () => firstload(),
    (payload) => API.apiDealsUpdatePublishPrice(editData.value.id, payload),
  );
}
  
  
  // Gunakan variabel dari hooks untuk kebutuhan Pagination
  const date = new Date();
  date.setDate(1);
  date.setMonth(0);
  filterData.value.DATE_START = date.toISOString().slice(0, 10);
  filterData.value.DATE_END = new Date().toISOString().slice(0, 10);
  
  if (route.query.DATE_START) {
    filterData.value.DATE_START = route.query.DATE_START;
    filterData.value.DATE_END = route.query.DATE_END;
  }
  
  if (route.query.ALC_SERVICE) {
    filterData.value.ALC_SERVICE = route.query.ALC_SERVICE;
  }
  
  function doPaginate(index = 1, pSize) {
    getListData(API.getHargaPublish, index, pSize || pageSize.value, search.value, filterData.value);
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
  
  function firstload() {
    doPaginate(pageIndex.value);
  }
  
  firstload();
  </script>
  