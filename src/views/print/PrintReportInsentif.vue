<template>
    <div>
        <el-container v-if="isFound" class="print-page">
            <div class="header">
                <div id="logo">
                    <div>
                        <h1>Wahana Prestasi Logistik</h1>
                        <p>CRM</p>
                    </div>
                </div>
                <div id="title">
                    <h1>Laporan Insentif</h1>
                     <!-- <div class="flex gap-3 justify-center">
                        <p v-for="(filter, idx) in Object.values($route.query)" :key="idx">{{ filter }}</p>
                    </div> -->
                </div>
                <div class="tbl-header">
                    <div style="width: 4%">No.</div>
                    <div style="width: 18%">Nama</div>
                    <div style="width: 9%">Invoice Dibuat</div>
                    <div class="text-right" style="width: 11%">Percentage</div>
                    <div class="text-right" style="width: 14.5%">Nominal</div>
                    <div class="text-right" style="width: 14.5%">Ongkir</div>
                    <div class="text-right" style="width: 14.5%">pph21</div>
                    <div class="text-right" style="width: 14.5%">Hasil</div>
                </div>
            </div>
            <div class="footer">
                <p>Created by: {{ $store.getters.userName }}</p>
                <p>{{ dateFormatFull() }}</p>
            </div>
            <div class="body">
                <div class="tbl-body" v-for="(item, idx) in groupByCustomerWithSummary(printData.body)" :key="idx">
                    {{ setTotals() }}
                    <div class="tbr bg-blue-100">
                        <div style="width: 4%"></div>
                        <div style="width: 96%">
                            <b>{{ item.customer }}</b>
                        </div>
                    </div>
                    <!-- {
	"0": {
		"Account Bulan ke": 4,
		"Claim": "0",
		"Discount": "10",
		"ID Account": "25088081",
		"Insentif %": "5",
		"Jenis Invoice": null,
		"No Invoice": "IVC-2512-C00003EJKY47",
		"No TTK": "BGV61670",
		"Nominal Insentif": 6860,
		"Nominal Ongkir": 7000,
		"PPH": 140,
		"Periode Penagihan Invoice": "2025-11-01 - 2025-11-30",
		"Sales": "38221968: Ani Setiyawati",
		"Tanggal Invoice Dibuat": "2025-12-13",
		"Tanggal Pembayaran Invoice": "2026-01-12",
		"Tanggal TTK": "2025-11-11",
		"customer": "PT Prime Link Communication",
		"termuda": "2025-11-11 00:00:00",
		"total_insentif_hasil": 343
	}
} -->
                    <div class="tbr" v-for="(line, key) in item.items" v-bind:key="key">
                        <div style="width: 4%">{{ key + 1 }}</div>
                        <div style="width: 18%">
                            {{ line.Sales }}
                        </div>
                        <div style="width: 9%">
                            {{ line['Tanggal Invoice Dibuat'] ? dateFormatShort(line['Tanggal Invoice Dibuat']) : '-' }}
                        </div>
                        <div class="text-right" style="width: 11%">{{ line['Insentif %'] ? line['Insentif %'] + '%' : '-' }}</div>
                        <div class="text-right" style="width: 14.5%">
                            {{ parseFloat(line['Nominal Insentif']) ? convertToTreeDigit(sumTotal(line['Nominal Insentif']))
                            : 0 }}
                        </div>
                        <div class="text-right" style="width: 14.5%">
                            {{ parseFloat(line['Nominal Ongkir']) ?
                                convertToTreeDigit(sumDiscount(line['Nominal Ongkir'])) : 0 }}
                        </div>
                        <div class="text-right" style="width: 14.5%">
                            {{ parseFloat(line.PPH) ? convertToTreeDigit(sumVat(line.PPH)) : 0
                            }}
                        </div>
                        <div class="text-right" style="width: 14.5%">
                            {{ parseFloat(line.total_insentif_hasil) ?
                                convertToTreeDigit(sumNetto(line.total_insentif_hasil)) : 0 }}
                        </div>
                    </div>
                    <div class="tbr bg-yellow-400">
                        <div style="width: 4%"></div>
                        <div style="width: 27%"> <b>{{ item.customer }} :</b></div>
                        <div style="width: 11%; border-top: 1px solid black">Total</div>
                        <div class="text-right" style="width: 14.5%; border-top: 1px solid black">
                            {{ convertToTreeDigit(getTotal()) }}
                        </div>
                        <div class="text-right" style="width: 14.5%; border-top: 1px solid black">
                            {{ convertToTreeDigit(getDiscount()) }}
                        </div>
                        <div class="text-right" style="width: 14.5%; border-top: 1px solid black">
                            {{ convertToTreeDigit(getVat()) }}
                        </div>
                        <div class="text-right" style="width: 14.5%; border-top: 1px solid black">
                            {{ convertToTreeDigit(getNetto()) }}
                        </div>
                    </div>
                    <!-- <div style="page-break-before: always"></div> -->
                </div>
            </div>
        </el-container>
        <div v-else class="bg w-full h-screen flex items-center justify-center" v-loading="printDataLoading">
            <PrintNotFound />
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import HOOKS from '../../hooks/bundleOneOps';
import { dateFormatShort, dateFormatFull, convertToTreeDigit } from '../../helper/utils';

//init API
import API from '../../api/apiReport';

import { isFound, filterData, getData, printData, getPrintData, printDataLoading } from '../../helper/printFn';

const route = useRoute()

function groupByCustomerWithSummary(data) {
  return data?.reduce((acc, item) => {
    const customer = item.customer;

    if (!acc[customer]) {
      acc[customer] = {
        customer: customer,
        items: [],
        total_insentif_hasil: 0,
        total_nominal_insentif: 0,
        total_pph: 0
      };
    }

    acc[customer].items.push(item);
    acc[customer].total_insentif_hasil += Number(item.total_insentif_hasil || 0);
    acc[customer].total_nominal_insentif += Number(item["Nominal Insentif"] || 0);
    acc[customer].total_pph += Number(item.PPH || 0);

    return acc;
  }, {});
}

function firstload() {
    if (route.query.since && route.query.until) {
        getData(() => API.getDataInsentifForReport(route.query), 'Laporan Intensif');
    }
}

let total = 0;
let discount = 0;
let vat = 0;
let netto = 0;

function setTotals() {
  total = 0;
  discount = 0;
  vat = 0;
  netto = 0;
}

function sumTotal(val) {
  total += val;
  return val;
}

function sumDiscount(val) {
  discount += val;
  return val;
}

function sumVat(val) {
  vat += val;
  return val;
}

function sumNetto(val) {
  netto += val;
  return val;
}

function getTotal() {
  return total;
}

function getDiscount() {
  return discount;
}

function getVat() {
  return vat;
}

function getNetto() {
  return netto;
}

//execute only on first load
firstload();
</script>

<style scoped>
@import '../../assets/css/print.css';

@page {
    size: A4 landscape;
}
</style>