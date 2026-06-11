<template>
    <div>
      <!-- <title-dashboard show-button @click="onAddDialog"></title-dashboard> -->
      <div class="flex items-center justify-between mb-3">
        <h1 class="text-lg font-semibold">Input PKS</h1>
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
        <el-table-column prop="Status" label="Status" min-width="220" show-overflow-tooltip sortable/>
        <el-table-column prop="PKS_File" label="PKS File" min-width="160" show-overflow-tooltip sortable>
          <template #default="{ row }">
            <el-button type="primary" tag="a" size="small" :href="baseUrl + row.PKS_File" download> Download </el-button>
          </template>
        </el-table-column>
  
        <table-column-action show-edit @click-edit="onEditDialog" />
      </el-table>
      <PaginationView :total="rowTotal" :page-size="pageSize" :current-page="pageIndex" @current-change="changePage" />
      <!-- dialog insert -->
      <el-dialog v-model="addDialog" title="Input PKS" :width="dialogWidth()" destroy-on-close>
        <el-form :model="addData" ref="addForm" label-width="160px" :label-position="labelPosition()" class="mt-2">
          <el-form-item label="Status" :rules="[rule.requiredRule()]">
            <el-select v-model="addData.PKS_STATUS">
                <el-option label="Lepas Kunci" value="Lepas_Kunci" />
                <el-option label="Per Trip (FTL)" value="FTL" />
                <el-option label="Unit+Driver" value="Unit_Driver" />
                <el-option label="Unit All In (Driver+Biaya Ops)" value="AllIn" />
              </el-select>
          </el-form-item>
  
          <el-form-item label="File PKS (Wajib PDF)" :rules="[rule.requiredRule()]">
            <upload-file-with-camera v-model="addData.PKS_FILE">
              <el-icon class="text-3xl"><UploadFilled /></el-icon>
            </upload-file-with-camera>
          </el-form-item>
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
          <el-form-item label="Status" :rules="[rule.requiredRule()]">
            <el-select v-model="editData.PKS_STATUS" disabled>
                <el-option label="Lepas Kunci" value="Lepas_Kunci" />
                <el-option label="Per Trip (FTL)" value="FTL" />
                <el-option label="Unit+Driver" value="Unit_Driver" />
                <el-option label="Unit All In (Driver+Biaya Ops)" value="AllIn" />
              </el-select>
          </el-form-item>
          <el-form-item label="File PKS" :rules="[rule.requiredRule()]">
            <!-- {{ editData}} -->
            <upload-file-with-camera :preview-url-edit="editData.pks_file" v-model="editData.PKS_FILE">
              <el-icon class="text-3xl"><UploadFilled /></el-icon>
            </upload-file-with-camera>
          </el-form-item>
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
  const { editData, editForm, editDialog, openEditDialog, saveEdit2, saveEdit, cancelEdit } = HOOKS.useEditOneData();
  
  // Gunakan variabel dari hooks untuk insert data
  function onAddDialog() {
    addDialog.value = true;
  }
  
  const onSaveAdd = () => {
    // // console.log(addData.value);
    saveAdd(() => firstload(), API.apiDealsPks);
  };
  
  // EDIT
  function onEditDialog(row) {
    // // console.log(row);
  
    const data = {
      id: row.id,
      PKS_STATUS: row.Status,
      pks_file: row.PKS_File,
    };
    openEditDialog(data);
  }
  // // console.log(editData.value);
  
  function onSaveEdit() {
    saveEdit2(
      () => firstload(),
      (payload) => API.apiDealsUpdatePks(editData.value.id, payload),
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
    getListData(API.getDataPksArmada, index, pSize || pageSize.value, search.value, filterData.value);
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
  