<template>
  <div class="leaflet-wrapper">
    <!-- RENDER MAP HANYA JIKA CENTER VALID -->
    <l-map
      v-if="center"
      :key="mapKey"
      :style="{ height: mapHeight }"
      :zoom="zoom"
      :center="center"
      :use-global-leaflet="false"
    >
      <l-tile-layer :url="url" />

      <!-- POLYLINE (LIVE TRACKING) -->
      <l-polyline
        v-if="polyline && polyline.length > 1"
        :lat-lngs="polyline"
        color="#409EFF"
        :weight="6"
      />

      <!-- CURRENT MARKER -->
      <!-- <l-marker v-if="polyline && polyline.length > 1" :lat-lng="props.polyline[polyline.length - 1]" /> -->
      <l-marker :lat-lng="center" />
    </l-map>

    <!-- STATUS -->
    <div class="map-status">
      <div v-if="locerr" class="error">
        {{ locerr }}
      </div>
      <div v-else-if="locating">
        <i>Mengambil lokasi...</i>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import 'leaflet/dist/leaflet.css'
import { LMap, LTileLayer, LMarker, LPolyline } from '@vue-leaflet/vue-leaflet'
import { Icon } from 'leaflet'
import { getAddress } from '../../helper/utils'
import { AddLocation } from '@element-plus/icons-vue'

/* ================= LEAFLET ICON FIX ================= */

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow
})

/* ================= PROPS ================= */

const props = defineProps({
  lat: Number,
  long: Number,
  time: String,
  address: String,

  polyline: {
    type: Array,
    default: () => []
  },
  readonly: {
    type: Boolean,
    default: false
  },
  height: {
    type: [String, Number],
    default: '60vh'
  }
})

const emit = defineEmits([
  'located',
  'update:lat',
  'update:long',
  'update:time',
  'update:address'
])

/* ================= STATE ================= */

const locating = ref(false)
const locerr = ref(null)
const location = ref(null)

const zoom = ref(16)
const url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'

/* ================= COMPUTED ================= */

const mapHeight = computed(() =>
  typeof props.height === 'number'
    ? `${props.height}px`
    : props.height
)

/**
 * CENTER HARUS NULL JIKA DATA BELUM SIAP
 * (INI KUNCI AGAR LEAFLET TIDAK BLANK)
 */
const center = computed(() => {
  if (props.lat && props.long) {
    return [props.lat, props.long]
  }
  if (location.value?.coords) {
    return [
      location.value.coords.latitude,
      location.value.coords.longitude
    ]
  }
  return null
})

/**
 * KEY UNTUK FORCE REMOUNT SAAT DATA DATANG
 */
const mapKey = computed(() => {
  if (!center.value) return 'empty'
  return `${center.value[0]}-${center.value[1]}-${props.polyline?.length || 0}`
})

/* ================= GEOLOCATION ================= */

function getLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation tidak tersedia'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      resolve,
      reject,
      { enableHighAccuracy: true }
    )
  })
}

async function locate() {
  if (props.readonly) return

  locating.value = true
  locerr.value = null

  try {
    const pos = await getLocation()
    location.value = pos

    emit('update:lat', pos.coords.latitude)
    emit('update:long', pos.coords.longitude)
    emit('update:time', new Date(pos.timestamp).toISOString())
    emit('located', pos)

    const addr = await getAddress(pos.coords)
    emit('update:address', addr?.[0]?.display_name)
  } catch (e) {
    locerr.value = e.message || String(e)
  } finally {
    locating.value = false
  }
}

/* ================= WATCH ================= */

/**
 * JIKA DATA DARI PARENT DATANG TERLAMBAT
 * → UPDATE LOCATION AGAR CENTER VALID
 */
watch(
  () => [props.lat, props.long],
  async ([lat, lng]) => {
    if (!lat || !lng) return

    location.value = {
      coords: {
        latitude: lat,
        longitude: lng
      }
    }

    await nextTick()
  },
  { immediate: true }
)

/* ================= LIFECYCLE ================= */

onMounted(() => {
  locate()
})
</script>

<style scoped>
.leaflet-wrapper {
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
}

.map-status {
  margin-top: 6px;
  font-size: 13px;
}

.error {
  color: #f56c6c;
}

/* Custom Marker Styling */
.custom-marker {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 2px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 11px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.3);
  transition: all 0.2s ease;
  cursor: pointer;
}

.custom-marker.hovered {
  width: 32px;
  height: 32px;
  font-size: 14px;
  border-width: 3px;
  box-shadow: 0 3px 8px rgba(0,0,0,0.4);
}
</style>
