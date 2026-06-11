import { axiosAuth } from '../helper/axiosConfig';
import { paginateObj } from '../helper/utils';

export function getCountLeads(data) {
  // // console.log('AXIOS PARAMS:', data);
  return axiosAuth.get('a/query/totalNewLead', { params: data });
}

export function getCountContacts(data) {
  // // console.log('AXIOS PARAMS:', data);
  return axiosAuth.get('a/query/totalContact', { params: data });
}

export function getCountTask(data) {
  // // console.log('AXIOS PARAMS:', data);
  return axiosAuth.get('a/query/totalTask', { params: data });
}

export function getCountFollowUp(data) {
  return axiosAuth.get('a/query/totalFollowUp', { params: data });
}
export function getDataSales(data) {
  return axiosAuth.get('a/query/salesName', { params: data });
}

export function topLeadsCount(data) {
  return axiosAuth.get('a/query/TopLeadsCount', { params: data });
}

export function getDataSalesForSuperior(data) {
  // // console.log('AXIOS PARAMS:', data);
  return axiosAuth.get('a/query/getDataSalesForSuperior', { params: data });
}

export function getDataSalesForFilter(data) {
  // // console.log('AXIOS PARAMS:', data);
  return axiosAuth.get('a/query/dataSalesForFilter', { params: data });
}

export function getDatatargetSales(data) {
  // // console.log('AXIOS PARAMS:', data);
  return axiosAuth.get('a/query/getTarget', { params: data });
}

export function getDataOmset(data) {
  return axiosAuth.get('a/query/getDataOmset', { params: data });
}
export function getDataOmsetForSuperior(data) {
  return axiosAuth.get('a/query/omsetForSuperior', { params: data });
}
export function getDataOmsetV2(data) {
  return axiosAuth.get('a/query/dataOmsetV2', { params: data });
}
export function getTargetOmsetV2(data) {
  return axiosAuth.get('a/query/dataTargetOmsetV2', { params: data });
}

export function getTargetSalesPercentage(data) {
  return axiosAuth.get('a/getTargetSalesPercentage', { params: data });
}

export function getTargetSalesPercentageTop (data) {
  return axiosAuth.get('a/getTargetSalesPercentageTop', { params: data });
}

export function getTargetOmzetPercentage(data) {
  return axiosAuth.get('a/getTargetOmzetPercentage', { params: data });
}

export function getTargetOmzetPercentageTop(data) {
    return axiosAuth.get('a/getTargetOmzetPercentageTop', { params: data });
}

export function getIncentiveSales(data) {
  return axiosAuth.get('a/query/insentifDashboard', { params: data });
}

export function insentifTopDashBoard(data) {
  return axiosAuth.get('a/query/insentifTopDashBoard', { params: data });
}

export function getDataInsentifTrucking(data) {
  return axiosAuth.get('a/query/insentifTruckingDashboard', { params: data });
}
export function bonusAkusisiAgenTop(data) {
  return axiosAuth.get('a/query/bonusAkusisiAgentop', { params: data });
}

export function getNotifTask(data) {
  return axiosAuth.get('a/query/notifTask', { params: data });
}

export function salesCount(data) {
  return axiosAuth.get('a/query/salesCount', { params: data });
}

export function totalFollowUpTop(data) {
  return axiosAuth.get('a/query/totalFollowUpTop', { params: data });
}
export function getPerformanceCorpTim(data) {
  return axiosAuth.get('a/getPerformanceCorpTim', { params: data });
}
export function getPerformanceCorpTimClos(data) {
  return axiosAuth.get('a/getPerformanceCorpTimClos', { params: data });
}

export default {
  getCountLeads,
  getCountContacts,
  getCountTask,
  getCountFollowUp,
  getDataSales,
  getDataSalesForFilter,
  getDataSalesForSuperior,
  getDatatargetSales,
  getDataOmset,
  getDataOmsetForSuperior,
  getDataOmsetV2,
  getTargetOmsetV2,
  getTargetSalesPercentage,
  getTargetSalesPercentageTop,
  getTargetOmzetPercentage,
  getTargetOmzetPercentageTop,
  getIncentiveSales,
  getDataInsentifTrucking,
  getNotifTask,
  bonusAkusisiAgenTop,
  salesCount,
  insentifTopDashBoard,
  topLeadsCount,
  totalFollowUpTop,
  getPerformanceCorpTim,
  getPerformanceCorpTimClos
};
