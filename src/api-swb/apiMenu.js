import { axiosAuth } from "../helper/axiosConfig";

export function apiMenu(accountId) {
    return axiosAuth.get('a/menu/'+accountId);
}

export function apiGetAccessMenuCountByCodeJBWcrm(data) {
    return axiosAuth.get('a/query/getAccessMenuCountByCodeJBWcrm', {params: data});
}

export default {
    apiMenu,
    apiGetAccessMenuCountByCodeJBWcrm
}