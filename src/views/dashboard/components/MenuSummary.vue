<template>
  <div class="p-3 md:p-6 ">
    <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      <div
        v-for="menuGroup in menuData"
        :key="menuGroup.id"
        class="bg-white rounded-xl shadow-md border border-gray-200"
      >
        <div class="flex items-center gap-3 px-5 py-4 border-b">
          <span class="bg-blue-500 w-1 h-6 rounded"></span>
          <h2 class="text-lg font-semibold text-gray-700">
            {{ menuGroup.parentMenu }}
          </h2>
        </div>

        <div class="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            v-for="item in menuGroup.items"
            :key="item.code"
            @click="handleMenuClick(item)"
            class="group bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-400 
                   hover:shadow-lg transition cursor-pointer p-4"
          >
            <div
              class="w-12 h-12 flex items-center justify-center bg-blue-100 rounded-lg mb-3"
            >
              <span class="material-icons text-blue-600 text-2xl">
                {{ item.icon }}
              </span>
            </div>

            <h3 class="text-sm font-semibold text-gray-800 mb-2 line-clamp-2">
              {{ item.name }}
            </h3>

            <div class="flex items-center justify-between">
              <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {{ item.code }}
              </span>
              <span
                class="material-icons text-gray-400 text-sm group-hover:text-blue-500 transition"
              >
                arrow_forward
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router'; 
import { useStore } from 'vuex';

const store = useStore();
const router = useRouter(); 

const menuData = computed(() => store.getters.menuList);

const handleMenuClick = (item) => {
  try {
    const route = JSON.parse(item.route);
  
    if (route) {
      router.push(route);
      
    }
  } catch (error) {
    console.error('Error parsing route:', error);
  }
};
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>