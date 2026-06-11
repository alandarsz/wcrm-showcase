<template>
  <div class="py-2 px-1 bg-white">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-semibold">Task</h2>
      <div class="flex items-center gap-2 ml-auto">
        <el-button type="primary" @click="onAddDialog"> + Add Task </el-button>
      </div>
    </div>
    <el-form :model="filterData" :label-position="labelPosition()" label-width="150px">
      <div class="w-full grid grid-cols-1 md:grid-cols-2 my-2 rounded border p-2 bg-gray-100">
        <el-form-item label="Periode">
          <el-date-range-input v-model:startDate="filterData.since" v-model:endDate="filterData.until">
            <template #button>
              <div class="w-full flex md:justify-end justify-start items-center">
                <el-button type="primary" size="small" class="w-full md:w-auto" @click="applyFilter"> Filter </el-button>
              </div>
            </template>
          </el-date-range-input>
        </el-form-item>
        <div class="relative w-full">
          <div class="absolute bottom-0 right-0 hidden md:block">
            <el-button type="primary" class="w-full md:w-auto" @click="applyFilter"> Filter </el-button>
          </div>
        </div>
      </div>
    </el-form>
    <div class="flex flex-col sm:flex-row sm:items-center gap-3 mb-5 w-full">
      <div class="grid grid-cols-2 gap-2">
        <el-input v-model="q" placeholder="Cari Customer" clearable class="flex-1 md:w-full rounded-2xl bg-white shadow-sm min-w-[150px]">
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>

        <el-select v-model="filterPipeline" placeholder="Semua Status" clearable class="max-w-80 sm:w-56">
          <el-option v-for="(task, index) in TaskStage.body" :key="index" :label="task.label" :value="task.value" />
        </el-select>
      </div>
      <el-form :model="filterData" class="flex flex-col sm:flex-row sm:items-end gap-2 w-full md:w-auto">
        <el-form-item prop="USER_ID" v-if="['ADM', 'SLSM'].includes(role)" class="mb-0 md:w-[280px]">
          <el-inferior-input v-model="filterData.USER_ID" :user-id="accountId" :group-id="groupValue" :role="role" @handle-change="handleFilterSales" @clear="resetFilter" />
        </el-form-item>
      </el-form>
    </div>

    <!-- mobile -->
    <div class="block md:hidden space-y-4">
      <card-list v-if="listData && listData.length" :list="listData" is-rounded>
        <card-list-item prop="CUSTOMER_NAME" is-single-column>
          <template #default="{ row }">
            <div class="flex justify-between items-start mb-1">
              <div class="flex items-center w-full gap-3">
                <div class="min-w-0">
                  <h3 class="font-medium text-sm text-gray-700 truncate">
                    {{ row.NAMA_CUSTOMER }}
                  </h3>
                  <p class="text-xs text-gray-400">
                    {{ row.NAMA_SALES }}
                  </p>
                </div>
                <div class="ml-auto">
                  <el-tag
                    size="small"
                    :type="statusType(row.STATUS_TASK)"
                    class="font-bold border-none px-3 rounded-full uppercase text-[10px] tracking-wider shadow-sm"
                  >
                    {{ row.STATUS_TASK }}
                  </el-tag>
                </div>
              </div>
            </div>
            <div class="border-t border-gray-200 my-2"></div>
            <div class="text-sm space-y-2">
              <div class="flex justify-between">
                <span class="text-xs text-gray-400">Tanggal</span>
                <span>{{ row.TIME?.substring(0, 10) }}</span>
              </div>

              <div class="flex justify-between">
                <span class="text-xs text-gray-400">Jam</span>
                <span>{{ row.TIME?.substring(11, 16) }}</span>
              </div>

              <div>
                <div class="text-xs text-gray-400">Agenda</div>
                <div class="text-gray-700 line-clamp-2">
                  {{ row.AGENDA }}
                </div>
              </div>
            </div>
          </template>
        </card-list-item>
        <card-action-button
          show-view
          :show-delete="role === 'SLSM' || role === 'ADM'"
          show-edit
          @click-view="onViewDialog"
          @click-delete="onDelete"
          @click-edit="onEditDialog"
        ></card-action-button>
      </card-list>
      <div v-else class="text-center text-sm text-gray-400 py-10">Tidak ada data</div>
    </div>

    <!-- desktop -->
    <div class="hidden md:block">
      <div class="hidden md:block">
        <el-table v-loading="loading" :data="listData" stripe border header-cell-class-name="table-header">
          <el-table-column type="index" label="No" min-width="40" />
          <el-table-column prop="NAMA_SALES" label="Nama Sales" min-width="270" show-overflow-tooltip sortable/>
          <el-table-column label="Nama Customer" min-width="200" show-overflow-tooltip sortable>
            <template #default="{ row }"> {{ row.NAMA_CUSTOMER }} </template>
          </el-table-column>
          <el-table-column label="Tanggal" min-width="160" show-overflow-tooltip sortable>
            <template #default="{ row }">
              {{ row.TIME?.substring(0, 10) }}
            </template>
          </el-table-column>
          <el-table-column label="Jam" min-width="120" show-overflow-tooltip sortable>
            <template #default="{ row }">
              {{ row.TIME?.substring(11, 16) }}
            </template>
          </el-table-column>
          <el-table-column prop="Agenda" label="Agenda" min-width="200" show-overflow-tooltip sortable>
            <template #default="{ row }">{{ row.AGENDA }} </template>
          </el-table-column>
          <el-table-column prop="LOKASI" label="Lokasi" min-width="100" show-overflow-tooltip sortable>
            <template #default="{ row }">
              <el-link type="primary" :href="row.LOKASI" target="_blank">
                <el-button type="primary" class="flex-[2] !font-bold shadow-lg shadow-blue-200 w-full">
                  <el-icon><MapLocation /></el-icon>
                </el-button>
              </el-link>
            </template>
          </el-table-column>
          <el-table-column label="Status" min-width="100" sortable>
            <template #default="{ row }">
              <el-tag
                size="small"
                :type="statusType(row.STATUS_TASK)"
                class="font-bold border-none px-3 rounded-full uppercase text-[10px] tracking-wider shadow-sm mb-3"
              >
                {{ row.STATUS_TASK }}
              </el-tag>
            </template>
          </el-table-column>
          <table-column-action
            show-view
            show-edit
            :show-delete="role === 'SLSM' || role === 'ADM'"
            @click-view="onViewDialog"
            @click-edit="onEditDialog"
            @click-delete="onDelete"
          />
        </el-table>
      </div>
    </div>
    <div class="flex items-center justify-center gap-4 mt-6">
      <PaginationView :total="rowTotal" :page-size="pageSize" :current-page="pageIndex" @current-change="changePage" />
    </div>

    <!-- detail -->
    <el-dialog v-model="viewDialog" title="Detail Aktivitas Sales" :width="dialogWidth()" class=" overflow-hidden md:max-h-[750px] rounded-2xl">
      <div class="antialiased text-slate-700 p-1 md:p-2" :model="viewData">
        <div class="relative mb-4 md:mb-6">
          <div class="flex flex-col sm:flex-row justify-between items-start gap-3">
            <div class="space-y-1 w-full sm:max-w-[70%]">
              <h2 class="text-lg md:text-xl font-extrabold text-slate-800 leading-tight mt-1">
                {{ viewData.NAMA_CUSTOMER }}
              </h2>
              <p class="text-[11px] md:text-xs text-slate-500 leading-relaxed break-words line-clamp-2 italic">"{{ viewData.ALAMAT_CUSTOMER }}"</p>
            </div>
            <div class="flex sm:block items-center">
              <div
                :class="[
                  'inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter shadow-sm border',
                  viewData.STATUS_TASK === 'Completed'
                    ? 'bg-green-50 text-green-700 border-green-100'
                    : 'bg-yellow-50 text-yellow-700 border-yellow-200',
                ]"
              >
                <span class="w-1.5 h-1.5 rounded-full mr-1.5" :class="viewData.STATUS_TASK === 'Completed' ? 'bg-green-500' : 'bg-yellow-500'"></span>
                {{ viewData.STATUS_TASK || 'Baru' }}
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-3">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div class="p-3 bg-slate-50 border border-slate-100 rounded-lg">
              <label class="flex items-center gap-1.5 text-[12px] font-bold text-blue-900 uppercase tracking-widest mb-1">
                <el-icon><User /></el-icon> PIC Sales
              </label>
              <p class="text-md font-bold text-[#001D3D]">{{ viewData.NAMA_SALES }}</p>
            </div>
            <div class="p-3 bg-slate-50 border border-slate-100 rounded-lg">
              <label class="flex items-center gap-1.5 text-[12px] font-bold text-blue-900 uppercase tracking-widest mb-1">
                <el-icon><Document /></el-icon> Agenda
              </label>
              <p class="text-md font-bold text-[#001D3D]">{{ viewData.AGENDA }}</p>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div class="p-3 bg-slate-50 border border-slate-100 rounded-lg border-l-4 border-l-blue-600">
              <label class="text-[12px] font-bold text-blue-900 uppercase tracking-widest mb-1 block">Hari / Tanggal</label>
              <p class="text-md font-bold text-[#001D3D]">{{ viewData.TIME?.substring(0, 10) }}</p>
            </div>
            <div class="p-3 bg-slate-50 border border-slate-100 rounded-lg border-l-4 border-l-amber-500">
              <label class="text-[12px] font-bold text-blue-900 uppercase tracking-widest mb-1 block">Waktu</label>
              <p class="text-md font-bold text-[#001D3D]">{{ viewData.TIME?.substring(11, 16) }} WIB</p>
            </div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div class="p-3 bg-slate-50 border border-slate-100 rounded-lg">
            <label class="flex items-center gap-1.5 text-[12px] font-bold text-blue-900 uppercase tracking-widest mb-1">
              <el-icon><Phone /></el-icon> Contact Person
            </label>
            <p class="text-md font-bold text-[#001D3D]">{{ viewData.CONTACT || '-' }}</p>
          </div>

          <div class="p-3 bg-slate-50 border border-slate-100 rounded-lg">
            <label class="flex items-center gap-1.5 text-[12px] font-bold text-blue-900 uppercase tracking-widest mb-1">
              <el-icon><WarningFilled /></el-icon> Alasan Penundaan
            </label>
            <p class="text-md font-medium text-slate-600 leading-relaxed italic">
              {{ viewData.ALASAN_DITUNDA && viewData.ALASAN_DITUNDA !== 'null' ? viewData.ALASAN_DITUNDA : '— Tidak ada catatan penundaan —' }}
            </p>
          </div>
        </div>

          <div class="p-3 bg-blue-50/30 border border-blue-100 rounded-lg" v-if="viewData.LINK_MEET && viewData.LINK_MEET != 'null'">
            <label class="flex items-center gap-1.5 text-[12px] font-bold text-blue-900 uppercase tracking-widest mb-1">
              <el-icon><VideoCamera /></el-icon> Meeting Link
            </label>
            <a
              :href="viewData.LINK_MEET"
              target="_blank"
              class="text-md font-bold text-blue-600 truncate block no-underline hover:text-blue-800 transition-colors"
            >
              {{ viewData.LINK_MEET || 'Link tidak tersedia' }}
            </a>
          </div>

          <div class="p-3 bg-slate-50 border border-slate-100 rounded-lg">
            <label class="flex items-center gap-1.5 text-[12px] font-bold text-blue-900 uppercase tracking-widest mb-1">
              <el-icon><MapLocation /></el-icon> Lokasi
            </label>
            <p class="text-md font-medium text-slate-600 leading-relaxed italic">
              {{ viewData.addressInfo && viewData.addressInfo !== 'null' ? viewData.addressInfo : '——' }}
            </p>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div class="p-3 bg-blue-50/30 border border-blue-100 rounded-lg">
            <label class="flex items-center gap-1.5 text-[12px] font-bold text-blue-900 uppercase tracking-widest mb-1">
              <el-icon><Timer /></el-icon> Data Dibuat
            </label>
            {{ viewData.CREATE_AT }}
          </div>

          <div class="p-3 bg-blue-50/30 border border-blue-100 rounded-lg">
            <label class="flex items-center gap-1.5 text-[12px] font-bold text-blue-900 uppercase tracking-widest mb-1">
              <el-icon><Timer /></el-icon> Terakhir Diperbarui
            </label>
            {{ viewData.LAST_UPDATE }}
          </div>
          </div>
        </div>

        <div class="mt-6 md:mt-8 flex items-center gap-2">
          <el-link :href="viewData.LOKASI" target="_blank">
            <el-button type="primary" class="!h-9 !rounded-lg !font-medium px-4">
              <el-icon class="mr-1"><MapLocation /></el-icon>
              Maps
            </el-button>
          </el-link>
          <el-button
            v-if="viewData.STATUS_TASK === 'Baru'"
            type="warning"
            class="!h-9 !rounded-lg !font-medium px-4 ml-2"
            @click="onDelayDialog(viewData)"
          >
            Tunda
          </el-button>
          <el-button
            v-if="viewData.STATUS_TASK === 'Baru' || viewData.STATUS_TASK === 'Ditunda'"
            type="success"
            class="!h-9 !rounded-lg !font-medium px-4"
            @click="onCompleteDialog(viewData)"
          >
            Selesai
          </el-button>
        </div>
      </div>
    </el-dialog>
    <!-- add dialog -->
    <el-dialog-drawer v-model="addDialog" title="Tambah Jadwal">
      <el-form
        :model="addData"
        ref="addForm"
        :label-position="labelPosition()"
        :rules="rules"
        label-width="150px"
        class="md:grid md:grid-cols-2 grid-cols-1 gap-x-4"
      >
      <div>
        <el-form-item label="Nama Customer" prop="L_CUSTOMER_NAME">
          <el-select-v2
            v-model="addData.L_CUSTOMER_NAME"
            filterable
            remote
            clearable
            reserve-keyword
            placeholder="Pilih / Cari Customer"
            :remote-method="queryFollowUp"
            :options="leads"
            :loading="leadsLoading"
            style="width: 100%"
            @change="onSelectLead"
            @clear="resetCustomer"
          />
        </el-form-item>

        <el-form-item label="Contact Person">
          <el-input v-model="addData.L_CONTACT_PERSON" placeholder="Contact Person" />
        </el-form-item>

        <el-form-item label="Hp/wa">
          <el-input v-model="addData.L_CUSTOMER_PHONE" :controls="false" placeholder="Hp/wa" />
        </el-form-item>

        <el-form-item label="Agenda" prop="T_AGENDA">
          <el-input v-model="addData.T_AGENDA" placeholder="Agenda" />
        </el-form-item>

        <el-form-item label="Tanggal & Jam" prop="T_TIME">
          <el-date-picker
            v-model="addData.T_TIME"
            type="datetime"
            placeholder="Pilih tanggal & jam"
            value-format="YYYY-MM-DD HH:mm:ss"
            format="DD-MM-YYYY HH:mm"
          />
        </el-form-item>
      </div>
      <div>

        <el-form-item label="Reminder Email" prop="T_REMINDER_EMAIL">
          <el-input v-model="addData.T_REMINDER_EMAIL" placeholder="Email" />
        </el-form-item>
        
        <el-form-item label="Alamat">
          <el-input type="textarea" v-model="addData.L_CUSTOMER_ADDRESS" placeholder="Alamat Kantor" />
        </el-form-item> 
        <el-form-item prop="T_IS_OFFLINE_MEETING">
          <el-checkbox v-model="addData.T_IS_OFFLINE_MEETING" label="Offline Meeting"></el-checkbox>
        </el-form-item>
  
        <el-form-item label="Link Google meet" prop="T_MEET" v-if="!addData.T_IS_OFFLINE_MEETING">
          <el-input v-model="addData.T_MEET" />
          <el-alert type="warning" title="Wajib diisi jika online meeting!" :closable="false"></el-alert>
        </el-form-item>
      </div>
      <el-form-item label="Link Google Maps" prop="T_LOCATION_BY_GOOGLE_MAPS" class="col-span-2" v-if="addData.T_IS_OFFLINE_MEETING">
        <el-input v-model="addData.T_LOCATION_BY_GOOGLE_MAPS" class="hidden"></el-input>
        <a :href="addData.T_LOCATION_BY_GOOGLE_MAPS">{{ addData.T_LOCATION_BY_GOOGLE_MAPS }}</a>
        <div class="w-full">
          <leaflet-mark-v2 v-model:address="addData.addressInfo" v-model:googleMap="addData.T_LOCATION_BY_GOOGLE_MAPS"></leaflet-mark-v2>
        </div>
        <div v-if="addData.addressInfo" class="w-full">
          <el-input v-model="addData.addressInfo" readonly type="textarea"></el-input>
        </div>
      </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="handleClose(() => (dialogVisible = false))">Batal</el-button>
        <el-button type="primary" @click="onSaveAdd">Simpan</el-button>
      </template>
    </el-dialog-drawer>
    <!-- edit dialog -->
    <el-dialog v-model="editDialog" title="Tambah Jadwal" :width="dialogWidth()" :before-close="handleClose">
      <el-form
        :model="editData"
        ref="editForm"
        :label-position="labelPosition()"
        :rules="rules"
        label-width="150px"
        class="md:grid md:grid-cols-2 grid-cols-1 gap-4"
      >
        <el-form-item label="Nama Customer" prop="L_CUSTOMER_NAME">
          <el-select-v2
            v-model="editData.L_CUSTOMER_NAME"
            filterable
            remote
            clearable
            reserve-keyword
            placeholder="Pilih / Cari Customer"
            :remote-method="queryFollowUp"
            :options="leads"
            :loading="leadsLoading"
            style="width: 100%"
            @change="onSelectLead"
            @clear="resetCustomer"
          />
        </el-form-item>

        <el-form-item label="Contact Person">
          <el-input v-model="editData.L_CONTACT_PERSON" placeholder="Contact Person" />
        </el-form-item>

        <el-form-item label="Hp/wa">
          <el-input v-model="editData.L_CUSTOMER_PHONE" :controls="false" placeholder="Hp/wa" />
        </el-form-item>

        <el-form-item label="Agenda" prop="T_AGENDA">
          <el-input v-model="editData.T_AGENDA" placeholder="Agenda" />
        </el-form-item>

        <el-form-item v-if="['ADM', 'SLSM'].includes(role)" class="mb-0 md:w-[800px]" label="Tanggal & Jam" prop="T_TIME">
          <el-date-picker
            v-model="editData.T_TIME"
            type="datetime"
            placeholder="Pilih tanggal & jam"
            value-format="YYYY-MM-DD HH:mm:ss"
            format="DD-MM-YYYY HH:mm"
          />
        </el-form-item>

        <el-form-item v-else class="mb-0 md:w-[800px]" label="Tanggal & Jam" prop="T_TIME">
          <el-date-picker
            v-model="editData.T_TIME"
            type="datetime"
            placeholder="Pilih tanggal & jam"
            value-format="YYYY-MM-DD HH:mm:ss"
            format="DD-MM-YYYY HH:mm"
            disabled
          />
        </el-form-item>

        <el-form-item label="Reminder Email" prop="T_REMINDER_EMAIL">
          <el-input v-model="editData.T_REMINDER_EMAIL" placeholder="Email" />
        </el-form-item>

        <el-form-item label="Link Google meet" prop="T_MEET">
          <el-input v-model="editData.T_MEET" />
        </el-form-item>

        <el-form-item label="Alamat">
          <el-input type="textarea" v-model="editData.L_CUSTOMER_ADDRESS" />
        </el-form-item>

        <el-form-item label="Link Google Maps" prop="T_LOCATION_BY_GOOGLE_MAPS" class="col-span-2">
          <el-input v-model="editData.T_LOCATION_BY_GOOGLE_MAPS" class="hidden"></el-input>
          <a :href="editData.T_LOCATION_BY_GOOGLE_MAPS">{{ editData.T_LOCATION_BY_GOOGLE_MAPS }}</a>
          <div class="w-full">
            <leaflet-mark-v2 v-model:address="editData.addressInfo" v-model:googleMap="editData.T_LOCATION_BY_GOOGLE_MAPS"></leaflet-mark-v2>
          </div>
          <div v-if="editData.addressInfo" class="w-full">
            <el-input v-model="editData.addressInfo" readonly type="textarea"></el-input>
            <!-- <el-button type="success" :icon="CircleCheck" size="small" @click="addData.L_CUSTOMER_ADDRESS = addressInfo">Ini merupakan alamat kantor Customer</el-button> -->
          </div>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="handleClose">Batal</el-button>
        <el-button type="primary" @click="onSaveEdit">Simpan</el-button>
      </template>
    </el-dialog>
    <!-- filter -->
    <el-dialog v-model="showFilter" title="Filter Deals" :width="dialogWidth()">
      <div class="flex items-center gap-2">
        <el-date-picker v-model="since" type="date" placeholder="Start Date" class="!w-full" />
        <span class="text-gray-400">-</span>
        <el-date-picker v-model="until" type="date" placeholder="End Date" class="!w-full" />
      </div>

      <template #footer>
        <el-button type="primary" @click="applyFilter">Apply</el-button>
      </template>
    </el-dialog>
    <!-- tunda  -->
    <el-dialog v-model="editDialogDelay" title="Tunda Task" :width="dialogWidth()" class="rounded-2xl max-w-[500px] overflow-hidden">
      <div class="p-1 space-y-4">
        <div class="flex items-center gap-3 p-3 bg-amber-50 border border-amber-100 rounded-xl">
          <div class="p-2 bg-amber-500 rounded-lg text-white">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h4 class="text-sm font-bold text-amber-800 text-[13px]">Alasan Penundaan</h4>
          </div>
        </div>

        <div class="space-y-2">
          <el-form class="w-full" :model="editDataDelay" ref="editFormDelay">
            <label class="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Alasan Penundaan</label>
            <el-input type="textarea" :rows="3" v-model="editDataDelay.T_ALASAN_DITUNDA" class="reason-input" />
          </el-form>
        </div>

        <div class="flex justify-end gap-2 pt-2">
          <el-button @click="editDialogDelay = false" class="!rounded-lg !text-xs font-bold uppercase tracking-tight">Batal</el-button>
          <el-button type="warning" @click="onDelaySave" class="!rounded-lg !text-xs font-bold uppercase tracking-tight shadow-sm shadow-amber-200">
            Konfirmasi
          </el-button>
        </div>
      </div>
    </el-dialog>
    <!-- selesai -->
    <el-dialog v-model="editDialogComplete" title="Selesaikan Task" :width="dialogWidth()" class="rounded-2xl max-w-[500px] overflow-hidden">
      <!-- FORM -->
      <el-form ref="editFormComplete" :model="editDataComplete" :rules="rules" label-position="top">

        <div class="p-1 text-center space-y-4">
          <div class="mx-auto w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-2">
            <el-icon size="50"><SuccessFilled /></el-icon>
          </div>

          <div class="space-y-1">
            <h3 class="text-lg font-black text-gray-800">apakah anda yakin ?</h3>
          </div>

          <div class="flex flex-col gap-2 pt-4">
            <el-button
              type="success"
              @click="onCompleteSave"
              class="!rounded-xl !py-4 font-bold uppercase tracking-widest shadow-md shadow-emerald-100"
            >
              Ya, Sudah Selesai
            </el-button>
          </div>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { dialogWidth, labelPosition } from '../../helper/appUtils';
