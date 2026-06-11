<template>
  <div>
    <!-- 
      🔍 SEARCH BAR - Cari lokasi dengan mengetik nama tempat
      Contoh: ketik "Bandung" lalu Enter atau pilih dari dropdown
    -->
    <div class="search-container mb-3">
      <el-input v-model="searchQuery" placeholder="Cari lokasi..." clearable
        @input="onSearchInput">
        <template #prefix>
          <el-icon>
            <Search />
          </el-icon>
        </template>
      </el-input>


      <!-- Search Results Dropdown -->
      <div v-if="searchResults.length > 0" class="search-results">
        <div v-for="(result, index) in searchResults" :key="index" class="search-result-item"
          @click="selectSearchResult(result)">
          <el-icon class="mr-2">
            <Location />
          </el-icon>
          <span>{{ result.display_name }}</span>
        </div>
      </div>

      <!-- Search Error -->
      <div v-if="searchError" class="text-red-500 text-xs mt-1">
        {{ searchError }}
      </div>
    </div>

    <!-- 
      PETA DENGAN MARKER YANG BISA DIGESER
      Seperti aplikasi Gojek/Grab - pin bisa digeser ke lokasi yang benar
    -->
    <l-map style="max-height: 40vh; height: 400px;" :zoom="zoom" :center="markerPosition">
      <l-tile-layer :url="url" />

      <!-- MARKER YANG BISA DIGESER (DRAGGABLE) -->
      <l-marker :lat-lng="markerPosition" :draggable="true" @dragend="handleMarkerDrag" />
    </l-map>

    <!-- STATUS & INSTRUKSI -->
    <div class="mt-2 text-sm">
      <!-- Loading -->
      <div v-if="locating" class="text-blue-600 flex items-center">
        <span class="animate-spin mr-2">⏳</span>
        Mendeteksi lokasi... ({{ loadingMessage }})
      </div>

      <!-- Error -->
      <div v-if="locerr" class="text-orange-600">
        ⚠️ {{ locerr }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import 'leaflet/dist/leaflet.css'
import { LMap, LTileLayer, LMarker } from '@vue-leaflet/vue-leaflet'
import { Icon } from 'leaflet'
import { Search, Location } from '@element-plus/icons-vue'
import { getAddress } from '../../helper/utils'

// Fix leaflet marker icon
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

if (Icon && Icon.Default) {
  Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow
  })
}
let searchTimeout = null

/* ================= PROPS & EMIT ================= */
const props = defineProps(['long', 'lat', 'time', 'address', 'googleMap'])
const emit = defineEmits(['located', 'update:long', 'update:lat', 'update:address', 'update:addressData', 'update:googleMap'])

/* ================= STATE ================= */
const locating = ref(false)
const locerr = ref(null)
const loadingMessage = ref('')

const url = ref('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
const zoom = ref(17) // Lebih zoom untuk detail

// Posisi marker (bisa dari GPS atau dari user drag)
const markerPosition = ref([0, 0])

// 🔍 SEARCH STATE
const searchQuery = ref('')
const searchResults = ref([])
const searching = ref(false)
const searchError = ref('')
async function fetchAddressForPosition(lat, lng) {
  try {
    const data = await getAddress({ latitude: lat, longitude: lng })
    if (data && data?.length > 0) {
      emit('update:address', data[0].display_name)
      emit('update:addressData', data[0].address)
    }
  } catch (error) {
    console.error('Error fetching address:', error)
  }
}

/**
 * Handler saat marker selesai digeser
 * Ini fungsi utama untuk "koreksi manual" lokasi
 */
function handleMarkerDrag(event) {
  const { lat, lng } = event.target.getLatLng()

  // Update posisi marker
  markerPosition.value = [lat, lng]

  // Emit koordinat baru
  emit('update:lat', lat)
  emit('update:long', lng)
  emit('update:googleMap', `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`)

  // Ambil alamat baru untuk posisi yang digeser
  fetchAddressForPosition(lat, lng)
}

/**
 * Strategi lokasi bertingkat:
 * 1. Coba HIGH ACCURACY dulu (GPS asli) - timeout 5 detik
 * 2. Jika gagal/lama, fallback ke LOW ACCURACY (WiFi/IP) - lebih cepat
 * 3. Jika semua gagal, default ke Jakarta dan minta user geser manual
 */
async function locateWithFallback() {
  locating.value = true
  locerr.value = null

  // TAHAP 1: Coba GPS akurasi tinggi (5 detik)
  loadingMessage.value = 'Mencari GPS...'
  try {
    const pos = await getLocationWithTimeout(true, 10000)
    applyPosition(pos)
    return
  } catch (e) {
    console.error(e);
    // // console.log('High accuracy failed, trying low accuracy...')
  }

  // TAHAP 2: Fallback ke akurasi rendah (lebih cepat, tapi kurang akurat)
  loadingMessage.value = 'Menggunakan lokasi perkiraan...'
  try {
    const pos = await getLocationWithTimeout(false, 10000)
    applyPosition(pos)
    locerr.value = 'Lokasi mungkin kurang akurat. Geser pin jika perlu.'
    return
  } catch (e) {
    console.error(e);
    // // console.log('Low accuracy also failed')
  }

  // TAHAP 3: Semua gagal - default ke Jakarta
  loadingMessage.value = ''
  locating.value = false

  // Default ke Monas, Jakarta sebagai titik awal
  markerPosition.value = [-6.1754, 106.8272]
  locerr.value = 'Tidak bisa mendeteksi lokasi. Silakan geser pin ke lokasi Anda.'

  emit('update:lat', markerPosition.value[0])
  emit('update:long', markerPosition.value[1])
  emit('update:googleMap', `https://www.google.com/maps/search/?api=1&query=${markerPosition.value[0]},${markerPosition.value[1]}`)
  fetchAddressForPosition(markerPosition.value[0], markerPosition.value[1])
}

function onSearchInput() {
  searchError.value = ''

  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }

  // Jika input kosong → reset
  if (!searchQuery.value.trim()) {
    searchResults.value = []
    return
  }

  // Debounce 500ms
  searchTimeout = setTimeout(() => {
    searchLocation()
  }, 500)
}


