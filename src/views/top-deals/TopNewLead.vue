<template>
  <div class="bg-[#ffffff] flex flex-col items-center">
    <div class="w-full p-2">
      <!-- HEADER -->
      <title-dashboard @click="onAddDialog">
        <template #btn1>
          <div>
            <el-button type="primary" @click="onAddDialog">
              <el-icon><Plus /></el-icon>
              <span class="ml-1 hidden sm:inline">Add</span>
            </el-button>
          </div>
        </template>
      </title-dashboard>
      <el-form :model="filterData" :label-position="labelPosition()" label-width="150px">
        <div class="w-full grid grid-cols-1 md:grid-cols-2 my-2 rounded border p-2 bg-gray-100">
          <el-form-item label="Periode">
            <el-date-range-input v-model:startDate="filterData.since" v-model:endDate="filterData.until">
              <template #button>
                <div class="w-full flex md:justify-end justify-start items-center">
                  <el-button type="primary" size="small" class="w-full md:w-auto" @click="onFilterSearch"> Filter </el-button>
                </div>
              </template>
            </el-date-range-input>
          </el-form-item>

          <div class="relative w-full">
            <div class="absolute bottom-0 right-0 hidden md:block">
              <el-button type="primary" class="w-full md:w-auto" @click="onFilterSearch"> Filter </el-button>
            </div>
          </div>
        </div>
      </el-form>
      <div class="flex flex-col sm:flex-row sm:items-center gap-3 mb-5 w-full">
        <div class="grid grid-cols-2 gap-2">
          <el-input v-model="q" placeholder="Cari Toko" clearable class="flex-1 md:w-full rounded-2xl bg-white shadow-sm min-w-[150px]">
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
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
      </div>
      <div>
        <!-- MOBILE -->
        <div class="block md:hidden">
          <card-list v-if="listData && listData.length" :list="listData" is-rounded>
            <card-list-item prop="nama_toko" is-single-column>
              <template #default="{ row }">
                <div class="flex justify-between items-start mb-1">
                  <h3 class="font-medium text-sm text-gray-700 truncate">
                    {{ row.nama_toko }}
                  </h3>

                  <el-dropdown trigger="click">
                    <el-icon class="text-gray-400 cursor-pointer">
                      <More />
                    </el-icon>

                    <template #dropdown>
                      <el-dropdown-menu v-if="role === 'SLSM' || role === 'ADM'">
                        <el-dropdown-item @click="onViewDialog(row)"> Detail </el-dropdown-item>
                        <el-dropdown-item @click="onEditDialog(row)"> Edit </el-dropdown-item>
                        <el-dropdown-item divided>
                          <el-popconfirm @confirm="onDelete(row)" title="Apakah anda yakin?" confirm-button-text="Ya" cancel-button-text="Tidak">
                            <template #reference>
                              <span class="text-red-500">Hapus</span>
                            </template>
                          </el-popconfirm>
                        </el-dropdown-item>
                      </el-dropdown-menu>
                      <el-dropdown-menu v-else>
                        <el-dropdown-item @click="onViewDialog(row)"> Detail </el-dropdown-item>
                        <el-dropdown-item @click="onEditDialog(row)"> Edit </el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </div>

                <p class="text-xs text-gray-400 mb-1">{{ row.lurah }}</p>
                <!-- <p class="text-xs text-gray-500 mb-2 italic">{{ row.alamat }}</p> -->
                <hr />
              </template>
            </card-list-item>

            <card-list-item label="Nama Pemilik" prop="owner">
              <template #default="{ row }">
                <div class="text-gray-800">{{ row.owner }}</div>
              </template>
            </card-list-item>

            <card-list-item label="Nomor WA" prop="nomor_wa">
              <template #default="{ row }">
                <div class="text-blue-600">{{ row.nomor_wa }}</div>
              </template>
            </card-list-item>

            <card-list-item label="Marketplace" prop="marketplace">
              <template #default="{ row }">
                <div class="text-gray-800">{{ row.marketplace }} ({{ row.tipe_marketplace }})</div>
              </template>
            </card-list-item>

            <card-list-item label="Kategori" prop="category_produk">
              <template #default="{ row }">
                <div class="text-gray-800">{{ row.category_produk }}</div>
              </template>
            </card-list-item>

            <card-list-item is-single-column>
              <template #default="{ row }">
                <div class="flex gap-2">
                  <el-tag size="small">
                    {{ row.sales_name }}
                  </el-tag>
                  <el-tag size="small" type="info">
                    {{ row.tipe_bangunan }}
                  </el-tag>
                </div>
              </template>
            </card-list-item>
          </card-list>
          <div v-else class="text-center text-sm text-gray-400 py-10">Tidak ada data</div>
        </div>

        <!-- DESKTOP -->
        <div class="hidden md:block">
          <el-table v-loading="loading" :data="listData" stripe border header-cell-class-name="table-header">
            <el-table-column type="index" label="No" min-width="60" sortable/>
            <el-table-column prop="sales_name" label="Nama Sales" min-width="270" show-overflow-tooltip sortable/>
            <el-table-column prop="id" label="ID Toko" min-width="220" show-overflow-tooltip sortable/>
            <el-table-column prop="nama_toko" label="Nama Toko" min-width="220" show-overflow-tooltip sortable/>
            <el-table-column prop="owner" label="Nama Pemilik" min-width="220" show-overflow-tooltip sortable/>
            <el-table-column prop="nomor_wa" label="Nomor Wa" min-width="220" show-overflow-tooltip sortable/>
            <el-table-column label="Kota" min-width="450" show-overflow-tooltip sortable>
              <template #default="{ row }"> {{ row.lurah }} </template>
            </el-table-column>
            <el-table-column prop="alamat" label="Alamat Lengkap" min-width="450" show-overflow-tooltip sortable/>
            <el-table-column prop="email" label="Email" min-width="200" show-overflow-tooltip sortable/>
            <!-- <el-table-column label="Status" min-width="300">
              <template #default="{ row }">
                <el-tag :type="statusTagType(row.Status_FollowUp)" size="small">
                  {{ row.Status_FollowUp }}
                </el-tag>
              </template>
            </el-table-column> -->
            <el-table-column prop="marketplace" label="Marketplace" min-width="200" show-overflow-tooltip sortable/>
            <el-table-column prop="tipe_marketplace" label="Jenis Marketplace" min-width="200" show-overflow-tooltip sortable/>
            <el-table-column prop="category_produk" label="Kategori Produk" min-width="200" show-overflow-tooltip sortable/>
            <el-table-column prop="sumber_data" label="Sumber Data" min-width="200" show-overflow-tooltip sortable/>
            <el-table-column prop="tipe_bangunan" label="Tipe Bangunan" min-width="200" show-overflow-tooltip sortable/>

            <el-table-column prop="data_dibuat" label="Data Dibuat" min-width="200" show-overflow-tooltip sortable/>
            <el-table-column prop="last_update" label="Update terakhir" min-width="200" show-overflow-tooltip sortable/>

            <table-column-action
              v-if="role === 'SLSM' || role === 'ADM'"
              show-view
              show-edit
              show-delete
              @click-view="onViewDialog"
              @click-edit="onEditDialog"
              @click-delete="onDelete"
            />

            <table-column-action v-else show-view show-edit @click-view="onViewDialog" @click-edit="onEditDialog" />
          </el-table>
        </div>

        <!-- PAGINATION ARROWS -->
        <div class="flex items-center justify-center gap-4 mt-6">
          <PaginationView :total="rowTotal" :page-size="pageSize" :current-page="pageIndex" @current-change="changePage" />
        </div>
      </div>

      <!-- add dialog -->
      <el-dialog v-model="addDialog" title="New Lead TOP" :width="dialogWidth()" :before-close="handleClose" destroy-on-close>
        <el-form
          :model="addData"
          :rules="topRules"
          ref="addForm"
          label-width="170px"
          :label-position="labelPosition()"
          class="grid md:grid-cols-2 grid-cols-1 gap-4"
        >
          <!-- Nama Toko -->
          <el-form-item label="Nama Toko" prop="LT_SHOP_NAME">
            <el-input v-model="addData.LT_SHOP_NAME" placeholder="Nama Toko" />
          </el-form-item>

          <!-- Nama Pemilik -->
          <el-form-item label="Nama Pemilik" prop="LT_OWNER_NAME">
            <el-input v-model="addData.LT_OWNER_NAME" placeholder="Nama Pemilik" />
          </el-form-item>

          <!-- Nomor WhatsApp -->
          <el-form-item label="Nomor WhatsApp" prop="LT_WHATSAPP">
            <el-input v-model="addData.LT_WHATSAPP" placeholder="Nomor WhatsApp" />
          </el-form-item>

          <!-- Email -->
          <el-form-item label="Email" prop="LT_EMAIL">
            <el-input v-model="addData.LT_EMAIL" placeholder="Email" />
          </el-form-item>

          <!-- Provinsi -->
          <el-form-item label="Provinsi" prop="LT_PROVINCE_ID">
            <el-province-input v-model="addData.LT_PROVINCE_ID" />
          </el-form-item>

          <!-- Kota -->
          <el-form-item label="Kota / Kabupaten" prop="LT_CITY_ID">
            <el-city-input v-model="addData.LT_CITY_ID" :province-id="addData.LT_PROVINCE_ID" />
          </el-form-item>

          <!-- Kecamatan -->
          <el-form-item label="Kecamatan" prop="LT_DISTRICT_ID">
            <el-district-input v-model="addData.LT_DISTRICT_ID" :city-id="addData.LT_CITY_ID" />
          </el-form-item>

          <!-- Kelurahan -->
          <el-form-item label="Kelurahan" prop="LT_SUBDISTRICT_ID">
            <el-subdistrict-input v-model="addData.LT_SUBDISTRICT_ID" :district-id="addData.LT_DISTRICT_ID" />
          </el-form-item>

          <!-- Alamat -->
          <el-form-item label="Alamat Lengkap" prop="LT_ADDRESS" class="md:col-span-2">
            <el-input type="textarea" v-model="addData.LT_ADDRESS" placeholder="Alamat Toko" />
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

          <!-- Jenis Marketplace -->
          <el-form-item label="Jenis Toko Marketplace" prop="LT_MARKETPLACE_TYPE">
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

          <!-- Sumber Data -->
          <el-form-item label="Sumber Data" prop="LT_DATA_SOURCE">
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

          <!-- Usaha Lain -->
          <el-form-item label="Usaha Lain Dilokasi Sama" prop="LT_OTHER_BUSINESS">
            <el-select v-model="addData.LT_OTHER_BUSINESS" style="width: 100%">
              <el-option label="Ada" value="Ada" />
              <el-option label="Tidak Ada" value="Tidak Ada" />
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

          <!-- Upload Foto -->
          <el-form-item label="Foto Lokasi Tempat" prop="LT_SHOP_PHOTO">
            <upload-file-with-camera v-model="addData.LT_SHOP_PHOTO"></upload-file-with-camera>
          </el-form-item>
        </el-form>

        <template #footer>
          <footer-button-dialog @save-click="onSaveAdd" @cancel-click="handleClose" />
        </template>
      </el-dialog>

      <!-- edit dialog -->
      <el-dialog v-model="editDialog" title="Update Data Toko" :width="dialogWidth()" :before-close="handleClose" destroy-on-close>
        <el-form
          :model="editData"
          ref="editForm"
          :rules="rules"
          :label-position="labelPosition()"
          label-width="170px"
          class="grid md:grid-cols-2 grid-cols-1 gap-4"
        >
          <el-form-item label="Nama Toko" prop="LT_SHOP_NAME">
            <el-input v-model="editData.LT_SHOP_NAME" placeholder="Nama Toko" />
          </el-form-item>

          <el-form-item label="Nama Pemilik" prop="LT_OWNER_NAME">
            <el-input v-model="editData.LT_OWNER_NAME" placeholder="Nama Pemilik" />
          </el-form-item>

          <el-form-item label="Nomor WhatsApp" prop="LT_WHATSAPP">
            <el-input v-model="editData.LT_WHATSAPP" placeholder="Nomor WhatsApp" />
          </el-form-item>

          <el-form-item label="Email" prop="LT_EMAIL">
            <el-input v-model="editData.LT_EMAIL" placeholder="Email" />
          </el-form-item>

          <el-form-item label="Provinsi" prop="LT_PROVINCE_ID">
            <el-province-input v-model="editData.LT_PROVINCE_ID" />
          </el-form-item>

          <el-form-item label="Kota / Kabupaten" prop="LT_CITY_ID">
            <el-city-input v-model="editData.LT_CITY_ID" :province-id="editData.LT_PROVINCE_ID" />
          </el-form-item>

          <el-form-item label="Kecamatan" prop="LT_DISTRICT_ID">
            <el-district-input v-model="editData.LT_DISTRICT_ID" :city-id="editData.LT_CITY_ID" />
          </el-form-item>

          <el-form-item label="Kelurahan" prop="LT_SUBDISTRICT_ID">
            <el-subdistrict-input v-model="editData.LT_SUBDISTRICT_ID" :district-id="editData.LT_DISTRICT_ID" />
          </el-form-item>

          <el-form-item label="Alamat Lengkap" prop="LT_ADDRESS" class="md:col-span-2">
            <el-input type="textarea" v-model="editData.LT_ADDRESS" placeholder="Alamat Toko" />
          </el-form-item>

          <el-form-item label="Marketplace" prop="LT_MARKETPLACE">
            <el-select v-model="editData.LT_MARKETPLACE" placeholder="Pilih Marketplace">
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

          <el-form-item label="Jenis Toko Marketplace" prop="LT_MARKETPLACE_TYPE">
            <el-select v-model="editData.LT_MARKETPLACE_TYPE">
              <el-option label="Official Mall" value="Official Mall" />
              <el-option label="Shopee Mall" value="Shopee Mall" />
              <el-option label="Z Mall" value="Z Mall" />
              <el-option label="Power Shop" value="Power Shop" />
              <el-option label="Start Seller" value="Start Seller" />
              <el-option label="Seller Biasa" value="Seller Biasa" />
            </el-select>
          </el-form-item>

          <el-form-item label="Kategori Produk" prop="LT_PRODUCT_CATEGORY">
            <el-input v-model="editData.LT_PRODUCT_CATEGORY" placeholder="Kategori Produk" />
          </el-form-item>

          <el-form-item label="Longitude" prop="LT_LONGITUDE">
            <el-input v-model="editData.LT_LONGITUDE" placeholder="110.xxxxxx" />
          </el-form-item>

          <el-form-item label="Latitude" prop="LT_LATITUDE">
            <el-input v-model="editData.LT_LATITUDE" placeholder="-8.xxxxxx" />
          </el-form-item>

          <el-form-item label="Sumber Data" prop="LT_DATA_SOURCE">
            <el-select v-model="editData.LT_DATA_SOURCE">
              <el-option label="Online" value="Online" />
              <el-option label="Kanvasing" value="Kanvasing" />
            </el-select>
          </el-form-item>

          <el-form-item label="Jenis Bangunan Toko" prop="LT_BUILDING_TYPE">
            <el-select v-model="addData.LT_BUILDING_TYPE" placeholder="Jenis Bangunan">
              <el-option label="Gedung" value="Gedung" />
              <el-option label="Ruko" value="Ruko" />
              <el-option label="kios" value="Kios" />
              <el-option label="Rumah" value="Rumah" />
            </el-select>
          </el-form-item>

          <el-form-item label="Usaha Lain Dilokasi Sama" prop="LT_OTHER_BUSINESS">
            <el-select v-model="editData.LT_OTHER_BUSINESS">
              <el-option label="Ada" value="Ada" />
              <el-option label="Tidak Ada" value="Tidak Ada" />
            </el-select>
          </el-form-item>

          <el-form-item label="Jenis Usaha" prop="LT_OTHER_BUSINESS_TYPE">
            <el-input v-model="editData.LT_OTHER_BUSINESS_TYPE" placeholder="Jenis Usaha" />
          </el-form-item>

          <el-form-item label="Nama Brand Usaha" prop="LT_OTHER_BUSINESS_NAME">
            <el-input v-model="editData.LT_OTHER_BUSINESS_NAME" placeholder="Nama Brand Usaha" />
          </el-form-item>

          <el-form-item label="Foto Lokasi Toko" prop="LT_SHOP_PHOTO">
            <upload-file-with-camera v-model="editData.LT_SHOP_PHOTO"></upload-file-with-camera>
          </el-form-item>
        </el-form>

        <template #footer>
          <footer-button-dialog @save-click="onSaveEdit" @cancel-click="handleClose" />
        </template>
      </el-dialog>

      <!-- detail dialog -->
      <el-dialog
        v-model="viewDialog"
        title="Detail Data Toko"
        :width="dialogWidth()"
        class="deal-detail-dialog rounded-xl overflow-hidden"
        destroy-on-close
      >
        <div class="space-y-5 text-gray-700 antialiased py-2 px-1" :model="viewData">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-white border border-blue-100 shadow-sm relative overflow-hidden">
              <div class="absolute top-0 right-0 w-16 h-16 -mr-8 -mt-8 bg-blue-500/5 rounded-full"></div>

              <h4 class="text-blue-700 font-bold mb-4 uppercase text-[15px] tracking-[0.15em] flex items-center">
                <span class="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                Informasi Toko
              </h4>
              <div class="space-y-3">
                <div class="flex flex-col">
                  <span class="text-[13px] text-gray-400 font-semibold uppercase tracking-tight">Id Toko</span>
                  <span class="font-bold text-gray-900 text-base leading-tight">{{ viewData.id }}</span>
                </div>
                <div class="flex flex-col">
                  <span class="text-[13px] text-gray-400 font-semibold uppercase tracking-tight">Nama Toko</span>
                  <span class="font-bold text-gray-900 text-base leading-tight">{{ viewData.nama_toko }}</span>
                </div>
                <div class="flex flex-col">
                  <span class="text-[13px] text-gray-400 font-semibold uppercase tracking-tight">Kategori Produk</span>
                  <span class="text-sm font-medium text-gray-700">{{ viewData.category_produk }}</span>
                </div>
                <div class="flex flex-col">
                  <span class="text-[13px] text-gray-400 font-semibold uppercase tracking-tight">Tipe Bangunan</span>
                  <span class="text-sm font-medium text-gray-700">{{ viewData.tipe_bangunan }}</span>
                </div>
                <div class="pt-4 border-t border-blue-100/50 flex items-center justify-between gap-4">
                  <div class="flex-1">
                    <span class="text-[13px] text-blue-500/70 font-bold uppercase tracking-wider block mb-1">Sumber Data</span>
                    <div class="inline-flex items-center px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-extrabold uppercase">
                      {{ viewData.sumber_data }}
                    </div>
                  </div>

                  <div v-if="viewData.foto_toko" class="flex-shrink-0">
                    <span class="text-[13px] text-blue-500/70 font-bold uppercase tracking-wider block mb-1">Foto LOkasi Tempat</span>

                    <div>
                      <image-preview :imageUrl="viewData.foto_toko"></image-preview>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="p-4 rounded-xl bg-gradient-to-br from-yellow-50 to-white border border-yellow-200 shadow-sm relative overflow-hidden">
              <div class="absolute top-0 right-0 w-16 h-16 -mr-8 -mt-8 bg-yellow-500/5 rounded-full"></div>

              <h4 class="text-yellow-700 font-bold mb-4 uppercase text-[15px] tracking-[0.15em] flex items-center">
                <span class="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-2"></span>
                Owner & Kontak
              </h4>
              <div class="space-y-3">
                <div class="flex flex-col">
                  <span class="text-[13px] text-gray-400 font-semibold uppercase tracking-tight">Nama Pemilik</span>
                  <span class="font-bold text-gray-800 text-base leading-tight">{{ viewData.owner }}</span>
                </div>
                <div class="flex flex-col">
                  <span class="text-[13px] text-gray-400 font-semibold uppercase tracking-tight">Nomor WhatsApp</span>
                  <span class="font-bold text-blue-600 text-base leading-tight">{{ viewData.nomor_wa }}</span>
                </div>
                <div class="flex flex-col">
                  <span class="text-[13px] text-gray-400 font-semibold uppercase tracking-tight">Email</span>
                  <span class="text-sm font-medium text-gray-700">
                    {{ viewData.email && viewData.email !== 'null' ? viewData.email : '-' }}
                  </span>
                </div>
                <div class="mt-2 pt-2 border-t border-yellow-100/50">
                  <span class="text-[13px] text-gray-400 font-semibold uppercase tracking-tight">Update Terakhir</span>
                  <div class="text-xs font-medium text-gray-500 flex items-center mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {{ viewData.last_update }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div class="flex items-center justify-between mb-5 border-b border-gray-100 pb-3">
              <h4 class="text-gray-500 font-bold uppercase text-[10px] tracking-[0.2em]">Detail Lokasi & Marketplace</h4>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 text-sm">
              <div class="space-y-4">
                <div>
                  <span class="flex items-center text-[13px] text-gray-400 font-bold uppercase mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Alamat Lengkap
                  </span>
                  <p class="font-semibold text-gray-800 leading-relaxed pl-4">
                    {{ viewData.alamat }}<br />
                    <span class="text-blue-600 font-bold">{{ viewData.lurah }}</span>
                  </p>
                </div>

                <div>
                  <span class="flex items-center text-[13px] text-gray-400 font-bold uppercase mb-2 pl-4">Marketplace</span>
                  <div class="inline-flex items-center px-3 py-1 bg-green-50 text-green-700 rounded-lg border border-green-100 ml-4">
                    <span class="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    <span class="font-bold text-xs">{{ viewData.marketplace }}</span>
                    <span class="text-xs ml-3 text-gray-500 font-normal">Tipe: {{ viewData.tipe_marketplace }}</span>
                  </div>
                </div>
              </div>

              <div class="mt-6 bg-gray-50/50 p-4 rounded-xl border border-gray-100 shadow-sm">
                <h4 class="text-gray-500 font-bold uppercase text-[15px] tracking-[0.2em] mb-4 flex items-center">
                  <span class="w-1.5 h-1.5 bg-orange-400 rounded-full mr-2"></span>
                  Usaha Lain di Lokasi Sama
                </h4>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div class="flex flex-col">
                    <span class="text-[13px] text-gray-400 font-semibold uppercase tracking-tight">Status Usaha Lain</span>
                    <span :class="['text-sm font-bold mt-1', viewData.usaha_lain === 'Ada' ? 'text-orange-600' : 'text-gray-500']">
                      {{ viewData.usaha_lain || 'Tidak Ada' }}
                    </span>
                  </div>

                  <template v-if="viewData.usaha_lain === 'Ada'">
                    <div class="flex flex-col">
                      <span class="text-[13px] text-gray-400 font-semibold uppercase tracking-tight">Jenis Usaha</span>
                      <span class="text-sm font-medium text-gray-800 mt-1">{{ viewData.jenis_usaha || '-' }}</span>
                    </div>

                    <div class="flex flex-col">
                      <span class="text-[13px] text-gray-400 font-semibold uppercase tracking-tight">Nama Brand/Usaha</span>
                      <span class="text-sm font-bold text-gray-900 mt-1">{{ viewData.nama_usaha || '-' }}</span>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import { ElMessageBox } from 'element-plus';
