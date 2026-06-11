<template>
  <div class="responsive-datepicker-wrapper">
    <!-- Mobile: Tampilkan 2 date picker terpisah -->
    <div v-if="isMobile" class="mobile-datepicker">
      <el-date-picker v-model="startDate" type="date" placeholder="Tanggal Mulai" :disabled-date="disabledStartDate"
        format="YYYY/MM/DD" value-format="YYYY-MM-DD" style="width: 100%; margin-bottom: 12px"
        @change="handleStartDateChange" />
      <el-date-picker v-model="endDate" type="date" placeholder="Tanggal Akhir" :disabled-date="disabledEndDate"
        format="YYYY/MM/DD" value-format="YYYY-MM-DD" style="width: 100%; margin-bottom: 12px"
        @change="handleEndDateChange" />

      <!-- Button untuk membuka drawer shortcuts -->
      <div class="w-full grid grid-cols-2 gap-2">
        <el-button type="primary" size="small" style="width: 100%" @click="drawerVisible = true">
          <el-icon class="mr-2">
            <Calendar />
          </el-icon>
          Periode  <el-icon class="ml-2"><DCaret /></el-icon>
        </el-button>
        <slot name="button"></slot>

      </div>
      <!-- Drawer untuk shortcuts di mobile -->
      <el-drawer v-model="drawerVisible" title="Pilih Periode" direction="btt" size="auto" :append-to-body="true">
        <div class="drawer-shortcuts">
          <div v-for="(shortcut, idx) in shortcuts" :key="idx">
            <el-button size="large" @click="applyShortcut(shortcut)" class="shortcut-btn">
              {{ shortcut.text }}
            </el-button>

          </div>
        </div>
      </el-drawer>
    </div>

    <!-- Desktop: Tampilkan date range picker biasa -->
    <el-date-picker v-else v-model="filterDateRange" type="daterange" unlink-panels range-separator="To"
      start-placeholder="Tanggal Mulai" end-placeholder="Tanggal Akhir" :disabled-date="disabledDate"
      @calendar-change="dateChange" :shortcuts="shortcuts" style="width: 100%" format="YYYY/MM/DD"
      value-format="YYYY-MM-DD" />
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted, onUnmounted } from 'vue';
import { Calendar ,DCaret} from '@element-plus/icons-vue';

const props = defineProps(['startDate', 'endDate']);
const emit = defineEmits(['update:startDate', 'update:endDate']);

// Detect mobile
const windowWidth = ref(window.innerWidth);
const isMobile = computed(() => windowWidth.value < 768);

const filterDateRange = ref(null);
const startDate = ref(props.startDate);
const endDate = ref(props.endDate);
const drawerVisible = ref(false);
let pickFirstDate = null;

// Initialize values
filterDateRange.value = [props.startDate, props.endDate];

// Watch for window resize
const handleResize = () => {
  windowWidth.value = window.innerWidth;
};