/**
 * Apply position dari GPS ke state
 */
function applyPosition(pos) {
  const lat = pos.coords.latitude
  const lng = pos.coords.longitude

  markerPosition.value = [lat, lng]

  emit('update:lat', lat)
  emit('update:long', lng)
  emit('update:googleMap', `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`)
  emit('update:time', new Date(pos.timestamp).toISOString())
  emit('located', pos)

  locating.value = false

  // // console.log(lat, lng, pos);


  fetchAddressForPosition(lat, lng)
}

/**
 * Helper: Get location dengan timeout
 * @param {boolean} highAccuracy - true untuk GPS, false untuk WiFi/IP
 * @param {number} timeout - timeout dalam ms
 */
function getLocationWithTimeout(highAccuracy, timeout) {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(new Error('Geolocation tidak tersedia'))
      return
    }

    const options = {
      enableHighAccuracy: highAccuracy,
      timeout: timeout,
      maximumAge: highAccuracy ? 0 : 60000 // Cache 1 menit untuk low accuracy
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, options)
  })
}
async function searchLocation() {
  if (searchQuery.value.trim().length < 3) {
    searchResults.value = []
    return
  }

  searching.value = true
  searchResults.value = []

  try {
    const query = encodeURIComponent(searchQuery.value + ', Indonesia')
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=5&addressdetails=1`
    )

    const data = await response.json()
    searchResults.value = data || []
  } catch (error) {
    searchError.value = 'Gagal mencari lokasi'
  } finally {
    searching.value = false
  }
}


/**
 * Pilih hasil pencarian dan pindahkan peta ke lokasi tersebut
 * @param {Object} result 
 */
function selectSearchResult(result) {
  const lat = parseFloat(result.lat)
  const lng = parseFloat(result.lon)

  // Pindahkan marker ke lokasi yang dipilih
  markerPosition.value = [lat, lng]

  // Emit koordinat baru
  emit('update:lat', lat)
  emit('update:long', lng)

  emit('update:googleMap', `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`)

  // Set alamat dari hasil pencarian
  emit('update:address', result.display_name)

  // Emit address data jika ada
  if (result.address) {
    emit('update:addressData', result.address)
  }

  // Bersihkan hasil pencarian
  searchResults.value = []
  searchQuery.value = ''

  // Clear any location error
  locerr.value = null
}

/* ================= LIFECYCLE ================= */
onMounted(() => {
  locateWithFallback()
})

</script>

<style scoped>
/* 🔍 Search Bar Styling */
.search-container {
  position: relative;
}

.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  max-height: 250px;
  overflow-y: auto;
  margin-top: 4px;
}

.search-result-item {
  display: flex;
  align-items: flex-start;
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
  font-size: 13px;
  line-height: 1.4;
  transition: background-color 0.2s;
}

.search-result-item:last-child {
  border-bottom: none;
}

.search-result-item:hover {
  background-color: #f5f7fa;
}

.search-result-item .el-icon {
  color: #409eff;
  flex-shrink: 0;
  margin-top: 2px;
}

/* Animasi loading */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
