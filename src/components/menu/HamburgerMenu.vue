<template>
  <nav class="relative">
    <!-- Toggle button -->
    <button
      @click="isOpen = !isOpen"
      :aria-expanded="isOpen"
      aria-label="Toggle menu"
      class="p-2 rounded-md focus:outline-none focus:ring focus:ring-offset-2 focus:ring-indigo-500"
    >
      <!-- hamburger / close icons -->
      <svg v-if="!isOpen" xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>

    <!-- Backdrop for mobile -->
    <div
      v-if="isOpen"
      @click="isOpen = false"
      class="fixed inset-0 bg-black/30 z-20 lg:hidden"
      aria-hidden="true"
    ></div>

    <!-- Menu panel -->
    <aside
      :class="['z-30 transform transition-transform duration-200 ease-in-out bg-white dark:bg-gray-800 shadow-lg w-64 lg:static lg:translate-x-0 fixed top-0 left-0 h-full overflow-auto',
               isOpen ? 'translate-x-0' : '-translate-x-full']"
      role="menu"
      aria-label="Main menu"
    >
      <div class="p-4 border-b dark:border-gray-700 flex items-center justify-between text-white">
        <h2 class="text-lg font-semibold dark:text-gray-200 text-gray-800">Menu</h2>
        <button @click="isOpen = false" class="lg:hidden p-1 rounded-md focus:outline-none bg-primary dark:bg-none">
          <span class="sr-only">Close</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <ul class="p-2 space-y-1">
        <li v-for="(menuGroup, idx) in menu" :key="menuGroup.id || idx" class="group">
          <!-- Header item -->
          <div
            class="flex items-center gap-2 p-2 rounded-md cursor-pointer select-none"
            :class="headerClasses(menuGroup)"
            @click="onHeaderClick(menuGroup)"
            role="menuitem"
            :aria-expanded="isHeaderExpanded(menuGroup)"
            tabindex="0"
            @keydown.enter.prevent="onHeaderClick(menuGroup)"
            @keydown.space.prevent="onHeaderClick(menuGroup)"
          >
            <span class="material-icons w-5 h-5 text-base">
              {{ getFirstIcon(menuGroup) }}
            </span>
            <span class="flex-1 text-sm font-medium truncate ml-1">{{ menuGroup.parentMenu }}</span>

            <!-- chevron if has children -->
            <svg v-if="hasChildren(menuGroup)" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 transition-transform" :class="isHeaderExpanded(menuGroup) ? 'rotate-90' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>

          <!-- children -->
          <ul v-if="hasChildren(menuGroup)" v-show="isHeaderExpanded(menuGroup)" class="mt-1 ml-8 space-y-1">
            <li
              v-for="(item, cidx) in menuGroup.items"
              :key="item.code + cidx"
              class="rounded-md"
            >
              <div
                @click="onChildClick(menuGroup, item)"
                role="menuitem"
                tabindex="0"
                @keydown.enter.prevent="onChildClick(menuGroup, item)"
                @keydown.space.prevent="onChildClick(menuGroup, item)"
                :class="childClasses(menuGroup, item)"
                class="p-2 text-sm cursor-pointer select-none truncate flex items-center gap-2"
              >
                <!-- <span class="material-icons text-sm">{{ item.icon }}</span> -->
                {{ item.name }}
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </aside>
  </nav>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'

const store = useStore()
const route = useRoute()
const router = useRouter()

// Ambil data dari Vuex store
const menuList = computed(() => store.getters.menuList)

// Data menu - bisa dari store atau hardcoded
const menu = ref([
  {
    "current_jabatan": "IT03",
    "id": 32,
    "items": [
      {
        "code": "PVwMonPickupFMitra",
        "icon": "analytics",
        "name": "Monitoring Pickup",
        "route": "{\"path\" : \"PVwMonPickupFMitra\"}",
        "type": "subMenu"
      },
      {
        "code": "monrvk",
        "icon": "analytics",
        "name": "Report Visit Kandel",
        "route": "{\"path\" : \"Reportvisitkandel\"}",
        "type": "subMenu"
      },
      {
        "code": "mon_ma_penerus",
        "icon": "analytics",
        "name": "MA Lintas Penerus",
        "route": "{\"path\" : \"PVwMonMAPenerus\"}",
        "type": "subMenu"
      },
      {
        "code": "trkPaket",
        "icon": "timeline",
        "name": "Telusuri Paket",
        "route": "{}",
        "type": "subMenu"
      }
    ],
    "parentMenu": "Monitoring"
  },
  {
    "current_jabatan": "IT03",
    "id": 1208,
    "items": [
      {
        "code": "orderReport",
        "icon": "article",
        "name": "Order Report",
        "route": "{\"path\" : \"/order-report\" }",
        "type": "subMenu"
      }
    ],
    "parentMenu": "Order"
  },
  {
    "current_jabatan": "IT03",
    "id": 837,
    "items": [
      {
        "code": "us-retur-tokped",
        "icon": "where_to_vote",
        "name": "US Retur Tokped",
        "route": "{\"name\" : \"PTrLdlUSReturTokpedNew\"}",
        "type": "subMenu"
      }
    ],
    "parentMenu": "Tokopedia"
  }
])

