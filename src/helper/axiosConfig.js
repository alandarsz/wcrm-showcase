import axios from 'axios';

// DEMO MODE: all requests are intercepted by mockHandler.js
const url = 'https://api-dummy.wahana-crm-showcase.app/';

export const axiosFree = axios.create({
  baseURL: url,
  timeout: 60000,
})

axiosFree.defaults.headers.common['Content-Type'] = 'application/json';

export const axiosAuth = axios.create({
  baseURL: url,
  timeout: 60000,
});

axiosAuth.defaults.headers.common['Content-Type'] = 'application/json';

export const axiosAuthLong = axios.create({
  baseURL: url,
  timeout: 600000,
  //   withCredentials: true,
});
axiosAuthLong.defaults.headers.common['Content-Type'] = 'application/json';


export default { axiosFree, axiosAuth, axiosAuthLong };
