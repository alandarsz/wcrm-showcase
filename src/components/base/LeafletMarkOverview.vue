<template>
  <div class="w-full h-[80vh] flex flex-col bg-gray-50">
    <!-- Header & Controls -->
    <div class="bg-white shadow-sm p-4 z-10">
      <div class="max-w-7xl mx-auto">

        <!-- Legend -->
        <div class="flex items-center gap-4 flex-wrap text-sm">
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-green-500"></span>
            <span class="text-gray-600">Check In</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-red-500"></span>
            <span class="text-gray-600">Check Out</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Map Container -->
    <div class="flex-1 relative">
      <l-map 
        ref="map"
        :zoom="zoom" 
        :center="mapCenter"
        :options="{ zoomControl: true }"
        class="w-full h-full"
        @ready="onMapReady"
      >
        <l-tile-layer :url="tileUrl" />

        <!-- Render routes for each group -->
        <template v-for="(group, groupKey) in displayedGroups" :key="groupKey">
          <!-- Polyline untuk rute -->
          <l-polyline 
            :lat-lngs="getRouteCoordinates(group)"
            :color="getGroupColor(groupKey)"
            :weight="3"
            :opacity="0.7"
          />

          <!-- Markers untuk setiap titik dengan custom icon berisi nomor -->
          <l-marker
            v-for="(point, idx) in group"
            :key="`marker-${groupKey}-${idx}`"
            :lat-lng="[point.LIVE_LOCATION_LATITUDE, point.LIVE_LOCATION_LONGITUDE]"
            @mouseover="hoveredPoint = `${groupKey}-${idx}`"
            @mouseout="hoveredPoint = null"
          >
            <l-icon
              :icon-size="hoveredPoint === `${groupKey}-${idx}` ? [32, 32] : [26, 26]"
              :icon-anchor="hoveredPoint === `${groupKey}-${idx}` ? [16, 16] : [13, 13]"
            >
              <div 
                class="custom-marker"
                :class="{ 'hovered': hoveredPoint === `${groupKey}-${idx}` }"
                :style="{
                  backgroundColor: getStageColor(point.LIVE_LOCATION_CHECK_STAGE),
                  marginLeft: point.LIVE_LOCATION_CHECK_STAGE == 'CHECK_IN' ? '15px' : '0px'
                }"
              >
                <span>{{ point.GROUP_ROW_NUMBER }}</span>
              </div>
            </l-icon>

            <l-popup :options="{ maxWidth: 350 }">
              <div class="p-2">
                <div class="mb-2">
                  <span class="text-2xl">{{ getStageIcon(point.LIVE_LOCATION_CHECK_STAGE) }}</span>
                  <span class="font-bold text-gray-800">{{ point.LIVE_LOCATION_CHECK_STAGE }}</span>
                  <p class="text-md font-semibold">PIC : {{ point.LIVE_LOCATION_CREATE_BY }}</p>
                </div>
                
                <div class="text-sm">
                  <div class="flex justify-between items-center">
                    <span class="font-semibold text-gray-700">Nomor:</span>
                    <span class="text-2xl text-end">{{ point.GROUP_ROW_NUMBER }}</span>
                  </div>
                  <div>
                    <span class="font-semibold text-gray-700">Waktu:</span>
                    <span class="text-gray-600 ml-1">{{ dateFormatFull(point.LIVE_LOCATION_CHECK_DATETIME) }}</span>
                  </div>
                  
                  <div>
                    <span class="font-semibold text-gray-700">Lokasi:</span>
                    <p class="text-gray-600 mt-1">{{ point.LIVE_LOCATION_ADDRESS }}</p>
                  </div>
                  
                  <div>
                    <span class="font-semibold text-gray-700">Koordinat:</span>
                    <span class="text-gray-600 ml-1">
                      {{ point.LIVE_LOCATION_LATITUDE.toFixed(6) }}, {{ point.LIVE_LOCATION_LONGITUDE.toFixed(6) }}
                    </span>
                  </div>
                  
                  <div v-if="point.LIVE_LOCATION_REMARKS">
                    <span class="font-semibold text-gray-700">Catatan:</span>
                    <span class="text-gray-600 ml-1">{{ point.LIVE_LOCATION_REMARKS }}</span>
                  </div>

                  <div class="border-t border-gray-200">
                    <span class="text-xs text-gray-500">Group: {{ groupKey }}</span>
                  </div>
                </div>
              </div>
            </l-popup>
          </l-marker>
        </template>
      </l-map>

      <!-- Info Card when hovering -->
      <transition name="fade">
        <div 
          v-if="hoveredPoint && getHoveredPointData()" 
          class="absolute bottom-4 left-4 bg-white rounded-lg shadow-xl p-4 max-w-md z-[1000] pointer-events-none"
        >
          <div class="flex items-center gap-2 mb-2">
            <span class="text-2xl">{{ getHoveredPointData().GROUP_ROW_NUMBER }}</span>
            <span class="text-xl">{{ getStageIcon(getHoveredPointData().LIVE_LOCATION_CHECK_STAGE) }}</span>
            <span class="font-bold text-gray-800">{{ getHoveredPointData().LIVE_LOCATION_CHECK_STAGE }}</span>
          </div>
          <div class="text-sm text-gray-600">
            <div class="font-semibold">{{ dateFormatFull(getHoveredPointData().LIVE_LOCATION_CHECK_DATETIME) }}</div>
            <div class="mt-1 line-clamp-2">{{ getHoveredPointData().LIVE_LOCATION_ADDRESS }}</div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import 'leaflet/dist/leaflet.css'
