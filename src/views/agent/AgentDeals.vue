<template>
    <div>
        <title-dashboard show-button @click="onAddDialog"></title-dashboard>
        <SearchAndPaginate @search="onSearch" @paginate="onPaginate" />
        <card-list :list="listData" is-rounded v-if="isOnMobile">
            <card-list-item prop="AGENT_CANDIDATE_NAME" is-single-column></card-list-item>
        </card-list>
        <el-table v-else v-loading="loading" :data="listData" stripe border header-cell-class-name="table-header">
            <!-- nama_promotor,
  pso,
  brand,
  atrbaidp,
  tanggal_input,
  atrbtdtd,
  tanggal,
  id,
  parent,
  number,
  jenis_usaha_lainnya_dilokasi_yang_sama,
  informasi_kemitraan_didapatkan_dari,
  foto_ruangan,
  jenis_usaha,
  longitude,
  latitude,
  jenis_pengajuan,
  nama_brand_usaha,
  model_bisnis,
  jenis_penagihan,
  foto_hasil_cek_jarak_koordinat,
  alamat_ktp,
  type_1,
  code,
  biaya_join,
  saldo_awal,
  nama_calon,
  lokasi,
  alias,
  alamat_kios_toko_diajukan,
  nomor_telepon,
  email,
  foto_ktp,
  data_agen_terdekat_dan_kategori_omset,
  foto_kios_konter_tampak_depan,
  foto_jalan_tampak_kiri,
  nomor_whatsapp,
  daftar_di_cabang,
  class,
  status,
  atrbttrg,
  atrbttri,
  atrbttro,
  atrbttrr,
  type_2,
  nilai_invoice_maksimum_bulanan,
  minimun_balance,
  kontrak_selesai,
  unit,
  infofee,
  tampilan_inputan -->
            <el-table-column type="index" label="No" min-width="50"></el-table-column>
            <el-table-column show-overflow-tooltip prop="AGENT_CANDIDATE_NAME" label="Nama Calon" min-width="200"></el-table-column>
            <el-table-column show-overflow-tooltip prop="AGENT_CANDIDATE_EMAIL" label="Email" min-width="150"></el-table-column>
            <el-table-column show-overflow-tooltip prop="AGENT_CANDIDATE_PHONE_NUMBER" label="Telepon" min-width="150"></el-table-column>
            <el-table-column show-overflow-tooltip prop="AGENT_CANDIDATE_WHATSAPP_PHONE_NUMBER" label="Whatsapp" min-width="150">
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="AGENT_CANDIDATE_BUSINESS" label="Jenis Usaha" min-width="150"></el-table-column>
            <el-table-column show-overflow-tooltip prop="AGENT_CANDIDATE_BUILDING_TYPE" label="Jenis Bangunan" min-width="150"></el-table-column>
            <el-table-column show-overflow-tooltip prop="AGENT_CANDIDATE_REFERENCE" label="Referensi" min-width="120"></el-table-column>
            <el-table-column prop="AGENT_CANDIDATE_CREATE_BY" label="Dibuat" min-width="250" show-overflow-tooltip>
                <template #default="{ row }"> 
                    {{ `${dateFormatFull(row.AGENT_CANDIDATE_CREATE_DATE)} - ${row.AGENT_CANDIDATE_CREATE_BY}` }} 
                </template>
            </el-table-column>
        </el-table>
        <PaginationView :total="rowTotal" :page-size="pageSize" :current-page="pageIndex"
            @current-change="changePage" />
        <el-dialog v-model="addDialog" :width="dialogWidth()" destroy-on-close :fullscreen="isOnMobile">
            <template #header>
                <h1 class="border-b pb-5">Tambah Pengajuan Keagenan</h1>
            </template>
            <el-form :model="addData" :label-position="labelPosition()" label-width="150px" ref="addForm"
                @submit.prevent="onSaveAdd">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <el-form-item label="Nama Calon" prop="namaCalon" :rules="[rules.requiredRule()]">
                            <el-input v-model="addData.namaCalon" placeholder="Nama Calon"></el-input>
                        </el-form-item>
                        <el-form-item label="Alamat KTP" prop="alamatKTP" :rules="[rules.requiredRule()]">
                            <el-input v-model="addData.alamatKTP" type="textarea" placeholder="Alamat KTP"></el-input>
                        </el-form-item>
                        <el-form-item label="Nomor Telepon" prop="nomorTelepon" :rules="[rules.requiredRule()]">
                            <el-phone-number-input v-model="addData.nomorTelepon"></el-phone-number-input>
                        </el-form-item>
                        <el-form-item label="Nomor WhatsApp" prop="nomorWhatsApp" :rules="[rules.requiredRule()]">
                            <el-phone-number-input v-model="addData.nomorWhatsApp"></el-phone-number-input>
                        </el-form-item>
                        <el-form-item label="Email" prop="email" :rules="[rules.requiredRule(), rules.emailRule()]">
                            <el-input v-model="addData.email" type="email" placeholder="Email"></el-input>
                        </el-form-item>
                        <el-form-item label="Jenis Bangunan" prop="jenisBangunan" :rules="[rules.requiredRule()]">
                            <el-input v-model="addData.jenisBangunan" placeholder="Jenis Bangunan"></el-input>
                        </el-form-item>
                        <el-form-item label="Jenis Usaha" prop="jenisUsaha" :rules="[rules.requiredRule()]">
                            <el-input v-model="addData.jenisUsaha" placeholder="Jenis Usaha"></el-input>
                        </el-form-item>
                        <el-form-item label="Jenis Usaha Lain" prop="jenisUsahaLain" :rules="[rules.requiredRule()]">
                            <el-select-v2 v-model="addData.jenisUsahaLain" class="w-full"
                                :options="[{ value: true, label: 'Ya, ada' }, { value: false, label: 'Tidak ada' }]"
                                placeholder="Pilih" />
                        </el-form-item>
                        <el-form-item label="Nama Brand" prop="namaBrand" v-if="addData.jenisUsahaLain"
                            :rules="[rules.requiredRule()]">
                            <el-input v-model="addData.namaBrand" placeholder="Silakan masukan nama brand usaha lain"></el-input>
                        </el-form-item>
                        <el-form-item label="Detail Alamat" prop="lokasi" :rules="[rules.requiredRule()]">
                                <el-input v-model="addData.lokasi" type="textarea" placeholder="Detail Lokasi/Alamat"></el-input>
                        </el-form-item>
                    </div>
                    <div>
                        <fieldset class="border border-dashed border-sky-500 p-2 rounded-lg mb-4">
                            <legend>
                                <el-button :icon="ZoomIn" type="primary" size="small" round
                                    @click="onMapDialog">Tambah/Cari Alamat
                                    kios</el-button>
                            </legend>
                            <el-form-item label="Alamat Kios" prop="alamatKios" :rules="[rules.requiredRule()]">
                                <el-input v-model="addData.alamatKios" type="textarea"
                                    placeholder="Alamat Kios"></el-input>
                            </el-form-item>
                            <el-form-item label="Latitude Kios" prop="latKios" :rules="[rules.requiredRule()]">
                                <el-input v-model="addData.latKios" placeholder="Lat"></el-input>
                            </el-form-item>
                            <el-form-item label="Longitude Kios" prop="longKios" :rules="[rules.requiredRule()]">
                                <el-input v-model="addData.longKios" placeholder="Long"></el-input>
                            </el-form-item>
                        </fieldset>
                        <el-form-item label="Referensi" prop="reference">
                            <el-input v-model="addData.reference" placeholder="Social Media, Kenalan"></el-input>
                        </el-form-item>
                    </div>
                    <div>
                        <el-form-item label="Foto KTP" prop="fotoKTP" :rules="[rules.requiredRule()]">
                            <upload-file-with-camera v-model="addData.fotoKTP"
                                :accept="['image/*']"></upload-file-with-camera>
                        </el-form-item>
                        <el-form-item label="Foto Kios" prop="fotoKios" :rules="[rules.requiredRule()]">
                            <upload-file-with-camera v-model="addData.fotoKios"
                                :accept="['image/*']"></upload-file-with-camera>
                        </el-form-item>
                    </div>
                    <div>
                        <el-form-item label="Foto Akses Jalan" prop="fotoAksesJalan" :rules="[rules.requiredRule()]">
                            <upload-file-with-camera v-model="addData.fotoAksesJalan"
                                :accept="['image/*']"></upload-file-with-camera>
                        </el-form-item>
                        <el-form-item label="Foto Ruangan" prop="fotoRuangan" :rules="[rules.requiredRule()]">
                            <upload-file-with-camera v-model="addData.fotoRuangan"
                                :accept="['image/*']"></upload-file-with-camera>
                        </el-form-item>
                    </div>
                </div>
            </el-form>
            <template #footer>
                <footer-button-dialog @save-click="onSaveAdd" @cancel-click="cancelAdd"></footer-button-dialog>
            </template>
        </el-dialog>
        <el-dialog v-model="mapDialog" title="Pilih Alamat Kios" :width="dialogWidth()" destroy-on-close
            @close="cancelMapDialog">
            <el-form :model="addData" :label-position="labelPosition()">
                <el-form-item prop="alamatKios" :rules="[rules.requiredRule()]">
                    <div class="w-full">
                        <leaflet-mark-v2 v-model:address="addData.alamatKios" v-model:lat="addData.latKios"
                            v-model:long="addData.longKios"></leaflet-mark-v2>
                    </div>
                    <div v-if="addData.alamatKios" class="w-full">
                        <el-input v-model="addData.alamatKios" readonly type="textarea"></el-input>
                    </div>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button type="primary" @click="cancelMapDialog">Simpan</el-button>
            </template>
        </el-dialog>
    </div>
