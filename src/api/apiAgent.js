import { axiosAuth } from '../helper/axiosConfig';
import { paginateObj } from '../helper/utils';

export function apiInsertAgent(data) {
  return axiosAuth.post('a/insertAgent', data);
}

export function getAgentCandidatesPagination(dOffset, dLimit, dSearch, dFilter, newObj = {}) {
  let _offset = dOffset - 1;
  let offset = 0;
  if (dOffset > 1) offset = _offset * 25;

  return axiosAuth.get('a/query/getAgentCandidatesPagination', { params: paginateObj(offset, dLimit, dSearch, dFilter, newObj) });
}

export default {
  apiInsertAgent,
  getAgentCandidatesPagination
}