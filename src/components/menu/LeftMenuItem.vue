<template>
  <el-menu-item
    v-if="!item.childrenMenu?.length"
    :index="`/${item.MENU_HEADER_PATH}`"
    @click="getIndex"
    :class="{ activeBg: isCurrentPath(`/${item.MENU_HEADER_PATH}`) }"
  >
    <el-icon>
      <div v-html="item.MENU_HEADER_PICTURE" class="icon-item"></div>
    </el-icon>
    <template #title>
      <a
        :href="`/${item.MENU_HEADER_PATH}`"
        @click="
          (e) => {
            e.preventDefault();
          }
        "
        >{{ item.MENU_HEADER_NAME }}</a
      >
    </template>
  </el-menu-item>

  <el-sub-menu v-if="item.childrenMenu?.length" :index="`/${item.MENU_HEADER_PATH}`">
    <template #title>
      <el-icon :class="{ activeGroup: isGroupActive(`/${item.MENU_HEADER_PATH}/`) }"
        ><div v-html="item.MENU_HEADER_PICTURE" class="icon-item"></div
      ></el-icon>
      <span :class="{ activeGroup: isGroupActive(`/${item.MENU_HEADER_PATH}/`) }">{{ item.MENU_HEADER_NAME }}</span>
    </template>
    <el-menu-item-group>
      <el-menu-item
        v-for="(value, idx) in item.childrenMenu"
        :key="idx"
        :index="`/${item.MENU_HEADER_PATH}/${value.MENU_DETAIL_PATH}`"
        @click="getIndex"
        :class="{ activeStyle: checkRouteActive(`/${item.MENU_HEADER_PATH}/${value.MENU_DETAIL_PATH}`, value.MENU_DETAIL_HAVE_DETAIL) }"
      >
        <el-icon>
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-circle-fill icon-sub-item" viewBox="0 0 16 16">
            <circle cx="8" cy="8" r="8" />
          </svg>
        </el-icon>
        <template #title>
          <a
            :href="`/${item.MENU_HEADER_PATH}/${value.MENU_DETAIL_PATH}`"
            @click="
              (e) => {
                e.preventDefault();
              }
            "
            >{{ value.MENU_DETAIL_NAME }}</a
          >
        </template>
      </el-menu-item>
    </el-menu-item-group>
  </el-sub-menu>
</template>

<script setup>
import { useRoute } from 'vue-router';
const route = useRoute();
const props = defineProps({
  item: {
    type: Object,
  },
});
const isCurrentPath = (path) => {
  return route.path.includes(path);
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
}
.el-menu {
  --el-menu-item-height: 50px;
}
.el-menu-item {
  font-size: 0.85rem;
}
.el-menu-item:hover {
  background-color: $secondary;
}
.activeStyle {
  background-color: $secondary;
  color: $primaryContrast;
}
.activeGroup {
  color: $primaryContrast !important;
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
}
.el-sub-menu .el-menu-item {
  line-height: 17px;
  padding-left: 20px !important;
  padding-right: 5px;
  font-size: 0.8rem;
  width: 100%;
  white-space: break-spaces !important;
}
</style>