</template>
<script setup>
import { computed, ref } from "vue";
import { useStore } from "vuex";
import API from "../../api/apiAgent";
import HOOKS from "../../hooks/bundleOneOps";
import { labelPosition, dialogWidth } from "../../helper/appUtils";
import * as rules from "../../helper/rules";
import { ZoomIn } from "@element-plus/icons-vue";
import {dateFormatFull} from "../../helper/utils"

const { listData, rowTotal, pageIndex, pageSize, getListData, changeIndex, loading, filterData, search, headers } = HOOKS.useListDataPaginate();
const { addData, addForm, addDialog, saveAdd, cancelAdd } = HOOKS.useAddOneData();
const store = useStore()
const isOnMobile = computed(() => store.getters.isOnMobile);
const accountId = computed(() => store.getters.accountId);
const role = computed(() => store.getters.userRole);
const groupValue = computed(() => store.getters.userGroup);

filterData.value.USER_ROLE = role.value || localStorage.getItem('role');
filterData.value.USER_GROUP_ID = groupValue.value || localStorage.getItem('group');
filterData.value.USER_ID = accountId.value || localStorage.getItem('id');

// PAGINATION
function doPaginate(index = 1, pSize) {
  getListData(API.getAgentCandidatesPagination, index, pSize || pageSize.value, search.value, filterData.value);
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

// DIALOG ADD

const mapDialog = ref(false)
const onMapDialog = () => {
    mapDialog.value = true
}

const cancelMapDialog = () => {
    mapDialog.value = false
}

function onAddDialog() {
    addDialog.value = true
    addData.value.jenisUsahaLain = false
}

function onSaveAdd() {
    saveAdd(() => firstload(), API.apiInsertAgent);
}

firstload()
</script>