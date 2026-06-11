import HOOKS from '../hooks/bundleOneOps';
import { checkStatusUserSWB, drpChekLogisticRole, getJabatan } from '../api-swb/apiAuth';
import { apiMenu } from '../api-swb/apiMenu';
import { useStore } from 'vuex';
import { computed } from 'vue';

const [statusUser, getStatusUser] = HOOKS.useGetData();
const [logisticRole, getLogisticRole] = HOOKS.useGetData();
const [jabatanInfo, getJabatanInfo] = HOOKS.useGetData();
const [menu, getMenu] = HOOKS.useGetData();

export function onGetStatusUser(userCodeP) {
  const store = useStore();
  const userCode = computed(() => store?.getters?.userCode)
  
  getStatusUser(() => checkStatusUserSWB(userCode.value || userCodeP), true, true);
}

export function onGetLogisticRole(userCodeP) {
  const store = useStore();
  const userCode = computed(() => store?.getters?.userCode)
  let result;
  getLogisticRole(
    () => drpChekLogisticRole(userCode.value || userCodeP),
    true,
    true,
    (data) => {
      const payload = data.body[0];
      store.commit('setAccount', payload);
      result = payload
    },
  );
  return result
}

export function onGetJabatanInfo() {
  const store = useStore();
  const accountId = computed(() => store?.getters?.accountId)
  getJabatanInfo(
    () => getJabatan(accountId.value),
    true,
    true,
    (data) => {
      store.commit('setJabatan', data.body[0]);
    },
  );
}

export function onGetMenu() {
  const store = useStore();
  const accountId = computed(() => store.getters.accountId)
  getMenu(
    () => apiMenu(accountId.value),
    true,
    false,
    (data) => {
      store.commit('setLeftMenu', data);
    },
  );
}

export const statusUserSWB = computed(() => statusUser.value);
export const logisticRoleSWB = computed(() => logisticRole.value);
export const jabatanInfoSWB = computed(() => jabatanInfo.value);

export default { onGetStatusUser, onGetLogisticRole, onGetJabatanInfo };