onMounted(() => {
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

// Watch desktop date range
watch(filterDateRange, () => {
  if (!isMobile.value) {
    if (filterDateRange.value) {
      emit('update:startDate', filterDateRange.value[0]);
      emit('update:endDate', filterDateRange.value[1]);
    } else {
      emit('update:startDate', '');
      emit('update:endDate', '');
      pickFirstDate = null;
    }
  }
});

// Watch mobile dates
watch(startDate, (newVal) => {
  if (isMobile.value) {
    emit('update:startDate', newVal || '');
  }
});

watch(endDate, (newVal) => {
  if (isMobile.value) {
    emit('update:endDate', newVal || '');
  }
});

// Desktop disabled date
const disabledDate = (time) => {
  if (pickFirstDate) {
    const dayRange = 366;
    var startDate = new Date(pickFirstDate.getTime());
    var endDate = new Date(pickFirstDate.getTime());
    startDate.setDate(pickFirstDate.getDate() - dayRange);
    endDate.setDate(pickFirstDate.getDate() + dayRange);
    if (endDate.getTime() > Date.now()) {
      endDate = new Date();
    }
    return time.getTime() > endDate.getTime() || time.getTime() < startDate.getTime();
  } else {
    return time.getTime() > Date.now();
  }
};

// Mobile disabled dates
const disabledStartDate = (time) => {
  const now = new Date();
  now.setHours(23, 59, 59, 999);

  if (endDate.value) {
    const end = new Date(endDate.value);
    const maxStart = new Date(end.getTime());
    maxStart.setDate(end.getDate() - 366);
    return time.getTime() > now.getTime() ||
      time.getTime() > end.getTime() ||
      time.getTime() < maxStart.getTime();
  }
  return time.getTime() > now.getTime();
};

const disabledEndDate = (time) => {
  const now = new Date();
  now.setHours(23, 59, 59, 999);

  if (startDate.value) {
    const start = new Date(startDate.value);
    const maxEnd = new Date(start.getTime());
    maxEnd.setDate(start.getDate() + 366);

    if (maxEnd.getTime() > now.getTime()) {
      maxEnd.setTime(now.getTime());
    }

    return time.getTime() > now.getTime() ||
      time.getTime() < start.getTime() ||
      time.getTime() > maxEnd.getTime();
  }
  return time.getTime() > now.getTime();
};

const handleStartDateChange = () => {
  // Auto focus to end date after selecting start date
  if (startDate.value && !endDate.value) {
    // You can add auto-focus logic here if needed
  }
};

const handleEndDateChange = () => {
  // Validation or auto-actions can be added here
};

function dateChange(time) {
  pickFirstDate = time[0];
}

const applyShortcut = (shortcut) => {
  const range = shortcut.value();
  startDate.value = range[0].toISOString().split('T')[0];
  endDate.value = range[1].toISOString().split('T')[0];
  drawerVisible.value = false; // Close drawer after selection
};

const shortcuts = [
  {
    text: 'This Month',
    value: () => {
      const end = new Date();
      const start = new Date(end.getFullYear(), end.getMonth(), 1);
      return [start, end];
    },
  },
  {
    text: 'Last Month',
    value: () => {
      const date = new Date();
      const end = new Date(date.getFullYear(), date.getMonth(), 0);
      const start = new Date(date.getFullYear(), date.getMonth() - 1, 1);
      return [start, end];
    },
  },
  {
    text: 'Last 30 Days',
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      return [start, end];
    },
  },
  {
    text: 'Last 90 Days',
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
      return [start, end];
    },
  },
  {
    text: 'This Year',
    value: () => {
      const end = new Date();
      const start = new Date(end.getFullYear(), 0, 1);
      return [start, end];
    },
  },
  {
    text: 'Last Year',
    value: () => {
      const date = new Date();
      const end = new Date(date.getFullYear() - 1, 12, 0);
      const start = new Date(date.getFullYear() - 1, 0, 1);
      return [start, end];
    },
  },
  {
    text: 'Last 1 Year',
    value: () => {
      const end = new Date();
      const start = new Date(end.getFullYear() - 1, end.getMonth(), end.getDate());
      return [start, end];
    },
  },
];
</script>

<style lang="scss" scoped>
.responsive-datepicker-wrapper {
  width: 100%;
}

.mobile-datepicker {
  width: 100%;
}

.drawer-shortcuts {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0 16px 24px;
}

.shortcut-btn {
  width: 100%;
  height: 48px;
  font-size: 15px;
  font-weight: 500;
  justify-content: flex-start;
}

/* Responsive adjustments */
@media (max-width: 480px) {
  .drawer-shortcuts {
    padding: 0 12px 20px;
  }

  .shortcut-btn {
    height: 44px;
    font-size: 14px;
  }
}

/* Override Element Plus styles for mobile */
:deep(.el-date-editor) {
  @media (max-width: 767px) {
    .el-range-separator {
      padding: 0 2px;
      font-size: 12px;
    }

    .el-range-input {
      font-size: 12px;
    }
  }
}

/* Make calendar popup responsive on mobile */
@media (max-width: 767px) {
  :deep(.el-picker-panel) {
    max-width: calc(100vw - 20px) !important;
  }

  :deep(.el-date-range-picker) {
    flex-direction: column !important;
  }

  :deep(.el-picker-panel__body) {
    min-width: auto !important;
  }
}

/* Drawer customization */
:deep(.el-drawer) {
  border-radius: 16px 16px 0 0;
}

:deep(.el-drawer__header) {
  margin-bottom: 16px;
  padding: 20px 16px 0;
  font-size: 18px;
  font-weight: 600;
}

:deep(.el-drawer__body) {
  padding: 16px 0 0;
}
</style>