import { ElMessageBox } from 'element-plus';
import {
  User,
  Document,
  Phone,
  WarningFilled,
  Timer,
  VideoCamera,
  MapLocation,
  Search,
  SuccessFilled,
} from '@element-plus/icons-vue';
import API from '../../api/apiTask';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import { queryFollowUp, leads, leadsLoading } from '../../helper/autoCompleteQuery';

// import hooks buat insert, edit, pagination, dll
import HOOKS from '../../hooks/bundleOneOps';

const { listData, rowTotal, pageIndex, pageSize, getListData, changeIndex, loading, filterData, search, headers } = HOOKS.useListDataPaginate();
const { addData, addForm, addDialog, saveAdd, cancelAdd } = HOOKS.useAddOneData();
const [TaskStage, GetTaskStage, loadingTaskStage] = HOOKS.useGetData();
GetTaskStage(() => API.apiGetTaskStage());

const { viewData, viewDialog, openViewDialog } = HOOKS.useViewOneData();
const {
  openEditDialog: openEditDialogComplete,
  editDialog: editDialogComplete,
  editData: editDataComplete,
  editForm: editFormComplete,
  saveEdit: saveEditComplete,
} = HOOKS.useEditOneData();
const {
  openEditDialog: openEditDialogDelay,
  editDialog: editDialogDelay,
  editData: editDataDelay,
  editForm: editFormDelay,
  saveEdit: saveEditDelay,
} = HOOKS.useEditOneData();

