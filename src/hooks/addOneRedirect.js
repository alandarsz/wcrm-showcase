import { ref, watch } from 'vue';
import { isValElForm, messageInfo } from '../helper/utils';
import { catchError } from '../helper/catchResp';
import { useRouter } from 'vue-router';

export default function useAddOneRedirect() {
  const addDataR = ref({});
  const addFormR = ref(null);
  const addDialogR = ref(false);
  const router = useRouter();

  watch(addDialogR, () => {
    if (!addDialogR.value && addFormR.value) {
      addFormR.value.clearValidate();
      addFormR.value.resetFields();
    } else if (addFormR.value) {
      addFormR.value.clearValidate();
      addFormR.value.resetFields();
      addFormR.value = null;
    }
  });

  watch(addFormR, () => {
    if (addFormR.value && addDialogR.value) {
      setTimeout(() => {
        addFormR.value.$el[0].click();
        addFormR.value.$el[0].focus();
      }, 10);
    }
  });

  const saveAddR = async (redirectURL, apiURL, stringID = '', query = '', callback) => {
    const resultVal = await isValElForm(addFormR.value);
    if (!resultVal) return;
    catchError(async () => {
      const { status, data } = await apiURL(addDataR.value);
      if (status == 201 || status == 200) {
        if (callback) {
          callback(data.data);
        }
        addDialogR.value = false;
        messageInfo('Berhasil menyimpan data', 'success');
        let ID = '';
        if (stringID) {
          ID = data.data[stringID];
        }

        router.push(`${redirectURL}${ID}${query}`);
      }
    });
  };

  const cancelAddR = () => {
    addDialogR.value = false;
  };

  return { addDataR, addFormR, addDialogR, saveAddR, cancelAddR };
}
