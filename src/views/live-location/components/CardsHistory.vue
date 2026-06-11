<template>
    <div class="space-y-6 mb-3">
        <!-- Group -->
        <div v-for="(items, groupKey) in groupedLocations" :key="groupKey"
            class="bg-white rounded-lg shadow-md overflow-hidden">
            <!-- Group Header -->
            <div class="px-6 py-4 bg-gray-100 border-b cursor-pointer" :class="{ 'font-bold bg-green-100': items[0].LIVE_LOCATION_BY_USERCODE === $store.getters.userId }" @click="onViewDialog(groupKey)">
                <div class="md:flex justify-between items-center">
                    <h3 class="font-bold text-gray-800">
                        {{ getPeriodCheck(items) }}
                    </h3>
                    <h3 :class="{ 'font-bold text-blue-600': items[0].LIVE_LOCATION_BY_USERCODE === $store.getters.userId }">{{ items[0].LIVE_LOCATION_BY_USERCODE === $store.getters.userId ? 'Live Location Milikmu' : getUsername(items) }}</h3>
                </div>
            </div>

            <!-- Group Items -->
            <div class="divide-y">
                <div v-for="(item, index) in items" :key="index" class="px-6 py-2">
                    <div class="flex justify-between items-start">
                        <div>
                            <!-- Content -->
                            <div class="flex-1">
                                <p class="text-md font-bold mb-1">
                                    {{ timeFormat(item.LIVE_LOCATION_CHECK_DATETIME) }}
                                </p>

                                <p class="text-gray-800 font-medium mb-1 text-xs md:text-sm">
                                    {{ item.LIVE_LOCATION_ADDRESS }}
                                </p>
                            </div>
                        </div>
                        <div class="flex justify-end">
                            <!-- Indicator -->
                            <div class="w-[100px] text-end mt-1">
                                <span class="px-3 py-1 rounded-full text-xs font-semibold" :class="item.LIVE_LOCATION_CHECK_STAGE === 'CHECK_IN'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-red-100 text-red-700'">
                                    {{ item.LIVE_LOCATION_CHECK_STAGE.replace(/\_/g, ' ') }}
                                </span>
                            </div>
                        </div>
                    </div>
                    <p v-if="item.LIVE_LOCATION_REMARKS"
                        class="bg-gray-100 p-2 rounded-lg border-l-4 border-gray-300 text-sm text-gray-600 mt-1 italic md:text-sm">
                        {{ item.LIVE_LOCATION_REMARKS }}
                    </p>
                </div>
            </div>
        </div>

        <!-- Empty -->
        <div v-if="!Object.keys(groupedLocations).length" class="text-center text-gray-500 py-12">
            Tidak ada data live location
        </div>

        <!-- detail -->
         <el-dialog v-model="viewDialog" :width="dialogWidth()" :label-position="labelPosition()" destroy-on-close>
            <template #header>
                <h1 class="border-b">Detail Live Location</h1>
            </template>
            <div class="grid md:grid-cols-2 grid-cols-1 gap-4">
                <div v-if="viewData.LIVE_LOCATION_TRACKING && viewData.LIVE_LOCATION_TRACKING?.length > 0">
                    <leaflet-mark
                    v-model:lat="viewData.LIVE_LOCATION_TIMELINE[0].LIVE_LOCATION_LATITUDE"
                    v-model:long="viewData.LIVE_LOCATION_TIMELINE[0].LIVE_LOCATION_LONGITUDE"
                    v-model:polyline="viewData.LIVE_LOCATION_TRACKING" readonly />
                </div>
                <el-timeline style="max-width: 600px" size="large">
                    <el-timeline-item v-for="(timeline, index) in viewData.LIVE_LOCATION_TIMELINE" :key="index" :timestamp="timeFormat(timeline.LIVE_LOCATION_CHECK_DATETIME)" :type="timeline.LIVE_LOCATION_CHECK_STAGE == 'CHECK_IN' ? 'warning' : timeline.LIVE_LOCATION_CHECK_STAGE == 'CHECK_OUT' ? 'danger' : 'info'" placement="bottom">
                      <el-card>
                        <div class="w-full flex justify-between">
                            <div>
                                <h4> <span class="font-bold">{{ timeline.LIVE_LOCATION_CHECK_STAGE.replace(/\_/g, ' ') }}</span> {{dateFormatFull(timeline.LIVE_LOCATION_CHECK_DATETIME)}}</h4>
                                <p>{{ timeline.LIVE_LOCATION_REMARKS }}</p>
                            </div>
                            <div v-if="timeline.liveLocationPhoto">
                                <image-preview :imageUrl="timeline.liveLocationPhoto"></image-preview>
                            </div>
                        </div>
                      </el-card>
                    </el-timeline-item>
                </el-timeline>
            </div>
         </el-dialog>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { dateFormatFull, dateFormatShort, timeFormat } from '../../../helper/utils'
import HOOKS from '../../../hooks/bundleOneOps'
import API from '../../../api/apiLiveLocation'
import {dialogWidth, labelPosition} from '../../../helper/appUtils'

const [detail, getDetail] = HOOKS.useGetData()
const {viewData, viewDialog, closeView, openViewDialog} = HOOKS.useViewOneData()

let id = null
function onViewDialog(LIVE_LOCATION_GROUP) {
    if(id != LIVE_LOCATION_GROUP) {
        id = LIVE_LOCATION_GROUP
        getDetail(() => API.apiGetLiveLocationDetail({LIVE_LOCATION_GROUP: LIVE_LOCATION_GROUP}), true,true,(d) => {
            openViewDialog(d)
        })
        return
    }
    openViewDialog(detail.value)
}

function getPeriodCheck(items) {
    let period = ''
    if (items.length > 0) {
        const firstItem = items[0]
        const lastItem = items[items.length - 1]
        period = `${dateFormatShort(lastItem.LIVE_LOCATION_CHECK_DATETIME)} ${timeFormat(lastItem.LIVE_LOCATION_CHECK_DATETIME)} - ${timeFormat(firstItem.LIVE_LOCATION_CHECK_DATETIME)}`
    }
    return period
}

function getUsername(items) {
    let name = ''
    if (items.length > 0) {
        const firstItem = items[0]
        const lastItem = items[items.length - 1]
        name = `${firstItem.LIVE_LOCATION_BY_USERCODE} - ${firstItem.LIVE_LOCATION_BY_USERNAME}`
    }
    return name
}

/**
 * Props:
 * locations: array of LIVE_LOCATION data
 */
const props = defineProps({
    locations: {
        type: Array,
        required: true
    }
})

/**
 * Grouping berdasarkan LIVE_LOCATION_GROUP
 */
const groupedLocations = computed(() => {
    return props.locations.reduce((groups, item) => {
        const key = item.LIVE_LOCATION_GROUP
        if (!groups[key]) {
            groups[key] = []
        }
        groups[key].push(item)
        return groups
    }, {})
})
</script>
