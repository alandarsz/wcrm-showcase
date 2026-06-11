import { ref } from 'vue';
import { catchErrorLog } from '../helper/catchResp';
import apiContact from '../api/apiContact';
import apiDeals from '../api/apiDeals';
import apiCount from '../api/apiCount';
import apiHelper from '../api/apiHelper';

let queryNotDataLength = 0;

export const leads = ref([]);
export const leadsLoading = ref(false);
export const sales = ref([]);
export const salesLoading = ref(false);
export const top = ref([])
export const topLoading = ref(false);

export const queryLeads = async (query, limit = 10) => {
  const userId = localStorage.getItem('id');
  leadsLoading.value = true;
  if ((leads.value.length == 0 && query.length <= queryNotDataLength) || leads.value.length != 0 || queryNotDataLength == 0) {
    catchErrorLog(async () => {
      let payload = { TEXT_SEARCH: query, USER_ID: userId, 'd-offset': 0, 'd-limit': limit };
      const keys = Object.keys(payload);
      for (const key of keys) if (!payload[key]) delete payload[key];
      const { status, data } = await apiContact.apiGetLeadsBySearch(payload);
      if ((status == 200 || status == 204) && data.code === 0) {
        const result = [];
        if (data.data.body?.length) {
          data.data.body.forEach((element) => {
            result.push({
              label: element.LEADS_CUSTOMER_NAME,
              value: element.LEADS_ID,
            });
          });
        } else {
          queryNotDataLength = query.length;
        }
        leads.value = result;
        leadsLoading.value = false;
      }
    });
  }
};

export const queryFollowUp = async (query, limit = 10) => {
  leadsLoading.value = true;

  catchErrorLog(async () => {
    const userId = localStorage.getItem('id');

    let payload = { TEXT_SEARCH: query, USER_ID: userId, 'd-offset': 0, 'd-limit': limit };

    Object.keys(payload).forEach((key) => payload[key] === null && delete payload[key]);

    const { status, data } = await apiDeals.getDataLeadsForFollowUp(
      payload,
    );

    if ((status === 200 || status === 204) && data.code === 0) {
      leads.value = (data.data.body || []).map((row) => ({
        label: row.LEADS_CUSTOMER_NAME,
        value: row.LEADS_ID,
        raw: row,
      }));
    } else {
      leads.value = [];
    }

    leadsLoading.value = false;
  });
};

export const queryTop = async (query, limit = 10) => {
  topLoading.value = true;

  catchErrorLog(async () => {
    const userId = localStorage.getItem('id');

    let payload = { TEXT_SEARCH: query, USER_ID: userId, 'd-offset': 0, 'd-limit': limit };

    Object.keys(payload).forEach((key) => payload[key] === null && delete payload[key]);

    const { status, data } = await apiDeals.getDataTopForFollowUp(
      payload,
    );

    if ((status === 200 || status === 204) && data.code === 0) {
      top.value = (data.data.body || []).map((row) => ({
        label: row.nama_toko,
        value: row.id,
        raw: row,
      }));
    } else {
      top.value = [];
    }

    topLoading.value = false;
  });
};

export const querySales = async (query, limit = 10) => {
  salesLoading.value = true;

  catchErrorLog(async () => {
    const userId = localStorage.getItem('id');
    let payload = {TEXT_SEARCH : query, user_id: userId, 'd-offset': 0, 'd-limit': limit };

    Object.keys(payload).forEach((key) => payload[key] === null && delete payload[key]);

    const { status, data } = await apiCount.getDataSalesForFilter(
      payload, // ← WAJIB DI SINI
    );

    if ((status === 200 || status === 204) && data.code === 0) {
      sales.value = (data.data.body || []).map((row) => ({
        label: row.NAMA_USER,
        value: row.ID_USER,
        raw: row,
      }));
    } else {
      sales.value = [];
    }

    salesLoading.value = false;
  });
};

export const province = ref([]);
export const provinceLoading = ref(false);

export const queryProvince = async (query, limit = 10) => {
  provinceLoading.value = true;
  if ((province.value.length == 0 && query.length <= queryNotDataLength) || province.value.length != 0 || queryNotDataLength == 0) {
    catchErrorLog(async () => {
      let payload = { TEXT_SEARCH: query, 'd-offset': 0, 'd-limit': limit };
      const keys = Object.keys(payload);
      for (const key of keys) if (!payload[key]) delete payload[key];
      const { status, data } = await apiHelper.apiProvince(payload);
      if ((status == 200 || status == 204) && data.code === 0) {
        const result = [];
        if (data.data.body?.length) {
          data.data.body.forEach((element) => {
            result.push(element);
          });
        } else {
          queryNotDataLength = query.length;
        }
        province.value = result;
        provinceLoading.value = false;
      }
    });
  }
};

