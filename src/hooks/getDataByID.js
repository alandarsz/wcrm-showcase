import { ref } from 'vue';
import { isObjectEmpty } from '../helper/utils';
import { catchError, catchErrorFinally } from '../helper/catchResp';

export default function useGetDataById() {
  const dataRef = ref([]);
  const isLoading = ref(false);

  const getData = (apiURL, params,isLoadingInside = false, isForceCallAndSave = false, callBack) => {
    async function callAndSave() {
      const { data } = await apiURL(params);
      
      if (callBack) {
        callBack(data.data);
      }
      if (Array.isArray(data.data)) {
        dataRef.value = data.data;
      } else {
        if (Object.entries(data.data).length == 0) {
          dataRef.value.data = [];
        } else {
          dataRef.value = data.data;
        }
      }
    }

    if (isObjectEmpty(dataRef.value) || isForceCallAndSave) {
      if (isLoadingInside) {
        isLoading.value = true;
        catchErrorFinally(
          async () => callAndSave(),
          () => (isLoading.value = false),
        );
      } else {
        catchError(async () => callAndSave());
      }
    }
  };

  return [dataRef, getData, isLoading];
}