// Watch menuList dari store
watch(
  menuList,
  (newMenuList) => {
    if (newMenuList && newMenuList.length > 0) {
      menu.value = newMenuList
    }
  },
  { immediate: true }
)

// UI state
const isOpen = ref(false)
const expandedHeader = ref(null)
const currentPath = ref('')

// Initialize currentPath
if (route && route.path) {
  currentPath.value = normalizePath(route.path)
} else if (typeof window !== 'undefined') {
  currentPath.value = normalizePath(window.location.pathname.replace(/^\//, ''))
}

// Watch route changes
if (route && route.path) {
  watch(
    () => route.path,
    (p) => {
      currentPath.value = normalizePath(p)
    }
  )
}

// Helper functions
function normalizePath(p) {
  if (!p && p !== 0) return ''
  const s = String(p)
  return s.replace(/^\//, '').replace(/\/+$/, '')
}

function hasChildren(menuGroup) {
  return menuGroup.items && menuGroup.items.length > 1
}

function getFirstIcon(menuGroup) {
  if (menuGroup.items && menuGroup.items.length > 0) {
    return menuGroup.items[0].icon || 'dashboard'
  }
  return 'dashboard'
}

function isHeaderExpanded(menuGroup) {
  if (expandedHeader.value === menuGroup.parentMenu) return true
  
  if (hasChildren(menuGroup)) {
    return menuGroup.items.some((item) => {
      const itemPath = getItemPath(menuGroup, item)
      return normalizePath(itemPath) === normalizePath(currentPath.value)
    })
  }
  
  // Single menu check
  if (!hasChildren(menuGroup) && menuGroup.items && menuGroup.items.length === 1) {
    const singlePath = getSingleMenuPath(menuGroup)
    return normalizePath(singlePath) === normalizePath(currentPath.value)
  }
  
  return false
}

function getItemPath(menuGroup, item) {
  try {
    const routeConfig = JSON.parse(item.route || '{}')
    if (routeConfig.path) {
      return routeConfig.path
    }
    if (routeConfig.name) {
      return routeConfig.name
    }
  } catch (e) {
    console.error('Error parsing route:', e)
  }
  return ''
}

function getSingleMenuPath(menuGroup) {
  if (menuGroup.items && menuGroup.items.length === 1) {
    const item = menuGroup.items[0]
    try {
      const routeConfig = JSON.parse(item.route || '{}')
      if (routeConfig.path) {
        // Jika path sudah lengkap, gunakan langsung
        if (routeConfig.path.startsWith('/')) {
          return routeConfig.path
        }
        // Jika tidak, gabungkan dengan parentMenu
        return `/${normalizePath(routeConfig.path)}`
      }
    } catch (e) {
      console.error('Error parsing route:', e)
    }
  }
  return ''
}

function headerClasses(menuGroup) {
  const base = 'hover:bg-gray-100 dark:hover:bg-gray-700'
  const active = isHeaderExpanded(menuGroup)
  return [
    base,
    active ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-200' : 'text-gray-700 dark:text-gray-200',
  ]
}

function childClasses(menuGroup, item) {
  const itemPath = getItemPath(menuGroup, item)
  const active = normalizePath(itemPath) === normalizePath(currentPath.value)
  return active 
    ? 'bg-indigo-100 dark:bg-indigo-800/40 text-indigo-700 dark:text-indigo-200' 
    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
}

// Click handlers
function onHeaderClick(menuGroup) {
  if (hasChildren(menuGroup)) {
    // Toggle expanded header
    expandedHeader.value = expandedHeader.value === menuGroup.parentMenu ? null : menuGroup.parentMenu
    return
  }
  
  // Single menu: navigate langsung
  if (menuGroup.items && menuGroup.items.length === 1) {
    const item = menuGroup.items[0]
    const target = getSingleMenuPath(menuGroup)
    if (target) {
      setActiveAndNavigate(target)
      isOpen.value = false
    }
  }
}

function onChildClick(menuGroup, item) {
  try {
    const routeConfig = JSON.parse(item.route || '{}')
    let target = ''
    
    if (routeConfig.path) {
      // Jika path sudah lengkap dengan /, gunakan langsung
      if (routeConfig.path.startsWith('/')) {
        target = routeConfig.path
      } else {
        // Jika tidak, gabungkan dengan parentMenu
        target = `/${normalizePath(menuGroup.parentMenu.toLowerCase())}/${normalizePath(routeConfig.path)}`
      }
    } else if (routeConfig.name) {
      // Untuk named route, navigasi langsung dengan name
      expandedHeader.value = menuGroup.parentMenu
      router.push({ name: routeConfig.name })
      isOpen.value = false
      return
    }
    
    if (target) {
      expandedHeader.value = menuGroup.parentMenu
      setActiveAndNavigate(target)
      isOpen.value = false
    }
  } catch (e) {
    console.error('Error handling menu click:', e)
  }
}

function setActiveAndNavigate(target) {
  currentPath.value = normalizePath(target)
  router.push(target)
}
</script>

<style scoped>
ul[v-cloak] { 
  display: none; 
}
</style>