const { openEditDialog, editDialog, editData, editForm, saveEdit2 } = HOOKS.useEditOneData();
const { deleteData } = HOOKS.useDeleteOneData();
const store = useStore();
const route = useRoute();
const accountId = computed(() => store.getters.accountId) || localStorage.getItem('id');
const role = computed(() => store.getters.userRole) || localStorage.getItem('role');
const groupValue = computed(() => store.getters.userGroup);
filterData.value.USER_ID = accountId.value;
filterData.value.ROLE = role.value || localStorage.getItem('role');
filterData.value.GROUP_ID = groupValue.value || localStorage.getItem('group');

const date = new Date();

const endDate = new Date(date);
const startDate = new Date(date);
filterData.value.until = endDate.toISOString().split('T')[0];
startDate.setDate(startDate.getDate() - 7);
filterData.value.since = startDate.toISOString().split('T')[0];

function handleFilterSales(data) {
  isManualFilter.value = true;
  filterData.value.USER_ID = data.USER_ID;
  filterData.value.ROLE = data.USER_ROLE;
  filterData.value.GROUP_ID = data.USER_GROUP_CODE;
  applyFilter();
}

if (route.query.since) {
  filterData.value.since = route.query.since;
  filterData.value.until = route.query.until;
}

if (route.query.user_id) {
  filterData.value.USER_ID = route.query.user_id;
}