import { ref, watch, computed } from 'vue';
import { Search, Filter, Plus, More } from '@element-plus/icons-vue';
import { dialogWidth, labelPosition } from '../../helper/appUtils';
// import API function sesuai kebutuhan untuk hit ke backend
import API from '../../api/apiDeals';
import { rulesTOPLead } from '../../helper/rules';
import { useStore } from 'vuex';
// import hooks buat insert, edit, pagination, dll
import HOOKS from '../../hooks/bundleOneOps';
import { useRoute, useRouter } from 'vue-router';

// definisikan hooks dari bundleOneOps, contohnya untuk kebutuhna insert data pakai ini
const { listData, rowTotal, pageIndex, pageSize, getListData, changeIndex, loading, filterData, search, headers } = HOOKS.useListDataPaginate();
const { addData, addForm, addDialog, saveAdd, cancelAdd } = HOOKS.useAddOneData();
const { viewData, viewDialog, openViewDialog } = HOOKS.useViewOneData();
const [JenisIndustri, GetJenisIndustri, loadingJenisIndutri] = HOOKS.useGetData();
GetJenisIndustri(() => API.apiGetJenisIndustri());

const [JenisPerusahaan, GetJenisPerusahaan, loadingJenisPerusahaan] = HOOKS.useGetData();
GetJenisPerusahaan(() => API.apiGetJenisIndustri());

