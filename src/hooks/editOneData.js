import { ref } from 'vue';
import { isValElForm, messageInfo, getDifferentObject } from '../helper/utils';
import { catchError } from '../helper/catchResp';

export default function useEditOneData(options = { returnAsArray: false }) {
  const editData = ref({});
  const editForm = ref(null);
  const editDialog = ref(false);
  let editOrigin = {};

  const openEditDialog = async (objectEdit) => {
    editData.value = { ...objectEdit }; //create new object v1
    editDialog.value = true;
    editOrigin = JSON.parse(JSON.stringify(objectEdit)); //create new object v2
  };

  const saveEdit = async (callback, apiURL, OBJECT_ID) => {
    const resultVal = await isValElForm(editForm.value);
    if (!resultVal) return;
    const object = getDifferentObject(editData.value, editOrigin);

    if (Array.isArray(OBJECT_ID)) {
      OBJECT_ID.forEach((d) => {
        object[d] = editData.value[d];
      });
    } else {
      object[OBJECT_ID] = editData.value[OBJECT_ID];
    }

    catchError(async () => {
      const { status, data } = await apiURL(object);
      if (status == 200) {
        messageInfo(data.message || 'Berhasil mengubah data', 'success');
        editDialog.value = false;
        callback(data.data);
      }
    });
  };

  const saveEdit2 = async (callback, apiURL) => {
    const resultVal = await isValElForm(editForm.value);
    if (!resultVal) return;

  
    const payload = { ...editData.value };
    // // console.log('payload edit2:', payload);

    
    catchError(async () => {
      const { status, data } = await apiURL(payload);
      if (status === 200) {
        messageInfo(data.message || 'Berhasil mengubah data', 'success');
        editDialog.value = false;
        callback(data.data);
      }


    });
  };

  const cancelEdit = () => {
    editDialog.value = false;
    editForm.value.clearValidate();
  };

  if (options.returnAsArray) {
    return [editData, editForm, editDialog, openEditDialog, saveEdit, cancelEdit, saveEdit2];
  } else {
    return { editData, editForm, editDialog, openEditDialog, saveEdit ,saveEdit2, cancelEdit };
  }
}