if (route.query.ROLE) {
  filterData.value.ROLE = route.query.ROLE;
}
if (route.query.GROUP_ID) {
  filterData.value.GROUP_ID = route.query.GROUP_ID;
}

const rules = {
  L_CUSTOMER_NAME: [{ required: true, message: 'Nama Customer wajib diisi', trigger: 'blur' }],
  T_AGENDA: [{ required: true, message: 'Agenda wajib diisi', trigger: 'blur' }],
  T_TIME: [{ required: true, message: 'Tanggal & Jam wajib diisi', trigger: 'change' }],
  T_MEET: [{ required: true, type: 'url', message: 'Link Google meet Wajib diisi', trigger: 'blur' }],
  T_LOCATION_BY_GOOGLE_MAPS: [{ required: true, type: 'url', message: 'Link Google Maps Wajib diisi', trigger: 'blur' }],
  T_IS_OFFLINE_MEETING: [{ required: true, message: 'Wajib dicentang', trigger: 'change' }],
};

const q = ref('');
const showFilter = ref(false);
const filterPipeline = ref(null);
const isManualFilter = ref(false);

function onViewDialog(row) {
  openViewDialog(row);
}

//set warna berdasarkan status
const statusType = (status) => {
  switch (status) {
    case 'Baru':
      return 'warning'; // kuning
    case 'Ditunda':
      return 'danger'; // merah
    case 'Selesai':
      return 'success'; // hijau
    default:
      return 'info';
  }
};

