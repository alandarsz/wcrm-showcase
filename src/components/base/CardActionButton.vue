<template>
    <div>
        <card-list-item is-single-column>
            <template #default="{row}">
                <div class="flex justify-end items-center">
                    <el-tooltip v-if="showEdit" class="box-item" popper-class="custom-popper" effect="dark" content="Ubah"
                        placement="top" :enterable="false">
                        <el-button type="warning" size="small" @click="handleEdit(row)" :icon="Edit">Ubah</el-button>
                    </el-tooltip>
                    <el-tooltip v-if="showView" class="box-item" popper-class="custom-popper" effect="dark" content="View"
                        placement="top" :enterable="false">
                        <el-button type="primary" size="small" @click="handleView(row)" :icon="ZoomIn">View</el-button>
                    </el-tooltip>
                    <el-tooltip v-if="showHistory" class="box-item" popper-class="custom-popper" effect="dark" content="History"
                        placement="top" :enterable="false">
                        <el-button type="info" size="small" @click="handleHistory(row)" :icon="RefreshLeft">History</el-button>
                    </el-tooltip>
                    <el-tooltip v-if="showBarcode" class="box-item" popper-class="custom-popper" effect="dark" content="Barcode"
                        placement="top" :enterable="false">
                        <el-icon class="item" @click="handleBarcode(row)">
                            <div v-html="barcode" />
                        </el-icon>
                    </el-tooltip>
                    <el-popconfirm v-if="showDelete" confirm-button-text="Yes" cancel-button-text="No" :icon="InfoFilled"
                        icon-color="red" :title="createDeleteTitle(row)" @confirm="handleDelete(row)" content="Hapus">
                        <template #reference>
                            <el-button type="danger" size="small" :icon="Delete">Hapus</el-button>
                        </template>
                    </el-popconfirm>
        
                    <el-tooltip v-if="showPayment" class="box-item" popper-class="custom-popper" effect="dark" content="Payment"
                        placement="top" :enterable="false">
                        <el-icon class="item" @click="handlePayment(row)">
                            <CreditCard />
                        </el-icon>
                    </el-tooltip>
        
                    <el-tooltip v-if="showPrint" class="box-item" popper-class="custom-popper" effect="dark" content="Print"
                        placement="top" :enterable="false">
                        <el-icon class="item" @click="handlePrint(row)">
                            <Document />
                        </el-icon>
                    </el-tooltip>
        
                    <el-popconfirm v-if="showVoid" confirm-button-text="Yes" cancel-button-text="No" :icon="WarningFilled"
                        icon-color="grey" :title="titleVoid" @confirm="handleVoid(row)" content="Void">
                        <template #reference>
                            <el-icon class="item">
                                <el-tooltip class="box-item" popper-class="custom-popper" effect="dark" content="Void"
                                    placement="top" :enterable="false">
                                    <WarningFilled />
                                </el-tooltip>
                            </el-icon>
                        </template>
                    </el-popconfirm>
                </div>
            </template>
        </card-list-item>
    </div>
</template>
<script setup>
import { Edit, Delete, ZoomIn, RefreshLeft, InfoFilled, CreditCard, WarningFilled, Document } from '@element-plus/icons-vue';
import { useStore } from 'vuex';
import { computed, toRaw, ref } from 'vue';
import { barcode } from '../../helper/svg';

const store = useStore();
const isFixed = computed(() => (store.getters.isOnMobile ? false : 'right'));
const emit = defineEmits(['click-edit', 'click-view', 'click-history', 'click-barcode', 'click-delete', 'click-void', 'click-payment']);
const props = defineProps({
    showEdit: {
        type: Boolean,
        default: false,
    },
    showView: {
        type: Boolean,
        default: false,
    },
    showHistory: {
        type: Boolean,
        default: false,
    },
    showBarcode: {
        type: Boolean,
        default: false,
    },
    showDelete: {
        type: Boolean,
        default: false,
    },
    showVoid: {
        type: Boolean,
        default: false,
    },
    titleVoid: {
        type: String,
        default: 'Apakah Anda akan mengubah status ke Void?',
    },
    showPayment: {
        type: Boolean,
        default: false,
    },
    showPrint: {
        type: Boolean,
        default: false,
    },
    name: {
        type: String,
        default: '',
    },
});
const minWidth = ref(null);

const handleEdit = (row) => emit('click-edit', toRaw(row));
const handleView = (row) => emit('click-view', toRaw(row));
const handleHistory = (row) => emit('click-history', toRaw(row));
const handleBarcode = (row) => emit('click-barcode', toRaw(row));
const handleDelete = (row) => emit('click-delete', toRaw(row));
const handleVoid = (row) => emit('click-void', toRaw(row));
const handlePayment = (row) => emit('click-payment', toRaw(row));
const handlePrint = (row) => emit('click-print', toRaw(row));

//get how many menus are active and calculate the minimum width
(() => {
    const showList = toRaw(props);

    let counter = 0;
    for (const key in showList) {
        if (showList[key]) {
            counter++;
        }
    }
    if (counter < 2) {
        minWidth.value = 70;
    } else if (counter < 3) {
        minWidth.value = 80;
    } else if (counter < 4) {
        minWidth.value = 90;
    } else if (counter < 5) {
        minWidth.value = 100;
    } else {
        minWidth.value = 120;
    }
})();

function createDeleteTitle(row) {
    if (props.name) {
        return `Anda yakin akan menghapus (${row[props.name]})?`;
    }
    return `Anda yakin akan menghapus ini?`;
}
</script>

<style lang="scss">
.custom-popper {
    padding: 5px 10px;
    font-size: 0.7rem;
}
</style>