import { ref } from 'vue';
import { isValElForm, messageInfo } from '../helper/utils';
import { catchError } from '../helper/catchResp';

// DEFINED ALLOWED PROPERTIES AND OPTIONS OBJECT ON REPLACING VALUE ON FIELD
export default function useEditDataOption(allowedProperty, options = { useArray: false }) {
  const editData = ref({});
  const editForm = ref(null);
  const editDialog = ref(false);

  // OPEN THE DIALOG WITH OBJECT IN IT

  const openEditDialog = async (objectEdit) => {
    const keysArr = [];
    for (const key in allowedProperty) {
      keysArr.push(key);
    }
    const filtered = {};
    for (const key in objectEdit) {
      if (keysArr.includes(key)) {
        filtered[key] = objectEdit[key];
      }
    }
    editData.value = filtered;
    editDialog.value = true;
  };

  const saveEdit = async (callback, apiURL) => {
    const resultVal = await isValElForm(editForm.value);
    if (!resultVal) return;
    catchError(async () => {
      const { status, data } = await apiURL(editData.value);
      if (status == 200) {
        messageInfo('Berhasil mengubah data', 'success');
        editDialog.value = false;
        callback(data.data);
      }
    });
  };


  

  const cancelEdit = () => {
    editDialog.value = false;
    editForm.value.clearValidate();
  };

  if (options.useArray) {
    return [editData, editForm, editDialog, openEditDialog, saveEdit, cancelEdit];
  } else {
    return { editData, editForm, editDialog, openEditDialog, saveEdit, cancelEdit };
  }
}
