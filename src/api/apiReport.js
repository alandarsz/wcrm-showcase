import { axiosAuth } from '../helper/axiosConfig';
import { paginateObj } from '../helper/utils';

export function getDataInsentif(dOffset, dLimit, dSearch, dFilter, newObj = {}) {
  // // console.log(dOffset, dLimit, dSearch, dFilter);
  const offset = (dOffset - 1) * dLimit;
  return axiosAuth.get('a/query/reporInsentif', { params: paginateObj(offset, dLimit, dSearch, dFilter, newObj) });
}

export function getDataInsentifTrucking(dOffset, dLimit, dSearch, dFilter, newObj = {}) {
  // // console.log(dOffset, dLimit, dSearch, dFilter);
  const offset = (dOffset - 1) * dLimit;
  return axiosAuth.get('a/query/insentifTrucking', { params: paginateObj(offset, dLimit, dSearch, dFilter, newObj) });
}

export function getDataInsentifForReport(newObj = {}) {
  return axiosAuth.get('a/query/reporInsentif', { params: newObj });
}
export function getReportPermCorp(dOffset, dLimit, dSearch, dFilter, newObj = {}) {
  // // console.log(dOffset, dLimit, dSearch, dFilter);
  const offset = (dOffset - 1) * dLimit;
  return axiosAuth.get('a/reportPerformanceCorpTim', { params: paginateObj(offset, dLimit, dSearch, dFilter, newObj) });
}

export default {
  getDataInsentif,
  getDataInsentifTrucking,
  getDataInsentifForReport,
  getReportPermCorp,
};
