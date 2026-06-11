export const mobileWahanaIframeHost = import.meta.env.MODE == 'production' ? import.meta.env.VITE_HOST_MOBILE_WAHANA_IFRAME_PROD : import.meta.env.VITE_HOST_MOBILE_WAHANA_IFRAME_DEV;

export default {
    mobileWahanaIframeHost
}