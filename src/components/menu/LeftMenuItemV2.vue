<template>
  <el-menu-item
    v-if="item.items?.length == 1"
    :index="`/${parsePath(item.items[0].route)}`"
    @click="getIndex"
    :class="{ activeBg: isCurrentPath(`/${parsePath(item.items[0].route)}`) }"
  >
  <el-icon>
    <span class="material-icons material-symbol-outlined text-primary icon-item">{{ item.items[0].icon }}</span>
  </el-icon>
    <template #title>
      <a
        :href="`/${parsePath(item.items[0].route)}`"
        @click="
          (e) => {
            e.preventDefault();
          }
        "
        class="text-wrap break-keep leading-tight text-primary"
        :class="{'dark:text-white': isCollapse}"
        >
        <p class="min-w-[100px]">{{ item.parentMenu == item.items[0].name ? item.parentMenu : `${item.parentMenu} ${item.items[0].name}` }}</p>
        </a
      >
    </template>
  </el-menu-item>

  <el-sub-menu v-if="item.items?.length > 1" :class="{ activeBgGroup: isGroupActive(`/${item.parentMenu.replace(/\s+/g, '-').toLowerCase()}/`) }" :index="`/${item.parentMenu.replace(/\s+/g, '-').toLowerCase()}`">
    <template #title>
      <el-icon>
        <span class="material-icons material-symbol-outlined text-primary icon-item">{{ item.items[0].icon }}</span>
      </el-icon>
      <span :class="{ activeGroup: isGroupActive(`/${item.parentMenu.replace(/\s+/g, '-').toLowerCase()}`) }" class="min-w-[100px] text-wrap leading-tight break-keep text-primary">{{ item.parentMenu }}</span>
    </template>
    <el-menu-item-group>
      <el-menu-item
        v-for="(value, idx) in item.items"
        :key="idx"
        :index="`/${item.parentMenu.replace(/\s+/g, '-').toLowerCase()}/${parsePath(value.route)}`"
        @click="getIndex"
        :class="{ activeStyle: checkRouteActive(`/${item.parentMenu.replace(/\s+/g, '-').toLowerCase()}/${parsePath(value.route)}`, true) }"
      >
        <template #title>
          <a
            :href="`/${item.parentMenu.replace(/\s+/g, '-').toLowerCase()}/${parsePath(value.route)}`"
            @click="
              (e) => {
                e.preventDefault();
              }
            "
            class="text-wrap break-keep leading-tight ml-4 min-w-[100px]"
            >{{ value.name }}</a
          >
        </template>
      </el-menu-item>
    </el-menu-item-group>
  </el-sub-menu>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
const route = useRoute();
const props = defineProps({
  item: {
    type: Object,
  },
});
const item = computed(() => props.item)
const store = useStore()
const isCollapse = computed(() => store.getters.isCollapse);

// this is just a temporary solution
function parsePath(path) {
  const parse = JSON.parse(path)
  let parsedPath = parse.path || '/'
  if (parse.query) {
    let prepare = [`${parsedPath}?`]
    for(const i of Object.keys(parse.query)) {
      prepare.push(`${i}=${parse.query[i]}`)
    }
    parsedPath = prepare.join('&')
  }
  return parsedPath || '/'
}

const isCurrentPath = (path) => {
  return route.path.includes(path) || path.includes(route.path);
};
const checkRouteActive = (check, detail) => {
  if (detail) {
    return route.path.includes(check);
  } else {
    return route.path == check;
  }
};
const isGroupActive = (path) => {
  return route.fullPath.includes(path);
};
isGroupActive();
const emit = defineEmits(['click']);
const getIndex = (e) => emit('click', e);
</script>

<script>
export default {
  inheritAttrs: false,
};
</script>

<style lang="scss">
.activeBg {
  background-color: $secondary;
  border-radius: 5px !important;
}
.el-menu {
  --el-menu-item-height: 50px;
}
.el-menu-item {
  font-size: 0.85rem;
  color: $primary;
}
.el-menu-item:hover {
  background-color: #fff59c;
  border-radius: 5px !important;
}
.activeStyle {
  background-color: $secondary;
  color: $primaryContrast;
  border-radius: 5px !important;
}
.activeBgGroup {
  background-color: #e2e2e2;
  color: $primary !important;
}
.activeGroup {
  color: $primary !important;
}
.icon-item > span {
  width: 1rem !important;
}
.icon-item > svg {
  width: 1rem !important;
}
.icon-sub-item {
  width: 0.4rem !important;
}
.el-icon {
  flex: none;
}
.el-menu-item-group__title {
  padding: 0;
}
.el-sub-menu__title {
  font-size: 0.85rem;
  color: $primary;
}
.el-sub-menu .el-menu-item {
  line-height: 17px;
  padding-left: 20px !important;
  padding-right: 5px;
  font-size: 0.8rem;
  width: 100%;
  white-space: break-spaces !important;
}
.material-icons {
  font-size: 30px !important;
  margin-right: 3px;
}
</style>
