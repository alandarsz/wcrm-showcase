import { axiosAuth } from '../helper/axiosConfig';
import { paginateObj } from '../helper/utils';

export function apiDealsLeadsInsert(data) {
  return axiosAuth.post('a/insertLeads', data);
}

export function apiDealsfollowUpInsert(data) {
  return axiosAuth.post('a/followUpInsert', data);
}

export function inputFollowUpTOP(data) {
  return axiosAuth.post('a/TopFollowUpInsert', data)
}

export function apiDealsClosingInsert(data) {
  return axiosAuth.post('a/closingInsert', data);
}

export function apiDealsHargaPublishInsert(data) {
  return axiosAuth.post('a/PublishPrice', data);
}

export function apiDealsPks(data) {
  return axiosAuth.post('a/inputPks',data);
}

export function apiDealsTOP(data) {
  return axiosAuth.post('a/TopLeadInsert', data)
}

export function getAllLeads(dOffset, dLimit, dSearch, dFilter, newObj = {}) {
  // // console.log(dOffset, dLimit, dSearch, dFilter);
  let _offset = dOffset - 1;
  let offset = 0;
  if (dOffset > 1) offset = _offset * 25;

  return axiosAuth.get('a/query/getAllLeads', { params: paginateObj(offset, dLimit, dSearch, dFilter, newObj) });
}


export function getDataTop(dOffset, dLimit, dSearch, dFilter, newObj = {}) {
  // // console.log(dOffset, dLimit, dSearch, dFilter);
  let _offset = dOffset - 1;
  let offset = 0;
  if (dOffset > 1) offset = _offset * 25;

  return axiosAuth.get('a/query/getDataTop', { params: paginateObj(offset, dLimit, dSearch, dFilter, newObj) });
}

export function getDataFollowUp(dOffset, dLimit, dSearch, dFilter, newObj = {}) {
  // // console.log(dOffset, dLimit, dSearch, dFilter);
  let offset = dOffset - 1;
  if (dOffset > 1) offset += 24;
  return axiosAuth.get('a/query/getDataFollowUp', { params: paginateObj(offset, dLimit, dSearch, dFilter, newObj) });
}

export function getDataFollowUpTOP(dOffset, dLimit, dSearch, dFilter, newObj = {}) {
  // // console.log(dOffset, dLimit, dSearch, dFilter);
  let offset = dOffset - 1;
  if (dOffset > 1) offset += 24;
  return axiosAuth.get('a/query/followUpTOP', { params: paginateObj(offset, dLimit, dSearch, dFilter, newObj) });
}

export function getDataLeadsForFollowUp(data) {
  return axiosAuth.get('a/query/getLeadsForFollowUp', { params: data });
}

export function getDataTopForFollowUp(data) {
  return axiosAuth.get('a/query/dataTopForFollowUp', {params : data})
}

export function getDataPks(data) {
  return axiosAuth.get('a/query/getPKS', { params: data })
}

export function getDataPksArmada(data) {
  return axiosAuth.get('a/query/getPksArmada', { params: data })
}

export function apiDealsLeadsUpdate(ids, data) {
  // return // console.log(data + " test " + ids)
  return axiosAuth.post(`a/updateLead/${ids}`, data);
}
// export function apiLeadDelete(data) {
//     return axiosAuth.post('a/contactDelete', data);
// }

export function apiDealsUpdatePublishPrice(ids,data) {
  // console.log(data + " test " + ids);
  
  return axiosAuth.post(`a/updatePublishPrice/${ids}`, data);
}

export function getDataFollowUpById(data) {
  return axiosAuth.get('a/query/getDataFollowUpById', { params: data });
}

export function apiDealsUpdatePks(ids,data) {
  // console.log(data + " test " + ids);
  
  return axiosAuth.post(`a/updatePks/${ids}`, data);
}
export function getHargaPublish(data) {
  return axiosAuth.get('a/query/getHargaPublish', { params: data });
}

export function apiLeadDelete({ ID_LEAD }) {
  return axiosAuth.post(`a/deleteLead/${ID_LEAD}`);
}

export function apiGetSalesStageFollowUp() {
  return axiosAuth.get('a/query/getSalesStageFollowUp');
}

export function apiGetJenisIndustri() {
  return axiosAuth.get('a/query/getJenisIndustri');
}

export function apiGetEstimasiOmset() {
  return axiosAuth.get('a/query/getEstimasiOmset');
}

export function apiGetJangkaWaktu() {
  return axiosAuth.get('a/query/getJangkaWaktu');
}

export function apiGetMetodePembayaran() {
  return axiosAuth.get('a/query/getMetodePembayaran');
}

export function apiGetSuratJalan() {
  return axiosAuth.get('a/query/getSuratJalan');
}

export function apiGetJenisFollowUp() {
  return axiosAuth.get('a/query/getJenisFollowUp');
}

export function apiGetCategory() {
  return axiosAuth.get('a/query/getCategoryProduct');
}

export default {
  apiDealsLeadsInsert,
  apiDealsfollowUpInsert,
  getAllLeads,
  getDataFollowUp,
  getDataLeadsForFollowUp,
  apiDealsLeadsUpdate,
  apiLeadDelete,
  apiGetSalesStageFollowUp,
  apiGetJenisIndustri,
  apiGetEstimasiOmset,
  apiGetJangkaWaktu,
  apiGetMetodePembayaran,
  apiGetSuratJalan,
  apiGetJenisFollowUp,
  apiDealsClosingInsert,
  apiDealsHargaPublishInsert,
  getHargaPublish,
  apiDealsUpdatePublishPrice,
  apiDealsPks,
  getDataPks,
  apiDealsTOP,
  getDataTop,
  getDataTopForFollowUp,
  getDataFollowUpTOP,
  inputFollowUpTOP,
  getDataFollowUpById,
  apiDealsUpdatePks,
  getDataPksArmada,
  apiGetCategory
};
