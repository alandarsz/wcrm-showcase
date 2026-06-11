<template>
  <div>
    <!-- Sub Menu Popup -->
    <Transition name="fade">
      <div v-if="openSubMenuData" class="fixed inset-0 z-40" @click="openSubMenu = null">
        <div
          class="absolute bottom-24 left-4 right-4 bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-xl"
          @click.stop>
          <p class="pl-4 text-xs py-2 text-slate-500">{{ openSubMenuData.parentMenu }}</p>
          <button v-for="item in openSubMenuData.items" :key="item.code"
            class="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50"
            @click="handleSubClick(item, openSubMenuData.parentMenuCode)">
            <span class="material-icons-round text-slate-500">
              {{ item.icon }}
            </span>
            <span :class="[
              'text-sm font-medium',
              isItemActive(item) ? 'text-indigo-600' : ''
            ]">
              {{ item.name }}
            </span>
          </button>
        </div>
      </div>
    </Transition>

    <!-- More Panel -->
    <Transition name="fade">
      <div v-if="showMore" class="fixed inset-0 z-40" @click="showMore = false">
        <div
          class="absolute bottom-24 left-4 right-4 bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-xl"
          @click.stop>
          <template v-for="menu in moreMenus" :key="menu.id">
            <button v-for="item in menu.items" :key="item.code"
              class="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 border-b border-slate-100"
              @click="handleSubClick(item, menu.items?.length > 1 ? menu.parentMenuCode : null)">
              <span class="material-icons-round text-slate-500">
                {{ item.icon }}
              </span>
              <span :class="[
                'text-sm font-medium',
                isItemActive(item) ? 'text-indigo-600' : ''
              ]">
                {{ item.name }}
              </span>
            </button>
          </template>
        </div>
      </div>
    </Transition>

    <!-- Bottom Navigation -->
    <nav
      class="fixed bottom-0 left-0 right-0 bg-primary/5 backdrop-blur-sm border-t rounded-t-2xl border-slate-200 px-2 pt-2 pb-4 z-50">
      <div class="flex items-end justify-around">

        <!-- Main Menus -->
        <button v-for="menu in mainMenus" :key="menu.id" class="flex flex-col items-center flex-1 py-1"
          @click="handleNavClick(menu, menu.parentMenu)">
          <span :class="[
            'material-icons-round',
            isMenuActive(menu)
              ? 'text-indigo-600'
              : 'text-slate-400'
          ]">
            {{ menu.items[0].icon }}
          </span>

          <span :class="[
            'text-[10px] font-medium line-clamp-1',
            isMenuActive(menu)
              ? 'text-indigo-600'
              : 'text-slate-400'
          ]">
            {{ menu.parentMenu }}
          </span>
        </button>

        <!-- More Button -->
        <button class="flex flex-col items-center flex-1 py-1" @click="toggleMore">
          <span :class="[
            'material-icons-round',
            showMore || moreHasActive
              ? 'text-indigo-600'
              : 'text-slate-400'
          ]">
            {{ showMore ? 'close' : 'more_horiz' }}
          </span>

          <span :class="[
            'text-[10px] font-medium',
            showMore || moreHasActive
              ? 'text-indigo-600'
              : 'text-slate-400'
          ]">
            More
          </span>
        </button>

      </div>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'

const props = defineProps({
  mainCount: {
    type: Number,
    default: 4
  }
})

const store = useStore()

const leftMenu = computed(() => store.getters.menuList)

const router = useRouter()
const route = useRoute()

const showMore = ref(false)
const openSubMenu = ref(null)

/* ================= COMPUTED ================= */

const mainMenus = computed(() =>
  leftMenu.value.slice(0, props.mainCount)
)

const moreMenus = computed(() =>
  leftMenu.value.slice(props.mainCount)
)

const moreHasActive = computed(() =>
  moreMenus.value.some(menu =>
    menu.items.some(i => isItemActive(i))
  )
)

const openSubMenuData = computed(() =>
  openSubMenu.value
    ? leftMenu.value.find(m => m.id === openSubMenu.value)
    : null
)

/* ================= ACTIVE CHECK ================= */

function isItemActive(item) {
  const parsed = JSON.parse(item.route)
  return route.path === `/${parsed.path}` || route.path.includes(parsed.path)
}

function isMenuActive(menu) {
  return menu.items.some(i => isItemActive(i))
}

/* ================= NAVIGATION ================= */

function navigate(item, parentMenu) {
  const parsed = JSON.parse(item.route)

  const parent = parentMenu ? parentMenu?.toLowerCase() : ''

  router.push(parentMenu ? `/${parent}/${parsed.path}` : `/${parsed.path}`)

  openSubMenu.value = null
  showMore.value = false
}

function handleNavClick(menu, parentMenu) {
  showMore.value = false

  if (menu.items.length > 1) {
    openSubMenu.value =
      openSubMenu.value === menu.id ? null : menu.id
  } else {
    navigate(menu.items[0])
  }
}

function handleSubClick(item, parentMenu) {
  navigate(item, parentMenu)
}

function toggleMore() {
  showMore.value = !showMore.value
  openSubMenu.value = null
}

function selectMoreSingle(menu) {
  navigate(menu.items[0])
}

/* ================= AUTO CLOSE ON ROUTE CHANGE ================= */

watch(
  () => route.path,
  () => {
    openSubMenu.value = null
    showMore.value = false
  }
)
</script>

<style>
@import url('https://fonts.googleapis.com/icon?family=Material+Icons+Round');

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>