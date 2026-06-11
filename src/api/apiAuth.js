import { axiosAuth, axiosFree } from '../helper/axiosConfig';

export async function postAuthLogin(userData) {
  return await axiosFree.post('users/login', userData);
}

export async function postAuthRegister(userData) {
  return await axiosFree.post('users/register', userData);
}

export function changePassword(data) {
  return axiosAuth.post('user/change-password', data);
}

export default {
  postAuthLogin,
  postAuthRegister,
  changePassword,
};