import { LMap, LTileLayer, LPolyline, LCircleMarker, LPopup, LMarker, LIcon } from '@vue-leaflet/vue-leaflet'
import L from 'leaflet'
import { dateFormatShort, dateFormatFull } from '../../helper/utils'

// Props
const props = defineProps({
  locationData: {
    type: Array,
    required: true
  }
})

// State
const map = ref(null)
const zoom = ref(12)
const mapCenter = ref([-6.2825, 106.7608])
const tileUrl = ref('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
const selectedGroup = ref('all')
const hoveredPoint = ref(null)

// Computed - Group data by LIVE_LOCATION_GROUP
const groupedData = computed(() => {
  const groups = {}
  props.locationData.forEach(point => {
    const getSomeDate = `${dateFormatShort(point.LIVE_LOCATION_CHECK_DATETIME)}-${point.ABAIDP}`
    
    if (!groups[getSomeDate]) {
      groups[getSomeDate] = []
    }
    groups[getSomeDate].push(point)
  })
  
  // Sort each group by datetime
  Object.keys(groups).forEach(key => {
    groups[key].sort((a, b) => 
      new Date(a.LIVE_LOCATION_CHECK_DATETIME) - new Date(b.LIVE_LOCATION_CHECK_DATETIME)
    )
  })
  
  return groups
})

// Computed - Display groups based on filter
const displayedGroups = computed(() => {
  if (selectedGroup.value === 'all') {
    return groupedData.value
  }
  return { [selectedGroup.value]: groupedData.value[selectedGroup.value] }
})

// Computed - Statistics
const totalPoints = computed(() => props.locationData.length)
const totalGroups = computed(() => Object.keys(groupedData.value).length)
const checkInCount = computed(() => 
  props.locationData.filter(p => p.LIVE_LOCATION_CHECK_STAGE === 'CHECK_IN').length
)
const checkOutCount = computed(() => 
  props.locationData.filter(p => p.LIVE_LOCATION_CHECK_STAGE === 'CHECK_OUT').length
)

// Methods
const getGroupColor = (groupKey) => {
  const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316']
  const idx = Object.keys(groupedData.value).indexOf(groupKey)
  return colors[idx % colors.length]
}

const getStageColor = (stage) => {
  switch(stage) {
    case 'CHECK_IN': return '#10b981'
    case 'CHECK_OUT': return '#ef4444'
    case 'TRACKING': return '#3b82f6'
    default: return '#6b7280'
  }
}

const getStageIcon = (stage) => {
  switch(stage) {
    case 'CHECK_IN': return '📍'
    case 'CHECK_OUT': return '🏁'
    case 'TRACKING': return '📌'
    default: return '•'
  }
}

const getRouteCoordinates = (group) => {
  return group.map(point => [point.LIVE_LOCATION_LATITUDE, point.LIVE_LOCATION_LONGITUDE])
}

const formatDateTime = (datetime) => {
  return new Date(datetime).toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

const formatGroupName = (groupKey) => {
  // Extract date from group key (e.g., LLC-20260115111714-50355)
  const match = groupKey.match(/(\d{8})/)
  if (match) {
    const dateStr = match[1]
    const year = dateStr.substring(0, 4)
    const month = dateStr.substring(4, 6)
    const day = dateStr.substring(6, 8)
    return `${day}/${month}/${year}`
  }
  return groupKey
}

const getHoveredPointData = () => {
  if (!hoveredPoint.value) return null
  
  const [groupKey, idx] = hoveredPoint.value.split('-')
  const group = displayedGroups.value[groupKey]
  return group ? group[parseInt(idx)] : null
}

const onMapReady = () => {
  // Auto-fit bounds to show all points
  if (props.locationData.length > 0) {
    const bounds = props.locationData.map(p => [p.LIVE_LOCATION_LATITUDE, p.LIVE_LOCATION_LONGITUDE])
    map.value.leafletObject.fitBounds(bounds, { padding: [50, 50] })
  }
}

onMounted(() => {
  // Set initial center if data exists
  if (props.locationData.length > 0) {
    const firstPoint = props.locationData[0]
    mapCenter.value = [firstPoint.LIVE_LOCATION_LATITUDE, firstPoint.LIVE_LOCATION_LONGITUDE]
  }
})
</script>

<style scoped>
:deep(.leaflet-div-icon) {
    border-radius: 100% !important;
    background-color: #3b82f6 !important;
    border: 2px solid white;
    color: white;
    font-weight: bold;
    font-size: 11px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.3);
    transition: all 0.2s ease;
    cursor: pointer;}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Custom Marker Styling */
.custom-marker {
  width: 26px;
  height: 26px;
  /* padding-left: 10px; */
  background: #ff4d4f;
  border: 2px solid white;
  border-radius: 50% 50% 50% 0;
  transform: rotate(-45deg);

  display: flex;
  align-items: center;
  justify-content: center;

  color: white;
  font-weight: bold;
  font-size: 11px;

  box-shadow: 0 2px 5px rgba(0,0,0,0.3);
  cursor: pointer;
  transition: all 0.2s ease;
}

.custom-marker span {
  transform: rotate(45deg);
}

.custom-marker.hovered {
  width: 32px;
  height: 32px;
  font-size: 14px;
  border-width: 3px;
  box-shadow: 0 3px 8px rgba(0,0,0,0.4);
}

/* Custom scrollbar for better UX */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>