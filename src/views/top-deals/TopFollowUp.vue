<template>
  <div class="bg-[#ffffff] flex flex-col items-center">
    <div class="w-full p-2">
      <div class="flex items-center justify-between mb-3">
        <h1 class="text-lg font-semibold">Follow Up Top</h1>
        <!-- filter -->
        <div class="flex items-center gap-2 ml-auto">
          <el-button type="primary" @click="onAddDialog">
            <el-icon class="m-1"><CirclePlusFilled /></el-icon> Follow Up
          </el-button>
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
              </template></el-date-range-input
            >
          </el-form-item>
          <div class="relative w-full">
            <div class="absolute bottom-0 right-0 hidden md:block">
              <el-button type="primary" class="w-full md:w-auto" @click="applyFilter"> Filter </el-button>
            </div>
          </div>
        </div>
      </el-form>
      <div class="flex flex-col sm:flex-row sm:items-center gap-3 mb-5 w-full">
        <el-input v-model="q" placeholder="Cari Toko" class="w-full sm:w-[200px]" clearable>
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-select v-model="filterPipeline" placeholder="Semua Status" clearable class="max-w-80 sm:w-56">
          <el-option label="Semua Status" value="" />
          <!-- <el-option v-for="(item, index) in SalesFolowUpStage.body" :key="index" :label="item.label" :value="item.value" /> -->
          <el-option label="Proses" value="TOP-PROSES" />
          <el-option label="Proses Lanjut" value="TOP-PROSES LANJUT" />
          <el-option label="Belum Minat" value="TOP-BELUM MINAT" />
        </el-select>

        <el-select v-model="filterStatusApproval" placeholder="Semua Approval" clearable class="max-w-80 sm:w-56">
          <el-option label="Semua Status" value="" />
          <!-- <el-option v-for="(item, index) in SalesFolowUpStage.body" :key="index" :label="item.label" :value="item.value" /> -->
          <el-option label="Belum Diajukan" value="5" />
          <el-option label="Waiting" value="2" />
          <el-option label="Approved" value="3" />
          <el-option label="Rejected" value="4" />
        </el-select>

        <el-form :model="filterData" class="flex flex-col sm:flex-row sm:items-end gap-2 w-full md:w-auto">
          <el-form-item prop="USER_ID" v-if="['ADM', 'SLSM'].includes(role)" class="mb-0 md:w-[280px]">
            <el-inferior-input
              v-model="filterData.USER_ID"
              :user-id="accountId"
              :group-id="groupValue"
              :role="role"
              @handle-change="handleFilterSales"
              @clear="resetFilter"
            />
          </el-form-item>
        </el-form>
      </div>
      <div>
        <!-- MOBILE -->
        <div class="block md:hidden">
          <card-list v-if="listData && listData.length" :list="listData" is-rounded>
            <card-list-item is-single-column>
              <template #default="{ row }">
                <div class="flex justify-between items-start">
                  <h3 class="font-bold text-base text-gray-800 truncate pr-2">
                    {{ row.nama_toko }}
                  </h3>

                  <el-dropdown trigger="click">
                    <el-icon class="text-gray-400 cursor-pointer">
                      <More />
                    </el-icon>
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item @click="onViewDialog(row)"> Detail </el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </div>

                <p class="text-sm text-gray-500 truncate mb-2">
                  {{ row.lurah || 'Alamat tidak tersedia' }}
                </p>

                <hr class="mb-3" />

                <div class="grid grid-cols-2 gap-2 text-xs mb-3">
                  <div>
                    <span class="text-gray-400 block">Nama Pemilik:</span>
                    <p class="font-medium text-gray-700 truncate">{{ row.owner }}</p>
                  </div>
                  <div>
                    <span class="text-gray-400 block">Email:</span>
                    <p class="font-medium text-gray-700 truncate">{{ row.email || '-' }}</p>
                  </div>
                  <div>
                    <span class="text-gray-400 block">WhatsApp:</span>
                    <p class="font-medium text-gray-700 truncate">{{ row.nomor_wa }}</p>
                  </div>
                  <div>
                    <span class="text-gray-400 block">Marketplace:</span>
                    <p class="font-medium text-gray-700 truncate">{{ row.marketplace }}</p>
                  </div>
                </div>

                <div class="flex flex-wrap gap-2 mt-2">
                  <el-tag :type="statusTagType(row.status_followUp)" size="small" effect="dark">
                    {{ row.status_followUp }}
                  </el-tag>
                  <el-tag type="info" size="small" effect="plain">
                    <el-icon class="mr-1"><User /></el-icon>
                    {{ row.NAMA_SALES }}
                  </el-tag>
                </div>
              </template>
            </card-list-item>
          </card-list>
          <div v-else class="text-center text-sm text-gray-400 py-10">Tidak ada data</div>
        </div>

        <!-- DESKTOP -->
        <div class="hidden md:block">
          <el-table v-loading="loading" :data="listData" stripe border header-cell-class-name="table-header" style="width: 100%">
            <el-table-column type="index" label="No" min-width="50" align="center" fixed />

            <el-table-column prop="NAMA_SALES" label="Nama Sales" min-width="250" show-overflow-tooltip sortable/>

            <el-table-column prop="nama_toko" label="Nama Toko" min-width="180" show-overflow-tooltip sortable/>

            <el-table-column prop="owner" label="Nama Pemilik" min-width="150" show-overflow-tooltip sortable/>

            <el-table-column prop="nomor_wa" label="No. WhatsApp" min-width="140" sortable/>

            <el-table-column prop="marketplace" label="Marketplace" min-width="130" sortable/>

            <el-table-column prop="tipe_marketplace" label=" Jenis Toko" min-width="150" sortable/>

            <el-table-column prop="category_produk" label="Kategori Produk" min-width="150" show-overflow-tooltip sortable/>

            <el-table-column prop="tipe_bangunan" label="Jenis Bangunan Toko" min-width="170" sortable/>

            <el-table-column prop="lurah" label="Kelurahan" min-width="150" show-overflow-tooltip sortable/>

            <el-table-column prop="sumber_data" label="Sumber Data" min-width="120" align="center" sortable/>

            <el-table-column prop="usaha_lain" label="Usaha Lain" min-width="110" align="center" sortable/>

            <el-table-column prop="status_followUp" label="Status Follow Up" min-width="150" sortable>
              <template #default="{ row }">
                <el-tag :type="statusTagType(row.status_followUp)" size="small">
                  {{ row.status_followUp }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="Status" label="Status Approval" min-width="170" align="center" sortable>
              <template #default="{ row }">
                <span class="font-semibold" :class="statusApproval(row.Status)">
                  {{ row.Status }}
                </span>
              </template>
            </el-table-column>

            <el-table-column prop="data_dibuat" label="Tgl Input" min-width="160" sortable />

            <el-table-column prop="Pengajuan_id" label="ID TOP" min-width="200" fixed="right" sortable>
              <template #default="{ row }">
                <el-button
                  v-if=" row.status_followUp === 'TOP-PROSES LANJUT' && row.ID_Account == null && row.Status == '-'"
                  type="success"
                  size="small"
                  style="margin-left: 8px"
                  @click="onPengajuanId(row)"
                >
                  Ajukan ID TOP
                </el-button>

                <!-- <span v-else-if="role == 'SLS' && row.status_followUp === 'TOP-PROSES LANJUT' && row.ID_Account == null && row.Status == '-'">
                Sedang Diajukan Atasan
                </span> -->

                <span v-else-if="row.status_followUp === 'TOP-PROSES LANJUT' && row.ID_Account != null">
                  {{ row.ID_Account }}
                </span>
                <div v-else>
                  <p>-</p>
                </div>
              </template>
            </el-table-column>

            <table-column-action show-view @click-view="onViewDialog" fixed="right" />
          </el-table>
        </div>
        <!-- pagination -->
        <div class="flex items-center justify-center gap-4 mt-6">
          <PaginationView :total="rowTotal" :page-size="pageSize" :current-page="pageIndex" @current-change="changePage" />
        </div>
      </div>
      <!-- add dialog -->
      <div class="flex items-center gap-2">
        <el-dialog v-model="addDialog" title="Follow Up Lead" :width="dialogWidth()" :before-close="handleClose">
          <el-form
            :model="addData"
            :rules="topRules"
            ref="addForm"
            label-width="180px"
            :label-position="labelPosition()"
            class="grid md:grid-cols-2 grid-cols-1 gap-4"
          >
            <!-- Nama Toko -->
            <el-form-item label="Nama Toko" prop="LT_SHOP_NAME">
              <el-select-v2
                v-model="addData.LT_SHOP_NAME"
                filterable
                remote
                clearable
                reserve-keyword
                placeholder="Pilih / Cari Toko"
                :remote-method="queryTop"
                :options="top"
                :loading="topLoading"
                style="width: 100%"
                @change="onSelectLead"
                @clear="resetToko"
              />
            </el-form-item>

            <el-form-item label="ID" prop="LT_LEADS_ID" class="hidden">
              <el-input v-model="addData.LT_LEADS_ID" placeholder="id" />
            </el-form-item>

            <!-- Nama Pemilik -->
            <el-form-item label="Nama Pemilik" prop="LT_OWNER_NAME">
              <el-input v-model="addData.LT_OWNER_NAME" placeholder="Nama pemilik" />
            </el-form-item>

            <!-- WhatsApp -->
            <el-form-item label="Nomor WhatsApp" prop="LT_WHATSAPP">
              <el-input v-model="addData.LT_WHATSAPP" placeholder="08xxxx" />
            </el-form-item>

            <!-- Email -->
            <el-form-item label="Email" prop="LT_EMAIL">
              <el-input v-model="addData.LT_EMAIL" placeholder="Email" />
            </el-form-item>

            <!-- Provinsi -->
            <el-form-item label="Provinsi" prop="LT_PROVINCE_ID">
              <el-province-input v-model="addData.LT_PROVINCE_ID" disabled />
            </el-form-item>

            <!-- Kota -->
            <el-form-item label="Kota / Kabupaten" prop="LT_CITY_ID">
              <el-city-input v-model="addData.LT_CITY_ID" disabled />
            </el-form-item>

            <!-- Kecamatan -->
            <!-- <el-form-item label="Kecamatan" prop="LT_DISTRICT_ID">
              <el-district-input v-model="addData.LT_DISTRICT_ID" disabled />
            </el-form-item> -->
            <el-form-item label="Kelurahan" prop="LT_DISTRICT_ID">
              <el-select-v2
                v-model="addData.LT_DISTRICT_ID"
                :options="subDistrictOptions"
                filterable
                remote
                clearable
                disabled
                reserve-keyword
                style="width: 100%"
                placeholder="Pilih Kecamatan"
              />
            </el-form-item>

            <!-- Kelurahan -->
            <el-form-item label="Kelurahan" prop="LT_SUBDISTRICT_ID">
              <el-select-v2
                v-model="addData.LT_SUBDISTRICT_ID"
                :options="subDistrictOptions"
                filterable
                remote
                clearable
                disabled
                reserve-keyword
                style="width: 100%"
                placeholder="Pilih Kelurahan"
              />
            </el-form-item>

            <!-- Alamat -->
            <el-form-item label="Alamat" prop="LT_ADDRESS" class="md:col-span-2">
              <el-input type="textarea" v-model="addData.LT_ADDRESS" :rows="2" />
            </el-form-item>

            <!-- Marketplace -->
            <el-form-item label="Marketplace" prop="LT_MARKETPLACE">
              <el-select v-model="addData.LT_MARKETPLACE" placeholder="Pilih Marketplace" style="width: 100%">
                <el-option label="Tokopedia" value="Tokopedia" />
                <el-option label="Shopee" value="Shopee" />
                <el-option label="Tiktok Shop" value="Tiktok Shop" />
                <el-option label="Blibli" value="Blibli" />
                <el-option label="Lazada" value="Lazada" />
                <el-option label="Facebook" value="Facebook" />
                <el-option label="Instagram" value="Instagram" />
                <el-option label="Google Maps" value="Google Maps" />
                <el-option label="Website" value="Website" />
                <el-option label="Lainnya" value="Lainnya" />
              </el-select>
            </el-form-item>

            <el-form-item label="Jenis Toko" prop="LT_MARKETPLACE_TYPE">
              <el-select v-model="addData.LT_MARKETPLACE_TYPE" style="width: 100%">
                <el-option label="Official Mall" value="Official Mall" />
                <el-option label="Shopee Mall" value="Shopee Mall" />
                <el-option label="Z Mall" value="Z Mall" />
                <el-option label="Power Shop" value="Power Shop" />
                <el-option label="Start Seller" value="Start Seller" />
                <el-option label="Seller Biasa" value="Seller Biasa" />
              </el-select>
            </el-form-item>

            <!-- Kategori Produk -->
            <el-form-item label="Kategori Produk" prop="LT_PRODUCT_CATEGORY">
              <el-select v-model="addData.LT_PRODUCT_CATEGORY" placeholder="Kategori Produk" style="width: 100%">
                <el-option v-for="(ctproduct, index) in category.body" :key="index" :label="ctproduct.label" :value="ctproduct.value" />
                <!-- 
                  <el-option label="Deposit" value="Deposit" />
                  <el-option label="Invoice" value="Invoice" /> -->
              </el-select>
            </el-form-item>

            <!-- Cara Pencarian -->
            <el-form-item label="Cara Pencarian Data" prop="LT_DATA_SOURCE">
              <el-select v-model="addData.LT_DATA_SOURCE" style="width: 100%">
                <el-option label="Online" value="Online" />
                <el-option label="Kanvasing" value="Kanvasing" />
              </el-select>
            </el-form-item>

            <!-- Latitude -->
            <el-form-item label="Latitude" prop="LT_LATITUDE">
              <el-input v-model="addData.LT_LATITUDE" placeholder="-8.xxxxxx" />
            </el-form-item>

            <!-- Longitude -->
            <el-form-item label="Longitude" prop="LT_LONGITUDE">
              <el-input v-model="addData.LT_LONGITUDE" placeholder="110.xxxxxx" />
            </el-form-item>

            <!-- Jenis Bangunan -->
            <el-form-item label="Jenis Bangunan Toko" prop="LT_BUILDING_TYPE">
              <el-select v-model="addData.LT_BUILDING_TYPE" placeholder="Jenis Bangunan" style="width: 100%">
                <el-option label="Gedung" value="Gedung" />
                <el-option label="Ruko" value="Ruko" />
                <el-option label="kios" value="Kios" />
                <el-option label="Rumah" value="Rumah" />
              </el-select>
            </el-form-item>

            <!-- Usaha lain -->
            <el-form-item label="Ada Usaha Lain?" prop="LT_OTHER_BUSINESS">
              <el-select v-model="addData.LT_OTHER_BUSINESS" style="width: 100%">
                <el-option label="Ada" value="Ada" />
                <el-option label="Tidak" value="Tidak" />
              </el-select>
            </el-form-item>

            <!-- Jenis Usaha -->
            <div v-if="addData.LT_OTHER_BUSINESS === 'Ada'">
              <el-form-item label="Jenis Usaha" prop="LT_OTHER_BUSINESS_TYPE">
                <el-input v-model="addData.LT_OTHER_BUSINESS_TYPE" placeholder="Jenis Usaha" />
              </el-form-item>
            </div>

            <!-- Nama Brand -->
            <div v-if="addData.LT_OTHER_BUSINESS === 'Ada'">
              <el-form-item label="Nama Brand Usaha" prop="LT_OTHER_BUSINESS_NAME">
                <el-input v-model="addData.LT_OTHER_BUSINESS_NAME" placeholder="Nama Brand Usaha" />
              </el-form-item>
            </div>

            <!-- Status -->
            <el-form-item label="Status Follow Up" prop="LT_STATUS" class="md:col-span-2">
              <el-select v-model="addData.LT_STATUS" style="width: 100%">
                <el-option label="Proses" value="TOP-PROSES" />
                <el-option label="Proses Lanjut" value="TOP-PROSES LANJUT" />
                <el-option label="Belum Minat" value="TOP-BELUM MINAT" />
              </el-select>
            </el-form-item>

            <!-- Upload -->
            <div v-if="addData.LT_STATUS === 'TOP-PROSES LANJUT'">
              <el-form-item label="Foto Lokasi Tempat" prop="LT_PHOTO_LOCATION">
                <upload-file-with-camera v-model="addData.LT_PHOTO_LOCATION" />
              </el-form-item>
            </div>
            <div v-if="addData.LT_STATUS === 'TOP-PROSES LANJUT'">
              <el-form-item label="Foto Akses Jalan" prop="LT_PHOTO_ACCESS">
                <upload-file-with-camera v-model="addData.LT_PHOTO_ACCESS" />
              </el-form-item>
            </div>

            <div v-if="addData.LT_STATUS === 'TOP-PROSES LANJUT'">
              <el-form-item label="Foto Produk" prop="LT_PHOTO_PRODUCT">
                <upload-file-with-camera v-model="addData.LT_PHOTO_PRODUCT" />
              </el-form-item>
            </div>
            <div v-if="addData.LT_STATUS === 'TOP-PROSES LANJUT'">
              <el-form-item label="Foto Marketplace" prop="LT_PHOTO_MARKETPLACE">
                <upload-file-with-camera v-model="addData.LT_PHOTO_MARKETPLACE" />
              </el-form-item>
            </div>
            <div v-if="addData.LT_STATUS === 'TOP-PROSES LANJUT'">
              <el-form-item label="Bukti WhatsApp" prop="LT_PHOTO_WA">
                <upload-file-with-camera v-model="addData.LT_PHOTO_WA" />
              </el-form-item>
            </div>
            <div v-if="addData.LT_STATUS === 'TOP-BELUM MINAT' || addData.LT_STATUS === 'TOP-PROSES'">
              <el-form-item label="Bukti Aktivitas" prop="LT_BUKTI_AKTIVITAS">
                <upload-file-with-camera v-model="addData.LT_BUKTI_AKTIVITAS" />
              </el-form-item>
            </div>
          </el-form>

          <template #footer>
            <footer-button-dialog @save-click="onSaveAdd(row)" @cancel-click="handleClose"></footer-button-dialog>
          </template>
        </el-dialog>
      </div>
      <!-- detail dialog -->
      <el-dialog
        v-model="viewDialog"
        title="Detail Lead Lead Management"
        :width="dialogWidth()"
        class="deal-detail-dialog rounded-xl overflow-hidden"
        destroy-on-close
      >
        <div class="space-y-6 text-gray-700 antialiased p-2">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-5">
            <div>
              <h2 class="text-2xl font-bold text-gray-900 leading-tight">{{ viewData.nama_toko }}</h2>
              <p class="text-sm text-gray-500 flex items-center mt-1">
                <el-icon class="mr-1"><Location /></el-icon>
                {{ viewData.lurah }}, {{ viewData.alamat }}
              </p>
            </div>
            <div class="flex items-center gap-2">
              <el-tag :type="statusTagType(viewData.status_followUp)" size="small">
                {{ viewData.status_followUp }}
              </el-tag>
              <span class="text-[10px] text-gray-400 font-mono">ID: {{ viewData.id_leads }}</span>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="space-y-6 md:col-span-2">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <section>
                  <h4 class="text-[11px] font-black text-gray-400 uppercase tracking-[0.1em] mb-3">Informasi Utama</h4>
                  <div class="space-y-3">
                    <div>
                      <label class="text-[10px] text-gray-400 block uppercase">Pemilik (Owner)</label>
                      <p class="text-sm font-semibold text-gray-800">{{ viewData.owner || '-' }}</p>
                    </div>
                    <div>
                      <label class="text-[10px] text-gray-400 block uppercase">Kontak WhatsApp</label>
                      <p class="text-sm font-semibold text-blue-600">{{ viewData.nomor_wa || '-' }}</p>
                    </div>
                    <div>
                      <label class="text-[10px] text-gray-400 block uppercase">Email</label>
                      <p class="text-sm font-semibold text-gray-800">{{ viewData.email || '-' }}</p>
                    </div>
                  </div>
                </section>

                <section>
                  <h4 class="text-[11px] font-black text-gray-400 uppercase tracking-[0.1em] mb-3">Marketplace & Produk</h4>
                  <div class="space-y-3">
                    <div class="flex justify-between border-b border-gray-50 pb-2">
                      <span class="text-xs text-gray-500">Platform</span>
                      <span class="text-xs font-bold text-gray-800">{{ viewData.marketplace }} ({{ viewData.tipe_marketplace }})</span>
                    </div>
                    <div class="flex justify-between border-b border-gray-50 pb-2">
                      <span class="text-xs text-gray-500">Kategori</span>
                      <span class="text-xs font-bold text-gray-800">{{ viewData.category_produk }}</span>
                    </div>
                    <div class="flex justify-between border-b border-gray-50 pb-2">
                      <span class="text-xs text-gray-500">Tipe Bangunan</span>
                      <span class="text-xs font-bold text-gray-800">{{ viewData.tipe_bangunan }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-xs text-gray-500">Sumber Data</span>
                      <span class="text-[10px] px-2 py-0.5 bg-gray-100 rounded font-bold text-gray-600">{{ viewData.sumber_data }}</span>
                    </div>
                  </div>
                </section>
              </div>

              <div v-if="viewData.usaha_lain === 'Ada'" class="bg-orange-50/50 border border-orange-100 rounded-xl p-5">
                <h4 class="text-[11px] font-black text-orange-700 uppercase tracking-[0.1em] mb-3 flex items-center">
                  <span class="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                  Usaha Lain di Lokasi Sama
                </h4>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="text-[10px] text-orange-400 block uppercase font-bold">Jenis Usaha</label>
                    <p class="text-sm font-semibold text-gray-800">{{ viewData.jenis_usaha }}</p>
                  </div>
                  <div>
                    <label class="text-[10px] text-orange-400 block uppercase font-bold">Nama Usaha</label>
                    <p class="text-sm font-semibold text-gray-800">{{ viewData.nama_usaha }}</p>
                  </div>
                </div>
              </div>

              <div class="mt-6 border-t border-gray-100 pt-5">
                <h4 class="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Dokumentasi Foto</h4>

                <div class="grid grid-cols-2 md:grid-cols-5 gap-6">
                  <div v-if="viewData.bukti_aktivitas" class="space-y-2">
                    <span class="text-[10px] text-blue-500 font-bold uppercase tracking-wider block">Foto Bukti Aktivitas</span>
                    <image-preview :imageUrl="viewData.bukti_aktivitas" class="w-full h-full object-cover" />
                  </div>

                  <div v-if="viewData.foto_akses" class="space-y-2">
                    <span class="text-[10px] text-blue-500 font-bold uppercase tracking-wider block">Foto Akses</span>
                    <image-preview :imageUrl="viewData.foto_akses" class="w-full h-full object-cover" />
                  </div>

                  <div v-if="viewData.foto_location" class="space-y-2">
                    <span class="text-[10px] text-blue-500 font-bold uppercase tracking-wider block">Foto Lokasi Tempat</span>
                    <image-preview :imageUrl="viewData.foto_location" class="w-full h-full object-cover" />
                  </div>

                  <div v-if="viewData.foto_marketplace" class="space-y-2">
                    <span class="text-[10px] text-blue-500 font-bold uppercase tracking-wider block">Foto Marketplace</span>
                    <image-preview :imageUrl="viewData.foto_marketplace" class="w-full h-full object-cover" />
                  </div>

                  <div v-if="viewData.foto_product" class="space-y-2">
                    <span class="text-[10px] text-blue-500 font-bold uppercase tracking-wider block">Foto Produk</span>
                    <image-preview :imageUrl="viewData.foto_product" class="w-full h-full object-cover" />
                  </div>

                  <div v-if="viewData.foto_wa" class="space-y-2">
                    <span class="text-[10px] text-blue-500 font-bold uppercase tracking-wider block">Foto Chat WA</span>
                    <image-preview :imageUrl="viewData.foto_wa" class="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            </div>

            <div class="space-y-6">
              <div class="bg-gray-50 rounded-xl p-5 border border-gray-200 sticky top-0">
                <h4 class="text-[11px] font-black text-gray-500 uppercase tracking-[0.1em] mb-5">History Follow Up</h4>

                <div v-if="viewData.histori" class="relative">
                  <div class="absolute left-1.5 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                  <div class="space-y-6 relative">
                    <div v-for="(item, index) in viewData.histori.split(' - ').filter(Boolean)" :key="index" class="pl-6 relative">
                      <span class="absolute left-0 top-1.5 w-3.5 h-3.5 bg-white border-2 border-blue-500 rounded-full z-10"></span>

                      <div class="text-xs">
                        <p class="font-bold text-gray-800 leading-snug">
                          {{ item.split('(')[0] }}
                        </p>
                        <p
                          v-if="item.includes('(')"
                          class="text-[10px] text-gray-500 mt-1 bg-white p-1.5 rounded border border-gray-100 shadow-sm italic"
                        >
                          {{ item.match(/\((.*?)\)/)?.[1] }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div v-else class="text-center py-10">
                  <el-icon class="text-3xl text-gray-300"><ChatLineRound /></el-icon>
                  <p class="text-xs text-gray-400 mt-2">Belum ada histori follow up</p>
                </div>
              </div>

              <div class="bg-blue-600 rounded-xl p-4 text-white shadow-lg shadow-blue-200">
                <span class="text-[10px] font-bold uppercase opacity-80 block mb-1">Koordinat Lokasi</span>
                <p class="text-xs font-mono font-bold">{{ viewData.latitude }}, {{ viewData.longitude }}</p>
                <el-button
                  size="small"
                  class="!w-full !mt-3 !bg-white/20 !border-none !text-white hover:!bg-white/40"
                  @click="openMaps(viewData.latitude, viewData.longitude)"
                >
                  Buka di Google Maps
                </el-button>
              </div>
            </div>
          </div>

          <div class="pt-5 border-t border-gray-100 flex justify-between items-center text-[10px] text-gray-400 font-medium">
            <div class="flex gap-4">
              <span>Dibuat: {{ viewData.data_dibuat }}</span>
            </div>
            <div class="flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-green-500"></span>
              Sistem Terintegrasi
            </div>
          </div>
        </div>
      </el-dialog>
      <el-dialog v-model="pengajuanId" title=" Pengajuan ID TOP" :width="dialogWidth()" :before-close="handleClose">
        <div>
          <iframe
            v-if="pengajuanId && urlIframe"
            ref="myIframe"
            :src="urlIframe"
            class="iframe"
            @load="resizeIframe"
            :scrolling="scrolling"
            :allowTransparency="true"
            title="Dynamic Frame"
          ></iframe>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted, onUnmounted, nextTick } from 'vue';
import { Search, FullScreen, CirclePlusFilled, More, Download } from '@element-plus/icons-vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { dialogWidth, labelPosition } from '../../helper/appUtils';
import { getAddress, generateSuratPengiriman, generateFormCustomer, generateInfoCustomer, isValElForm } from '../../helper/utils';
import { rulesTOPFollowUp } from '../../helper/rules';
import { queryTop, top, topLoading } from '../../helper/autoCompleteQuery';
// import API function sesuai kebutuhan untuk hit ke backend
import API from '../../api/apiDeals';
import { useStore } from 'vuex';
// import hooks buat insert, edit, pagination, dll
import HOOKS from '../../hooks/bundleOneOps';
import { useRoute, useRouter } from 'vue-router';
import { mobileWahanaIframeHost } from '../../helper/mobileWahanaIframeConfig';

const baseUrl = import.meta.env.MODE == 'production' ? import.meta.env.VITE_API_URL_PROD : import.meta.env.VITE_API_URL_DEV;

const { addData, addForm, addDialog, saveAdd, cancelAdd } = HOOKS.useAddOneData();
const { addDialog: closingDialog, saveAdd: closingSave } = HOOKS.useAddOneData();
const { listData, rowTotal, pageIndex, pageSize, getListData, changeIndex, loading, filterData, search, headers } = HOOKS.useListDataPaginate();
const { viewData, viewDialog, openViewDialog } = HOOKS.useViewOneData();
const [SalesFolowUpStage, GetSalesFollowUpStage, loadingSalesFolowUpStage] = HOOKS.useGetData();
GetSalesFollowUpStage(() => API.apiGetSalesStageFollowUp());

const [EstimasiOmset, GetEstimasiOmset, loadingEstimasiOmset] = HOOKS.useGetData();
GetEstimasiOmset(() => API.apiGetEstimasiOmset());

const [JangkaWaktu, GetJangkaWaktu, loadingJangkaWaktu] = HOOKS.useGetData();
GetJangkaWaktu(() => API.apiGetJangkaWaktu());

const [MetodePembayaran, GetMetodePembayaran, loadingMetodePembayaran] = HOOKS.useGetData();
GetMetodePembayaran(() => API.apiGetMetodePembayaran());

const [SuratJalan, GetSuratJalan, loadingSuratJalan] = HOOKS.useGetData();
GetSuratJalan(() => API.apiGetSuratJalan());

const [JenisFollowUp, GetJenisFollowUp, loadingJenisFollowUp] = HOOKS.useGetData();
GetJenisFollowUp(() => API.apiGetJenisFollowUp());

const [StatusFollowUp, GetStatusFollowUp, loadingStatusFollowUp] = HOOKS.useGetData();
GetStatusFollowUp(() => API.apiGetSalesStageFollowUp());

const [category, GetCategory, loadingCategory] = HOOKS.useGetData();
GetCategory(() => API.apiGetCategory());

const store = useStore();
const route = useRoute();
const accountId = computed(() => store.getters.accountId);
const role = computed(() => store.getters.userRole) || localStorage.getItem('role');
const groupValue = computed(() => store.getters.userGroup);
const topRules = computed(() => rulesTOPFollowUp(addData.value));
filterData.value.USER_ID = accountId.value || localStorage.getItem('id');
filterData.value.ROLE = role.value || localStorage.getItem('role');
filterData.value.GROUP_ID = groupValue.value || localStorage.getItem('group');
filterData;

//filter sales
function handleFilterSales(data) {
  filterData.value.USER_ID = data.USER_ID;
  filterData.value.ROLE = data.USER_ROLE;
  filterData.value.GROUP_ID = data.USER_GROUP_CODE;
  applyFilter();
}

const q = ref('');
const filterPipeline = ref(null);
const filterStatusApproval = ref(null);
const pengajuanId = ref(false);
const loadingLocation = ref(false);
const location = ref(null);
const isInit = ref(true);
const isPreviewOpen = ref(false);
const selectedImg = ref('');

const title = ref(null);
const hostIframe = mobileWahanaIframeHost;
const typeIframe = ref(null);
const urlIframe = ref(null);
const scrolling = ref('yes');
const myIframe = ref(null);

const tag = computed(() => store.getters.tag || localStorage.getItem('tag'));

// console.log(tag.value);

const messageHandler = (event) => {
  if (event.origin !== hostIframe) return;

  if (event.data.type === 'iframeHeight') {
    const iframe = myIframe.value;
    iframe.style.height = event.data.height + 'px';
    scrolling.value = 'no';
  }
};

const resizeIframe = () => {
  const iframe = myIframe.value;

  try {
    const height = iframe.contentWindow.document.body.scrollHeight;
    iframe.style.height = height + 'px';
    // console.log(height);
  } catch (e) {
    console.warn('Tidak bisa akses iframe beda origin.', e);

    iframe.contentWindow.postMessage({ type: 'getHeight' }, hostIframe);

    window.addEventListener('message', messageHandler);
  }
};

// lifecycle
function openIframeTop(data) {
  console.log('open iframe with data', data);
  typeIframe.value = route.query.type || 'inputPendaftaranTop';
  title.value = route.query.title;
  document.title = 'Wahana CRM ' + title.value;

  urlIframe.value =
    hostIframe +
    // '/apps/wahana/cgi-bin/dw.cgi?b=form_crud/fnm.50010000ENTBA_TOKO_ONLINE_PRIORITAS' +
    '/apps/wahana/cgi-bin/dw.cgi?b=setsessredirmenu&u=' +
    tag.value +
    '&at=' +
    typeIframe.value +
    '&idtop=' +
    data.id_leads;

  console.log(urlIframe.value);
}

onUnmounted(() => {
  window.removeEventListener('message', messageHandler);
});

function statusTagType(status) {
  if (!status) return 'info';

  switch (status) {
    case 'TOP-PROSES':
      return 'info';

    case 'TOP-BELUM MINAT':
      return 'warning';

    case 'TOP-PROSES LANJUT':
      return 'success';

    default:
      return 'info';
  }
}

const statusApproval = (status) => {
  switch (status?.toLowerCase()) {
    case 'approved':
      return 'text-green-500';

    case 'rejected':
      return 'text-red-400';

    case 'waiting':
      return 'text-yellow-500';

    case 'new':
      return 'text-blue-400';

    default:
      return 'text-gray-400';
  }
};

const openPreview = (url) => {
  if (!url) return;
  selectedImg.value = url;
  isPreviewOpen.value = true;
};

// function onPengajuanId(row) {
//   // console.log('handle closing', row);
//   pengajuanId.value = true;
//   openIframeTop(row);
// }

function onPengajuanId(row) {
  // Set URL iframe terlebih dahulu
  openIframeTop(row); // pastikan function ini mengembalikan URL string

  // Buka dialog setelah URL terisi
  nextTick(() => {
    pengajuanId.value = true;
  });
}

function handleCloseIframe() {
  pengajuanId.value = false;
  urlIframe.value = null;
}

function onViewDialog(row) {
  openViewDialog(row);
}

const date = new Date();
const endDate = new Date(date);
const startDate = new Date(date);
filterData.value.until = endDate.toISOString().split('T')[0];
startDate.setDate(startDate.getDate() - 7);
filterData.value.since = startDate.toISOString().split('T')[0];
// // console.log(route.query);

if (route.query.ROLE) {
  filterData.value.ROLE = route.query.ROLE;
}

if (route.query.GROUP_ID) {
  filterData.value.GROUP_ID = route.query.GROUP_ID;
}

if (route.query.user_id) {
  filterData.value.USER_ID = route.query.user_id;
}

if (route.query.status) {
  filterPipeline.value = route.query.status;
  filterData.value.Status_FollowUp = route.query.status;
}

if (route.query.status_approval) {
  filterStatusApproval.value = route.query.status_approval;
  filterData.value.Status_Approval = route.query.status_approval;
}

if (route.query.since) {
  filterData.value.since = route.query.since;
  filterData.value.until = route.query.until;
}
function applyFilter() {
  filterData.value.since;
  filterData.value.until;
  changePage(1);
}

watch(filterPipeline, (val) => {
  if (isInit.value) {
    isInit.value = false;
    return;
  }
  filterData.value.Status_FollowUp = val;
  changePage(1);
});

watch(filterStatusApproval, (val) => {
  if (isInit.value) {
    isInit.value = false;
    return;
  }
  filterData.value.Status_Approval = val;
  changePage(1);
});
let searchTimeout;

watch(q, (val) => {
  clearTimeout(searchTimeout);

  searchTimeout = setTimeout(() => {
    const keyword = val?.trim();
    search.value = keyword && keyword.length > 0 ? keyword : undefined;

    changePage(1);
  }, 1000);
});

watch(filterPipeline, (val) => {
  if (isInit.value) return;

  filterData.value.Status_FollowUp = val;
  changePage(1);
});

watch(filterStatusApproval, (val) => {
  if (isInit.value) return;

  filterData.value.Status_Approval = val;
  changePage(1);
});

const subDistrictData = ref([]);
const districtData = ref([]);

const subDistrictOptions = computed(() =>
  (subDistrictData.value || []).map((r) => ({
    label: r.kel_name,
    value: r.kel_id,
  })),
);

const districtOptions = computed(() =>
  (districtData.value || []).map((r) => ({
    label: r.kec_name,
    value: r.kec_id,
  })),
);

//fungsi ketika memilih lead di autocomplete
function onSelectLead(value) {
  const selected = top.value.find((item) => item.value === value);

  if (!selected || !selected.raw) return;

  const r = selected.raw;

  addData.value.LT_LEADS_ID = r.id;
  addData.value.LT_SHOP_NAME = r.nama_toko;
  addData.value.LT_OWNER_NAME = r.owner;
  addData.value.LT_WHATSAPP = r.nomor_wa;
  addData.value.LT_EMAIL = r.email;
  addData.value.LT_PROVINCE_ID = r.prov_id;
  addData.value.LT_CITY_ID = r.kota_id;
  addData.value.LT_DISTRICT_ID = r.kec_id;
  addData.value.LT_SUBDISTRICT_ID = r.kel_id;
  addData.value.LT_ADDRESS = r.alamat;
  addData.value.LT_MARKETPLACE = r.marketplace;
  addData.value.LT_MARKETPLACE_TYPE = r.tipe_marketplace;
  addData.value.LT_PRODUCT_CATEGORY = r.category_produk;
  addData.value.LT_LONGITUDE = r.longitude;
  addData.value.LT_LATITUDE = r.latitude;
  addData.value.LT_DATA_SOURCE = r.sumber_data;
  addData.value.LT_BUILDING_TYPE = r.tipe_bangunan;
  addData.value.LT_OTHER_BUSINESS = r.usaha_lain;
  subDistrictData.value = [
    {
      kel_id: r.kel_id,
      kel_name: r.lurah,
    },
  ];
  districtData.value = [
    {
      kec_id: r.kec_id,
      kec_name: r.kecamatan,
    },
  ];

  addData.value.LT_OTHER_BUSINESS_TYPE = r.jenis_usaha || '';

  addData.value.LT_OTHER_BUSINESS_NAME = r.nama_usaha || '';
}

watch(
  () => addData.value.LT_LEADS_ID,
  (v) => {
    if (!v) {
      Object.keys(addData.value).forEach((k) => {
        addData.value[k] = '';
      });
    }
  },
);
function resetToko() {
  Object.keys(addData.value).forEach((k) => {
    addData.value[k] = '';
  });
  addData.value.LT_LEADS_ID = null;
}
//get data
function doPaginate(index = 1, pSize) {
  getListData(API.getDataFollowUpTOP, index, pSize || pageSize.value, search.value, filterData.value);
}

function changePage(index = 1) {
  changeIndex(() => doPaginate(index), index);
}

//load
function firstload() {
  applyFilter();
}

//open add dialog
function onAddDialog() {
  addDialog.value = true;
}

//save data
const onSaveAdd = async () => {
  const resultVal = await isValElForm(addForm.value);
  if (!resultVal) return;

  

  // simpan follow up dulu
  await saveAdd((row) => {
    console.log(row);
    
    if (row.status_top === 'TOP-PROSES LANJUT') {
      onPengajuanId(row);
    }
  }, API.inputFollowUpTOP);

  // setelah berhasil save
};

// ini function handle handle form aja
const handleClose = async (done) => {
  try {
    await ElMessageBox.confirm('Anda yakin ingin menutup? Data belum disimpan akan hilang.', 'Konfirmasi', {
      confirmButtonText: 'Ya',
      cancelButtonText: 'Batal',
      type: 'warning',
    });

    // Kosongkan iframe terlebih dahulu agar benar-benar ter-destroy
    urlIframe.value = '';

    // Tutup dialog
    pengajuanId.value = false;

    // Tunggu sampai iframe benar-benar dihapus dari DOM
    await nextTick();

    // Selesaikan proses close
    done();
  } catch {
    // Jika klik Batal, dialog tetap terbuka
  }
};

const openMaps = (lat, lng) => {
  if (!lat || !lng) {
    console.error('Koordinat tidak valid');
    return;
  }

  const url = `https://www.google.com/maps?q=${lat},${lng}`;
  window.open(url, '_blank');
};

//reset filter
function resetFilter() {
  filterData.value.ROLE = role.value;
  filterData.value.GROUP_ID = groupValue.value;
  applyFilter();
}

firstload();
</script>

<style scoped>
.el-input .el-input__inner {
  border-radius: 14px;
  width: 12px;
}
.el-card {
  border-radius: 14px;
}
.el-dropdown-link {
  cursor: pointer;
}

.el-tag {
  padding: 1px 4px;
  font-size: 11px;
}

.none {
  display: none;
}

/* Menambahkan styling scrollbar tipis agar tetap rapi */
.scrollbar-thin::-webkit-scrollbar {
  width: 4px;
}
.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #e5e7eb;
  border-radius: 20px;
}
.iframe {
  width: 100%;
  height: 86vh;
  border: none;
  overflow: hidden;
}
</style>
