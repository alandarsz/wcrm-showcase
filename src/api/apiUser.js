import { axiosAuth } from '../helper/axiosConfig'
import { paginateObj } from '../helper/utils'

// this is example request query object for getInfoNik
// params = {
//         nik: this.picNik
//       }
export function getInfoNik(data) {
    return axiosAuth.get('a/query/drpGetInfoNIK', { params: data });
}
// this is example request query object for pagination or sasLsTem
// params: {
//           ownerId: this.userRole.ownerId,
//           code: this.code,
//           name: this.name,
//           email: this.email,
//           nik: this.nik,
//           'd-limit': this.pageLimit,
//           'd-offset': (this.pageCurrent - 1) * this.pageLimit
//         }

// the function that we call paginateObj will return the query object above.
export function paginationUser(pageIndex, pageSize, textSearch, newObj = {}) {
    let _offset = pageIndex -1;
    let offset = 0;
    if(pageIndex > 1) offset = _offset * 10
    return axiosAuth.get('a/query/userWcrm', { params: paginateObj(offset, pageSize || 10, textSearch, newObj) });
}
// this is example request query object
// data: {
//           ownerId: this.userRole.ownerCode,
//           accountId: this.$route.params.id
//         }
export function userDetail(data) {
    return axiosAuth.get('a/query/drpGetInfoNIK', { params: data });
}

// this is example request body object for insert
// data = {
//         geolocation: {
//           latitude: this.location.coords.latitude,
//           longitude: this.location.coords.longitude
//         },
//         name: this.picName,
//         nik: this.picNik,
//         role: this.role,
//         hubs: this.teamHub,
//         pos: this.picPos,
//         email: this.picEmail,
//         phone: this.picPhone,
//         vehicleType: this.picVehicleType,
//         vehicleNo: this.picVehicleNo
//       }
export function insertUser(data) {
    return axiosAuth.post('a/3pl/reg/tem', data);
}

// this is example request body object for edit
// data = {
//         id: this.id,
//         geolocation: {
//           latitude: this.location.coords.latitude,
//           longitude: this.location.coords.longitude
//         },
//         name: this.picName,
//         nik: this.picNik,
//         role: this.role,
//         hubs: this.teamHub,
//         pos: this.picPos,
//         email: this.picEmail,
//         phone: this.picPhone,
//         vehicleType: this.picVehicleType,
//         vehicleNo: this.picVehicleNo
//       }
export function editUser(ids, data) {
    // // console.log(ids, '======',  data);
    
    return axiosAuth.put(`a/3pl/reg/tem/${ids}`, data);
}


/**
 * 
 * if you have made a request to the api, please do not forget to add the method name to the object below
 and please add this several endpoint too, below.

 GET query/drpGetLogisticRole query params = {
        login: (use userId/userCode/accountCode from store/state management)
      }

 GET /query/sasLsRole query params = {}

 */
/**
 * GET /query/sasLsRole query params = {}
 */
export function getListRole() {
    return axiosAuth.get('a/query/sasLsRole', { params: {} });
}


export function accountPartners() {
    return axiosAuth.get('a/account/partners ', { params: {} });
}

export function verifyAccountPartners(data) {
    return axiosAuth.post('a/account/verify ', data);
}

export function accountActivate(data) {
    return axiosAuth.post('a/account/activate ', data);
}

export function resetPassword(data) {
    return axiosAuth.post('a/password/reset', data);
}

export function changePassword(data) {
    return axiosAuth.post('a/password/change', data);
}

export function getSalesGroup() {
    return axiosAuth.get('a/query/getSalesGroup')
}

export function getHub() {
    return axiosAuth.get('a/query/getHub')
}


export default {
    getInfoNik,
    paginationUser,
    insertUser,
    editUser,
    getListRole,
    accountPartners,
    verifyAccountPartners,
    resetPassword,
    changePassword,
    getSalesGroup,
    getHub,
    accountActivate
}