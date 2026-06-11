import {axiosAuth   } from "../helper/axiosConfig";

export function apiProvince(data) {
    return axiosAuth.get('a/query/getProvinceBySearch', {params: data});
}

export function apiCity(data) {
    return axiosAuth.get('a/query/getCityBySearch', {params: data});
}

export function apiDistrict(data) {
    return axiosAuth.get('a/query/getDistrictBySearch', {params: data});
}

export function apiInferiorSelect(data) {
    return axiosAuth.get('a/query/getInferiorUserBySearch', {params: data});
}

export function apiSubDistrict(data) {
    return axiosAuth.get('a/query/getSubDisrict', {params: data})
}

export default {
    apiProvince,
    apiCity,
    apiDistrict,
    apiInferiorSelect,
    apiSubDistrict
}