const [EstimasiOmset, GetEstimasiOmset, loadingEstimasiOmset] = HOOKS.useGetData();
GetEstimasiOmset(() => API.apiGetEstimasiOmset());

const [SistemPembayaran, GetSistemPembayaran, loadingSistemPembayaran] = HOOKS.useGetData();
GetSistemPembayaran(() => API.apiGetMetodePembayaran());

const [JangkaPembayaran, GetJangkaPembayaran, loadingJangkaPembayaran] = HOOKS.useGetData();
GetJangkaPembayaran(() => API.apiGetJangkaWaktu());

const [SuratJalan, GetSuratJalan, loadingSuratJalan] = HOOKS.useGetData();
GetSuratJalan(() => API.apiGetSuratJalan());

const [category, GetCategory, loadingCategory] = HOOKS.useGetData();
GetCategory(() => API.apiGetCategory());

const { editForm, saveEdit2, editData, editDialog, openEdit, openEditDialog, saveEdit } = HOOKS.useEditOneData();
const { deleteData } = HOOKS.useDeleteOneData();
const store = useStore();
const accountId = computed(() => store.getters.accountId);
const role = computed(() => store.getters.userRole);
const groupValue = computed(() => store.getters.userGroup);
const topRules = computed(() => rulesTOPLead(addData.value));