//pagination
function doPaginate(index = 1, pSize) {
  getListData(API.getDataTask, index, pSize || pageSize.value, search.value, filterData.value);
}

function changePage(index = 1) {
  changeIndex(() => doPaginate(index), index);
}

// buat function untuk open dialog
function onAddDialog() {
  addData.value.T_IS_OFFLINE_MEETING = false
  addDialog.value = true;
}

// COMPLETE
function onCompleteDialog(row) {
  const data = {
    id: row.ID_TASK,
  };
  openEditDialogComplete(data);
}
function onCompleteSave() {
  saveEditComplete(() => firstload(), API.apiTaskCompleted, ['id']);
  viewDialog.value = false;
}

// TUNDA
function onDelayDialog(row) {
  const data = {
    id: row.ID_TASK,
    status: row.STATUS_TASK,
  };
  openEditDialogDelay(data);
}
function onDelaySave() {
  saveEditDelay(() => firstload(), API.apiTaskDelayed, ['id', 'T_ALASAN_DITUNDA']);
  viewDialog.value = false;
}

// EDIT
function onEditDialog(row) {
  const data = {
    ID_TASK: row.ID_TASK,
    L_CUSTOMER_NAME: row.NAMA_CUSTOMER,
    L_CONTACT_PERSON: row.CONTACT,
    L_CUSTOMER_PHONE: row.NOMOR_HP,
    T_AGENDA: row.AGENDA,
    T_TIME: row.TIME,
    T_REMINDER_EMAIL: row.REMINDER_EMAIL,
    T_MEET: row.LINK_MEET,
    L_CUSTOMER_ADDRESS: row.ALAMAT_CUSTOMER,
    T_LOCATION_BY_GOOGLE_MAPS: row.LOKASI,
    T_STATUS: row.STATUS_TASK,
    T_ALASAN_DITUNDA: row.ALASAN_DITUNDA,
  };
  openEditDialog(data);
}
function onSaveEdit() {
  saveEdit2(
    () => firstload(),
    (payload) => API.apiTaskEdit(editData.value.ID_TASK, payload),
  );
}

