<template>
  <div class="bg-[#ffffff] flex flex-col items-center">
    <div class="w-full p-2">
      <div class="flex items-center justify-between mb-3">
        <h1 class="text-lg font-semibold">Follow Up</h1>
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
        <el-input v-model="q" placeholder="Cari Customer" class="w-full sm:w-[200px]" clearable>
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-select v-model="filterPipeline" placeholder="Semua Status" clearable class="max-w-80 sm:w-56">
          <el-option label="Semua Status" value="" />
          <el-option v-for="(item, index) in SalesFolowUpStage.body" :key="index" :label="item.label" :value="item.value" />
          <!-- <el-option label="PERKENALAN DAN ANALISA KEBUTUHAN" value="LEADS-PERKENALAN DAN ANALISA KEBUTUHAN" />
          <el-option label="PROPOSAL HARGA" value="LEADS-PROPOSAL HARGA" />
          <el-option label="NEGOSIASI" value="LEADS-NEGOSIASI" />
          <el-option label="TEKNIS" value="LEADS-TEKNIS" />
          <el-option label="TTD KONTRAK" value="LEADS-TTD KONTRAK" /> -->
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
            <card-list-item prop="customerName" is-single-column>
              <template #default="{ row }">
                <div class="flex justify-between items-start mb-1">
                  <h3 class="font-medium text-sm text-gray-700 truncate">
                    {{ row.Nama_Customer }}
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

                <p class="text-xs text-gray-400 mb-2">{{ row.Kota }}, {{ row.Provinsi }}</p>
                <hr />
              </template>
            </card-list-item>

            <card-list-item label="Prediksi Omset" prop="size">
              <template #default="{ row }">
                <div class="font-semibold text-gray-900">
                  IDR {{ Number.isNaN(Number(row.Estimasi_Omset)) ? row.Estimasi_Omset : new Intl.NumberFormat('id-ID').format(row.Estimasi_Omset) }}
                </div></template
              >
            </card-list-item>

            <card-list-item label="Contact Person" prop="cp">
              <template #default="{ row }">
                <div class="text-gray-800">
                  {{ row.Kontak_Person }}
                </div>
              </template>
            </card-list-item>

            <card-list-item label="Jenis Industri" is-single-column>
              <template #default="{ row }">
                <div class="text-gray-800">
                  {{ row.Jenis_Industri }}
                </div>
              </template>
            </card-list-item>

            <card-list-item is-single-column>
              <template #default="{ row }">
                <el-tag :type="statusTagType(row.Status_FollowUp)" effect="light">
                  {{ row.Status_FollowUp }}
                </el-tag>
              </template>
            </card-list-item>
            <card-list-item>
              <template #default="{ row }">
                <el-tag>
                  {{ row.NAMA_SALES }}
                </el-tag>
              </template>
            </card-list-item>
          </card-list>
          <div v-else class="text-center text-sm text-gray-400 py-10">Tidak ada data</div>
        </div>

        <!-- DESKTOP -->
        <div class="hidden md:block">
          <div class="hidden md:block">
            <el-table v-loading="loading" :data="listData" stripe border header-cell-class-name="table-header" :default-sort="{ prop: 'Last_Update', order: 'descending' }">
              <el-table-column type="index" label="No" min-width="60" />
              <el-table-column prop="NAMA_SALES" label="Nama Sales" min-width="250" show-overflow-tooltip sortable/>
              <el-table-column prop="Nama_Customer" label="Nama Customer" min-width="220" show-overflow-tooltip sortable/>
              <el-table-column label="Kota" min-width="200" show-overflow-tooltip sortable>
                <template #default="{ row }"> {{ row.Kota }} </template>
              </el-table-column>
              <el-table-column prop="Estimasi_Omset" label="Prediksi Omset" min-width="160" show-overflow-tooltip sortable>
                <template #default="{ row }">
                  IDR {{ Number.isNaN(Number(row.Estimasi_Omset)) ? row.Estimasi_Omset : new Intl.NumberFormat('id-ID').format(row.Estimasi_Omset) }}
                </template>
              </el-table-column>
              <el-table-column prop="Kontak_Person" label="Contact Person" min-width="200" show-overflow-tooltip sortable/>
              <el-table-column prop="Jenis_Industri" label="Jenis Industri" min-width="200" show-overflow-tooltip sortable/>
              <el-table-column prop="Jenis_Kebutuhan" label="Jenis Kebutuhan" min-width="200" show-overflow-tooltip sortable/>
              <el-table-column label="Status" min-width="300" sortable>
                <template #default="{ row }">
                  <el-tag :type="statusTagType(row.Status_FollowUp)" size="small">
                    {{ row.Status_FollowUp }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="Last_Update" label="Update Terakhir" min-width="200" show-overflow-tooltip sortable/>
              <el-table-column prop="Create_at" label="Data Dibuat" min-width="200" show-overflow-tooltip sortable />

              <table-column-action show-view @click-view="onViewDialog" />
            </el-table>
          </div>
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
            ref="addForm"
            :label-position="labelPosition()"
            :rules="followUpRules"
            label-width="150px"
            class="grid md:grid-cols-2 grid-cols-1 gap-4"
          >
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

            <el-form-item class="none" label="Id Customer" prop="L_LEADS_ID">
              <el-input v-model="addData.L_LEADS_ID" disabled />
            </el-form-item>

            <el-form-item label="Jenis Perusahaan" prop="L_CUSTOMER_COMPANY_TYPE">
              <el-input v-model="addData.L_CUSTOMER_COMPANY_TYPE" disabled />
            </el-form-item>

            <el-form-item label="Alamat Lengkap" prop="L_CUSTOMER_ADDRESS">
              <el-input type="textarea" maxlength="30" v-model="addData.L_CUSTOMER_ADDRESS" show-word-limit :rows="2" disabled />
            </el-form-item>

            <el-form-item label="Provinsi" prop="L_PROVINCE_ID">
              <el-province-input v-model="addData.L_PROVINCE_ID" disabled></el-province-input>
            </el-form-item>

            <el-form-item label="Kabupaten / Kota" prop="L_CITY_ID">
              <el-city-input v-model="addData.L_CITY_ID" disabled></el-city-input>
            </el-form-item>

            <el-form-item label="Jenis Industri" prop="L_CUSTOMER_COMPANY_INDUSTRI_TYPE">
              <el-input v-model="addData.L_CUSTOMER_COMPANY_INDUSTRI_TYPE" disabled />
            </el-form-item>

            <el-form-item label="Contact Person" prop="L_CONTACT_PERSON">
              <el-input v-model="addData.L_CONTACT_PERSON" placeholder="Nama contact person" />
            </el-form-item>

            <el-form-item label="Jabatan" prop="L_CUSTOMER_COMPANY_POSITION">
              <el-input v-model="addData.L_CUSTOMER_COMPANY_POSITION" placeholder="Jabatan" />
            </el-form-item>

            <el-form-item label="HP / WA" prop="L_CUSTOMER_PHONE">
              <el-input v-model="addData.L_CUSTOMER_PHONE" placeholder="08xxxx" />
            </el-form-item>

            <el-form-item label="Email" prop="L_CUSTOMER_EMAIL">
              <el-input v-model="addData.L_CUSTOMER_EMAIL" placeholder="email" />
            </el-form-item>

            <el-form-item label="Jenis Kebutuhan" prop="L_TYPE_OF_NEED">
              <el-select v-model="addData.L_TYPE_OF_NEED" multiple placeholder="Select" style="width: 100%">
                <el-option v-for="item in ['Kirim Paket', 'Sewa Armada', 'Sewa Gudang']" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>

            <!-- hardcode -->
            <el-form-item label="Prediksi Omset" prop="L_OMZET_ESTIMATION">
              <el-currency-input v-model="addData.L_OMZET_ESTIMATION" placeholder="Prediksi Omset" style="width: 100%" min="0" />
            </el-form-item>

            <el-form-item label="Jenis Sewa Armada" prop="L_SEWA_ARMADA" class="md:col-span-2" v-if="addData.L_TYPE_OF_NEED?.includes('Sewa Armada')">
              <el-select v-model="addData.L_SEWA_ARMADA" multiple placeholder="Select" style="width: 100%">
                <el-option label="Lepas Kunci" value="Lepas_Kunci" />
                <el-option label="Per Trip (FTL)" value="FTL" />
                <el-option label="Unit+Driver" value="Unit_Driver" />
                <el-option label="Unit All In (Driver+Biaya Ops)" value="AllIn" />
              </el-select>
            </el-form-item>

            <el-form-item label="Jumlah Kiriman" prop="L_KIRIMAN_AMOUNT_COUNT">
              <el-input v-model="addData.L_KIRIMAN_AMOUNT_COUNT" placeholder="Estimasi Jumlah Kiriman" />
            </el-form-item>

            <el-form-item label="Tujuan Pengiriman" prop="L_DESTINATION">
              <el-input v-model="addData.L_DESTINATION" placeholder="Estimasi Tujuan Pengiriman" />
            </el-form-item>

            <el-form-item label="Jasa Pengiriman" prop="L_CURRENT_SHIPPING_VENDOR">
              <el-input v-model="addData.L_CURRENT_SHIPPING_VENDOR" placeholder="Jasa Pengiriman saat ini" />
            </el-form-item>
            <!-- hardcode -->
            <el-form-item label="Sistem Pembayaran" prop="L_PAYMENT_METHOD">
              <el-select v-model="addData.L_PAYMENT_METHOD" placeholder="Pilih Sistem Pembayaran" style="width: 100%">
                <el-option v-for="(metode, index) in MetodePembayaran.body" :key="index" :label="metode.label" :value="metode.value" />
                <!-- 
                  <el-option label="Deposit" value="Deposit" />
                  <el-option label="Invoice" value="Invoice" /> -->
              </el-select>
            </el-form-item>
            <!-- hardcode -->
            <el-form-item label="Jangka Waktu" prop="L_JANGKA_PEMBAYARAN">
              <el-select v-model="addData.L_JANGKA_PEMBAYARAN" placeholder="Jangka Waktu Pembayaran" style="width: 100%">
                <el-option v-for="(jangka, index) in JangkaWaktu.body" :key="index" :label="jangka.label" :value="jangka.value" />
                <!-- <el-option label="7" value="7" />
                  <el-option label="14" value="14" />
                  <el-option label="30" value="30" />
                  <el-option label="45" value="45" /> -->
              </el-select>
            </el-form-item>
            <!-- hardcode -->
            <el-form-item label="Surat Jalan" prop="L_ISHAVE_TRAVEL_DOCUMENT">
              <el-select v-model="addData.L_ISHAVE_TRAVEL_DOCUMENT" placeholder="Surat Jalan Kembali" style="width: 100%">
                <el-option v-for="(surat, index) in SuratJalan.body" :key="index" :label="surat.label" :value="surat.value" />
                <!-- <el-option label="Ya" value="Ya" />
                  <el-option label="Tidak" value="Tidak" /> -->
              </el-select>
            </el-form-item>
            <!-- hardcode -->
            <el-form-item label="Jenis Follow Up" prop="L_FOLLOW_TYPE">
              <el-select v-model="addData.L_FOLLOW_TYPE" placeholder="Pilih jenis follow up" class="w-full">
                <el-option v-for="(jenis, index) in JenisFollowUp.body" :key="index" :label="jenis.label" :value="jenis.value" />

                <!-- <el-option label="Meeting via Online/Offline" value="Meeting via Online/Offline" />
                  <el-option label="WA/Telepon" value="WA/Telepon" />
                  <el-option label="Email" value="Email" /> -->
              </el-select>
            </el-form-item>
            <!-- hardcode -->
            <el-form-item label="Status Follow Up" prop="L_FOLLOW_STATUS">
              <el-select v-model="addData.L_FOLLOW_STATUS" placeholder="Pilih status follow up" class="w-full">
                <el-option v-for="(status, index) in StatusFollowUp.body" :key="index" :label="status.label" :value="status.value" />
                <!-- <el-option label="Perkenalan dan Analisa Kebutuhan" value="LEADS-PERKENALAN DAN ANALISA KEBUTUHAN" />
                  <el-option label="Proposal Harga" value="LEADS-PROPOSAL HARGA" />
                  <el-option label="Negosiasi" value="LEADS-NEGOSIASI" />
                  <el-option label="Teknis" value="LEADS-TEKNIS" />
                  <el-option label="Kontrak" value="LEADS-TTD KONTRAK" /> -->
              </el-select>
            </el-form-item>
            <!-- <el-form-item v-if="addData.L_FOLLOW_STATUS === 'LEADS-PROPOSAL HARGA'" label="Harga" prop="L_HARGA">
                <el-input v-model="addData.L_HARGA" type="number" placeholder="Masukkan harga" class="w-full" />
              </el-form-item> -->

            <el-form-item label="Foto Selfie" prop="L_PHOTO_SELFIE">
              <upload-file-with-camera v-model="addData.L_PHOTO_SELFIE"></upload-file-with-camera>
            </el-form-item>

            <el-form-item label="Foto Bukti" prop="L_BUKTI_WA">
              <upload-file-with-camera v-model="addData.L_BUKTI_WA"></upload-file-with-camera>
            </el-form-item>

            <el-form-item label="Geotagging" prop="L_GPS_ADDRESS">
              <div class="flex flex-col gap-2 w-full">
                <el-button type="primary" :loading="loadingLocation" @click="handleCheckIn"> Check in </el-button>
                <div v-if="location" class="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                  <div><strong>Latitude:</strong> {{ location.latitude }}</div>
                  <div><strong>Longitude:</strong> {{ location.longitude }}</div>
                  <div v-if="location.address"><strong>Alamat:</strong> {{ location.address }}</div>
                </div>
              </div>
            </el-form-item>

            <el-form-item label="Hasil Follow Up" prop="L_HASIL_FOLLOW_UP">
              <el-input type="textarea" :rows="3" v-model="addData.L_HASIL_FOLLOW_UP" placeholder="Tambahkan catatan..." />
            </el-form-item>
          </el-form>

          <template #footer>
            <footer-button-dialog @save-click="onSaveAdd" @cancel-click="handleClose"></footer-button-dialog>
          </template>
        </el-dialog>
      </div>
      <!-- detail dialog -->
      <el-dialog v-model="viewDialog" title="Detail Deal" :width="dialogWidth()" class="deal-detail-dialog rounded-xl overflow-hidden">
        <div class="space-y-5 text-gray-700 antialiased py-2 px-1">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-white border border-blue-100 shadow-sm relative">
              <h4 class="text-blue-700 font-bold mb-3 uppercase text-[10px] tracking-[0.15em] flex items-center">
                <span class="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                Informasi Customer
              </h4>

              <div class="space-y-2">
                <p class="font-bold text-gray-900 text-base">
                  {{ viewData.Nama_Customer }}
                </p>

                <div class="flex flex-wrap gap-2">
                  <span class="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded uppercase">
                    {{ viewData.Tipe_Customer }}
                  </span>
                  <span class="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold rounded uppercase">
                    {{ viewData.Jenis_Industri }}
                  </span>
                </div>

                <div class="pt-2 border-t border-blue-100/50">
                  <span class="text-[11px] text-blue-500/70 font-bold uppercase">Prediksi Omset</span>
                  <div class="text-xl font-extrabold text-blue-600">
                    IDR
                    {{
                      Number.isNaN(Number(viewData.Estimasi_Omset))
                        ? viewData.Estimasi_Omset
                        : new Intl.NumberFormat('id-ID').format(viewData.Estimasi_Omset)
                    }}
                  </div>
                  <p class="text-[10px] text-gray-400 italic mt-1">Terakhir Update: {{ viewData.Last_Update }}</p>
                </div>
              </div>
            </div>

            <div class="p-4 rounded-xl bg-gradient-to-br from-yellow-50 to-white border border-yellow-200 shadow-sm">
              <h4 class="text-yellow-700 font-bold mb-3 uppercase text-[10px] tracking-[0.15em] flex items-center">
                <span class="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-2"></span>
                Contact Person
              </h4>

              <div class="space-y-2 text-sm">
                <div>
                  <span class="text-[11px] text-gray-400 font-semibold uppercase">Nama</span>
                  <p class="font-bold">{{ viewData.Kontak_Person }}</p>
                </div>
                <div>
                  <span class="text-[11px] text-gray-400 font-semibold uppercase">Jabatan</span>
                  <p>{{ viewData.Jabatan }}</p>
                </div>
                <div>
                  <span class="text-[11px] text-gray-400 font-semibold uppercase">HP / Email</span>
                  <p class="text-blue-600 font-medium">0{{ viewData.No_Handphone }} / {{ viewData.Email || '-' }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h4 class="text-gray-500 font-bold uppercase text-[10px] tracking-[0.2em] mb-4">Detail Bisnis & Kebutuhan</h4>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <span class="text-[11px] text-gray-400 font-bold uppercase mb-1 block"> Lokasi & Alamat </span>
                <p class="font-semibold text-gray-800 leading-relaxed">
                  {{ viewData.Alamat }}<br />
                  <span class="text-blue-600 font-bold"> {{ viewData.Kota }} </span>
                </p>
              </div>

              <div>
                <span class="text-[11px] text-gray-400 font-bold uppercase mb-1 block"> Pembayaran </span>
                <p class="font-semibold">{{ viewData.Metode_Pembayaran }}</p>
                <p class="text-xs text-blue-600">{{ viewData.Jangka_Pembayaran }} Hari</p>
              </div>

              <div>
                <div class="flex flex-col">
                  <span class="text-[11px] text-gray-400 font-semibold uppercase tracking-tight">Jenis Kebutuhan</span>
                  <span class="text-sm font-medium text-gray-700">{{ viewData.Jenis_Kebutuhan }}</span>
                </div>
              </div>

              <div class="space-y-1.5">
                <p class="text-xs font-medium flex justify-between">
                  <span class="text-gray-500 font-normal">Jumlah:</span>
                  <span class="text-gray-800 font-bold">{{
                    viewData.Jumlah_Kiriman && viewData.Jumlah_Kiriman !== 'null' ? viewData.Jumlah_Kiriman : '-'
                  }}</span>
                </p>
                <p class="text-xs font-medium flex justify-between">
                  <span class="text-gray-500 font-normal">Tujuan:</span>
                  <span class="text-gray-800 font-bold">{{ viewData.Tujuan && viewData.Tujuan !== 'null' ? viewData.Tujuan : '-' }}</span>
                </p>
                <p class="text-xs font-medium flex justify-between">
                  <span class="text-gray-500 font-normal">Jasa Pengiriman saat ini:</span>
                  <span class="text-gray-800 font-bold">{{
                    viewData.Jasa_Pengiriman && viewData.Jasa_Pengiriman !== 'null' ? viewData.Jasa_Pengiriman : '-'
                  }}</span>
                </p>
              </div>
            </div>
          </div>

          <div v-if="hasClosing()" class="p-4 bg-gray-50 font-sans text-gray-900">
            <div class="mb-5 flex justify-between items-end border-b border-gray-200 pb-3">
              <div>
                <h1 class="text-lg font-bold text-gray-800 leading-none">Detail Closing</h1>
                <!-- <p class="text-[11px] text-gray-500 mt-1">Ringkasan data pendaftaran customer baru</p> -->
              </div>
              <span class="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                {{ viewData.id_account && viewData.id_account !== 'null' ? viewData.id_account : '-' }}
              </span>
            </div>

            <div class="space-y-6">
              <section>
                <h2 class="text-[13px] font-black uppercase tracking-widest text-blue-600 mb-2 flex items-center gap-2">
                  <span class="w-1.5 h-1.5 rounded-full bg-blue-600"></span> Data Customer
                </h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  <div class="bg-white p-2.5 rounded-lg border border-gray-200 shadow-sm">
                    <p class="text-[12px] font-bold text-gray-400 uppercase leading-none mb-1.5">Nama Customer</p>
                    <p class="text-xs font-semibold truncate">
                      {{ viewData.Nama_Customer && viewData.Nama_Customer !== 'null' ? viewData.Nama_Customer : '-' }}
                    </p>
                  </div>
                  <div class="bg-white p-2.5 rounded-lg border border-gray-200 shadow-sm">
                    <p class="text-[11px] font-bold text-gray-400 uppercase leading-none mb-1.5">Jenis Kiriman</p>
                    <p class="text-xs font-semibold">
                      {{ viewData.Jenis_Kebutuhan && viewData.Jenis_Kebutuhan !== 'null' ? viewData.Jenis_Kebutuhan : '-' }}
                    </p>
                  </div>
                  <div class="bg-white p-2.5 rounded-lg border border-gray-200 shadow-sm">
                    <p class="text-[11px] font-bold text-gray-400 uppercase leading-none mb-1.5">Tujuan</p>
                    <p class="text-xs font-semibold">
                      {{ viewData.Tujuan && viewData.Tujuan !== 'null' ? viewData.Tujuan : '-' }}
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 class="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-2 flex items-center gap-2">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-600"></span> Invoice & Pembayaran
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div class="bg-white p-2.5 rounded-lg border border-gray-200 shadow-sm">
                    <p class="text-[11px] font-bold text-gray-400 uppercase leading-none mb-1.5">Tipe</p>
                    <p class="text-xs font-semibold">
                      {{ viewData.Metode_Pembayaran && viewData.Metode_Pembayaran !== 'null' ? viewData.Metode_Pembayaran : '-' }}
                    </p>
                  </div>
                  <div class="bg-white p-2.5 rounded-lg border border-gray-200 shadow-sm">
                    <p class="text-[11px] font-bold text-gray-400 uppercase leading-none mb-1.5">Lampiran TTK Balik</p>
                    <p class="text-xs font-semibold">{{ viewData.lampiran_ttk && viewData.lampiran_ttk !== 'null' ? viewData.lampiran_ttk : '-' }}</p>
                  </div>
                  <div class="bg-white p-2.5 rounded-lg border border-gray-200 shadow-sm">
                    <p class="text-[11px] font-bold text-gray-400 uppercase leading-none mb-1.5">Lampiran Suran Jalan/DO Balik</p>
                    <p class="text-xs font-semibold">
                      {{ viewData.lampiran_surat_jalan && viewData.lampiran_surat_jalan !== 'null' ? viewData.lampiran_surat_jalan : '-' }}
                    </p>
                  </div>
                  <div class="bg-white p-2.5 rounded-lg border border-gray-200 shadow-sm">
                    <p class="text-[11px] font-bold text-gray-400 uppercase leading-none mb-1.5">Periode Invoice</p>
                    <p class="text-xs font-semibold">
                      {{ viewData.pembuatan_invoice && viewData.pembuatan_invoice !== 'null' ? viewData.pembuatan_invoice : '-' }}
                    </p>
                  </div>
                  <div class="bg-white p-2.5 rounded-lg border border-gray-200 shadow-sm">
                    <p class="text-[11px] font-bold text-gray-400 uppercase leading-none mb-1.5">Email Profoma Invoice</p>
                    <p class="text-xs font-semibold">
                      {{ viewData.email_profoma && viewData.email_profoma !== 'null' ? viewData.email_profoma : '-' }}
                    </p>
                  </div>
                  <div class="bg-white p-2.5 rounded-lg border border-gray-200 shadow-sm">
                    <p class="text-[11px] font-bold text-gray-400 uppercase leading-none mb-1.5">Jangka Waktu Pembayaran</p>
                    <p class="text-xs font-semibold">
                      {{ viewData.Jangka_Pembayaran && viewData.Jangka_Pembayaran !== 'null' ? viewData.Jangka_Pembayaran : '-' }}
                      Hari
                    </p>
                  </div>

                  <div class="bg-emerald-50/20 p-2.5 rounded-lg border border-emerald-100 shadow-sm">
                    <p class="text-[11px] font-bold text-emerald-600 uppercase leading-none mb-1.5">Contact Pembayaran</p>
                    <div class="flex flex-wrap justify-between items-center gap-1">
                      <span class="text-xs font-bold">{{
                        viewData.contact_pembayaran && viewData.contact_pembayaran !== 'null' ? viewData.contact_pembayaran : '-'
                      }}</span>
                      <span class="text-[10px] text-emerald-700 font-medium">{{
                        viewData.handphone_pembayaran && viewData.handphone_pembayaran !== 'null' ? viewData.handphone_pembayaran : '-'
                      }}</span>
                    </div>
                  </div>

                  <div class="bg-white p-2.5 rounded-lg border border-gray-200 shadow-sm">
                    <p class="text-[11px] font-bold text-gray-400 uppercase leading-none mb-1.5">Alamat Penagihan</p>
                    <p class="text-[11px] text-gray-600">
                      {{ viewData.alamat_penagihan && viewData.alamat_penagihan !== 'null' ? viewData.alamat_penagihan : '-' }}
                    </p>
                  </div>

                  <div class="bg-white p-2.5 rounded-lg border border-gray-200 shadow-sm">
                    <p class="text-[11px] font-bold text-gray-400 uppercase leading-none mb-1.5">Email Pembayaran</p>
                    <p class="text-[11px] font-semibold text-blue-600 truncate">
                      {{ viewData.email_penagihan && viewData.email_penagihan !== 'null' ? viewData.email_penagihan : '-' }}
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 class="text-[10px] font-black uppercase tracking-widest text-orange-600 mb-2 flex items-center gap-2">
                  <span class="w-1.5 h-1.5 rounded-full bg-orange-600"></span> Harga Layanan
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div class="bg-orange-50 p-2.5 rounded-lg border border-orange-200 flex justify-between items-center md:col-span-1">
                    <span class="text-[11px] font-bold text-orange-800 uppercase">Disc</span>
                    <span class="text-sm font-black text-orange-600"
                      >{{ viewData.discount && viewData.discount !== 'null' ? viewData.discount : '0' }}%</span
                    >
                  </div>
                  <div class="bg-white p-2.5 rounded-lg border border-gray-200">
                    <p class="text-[11px] font-bold text-gray-400 uppercase mb-1">Harga Digunakan</p>
                    <p class="text-xs font-semibold">{{ viewData.type_harga && viewData.type_harga !== 'null' ? viewData.type_harga : '-' }}</p>
                  </div>
                  <div class="bg-white p-2.5 rounded-lg border border-gray-200">
                    <p class="text-[11px] font-bold text-gray-400 uppercase mb-1">Layanan</p>
                    <p class="text-xs font-semibold">{{ viewData.nedd_type && viewData.nedd_type !== 'null' ? viewData.nedd_type : '-' }}</p>
                  </div>
                  <div class="bg-white p-2.5 rounded-lg border border-gray-200">
                    <p class="text-[11px] font-bold text-gray-400 uppercase mb-1">Pengiriman Reporting</p>
                    <p class="text-xs font-semibold">
                      {{ viewData.jangka_report_kiriman && viewData.jangka_report_kiriman !== 'null' ? viewData.jangka_report_kiriman : '-' }}
                    </p>
                  </div>
                  <div class="bg-white p-2.5 rounded-lg border border-gray-200">
                    <p class="text-[11px] font-bold text-gray-400 uppercase mb-1">Perlu Reporting</p>
                    <p class="text-xs font-semibold">
                      {{ viewData.perlu_reporting && viewData.perlu_reporting !== 'null' ? viewData.perlu_reporting : '-' }}
                    </p>
                  </div>
                  <div class="bg-white p-2.5 rounded-lg border border-gray-200">
                    <p class="text-[11px] font-bold text-gray-400 uppercase mb-1">Email Reporting</p>
                    <p class="text-xs font-semibold truncate">
                      {{ viewData.email_report && viewData.email_report !== 'null' ? viewData.email_report : '-' }}
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 class="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-2 flex items-center gap-2">
                  <span class="w-1.5 h-1.5 rounded-full bg-indigo-600"></span> Pickup & Proses
                </h2>
                <div class="grid grid-cols-1 gap-2">
                  <div class="bg-white p-2.5 rounded-lg border border-gray-200 shadow-sm">
                    <p class="text-[10px] font-bold text-gray-400 uppercase mb-0.5">Jam & Tgl Mulai</p>
                    <p class="text-xs font-semibold text-gray-700">
                      {{ viewData.jam_pickup && viewData.jam_pickup !== 'null' ? viewData.jam_pickup : '-' }} /
                      {{ viewData.tangal_mulai && viewData.tangal_mulai !== 'null' ? viewData.tangal_mulai : '-' }}
                    </p>
                  </div>
                  <div class="bg-white p-2.5 rounded-lg border border-gray-200 shadow-sm">
                    <p class="text-[10px] font-bold text-gray-400 uppercase mb-0.5">Sistem Input TTK</p>
                    <p class="text-xs font-semibold text-gray-700">
                      {{ viewData.sistem_ttk && viewData.sistem_ttk !== 'null' ? viewData.sistem_ttk : '-' }}
                    </p>
                  </div>
                  <div class="bg-white p-2.5 rounded-lg border border-gray-200 shadow-sm">
                    <p class="text-[10px] font-bold text-gray-400 uppercase mb-0.5">Order Pickup</p>
                    <p class="text-xs font-semibold text-gray-700">
                      {{ viewData.order_pickup && viewData.order_pickup !== 'null' ? viewData.order_pickup : '-' }}
                    </p>
                  </div>
                  <div class="bg-white p-2.5 rounded-lg border border-gray-200 shadow-sm">
                    <p class="text-[10px] font-bold text-gray-400 uppercase mb-0.5">Packing Kayu</p>
                    <p class="text-xs font-semibold" :class="viewData.packing_kayu === 'Ya' ? 'text-orange-600' : 'text-gray-700'">
                      {{ viewData.packing_kayu && viewData.packing_kayu !== 'null' ? viewData.packing_kayu : '-' }}
                    </p>
                  </div>
                  <div class="bg-indigo-50/30 p-2.5 rounded-lg border border-indigo-100">
                    <div class="flex justify-between items-end mb-1">
                      <p class="text-[10px] font-bold text-indigo-600 uppercase">PIC Pickup</p>
                      <span class="text-[11px] text-indigo-700 font-bold">{{
                        viewData.handphone_pickup && viewData.handphone_pickup !== 'null' ? viewData.handphone_pickup : '-'
                      }}</span>
                    </div>
                    <p class="text-xs font-bold text-gray-800">
                      {{ viewData.contact_pickup && viewData.contact_pickup !== 'null' ? viewData.contact_pickup : '-' }}
                    </p>
                  </div>
                  <div class="bg-white p-2.5 rounded-lg border border-gray-200 shadow-sm">
                    <p class="text-[10px] font-bold text-gray-400 uppercase mb-1">Alamat Pickup</p>
                    <p class="text-xs font-medium text-gray-600 leading-relaxed italic">
                      {{ viewData.alamat_pickup && viewData.alamat_pickup !== 'null' ? viewData.alamat_pickup : '-' }}
                    </p>
                  </div>
                </div>
              </section>

              <div class="bg-gray-100 p-3 rounded-lg flex items-start gap-3 border border-gray-200">
                <div>
                  <p class="text-[11px] font-bold text-gray-500 uppercase leading-none mb-1">Catatan Tambahan</p>
                  <p class="text-[11px] text-gray-600 leading-tight italic">
                    {{ viewData.informasi_tambahan && viewData.informasi_tambahan !== 'null' ? viewData.informasi_tambahan : 'Tidak ada catatan.' }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="space-y-3">
            <h4 class="text-gray-500 font-bold uppercase text-[10px] tracking-[0.2em]">Follow Up</h4>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <div class="p-3 bg-blue-50/50 rounded-lg border border-blue-100 space-y-2 max-w-full">
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                    <div>
                      <p class="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Jenis Follow Up</p>
                      <p class="text-sm text-gray-800 leading-tight">{{ viewData.Jenis_FollowUp || '-' }}</p>
                    </div>
                    <div>
                      <p class="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Status Saat Ini</p>
                      <span class="text-sm text-blue-600 font-bold leading-tight">{{ viewData.Status_FollowUp || '-' }}</span>
                    </div>
                  </div>
                  <div class="border-t border-blue-100/50 pt-2">
                    <p class="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Hasil Follow Up</p>
                    <p class="text-sm italic text-gray-600 mt-0.5 leading-snug break-words">
                      "{{ viewData.Hasil_FollowUp && viewData.Hasil_FollowUp !== 'null' ? viewData.Hasil_FollowUp : '-' }}"
                    </p>
                  </div>
                </div>

                <div
                  v-if="hasClosing()"
                  class="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-white border border-gray-200 rounded-xl shadow-sm transition hover:shadow-md"
                >
                  <div class="col-span-1 sm:col-span-2 mb-1">
                    <h5 class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Closing</h5>
                  </div>

                  <el-button v-if="hasClosing()" @click="genFormCustomer" type="primary" size="small" class="!w-full !m-0">
                    <el-icon :size="14" class="mr-1.5"><Download /></el-icon>
                    Form Registrasi Pelanggan
                  </el-button>
                  <el-button v-if="hasClosing()" @click="genInfoCustomer" type="primary" size="small" class="!w-full !m-0">
                    <el-icon :size="14" class="mr-1.5"><Download /></el-icon>
                    Form Informasi Customer baru
                  </el-button>
                </div>

                <div
                  class="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-white border border-gray-200 rounded-xl shadow-sm transition hover:shadow-md"
                  v-if="hasKiriman()"
                >
                  <div class="col-span-1 sm:col-span-2 mb-1">
                    <h5 class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Kirim Paket</h5>
                  </div>
                  <el-button v-if="hasProposalHarga()" @click="genSuratKiriman" type="primary" size="small" class="!w-full !m-0">
                    <el-icon :size="14" class="mr-1.5"><Download /></el-icon>
                    Surat Penawaran Kiriman
                  </el-button>

                  <el-button
                    v-if="hasProposalHarga()"
                    tag="a"
                    size="small"
                    :href="baseUrl + viewData.Harga_Express"
                    download
                    type="primary"
                    class="!w-full !m-0 !inline-flex"
                  >
                    <el-icon :size="14" class="mr-1.5"><Download /></el-icon>
                    Daftar Harga Express
                  </el-button>

                  <el-button
                    v-if="hasProposalHarga()"
                    tag="a"
                    size="small"
                    :href="baseUrl + viewData.Harga_Cargo"
                    download
                    type="primary"
                    class="!w-full !m-0 !inline-flex"
                  >
                    <el-icon :size="14" class="mr-1.5"><Download /></el-icon>

                    Daftar Harga Cargo
                  </el-button>

                  <el-button
                    v-if="hasTeknis()"
                    tag="a"
                    size="small"
                    :href="baseUrl + viewData.file_pks"
                    download
                    type="primary"
                    class="!w-full !m-0 !inline-flex"
                  >
                    <el-icon :size="14" class="mr-1.5"><Download /></el-icon>
                    File PKS Kiriman
                  </el-button>
                </div>

                <div
                  v-if="hasSewaArmada()"
                  class="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-white border border-gray-200 rounded-xl shadow-sm transition hover:shadow-md"
                >
                  <div class="col-span-1 sm:col-span-2 mb-1">
                    <h5 class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sewa Armada</h5>
                  </div>
                  <el-button
                    v-if="hasProposalHarga() && hasLepasKunci()"
                    @click="genSuratSewaArmadaLk"
                    type="primary"
                    size="small"
                    class="!w-full !m-0"
                  >
                    <el-icon :size="14" class="mr-1.5"><Download /></el-icon>
                    Surat Penawaran Lepas Kunci
                  </el-button>
                  <el-button
                    v-if="hasTeknis() && hasLepasKunci()"
                    tag="a"
                    size="small"
                    :href="baseUrl + viewData.pks_lepas_kunci"
                    download
                    type="primary"
                    class="!w-full !m-0 !inline-flex"
                  >
                    <el-icon :size="14" class="mr-1.5"><Download /></el-icon>
                    File PKS Lepas Kunci
                  </el-button>
                  <el-button v-if="hasProposalHarga() && hasFTL()" @click="genSuratSewaArmadaFtl" type="primary" size="small" class="!w-full !m-0">
                    <el-icon :size="14" class="mr-1.5"><Download /></el-icon>
                    Surat Penawaran FTL
                  </el-button>
                  <el-button
                    v-if="hasTeknis() && hasFTL()"
                    tag="a"
                    size="small"
                    :href="baseUrl + viewData.pks_ftl"
                    download
                    type="primary"
                    class="!w-full !m-0 !inline-flex"
                  >
                    <el-icon :size="14" class="mr-1.5"><Download /></el-icon>
                    File PKS FTL
                  </el-button>
                  <el-button
                    v-if="hasProposalHarga() && hasUnitDriver()"
                    @click="genSuratSewaArmada"
                    type="primary"
                    size="small"
                    class="!w-full !m-0"
                  >
                    <el-icon :size="14" class="mr-1.5"><Download /></el-icon>
                    Surat Penawaran Unit + Driver
                  </el-button>
                  <el-button
                    v-if="hasTeknis() && hasUnitDriver()"
                    tag="a"
                    size="small"
                    :href="baseUrl + viewData.pks_Unit_Driver"
                    download
                    type="primary"
                    class="!w-full !m-0 !inline-flex"
                  >
                    <el-icon :size="14" class="mr-1.5"><Download /></el-icon>
                    File PKS Unit + Driver
                  </el-button>
                  <el-button v-if="hasProposalHarga() && hasAllIn()" @click="genSuratSewaArmada" type="primary" size="small" class="!w-full !m-0">
                    <el-icon :size="14" class="mr-1.5"><Download /></el-icon>
                    Surat Penawaran All In
                  </el-button>
                  <el-button
                    v-if="hasTeknis() && hasAllIn()"
                    tag="a"
                    size="small"
                    :href="baseUrl + viewData.pks_AllIn"
                    download
                    type="primary"
                    class="!w-full !m-0 !inline-flex"
                  >
                    <el-icon :size="14" class="mr-1.5"><Download /></el-icon>
                    File PKS All In
                  </el-button>
                </div>

                <div class="text-[10px] h-20 text-gray-500 bg-gray-100 p-2 rounded">
                  <p class="truncate"><b>Address:</b> {{ viewData.Check_Lokasi }}</p>
                </div>
              </div>

              <div class="space-y-3">
                <h4 class="text-gray-500 font-bold uppercase text-[10px] tracking-[0.25em]">History Follow Up</h4>

                <div v-if="viewData.History_FollowUp" class="relative pl-6 pr-2 border-l border-gray-200 h-auto">
                  <div v-for="(item, index) in JSON.parse(viewData.History_FollowUp)" :key="index" class="relative mb-4">
                    <!-- Titik Timeline -->
                    <span class="absolute -left-[11px] top-4 w-3 h-3 bg-blue-500 rounded-full ring-4 ring-white"></span>

                    <!-- Card -->
                    <div class="bg-white border border-gray-200 rounded-lg px-4 py-2 shadow-sm hover:shadow transition">
                      <!-- Status -->
                      <p class="text-sm font-semibold text-gray-800 leading-tight">
                        {{ item.status }}
                      </p>

                      <!-- Tanggal -->
                      <p class="text-[11px] text-gray-400">
                        {{ item.tanggal }}
                      </p>

                      <!-- Container Gambar -->
                      <div v-if="item.buktiwa || item.fotoselfie" class="mt-3 flex flex-wrap gap-4">
                        <!-- Bukti WA -->
                        <div v-if="item.buktiwa" class="flex flex-col">
                          <p class="text-xs font-medium text-gray-500 mb-1">Bukti WA</p>
                          <image-preview :imageUrl="item.buktiwa"></image-preview>
                        </div>

                        <!-- Foto Selfie -->
                        <div v-if="item.fotoselfie" class="flex flex-col">
                          <p class="text-xs font-medium text-gray-500 mb-1">Foto Selfie</p>
                          <image-preview :imageUrl="item.fotoselfie"></image-preview>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <p v-else class="text-xs text-gray-400 italic">Tidak ada history follow up</p>

                <div class="flex gap-2 pt-2">
                  <div class="flex-1 text-center relative group">
                    <span class="text-[10px] text-gray-400 font-bold uppercase">Selfie</span>
                    <div class="relative cursor-pointer" @click="viewData.Foto_Selfie && openPreview(baseUrl + viewData.Foto_Selfie)">
                      <img
                        :src="viewData.Foto_Selfie ? baseUrl + viewData.Foto_Selfie : ''"
                        class="w-full h-50 object-cover rounded-lg mt-1 transition group-hover:brightness-75"
                      />
                      <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <el-icon class="text-white text-xl">
                          <FullScreen />
                        </el-icon>
                      </div>
                    </div>
                  </div>

                  <div class="flex-1 text-center relative group">
                    <span class="text-[10px] text-gray-400 font-bold uppercase">Bukti</span>
                    <div class="relative cursor-pointer" @click="viewData.Bukti_Foto && openPreview(baseUrl + viewData.Bukti_Foto)">
                      <img
                        :src="viewData.Bukti_Foto ? baseUrl + viewData.Bukti_Foto : ''"
                        class="w-full h-50 object-cover rounded-lg mt-1 transition group-hover:brightness-75"
                      />
                      <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <el-icon class="text-white text-xl">
                          <FullScreen />
                        </el-icon>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <transition
                enter-active-class="transition duration-300 ease-out"
                enter-from-class="opacity-0 scale-95"
                enter-to-class="opacity-100 scale-100"
                leave-active-class="transition duration-200 ease-in"
                leave-from-class="opacity-100 scale-100"
                leave-to-class="opacity-0 scale-95"
              >
                <div
                  v-if="isPreviewOpen"
                  class="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                  @click="isPreviewOpen = false"
                >
                  <div class="absolute top-5 right-5 text-white cursor-pointer">
                    <el-icon class="text-3xl"><Close /></el-icon>
                  </div>

                  <img :src="selectedImg" class="max-w-full max-h-full rounded-lg shadow-2xl transition-transform duration-300" />
                </div>
              </transition>
            </div>
            <div class="bg-gray-50 p-3 rounded-lg border border-gray-100">
              <div class="border-t border-yellow-100/50">
                <span class="text-[11px] text-gray-400 font-semibold uppercase tracking-tight">Data Dibuat</span>
                <div class="text-xs font-medium text-gray-500 flex items-center mt-0.5">
                  {{ viewData.Create_at }}
                </div>
              </div>
            </div>
          </div>

          <div class="pt-3 border-t border-gray-100 flex justify-between text-[10px] text-gray-400">
            <span>ID Transaksi: {{ viewData.Id_Transaksi || '-' }}</span>
            {{ viewData.jenis_sewa_armada }}
          </div>
        </div>
      </el-dialog>
      <!-- closing dialog -->
      <el-dialog v-model="closingDialog" title="FORM INFORMASI CUSTOMER BARU" :width="dialogWidth()">
        <el-form
          :model="addData"
          ref="closingForm"
          :label-position="labelPosition()"
          label-width="220px"
          class="grid md:grid-cols-2 grid-cols-1 gap-4"
        >
          <!-- DATA CUSTOMER -->
          <el-divider>DATA CUSTOMER</el-divider><br />

          <el-form-item label="Nama Customer" :rules="[rule.requiredRule()]">
            <el-input v-model="addData.L_CUSTOMER_NAME" disabled />
          </el-form-item>

          <el-form-item label="ID Akun" :rules="[rule.requiredRule()]">
            <el-input v-model="addData.L_LEADS_ID" disabled />
          </el-form-item>

          <el-form-item label="Jenis Kiriman" :rules="[rule.requiredRule()]">
            <el-input v-model="addData.L_TYPE_OF_NEED" disabled />
          </el-form-item>

          <el-form-item label="Tujuan Pengiriman" :rules="[rule.requiredRule()]">
            <el-input v-model="addData.L_DESTINATION" disabled />
          </el-form-item>

          <!-- INVOICE -->
          <el-divider>INVOICE DAN PEMBAYARAN</el-divider>
          <br />

          <el-form-item label="Jenis Pembayaran" :rules="[rule.requiredRule()]">
            <el-input v-model="addData.L_PAYMENT_METHOD" disabled />
          </el-form-item>

          <el-form-item label="Lampiran TTK Balik" :rules="[rule.requiredRule()]">
            <el-select v-model="addData.C_ATTACHMENT_TTK" style="width: 100%">
              <el-option label="Ya" value="Ya" />
              <el-option label="Tidak" value="Tidak" />
            </el-select>
          </el-form-item>

          <el-form-item label="Lampiran DO Balik" prop="C_ATTACHMENT_TRAVEL_DOCUMENT" :rules="[rule.requiredRule()]">
            <el-select v-model="addData.C_ATTACHMENT_TRAVEL_DOCUMENT" style="width: 100%">
              <el-option label="Ya" value="Ya" />
              <el-option label="Tidak" value="Tidak" />
            </el-select>
          </el-form-item>

          <el-form-item label="Periode Invoice" prop="C_INVOICE" :rules="[rule.requiredRule()]">
            <el-select v-model="addData.C_INVOICE" style="width: 100%">
              <el-option label="Periodical" value="periodical" />
              <el-option label="Berdasarkan DO Balik" value="do_balik" />
            </el-select>
          </el-form-item>

          <el-form-item label="Email Proforma Invoice" prop="C_EMAIL_PROFOMA_INVOICE" :rules="[rule.requiredRule()]">
            <el-select v-model="addData.C_EMAIL_PROFOMA_INVOICE" style="width: 100%">
              <el-option label="Ya" value="Ya" />
              <el-option label="Tidak" value="Tidak" />
            </el-select>
          </el-form-item>

          <el-form-item label="Jangka Waktu Pembayaran" :rules="[rule.requiredRule()]">
            <el-input v-model="addData.L_JANGKA_PEMBAYARAN" disabled />
          </el-form-item>

          <el-form-item label="Alamat Penagihan" :rules="[rule.requiredRule()]">
            <el-input type="textarea" maxlength="150" show-word-limit v-model="addData.C_ALAMAT_PENAGIHAN" />
          </el-form-item>

          <el-form-item label="Contact Person" :rules="[rule.requiredRule()]">
            <el-input v-model="addData.C_PAYMENT_CONTACT" />
          </el-form-item>

          <el-form-item label="No HP" :rules="[rule.requiredRule()]">
            <el-input v-model="addData.C_PAYMENT_PHONE" />
          </el-form-item>

          <el-form-item label="Email" :rules="[rule.requiredRule()]">
            <el-input v-model="addData.C_PAYMENT_EMAIL" />
          </el-form-item>

          <!-- HARGA -->
          <!-- <br/> -->
          <el-divider>HARGA LAYANAN</el-divider><br />

          <el-form-item label="Harga Yang Digunakan" :rules="[rule.requiredRule()]">
            <el-select v-model="addData.C_PRICE_TYPE" style="width: 100%">
              <el-option label="Publish" value="publish" />
              <el-option label="Khusus" value="khusus" />
            </el-select>
          </el-form-item>

          <el-form-item label="Discount (%)" :rules="[rule.requiredRule()]">
            <el-input-number v-model="addData.C_DISCOUNT" :min="0" style="width: 100%" />
          </el-form-item>

          <el-form-item label="Layanan" :rules="[rule.requiredRule()]">
            <el-select v-model="addData.C_NEED_TYPE" multiple placeholder="Select" style="width: 100%">
              <el-option v-for="item in ['Express', 'Cargo']" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>

          <el-form-item label="Perlu Reporting" :rules="[rule.requiredRule()]">
            <el-select v-model="addData.C_REPORT_KIRIMAN" style="width: 100%">
              <el-option label="Ya" value="Ya" />
              <el-option label="Tidak" value="Tidak" />
            </el-select>
          </el-form-item>

          <el-form-item label="Periode Reporting" :rules="[rule.requiredRule()]">
            <el-select v-model="addData.C_JANGKA_REPORT_KIRIMAN" style="width: 100%">
              <el-option label="Perhari" value="harian" />
              <el-option label="Perminggu" value="mingguan" />
              <el-option label="Perbulan" value="bulanan" />
            </el-select>
          </el-form-item>

          <el-form-item label="Email Reporting" :rules="[rule.requiredRule()]">
            <el-input v-model="addData.C_EMAIL_REPORT_KIRIMAN" />
          </el-form-item>

          <!-- PICKUP -->
          <!-- <br/> -->
          <el-divider>PICKUP DAN PROSES</el-divider><br />

          <el-form-item label="Input TTK" :rules="[rule.requiredRule()]">
            <el-select v-model="addData.C_SISTEM_INPUT_TTK" style="width: 100%">
              <el-option label="Mandiri" value="mandiri" />
              <el-option label="Wahana" value="wahana" />
            </el-select>
          </el-form-item>

          <el-form-item label="Packing Kayu" :rules="[rule.requiredRule()]">
            <el-select v-model="addData.C_PACKING_KAYU" style="width: 100%">
              <el-option label="Permintaan Customer" value="customer" />
              <el-option label="Langsung Wahana" value="wahana" />
            </el-select>
          </el-form-item>

          <el-form-item label="Order Pickup" :rules="[rule.requiredRule()]">
            <el-select v-model="addData.C_ORDER_PICKUP" style="width: 100%">
              <el-option label="Rutin" value="rutin" />
              <el-option label="By Call" value="by_call" />
            </el-select>
          </el-form-item>

          <el-form-item label="Tanggal Mulai Pengiriman" :rules="[rule.requiredRule()]">
            <el-date-picker v-model="addData.C_PICKUP_DATE" type="date" placeholder="Pilih tanggal" style="width: 100%" />
          </el-form-item>

          <el-form-item label="Alamat Pickup" :rules="[rule.requiredRule()]">
            <el-input type="textarea" maxlength="150" show-word-limit v-model="addData.C_PICKUP_ADDRESS" />
          </el-form-item>

          <el-form-item label="Jam Pickup" :rules="[rule.requiredRule()]">
            <el-input v-model="addData.C_PICKUP_TIME" />
          </el-form-item>

          <el-form-item label="Contact Person Pickup" :rules="[rule.requiredRule()]">
            <el-input v-model="addData.C_PICKUP_CONTACT" />
          </el-form-item>

          <el-form-item label="No HP Pickup" :rules="[rule.requiredRule()]">
            <el-input v-model="addData.C_PICKUP_PHONE" />
          </el-form-item>

          <el-form-item label="Informasi Tambahan" :rules="[rule.requiredRule()]">
            <el-input type="textarea" maxlength="150" show-word-limit v-model="addData.C_ADDITIONAL_INFORMATION" />
          </el-form-item>
        </el-form>

        <template #footer>
          <el-button @click="dialogVisible = false">Cancel</el-button>
          <footer-button-dialog @save-click="onSaveClosing" @cancel-click="handleClose"></footer-button-dialog>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue';
import { Search, FullScreen, CirclePlusFilled, More, Download } from '@element-plus/icons-vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { dialogWidth, labelPosition } from '../../helper/appUtils';
import {
  getAddress,
  generateSuratPengiriman,
  generateFormCustomer,
  generateInfoCustomer,
  generateSuratSewaArmadaLk,
  generateSuratSewaArmadaFtl,
  isValElForm,
} from '../../helper/utils';
import { rulesFollowUpCorporate } from '../../helper/rules';
import * as rule from '../../helper/rules';
import { queryFollowUp, leads, leadsLoading, sales } from '../../helper/autoCompleteQuery';
// import API function sesuai kebutuhan untuk hit ke backend
import API from '../../api/apiDeals';
import { useStore } from 'vuex';
// import hooks buat insert, edit, pagination, dll
import HOOKS from '../../hooks/bundleOneOps';
import { useRoute, useRouter } from 'vue-router';

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

const store = useStore();
const route = useRoute();
const accountId = computed(() => store.getters.accountId);
const role = computed(() => store.getters.userRole) || localStorage.getItem('role');
const groupValue = computed(() => store.getters.userGroup) || localStorage.getItem('group');
const followUpRules = computed(() => rulesFollowUpCorporate(addData.value));
filterData.value.USER_ID = accountId.value || localStorage.getItem('id');
filterData.value.ROLE = role.value || localStorage.getItem('role');
filterData.value.GROUP_ID = groupValue.value || localStorage.getItem('group');

//filter sales
function handleFilterSales(data) {
  filterData.value.USER_ID = data.USER_ID;
  filterData.value.ROLE = data.USER_ROLE;
  filterData.value.GROUP_ID = data.USER_GROUP_CODE;
  applyFilter();
}

const q = ref('');
const filterPipeline = ref(null);
const loadingLocation = ref(false);
const location = ref(null);
const isInit = ref(true);
const isPreviewOpen = ref(false);
const selectedImg = ref('');
const closingForm = ref(null);

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
    case 'LEADS-LOST':
      return 'danger';

    default:
      return 'info';
  }
}

const openPreview = (url) => {
  if (!url) return;
  selectedImg.value = url;
  isPreviewOpen.value = true;
};

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

//fungsi ketika memilih lead di autocomplete
function onSelectLead(value) {
  const selected = leads.value.find((item) => item.value === value);

  if (!selected || !selected.raw) return;

  const r = selected.raw;
  addData.value.L_LEADS_ID = r.LEADS_ID;
  addData.value.L_CUSTOMER_NAME = r.LEADS_CUSTOMER_NAME;
  addData.value.L_CUSTOMER_COMPANY_TYPE = r.Tipe_Customer;
  addData.value.L_CUSTOMER_ADDRESS = r.Alamat;
  addData.value.L_PROVINCE_ID = r.Provinsi_id;
  addData.value.L_CITY_ID = r.Kota_id;
  addData.value.L_CUSTOMER_COMPANY_INDUSTRI_TYPE = r.Jenis_Industri;

  addData.value.L_CONTACT_PERSON = r.Kontak_Person;
  addData.value.L_CUSTOMER_COMPANY_POSITION = r.Jabatan;
  addData.value.L_CUSTOMER_PHONE = r.No_Handphone;
  addData.value.L_CUSTOMER_EMAIL = r.Email;
  addData.value.L_OMZET_ESTIMATION = r.Estimasi_Omset;
  addData.value.L_DESTINATION = r.Tujuan;
  addData.value.L_CURRENT_SHIPPING_VENDOR = r.Jasa_Pengiriman;
  addData.value.L_JANGKA_PEMBAYARAN = r.Jangka_Pembayaran;
  addData.value.L_PAYMENT_METHOD = r.Metode_Pembayaran;
  addData.value.L_ISHAVE_TRAVEL_DOCUMENT = r.Travel_Document;
  addData.value.L_TYPE_OF_NEED = r.Jenis_Kebutuhan ? r.Jenis_Kebutuhan.split(',').map((v) => v.trim()) : [];

  addData.value.L_KIRIMAN_AMOUNT_COUNT = r.Jumlah_Kiriman || '';

  addData.value.L_FOLLOW_STATUS = r.Status_FollowUp || '';
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
//get data
function doPaginate(index = 1, pSize) {
  getListData(API.getDataFollowUp, index, pSize || pageSize.value, search.value, filterData.value);
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
  if (addData.value.L_FOLLOW_STATUS === 'LEADS-TTD KONTRAK') {
    const resultVal = await isValElForm(addForm.value);
    if (!resultVal) return;
    closingDialog.value = true;
    return;
  }
  await saveAdd(() => firstload(), API.apiDealsfollowUpInsert);
};
//insert closing
const onSaveClosing = async () => {
  try {
    const resultVal = await isValElForm(closingForm.value);
    if (!resultVal) return;
    // saveAdd(() => saveAdd(() => firstload(), API.apiDealsfollowUpInsert), API.apiDealsClosingInsert);
    saveAdd(() => firstload(), API.apiDealsClosingInsert);
    closingDialog.value = false;
  } catch (error) {
    ElMessage.error('Closing gagal disimpan');
    return;
  }
};

function onClosingDialog() {
  closingDialog.value = true;
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

//untuk chek in lokasi
const handleCheckIn = async () => {
  if (!navigator.geolocation) {
    ElMessage.error('Geolocation tidak didukung browser');
    return;
  }

  loadingLocation.value = true;

  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const latitude = pos.coords.latitude;
      const longitude = pos.coords.longitude;

      const result = await getAddress({ latitude, longitude });

      location.value = {
        latitude,
        longitude,
        address: result?.[0]?.display_name || '-',
      };

      addData.value.L_GPS_LATITUDE = latitude;
      addData.value.L_GPS_LONGITUDE = longitude;
      addData.value.L_GPS_ADDRESS = location.value.address;

      // // console.log(addData.L_GPS_ADDRESS + 'TESTINGG GPS');

      loadingLocation.value = false;
    },
    (err) => {
      ElMessage.error('Gagal mengambil lokasi');
      loadingLocation.value = false;
    },
    {
      enableHighAccuracy: true,
      timeout: 100000,
    },
  );
};

//reset filter
function resetFilter() {
  filterData.value.USER_ID = accountId.value || localStorage.getItem('id');
  filterData.value.ROLE = role.value;
  filterData.value.GROUP_ID = groupValue.value;
  applyFilter();
}

//pengecekan status follow up
const hasProposalHarga = () => {
  if (!viewData.value?.History_FollowUp) return false;

  return viewData.value.History_FollowUp.includes('LEADS-PROPOSAL HARGA');
};
const hasClosing = () => {
  if (!viewData.value?.History_FollowUp) return false;

  return viewData.value.History_FollowUp.includes('LEADS-TTD KONTRAK');
};
const hasTeknis = () => {
  if (!viewData.value?.History_FollowUp) return false;

  return viewData.value.History_FollowUp.includes('LEADS-TEKNIS');
};

const hasKiriman = () => {
  if (!viewData.value?.Jenis_Kebutuhan) return false;

  return viewData.value.Jenis_Kebutuhan.includes('Kirim Paket');
};

const hasSewaArmada = () => {
  if (!viewData.value?.Jenis_Kebutuhan) return false;

  return viewData.value.Jenis_Kebutuhan.includes('Sewa Armada');
};

const hasLepasKunci = () => {
  if (!viewData.value?.jenis_sewa_armada) return false;

  return viewData.value.jenis_sewa_armada.includes('Lepas_Kunci');
};
const hasFTL = () => {
  if (!viewData.value?.jenis_sewa_armada) return false;

  return viewData.value.jenis_sewa_armada.includes('FTL');
};
const hasUnitDriver = () => {
  if (!viewData.value?.jenis_sewa_armada) return false;

  return viewData.value.jenis_sewa_armada.includes('Unit_Driver');
};
const hasAllIn = () => {
  if (!viewData.value?.jenis_sewa_armada) return false;

  return viewData.value.jenis_sewa_armada.includes('AllIn');
};

//unutk generate surat pengiriman
const genSuratKiriman = () => {
  generateSuratPengiriman(viewData.value);
};

//untuk form data customer closing
const genFormCustomer = () => {
  generateFormCustomer(viewData.value);
};

const genInfoCustomer = () => {
  generateInfoCustomer(viewData.value);
};
const genSuratSewaArmadaLk = () => {
  generateSuratSewaArmadaLk(viewData.value);
};
const genSuratSewaArmadaFtl = () => {
    generateSuratSewaArmadaFtl(viewData.value);
};

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
</style>
