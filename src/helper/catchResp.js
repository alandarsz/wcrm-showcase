import { messageInfo, loading } from './utils';
import Cookies from 'js-cookie';

const errorMessage = (error) => {
  if (error.response && error.response.data && error.response.data.message) {
    if (error.response.data.message.includes('error value on body')) {
      return import.meta.env.PROD
        ? `${error.response.data.error.details[0].message}`
        : `Error code ${error.response.status} : ${error.response.data.error.details[0].message}`;
    }
    if (error.response.status === 401) {
      return import.meta.env.PROD ? `Anda tidak memiliki akses melakukan ini!` : `Error code ${error.response.status} : ${error.response.data.message}`;
    }
    if (error.response.status === 403) {
      loading()
      Cookies.remove('ACCESS');
      localStorage.clear();
      setTimeout(()=>window.location.href = '/login',3000);
    }
    return import.meta.env.PROD ? `${error.response.data.message}` : `Error code ${error.response.status} : ${error.response.data.message}`;
  }

  return error;
};

export const catchError = (fn) => {
  const load = loading();
  fn()
    .catch((error) => {
      console.error(error);
      
      messageInfo(errorMessage(error));
    })
    .finally(() => {
      load.close();
    });
};

export const catchErrorLog = (fn) =>
  fn().catch((error) => {
    // console.log(error);
  });

export const catchErrorF2 = (fn1, fn2) => {
  return fn1().catch((error) => {
    messageInfo(error);
    fn2();
  });
};

export const catchErrorF3 = (fn0, fn1, fn2) => {
  fn0();
  return fn1().catch((error) => {
    messageInfo(error);
    fn2();
  });
};

export const catchErrorPromise = (fn) => {
  return new Promise((resolve) => {
    resolve(fn());
  }).catch((error) => {
    messageInfo(error);
  });
};

export const catchErrorPromiseF2 = (fn1, fn2) => {
  return new Promise((resolve) => {
    resolve(fn1());
  }).catch((error) => {
    messageInfo(error);
    fn2();
  });
};

export const catchErrorFinally = (fn1, fnFinally) => {
  fn1()
    .catch((error) => {
      messageInfo(errorMessage(error));
    })
    .finally(() => {
      fnFinally();
    });
};
