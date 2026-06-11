import {axiosAuth} from "../helper/axiosConfig";
import {paginateObj} from "../helper/utils";

export function apiTaskInsert(data) {
    return axiosAuth.post('a/TaskInsert', data)
}

export function getDataTask(dOffset, dLimit, dSearch, dFilter, newObj = {}) {
    let _offset = dOffset -1;
    let offset = 0;
    if(dOffset > 1) offset = _offset * 10
    return axiosAuth.get('a/query/getDataTask',  { params: paginateObj(offset, dLimit, dSearch, dFilter,newObj) })
}
export function apiTaskCompleted(data) {
    return axiosAuth.post('a/taskUpdateStatusComplete/'+data.id, data);
  }

  export function apiTaskDelayed(data) {
    // // console.log('PAYLOAD API:', data);
    return axiosAuth.post('a/taskUpdateStatusDelayed/'+data.id , data);
  }
  export function apiTaskDelete({ ID_TASK }) {
    return axiosAuth.post(`a/deleteTask/${ID_TASK}`);
  }

  export function apiTaskEdit(idt,data) {
    // // console.log('PAYLOAD API EDIT:', data);
    
    return axiosAuth.post(`a/taskUpdate/${idt}`, data)
  } 
  
  export function apiGetTaskStage(){
    return axiosAuth.get('a/query/getTaskStage')
  }

  


export default {
    apiTaskInsert,
    getDataTask,
    apiTaskCompleted,
    apiTaskDelayed,
    apiTaskDelete,
    apiTaskEdit,
    apiGetTaskStage,
}