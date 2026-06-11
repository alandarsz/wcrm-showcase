import * as rl from '../helper/rules';
import { ref, reactive } from 'vue';
const isRead = ref();
const mostReadValue = ref();

const validateChecked = (rule, value, callback) => {
  isRead.value = [];
  mostReadValue.value = [];
  value.forEach((e, k) => {
    isRead.value.push({ read: e.IS_READ, key: k });
  });
  isRead.value.forEach((r) => {
    if (isRead.value[r.key].read) {
      mostReadValue.value.push(isRead.value[r.key].read);
    }
  });
  if (mostReadValue.value.length < 1) {
    callback(new Error('Choose, at least one of those'));
  } else {
    callback();
  }
};

export const add = reactive({
  ROLE_NAME: [rl.requiredRule()],
  ROLE_DESCRIPTION: [rl.requiredRule(), rl.maxStringRule(50)],
  ROLES_ACCESS: [{ validator: validateChecked, trigger: 'change' }],
});
export const edit = reactive({
  ROLE_NAME: [rl.requiredRule()],
  ROLE_DESCRIPTION: [rl.requiredRule(), rl.maxStringRule(50)],
  ROLES_ACCESS: [{ validator: validateChecked, trigger: 'change' }],
});