const route = useRoute();
const router = useRouter();
const date = new Date();
const endDate = new Date(date);
const startDate = new Date(date);

filterData.value.until = endDate.toISOString().split('T')[0];
startDate.setDate(startDate.getDate() - 7);
filterData.value.since = startDate.toISOString().split('T')[0];

//grup dan peran
filterData.value.role = role.value || localStorage.getItem('role');
filterData.value.group_id = groupValue.value || localStorage.getItem('group');
filterData.value.user_id = accountId.value || localStorage.getItem('id');

function handleFilterSales(data) {
  filterData.value.role = data.USER_ROLE;
  filterData.value.group_id = data.USER_GROUP_CODE;
  filterData.value.user_id = data.USER_ID;
  applyFilter();
}

function applyFilter() {
  changePage(1);
}

function statusTagType(status) {
  if (!status) return 'info';

  switch (status) {
    case 'LEADS-PERKENALAN DAN ANALISA KEBUTUHAN':
      return 'info';

    case 'LEADS-PROPOSAL HARGA':
      return 'warning';

    case 'LEADS-NEGOSIASI':
      return 'primary';

    case 'LEADS-TEKNIS':
      return 'success';

    case 'LEADS-TTD KONTRAK':
      return 'danger';

    case 'NEW LEAD':
      return 'secondary';

    default:
      return 'info';
  }
}

