import { axiosAuth } from '../helper/axiosConfig';
import { paginateObj } from '../helper/utils';

export function apiGetLeadsBySearch(data) {
  return axiosAuth.get('a/query/getLeadsBySearch', {params: data});
}

export function apiContactPagination(pageIndex, pageSize, textSearch, newObj = {}) {
  let _offset = pageIndex -1;
  let offset = 0;
  if(pageIndex > 1) offset = _offset * 10

  return axiosAuth.get('a/query/getContactForPagination', { params: paginateObj(offset, pageSize || 10, textSearch, newObj) });
}

export function apiContactInsert(data) {
  return axiosAuth.post('a/contactInsert', data);
}

export function apiContactEdit(data) {
  return axiosAuth.post('a/contactEdit', data)
}

export function apiContactDelete(data) {
  return axiosAuth.post('a/contactDelete', data);
}

export function apiCompanyPagination(pageIndex, pageSize, textSearch, newObj = {}) {
  return {
    begin: '2025-12-12T13:34:13.777401+07:00',
    code: 0,
    data: {
      begin: '2025-12-12T13:34:13.777401+07:00',
      //   Nama depan, Nama Belakang, Jabatan, Owner, Email, Telepon, Status, Alamat, Negara, Provinsi, Kota, Kode pos, Source
      body: [
        {
          CONTACT_COMPANY_NAME: 'PT. MENCARI CINTA SEJATI',
          CONTACT_COMPANY_WEBSITE: 'https://mencaricintasejati.com',
          CONTACT_COMPANY_PHONE: '6289531311999',
          CONTACT_COMPANY_ADDRESS: 'Jl. Mencari Cintasejati No. 1, Jakarta Selatan',
          CONTACT_COMPANY_CITY: 'Jakarta',
          CONTACT_COMPANY_POSTAL_CODE: '12345',
          CONTACT_COMPANY_INDUSTRY: 'IT',
          CONTACT_COMPANY_TYPE: 'IT',
          CONTACT_COMPANY_SOURCE: 'Social Media',
          CONTACT_COMPANY_COMPETITOR: 'PT. MENCARI CINTA SEJATI',
          CONTACT_COMPANY_ESTIMATED_REVENUE: 'Rp. 1.000.000.000',
          CONTACT_COMPANY_NEED_ANALYSIS: 'PT. MENCARI CINTA SEJATI',
          CONTACT_COMPANY_NEED_TYPE: 'PT. MENCARI CINTA SEJATI',
          CONTACT_COMPANY_PERSON: 'PT. MENCARI CINTA SEJATI',
          CONTACT_COMPANY_POSITION: 'PT. MENCARI CINTA SEJATI',
        },
      ],
      cfn: {},
      duration: 31833,
      head: [
        'CONTACT_COMPANY_NAME',
        'CONTACT_COMPANY_WEBSITE',
        'CONTACT_COMPANY_PHONE',
        'CONTACT_COMPANY_ADDRESS',
        'CONTACT_COMPANY_CITY',
        'CONTACT_COMPANY_POSTAL_CODE',
        'CONTACT_COMPANY_INDUSTRY',
        'CONTACT_COMPANY_TYPE',
        'CONTACT_COMPANY_SOURCE',
        'CONTACT_COMPANY_COMPETITOR',
        'CONTACT_COMPANY_ESTIMATED_REVENUE',
        'CONTACT_COMPANY_NEED_ANALYSIS',
        'CONTACT_COMPANY_NEED_TYPE',
        'CONTACT_COMPANY_PERSON',
        'CONTACT_COMPANY_POSITION',
      ],
      pagination: {
        limit: '10',
        offset: '1',
        rows: '10',
      },
      paramHash: {
        ALC_AIRWAYBILL: null,
        ALC_SERVICE: null,
        DATE_END: '2025-12-12',
        DATE_START: '2025-01-01',
      },
      paramList: [null, null, null, '2025-01-01', '2025-12-12', '2025-01-01', '2025-12-12', null, null],
      rows: '10',
    },
    duration: 31833,
    message: 'Successful',
    status: 'success',
  };
}

export default {
  apiCompanyPagination,
  apiContactPagination,
  apiContactInsert,
  apiContactEdit,
  apiContactDelete,
  apiGetLeadsBySearch
};
