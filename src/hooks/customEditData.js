import { ref } from 'vue';
import { isValElForm, messageInfo, getDifferentObject } from '../helper/utils';
import { catchError } from '../helper/catchResp';

export default function customEditData() {
  const cEditData = ref({});
  const cEditForm = ref(null);
  const cEditDialog = ref(false);
  let cEditOrigin = {};

  const cOpenEditDialog = async (objectEdit) => {
    cEditData.value = { ...objectEdit }; //create new object v1
    cEditDialog.value = true;
    cEditOrigin = JSON.parse(JSON.stringify(objectEdit)); //create new object v2
  };

  const cSaveEdit = async (funcGetList, apiURL, OBJECT_ID) => {
    const resultVal = await isValElForm(cEditForm.value);
    if (!resultVal) return;
    const object = getDifferentObject(cEditData.value, cEditOrigin);
    object[OBJECT_ID] = cEditData.value[OBJECT_ID];
    catchError(async () => {
      const { status } = await apiURL(object);
      if (status == 200) {
        messageInfo('Berhasil mengubah data', 'success');
        cEditDialog.value = false;
        funcGetList();
      }
    });
  };

  const cCancelEdit = () => {
    cEditDialog.value = false;
    cEditForm.value.clearValidate();
  };

  return { cEditData, cEditForm, cEditDialog, cOpenEditDialog, cSaveEdit, cCancelEdit };
}