// // console.log('group id', filterData.value.ROLE);
if (route.query.role) {
  filterData.value.role = route.query.ROLE;
}

if (route.query.group_id) {
  filterData.value.group_id = route.query.GROUP_ID;
}

if (route.query.user_id) {
  filterData.value.user_id = route.query.user_id;
}

if (route.query.since) {
  filterData.value.since = route.query.since;
  filterData.value.until = route.query.until;
}

function onViewDialog(row) {
  openViewDialog(row);
}

function onEditDialog(row) {
  const data = {
    id: row.id,
    LT_SHOP_NAME: row.nama_toko,
    LT_OWNER_NAME: row.owner,
    LT_WHATSAPP: row.nomor_wa,
    LT_EMAIL: row.email,
    LT_PROVINCE_ID: row.prov_id,
    LT_CITY_ID: row.kota_id,
    LT_DISTRICT_ID: row.kec_id,
    LT_SUBDISTRICT_ID: row.kel_id,
    LT_ADDRESS: row.alamat,

    LT_MARKETPLACE: row.marketplace,
    LT_MARKETPLACE_TYPE: row.tipe_marketplace,
    LT_PRODUCT_CATEGORY: row.category_produk,

    LT_LONGITUDE: row.longitude,
    LT_LATITUDE: row.latitude,

    LT_DATA_SOURCE: row.sumber_data,
    LT_BUILDING_TYPE: row.tipe_bangunan,

    LT_OTHER_BUSINESS: row.usaha_lain || 'Tidak Ada',
    LT_OTHER_BUSINESS_TYPE: row.jenis_usaha_lain,
    LT_OTHER_BUSINESS_NAME: row.nama_brand_lain,

    LT_SHOP_PHOTO: row.foto_toko,
  };

  openEditDialog(data);
}