export const city = ref([]);
export const cityLoading = ref(false);

export const queryCity = async (query, provinceId, limit = 10) => {
  cityLoading.value = true;
  if ((city.value.length == 0 && query.length <= queryNotDataLength) || city.value.length != 0 || queryNotDataLength == 0) {
    catchErrorLog(async () => {
      let payload = { TEXT_SEARCH: query, PROVINCE_ID: provinceId, 'd-offset': 0, 'd-limit': limit };
      const keys = Object.keys(payload);
      for (const key of keys) if (!payload[key]) delete payload[key];
      const { status, data } = await apiHelper.apiCity(payload);
      if ((status == 200 || status == 204) && data.code === 0) {
        const result = [];
        if (data.data.body?.length) {
          data.data.body.forEach((element) => {
            result.push(element);
          });
        } else {
          queryNotDataLength = query.length;
        }
        city.value = result;
        cityLoading.value = false;
      }
    });
  }
};

export const districtList = ref([]);
export const districtListLoading = ref(false);

export const queryDistrictList = async (query, provinceId, cityId, limit = 10) => {
  districtListLoading.value = true;
  if ((districtList.value.length == 0 && query.length <= queryNotDataLength) || districtList.value.length != 0 || queryNotDataLength == 0) {
    catchErrorLog(async () => {
      let payload = { TEXT_SEARCH: query, PROVINCE_ID: provinceId, CITY_ID: cityId, 'd-offset': 0, 'd-limit': limit };
      const keys = Object.keys(payload);
      for (const key of keys) if (!payload[key]) delete payload[key];
      const { status, data } = await apiHelper.apiDistrict(payload);
      if ((status == 200 || status == 204) && data.code === 0) {
        const result = [];
        if (data.data.body?.length) {
          data.data.body.forEach((element) => {
            result.push(element);
          });
        } else {
          queryNotDataLength = query.length;
        }
        districtList.value = result;
        districtListLoading.value = false;
      }
    });
  }
};

export const subDistrictList = ref([]);
export const subDistrictListLoading = ref(false);

export const querySubDistrictList = async (query, districtId ,limit = 10) => {
  console.log(query , districtId);
  
  subDistrictListLoading.value = true;
  if ((subDistrictList.value.length == 0 && query.length <= queryNotDataLength) || subDistrictList.value.length != 0 || queryNotDataLength == 0) {
    catchErrorLog(async () => {
      let payload = { search: query, district :districtId,  'd-offset': 0, 'd-limit': limit };
      const keys = Object.keys(payload);
      for (const key of keys) if (!payload[key]) delete payload[key];
      const { status, data } = await apiHelper.apiSubDistrict(payload);
      if ((status == 200 || status == 204) && data.code === 0) {
        const result = [];
        if (data.data.body?.length > 0) {
          data.data.body.forEach((element) => {
            result.push(element);
          });
        } else {
          queryNotDataLength = query.length;
        }
        subDistrictList.value = result;
        subDistrictListLoading.value = false;
      }
    });
  }
};

export const inferiorList = ref([]);
export const inferiorListLoading = ref(false);

export const queryInferiorList = async (query, userId, group_id, role ,searchById = false, limit = 10) => {
  inferiorListLoading.value = true;
  if ((inferiorList.value.length == 0 && query.length <= queryNotDataLength) || inferiorList.value.length != 0 || queryNotDataLength == 0) {
    catchErrorLog(async () => {
      let payload = { TEXT_SEARCH: query, USER_ID: userId, GROUP_ID: group_id, ROLE: role, 'd-offset': 0, 'd-limit': limit };
      if(searchById) {
        payload.INFERIOR_ID = query
        delete payload.TEXT_SEARCH
      }
      const keys = Object.keys(payload);
      for (const key of keys) if (!payload[key]) delete payload[key];
      const { status, data } = await apiHelper.apiInferiorSelect(payload);
      if ((status == 200 || status == 204) && data.code === 0) {
        const result = [];
        if (data.data.body?.length) {
         
          data.data.body.forEach((element) => {
            element.label = `${element.NIK || ''} : ${element.label}`
            result.push(element); // already include label and value
          });
        } else {
          queryNotDataLength = query.length;
        }
        inferiorList.value = result;
        inferiorListLoading.value = false;
      }
    });
  }
};

export const autoCompleteInit = async () => {
  inferiorList.value = [];
  leads.value = [];
  province.value = [];
  districtList.value = [];
  city.value = [];
};
