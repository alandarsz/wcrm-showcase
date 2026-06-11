import { axiosAuth, axiosAuthLong } from '../helper/axiosConfig';
import { paginateObj } from '../helper/utils';

export function apiBranchPagination(pageIndex = 1, pageSize = 10, textSearch, filterData) {
    return axiosAuth.post('company-branch-pagination', paginateObj(pageIndex, pageSize, textSearch, filterData));
}

/* export function uploadExcel(excelFile, id) {
  const formData = new FormData();
  formData.append('file', excelFile, excelFile.name);
  return axiosAuth.post(`opname/import-item/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
} */

export function apiBranchBatchInsert(excelFile) {
    const formData = new FormData();
    formData.append('file', excelFile, excelFile.name);
    return axiosAuth.post('company-branch-batch', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
}

export function apiBranchInsert(data) {
    return axiosAuth.post('company-branch', data)
}

export function apiBranchUpdate(data) {
    return axiosAuth.patch('company-branch', data)
}

export function apiBranchDelete(data) {
    return axiosAuth.patch(`company-branch/${data}`)
}

export function apiCompanySelect(data) {
    return axiosAuth.post('company-select', data)
}

export function apiCompanyBranchSelect(data) {
    return axiosAuth.post('company-branch-select', data)
}

export default {
    apiBranchPagination,
    apiBranchInsert,
    apiBranchUpdate,
    apiBranchDelete,
    apiBranchBatchInsert,
    apiCompanySelect,
    apiCompanyBranchSelect
}