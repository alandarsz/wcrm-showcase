<template>
  <div class="min-h-screen bg-slate-50 flex flex-col md:flex-row">
    <!-- Sidebar for Desktop -->
    <aside
      :class="[
        'bg-slate-900 text-white transition-all duration-300 ease-in-out z-20 flex flex-col shrink-0 border-r border-slate-800',
        isCollapse ? 'w-20' : 'w-64',
        'hidden md:flex'
      ]"
    >
      <!-- Brand Logo Section -->
      <div class="h-16 flex items-center px-6 border-b border-slate-800 gap-3">
        <div class="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center font-bold text-slate-900 shadow-md">
          W
        </div>
        <span
          v-if="!isCollapse"
          class="font-heading text-lg font-black tracking-wider bg-gradient-to-r from-white via-slate-200 to-amber-300 bg-clip-text text-transparent transition-opacity duration-200"
        >
          WAHANA <span class="text-amber-400">CRM</span>
        </span>
      </div>

      <!-- Navigation Menu -->
      <nav class="flex-1 px-3 py-4 space-y-2">
        <router-link
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          v-slot="{ isActive }"
          class="block"
        >
          <div
            :class="[
              'flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group cursor-pointer',
              isActive
                ? 'bg-primary text-white shadow-lg shadow-primary/30 font-semibold'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            ]"
          >
            <el-icon :size="20" :class="isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'">
              <component :is="item.icon" />
            </el-icon>
            <span v-if="!isCollapse" class="text-sm font-medium">{{ item.label }}</span>
          </div>
        </router-link>
      </nav>

      <!-- Footer Info / Version -->
      <div class="p-4 border-t border-slate-800">
        <div v-if="!isCollapse" class="text-xs text-slate-500 text-center">
          <p class="font-semibold text-slate-400">Wahana CRM Portfolio</p>
          <p class="mt-0.5">Version 1.0.13 (Anonymized)</p>
        </div>
        <div v-else class="text-center text-[10px] text-slate-500 font-bold">
          v1.0
        </div>
      </div>
    </aside>

    <!-- Mobile Header -->
    <header class="md:hidden bg-slate-900 text-white h-16 px-4 flex items-center justify-between border-b border-slate-800 shrink-0 sticky top-0 z-30">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center font-bold text-slate-900 shadow-md">
          W
        </div>
        <span class="font-heading text-base font-black tracking-wider text-white">
          WAHANA <span class="text-amber-400">CRM</span>
        </span>
      </div>
      <el-dropdown trigger="click">
        <div class="flex items-center gap-2 cursor-pointer">
          <el-avatar :size="32" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256" />
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>
              <div class="text-xs text-gray-500">Sales: <strong>Yudha Pratama</strong></div>
            </el-dropdown-item>
            <el-dropdown-item divided>Portofolio Dummy</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </header>

    <!-- Main Content Panel -->
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <!-- Desktop Header -->
      <header class="hidden md:flex h-16 bg-white border-b border-slate-200 items-center justify-between px-8 shrink-0">
        <div class="flex items-center gap-4">
          <!-- Collapse Button -->
          <button
            @click="isCollapse = !isCollapse"
            class="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition"
          >
            <el-icon :size="20">
              <Expand v-if="isCollapse" />
              <Fold v-else />
            </el-icon>
          </button>

          <!-- Breadcrumb Title -->
          <h2 class="text-lg font-heading font-bold text-slate-800">
            {{ currentRouteLabel }}
          </h2>
        </div>

        <div class="flex items-center gap-6">
          <!-- Notification Bell -->
          <el-badge is-dot class="cursor-pointer">
            <el-icon :size="20" class="text-slate-600 hover:text-primary transition">
              <Bell />
            </el-icon>
          </el-badge>

          <!-- Divider -->
          <div class="h-6 w-[1px] bg-slate-200"></div>

          <!-- Profile Dropdown -->
          <el-dropdown trigger="click">
            <div class="flex items-center gap-3 cursor-pointer group">
              <div class="flex flex-col text-right">
                <span class="text-sm font-semibold text-slate-800 group-hover:text-primary transition">Yudha Pratama</span>
                <span class="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Corporate Sales</span>
              </div>
              <el-avatar
                :size="38"
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256"
                class="border-2 border-slate-200 group-hover:border-primary transition"
              />
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>Profil Saya (Demo)</el-dropdown-item>
                <el-dropdown-item>Pengaturan Akun</el-dropdown-item>
                <el-dropdown-item divided class="text-red-500">Keluar</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </header>

      <!-- Main Workspace -->
      <main class="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-100/50 pb-20 md:pb-8">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>

    <!-- Mobile Bottom Navigation -->
    <nav class="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 flex items-center justify-around h-16 z-30 px-2 shadow-2xl">
      <router-link
        v-for="item in menuItems"
        :key="item.path"
        :to="item.path"
        v-slot="{ isActive }"
        class="flex-1 py-1"
      >
        <div class="flex flex-col items-center justify-center gap-1 cursor-pointer">
          <el-icon :size="20" :class="isActive ? 'text-amber-400' : 'text-slate-400'">
            <component :is="item.icon" />
          </el-icon>
          <span :class="['text-[10px] font-semibold tracking-wider', isActive ? 'text-amber-400 font-bold' : 'text-slate-500']">
            {{ item.shortLabel || item.label }}
          </span>
        </div>
      </router-link>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isCollapse = ref(false)

const menuItems = [
  { path: '/dashboard', label: 'Dashboard Analytics', shortLabel: 'Dashboard', icon: 'PieChart' },
  { path: '/contacts', label: 'Daftar Customer', shortLabel: 'Customer', icon: 'User' },
  { path: '/tasks', label: 'Task & Follow-up', shortLabel: 'Tasks', icon: 'Tickets' }
]

const currentRouteLabel = computed(() => {
  const item = menuItems.find(i => route.path.startsWith(i.path))
  return item ? item.label : 'Wahana CRM'
})
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
