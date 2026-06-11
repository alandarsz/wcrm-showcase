import { ref, watch } from 'vue';
import { isValElForm, messageInfo } from '../helper/utils';
import { catchError } from '../helper/catchResp';

export default function useAddOneData(options = { returnAsArray: false }) {
  const addData = ref({});
  const addForm = ref(null);
  const addDialog = ref(false);

  watch(addDialog, () => {
    if (!addDialog.value && addForm.value) {
      addForm.value.clearValidate();
      addForm.value.resetFields();
    } else if (addForm.value) {
      addForm.value.clearValidate();
      addForm.value.resetFields();
      addForm.value = null;
    }
  });

  watch(addForm, () => {
    if (addForm.value && addDialog.value) {
      setTimeout(() => {
        addForm.value.$el[0].click();
        addForm.value.$el[0].focus();
      }, 10);
    }
  });

  const saveAdd = async (callback, apiURL) => {
    const resultVal = await isValElForm(addForm.value);
    if (!resultVal) return;
    catchError(async () => {
      const { status, data } = await apiURL(addData.value);
      if (status == 201 || status == 200) {
        addDialog.value = false;
        messageInfo('Berhasil menyimpan data', 'success');
        callback(data?.data);
      }
    });
  };

  const cancelAdd = () => {
    addDialog.value = false;
  };

  if (options.returnAsArray) {
    return [addData, addForm, addDialog, saveAdd, cancelAdd];
  } else {
    return { addData, addForm, addDialog, saveAdd, cancelAdd };
  }
}
