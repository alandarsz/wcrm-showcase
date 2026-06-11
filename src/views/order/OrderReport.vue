<template>
    <div>
        <title-dashboard show-button @click="onAddDialog"></title-dashboard>
        <el-form :model="filterData" :label-position="labelPosition()" label-width="150px">
            <div class="w-full bg-gray-100 rounded mb-2 p-2 grid md:grid-cols-2 gap-3">
                <el-form-item label="Periode" prop="DATE_START">
                    <el-date-range-input v-model:startDate="filterData.DATE_START"
                        v-model:endDate="filterData.DATE_END"></el-date-range-input>
                </el-form-item>
                <el-form-item label="Layanan" prop="ALC_SERVICE">
                    <el-select-v2 v-model="filterData.ALC_SERVICE" placeholder="Pilih Layanan"
                        :options="[{ label: 'Deno', value: 'DENO' }]" clearable></el-select-v2>
                </el-form-item>
                <div class="w-full flex justify-end md:col-span-2">
                    <el-button type="primary" @click="onFilterSearch">Filter</el-button>
                </div>
            </div>
        </el-form> 
        <SearchAndPaginate @search="onSearch" @paginate="onPaginate" />
        <el-table v-loading="loading" :data="listData" stripe border header-cell-class-name="table-header">
            <el-table-column type="index" label="No" min-width="50"></el-table-column>
            <el-table-column v-for="(data, index) in headers" :prop="data" :label="data" :key="index"
                min-width="200"></el-table-column>
            <table-column-action show-view></table-column-action>
        </el-table>
        <PaginationView :total="rowTotal" :page-size="pageSize" :current-page="pageIndex"
            @current-change="changePage" />
        <!-- dialog insert -->
        <el-dialog v-model="addDialog" top="10vh" width="70%" destroy-on-close>
            <template #header>
                <h1 class="border-b">Tambah Data</h1>
            </template>
            <el-form :model="addData" ref="addForm" label-position="left" label-width="150px">
                <el-form-item prop="DATA_NAME" label="Data Name" :rules="[
                    { required: true, message: 'Please input Activity name', trigger: 'blur' },
                    { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
                ]">
                    <el-input v-model="addData.DATA_NAME" placeholder="Masukkan Data Name"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <footer-button-dialog @save-click="onSaveAdd" @cancel-click="cancelAdd"></footer-button-dialog>
            </template>
        </el-dialog>
    </div>
</template>
<script setup>
// import API, HOOKS untuk kebutuhan pagination
import API from "../../api-swb/apiOrder";
import HOOKS from "../../hooks/bundleOneOps";
import { useRoute } from "vue-router";
import { labelPosition } from "../../helper/appUtils";

const route = useRoute()

// declare variable dari hooks
const { listData, rowTotal, pageIndex, pageSize, getListData, changeIndex, loading, filterData, search, headers } = HOOKS.useListDataPaginate();
// HOOKS Untuk nambah data
const { addData, addForm, addDialog, saveAdd, cancelAdd } = HOOKS.useAddOneData();
// HOOKS untuk edit data
const { editData, editForm, editDialog, openEditDialog, saveEdit, cancelEdit } = HOOKS.useEditOneData()

// Gunakan variabel dari hooks untuk insert data
function onAddDialog() {
    addDialog.value = true;
}

function onSaveAdd() {
    saveAdd(() => firstload(), () => {
        // // console.log(addData.value);
    });
}

// Gunakan variabel dari hooks untuk kebutuhan Pagination
const date = new Date()
date.setDate(1)
date.setMonth(0)
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
    getListData(API.orderPagination, index, pSize || pageSize.value, search.value, filterData.value);
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