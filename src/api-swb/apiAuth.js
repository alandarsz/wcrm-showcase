import { axiosFree, axiosAuth } from '../helper/axiosConfig';

export async function postAuthLogin(userData) {
  return await axiosFree.post('a/auth', userData);
}
export function checkStatusUserSWB(userCode) {
  return axiosAuth.get(`a/query/checkStatusUserSWB`, {
    params: {
      user: userCode,
    },
  });
}

export function drpChekLogisticRole(userCode) {
  return axiosAuth.get(`a/query/drpGetLogisticRole`, {
    params: {
      login: userCode,
    },
  });
}

export function getJabatan(accId) {
  return axiosAuth.get(`a/query/getJabatan`, {
    params: {
      id: accId,
    },
  });
}

export default {
  postAuthLogin,
  checkStatusUserSWB,
  drpChekLogisticRole,
  getJabatan
};
