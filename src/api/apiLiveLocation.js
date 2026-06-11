import { axiosAuth } from "../helper/axiosConfig";
import { paginateObj } from '../helper/utils';

export function apiLiveLocationInsertUpdate(data) {
    return axiosAuth.post('a/liveLocationInsertUpdate', data)
}

export function apiGetLiveLocationForPagination(pageIndex, pageSize, textSearch, newObj = {}) {
  let _offset = pageIndex -1;
  let offset = 0;
  if(pageIndex > 1) offset = _offset * 10

  return axiosAuth.get('a/query/getLiveLocationForPagination', { params: paginateObj(offset, pageSize || 10, textSearch, newObj) });
}

export function apiGetLiveLocationDetail(data) {
  return axiosAuth.get('a/liveLocationDetail', { params: data });
}

export function apiGetLiveLocationState() {
  return axiosAuth.get('a/liveLocationState');
}

export function apiGetLiveLocationOverviewById(data) {
  return axiosAuth.get('a/query/getLiveLocationDetailSummary', { params: data });
}

export default {
    apiLiveLocationInsertUpdate,
    apiGetLiveLocationForPagination,
    apiGetLiveLocationDetail,
    apiGetLiveLocationState,
    apiGetLiveLocationOverviewById
}