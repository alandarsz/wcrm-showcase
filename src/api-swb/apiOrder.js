import { axiosAuth } from "../helper/axiosConfig";
import { paginateObj } from "../helper/utils";

export function orderPagination(dOffset, dLimit, dSearch, dFilter) {
    return axiosAuth.get(`a/query/Q_ALC_REPORT_02`, { params: paginateObj(dOffset, dLimit, dSearch, dFilter) });
    
}

export default {
    orderPagination
}