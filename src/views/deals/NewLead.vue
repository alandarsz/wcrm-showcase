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
        <div class="grid grid-cols-3 gap-2">
          <el-input v-model="q" placeholder="Cari Customer" clearable class="flex-1 md:w-full rounded-2xl bg-white shadow-sm min-w-[150px]">
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          <el-select v-model="filterPipeline" placeholder="Semua Status" clearable class="max-w-80 sm:w-56">
            <el-option label="Semua Status" value="" />
            <el-option label="New Lead" value="NEW LEAD" />
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
      </div>
      <div>
        <!-- MOBILE -->
        <div class="block md:hidden">
          <card-list v-if="listData && listData.length" :list="listData" is-rounded>
            <card-list-item prop="name" is-single-column>
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
                      <el-dropdown-menu v-if="role == 'SLSM' || role === 'ADM'">
                        <el-dropdown-item @click="row.Status_FollowUp === 'NEW LEAD' ? onViewDialog(row) : onFollowUpDialog(row)">
                          Detail
                        </el-dropdown-item>
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
                        <el-dropdown-item @click="row.Status_FollowUp === 'NEW LEAD' ? onViewDialog(row) : onFollowUpDialog(row)">
                          Detail
                        </el-dropdown-item>
                        <el-dropdown-item @click="onEditDialog(row)"> Edit </el-dropdown-item>
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
            <card-list-item label="Contact Person" prop="Contact Person">
              <template #default="{ row }">
                <div>
                  <div class="text-gray-800">
                    {{ row.Kontak_Person }}
                  </div>
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
                <el-tag :type="statusTagType(row.Status_FollowUp)">
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
          <el-table v-loading="loading" :data="listData" stripe border header-cell-class-name="table-header">
            <el-table-column type="index" label="No" min-width="60" />
            <el-table-column prop="NAMA_SALES" label="Nama Sales" min-width="270" show-overflow-tooltip sortable/>
            <el-table-column prop="Nama_Customer" label="Nama Customer" min-width="220" show-overflow-tooltip sortable/>
            <el-table-column label="Kota" min-width="200" show-overflow-tooltip sortable>
              <template #default="{ row }"> {{ row.Kota }} </template>
            </el-table-column>
            <el-table-column prop="Estimasi_Omset" label="Prediksi Omset" min-width="160" show-overflow-tooltip sortable>
              <template #default="{ row }">
                IDR {{ Number.isNaN(Number(row.Estimasi_Omset)) ? row.Estimasi_Omset : new Intl.NumberFormat('id-ID').format(row.Estimasi_Omset) }}
              </template>
            </el-table-column>

            <el-table-column prop="Kontak_Person" label="Contact Person" min-width="200" show-overflow-tooltip sortable />
            <el-table-column prop="Jenis_Industri" label="Jenis Industri" min-width="200" show-overflow-tooltip sortable />
            <el-table-column label="Status" min-width="300" sortable>
              <template #default="{ row }">
                <el-tag :type="statusTagType(row.Status_FollowUp)" size="small">
                  {{ row.Status_FollowUp }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="Data_Dibuat" label="Data Dibuat" min-width="200" show-overflow-tooltip sortable />
            <el-table-column prop="Last_Update" label="Update terakhir" min-width="200" show-overflow-tooltip sortable />

            <!-- Untuk role SLSM / ADM -->
            <table-column-action
              v-if="role === 'SLSM' || role === 'ADM'"
              show-view
              show-edit
              show-delete
              @click-view="(row) => (row.Status_FollowUp === 'NEW LEAD' ? onViewDialog(row) : onFollowUpDialog(row))"
              @click-edit="onEditDialog"
              @click-delete="onDelete"
            />

            <!-- Untuk role selain SLSM / ADM -->
            <table-column-action
              v-else
              show-view
              show-edit
              @click-view="(row) => (row.Status_FollowUp === 'NEW LEAD' ? onViewDialog(row) : onFollowUpDialog(row))"
              @click-edit="onEditDialog"
            />
          </el-table>
        </div>

        <!-- PAGINATION ARROWS -->
        <div class="flex items-center justify-center gap-4 mt-6">
          <PaginationView :total="rowTotal" :page-size="pageSize" :current-page="pageIndex" @current-change="changePage" />
        </div>
      </div>

      <!-- add dialog -->
      <el-dialog v-model="addDialog" title="New Lead" :width="dialogWidth()" :before-close="handleClose" destroy-on-close>
        <el-form
          :model="addData"
          :rules="rules"
          ref="addForm"
          :label-position="labelPosition()"
          label-width="150px"
          class="grid md:grid-cols-2 grid-cols-1 gap-4"
        >
          <el-form-item label="Nama Customer" prop="L_CUSTOMER_NAME">
            <el-input v-model="addData.L_CUSTOMER_NAME" placeholder="Nama Customer" />
          </el-form-item>
          <!-- hardcode -->
          <el-form-item label="Jenis Perusahaan" prop="L_CUSTOMER_COMPANY_TYPE">
            <el-select v-model="addData.L_CUSTOMER_COMPANY_TYPE" placeholder="Pilih Jenis Perusahaan" style="width: 100%">
              <!-- <el-option v-for="(jenis, index) in JenisPerusahaan.body" :key="index" :label="jenis.label" :value="jenis.value" /> -->
              <el-option label="PT" value="PT" />
              <el-option label="CV" value="CV" />
              <el-option label="Seller" value="Seller" />
            </el-select>
          </el-form-item>
          <el-form-item label="Alamat Lengkap" prop="L_CUSTOMER_ADDRESS">
            <el-input type="textarea" maxlength="150" v-model="addData.L_CUSTOMER_ADDRESS" show-word-limit :rows="2" />
          </el-form-item>
          <el-form-item label="Provinsi" prop="L_PROVINCE_ID">
            <el-province-input v-model="addData.L_PROVINCE_ID"></el-province-input>
          </el-form-item>
          <el-form-item label="Kabupaten/Kota" prop="L_CITY_ID">
            <el-city-input v-model="addData.L_CITY_ID" placeholder="Kota" :province-id="addData.L_PROVINCE_ID"></el-city-input>
          </el-form-item>
          <el-form-item label="Jenis Industri" prop="L_CUSTOMER_COMPANY_INDUSTRI_TYPE">
            <!-- <pre>{{JenisIndustri.body}}</pre>  -->
            <el-select v-model="addData.L_CUSTOMER_COMPANY_INDUSTRI_TYPE" placeholder="Pilih Jenis Industri" style="width: 100%">
              <el-option v-for="(jenis, index) in JenisIndustri.body" :key="index" :label="jenis.label" :value="jenis.value" />
              <!-- <el-option label="Alat Berat" value="Alat Berat" />
              <el-option label="Asuransi" value="Asuransi" />
              <el-option label="Automotive" value="Automotive" />
              <el-option label="Fashion" value="Fashion" />
              <el-option label="FMCG(Consumer Goods)" value="FMCG(Consumer Goods)" />
              <el-option label="Kosmetik" value="Kosmetik" />
              <el-option label="Peralatan/Tools" value="Peralatan/Tools" />
              <el-option label="Perbankan" value="Perbankan" />
              <el-option label="Percetakan/Printing" value="Percetakan/Printing" />
              <el-option label="Perdagangan/Distributor" value="Perdagangan/Distributor" />
              <el-option label="Pertambangan" value="Pertambangan" />
              <el-option label="Pharmasi" value="Pharmasi" />
              <el-option label="Rokok" value="Rokok" />
              <el-option label="Telekomunisasi" value="Telekomunisasi" />
              <el-option label="Tour & Travel" value="Tour & Travel" /> -->
            </el-select>
          </el-form-item>
          <el-form-item label="Contact Person" prop="L_CONTACT_PERSON">
            <el-input v-model="addData.L_CONTACT_PERSON" placeholder="Contact Person" />
          </el-form-item>
          <el-form-item label="Jabatan" prop="L_CUSTOMER_COMPANY_POSITION">
            <el-input v-model="addData.L_CUSTOMER_COMPANY_POSITION" placeholder="Jabatan" />
          </el-form-item>
          <el-form-item label="Hp/wa" prop="L_CUSTOMER_PHONE">
            <el-input-number v-model="addData.L_CUSTOMER_PHONE" :controls="false" placeholder="Hp/wa" style="width: 100%" />
          </el-form-item>
          <el-form-item label="Email" prop="L_CUSTOMER_EMAIL">
            <el-input v-model="addData.L_CUSTOMER_EMAIL" placeholder="Email" />
          </el-form-item>
          <el-form-item label="Jenis Kebutuhan" prop="L_TYPE_OF_NEED">
            <el-select v-model="addData.L_TYPE_OF_NEED" multiple placeholder="Select" style="width: 100%">
              <el-option v-for="item in ['Kirim Paket', 'Sewa Armada', 'Sewa Gudang']" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>

          <!-- hardcode -->
          <!-- <el-form-item label="Estimasi Omset" prop="L_OMZET_ESTIMATION">
            <el-select v-model="addData.L_OMZET_ESTIMATION" placeholder="Estimasi Omset">
              <el-option v-for="(estimasi, index) in EstimasiOmset.body" :key="index" :label="estimasi.label" :value="estimasi.value" /> -->
          <!-- <el-option label="1 - 10 jt" value="1 - 10jt" />
              <el-option label="11 - 50 jt" value="11 - 50 jt" />
              <el-option label="51 - 100 jt" value="51 - 100 jt" />
              <el-option label="> 100 jt" value="> 100 jt" /> -->
          <!-- </el-select>
          </el-form-item> -->
          <el-form-item label="Prediksi Omset" prop="L_OMZET_ESTIMATION">
            <el-currency-input v-model="addData.L_OMZET_ESTIMATION" placeholder="Prediksi Omset" style="width: 100%" :min="0" />
          </el-form-item>

          <el-form-item label="Jumlah Kiriman">
            <el-input v-model="addData.L_KIRIMAN_AMOUNT_COUNT" placeholder="Estimasi Jumlah Kiriman" />
          </el-form-item>
          <el-form-item label="Tujuan Pengiriman">
            <el-input v-model="addData.L_DESTINATION" placeholder="Estimasi Tujuan Pengiriman" />
          </el-form-item>
          <el-form-item label="Jasa Pengiriman" prop="L_CURRENT_SHIPPING_VENDOR">
            <el-input v-model="addData.L_CURRENT_SHIPPING_VENDOR" placeholder="Jasa Pengiriman saat ini" />
          </el-form-item>
          <!-- hardcode -->
          <el-form-item label="Sistem Pembayaran" prop="L_PAYMENT_METHOD">
            <el-select v-model="addData.L_PAYMENT_METHOD" placeholder="Pilih Sistem Pembayaran" style="width: 100%">
              <el-option v-for="(sistem, index) in SistemPembayaran.body" :key="index" :label="sistem.label" :value="sistem.value" />
              <!-- <el-option label="Deposit" value="Deposit" />
              <el-option label="Invoice" value="Invoice" /> -->
            </el-select>
          </el-form-item>
          <!-- hardcode -->
          <el-form-item label="Jangka Waktu" prop="L_JANGKA_PEMBAYARAN">
            <el-select v-model="addData.L_JANGKA_PEMBAYARAN" placeholder="Jangka Waktu Pembayaran" style="width: 100%">
              <el-option v-for="(jangka, index) in JangkaPembayaran.body" :key="index" :label="jangka.label" :value="jangka.value" />
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
          <el-form-item label="Catatan Tambahan" prop="L_ADDITIONAL_NOTES">
            <el-input v-model="addData.L_ADDITIONAL_NOTES" type="textarea" placeholder="Catatan Tambahan" />
          </el-form-item>
        </el-form>
        <template #footer>
          <footer-button-dialog @save-click="onSaveAdd" @cancel-click="handleClose"></footer-button-dialog>
        </template>
      </el-dialog>

      <!-- edit dialog -->
      <el-dialog v-model="editDialog" title="Update Lead" :width="dialogWidth()" :before-close="handleClose" destroy-on-close>
        <el-form
          :model="editData"
          ref="editForm"
          :rules="rules"
          :label-position="labelPosition()"
          label-width="150px"
          class="grid md:grid-cols-2 grid-cols-1 gap-4"
        >
          <el-form-item label="Nama Customer" prop="L_CUSTOMER_NAME">
            <el-input v-model="editData.L_CUSTOMER_NAME" placeholder="Nama Customer" />
          </el-form-item>
          <!-- hardcode -->
          <el-form-item label="Jenis Perusahaan" prop="L_CUSTOMER_COMPANY_TYPE">
            <el-select v-model="editData.L_CUSTOMER_COMPANY_TYPE" placeholder="Pilih Jenis Perusahaan" style="width: 100%">
              <!-- <el-option v-for="(jenis, index) in JenisPerusahaan.body" :key="index" :label="jenis.label" :value="jenis.value" />   -->
              <el-option label="PT" value="PT" />
              <el-option label="CV" value="CV" />
              <el-option label="Seller" value="Seller" />
            </el-select>
          </el-form-item>

          <el-form-item label="Alamat Lengkap" prop="L_CUSTOMER_ADDRESS">
            <el-input v-model="editData.L_CUSTOMER_ADDRESS" type="textarea" placeholder="Alamat Lengkap" />
          </el-form-item>
          <el-form-item label="Provinsi" prop="L_PROVINCE_ID">
            <el-province-input v-model="editData.L_PROVINCE_ID"></el-province-input>
          </el-form-item>

          <el-form-item label="Kabupaten/Kota" prop="L_CITY_ID">
            <el-city-input v-model="editData.L_CITY_ID" placeholder="Kota" :province-id="editData.L_PROVINCE_ID"></el-city-input>
          </el-form-item>

          <el-form-item label="Jenis Industri" prop="L_CUSTOMER_COMPANY_INDUSTRI_TYPE">
            <el-select v-model="editData.L_CUSTOMER_COMPANY_INDUSTRI_TYPE" placeholder="Pilih Jenis Industri" style="width: 100%">
              <el-option v-for="(jenis, index) in JenisIndustri.body" :key="index" :label="jenis.label" :value="jenis.value" />

              <!-- <el-option label="Alat Berat" value="Alat Berat" />
              <el-option label="Asuransi" value="Asuransi" />
              <el-option label="Automotive" value="Automotive" />
              <el-option label="Fashion" value="Fashion" />
              <el-option label="FMCG(Consumer Goods)" value="FMCG(Consumer Goods)" />
              <el-option label="Kosmetik" value="Kosmetik" />
              <el-option label="Peralatan/Tools" value="Peralatan/Tools" />
              <el-option label="Perbankan" value="Perbankan" />
              <el-option label="Percetakan/Printing" value="Percetakan/Printing" />
              <el-option label="Perdagangan/Distributor" value="Perdagangan/Distributor" />
              <el-option label="Pertambangan" value="Pertambangan" />
              <el-option label="Pharmasi" value="Pharmasi" />
              <el-option label="Rokok" value="Rokok" />
              <el-option label="Telekomunisasi" value="Telekomunisasi" />
              <el-option label="Tour & Travel" value="Tour & Travel" /> -->
            </el-select>
          </el-form-item>

          <el-form-item label="Contact Person" prop="L_CONTACT_PERSON">
            <el-input v-model="editData.L_CONTACT_PERSON" placeholder="Contact Person" />
          </el-form-item>

          <el-form-item label="Jabatan" prop="L_CUSTOMER_COMPANY_POSITION">
            <el-input v-model="editData.L_CUSTOMER_COMPANY_POSITION" placeholder="Jabatan" />
          </el-form-item>

          <el-form-item label="Hp/wa" prop="L_CUSTOMER_PHONE">
            <el-input-number v-model="editData.L_CUSTOMER_PHONE" :controls="false" placeholder="Hp/wa" style="width: 100%" />
          </el-form-item>

          <el-form-item label="Email" prop="L_CUSTOMER_EMAIL">
            <el-input v-model="editData.L_CUSTOMER_EMAIL" placeholder="Email" />
          </el-form-item>

          <el-form-item label="Jenis Kebutuhan" prop="L_TYPE_OF_NEED">
            <el-select v-model="editData.L_TYPE_OF_NEED" multiple placeholder="Select" style="width: 100%">
              <el-option v-for="(item, index) in ['Kirim Paket', 'Sewa Armada', 'Sewa Gudang']" :key="index" :label="item" :value="item" />
            </el-select>
          </el-form-item>

          <!-- hardcode -->
          <el-form-item label="Prediksi Omset" prop="L_OMZET_ESTIMATION">
            <el-currency-input v-model="editData.L_OMZET_ESTIMATION" placeholder="Prediksi Omset" style="width: 100%" :min="0" />
          </el-form-item>

          <el-form-item label="Jumlah Kiriman">
            <el-input v-model="editData.L_KIRIMAN_AMOUNT_COUNT" placeholder="Estimasi Jumlah Kiriman" />
          </el-form-item>

          <el-form-item label="Tujuan Pengiriman">
            <el-input v-model="editData.L_DESTINATION" placeholder="Estimasi Tujuan Pengiriman" />
          </el-form-item>

          <el-form-item label="Jasa Pengiriman" prop="L_CURRENT_SHIPPING_VENDOR">
            <el-input v-model="editData.L_CURRENT_SHIPPING_VENDOR" placeholder="Jasa Pengiriman saat ini" />
          </el-form-item>
          <!-- hardcode -->
          <el-form-item label="Sistem Pembayaran" prop="L_PAYMENT_METHOD">
            <el-select v-model="editData.L_PAYMENT_METHOD" placeholder="Pilih Sistem Pembayaran" style="width: 100%">
              <el-option v-for="(sistem, index) in SistemPembayaran.body" :key="index" :label="sistem.label" :value="sistem.value" />
              <!-- <el-option label="Deposit" value="Deposit" />
              <el-option label="Invoice" value="Invoice" /> -->
            </el-select>
          </el-form-item>

          <!-- hardcode -->
          <el-form-item label="Jangka Waktu" prop="L_JANGKA_PEMBAYARAN">
            <el-select v-model="editData.L_JANGKA_PEMBAYARAN" placeholder="Jangka Waktu Pembayaran" style="width: 100%">
              <el-option v-for="(jangka, index) in JangkaPembayaran.body" :key="index" :label="jangka.label" :value="jangka.value" />
              <!-- <el-option label="7" value="7" />
              <el-option label="14" value="14" />
              <el-option label="30" value="30" />
              <el-option label="45" value="45" /> -->
            </el-select>
          </el-form-item>
          <!-- hardcode -->
          <el-form-item label="Surat Jalan" prop="L_ISHAVE_TRAVEL_DOCUMENT">
            <el-select v-model="editData.L_ISHAVE_TRAVEL_DOCUMENT" placeholder="Surat Jalan Kembali" style="width: 100%">
              <el-option v-for="(surat, index) in SuratJalan.body" :key="index" :label="surat.label" :value="surat.value" />
              <!-- <el-option label="Ya" value="Ya" />
              <el-option label="Tidak" value="Tidak" /> -->
            </el-select>
          </el-form-item>

          <el-form-item label="Catatan Tambahan" prop="L_ADDITIONAL_NOTES">
            <el-input v-model="editData.L_ADDITIONAL_NOTES" type="textarea" placeholder="Catatan Tambahan" />
          </el-form-item>
        </el-form>
        <!-- FOOTER -->
        <template #footer>
          <footer-button-dialog @save-click="onSaveEdit" @cancel-click="handleClose"></footer-button-dialog>
        </template>
      </el-dialog>

      <!-- detail dialog -->
      <el-dialog
        v-if="viewData?.status === 'NEW LEAD'"
        v-model="viewDialog"
        title="Detail Deal"
        :width="dialogWidth()"
        class="deal-detail-dialog rounded-xl overflow-hidden"
        destroy-on-close
      >
        <div class="space-y-5 text-gray-700 antialiased py-2 px-1" :model="viewData">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-white border border-blue-100 shadow-sm relative overflow-hidden">
              <div class="absolute top-0 right-0 w-16 h-16 -mr-8 -mt-8 bg-blue-500/5 rounded-full"></div>

              <h4 class="text-blue-700 font-bold mb-4 uppercase text-[10px] tracking-[0.15em] flex items-center">
                <span class="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                Informasi Bisnis
              </h4>
              <div class="space-y-3">
                <div class="flex flex-col">
                  <span class="text-[11px] text-gray-400 font-semibold uppercase tracking-tight">Nama Customer</span>
                  <span class="font-bold text-gray-900 text-base leading-tight">{{ viewData.namaCustomer }}</span>
                </div>
                <div class="flex flex-col">
                  <span class="text-[11px] text-gray-400 font-semibold uppercase tracking-tight">Industri</span>
                  <span class="text-sm font-medium text-gray-700">{{ viewData.jenisIndustri }}</span>
                </div>
                <div class="flex flex-col">
                  <span class="text-[11px] text-gray-400 font-semibold uppercase tracking-tight">Jenis Kebutuhan</span>
                  <span class="text-sm font-medium text-gray-700">{{ viewData.jenisKebutuhan }}</span>
                </div>
                <div class="mt-2 pt-2 border-t border-blue-100/50">
                  <span class="text-[11px] text-blue-500/70 font-bold uppercase tracking-tight">Prediksi Omset</span>
                  <div class="text-xl font-extrabold text-blue-600 tracking-tight">
                    IDR
                    {{
                      Number.isNaN(Number(viewData.estimasiOmset))
                        ? viewData.estimasiOmset
                        : new Intl.NumberFormat('id-ID').format(viewData.estimasiOmset)
                    }}
                  </div>
                </div>
              </div>
            </div>

            <div class="p-4 rounded-xl bg-gradient-to-br from-yellow-50 to-white border border-yellow-200 shadow-sm relative overflow-hidden">
              <div class="absolute top-0 right-0 w-16 h-16 -mr-8 -mt-8 bg-yellow-500/5 rounded-full"></div>

              <h4 class="text-yellow-700 font-bold mb-4 uppercase text-[10px] tracking-[0.15em] flex items-center">
                <span class="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-2"></span>
                Kontak Person
              </h4>
              <div class="space-y-3">
                <div class="flex flex-col">
                  <span class="text-[11px] text-gray-400 font-semibold uppercase tracking-tight">Nama Kontak</span>
                  <span class="font-bold text-gray-800 text-base leading-tight">{{ viewData.kontakPerson }} - {{ viewData.noHandphone }}</span>
                </div>
                <div class="flex flex-col">
                  <span class="text-[11px] text-gray-400 font-semibold uppercase tracking-tight">Email</span>
                  <span class="font-bold text-gray-800 text-base leading-tight">
                    {{ viewData.email && viewData.email !== 'null' ? viewData.email : '-' }}
                  </span>
                </div>
                <div class="flex flex-col">
                  <span class="text-[11px] text-gray-400 font-semibold uppercase tracking-tight">Jabatan</span>
                  <span class="text-sm font-medium text-gray-700">{{ viewData.jabatan }}</span>
                </div>
                <div class="mt-2 pt-2 border-t border-yellow-100/50">
                  <span class="text-[11px] text-gray-400 font-semibold uppercase tracking-tight">Terakhir Diperbarui</span>
                  <div class="text-xs font-medium text-gray-500 flex items-center mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {{ viewData.lastUpdate }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div class="flex items-center justify-between mb-5 border-b border-gray-100 pb-3">
              <h4 class="text-gray-500 font-bold uppercase text-[10px] tracking-[0.2em]">Detail</h4>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 text-sm">
              <div class="space-y-4">
                <div>
                  <span class="flex items-center text-[11px] text-gray-400 font-bold uppercase mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Lokasi & Alamat
                  </span>
                  <p class="font-semibold text-gray-800 leading-relaxed pl-4">
                    {{ viewData.alamat }}<br />
                    <span class="text-blue-600 font-bold">{{ viewData.kota }}, {{ viewData.provinsi }}</span>
                  </p>
                </div>

                <div>
                  <span class="flex items-center text-[11px] text-gray-400 font-bold uppercase mb-2 pl-4">Metode Pembayaran</span>
                  <div class="inline-flex items-center px-3 py-1 bg-green-50 text-green-700 rounded-lg border border-green-100 ml-4">
                    <span class="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    <span class="font-bold text-xs">{{ viewData.metodePembayaran }}</span>

                    <p class="text-xs ml-3 font-medium flex justify-between">
                      <span class="text-gray-500 font-normal">Jangka Waktu:</span>
                      <span class="text-blue-700 ml-1 font-bold">{{ viewData.jangkaPembayaran }} hari</span>
                    </p>
                  </div>
                </div>

                <div>
                  <span class="flex items-center text-[11px] text-gray-400 font-bold uppercase mb-2 pl-4">Status saat ini</span>
                  <div class="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-lg border border-blue-100 ml-4">
                    <span class="w-2 h-2 bg-blue-900 rounded-full mr-2"></span>
                    <span class="font-bold text-xs">{{ viewData.status }}</span>
                  </div>
                </div>
              </div>

              <div class="space-y-4">
                <div class="bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <span class="text-[11px] text-gray-400 font-bold uppercase block mb-2">Informasi Pengiriman</span>
                  <div class="space-y-1.5">
                    <p class="text-xs font-medium flex justify-between">
                      <span class="text-gray-500 font-normal">Jumlah:</span>
                      <span class="text-gray-800 font-bold">{{
                        viewData.jumlahKiriman && viewData.jumlahKiriman !== 'null' ? viewData.jumlahKiriman : '-'
                      }}</span>
                    </p>
                    <p class="text-xs font-medium flex justify-between">
                      <span class="text-gray-500 font-normal">Tujuan:</span>
                      <span class="text-gray-800 font-bold">{{ viewData.tujuan && viewData.tujuan !== 'null' ? viewData.tujuan : '-' }}</span>
                    </p>
                    <p class="text-xs font-medium flex justify-between">
                      <span class="text-gray-500 font-normal">Jasa Pengiriman saat ini:</span>
                      <span class="text-gray-800 font-bold">{{ viewData.jasaPengiriman || '-' }}</span>
                    </p>
                  </div>
                </div>

                <div class="p-3 bg-yellow-50/50 rounded-lg border border-yellow-100">
                  <span class="text-[11px] text-yellow-600 font-bold uppercase block mb-1 tracking-tighter">Catatan</span>
                  <p class="text-xs text-gray-600 italic leading-relaxed">"{{ viewData.catatan || '-' }}"</p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 p-3 rounded-lg border border-gray-100">
            <div class="border-t border-yellow-100/50">
              <span class="text-[11px] text-gray-400 font-semibold uppercase tracking-tight">Data Dibuat</span>
              <div class="text-xs font-medium text-gray-500 flex items-center mt-0.5">
                {{ viewData.createAt }}
              </div>
            </div>
          </div>
        </div>
      </el-dialog>

      <el-dialog v-model="viewDialogFollowUp" title="Detail Deal" :width="dialogWidth()" class="deal-detail-dialog rounded-xl overflow-hidden">
        <div class="space-y-5 text-gray-700 antialiased py-2 px-1">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-white border border-blue-100 shadow-sm relative">
              <h4 class="text-blue-700 font-bold mb-3 uppercase text-[10px] tracking-[0.15em] flex items-center">
                <span class="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                Informasi Customer
              </h4>

              <div class="space-y-2">
                <p class="font-bold text-gray-900 text-base">
                  {{ viewFollowUpData.Nama_Customer }}
                </p>

                <div class="flex flex-wrap gap-2">
                  <span class="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded uppercase">
                    {{ viewFollowUpData.Tipe_Customer }}
                  </span>
                  <span class="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold rounded uppercase">
                    {{ viewFollowUpData.Jenis_Industri }}
                  </span>
                </div>

                <div class="pt-2 border-t border-blue-100/50">
                  <span class="text-[11px] text-blue-500/70 font-bold uppercase">Prediksi Omset</span>
                  <div class="text-xl font-extrabold text-blue-600">
                    IDR
                    {{
                      Number.isNaN(Number(viewFollowUpData.Estimasi_Omset))
                        ? viewFollowUpData.Estimasi_Omset
                        : new Intl.NumberFormat('id-ID').format(viewFollowUpData.Estimasi_Omset)
                    }}
                  </div>
                  <p class="text-[10px] text-gray-400 italic mt-1">Terakhir Update: {{ viewFollowUpData.Last_Update }}</p>
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
                  <p class="font-bold">{{ viewFollowUpData.Kontak_Person }}</p>
                </div>
                <div>
                  <span class="text-[11px] text-gray-400 font-semibold uppercase">Jabatan</span>
                  <p>{{ viewFollowUpData.Jabatan }}</p>
                </div>
                <div>
                  <span class="text-[11px] text-gray-400 font-semibold uppercase">HP / Email</span>
                  <p class="text-blue-600 font-medium">0{{ viewFollowUpData.No_Handphone }} / {{ viewFollowUpData.Email || '-' }}</p>
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
                  {{ viewFollowUpData.Alamat }}<br />
                  <span class="text-blue-600 font-bold"> {{ viewFollowUpData.Kota }} </span>
                </p>
              </div>

              <div>
                <span class="text-[11px] text-gray-400 font-bold uppercase mb-1 block"> Pembayaran </span>
                <p class="font-semibold">{{ viewFollowUpData.Metode_Pembayaran }}</p>
                <p class="text-xs text-blue-600">{{ viewFollowUpData.Jangka_Pembayaran }} Hari</p>
              </div>

              <div>
                <div class="flex flex-col">
                  <span class="text-[11px] text-gray-400 font-semibold uppercase tracking-tight">Jenis Kebutuhan</span>
                  <span class="text-sm font-medium text-gray-700">{{ viewFollowUpData.Jenis_Kebutuhan }}</span>
                </div>
              </div>

              <div class="space-y-1.5">
                <p class="text-xs font-medium flex justify-between">
                  <span class="text-gray-500 font-normal">Jumlah:</span>
                  <span class="text-gray-800 font-bold">{{
                    viewFollowUpData.Jumlah_Kiriman && viewFollowUpData.Jumlah_Kiriman !== 'null' ? viewFollowUpData.Jumlah_Kiriman : '-'
                  }}</span>
                </p>
                <p class="text-xs font-medium flex justify-between">
                  <span class="text-gray-500 font-normal">Tujuan:</span>
                  <span class="text-gray-800 font-bold">{{
                    viewFollowUpData.Tujuan && viewFollowUpData.Tujuan !== 'null' ? viewFollowUpData.Tujuan : '-'
                  }}</span>
                </p>
                <p class="text-xs font-medium flex justify-between">
                  <span class="text-gray-500 font-normal">Jasa Pengiriman saat ini:</span>
                  <span class="text-gray-800 font-bold">{{
                    viewFollowUpData.Jasa_Pengiriman && viewFollowUpData.Jasa_Pengiriman !== 'null' ? viewFollowUpData.Jasa_Pengiriman : '-'
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
                {{ viewFollowUpData.id_account && viewFollowUpData.id_account !== 'null' ? viewFollowUpData.id_account : '-' }}
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
                      {{ viewFollowUpData.Nama_Customer && viewFollowUpData.Nama_Customer !== 'null' ? viewFollowUpData.Nama_Customer : '-' }}
                    </p>
                  </div>
                  <div class="bg-white p-2.5 rounded-lg border border-gray-200 shadow-sm">
                    <p class="text-[11px] font-bold text-gray-400 uppercase leading-none mb-1.5">Jenis Kiriman</p>
                    <p class="text-xs font-semibold">
                      {{ viewFollowUpData.Jenis_Kebutuhan && viewFollowUpData.Jenis_Kebutuhan !== 'null' ? viewFollowUpData.Jenis_Kebutuhan : '-' }}
                    </p>
                  </div>
                  <div class="bg-white p-2.5 rounded-lg border border-gray-200 shadow-sm">
                    <p class="text-[11px] font-bold text-gray-400 uppercase leading-none mb-1.5">Tujuan</p>
                    <p class="text-xs font-semibold">
                      {{ viewFollowUpData.Tujuan && viewFollowUpData.Tujuan !== 'null' ? viewFollowUpData.Tujuan : '-' }}
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
                      {{
                        viewFollowUpData.Metode_Pembayaran && viewFollowUpData.Metode_Pembayaran !== 'null' ? viewFollowUpData.Metode_Pembayaran : '-'
                      }}
                    </p>
                  </div>
                  <div class="bg-white p-2.5 rounded-lg border border-gray-200 shadow-sm">
                    <p class="text-[11px] font-bold text-gray-400 uppercase leading-none mb-1.5">Lampiran TTK Balik</p>
                    <p class="text-xs font-semibold">
                      {{ viewFollowUpData.lampiran_ttk && viewFollowUpData.lampiran_ttk !== 'null' ? viewFollowUpData.lampiran_ttk : '-' }}
                    </p>
                  </div>
                  <div class="bg-white p-2.5 rounded-lg border border-gray-200 shadow-sm">
                    <p class="text-[11px] font-bold text-gray-400 uppercase leading-none mb-1.5">Lampiran Suran Jalan/DO Balik</p>
                    <p class="text-xs font-semibold">
                      {{
                        viewFollowUpData.lampiran_surat_jalan && viewFollowUpData.lampiran_surat_jalan !== 'null'
                          ? viewFollowUpData.lampiran_surat_jalan
                          : '-'
                      }}
                    </p>
                  </div>
                  <div class="bg-white p-2.5 rounded-lg border border-gray-200 shadow-sm">
                    <p class="text-[11px] font-bold text-gray-400 uppercase leading-none mb-1.5">Periode Invoice</p>
                    <p class="text-xs font-semibold">
                      {{
                        viewFollowUpData.pembuatan_invoice && viewFollowUpData.pembuatan_invoice !== 'null' ? viewFollowUpData.pembuatan_invoice : '-'
                      }}
                    </p>
                  </div>
                  <div class="bg-white p-2.5 rounded-lg border border-gray-200 shadow-sm">
                    <p class="text-[11px] font-bold text-gray-400 uppercase leading-none mb-1.5">Email Profoma Invoice</p>
                    <p class="text-xs font-semibold">
                      {{ viewFollowUpData.email_profoma && viewFollowUpData.email_profoma !== 'null' ? viewFollowUpData.email_profoma : '-' }}
                    </p>
                  </div>
                  <div class="bg-white p-2.5 rounded-lg border border-gray-200 shadow-sm">
                    <p class="text-[11px] font-bold text-gray-400 uppercase leading-none mb-1.5">Jangka Waktu Pembayaran</p>
                    <p class="text-xs font-semibold">
                      {{
                        viewFollowUpData.Jangka_Pembayaran && viewFollowUpData.Jangka_Pembayaran !== 'null' ? viewFollowUpData.Jangka_Pembayaran : '-'
                      }}
                      Hari
                    </p>
                  </div>

                  <div class="bg-emerald-50/20 p-2.5 rounded-lg border border-emerald-100 shadow-sm">
                    <p class="text-[11px] font-bold text-emerald-600 uppercase leading-none mb-1.5">Contact Pembayaran</p>
                    <div class="flex flex-wrap justify-between items-center gap-1">
                      <span class="text-xs font-bold">{{
                        viewFollowUpData.contact_pembayaran && viewFollowUpData.contact_pembayaran !== 'null'
                          ? viewFollowUpData.contact_pembayaran
                          : '-'
                      }}</span>
                      <span class="text-[10px] text-emerald-700 font-medium">{{
                        viewFollowUpData.handphone_pembayaran && viewFollowUpData.handphone_pembayaran !== 'null'
                          ? viewFollowUpData.handphone_pembayaran
                          : '-'
                      }}</span>
                    </div>
                  </div>

                  <div class="bg-white p-2.5 rounded-lg border border-gray-200 shadow-sm">
                    <p class="text-[11px] font-bold text-gray-400 uppercase leading-none mb-1.5">Alamat Penagihan</p>
                    <p class="text-[11px] text-gray-600">
                      {{
                        viewFollowUpData.alamat_penagihan && viewFollowUpData.alamat_penagihan !== 'null' ? viewFollowUpData.alamat_penagihan : '-'
                      }}
                    </p>
                  </div>

                  <div class="bg-white p-2.5 rounded-lg border border-gray-200 shadow-sm">
                    <p class="text-[11px] font-bold text-gray-400 uppercase leading-none mb-1.5">Email Pembayaran</p>
                    <p class="text-[11px] font-semibold text-blue-600 truncate">
                      {{ viewFollowUpData.email_penagihan && viewFollowUpData.email_penagihan !== 'null' ? viewFollowUpData.email_penagihan : '-' }}
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
                      >{{ viewFollowUpData.discount && viewFollowUpData.discount !== 'null' ? viewFollowUpData.discount : '0' }}%</span
                    >
                  </div>
                  <div class="bg-white p-2.5 rounded-lg border border-gray-200">
                    <p class="text-[11px] font-bold text-gray-400 uppercase mb-1">Harga Digunakan</p>
                    <p class="text-xs font-semibold">
                      {{ viewFollowUpData.type_harga && viewFollowUpData.type_harga !== 'null' ? viewFollowUpData.type_harga : '-' }}
                    </p>
                  </div>
                  <div class="bg-white p-2.5 rounded-lg border border-gray-200">
                    <p class="text-[11px] font-bold text-gray-400 uppercase mb-1">Layanan</p>
                    <p class="text-xs font-semibold">
                      {{ viewFollowUpData.nedd_type && viewFollowUpData.nedd_type !== 'null' ? viewFollowUpData.nedd_type : '-' }}
                    </p>
                  </div>
                  <div class="bg-white p-2.5 rounded-lg border border-gray-200">
                    <p class="text-[11px] font-bold text-gray-400 uppercase mb-1">Pengiriman Reporting</p>
                    <p class="text-xs font-semibold">
                      {{
                        viewFollowUpData.jangka_report_kiriman && viewFollowUpData.jangka_report_kiriman !== 'null'
                          ? viewFollowUpData.jangka_report_kiriman
                          : '-'
                      }}
                    </p>
                  </div>
                  <div class="bg-white p-2.5 rounded-lg border border-gray-200">
                    <p class="text-[11px] font-bold text-gray-400 uppercase mb-1">Perlu Reporting</p>
                    <p class="text-xs font-semibold">
                      {{ viewFollowUpData.perlu_reporting && viewFollowUpData.perlu_reporting !== 'null' ? viewFollowUpData.perlu_reporting : '-' }}
                    </p>
                  </div>
                  <div class="bg-white p-2.5 rounded-lg border border-gray-200">
                    <p class="text-[11px] font-bold text-gray-400 uppercase mb-1">Email Reporting</p>
                    <p class="text-xs font-semibold truncate">
                      {{ viewFollowUpData.email_report && viewFollowUpData.email_report !== 'null' ? viewFollowUpData.email_report : '-' }}
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
                      {{ viewFollowUpData.jam_pickup && viewFollowUpData.jam_pickup !== 'null' ? viewFollowUpData.jam_pickup : '-' }} /
                      {{ viewFollowUpData.tangal_mulai && viewFollowUpData.tangal_mulai !== 'null' ? viewFollowUpData.tangal_mulai : '-' }}
                    </p>
                  </div>
                  <div class="bg-white p-2.5 rounded-lg border border-gray-200 shadow-sm">
                    <p class="text-[10px] font-bold text-gray-400 uppercase mb-0.5">Sistem Input TTK</p>
                    <p class="text-xs font-semibold text-gray-700">
                      {{ viewFollowUpData.sistem_ttk && viewFollowUpData.sistem_ttk !== 'null' ? viewFollowUpData.sistem_ttk : '-' }}
                    </p>
                  </div>
                  <div class="bg-white p-2.5 rounded-lg border border-gray-200 shadow-sm">
                    <p class="text-[10px] font-bold text-gray-400 uppercase mb-0.5">Order Pickup</p>
                    <p class="text-xs font-semibold text-gray-700">
                      {{ viewFollowUpData.order_pickup && viewFollowUpData.order_pickup !== 'null' ? viewFollowUpData.order_pickup : '-' }}
                    </p>
                  </div>
                  <div class="bg-white p-2.5 rounded-lg border border-gray-200 shadow-sm">
                    <p class="text-[10px] font-bold text-gray-400 uppercase mb-0.5">Packing Kayu</p>
                    <p class="text-xs font-semibold" :class="viewFollowUpData.packing_kayu === 'Ya' ? 'text-orange-600' : 'text-gray-700'">
                      {{ viewFollowUpData.packing_kayu && viewFollowUpData.packing_kayu !== 'null' ? viewFollowUpData.packing_kayu : '-' }}
                    </p>
                  </div>
                  <div class="bg-indigo-50/30 p-2.5 rounded-lg border border-indigo-100">
                    <div class="flex justify-between items-end mb-1">
                      <p class="text-[10px] font-bold text-indigo-600 uppercase">PIC Pickup</p>
                      <span class="text-[11px] text-indigo-700 font-bold">{{
                        viewFollowUpData.handphone_pickup && viewFollowUpData.handphone_pickup !== 'null' ? viewFollowUpData.handphone_pickup : '-'
                      }}</span>
                    </div>
                    <p class="text-xs font-bold text-gray-800">
                      {{ viewFollowUpData.contact_pickup && viewFollowUpData.contact_pickup !== 'null' ? viewFollowUpData.contact_pickup : '-' }}
                    </p>
                  </div>
                  <div class="bg-white p-2.5 rounded-lg border border-gray-200 shadow-sm">
                    <p class="text-[10px] font-bold text-gray-400 uppercase mb-1">Alamat Pickup</p>
                    <p class="text-xs font-medium text-gray-600 leading-relaxed italic">
                      {{ viewFollowUpData.alamat_pickup && viewFollowUpData.alamat_pickup !== 'null' ? viewFollowUpData.alamat_pickup : '-' }}
                    </p>
                  </div>
                </div>
              </section>

              <div class="bg-gray-100 p-3 rounded-lg flex items-start gap-3 border border-gray-200">
                <div>
                  <p class="text-[11px] font-bold text-gray-500 uppercase leading-none mb-1">Catatan Tambahan</p>
                  <p class="text-[11px] text-gray-600 leading-tight italic">
                    {{
                      viewFollowUpData.informasi_tambahan && viewFollowUpData.informasi_tambahan !== 'null'
                        ? viewFollowUpData.informasi_tambahan
                        : 'Tidak ada catatan.'
                    }}
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
                      <p class="text-sm text-gray-800 leading-tight">{{ viewFollowUpData.Jenis_FollowUp || '-' }}</p>
                    </div>
                    <div>
                      <p class="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Status Saat Ini</p>
                      <span class="text-sm text-blue-600 font-bold leading-tight">{{ viewFollowUpData.Status_FollowUp || '-' }}</span>
                    </div>
                  </div>
                  <div class="border-t border-blue-100/50 pt-2">
                    <p class="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Hasil Follow Up</p>
                    <p class="text-sm italic text-gray-600 mt-0.5 leading-snug break-words">
                      "{{ viewFollowUpData.Hasil_FollowUp && viewFollowUpData.Hasil_FollowUp !== 'null' ? viewFollowUpData.Hasil_FollowUp : '-' }}"
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
                    :href="baseUrl + viewFollowUpData.Harga_Express"
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
                    :href="baseUrl + viewFollowUpData.Harga_Cargo"
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
                    :href="baseUrl + viewFollowUpData.file_pks"
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
                    :href="baseUrl + viewFollowUpData.pks_lepas_kunci"
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
                    :href="baseUrl + viewFollowUpData.pks_ftl"
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
                    :href="baseUrl + viewFollowUpData.pks_Unit_Driver"
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
                    :href="baseUrl + viewFollowUpData.pks_AllIn"
                    download
                    type="primary"
                    class="!w-full !m-0 !inline-flex"
                  >
                    <el-icon :size="14" class="mr-1.5"><Download /></el-icon>
                    File PKS All In
                  </el-button>
                </div>

                <div class="text-[10px] h-20 text-gray-500 bg-gray-100 p-2 rounded">
                  <p class="truncate"><b>Address:</b> {{ viewFollowUpData.Check_Lokasi }}</p>
                </div>
              </div>

              <div class="space-y-3">
                <h4 class="text-gray-500 font-bold uppercase text-[10px] tracking-[0.25em]">History Follow Up</h4>

                <div v-if="viewFollowUpData.History_FollowUp" class="relative pl-6 pr-2 border-l border-gray-200 h-auto">
                  <div v-for="(item, index) in JSON.parse(viewFollowUpData.History_FollowUp)" :key="index" class="relative mb-4">
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
                    <div class="relative cursor-pointer" @click="viewFollowUpData.Foto_Selfie && openPreview(baseUrl + viewFollowUpData.Foto_Selfie)">
                      <img
                        :src="viewFollowUpData.Foto_Selfie ? baseUrl + viewFollowUpData.Foto_Selfie : ''"
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
                    <div class="relative cursor-pointer" @click="viewFollowUpData.Bukti_Foto && openPreview(baseUrl + viewFollowUpData.Bukti_Foto)">
                      <img
                        :src="viewFollowUpData.Bukti_Foto ? baseUrl + viewFollowUpData.Bukti_Foto : ''"
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
                  {{ viewFollowUpData.Create_at }}
                </div>
              </div>
            </div>
          </div>

          <div class="pt-3 border-t border-gray-100 flex justify-between text-[10px] text-gray-400">
            <span>ID Transaksi: {{ viewFollowUpData.Id_Transaksi || '-' }}</span>
            {{ viewFollowUpData.jenis_sewa_armada }}
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
import {
  getAddress,
  generateSuratPengiriman,
  generateFormCustomer,
  generateInfoCustomer,
  generateSuratSewaArmadaLk,
  generateSuratSewaArmadaFtl,
  isValElForm,
} from '../../helper/utils';
import { useStore } from 'vuex';
// import hooks buat insert, edit, pagination, dll
import HOOKS from '../../hooks/bundleOneOps';
import { useRoute, useRouter } from 'vue-router';

const baseUrl = import.meta.env.MODE == 'production' ? import.meta.env.VITE_API_URL_PROD : import.meta.env.VITE_API_URL_DEV;

// definisikan hooks dari bundleOneOps, contohnya untuk kebutuhna insert data pakai ini
const { listData, rowTotal, pageIndex, pageSize, getListData, changeIndex, loading, filterData, search, headers } = HOOKS.useListDataPaginate();
const { addData, addForm, addDialog, saveAdd, cancelAdd } = HOOKS.useAddOneData();
const { viewData, viewDialog, openViewDialog } = HOOKS.useViewOneData();
const [viewFollowUpData, viewDialogFollowUp, closeView, openViewDialogFollowUp] = HOOKS.useViewOneData({ returnAsArray: true });
const [followUpData, getFollowUpData, loadingFollowUpData] = HOOKS.useGetData();
const [JenisIndustri, GetJenisIndustri, loadingJenisIndutri] = HOOKS.useGetData();
GetJenisIndustri(() => API.apiGetJenisIndustri());

const [JenisPerusahaan, GetJenisPerusahaan, loadingJenisPerusahaan] = HOOKS.useGetData();
GetJenisPerusahaan(() => API.apiGetJenisIndustri());

const [SalesFolowUpStage, GetSalesFollowUpStage, loadingSalesFolowUpStage] = HOOKS.useGetData();
GetSalesFollowUpStage(() => API.apiGetSalesStageFollowUp());

const [EstimasiOmset, GetEstimasiOmset, loadingEstimasiOmset] = HOOKS.useGetData();
GetEstimasiOmset(() => API.apiGetEstimasiOmset());

const [SistemPembayaran, GetSistemPembayaran, loadingSistemPembayaran] = HOOKS.useGetData();
GetSistemPembayaran(() => API.apiGetMetodePembayaran());

const [JangkaPembayaran, GetJangkaPembayaran, loadingJangkaPembayaran] = HOOKS.useGetData();
GetJangkaPembayaran(() => API.apiGetJangkaWaktu());

const [SuratJalan, GetSuratJalan, loadingSuratJalan] = HOOKS.useGetData();
GetSuratJalan(() => API.apiGetSuratJalan());

const { editForm, saveEdit2, editData, editDialog, openEdit, openEditDialog, saveEdit } = HOOKS.useEditOneData();
const { deleteData } = HOOKS.useDeleteOneData();
const store = useStore();
const accountId = computed(() => store.getters.accountId);
const role = computed(() => store.getters.userRole || localStorage.getItem('role'));
const groupValue = computed(() => store.getters.userGroup || localStorage.getItem('group'));

const route = useRoute();
const router = useRouter();
const date = new Date();
const endDate = new Date(date);
const startDate = new Date(date);
const filterPipeline = ref(null);
const isInit = ref(true);
const lastStatus = ref(viewData.value.status);

filterData.value.until = endDate.toISOString().split('T')[0];
startDate.setDate(startDate.getDate() - 7);
filterData.value.since = startDate.toISOString().split('T')[0];

//grup dan peran
filterData.value.ROLE = role.value || localStorage.getItem('role');
filterData.value.GROUP_ID = groupValue.value || localStorage.getItem('group');
filterData.value.USER_ID = accountId.value || localStorage.getItem('id');

function handleFilterSales(data) {
  filterData.value.ROLE = data.USER_ROLE;
  filterData.value.GROUP_ID = data.USER_GROUP_CODE;
  filterData.value.USER_ID = data.USER_ID;
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
if (route.query.ROLE) {
  filterData.value.ROLE = route.query.ROLE;
}

if (route.query.GROUP_ID) {
  filterData.value.GROUP_ID = route.query.GROUP_ID;
}

if (route.query.user_id) {
  filterData.value.USER_ID = route.query.user_id;
}

if (route.query.since) {
  filterData.value.since = route.query.since;
  filterData.value.until = route.query.until;
}

// declare rules buat form nya, harusnya sih ditaruh di src/rules/<nama rules>.js aja
const rules = {
  L_CUSTOMER_NAME: [{ required: true, message: 'Nama Customer wajib diisi', trigger: 'blur' }],
  L_CUSTOMER_COMPANY_TYPE: [{ required: true, message: 'Jenis Perusahaan wajib diisi', trigger: 'change' }],
  L_CUSTOMER_ADDRESS: [{ required: true, message: 'Alamat Lengkap wajib diisi', trigger: 'blur' }],
  L_PROVINCE_ID: [{ required: true, message: 'Provinsi wajib diisi', trigger: 'blur' }],
  L_CITY_ID: [{ required: true, message: 'Kabupaten/Kota wajib diisi', trigger: 'blur' }],
  L_CUSTOMER_COMPANY_INDUSTRI_TYPE: [{ required: true, message: 'Jenis Industri wajib diisi', trigger: 'change' }],
  L_CONTACT_PERSON: [{ required: true, message: 'Contact Person wajib diisi', trigger: 'blur' }],
  L_CUSTOMER_COMPANY_POSITION: [{ required: true, message: 'Jabatan wajib diisi', trigger: 'blur' }],
  L_CUSTOMER_PHONE: [{ required: true, message: 'Hp/wa wajib diisi', trigger: 'blur' }],
  L_TYPE_OF_NEED: [{ required: true, message: 'Jenis Kebutuhan wajib diisi', trigger: 'change' }],
  L_OMZET_ESTIMATION: [{ required: true, message: 'Prediksi Omset wajib diisi', trigger: 'change' }],
  L_PAYMENT_METHOD: [{ required: true, message: 'Sistem Pembayaran wajib diissi', trigger: 'change' }],
  L_JANGKA_PEMBAYARAN: [{ required: true, message: 'Jangka Waktu wajib diisi', trigger: 'change' }],
  L_ISHAVE_TRAVEL_DOCUMENT: [{ required: true, message: 'Surat Jalan wajib diisi', trigger: 'change' }],
  L_ADDITIONAL_NOTES: [{ required: true, message: 'Catatan Tambahan wajib diisi', trigger: 'blur' }],
  L_CURRENT_SHIPPING_VENDOR: [{ required: true, message: 'Jasa Pengiriman wajib diisi', trigger: 'blur' }],
};

function onViewDialog(row) {
  const data = {
    id: row.id,
    namaCustomer: row.Nama_Customer,
    tipeCustomer: row.Tipe_Customer,
    kontakPerson: row.Kontak_Person,
    jabatan: row.Jabatan,
    noHandphone: row.No_Handphone,
    email: row.Email,
    alamat: row.Alamat,
    provinsi: row.Provinsi,
    kota: row.Kota,
    tujuan: row.Tujuan,
    jumlahKiriman: row.Jumlah_Kiriman,
    jasaPengiriman: row.Jasa_Pengiriman,
    jenisIndustri: row.Jenis_Industri,
    jenisKebutuhan: row.Jenis_Kebutuhan,
    estimasiOmset: row.Estimasi_Omset,
    Surat_Jalan: row.Surat_Jalan,
    jangkaPembayaran: row.Jangka_Pembayaran,
    metodePembayaran: row.Metode_Pembayaran,
    catatan: row.Catatan,
    status: row.Status_FollowUp,
    lastUpdate: row.Last_Update,
    createAt: row.Data_Dibuat,
  };
  openViewDialog(data);
}

function onFollowUpDialog(row) {
  console.log(viewFollowUpData);

  getFollowUpData(
    () => API.getDataFollowUpById({ id: row.id_Customer }),
    true,
    true,
    (data) => {
      openViewDialogFollowUp(data.body[0]);
      console.log('data follow up', data);
    },
  );
}

function onEditDialog(row) {
  const data = {
    id: row.id_Customer,
    L_CUSTOMER_NAME: row.Nama_Customer,
    L_CUSTOMER_COMPANY_TYPE: row.Tipe_Customer,
    L_CONTACT_PERSON: row.Kontak_Person,
    L_CUSTOMER_COMPANY_POSITION: row.Jabatan,
    L_CUSTOMER_PHONE: row.No_Handphone,
    L_CUSTOMER_EMAIL: row.Email,
    L_CUSTOMER_ADDRESS: row.Alamat,
    L_PROVINCE_ID: row.id_Provinsi,
    L_CITY_ID: row.id_Kota,
    L_DESTINATION: row.Tujuan,
    L_KIRIMAN_AMOUNT_COUNT: row.Jumlah_Kiriman,
    L_CURRENT_SHIPPING_VENDOR: row.Jasa_Pengiriman,
    L_CUSTOMER_COMPANY_INDUSTRI_TYPE: row.Jenis_Industri,
    L_TYPE_OF_NEED: JSON.parse(row.Jenis_Kebutuhan_Array),
    L_OMZET_ESTIMATION: row.Estimasi_Omset,
    L_JANGKA_PEMBAYARAN: row.Jangka_Pembayaran,
    L_PAYMENT_METHOD: row.Metode_Pembayaran,
    L_ISHAVE_TRAVEL_DOCUMENT: row.Travel_Document,
    L_ADDITIONAL_NOTES: row.Catatan,
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
  getListData(API.getAllLeads, index, pSize || pageSize.value, search.value, filterData.value);
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
  saveAdd(() => firstload(), API.apiDealsLeadsInsert);
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
  filterData.value.USER_ID = null;
  filterData.value.ROLE = role.value;
  filterData.value.GROUP_ID = groupValue.value;
  applyFilter();
}

watch(filterPipeline, (val) => {
  if (isInit.value) {
    isInit.value = false;
    return;
  }
  filterData.value.status = val;
  changePage(1);
});
watch(filterPipeline, (val) => {
  if (isInit.value) return;

  filterData.value.status = val;
  changePage(1);
});

const q = ref('');
const showFilter = ref(false);

let searchTimeout;

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

//pengecekan status follow up
const hasProposalHarga = () => {
  if (!viewFollowUpData.value?.History_FollowUp) return false;

  return viewFollowUpData.value.History_FollowUp.includes('LEADS-PROPOSAL HARGA');
};
const hasClosing = () => {
  if (!viewFollowUpData.value?.History_FollowUp) return false;

  return viewFollowUpData.value.History_FollowUp.includes('LEADS-TTD KONTRAK');
};
const hasTeknis = () => {
  if (!viewFollowUpData.value?.History_FollowUp) return false;

  return viewFollowUpData.value.History_FollowUp.includes('LEADS-TEKNIS');
};

const hasKiriman = () => {
  if (!viewFollowUpData.value?.Jenis_Kebutuhan) return false;

  return viewFollowUpData.value.Jenis_Kebutuhan.includes('Kirim Paket');
};

const hasSewaArmada = () => {
  if (!viewFollowUpData.value?.Jenis_Kebutuhan) return false;

  return viewFollowUpData.value.Jenis_Kebutuhan.includes('Sewa Armada');
};

const hasLepasKunci = () => {
  if (!viewFollowUpData.value?.jenis_sewa_armada) return false;

  return viewFollowUpData.value.jenis_sewa_armada.includes('Lepas_Kunci');
};
const hasFTL = () => {
  if (!viewFollowUpData.value?.jenis_sewa_armada) return false;

  return viewFollowUpData.value.jenis_sewa_armada.includes('FTL');
};
const hasUnitDriver = () => {
  if (!viewFollowUpData.value?.jenis_sewa_armada) return false;

  return viewFollowUpData.value.jenis_sewa_armada.includes('Unit_Driver');
};
const hasAllIn = () => {
  if (!viewFollowUpData.value?.jenis_sewa_armada) return false;

  return viewFollowUpData.value.jenis_sewa_armada.includes('AllIn');
};

//unutk generate surat pengiriman
const genSuratKiriman = () => {
  generateSuratPengiriman(viewFollowUpData.value);
};

//untuk form data customer closing
const genFormCustomer = () => {
  generateFormCustomer(viewFollowUpData.value);
};

const genInfoCustomer = () => {
  generateInfoCustomer(viewFollowUpData.value);
};
const genSuratSewaArmadaLk = () => {
    generateSuratSewaArmadaLk(viewFollowUpData.value);
};

const genSuratSewaArmadaFtl = () => {
    generateSuratSewaArmadaFtl(viewFollowUpData.value);
};

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