function onSaveEdit() {
  saveEdit2(
    () => firstload(),
    (payload) => API.apiDealsLeadsUpdate(editData.value.id, payload),
  );
}

//delete
function onDelete(row) {
  deleteData(() => firstload(), API.apiLeadDelete, { ID_LEAD: String(row.id_Customer) });
}

function doPaginate(index = 1, pSize) {
  getListData(API.getDataTop, index, pSize || pageSize.value, search.value, filterData.value);
}

function changePage(index = 1) {
  changeIndex(() => doPaginate(index), index);
}

function onFilterSearch() {
  changeIndex(() => doPaginate(), pageIndex.value, null, filterData.value);
}

// buat function untuk open dialog
function onAddDialog() {
  addDialog.value = true;
}

// buat function untuk validasi input dan insert
function onSaveAdd() {
  saveAdd(() => firstload(), API.apiDealsTOP);
  // // console.log(addData.value);
}

// ini function handle handle form aja
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

//reset filter
function resetFilter() {
  filterData.value.user_id = null;
  filterData.value.role = role.value;
  filterData.value.group_id = groupValue.value;
  applyFilter();
}

const q = ref('');
const showFilter = ref(false);

let searchTimeout;

watch(q, (val) => {
  clearTimeout(searchTimeout);

  searchTimeout = setTimeout(() => {
    const keyword = val?.trim();
    search.value = keyword && keyword.length > 0 ? keyword : undefined;

    changePage(1);
  }, 600);
});

function firstload() {
  doPaginate(pageIndex.value);
}

firstload();
</script>

<style scoped>
.el-input .el-input__inner {
  border-radius: 14px;
  width: 12px;
}

.el-dropdown-link {
  cursor: pointer;
}
</style>