// DELETE
function onDelete(row) {
  deleteData(() => firstload(), API.apiTaskDelete, { ID_TASK: String(row.ID_TASK) });
}

// buat function untuk validasi input dan insert
function onSaveAdd() {
  saveAdd(() => firstload(), API.apiTaskInsert);
}

function onSelectLead(value) {
  const selected = leads.value.find((item) => item.value === value);

  if (!selected || !selected.raw) return;

  const r = selected.raw;

  addData.value.L_CUSTOMER_NAME = r.LEADS_CUSTOMER_NAME;
  addData.value.L_CUSTOMER_ADDRESS = r.Alamat;
  addData.value.L_CUSTOMER_PHONE = r.No_Handphone;
  addData.value.L_CONTACT_PERSON = r.Kontak_Person;

  changePage(1);
}

watch(
  () => addData.value.LEADS_ID,
  (v) => {
    if (!v) {
      Object.keys(addData.value).forEach((k) => {
        addData.value[k] = '';
      });
    }
  },
);

function resetCustomer() {
  Object.keys(addData.value).forEach((k) => {
    addData.value[k] = '';
  });
  addData.value.LEADS_ID = null;
}

const handleClose = (done) => {
  ElMessageBox.confirm('Anda yakin ingin menutup? Data belum disimpan akan hilang.', 'Konfirmasi', {
    confirmButtonText: 'Ya',
    cancelButtonText: 'Batal',
    type: 'warning',
  })
    .then(() => {
      done((addDialog.value = false), (editDialog.value = false));
    })
    .catch(() => {});
};

function applyFilter() {
  changePage(1);
}

function resetFilter() {
  isManualFilter.value = false;
  filterData.value.ROLE = role.value;
  filterData.value.GROUP_ID = groupValue.value;
  applyFilter();
}

let searchTimeout = null;

watch(q, (val) => {
  clearTimeout(searchTimeout);

  searchTimeout = setTimeout(() => {
    const keyword = val?.trim();
    search.value = keyword && keyword.length > 0 ? keyword : undefined;

    changePage(1);
  }, 400);
});

function firstload() {
  doPaginate(pageIndex.value);
}

watch(filterPipeline, (val) => {
  filterData.value.STATUS_TASK = val;
  changePage(1);
});

firstload();
</script>
<style>
.none {
  display: none;
}
</style>
