import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { catchErrorFinally, catchError } from '../helper/catchResp';

export default function useListDataPaginate() {
  const route = useRoute();
  const router = useRouter();
  const pageSizeEnv = parseInt(import.meta.env.VITE_PAGE_SIZE);
  const search = ref(null);
  const listData = ref(null);
  const rowTotal = ref(null);
  const headers = ref(null);
  const pageIndex = computed(() => (route.query.pageIndex ? parseInt(route.query.pageIndex) : 1));
  const pageSize = computed(() => (route.query.pageSize ? parseInt(route.query.pageSize) : pageSizeEnv));
  const loading = ref(false);
  const filterData = ref({});
  const filterSearchData = ref({});

  //SHOW LOADING FOR FIRST LOAD
  const getListData = (apiURL, objectIndex = pageIndex.value, objectSize = pageSize.value, textSearch = search.value, newObj = {}) => {
    if (Object.keys(newObj).length) {
      Object.keys(newObj).forEach((el) => {
        if ((newObj[el] === null || newObj[el] === '') && newObj !== false) {
          delete newObj[el];
        }
      });
    }
    search.value = textSearch;
    loading.value = true;

    if (listData.value?.length) {
      catchErrorFinally(
        async () => {
          const result = await apiURL(objectIndex, objectSize, textSearch, newObj);
          if (result.status == 200) {
            if (result.data && result.data.code == 0) {
              listData.value = result.data?.data?.body;
              rowTotal.value = result.data?.data?.pagination?.rows;
              headers.value = result.data?.data?.head;
            } else {
              listData.value = [];
              rowTotal.value = 0;
              headers.value = [];
            }
          } else if (result.status == 204) {
            listData.value = [];
            rowTotal.value = 0;
            headers.value = [];
          }
        },
        () => (loading.value = false),
      );
    } else {
      catchError(async () => {
        const result = await apiURL(objectIndex, objectSize, textSearch, newObj);
        if (result.status == 200) {
          if (result.data && result.data.code == 0) {
              listData.value = result.data?.data?.body;
              rowTotal.value = result.data?.data?.pagination?.rows;
              headers.value = result.data?.data?.head;
            } else {
              listData.value = [];
              rowTotal.value = 0;
              headers.value = [];
            }
        } else if (result.status == 204) {
          listData.value = [];
          rowTotal.value = 0;
          headers.value = [];
        }
        loading.value = false;
      });
    }
  };

  const changeIndex = (funcGetList, newIndex, newPageSize, newQuery = {}, routerPush = true) => {
    newQuery = { ...route.query, ...newQuery };
    newQuery.pageIndex = newIndex;
    newQuery.pageSize = newPageSize ? newPageSize : pageSize.value;

    for (const i in newQuery) {
      if (newQuery[i] === '') {
        delete newQuery[i];
      }
    }

    if (routerPush) {
      router.push({
        path: route.path,
        query: newQuery,
      });
    } else {
      router.replace({
        path: route.path,
        query: newQuery,
      });
    }

    funcGetList();
  };

  return { listData, rowTotal, pageIndex, pageSize, loading, getListData, changeIndex, filterData, filterSearchData, search, headers };
}
